const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

// 한 줄 문장 안의 **강조**와 `코드`만 HTML로 바꿉니다. (set:html 용)
export function inline(text: string): string {
  return escapeHtml(text)
    .replace(/\*\*(.+?)\*\*/g, '<b class="font-semibold text-accent">$1</b>')
    .replace(/`(.+?)`/g, '<code class="rounded bg-[#f1f3f6] px-1.5 py-0.5 font-mono text-[0.85em]">$1</code>');
}
