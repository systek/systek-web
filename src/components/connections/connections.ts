import Konva from "konva";

type Box = {
  w: number;
  h: number;
  isDragged?: boolean;
  repulsionForce: number;
  body: Konva.Rect;
  elem: HTMLElement;
  pullToPlace: (x: number, y: number, time?: number) => void;
  applyRepulsion: (otherBox: Box, timeMs?: number) => void;
  setReady: (wait?: number) => void;
  renderText: (position?: Position) => void;
};

type Position = {
  x: number;
  y: number;
};

type Line = {
  boxA: Box;
  boxB: Box;
  body: Konva.Line;
};

type Config = {
  positions: [number, number][];
  boxMargin: number;
  boxPadding: number;
  stiffness: number;
  damping: number;
  white: string;
  yellow: string;
};

const Connections = function (
  rootEl: HTMLDivElement,
  options?: Partial<Config>
) {
  if (!rootEl) {
    return;
  }
  // External dependencies
  const { offsetHeight: height, offsetWidth: width } = rootEl;
  const boxNodes = Array.from(
    rootEl.querySelectorAll(".connection-box")
  ) as HTMLElement[];
  const canvasWrapper = document.createElement("div");
  rootEl.appendChild(canvasWrapper);

  const config: Config = Object.assign(
    {
      positions: [
        [0.2, 0.3],
        [0.7, 0.15],
        [0.3, 0.6],
        [0.7, 0.5],
      ],
      boxMargin: 4,
      boxPadding: 4,
      stiffness: 0.00002,
      damping: 0.0001,
      white: "#fcf6ee",
      yellow: "#ffd24c",
    },
    options
  );

  // Setup starts
  var stage = new Konva.Stage({
    container: canvasWrapper,
    width: window.innerWidth,
    height: window.innerHeight,
  });

  var layer = new Konva.Layer();
  stage.add(layer);
  // Setup done

  // Object storage
  let boxes: Box[] = [];
  let lines: Line[] = [];
  let walls: Body[] = [];

  function createBox(textEl: HTMLElement, x: number, y: number) {
    const { width: bW, height: bH } = textEl.getBoundingClientRect();

    const box = {
      w: bW + (config.boxPadding + config.boxPadding),
      h: bH + (config.boxPadding + config.boxPadding),
      repulsionForce: 8000,
      body: new Konva.Rect({
        x: x,
        y: y,
        width: bW + (config.boxPadding + config.boxPadding),
        height: bH + (config.boxPadding + config.boxPadding),
        fill: "transparent",
        draggable: true,
      }),
      elem: textEl,
      pullToPlace(optX, optY, time = 0.5) {
        const tween = new Konva.Tween({
          node: this.body,
          x: optX,
          y: optY,
          duration: time || 0.5,
          easing: Konva.Easings.EaseInOut,
        });

        console.log("tween", tween);

        tween.play();
      },
      applyRepulsion(otherBox: Box, timeMS = 1000) {
        const { x, y } = this.body.getPosition();
        const otherBoxPos = otherBox.body.getPosition();
        const dx = x - otherBoxPos.x;
        const dy = y - otherBoxPos.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 10) {
          return;
        }

        const force = this.repulsionForce / distance;
        const angle = Math.atan2(dy, dx);

        const endX = x + Math.cos(angle) * force;
        const endY = y + Math.sin(angle) * force;

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
      renderText(position) {
        textEl.classList.remove("invisible");
        const { x, y } = position || this.body.getPosition();

        textEl.style.top = `${y + config.boxPadding}px`;
        textEl.style.left = `${x + config.boxPadding}px`;
      },
      async setReady(wait?: number) {
        textEl.classList.remove("invisible");
        if (wait) {
          await sleep(wait);
        }
        this.elem.classList.remove("bg-yellow");
        this.elem.classList.add("bg-off-white");
      },
    } as Box;

    // box.body.on("dragmove", ({ evt }) => {
    //   box.renderText();
    // });

    // First render
    box.renderText();

    return box;
  }

  function updateLines() {
    for (const line of lines) {
      const { boxA, boxB } = line;
      const { x: xA, y: yA } = boxA.body.getClientRect();
      const { x: xB, y: yB } = boxB.body.getClientRect();

      line.body.points([xA + boxA.w, yA + boxA.h, xB, yB]);
    }
    layer.batchDraw();
  }

  function createLine(boxA: Box, boxB: Box) {
    // Create line between each box
    const { x: xA, y: yA } = boxA.body.getPosition();
    const { x: xB, y: yB } = boxB.body.getPosition();

    const line: Line = {
      boxA: boxA,
      boxB: boxB,
      body: new Konva.Line({
        points: [xA + boxA.w, yA + boxA.h, xB, yB],
        stroke: config.white,
        strokeWidth: 1,
      }),
    };

    lines.push(line);

    return line;
  }

  async function createBoxesRecursively(
    index = 0,
    nodes: HTMLElement[],
    positions: [number, number][] = [],
    startPositions: [number, number][] = []
  ) {
    if (index >= nodes.length) {
      return;
    }
    const textEl = nodes[index];
    const [x, y] = positions[index];
    const [startX, startY] = startPositions[index];
    const box = createBox(textEl, startX, startY);
    boxes.push(box);

    box.renderText();

    layer.add(box.body);

    //await sleep(1000);

    if (index !== 0) {
      const prevBox = boxes[index - 1];
      const line = createLine(prevBox, box);

      layer.add(line.body);

      box.applyRepulsion(prevBox);
      prevBox.applyRepulsion(box);
      layer.batchDraw();

      //const [prevX, prevY] = positions[index - 1];
      //prevBox.pullToPlace(prevX, prevY);
      //box.pullToPlace(x, y);
      await sleep(1000);
      //for (const [otherIndex, otherBox] of boxes.entries()) {
      // if (otherIndex !== index) {
      //   box.applyRepulsion(otherBox);
      //   otherBox.applyRepulsion(box);
      // }
      //}
    }

    box.setReady(200);

    return createBoxesRecursively(index + 1, nodes, positions, startPositions);
  }

  async function createBoxes() {
    const renderWidth = 0.4 * stage.width();
    const renderHeight = 0.4 * stage.height();
    const startPositions = calculateOptimalPoisition(
      renderWidth,
      renderHeight,
      0.2 * stage.width(),
      0.2 * stage.height()
    );
    const positions = calculateOptimalPoisition(stage.width(), stage.height());

    createBoxesRecursively(0, boxNodes, positions, startPositions);
  }

  function collisionCheck() {
    // Check for collisions
    for (let i = 0; i < boxes.length; i++) {
      const boxA = boxes[i];
      for (let j = i + 1; j < boxes.length; j++) {
        const boxB = boxes[j];
        // Check if boxes are colliding

        if (haveIntersection(boxA, boxB)) {
          // Boxes are colliding, apply repulsion
          console.log("Collision detected between", boxA.elem, boxB.elem);
          const boxADragged = boxA.body.isDragging();
          const boxBDragged = boxB.body.isDragging();
          if (!boxADragged) {
            boxA.applyRepulsion(boxB, 1000);
          }
          if (!boxBDragged) {
            boxB.applyRepulsion(boxA, 1000);
          }
        }
      }
    }
  }

  // Update lines
  function animate() {
    updateLines();
    boxes.forEach((box) => {
      box.renderText();
    });

    collisionCheck();

    requestAnimationFrame(animate);
  }

  async function start() {
    await createBoxes();
    //createLines();

    animate();
  }

  start();

  function calculateOptimalPoisition(
    width: number,
    height: number,
    paddingX = 0,
    paddingY = 0
  ) {
    return config.positions.map((pos) => [
      pos[0] * width + paddingX,
      pos[1] * height + paddingY,
    ]);
  }
};

function debounce<A = unknown>(
  fn: (args: A) => void,
  ms: number
): (args: A) => void {
  let timer: NodeJS.Timeout;

  const debouncedFunc = (args: A) => {
    if (timer) {
      clearTimeout(timer);
    }

    timer = setTimeout(() => {
      fn(args);
    }, ms);
  };

  return debouncedFunc;
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function haveIntersection(boxA: Box, boxB: Box) {
  const { x: xA, y: yA, width: wA, height: hA } = boxA.body.getClientRect();
  const { x: xB, y: yB, width: wB, height: hB } = boxB.body.getClientRect();
  return !(
    xA + wA < xB || // A is left of B
    xB + wB < xA || // B is left of A
    yA + hA < yB || // A is above B
    yB + hB < yA // B is above A
  );
}

export default Connections;
