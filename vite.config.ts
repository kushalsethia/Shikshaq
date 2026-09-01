import { defineConfig, loadEnv, type Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

/* `api/chat.ts` is a Vercel serverless function — Vercel serves it, but plain
   `vite dev` has no concept of the `api/` convention at all, so every request
   to it 404s locally. That's not a bug in the deployed site (Vercel wires it
   up), but it did mean the chat widget was silently, unfixably broken for
   anyone testing against `npm run dev` — confirmed live: POST /api/chat
   returned a bare 404. This loads the same handler through Vite's own SSR
   module loader (so it gets the exact same TS/ESM code Vercel would run, no
   separate build step) and calls it with a minimal Vercel-shaped
   req/res shim. Dev-only — `configureServer` never runs in a production
   build, and Vercel's own routing takes over completely once deployed. */
function vercelApiDevPlugin(): Plugin {
  return {
    name: "vercel-api-dev",
    configureServer(server) {
      server.middlewares.use("/api/chat", async (req, res) => {
        if (req.method !== "POST") {
          res.statusCode = 405;
          res.end(JSON.stringify({ error: "Method not allowed" }));
          return;
        }
        try {
          const chunks: Buffer[] = [];
          for await (const chunk of req) chunks.push(chunk as Buffer);
          const raw = Buffer.concat(chunks).toString("utf-8");
          const body = raw ? JSON.parse(raw) : {};

          const mod = await server.ssrLoadModule("/api/chat.ts");
          const handler = mod.default as (req: unknown, res: unknown) => Promise<void>;

          let statusCode = 200;
          const shimRes = {
            status(code: number) {
              statusCode = code;
              return shimRes;
            },
            json(payload: unknown) {
              res.statusCode = statusCode;
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify(payload));
            },
          };
          await handler({ method: req.method, body }, shimRes);
        } catch (err) {
          res.statusCode = 500;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify({ error: "Dev API proxy failed", message: (err as Error).message }));
        }
      });
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // GEMINI_API_KEY is deliberately unprefixed (server-only, never shipped to
  // the client) — Vite's own env loading only auto-exposes VITE_-prefixed
  // vars, so it has to be read from .env and assigned onto process.env by
  // hand for the dev proxy above to see it the same way Vercel's runtime
  // would. Build-time only; never bundled into client code.
  const env = loadEnv(mode, process.cwd(), "");
  if (env.GEMINI_API_KEY) process.env.GEMINI_API_KEY = env.GEMINI_API_KEY;

  return {
  server: {
    host: "::",
    // Defaults to 8080; PORT lets a second dev server run alongside the first.
    port: Number(process.env.PORT) || 8080,
  },
  plugins: [react(), vercelApiDevPlugin()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Optimize for mobile devices
    target: 'es2015', // Support older devices
    minify: 'esbuild', // Faster than terser
    cssMinify: true,
    rollupOptions: {
      output: {
        // Add hash to filenames for cache busting
        entryFileNames: `assets/[name]-[hash].js`,
        chunkFileNames: `assets/[name]-[hash].js`,
        assetFileNames: `assets/[name]-[hash].[ext]`,
        // Manual chunk splitting for better code splitting
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': [
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-select',
            '@radix-ui/react-toast',
          ],
          'supabase-vendor': ['@supabase/supabase-js'],
          // Split out libs that are pulled into the eager main bundle (used by
          // components imported directly in App.tsx / Index.tsx) so they cache
          // independently from app code and fetch in parallel over HTTP/2.
          'motion-vendor': ['framer-motion'],
          'dompurify-vendor': ['dompurify'],
          'search-vendor': ['fuse.js'],
        },
      },
    },
    // Optimize chunk size warnings
    chunkSizeWarningLimit: 1000,
  },
  };
});
