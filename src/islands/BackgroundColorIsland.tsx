import { useEffect } from "react";
import chroma from "chroma-js";

// interpolates the background color based on scroll position
export default function BackgroundColorIsland() {
  useEffect(() => {
    function onScroll() {
      const style = getComputedStyle(document.documentElement);
      const colorStart = style.getPropertyValue("--color-blue").trim();
      const colorEnd = style.getPropertyValue("--color-off-white").trim();
      const offset = Math.min(
        window.innerHeight / 4, // landscape
        window.innerWidth, // portrait
      );
      const scroll = Math.max(0, window.scrollY - offset);
      const t = Math.max(0, Math.min(1, scroll / (window.innerHeight / 2)));
      const color = chroma.mix(colorStart, colorEnd, t).css();
      document.body.style.setProperty("--color-background", color);
    }
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      document.body.style.removeProperty("--color-background");
    };
  }, []);
  return null;
}
