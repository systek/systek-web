type Breakpoint = "sm" | "md" | "lg";

export function vw(rem: number, base = 105): string {
  return `${((rem / base) * 100).toFixed(4)}vw`;
}

export function grid(breakpoint: Breakpoint): string {
  return {
    sm: "1rem", // --spacing-grid-sm
    md: "1.25rem", // --spacing-grid-md
    lg: vw(1.25), // --spacing-grid-lg
  }[breakpoint];
}

export function gutter(breakpoint: Breakpoint): string {
  return {
    sm: "0.75em", // --spacing-gutter-sm
    md: "1.25rem", // --spacing-gutter-md
    lg: vw(1.25), // --spacing-gutter-lg
  }[breakpoint];
}

// 100%
export function fullWidth(breakpoint: Breakpoint): string {
  return `100vw - 2 * ${grid(breakpoint)}`;
}

// 75%
export function threeFourth(breakpoint: Breakpoint, _width?: string): string {
  const width = _width || fullWidth(breakpoint);
  return `${width} * 0.75 - ${gutter(breakpoint)} / 4`;
}

// 50%
export function oneHalf(breakpoint: Breakpoint, _width?: string): string {
  const width = _width || fullWidth(breakpoint);
  return `${width} * 0.5 - ${gutter(breakpoint)} / 2`;
}

// 25%
export function oneFourth(breakpoint: Breakpoint, _width?: string): string {
  const width = _width || fullWidth(breakpoint);
  return `${width} * 0.25 - ${gutter(breakpoint)} / 1.333333333334`;
}
