import { useEffect, useRef } from "react";
import Matter from "matter-js";

export default function VennDiagram1() {
  const canvasRef = useRef(null);
  const { Engine, Render, Runner, Bodies, Composite, World, Mouse, MouseConstraint } = Matter;

  const textures = [
    "/images/circle_text/staggertext1.svg",
    "/images/circle_text/staggertext2.svg",
    "/images/circle_text/staggertext4.svg",
    "/images/circle_text/staggertext5.svg",
    "/images/circle_text/staggertext6.svg",
  ];

  useEffect(() => {
    if (!canvasRef.current) return;

    const engine = Engine.create();
    engine.gravity.y = 1;
    engine.gravity.scale = 0.0025;

    const width = canvasRef.current.offsetWidth;
    const height = canvasRef.current.offsetHeight;
    const half = width / 2;
    const circleRadius = width / 14;

    const render = Render.create({
      element: canvasRef.current,
      engine,
      options: {
        width,
        height,
        background: "transparent",
        wireframes: false,
      },
    });
    render.context.imageSmoothingEnabled = false;

    // create particles
    let stack = [];
    for (let i = 0; i < 6; i++) {
      stack.push(
        Bodies.circle(half, half, circleRadius, {
          restitution: 0.5,
          frictionAir: 0.02,
          render: {
            sprite: {
              texture: textures[i % textures.length],
              xScale: 0.16,
              yScale: 0.16,
            },
          },
        })
      );
    }
    Composite.add(engine.world, stack);

    // circular invisible boundary
    const pegCount = 32;
    const radius = width / 2;
    const TAU = Math.PI * 2;
    for (let i = 0; i < pegCount; i++) {
      const angle = (i / pegCount) * TAU;
      const x = Math.cos(angle) * radius + width / 2;
      const y = Math.sin(angle) * radius + height / 2;
      const wall = Bodies.rectangle(x, y, width * 0.01, width * 0.4, {
        angle,
        isStatic: true,
        render: { fillStyle: "transparent" },
      });
      Composite.add(engine.world, wall);
    }

    // --- MOUSE INTERACTION (shake on hover) ---
    const mouse = Mouse.create(render.canvas);
    const mouseConstraint = MouseConstraint.create(engine, {
      mouse,
      constraint: { stiffness: 0.2, render: { visible: false } },
    });
    mouseConstraint.mouse.element.removeEventListener("mousewheel", mouseConstraint.mouse.mousewheel);
    mouseConstraint.mouse.element.removeEventListener("DOMMouseScroll", mouseConstraint.mouse.mousewheel);
    Composite.add(engine.world, mouseConstraint);

    // this is the part that actually made them bounce previously
    function shakeScene(engine, bodies) {
      const timeScale = (1000 / 60) / engine.timing.lastDelta;
      for (let i = 0; i < bodies.length; i++) {
        const body = bodies[i];
        if (!body.isStatic) {
          const forceMagnitude = (0.03 * body.mass) * timeScale;
          Matter.Body.applyForce(body, body.position, {
            x: (forceMagnitude + Matter.Common.random() * forceMagnitude) * Matter.Common.choose([1, -1]),
            y: -forceMagnitude + Matter.Common.random() * -forceMagnitude,
          });
        }
      }
    }

    Matter.Events.on(mouseConstraint, "mousemove", (event) => {
      const foundBodies = Matter.Query.point(stack, event.mouse.position);
      shakeScene(engine, foundBodies);
    });

    Render.run(render);
    const runner = Runner.create();
    Runner.run(runner, engine);

    return () => {
      Render.stop(render);
      Runner.stop(runner);
      World.clear(engine.world);
      Engine.clear(engine);
      render.canvas.remove();
    };
  }, []);

  return (
    <div className="relative flex items-center justify-center w-[560px] h-[560px]">
      <div className="absolute w-full h-full rounded-full bg-[#d1e231]" />
      <div
        ref={canvasRef}
        className="absolute w-full h-full rounded-full overflow-hidden pointer-events-auto"
      />
    </div>
  );
}