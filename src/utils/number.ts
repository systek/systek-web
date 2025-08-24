type Breakpoint = "sm" | "md" | "lg";

export function vw(rem: number, base = 105): string {
  return `${((rem / base) * 100).toFixed(4)}vw`;
}

export function baseWidth(breakpoint: Breakpoint): string {
  return `100vw - 2 * ${grid(breakpoint)}`;
}

export function grid(breakpoint: Breakpoint): string {
  const breakpoints = {
    sm: "1rem",
    md: "1.25rem",
    lg: vw(1.25),
  };

  return breakpoints[breakpoint];
}

export function gutter(breakpoint: Breakpoint): string {
  const breakpoints = {
    sm: "0.75em",
    md: "1.25rem",
    lg: vw(1.25),
  };

  return breakpoints[breakpoint];
}

export function oneHalf(breakpoint: Breakpoint, _width?: string): string {
  const width = _width || baseWidth(breakpoint);
  return `${width} * 0.5 - ${gutter(breakpoint)} / 2`;
}

export function threeFourth(breakpoint: Breakpoint, _width?: string): string {
  const width = _width || baseWidth(breakpoint);
  return `${width} * 0.75 - ${gutter(breakpoint)} / 4`;
}

export function oneFourth(breakpoint: Breakpoint, _width?: string): string {
  const width = _width || baseWidth(breakpoint);
  return `${width} * 0.25 - ${gutter(breakpoint)} / 1.333333333334`;
}
