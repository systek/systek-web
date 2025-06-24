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

const boxMargin = 4;
const boxPadding = 4;

type Box = {
  id: string;
  w: number;
  h: number;
  body: any; // TODO: Body or Composite?
  elem: HTMLElement;
  render: () => void;
};

const Connections = function (rootEl: HTMLElement) {
  if (!rootEl) {
    return;
  }

  const { offsetHeight: height, offsetWidth: width } = rootEl;

  let walls = [
    Bodies.rectangle(width / 2, 0, width, 50, {
      isStatic: true,
      render: { fillStyle: "transparent" },
    }), // top
    Bodies.rectangle(width / 2, height, width, 50, {
      isStatic: true,
      render: { fillStyle: "transparent" },
    }), // bunn
    Bodies.rectangle(0, height / 2, 50, height, {
      isStatic: true,
      render: { fillStyle: "transparent" },
    }), // venstre
    Bodies.rectangle(width, height / 2, 50, height, {
      isStatic: true,
      render: { fillStyle: "transparent" },
    }), // høyre
  ];

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

  // Optimal position of items
  // TODO: Check that they are correctly distanced
  const OptimalPositions = [
    [0.2 * width, 0.3 * height],
    [0.7 * width, 0.15 * height],
    [0.4 * width, 0.5 * height],
    [0.7 * width, 0.8 * height],
  ];

  const boxNodes = Array.from(
    rootEl.querySelectorAll(".connection-box"),
  ) as HTMLElement[];
  const boxes: Box[] = boxNodes.map((textEl, i) => {
    const { width: bW, height: bH } = textEl.getBoundingClientRect();
    const posItem = OptimalPositions[i];

    return {
      id: `box-${i}`,
      w: bW + (boxPadding + boxPadding),
      h: bH + (boxPadding + boxPadding),
      body: Bodies.rectangle(
        posItem[0],
        posItem[1],
        bW + (boxPadding + boxPadding),
        bH + (boxPadding + boxPadding),
        {
          render: { fillStyle: "transparent" },
          angularVelocity: 0.3,
          angularSpeed: 0.3,
          friction: 0.1,
          frictionAir: 0.05,
          inertia: Infinity,
        },
      ),
      elem: textEl,
      render() {
        const { x, y } = this.body.position;

        textEl.style.top = `${y - this.h / 2 + boxPadding}px`;
        textEl.style.left = `${x - this.w / 2 + boxPadding}px`;
        textEl.style.transform = `rotate(${this.body.angle}rad)`;
      },
    } as Box;
  });

  const constraints = boxes
    .map((bodyB, i) => {
      if (i === 0) return null;
      const bodyA = boxes[i - 1];
      return Constraint.create({
        bodyA: bodyA.body,
        pointA: { x: bodyA.w / 2 + boxMargin, y: bodyA.h / 2 + boxMargin },
        bodyB: bodyB.body,
        pointB: {
          x: -(bodyB.w / 2) - boxMargin,
          y: -(bodyB.h / 2) - boxMargin,
        },
        stiffness: 0.00002,
        damping: 0.001,
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

  (function rerender() {
    boxes.forEach((box) => box.render());
    Engine.update(engine);
    requestAnimationFrame(rerender);
  })();

  Composite.add(world, walls);

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

  function handleResize() {
    const { offsetHeight: height, offsetWidth: width } = rootEl;
    render.options.width = width;
    render.options.height = height;
    render.canvas.width = width;
    render.canvas.height = height;

    // Update walls
    Composite.remove(world, walls);
    walls = [
      Bodies.rectangle(width / 2, 0, width, 50, {
        isStatic: true,
        render: { fillStyle: "transparent" },
      }), // top
      Bodies.rectangle(width / 2, height, width, 50, {
        isStatic: true,
        render: { fillStyle: "transparent" },
      }), // bottom
      Bodies.rectangle(0, height / 2, 50, height, {
        isStatic: true,
        render: { fillStyle: "transparent" },
      }), // left
      Bodies.rectangle(width, height / 2, 50, height, {
        isStatic: true,
        render: { fillStyle: "transparent" },
      }), // right
    ];
    Composite.add(world, walls);

    // Update constraints
    // Remove old constraints
    Composite.remove(world, constraints);

    // Recalculate optimal positions
    const OptimalPositions = [
      [0.2 * width, 0.3 * height],
      [0.7 * width, 0.15 * height],
      [0.4 * width, 0.5 * height],
      [0.7 * width, 0.8 * height],
    ];

    // Update box positions and sizes
    boxes.forEach((box, i) => {
      const posItem = OptimalPositions[i];
      const { width: bW, height: bH } = box.elem.getBoundingClientRect();
      Body.setPosition(box.body, {
        x: posItem[0],
        y: posItem[1],
      });
      Body.setAngle(box.body, 0);
      Body.setVelocity(box.body, { x: 0, y: 0 });
      Body.setAngularVelocity(box.body, 0);
      Body.setVertices(
        box.body,
        Bodies.rectangle(
          posItem[0],
          posItem[1],
          bW + (boxPadding + boxPadding),
          bH + (boxPadding + boxPadding),
        ).vertices,
      );
      box.w = bW + (boxPadding + boxPadding);
      box.h = bH + (boxPadding + boxPadding);
    });

    // Create new constraints
    constraints.length = 0;
    boxes.forEach((bodyB, i) => {
      if (i === 0) return;
      const bodyA = boxes[i - 1];
      const constraint = Constraint.create({
        bodyA: bodyA.body,
        pointA: { x: bodyA.w / 2 + boxMargin, y: bodyA.h / 2 + boxMargin },
        bodyB: bodyB.body,
        pointB: {
          x: -(bodyB.w / 2) - boxMargin,
          y: -(bodyB.h / 2) - boxMargin,
        },
        stiffness: 0.00002,
        damping: 0.001,
        render: {
          lineWidth: 2,
          strokeStyle: "#FCF6EE",
          type: "line",
          anchors: false,
        },
      });
      constraints.push(constraint);
    });

    Composite.add(world, constraints);

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
    stop: function () {
      Render.stop(render);
      Runner.stop(runner);
      window.removeEventListener("resize", handleResize);
    },
  };
};

export default Connections;
