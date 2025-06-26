import {
  Engine,
  Render,
  Runner,
  Constraint,
  MouseConstraint,
  Mouse,
  Composite,
  Bodies,
  Body,
} from "matter-js";

type Box = {
  id: string;
  w: number;
  h: number;
  x: number;
  y: number;
  repulsionForce: number;
  body: any; // TODO: Body or Composite?
  elem: HTMLElement;
  push: (x: number, y: number) => void;
  pullToPlace: (x: number, y: number) => void;
  applyRepulsion: (otherBox: Box) => void;
  addFriction: (friction: number, wait?: number) => void;
  setReady: (wait?: number) => void;
  render: () => void;
};

type Config = {
  positions: [number, number][];
  boxMargin: number;
  boxPadding: number;
  stiffness: number;
  damping: number;
};

const Connections = function (rootEl: HTMLElement, options?: Partial<Config>) {
  if (!rootEl) {
    return;
  }
  // External dependencies
  const { offsetHeight: height, offsetWidth: width } = rootEl;
  const boxNodes = Array.from(
    rootEl.querySelectorAll(".connection-box")
  ) as HTMLElement[];

  const config: Config = Object.assign(
    {
      positions: [
        [0.2, 0.5],
        [0.7, 0.15],
        [0.3, 0.6],
        [0.7, 0.5],
      ],
      boxMargin: 4,
      boxPadding: 4,
      stiffness: 0.00002,
      damping: 0.0001,
    },
    options
  );

  // Setup starts
  // create engine
  const engine = Engine.create();
  const world = engine.world;

  engine.gravity.y = 0;
  engine.timing.timeScale = 0.5;

  // create renderer
  var render = Render.create({
    element: rootEl,
    engine: engine,
    options: {
      width: width,
      height: height,
      background: "transparent",
      showAngleIndicator: false,
      showAxes: false,
      showBounds: false,
      wireframes: false,
    },
  });

  Render.run(render);

  // create runner
  var runner = Runner.create();
  Runner.run(runner, engine);
  // Setup done

  // Object storage
  let boxes: Box[] = [];
  let lines: Constraint[] = [];
  let walls: Body[] = [];

  // Create initial walls
  renderWalls(width, height);
  renderBoxesAndLines(width, height);

  (function rerender() {
    boxes.forEach((box) => box.render());
    Engine.update(engine);
    requestAnimationFrame(rerender);
  })();

  // add mouse control
  var mouse = Mouse.create(render.canvas),
    mouseConstraint = MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        // allow bodies on mouse to rotate
        //angularStiffness: 1,
        render: {
          visible: false,
        },
      },
    });

  Composite.add(world, mouseConstraint);

  // keep the mouse in sync with rendering
  render.mouse = mouse;

  // fit the render viewport to the scene
  Render.lookAt(render, {
    min: { x: 0, y: 0 },
    max: { x: width, y: height },
  });

  function calculateOptimalPoisition(width: number, height: number) {
    return config.positions.map((pos) => [pos[0] * width, pos[1] * height]);
  }

  function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  function renderBoxAndLine(boxIndex: number, center: [number, number]) {
    const textEl = boxNodes[boxIndex];
    const { width: bW, height: bH } = textEl.getBoundingClientRect();

    const box = {
      id: `box-${boxIndex}`,
      w: bW + (config.boxPadding + config.boxPadding),
      h: bH + (config.boxPadding + config.boxPadding),
      x: center[0],
      y: center[1],
      repulsionForce: 100,
      body: Bodies.rectangle(
        center[0],
        center[1],
        bW + (config.boxPadding + config.boxPadding),
        bH + (config.boxPadding + config.boxPadding),
        {
          render: { fillStyle: "transparent" },
          angularVelocity: 0.6,
          angularSpeed: 0.6,
          friction: 0,
          frictionAir: 0.05,
          inertia: Infinity,
        }
      ),
      elem: textEl,
      async push(destX: number, destY: number) {
        const dist = Math.sqrt((destX - this.x) ** 2 + (destY - this.y) ** 2);
        const dx = destX - this.x;
        const dy = destY - this.y;
        const theta = Math.atan2(dy, dx);

        const f = Math.min(dist / 1400, 0.2); // < 70 ? Math.min(0.1, dist / 1000) : 0.1;

        Body.applyForce(
          this.body,
          { x: destX, y: destY },
          {
            x: Math.cos(theta) * f,
            y: Math.sin(theta) * f,
          }
        );
      },
      pullToPlace(optX: number, optY: number) {
        const dx = optX - this.x;
        const dy = optY - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > 0) {
          const force = this.repulsionForce / distance;
          const angle = Math.atan2(dy, dx);

          Body.applyForce(
            this.body,
            { x: this.x, y: this.y },
            {
              x: Math.cos(angle) * force,
              y: Math.sin(angle) * force,
            }
          );
        }
      },
      applyRepulsion(otherBox: Box) {
        const dx = this.x - otherBox.x;
        const dy = this.y - otherBox.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > 0) {
          const force = this.repulsionForce / (distance * 3);
          const angle = Math.atan2(dy, dx);

          Body.applyForce(
            this.body,
            { x: otherBox.x, y: otherBox.y },
            {
              x: Math.cos(angle) * force,
              y: Math.sin(angle) * force,
            }
          );
        }
      },
      async addFriction(friction: number, wait = 0) {
        if (wait) {
          await sleep(wait);
        }
        this.body.friction = friction;
        this.body.frictionAir = friction;
      },
      async setReady(wait?: number) {
        if (wait) {
          await sleep(wait);
        }
        this.elem.classList.remove("bg-yellow");
        this.elem.classList.add("bg-off-white");
      },
      render() {
        const { x, y } = this.body.position;

        textEl.style.top = `${y - this.h / 2 + config.boxPadding}px`;
        textEl.style.left = `${x - this.w / 2 + config.boxPadding}px`;
        textEl.classList.remove("invisible");

        this.x = x;
        this.y = y;
      },
    } as Box;

    boxes.push(box);
    Composite.add(world, box.body);

    if (boxIndex > 0) {
      // Create line to previous one
      const prevBox = boxes[boxIndex - 1];

      const line = Constraint.create({
        bodyA: prevBox.body,
        pointA: {
          x: prevBox.w / 2 + config.boxMargin,
          y: prevBox.h / 2 + config.boxMargin,
        },
        bodyB: box.body,
        pointB: {
          x: -(box.w / 2) - config.boxMargin,
          y: -(box.h / 2) - config.boxMargin,
        },
        length: 300 + Math.random() * 300,
        stiffness: config.stiffness,
        damping: config.damping,
        render: {
          lineWidth: 2,
          strokeStyle: "#FCF6EE",
          type: "line",
          anchors: false,
        },
      });

      lines.push(line);
      Composite.add(world, line);
    }

    return box;
  }

  async function renderBoxesAndLines(width: number, height: number) {
    // Remove old stuff
    if (boxes && boxes.length > 0) {
      Composite.remove(
        world,
        boxes.map((box) => box.body)
      );
    }
    if (lines && lines.length > 0) {
      Composite.remove(world, lines);
    }

    // Recalculate optimal positions
    const renderWidth = 0.4 * width;
    const renderHeight = 0.4 * height;
    const optimalPositions = calculateOptimalPoisition(
      renderWidth,
      renderHeight
    );

    const endPositions = calculateOptimalPoisition(width, height);

    const itemCount = boxNodes.length;

    // TODO: Cancel on resize
    for (const [boxIndex, _val] of boxNodes.entries()) {
      const endPos = endPositions[boxIndex];
      const startPos: [number, number] = [
        width * 0.3 + ((width * 0.4) / itemCount) * (boxIndex + 1),
        height / 2,
      ];
      const box = renderBoxAndLine(boxIndex, startPos);

      if (boxIndex !== 0) {
        box.pullToPlace(endPos[0], endPos[1]);
        await sleep(50);
        for (const [otherIndex, otherBox] of boxes.entries()) {
          if (otherIndex !== boxIndex) {
            box.applyRepulsion(otherBox);
            otherBox.applyRepulsion(box);
          }
        }
      }
      await box.setReady(1000);
    }
  }

  function renderWalls(width: number, height: number) {
    // Remove old walls if any
    if (walls && walls.length > 0) {
      Composite.remove(world, walls);
    }
    // Create Walls
    walls = [
      Bodies.rectangle(width / 2, 0, width, 50, {
        isStatic: true,
        render: { fillStyle: "transparent" },
      }),
      Bodies.rectangle(width / 2, height, width, 50, {
        isStatic: true,
        render: { fillStyle: "transparent" },
      }),
      Bodies.rectangle(0, height / 2, 50, height, {
        isStatic: true,
        render: { fillStyle: "transparent" },
      }),
      Bodies.rectangle(width, height / 2, 50, height, {
        isStatic: true,
        render: { fillStyle: "transparent" },
      }),
    ];
    Composite.add(world, walls);
  }

  function handleResize() {
    const { offsetHeight: height, offsetWidth: width } = rootEl;
    render.options.width = width;
    render.options.height = height;
    render.canvas.width = width;
    render.canvas.height = height;

    // Update walls
    renderWalls(width, height);

    // Update Boxes and lines
    renderBoxesAndLines(width, height);

    // Optionally, reposition or resize bodies here if needed
    Render.lookAt(render, {
      min: { x: 0, y: 0 },
      max: { x: width, y: height },
    });
  }

  const handleResizeDebounced = debounce(handleResize, 600);

  window.addEventListener("resize", handleResizeDebounced);

  // context for MatterTools.Demo
  return {
    engine: engine,
    runner: runner,
    render: render,
    canvas: render.canvas,
    getConfig: function () {
      return {
        ...config,
        positions: boxes.map((box) => box.position),
      };
    },
    stop: function () {
      Render.stop(render);
      Runner.stop(runner);
      render.canvas.remove();
      window.removeEventListener("resize", handleResizeDebounced);
    },
  };
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

export default Connections;
