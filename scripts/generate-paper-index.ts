#!/usr/bin/env tsx
/**
 * PAPER INDEX GENERATOR
 *
 * Writes public/paper-index.json: one summary row per bank paper.
 *
 * Why this exists. The question bank is 2.5MB raw / ~559KB gzipped, because it
 * carries the verbatim text of all 6,912 questions. Every surface that only
 * needs to LIST papers — /past-papers, /past-papers/results, /schools and each
 * /school/:slug — was downloading all of that to read 193 rows of metadata off
 * the top of it. On a school page that is half a megabyte to render seven
 * links, and those school pages are in the sitemap, so a search visitor lands
 * on one cold and pays for it.
 *
 * The reader (/past-papers/:id) still loads the full bank, because it is the
 * one place that actually shows question text.
 *
 * Derived with papersOf() rather than reimplemented, and written in the exact
 * order papersOf returns, so loadPaperIndex() is a drop-in for
 * `papersOf(await loadBank())` at every call site.
 *
 * Run manually: npm run generate-paper-index  (also runs as part of prebuild)
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

import { papersOf } from '../src/lib/question-bank';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BANK_PATH = path.join(__dirname, '..', 'public', 'question-bank.json');
const OUTPUT_PATH = path.join(__dirname, '..', 'public', 'paper-index.json');

function main() {
  if (!fs.existsSync(BANK_PATH)) {
    console.error(`Question bank not found at ${BANK_PATH}`);
    process.exit(1);
  }

  const bank = JSON.parse(fs.readFileSync(BANK_PATH, 'utf-8'));
  const papers = papersOf(bank);

  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(papers), 'utf-8');

  const bankKB = fs.statSync(BANK_PATH).size / 1024;
  const indexKB = fs.statSync(OUTPUT_PATH).size / 1024;
  console.log(`Paper index: ${papers.length} papers from ${bank.length} questions`);
  console.log(`   bank:  ${bankKB.toFixed(0)} KB`);
  console.log(`   index: ${indexKB.toFixed(0)} KB  (${(100 - (indexKB / bankKB) * 100).toFixed(1)}% smaller)`);
  console.log(`   Output: ${OUTPUT_PATH}`);
}

main();
