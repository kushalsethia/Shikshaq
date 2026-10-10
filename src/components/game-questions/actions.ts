import { toast as sonnerToast } from 'sonner';

/* What /questions and the HOD page's Questions tab do besides drawing: saving or copying text, and the undo toast. */

export const plural = (n: number, one: string, many = `${one}s`) => `${n} ${n === 1 ? one : many}`;

/** Saves text as a file on the person's device. */
export function downloadText(name: string, text: string, mime: string) {
  const url = URL.createObjectURL(new Blob([text], { type: `${mime};charset=utf-8` }));
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 10_000);
}

/** Copies text, falling back to the old way where the clipboard API is blocked. True when it worked. */
export async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand('copy');
    ta.remove();
    return ok;
  }
}

/** "Undo" for a few seconds after an action, instead of asking "are you sure?". */
export function offerUndo(what: string, restore: () => void) {
  sonnerToast(`${what}.`, { duration: 7000, action: { label: 'Undo', onClick: restore } });
}
