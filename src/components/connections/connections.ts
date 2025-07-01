import Konva from "konva";

type Box = {
  w: number;
  h: number;
  body: Konva.Group;
  text: Konva.Text;
  background: Konva.Rect;
  repulsionForce: number;
  pullToPlace: (x: number, y: number, time?: number) => void;
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
  minWidth: number;
  maxWidth: number;
  fontSize: number;
  textPadding: [number, number, number, number];
  initialStagePaddingY: number;
  initialStagePaddingX: number;
  stagePadding: number;
  lineWidth: number;
  repulsionForce: number;
};

const breakpoints: BreakpointConfig[] = [
  {
    // Mobile
    minWidth: 0,
    maxWidth: 799,
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
    minWidth: 800,
    maxWidth: 1199,
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
    minWidth: 1200,
    maxWidth: Infinity,
    fontSize: 60,
    textPadding: [4, 16, 6, 16],
    initialStagePaddingY: 80,
    initialStagePaddingX: 80,
    stagePadding: 20,
    lineWidth: 2,
    repulsionForce: 4000,
  },
];

const Connections = function (
  rootEl: HTMLDivElement,
  options?: Partial<Config>
) {
  if (!rootEl) {
    return;
  }
  let renderCount = 0;

  // Find matching breakpoint config
  const breakpointConfig: BreakpointConfig =
    breakpoints.find(
      (bp) =>
        bp.minWidth <= window.innerWidth && window.innerWidth < bp.maxWidth
    ) || breakpoints[0];

  const config: Config & BreakpointConfig = Object.assign(
    {
      texts: ["Systek"],
      white: "#fcf6ee",
      yellow: "#ffd24c",
      textColor: "rgb(26, 26, 26)",
    },
    breakpointConfig,
    options
  );

  // Setup starts
  var stage = new Konva.Stage({
    container: rootEl,
    width: rootEl.offsetWidth,
    height: rootEl.offsetHeight,
  });

  var layer = new Konva.Layer();
  stage.add(layer);

  // Object storage
  let boxes: Box[] = [];
  let lines: Line[] = [];

  function createBox(text: string, x: number, y: number) {
    const textItem = new Konva.Text({
      fontSize: config.fontSize,
      fontFamily: `"KHTeka", "Inter", system-ui, sans-serif`,
      fontWeight: 300,
      fontStyle: "normal",
      text: text,
      fill: config.textColor,
      x: config.textPadding[1],
      y: config.textPadding[0],
    });
    const textGroup = new Konva.Group({
      x: x - textItem.width() / 2 - config.textPadding[1],
      y: y - textItem.height() / 2 - config.textPadding[0],
      width: textItem.width() + config.textPadding[1] + config.textPadding[3],
      height: textItem.height() + config.textPadding[0] + config.textPadding[2],
      draggable: true,
      opacity: 0,
    });
    const textBackground = new Konva.Rect({
      width: textItem.width() + config.textPadding[1] + config.textPadding[3],
      height: textItem.height() + config.textPadding[0] + config.textPadding[2],
      fill: config.yellow,
      strokeWidth: 0,
      roundness: 4,
    });
    textGroup.add(textBackground).add(textItem);

    const box = {
      w: textGroup.width(),
      h: textGroup.height(),
      body: textGroup,
      text: textItem,
      background: textBackground,
      repulsionForce: config.repulsionForce,
      pullToPlace(optX, optY, time = 0.5) {
        new Konva.Tween({
          node: this.body,
          x: optX,
          y: optY,
          duration: time || 0.5,
          easing: Konva.Easings.EaseInOut,
        }).play();
      },
      applyRepulsion(otherBox: Box, forceMultiplier = 1, timeMS = 1000) {
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
          this.body.height()
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

    box.body.on("dragmove", ({ target }) => {
      const { x, y } = ensureInsideStage(
        target.x(),
        target.y(),
        target.width(),
        target.height()
      );

      target.x(x);
      target.y(y);
    });

    return box;
  }

  function ensureInsideStage(
    x: number,
    y: number,
    width: number,
    height: number
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

  function updateLines() {
    for (const line of lines) {
      const { boxA, boxB } = line;
      const { x: xA, y: yA } = boxA.body.getClientRect();
      const { x: xB, y: yB } = boxB.body.getClientRect();

      line.body.points([xA + boxA.w + 4, yA + boxA.h + 4, xB - 4, yB - 4]);
    }
  }

  function createLine(boxA: Box, boxB: Box) {
    // Create line between each box
    const { x: xA, y: yA } = boxA.body.getPosition();
    const { x: xB, y: yB } = boxB.body.getPosition();

    const line: Line = {
      boxA: boxA,
      boxB: boxB,
      body: new Konva.Line({
        points: [xA + boxA.w + 4, yA + boxA.h + 4, xB - 4, yB - 4],
        stroke: config.white,
        strokeWidth: config.lineWidth,
      }),
    };

    lines.push(line);

    return line;
  }

  async function createBoxesRecursively(
    index = 0,
    texts: string[],
    renderId: number
  ) {
    if (index >= texts.length || renderId !== renderCount) {
      return;
    }

    const [startX, startY] = randomPlacement(index);
    // Allowed area based on initialStagePadding
    const x =
      config.initialStagePaddingX +
      startX * (stage.width() - 2 * config.initialStagePaddingX);
    const y =
      config.initialStagePaddingY +
      startY * (stage.height() - 2 * config.initialStagePaddingY);

    const text = texts[index];

    const box = createBox(text, x, y);
    boxes.push(box);

    layer.add(box.body);

    box.setVisible();

    if (index !== 0) {
      const prevBox = boxes[index - 1];
      const line = createLine(prevBox, box);

      layer.add(line.body);

      box.applyRepulsion(prevBox, 4, 1000);
      prevBox.applyRepulsion(box, 4, 1000);
      layer.batchDraw();

      await sleep(1000);
    } else {
      await sleep(500);
    }

    box.setReady();
    return createBoxesRecursively(index + 1, texts, renderId);
  }

  async function createBoxes() {
    renderCount++; // Increment render count to ensure we only render the latest boxes

    await createBoxesRecursively(0, config.texts, renderCount);
  }

  function collisionCheck() {
    // Check for collisions
    for (let i = 0; i < boxes.length; i++) {
      const boxA = boxes[i];
      for (let j = i + 1; j < boxes.length; j++) {
        const boxB = boxes[j];
        // Check if boxes are colliding

        if (haveIntersection(boxA, boxB, 20)) {
          // Boxes are colliding, apply repulsion
          const boxADragged = boxA.body.isDragging();
          const boxBDragged = boxB.body.isDragging();
          if (!boxADragged) {
            boxA.applyRepulsion(boxB, 1.5, 800);
          }
          if (!boxBDragged) {
            boxB.applyRepulsion(boxA, 1.5, 800);
          }
        }
      }
    }
  }

  let raf: number | null = null;

  // Update lines
  function animate() {
    updateLines();
    collisionCheck();

    raf = requestAnimationFrame(animate);
  }

  async function start() {
    createBoxes();

    // Start animations right away
    animate();
  }

  start();

  window.addEventListener("resize", () => {
    cancelAnimationFrame(raf!);

    stage.setSize({ width: rootEl.offsetWidth, height: rootEl.offsetHeight });

    // Find matching breakpoint config
    const newBreakpointConfig: BreakpointConfig =
      breakpoints.find(
        (bp) =>
          bp.minWidth <= window.innerWidth && window.innerWidth < bp.maxWidth
      ) || breakpoints[0];

    // Update config with new breakpoint values
    Object.assign(config, newBreakpointConfig);

    lines.forEach((line) => {
      line.body.remove();
    });
    boxes.forEach((box) => {
      box.body.remove();
    });
    lines = [];
    boxes = [];

    start();
  });
};

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
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

  return [minX + Math.random() * areaWidth, minY + Math.random() * areaHeight];
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

export default Connections;
