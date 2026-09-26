import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

/* scripts/prerender.ts writes a crawlable copy of each route's content into a
   #prerender div beside #root, so the ~1,857 indexable URLs have real HTML
   before any JavaScript runs. It is removed here, synchronously and BEFORE the
   first render, so it never appears alongside the real UI -- removing it after
   render() would leave a window where both are in the document.
   Absent on a dev server and on any route that was not prerendered, hence the
   optional chaining rather than a non-null assertion. */
document.getElementById("prerender")?.remove();

createRoot(document.getElementById("root")!).render(<App />);
