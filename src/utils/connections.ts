import Konva from "konva";
import chroma from "chroma-js";
import { sleep } from "./utils";

type Box = {
  w: number;
  h: number;
  body: Konva.Group;
  text: Konva.Text;
  background: Konva.Rect;
  pullToPlace: (x: number, y: number, timeMS?: number) => void;
  setVisible: (timeMs?: number) => void;
  setColor: () => void;
};

type Line = {
  boxA: Box;
  boxB: Box;
  body: Konva.Line;
};

type Config = {
  texts: string[];
  white: string;
  yellow: string;
  textColor: string;
  maxLineLength: number;
  minLineLength: number;
};

type BreakpointConfig = {
  width: number;
  fontSize: number;
  textPadding: [number, number, number, number];
  initialStagePaddingY: number;
  initialStagePaddingX: number;
  stagePadding: number;
  lineWidth: number;
  repulsionForce: number;
};

export const setupConnections = function (rootEl: HTMLDivElement) {
  const boxes: Box[] = [];
  const lines: Line[] = [];
  let raf: number | null = null;

  const breakpoints: BreakpointConfig[] = [
    {
      // Mobile
      width: 384, // --breakpoint-sm
      fontSize: 32,
      textPadding: [4, 8, 4, 8],
      initialStagePaddingY: 80,
      initialStagePaddingX: 16,
      stagePadding: 16,
      lineWidth: 1,
      repulsionForce: 2000,
    },
    {
      // Tablet
      width: 800, // --breakpoint-md
      fontSize: 48,
      textPadding: [4, 12, 4, 12],
      initialStagePaddingY: 80,
      initialStagePaddingX: 80,
      stagePadding: 20,
      lineWidth: 2,
      repulsionForce: 4000,
    },
    {
      // Desktop
      width: 1680, // --breakpoint-lg
      fontSize: 60,
      textPadding: [6, 16, 6, 16],
      initialStagePaddingY: 80,
      initialStagePaddingX: 80,
      stagePadding: 20,
      lineWidth: 2,
      repulsionForce: 4000,
    },
    {
      width: window.innerWidth,
      fontSize: 60 * (window.innerWidth / 1680),
      textPadding: [6, 16, 6, 16].map(
        (val) => val * (window.innerWidth / 1680),
      ) as [number, number, number, number],
      initialStagePaddingY: window.innerHeight * 0.05,
      initialStagePaddingX: window.innerWidth * 0.1,
      stagePadding: 20,
      lineWidth: 2,
      repulsionForce: 4000 * (window.innerWidth / 1680),
    },
  ];

  // Find matching breakpoint config
  const breakpointConfig: BreakpointConfig =
    breakpoints.find((bp) => window.innerWidth <= bp.width) || breakpoints[0];

  const config: Config & BreakpointConfig = Object.assign(
    {
      texts: ["Bra", "folk", "smarte", "løsninger"],
      white: "#fcf6ee",
      yellow: "#ffd24c",
      textColor: "rgb(26, 26, 26)",
      maxLineLength: window.innerWidth * 0.4, //window.innerWidth < 1680 ? 600 : window.innerWidth * 0.4,
      minLineLength: window.innerWidth * 0.1, //window.innerWidth < 1680 ? 100 : window.innerWidth * 0.06,
    },
    breakpointConfig,
  );

  // Setup starts
  const stage = new Konva.Stage({
    container: rootEl,
    width: rootEl.offsetWidth,
    height: rootEl.offsetHeight,
  });

  const layer = new Konva.Layer();
  const subLayer = new Konva.Layer();
  stage.add(subLayer);
  stage.add(layer);

  function updateLines() {
    for (const line of lines) {
      const { boxA, boxB } = line;
      const { x: xA, y: yA } = boxA.body.getClientRect();
      const { x: xB, y: yB } = boxB.body.getClientRect();
      line.body.points([xA + boxA.w + 4, yA + boxA.h + 4, xB - 4, yB - 4]);
    }
  }

  function animate() {
    updateLines();

    raf = requestAnimationFrame(animate);
  }

  if (raf) {
    cancelAnimationFrame(raf);
  }

  async function makeBox(step: number, text: string) {
    const [x, y] = getStartPositions(step);
    // Add all boxes to the center
    const startX = x * stage.width();
    const startY = y * stage.height();

    const box = createBox(text, startX, startY, stage);
    boxes.push(box);
    layer.add(box.body);
    box.setVisible();

    const prevBox = boxes[step - 1];
    if (step > 0 && prevBox) {
      prevBox.setColor();
      const line = createLine(prevBox, box);
      lines.push(line);
      subLayer.add(line.body);
    }
  }

  function ensureInsideStage(
    x: number,
    y: number,
    width: number,
    height: number,
    stage: Konva.Stage,
  ) {
    const newY = Math.min(
      Math.max(y, config.stagePadding),
      stage.height() - config.stagePadding - height,
    );
    const newX = Math.min(
      Math.max(x, config.stagePadding),
      stage.width() - config.stagePadding - width,
    );
    return { x: newX, y: newY };
  }

  async function pullBoxesToNewPositions(step: number) {
    const positions = getPositionsPercent(step);
    if (!positions) {
      return;
    }

    for (let i = 0; i < boxes.length; i++) {
      const box = boxes[i];
      const [x, y] = positions[i];
      const destX = x * stage.width();
      const destY = y * stage.height();

      box.pullToPlace(destX, destY, 500);
    }
  }

  async function start() {
    for (const text of config.texts) {
      const index = config.texts.indexOf(text);
      makeBox(index, text);
      pullBoxesToNewPositions(index);
      await sleep(750);
    }
  }

  animate();
  start();

  // utils
  function createLine(boxA: Box, boxB: Box): Line {
    const { x: xA, y: yA } = boxA.body.getPosition();
    const { x: xB, y: yB } = boxB.body.getPosition();
    return {
      boxA,
      boxB,
      body: new Konva.Line({
        points: [xA + boxA.w + 4, yA + boxA.h + 4, xB - 4, yB - 4],
        stroke: config.white,
        strokeWidth: config.lineWidth,
      }),
    };
  }

  function createBox(
    text: string,
    x: number,
    y: number,
    stage: Konva.Stage,
  ): Box {
    const textItem = new Konva.Text({
      fontSize: config.fontSize,
      fontFamily: `"KHTeka", "Inter", system-ui, sans-serif`,
      fontStyle: "300",
      text: text,
      fill: config.textColor,
      x: config.textPadding[1],
      y: config.textPadding[0],
      draggable: false,
    });
    const textBackground = new Konva.Rect({
      width: textItem.width() + config.textPadding[1] + config.textPadding[3],
      height: textItem.height() + config.textPadding[0] + config.textPadding[2],
      fill: config.yellow,
      strokeWidth: 0,
      cornerRadius: 4,
      draggable: false,
    });
    const textGroup = new Konva.Group({
      x: x - textItem.width() / 2 - config.textPadding[1],
      y: y - textItem.height() / 2 - config.textPadding[0],
      width: textItem.width() + config.textPadding[1] + config.textPadding[3],
      height: textItem.height() + config.textPadding[0] + config.textPadding[2],
      draggable: false,
      opacity: 0,
    });
    textGroup.add(textBackground).add(textItem);

    const box = {
      w: textGroup.width(),
      h: textGroup.height(),
      body: textGroup,
      text: textItem,
      background: textBackground,
      pullToPlace(x: number, y: number, timeMS = 1000) {
        const { x: newX, y: newY } = ensureInsideStage(
          x - this.w / 2,
          y - this.h / 2,
          this.w,
          this.h,
          stage,
        );

        // Apply force to this box
        const tween = new Konva.Tween({
          node: this.body,
          duration: timeMS / 1000,
          x: newX,
          y: newY,
          easing: Konva.Easings.EaseOut,
        });
        tween.play();
      },
      setVisible(timeMs = 400) {
        new Konva.Tween({
          node: this.body,
          duration: timeMs / 1000,
          opacity: 1,
          easing: Konva.Easings.Linear,
        }).play();
      },
      setColor() {
        this.background.fill(config.white);
      },
    } as Box;

    return box;
  }

  // We have 4 steps, one for each box
  // We will tween as they are added
  // At first step we will only have the first box
  // At second step we will have the first and second box, and so on
  // The positions will be calculated based on the step
  // The positions will be in percentage of the stage width and height
  // The positions will be in the format [x, y] where x and y are between 0 and 1
  function getPositionsPercent(step: number) {
    if (step < 0 || step > 3) {
      throw new Error("Step must be between 0 and 3");
    }
    if (step === 0) {
      return [[0.4, 0.5]];
    }
    if (step === 1) {
      return [
        [0.25, 0.34],
        [0.6, 0.5],
      ];
    }
    if (step === 2) {
      return [
        [0.22, 0.36],
        [0.7, 0.3],
        [0.4, 0.72],
      ];
    }
    if (step === 3) {
      return [
        [0.2, 0.32],
        [0.75, 0.2],
        [0.32, 0.65],
        [0.6, 0.85],
      ];
    }
  }

  // Initial placement of boxes as they spawn in
  function getStartPositions(boxIndex = 0) {
    return [
      [0.5, 0.5],
      [0.55, 0.5],
      [0.45, 0.68],
      [0.65, 0.7],
    ][boxIndex];
  }
};

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
