import Konva from "konva";
import chroma from "chroma-js";

type Point = { x: number; y: number };
type Easing = (t: number, b: number, c: number, d: number) => number;
type Motion = { x: [ms: number, Easing]; y: [ms: number, Easing] };
type Box = {
  group: Konva.Group;
  bg: Konva.Rect;
  w: number;
  h: number;
  home: Point;
  v: Point;
  tweens: Konva.Tween[];
};

function cubicBezier(x1: number, y1: number, x2: number, y2: number): Easing {
  const bez = (p1: number, p2: number, s: number) =>
    3 * (1 - s) * (1 - s) * s * p1 + 3 * (1 - s) * s * s * p2 + s * s * s;
  return (t, b, c, d) => {
    let [lo, hi] = [0, 1];
    for (let i = 0; i < 30; i++) {
      const mid = (lo + hi) / 2;
      if (bez(x1, x2, mid) < t / d) lo = mid;
      else hi = mid;
    }
    return b + c * bez(y1, y2, (lo + hi) / 2);
  };
}

const TEXTS = ["Bra", "folk", "smarte", "løsninger"];
const WHITE = "#fcf6ee";
const YELLOW = "#ffd24c";

// Timings and curves measured from Systek_Sammenkoblinger_16-9.mp4.
// y settles faster than x, so boxes move in curves.
const STEP_MS = 700;
const LAST_BOX_WHITE_MS = 370;
const softEaseOut = cubicBezier(0.25, 0.35, 0.4, 1);
const snapEaseOut = cubicBezier(0.2, 0.9, 0.55, 1);
const collapseEaseInOut = cubicBezier(0.65, 0.05, 0, 0.95);
const PUSH: Motion = { x: [750, softEaseOut], y: [550, snapEaseOut] };
const SPAWN: Motion = { x: [550, softEaseOut], y: [700, snapEaseOut] };
const COLLAPSE: Motion = {
  x: [950, collapseEaseInOut],
  y: [950, collapseEaseInOut],
};

const WRAPPED_ROW_GAP = 2; // in box heights

const TETHER_STIFFNESS = 60;
const HOME_STIFFNESS = 10;
const DAMPING = 8;
const PHYSICS_STEP = 1 / 120;

// Box centers per step, as fractions of the stage
const STEPS: [number, number][][] = [
  [[0.4, 0.56]],
  [
    [0.22, 0.815],
    [0.5, 0.24],
  ],
  [
    [0.2, 0.815],
    [0.46, 0.165],
    [0.67, 0.585],
  ],
  [
    [0.19, 0.82],
    [0.44, 0.16],
    [0.64, 0.62],
    [0.81, 0.27],
  ],
];

// On small screens the last box spawns below instead, pushing the third one up
const LAST_STEP_SMALL: [number, number][] = [
  [0.19, 0.82],
  [0.44, 0.16],
  [0.64, 0.4],
  [0.81, 0.8],
];

let teardown: (() => void) | undefined;

export function setupConnections(root: HTMLDivElement) {
  teardown?.();

  const vw = window.innerWidth;
  const [fontSize, padY, padX] =
    vw <= 384
      ? [32, 4, 8]
      : vw <= 800
        ? [48, 4, 12]
        : [60, 6, 16].map((v) => (v * Math.max(vw, 1680)) / 1680);
  const margin = vw <= 384 ? 16 : 20;

  const stage = new Konva.Stage({
    container: root,
    width: root.offsetWidth,
    height: root.offsetHeight,
  });
  const lineLayer = new Konva.Layer();
  const boxLayer = new Konva.Layer();
  stage.add(lineLayer, boxLayer);

  const boxes: Box[] = [];
  const lines: Konva.Line[] = [];
  const restLengths: number[] = [];
  let dragged: Box | null = null;
  let dragPrev: Point = { x: 0, y: 0 };
  let simulating = false;
  let leftover = 0;

  const clamp = (box: Box, x: number, y: number): Point => ({
    x: Math.min(Math.max(x, margin), stage.width() - margin - box.w),
    y: Math.min(Math.max(y, margin), stage.height() - margin - box.h),
  });

  function moveTo(box: Box, cx: number, cy: number, { x, y }: Motion) {
    box.home = clamp(box, cx - box.w / 2, cy - box.h / 2);
    box.tweens.forEach((t) => t.destroy());
    box.tweens = [
      new Konva.Tween({
        node: box.group,
        duration: x[0] / 1000,
        easing: x[1],
        x: box.home.x,
      }),
      new Konva.Tween({
        node: box.group,
        duration: y[0] / 1000,
        easing: y[1],
        y: box.home.y,
      }),
    ];
    box.tweens.forEach((t) => t.play());
  }

  // Each new box pops in next to the previous one, alternating above and below
  function addBox(i: number) {
    const lastBelow = vw <= 600 && i === TEXTS.length - 1;
    const text = new Konva.Text({
      text: TEXTS[i],
      fontSize,
      fontFamily: '"KHTeka", "Inter", system-ui, sans-serif',
      fontStyle: "300",
      fill: "rgb(26, 26, 26)",
      x: padX,
      y: padY,
    });
    const w = text.width() + 2 * padX;
    const h = text.height() + 2 * padY;
    const bg = new Konva.Rect({
      width: w,
      height: h,
      fill: YELLOW,
      cornerRadius: 4,
    });
    const box: Box = {
      group: new Konva.Group().add(bg, text),
      bg,
      w,
      h,
      home: { x: 0, y: 0 },
      v: { x: 0, y: 0 },
      tweens: [],
    };

    const prev = boxes.at(-1);
    if (!prev) {
      box.group.position(
        clamp(
          box,
          stage.width() / 2 - 0.4 * h - w,
          stage.height() / 2 + 0.13 * h - h / 2,
        ),
      );
    } else {
      const { x, y } = prev.group.position();
      box.group.position(
        i % 2 && !lastBelow
          ? clamp(box, x + prev.w - 0.78 * h, y - 1.67 * h)
          : clamp(
              box,
              x + prev.w + (lastBelow ? 0.3 : 1.16) * h,
              y + prev.h + 1.1 * h,
            ),
      );
      prev.bg.fill(WHITE);
      lines.push(
        new Konva.Line({ stroke: WHITE, strokeWidth: vw <= 384 ? 1 : 2 }),
      );
      lineLayer.add(lines[i - 1]);
    }
    boxes.push(box);
    boxLayer.add(box.group);

    (lastBelow ? LAST_STEP_SMALL : STEPS[i]).forEach(([x, y], j) =>
      moveTo(
        boxes[j],
        x * stage.width(),
        y * stage.height(),
        j === i ? SPAWN : PUSH,
      ),
    );
  }

  // One centered row, wrapping into more rows if it doesn't fit
  function collapse() {
    const gap = boxes[0].h;
    const rows: Box[][] = [[]];
    let rowWidth = -gap;
    for (const box of boxes) {
      rowWidth += gap + box.w;
      if (rowWidth > stage.width() - 2 * margin && rows.at(-1)!.length) {
        rows.push([]);
        rowWidth = box.w;
      }
      rows.at(-1)!.push(box);
    }

    rows.forEach((row, r) => {
      let x =
        (stage.width() - row.reduce((sum, box) => sum + box.w + gap, -gap)) / 2;
      const y =
        stage.height() / 2 +
        (r - (rows.length - 1) / 2) * gap * (1 + WRAPPED_ROW_GAP);
      for (const box of row) {
        moveTo(box, x + box.w / 2, y, COLLAPSE);
        x += box.w + gap;
      }
    });
  }

  // Lines become springs between the boxes, and a weak spring pulls each box home
  function enableDragging() {
    lines.forEach((_, i) => {
      const [a, b] = [boxes[i], boxes[i + 1]];
      restLengths[i] = Math.hypot(
        b.home.x + b.w / 2 - a.home.x - a.w / 2,
        b.home.y + b.h / 2 - a.home.y - a.h / 2,
      );
    });

    for (const box of boxes) {
      box.group.draggable(true);
      box.group.dragBoundFunc((p) => clamp(box, p.x, p.y));
      box.group.on("dragstart", () => {
        boxes.forEach((b) => b.tweens.forEach((t) => t.destroy()));
        dragged = box;
        dragPrev = box.group.position();
        simulating = true;
      });
      box.group.on("dragend", () => (dragged = null));
      box.group.on("pointerdown", () => {
        box.bg.fill(YELLOW);
        window.addEventListener("pointerup", () => box.bg.fill(WHITE), {
          once: true,
        });
      });
    }
  }

  function simulate(dt: number) {
    if (dragged && dt > 0) {
      const p = dragged.group.position();
      dragged.v.x = (dragged.v.x + (p.x - dragPrev.x) / dt) / 2;
      dragged.v.y = (dragged.v.y + (p.y - dragPrev.y) / dt) / 2;
      dragPrev = p;
    }

    for (leftover += dt; leftover >= PHYSICS_STEP; leftover -= PHYSICS_STEP) {
      const forces = boxes.map((b) => ({
        x: HOME_STIFFNESS * (b.home.x - b.group.x()) - DAMPING * b.v.x,
        y: HOME_STIFFNESS * (b.home.y - b.group.y()) - DAMPING * b.v.y,
      }));
      lines.forEach((_, i) => {
        const [a, b] = [boxes[i], boxes[i + 1]];
        const dx = b.group.x() + b.w / 2 - a.group.x() - a.w / 2;
        const dy = b.group.y() + b.h / 2 - a.group.y() - a.h / 2;
        const distance = Math.hypot(dx, dy) || 1;
        const f = (TETHER_STIFFNESS * (distance - restLengths[i])) / distance;
        forces[i].x += f * dx;
        forces[i].y += f * dy;
        forces[i + 1].x -= f * dx;
        forces[i + 1].y -= f * dy;
      });
      boxes.forEach((b, i) => {
        if (b === dragged) return;
        b.v.x += forces[i].x * PHYSICS_STEP;
        b.v.y += forces[i].y * PHYSICS_STEP;
        const x = b.group.x() + b.v.x * PHYSICS_STEP;
        const y = b.group.y() + b.v.y * PHYSICS_STEP;
        const p = clamp(b, x, y);
        if (p.x !== x) b.v.x = 0;
        if (p.y !== y) b.v.y = 0;
        b.group.position(p);
      });
    }

    const settled =
      !dragged &&
      boxes.every(
        (b) =>
          Math.hypot(b.v.x, b.v.y) < 2 &&
          Math.hypot(b.home.x - b.group.x(), b.home.y - b.group.y()) < 0.5,
      );
    if (settled) {
      boxes.forEach((b) => {
        b.group.position(b.home);
        b.v = { x: 0, y: 0 };
      });
      simulating = false;
    }
  }

  let lastTime = performance.now();
  let raf = requestAnimationFrame(function frame(time) {
    if (simulating) simulate(Math.min((time - lastTime) / 1000, 1 / 30));
    lastTime = time;
    lines.forEach((line, i) => {
      const [a, b] = [boxes[i], boxes[i + 1]];
      line.points([
        a.group.x() + a.w + 4,
        a.group.y() + a.h + 4,
        b.group.x() - 4,
        b.group.y() - 4,
      ]);
    });
    raf = requestAnimationFrame(frame);
  });

  const end = TEXTS.length * STEP_MS;
  const timers = [
    ...TEXTS.map((_, i) => setTimeout(() => addBox(i), i * STEP_MS)),
    setTimeout(collapse, end),
    setTimeout(() => boxes.at(-1)!.bg.fill(WHITE), end + LAST_BOX_WHITE_MS),
    setTimeout(enableDragging, end + COLLAPSE.x[0]),
  ];

  teardown = () => {
    timers.forEach(clearTimeout);
    cancelAnimationFrame(raf);
    stage.destroy();
  };
}

// Fades the page background from blue to off-white as the canvas scrolls out
export function setupObserver(canvas: HTMLDivElement): void {
  const colorStart = "#97d2ec"; // --color-blue
  const colorEnd = "#fcf6ee"; // --color-off-white
  const observer = new IntersectionObserver(
    ([entry]) => {
      document.body.style.setProperty(
        "--color-background",
        chroma.mix(colorEnd, colorStart, entry.intersectionRatio).css(),
      );
    },
    {
      threshold: Array.from({ length: 101 }, (_, i) => i / 100),
    },
  );
  observer.observe(canvas);
}
