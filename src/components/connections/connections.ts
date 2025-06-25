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
  position: [number, number];
  body: any; // TODO: Body or Composite?
  elem: HTMLElement;
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
        [0.2, 0.3],
        [0.7, 0.15],
        [0.4, 0.5],
        [0.7, 0.8],
      ],
      boxMargin: 4,
      boxPadding: 4,
      stiffness: 0.00002,
      damping: 0.001,
    },
    options
  );

  console.log("Config", config);

  // Setup starts
  // create engine
  const engine = Engine.create();
  const world = engine.world;

  engine.gravity.y = 0;

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
  let boxes: Box[];
  let constraints: Constraint[];
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

  function renderBoxesAndLines(width: number, height: number) {
    if (boxes && boxes.length > 0) {
      Composite.remove(
        world,
        boxes.map((box) => box.body)
      );
    }
    if (constraints && constraints.length > 0) {
      Composite.remove(world, constraints);
    }

    // Recalculate optimal positions
    const optimalPositions = calculateOptimalPoisition(width, height);

    boxes = boxNodes.map((textEl, i) => {
      const { width: bW, height: bH } = textEl.getBoundingClientRect();
      const posItem = optimalPositions[i];

      return {
        id: `box-${i}`,
        position: posItem,
        w: bW + (config.boxPadding + config.boxPadding),
        h: bH + (config.boxPadding + config.boxPadding),
        body: Bodies.rectangle(
          posItem[0],
          posItem[1],
          bW + (config.boxPadding + config.boxPadding),
          bH + (config.boxPadding + config.boxPadding),
          {
            render: { fillStyle: "transparent" },
            angularVelocity: 0.3,
            angularSpeed: 0.3,
            friction: 0.1,
            frictionAir: 0.05,
            inertia: Infinity,
          }
        ),
        elem: textEl,
        render() {
          const { x, y } = this.body.position;

          textEl.style.top = `${y - this.h / 2 + config.boxPadding}px`;
          textEl.style.left = `${x - this.w / 2 + config.boxPadding}px`;
          textEl.style.transform = `rotate(${this.body.angle}rad)`;

          this.position = [x, y];
        },
      } as Box;
    });

    constraints = boxes
      .map((bodyB, i) => {
        if (i === 0) return null;
        const bodyA = boxes[i - 1];
        return Constraint.create({
          bodyA: bodyA.body,
          pointA: {
            x: bodyA.w / 2 + config.boxMargin,
            y: bodyA.h / 2 + config.boxMargin,
          },
          bodyB: bodyB.body,
          pointB: {
            x: -(bodyB.w / 2) - config.boxMargin,
            y: -(bodyB.h / 2) - config.boxMargin,
          },
          stiffness: config.stiffness,
          damping: config.damping,
          render: {
            lineWidth: 2,
            strokeStyle: "#FCF6EE",
            type: "line",
            anchors: false,
          },
        });
      })
      .filter((b) => b !== null);

    Composite.add(world, [...boxes.map((box) => box.body), ...constraints]);
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

  window.addEventListener("resize", handleResize);

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
      window.removeEventListener("resize", handleResize);
    },
  };
};

export default Connections;
