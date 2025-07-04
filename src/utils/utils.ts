let lastWidth: number;

export const DOMLoaded = (callback: () => void) => {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", callback);
  } else {
    callback();
  }
};

export const debounce = (callback: (...args: any[]) => void, delay: number) => {
  let timeout: number;

  return (...args: any[]) => {
    clearTimeout(timeout);
    timeout = window.setTimeout(() => callback(...args), delay);
  };
};

export const handleResize = (callback: () => void) => {
  const debouncedCallback = debounce(callback, 250);
  window.addEventListener("resize", debouncedCallback);

  return () => {
    window.removeEventListener("resize", debouncedCallback);
  };
};

export const hasViewportWidthChanged = (): boolean => {
  if (typeof window !== "undefined") {
    const currentWidth = window.innerWidth;
    const widthChanged = currentWidth !== lastWidth;

    if (widthChanged) {
      lastWidth = currentWidth;
    }

    return widthChanged;
  }

  return false;
};

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
