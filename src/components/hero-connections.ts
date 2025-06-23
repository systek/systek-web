import {
  Engine,
  Render,
  Runner,
  Constraint,
  MouseConstraint,
  Mouse,
  Composite,
  Bodies,
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

const HeroConnections = function (rootEl: HTMLElement) {
  if (!rootEl) {
    return;
  }

  // TODO: Recalculate everything on window resize.
  // Should probably not all be in one function

  const { offsetHeight: height, offsetWidth: width } = rootEl;
  const texEls = [...rootEl.querySelectorAll("span")];

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

  // Dynamically update canvas and bounds
  // render.bounds.max.x = width;
  // render.bounds.max.y = height;
  // render.options.width = width;
  // render.options.height = height;
  // render.canvas.width = width;
  // render.canvas.height = height;

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

  const boxes: Box[] = texEls.map((textEl, i, arr) => {
    const { width: bW, height: bH } = textEl.getBoundingClientRect();
    const posItem = OptimalPositions[i];

    return {
      id: textEl.innerText,
      w: bW + (boxPadding + boxPadding),
      h: bH + (boxPadding + boxPadding),
      body: Bodies.rectangle(
        posItem[0],
        posItem[1],
        bW + (boxPadding + boxPadding),
        bH + (boxPadding + boxPadding),
        {
          render: { fillStyle: i === arr.length - 1 ? "#FFD865" : "#FCF6EE" },
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

  // walls
  Composite.add(world, [
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
  ]);

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

  // context for MatterTools.Demo
  return {
    engine: engine,
    runner: runner,
    render: render,
    canvas: render.canvas,
    stop: function () {
      Render.stop(render);
      Runner.stop(runner);
    },
  };
};

export default HeroConnections;
