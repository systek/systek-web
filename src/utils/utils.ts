// Debounced resize handler that ignores height-only changes, like the mobile URL bar
export function onWidthChange(callback: () => void) {
  let width = window.innerWidth;
  let timeout: number;
  window.addEventListener("resize", () => {
    clearTimeout(timeout);
    timeout = window.setTimeout(() => {
      if (window.innerWidth === width) return;
      width = window.innerWidth;
      callback();
    }, 100);
  });
}
