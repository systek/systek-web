import Konva from "konva";
import chroma from "chroma-js";
import { sleep } from "./utils";

type Box = {
  w: number;
  h: number;
  body: Konva.Group;
  text: Konva.Text;
  background: Konva.Rect;
  repulsionForce: number;
  activeTween: Konva.Tween | null;
  applyPull: (otherBox: Box, timeMs?: number) => void;
  applyRepulsion: (
    otherBox: Box,
    forceMultiplier?: number,
    timeMs?: number
  ) => void;
  setVisible: (timeMs?: number) => void;
  setReady: () => void;
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
  let boxes: Box[] = [];
  let lines: Line[] = [];
  let raf: number | null = null;

  const breakpoints: BreakpointConfig[] = [
    {
      // Mobile
      width: 384, // --breakpoint-sm
      fontSize: 32,
      textPadding: [2, 8, 4, 8],
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
      textPadding: [2, 12, 4, 12],
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
      textPadding: [4, 16, 6, 16],
      initialStagePaddingY: 80,
      initialStagePaddingX: 80,
      stagePadding: 20,
      lineWidth: 2,
      repulsionForce: 4000,
    },
    {
      width: window.innerWidth,
      fontSize: 60 * (window.innerWidth / 1680),
      textPadding: [8, 14, 8, 14],
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

  let config: Config & BreakpointConfig = Object.assign(
    {
      texts: ["Bra", "folk", "smarte", "løsninger"],
      white: "#fcf6ee",
      yellow: "#ffd24c",
      textColor: "rgb(26, 26, 26)",
    },
    breakpointConfig
  );

  // Setup starts
  const stage = new Konva.Stage({
    container: rootEl,
    width: rootEl.offsetWidth,
    height: rootEl.offsetHeight,
  });

  const layer = new Konva.Layer();
  stage.add(layer);

  function drawBox(index = 0, text: string) {
    const [startX, startY] = getStaticPlacement(index);
    const x =
      config.initialStagePaddingX +
      startX * (stage.width() - 2 * config.initialStagePaddingX);
    const y =
      config.initialStagePaddingY +
      startY * (stage.height() - 2 * config.initialStagePaddingY);

    const box = createBox(text, x, y, stage);
    boxes.push(box);
    layer.add(box.body);
    box.setVisible();

    const prevBox = boxes[index - 1];
    if (prevBox) {
      const line = createLine(prevBox, box);
      lines.push(line);
      layer.add(line.body);
    }

    box.setReady();
  }

  function updateLines() {
    for (const line of lines) {
      const { boxA, boxB } = line;
      const { x: xA, y: yA } = boxA.body.getClientRect();
      const { x: xB, y: yB } = boxB.body.getClientRect();
      line.body.points([xA + boxA.w + 4, yA + boxA.h + 4, xB - 4, yB - 4]);
    }
  }

  function collisionCheck() {
    const padding = 20; //stage.width() * 0.05; // 5% of stage width
    for (let i = 0; i < boxes.length; i++) {
      const boxA = boxes[i];
      for (let j = i + 1; j < boxes.length; j++) {
        const boxB = boxes[j];
        if (haveIntersection(boxA, boxB, padding)) {
          if (!boxA.body.isDragging()) boxA.applyRepulsion(boxB, 1.5, 500);
          if (!boxB.body.isDragging()) boxB.applyRepulsion(boxA, 1.5, 500);
        }
      }
    }
  }

  // Check that distance between boxes is between 100px and 600px
  function checkDistance() {
    const minDistance = 100;
    const maxDistance = 600;
    if (boxes.length < 2) {
      return;
    }
    // Check each boxe and the next box, that is the once with line between them
    for (let i = 0; i < boxes.length - 1; i++) {
      const boxA = boxes[i];
      const boxB = boxes[i + 1];

      const { w: wA, h: hA } = boxA;
      const { w: wB, h: hB } = boxB;
      const { x: xA, y: yA } = boxA.body.getPosition();
      const { x: xB, y: yB } = boxB.body.getPosition();
      // Get center of the boxes
      const dx = xA + wA / 2 - (xB + wB / 2);
      const dy = yA + hA / 2 - (yB + hB / 2);
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < minDistance) {
        if (!boxA.body.isDragging()) boxA.applyRepulsion(boxB, 1, 1000);
        if (!boxB.body.isDragging()) boxB.applyRepulsion(boxA, 1, 1000);
      }
      if (distance > maxDistance) {
        if (!boxA.body.isDragging()) boxA.applyPull(boxB, 1000);
        if (!boxB.body.isDragging()) boxB.applyPull(boxA, 1000);
      }
    }
  }

  // Check length of lines and apply repulsion if too short
  function checkLineLength() {
    const minLineLength = 100;
    const maxLineLength = 600;
    for (const line of lines) {
      const [xA, yA, xB, yB] = line.body.points();
      const dx = xA - xB;
      const dy = yA - yB;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const boxA = line.boxA;
      const boxB = line.boxB;

      if (distance > maxLineLength) {
        if (!boxA.body.isDragging()) {
          boxA.applyPull(boxB, 1000);
        }
        if (!boxB.body.isDragging()) {
          boxB.applyPull(boxA, 1000);
        }
      }
      if (distance < minLineLength) {
        if (!boxA.body.isDragging()) {
          boxA.applyRepulsion(boxB, 1.5, 1000);
        }
        if (!boxB.body.isDragging()) {
          boxB.applyRepulsion(boxA, 1.5, 1000);
        }
      }
    }
  }

  function animate() {
    updateLines();
    checkDistance();
    collisionCheck();

    raf = requestAnimationFrame(animate);
  }

  if (raf) {
    cancelAnimationFrame(raf);
  }

  config.texts.reduce(
    (prev, text, index) =>
      prev.then(async () => {
        drawBox(index, text);
        await sleep(1000);
      }),
    Promise.resolve()
  );

  animate();

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
    stage: Konva.Stage
  ): Box {
    const textItem = new Konva.Text({
      fontSize: config.fontSize,
      fontFamily: `"KHTeka", "Inter", system-ui, sans-serif`,
      fontStyle: "300",
      text: text,
      fill: config.textColor,
      x: config.textPadding[1],
      y: config.textPadding[0],
    });
    const textBackground = new Konva.Rect({
      width: textItem.width() + config.textPadding[1] + config.textPadding[3],
      height: textItem.height() + config.textPadding[0] + config.textPadding[2],
      fill: config.yellow,
      strokeWidth: 0,
      cornerRadius: 4,
    });
    const textGroup = new Konva.Group({
      x: x - textItem.width() / 2 - config.textPadding[1],
      y: y - textItem.height() / 2 - config.textPadding[0],
      width: textItem.width() + config.textPadding[1] + config.textPadding[3],
      height: textItem.height() + config.textPadding[0] + config.textPadding[2],
      draggable: true,
      opacity: 0,
    });
    textGroup.add(textBackground).add(textItem);

    const box = {
      w: textGroup.width(),
      h: textGroup.height(),
      body: textGroup,
      text: textItem,
      background: textBackground,
      repulsionForce: config.repulsionForce,
      activeTween: null,
      applyPull(otherBox: Box, timeMS = 1000) {
        if (this.activeTween) {
          return;
        }
        const { x, y } = this.body.getPosition();
        const otherBoxPos = otherBox.body.getPosition();
        const dx = otherBoxPos.x - x;
        const dy = otherBoxPos.y - y;
        const angle = Math.atan2(dy, dx);
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 100) {
          return;
        }

        // Pull box towards otherBox
        // The boxes want to be atleast 600px apart so we target 500 and devide them by the 2 boxes
        const targetDistance = 500;
        const forceX = (Math.cos(angle) * (distance - targetDistance)) / 2;
        const forceY = (Math.sin(angle) * (distance - targetDistance)) / 2;

        const destX = x + forceX;
        const destY = y + forceY;

        // Apply force to this box
        const tween = new Konva.Tween({
          node: this.body,
          duration: timeMS / 1000,
          x: destX,
          y: destY,
          easing: Konva.Easings.EaseOut,
        });
        tween.play();

        this.activeTween = tween;
        tween.onFinish = () => {
          this.activeTween = null;
        };
      },
      applyRepulsion(otherBox: Box, forceMultiplier = 1, timeMS = 1000) {
        if (this.activeTween) {
          return;
        }
        const { x, y } = this.body.getPosition();
        const otherBoxPos = otherBox.body.getPosition();
        const dx = x - otherBoxPos.x;
        const dy = y - otherBoxPos.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > 600) {
          return;
        }

        const force =
          distance < 10
            ? this.repulsionForce * forceMultiplier
            : (this.repulsionForce * forceMultiplier) / distance;
        const angle = Math.atan2(dy, dx);

        const destX = x + Math.cos(angle) * force;
        const destY = y + Math.sin(angle) * force;

        // Ensure the box stays within the stage bounds
        const { x: endX, y: endY } = ensureInsideStage(
          destX,
          destY,
          this.body.width(),
          this.body.height(),
          stage
        );

        // Apply force to this box
        const tween = new Konva.Tween({
          node: this.body,
          duration: timeMS / 1000,
          x: endX,
          y: endY,
          easing: Konva.Easings.EaseOut,
        });
        tween.play();

        this.activeTween = tween;
        tween.onFinish = () => {
          this.activeTween = null;
        };
      },
      setVisible(timeMs = 400) {
        new Konva.Tween({
          node: this.body,
          duration: timeMs / 1000,
          opacity: 1,
          easing: Konva.Easings.EaseOut,
        }).play();
      },
      setReady() {
        new Konva.Tween({
          node: this.background,
          duration: 0.2,
          fill: config.white,
          easing: Konva.Easings.EaseInOut,
        }).play();
      },
    } as Box;

    box.body.on("dragstart", () => {
      box.activeTween?.destroy();
    });

    box.body.on("dragmove", ({ target }) => {
      const { x, y } = ensureInsideStage(
        target.x(),
        target.y(),
        target.width(),
        target.height(),
        stage
      );

      target.x(x);
      target.y(y);
    });

    return box;
  }

  // Random placement function, expecting 4 items, placing them randomly within a corner
  function randomPlacement(index: number) {
    const areaWidth = 1 / 5; // 20% of the width
    const areaHeight = 1 / 5;

    /*
  *  This is the placement grid
     | | | |
     |1| |2| 
     | | | |
     |3| |4|
     | | | |
  */

    const minX = index % 2 === 0 ? areaWidth : areaWidth * 3;
    const minY = index < 2 ? areaHeight : areaHeight * 3;

    return [
      minX + Math.random() * areaWidth,
      minY + Math.random() * areaHeight,
    ];
  }

  function getStaticPlacement(index: number) {
    const startPosition = [
      [122, 225],
      [584, 175],
      [210, 370],
      [550, 480],
    ][index];
    if (!startPosition) {
      return [0, 0];
    }

    // Return percentage of design stage [X,Y]
    return [startPosition[0] / 800, startPosition[1] / 600];
  }

  function haveIntersection(boxA: Box, boxB: Box, padding = 20) {
    const { x: xA, y: yA, width: wA, height: hA } = boxA.body.getClientRect();
    const { x: xB, y: yB, width: wB, height: hB } = boxB.body.getClientRect();
    return !(
      xA + wA + padding < xB - padding || // A is left of B
      xB + wB + padding < xA - padding || // B is left of A
      yA + hA + padding < yB - padding || // A is above B
      yB + hB + padding < yA - padding // B is above A
    );
  }

  function ensureInsideStage(
    x: number,
    y: number,
    width: number,
    height: number,
    stage: Konva.Stage
  ) {
    const newY = Math.min(
      Math.max(y, config.stagePadding),
      stage.height() - config.stagePadding - height
    );
    const newX = Math.min(
      Math.max(x, config.stagePadding),
      stage.width() - config.stagePadding - width
    );
    return { x: newX, y: newY };
  }
};

export function setupObserver(canvas: HTMLDivElement): void {
  const colorStart = "#97d2ec"; // --color-blue
  const colorEnd = "#fcf6ee"; // --color-off-white
  const observer = new IntersectionObserver(
    ([entry]) => {
      document.body.style.setProperty(
        "--color-background",
        chroma.mix(colorEnd, colorStart, entry.intersectionRatio).css()
      );
    },
    {
      threshold: Array.from({ length: 101 }, (_, i) => i / 100),
    }
  );
  observer.observe(canvas);
}
