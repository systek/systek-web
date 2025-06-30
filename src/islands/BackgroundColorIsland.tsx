import { useEffect } from "react";
import chroma from "chroma-js";

// interpolates the background color based on scroll position
export default function BackgroundColorIsland() {
  useEffect(() => {
    function getAspectRatio() {
      // todo: consider getting breakpoints from DOM (slower, but more flexible):
      // const style = getComputedStyle(document.documentElement);
      // const lg = parseFloat(style.getPropertyValue("--breakpoint-lg")) * 16;
      // const md = ...
      const width = window.innerWidth;
      if (width >= 1680) return 21 / 10; // lg
      if (width >= 800) return 4 / 3; // md
      return 5 / 8; // sm
    }

    function onScroll() {
      const style = getComputedStyle(document.documentElement);
      const colorStart = style.getPropertyValue("--color-blue").trim();
      const colorEnd = style.getPropertyValue("--color-off-white").trim();
      // todo: easier to just get height directly from element? requires a ref
      const elementHeight = window.innerWidth / getAspectRatio();
      const scroll = Math.max(0, window.scrollY - elementHeight);
      const t = Math.max(0, Math.min(1, scroll / (window.innerHeight / 2)));
      const color = chroma.mix(colorStart, colorEnd, t).css();
      document.body.style.setProperty("--color-background", color);
    }

    onScroll();
    window.addEventListener("scroll", onScroll);
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      document.body.style.removeProperty("--color-background");
    };
  }, []);
  return null;
}
