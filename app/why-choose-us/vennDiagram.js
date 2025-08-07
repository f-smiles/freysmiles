import { useEffect, useRef } from 'react'
import Matter from 'matter-js'

export default function VennDiagram() {
  const leftSphereCanvas = useRef(null)
  const rightSphereCanvas = useRef(null)

  const { Engine, Render, Runner, Bodies, Composite, World, Mouse, MouseConstraint } = Matter

  const freysmilesTexturePaths = [
    { path: "/../../images/circle_text/staggertext1.svg" },
    { path: "/../../images/circle_text/staggertext2.svg" },
    { path: "/../../images/circle_text/staggertext4.svg" },
    { path: "/../../images/circle_text/staggertext5.svg" },
    { path: "/../../images/circle_text/staggertext6.svg" },

  ]

  const othersTexturePaths = [
    { path: "/../../images/circle_text/staggertext7.svg" },
  ]

  const createLeftSphereCanvas = () => {
    // create engine
    let engine = Engine.create()
    engine.gravity.y = 1
    engine.gravity.x = 0
    engine.gravity.scale = 0.0025

    // create a renderer
    let render = Render.create({
      
      element: leftSphereCanvas.current,
      engine: engine,
      options: {
        isSensor: true,
        width: leftSphereCanvas.current.offsetWidth,
        height: leftSphereCanvas.current.offsetHeight,
        background: "transparent",
        wireframes: false,
      },
    })
    render.context.imageSmoothingEnabled = false
render.context.webkitImageSmoothingEnabled = false
render.context.mozImageSmoothingEnabled = false


    let sW = leftSphereCanvas.current.offsetWidth
    let halfsW = sW / 2
    let circleW = sW / 10

    // create stack circles
    let stack = []
    for (let i = 0; i < 5; i++) {
      stack.push(
        Bodies.circle(halfsW, halfsW, circleW, {
          density: 0.00001,
          restitution: 0.5,
          density: 0.05,
          collisionFilter: {
            category: 0x0003,
            mask: 0x0003 | 0x0001,
          },
          render: {
            fillStyle: "#9dbb81",
            strokeStyle: '#222222',
            sprite: {
              texture: freysmilesTexturePaths[i % freysmilesTexturePaths.length].path,
              xScale: 0.2,
              yScale: 0.2,
            }
          }
          
        })
      )
    }
    Composite.add(engine.world, stack)

    // add mouse control
    let mouse = Mouse.create(render.canvas),
      mouseConstraint = MouseConstraint.create(engine, {
        mouse: mouse,
        constraint: {
          stiffness: 0.2,
          render: {
            visible: false,
          },
        },
      })
      
    mouseConstraint.mouse.element.removeEventListener("mousewheel", mouseConstraint.mouse.mousewheel)
    mouseConstraint.mouse.element.removeEventListener("DOMMouseScroll", mouseConstraint.mouse.mousewheel)
    Composite.add(engine.world, mouseConstraint)
    Matter.Events.on(mouseConstraint, 'mousemove', (event) => {
  const foundBodies = Matter.Query.point(stack, event.mouse.position);
  shakeScene(engine, foundBodies);
});

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
    
    // keep the mouse in sync with rendering
    render.mouse = mouse

    // create static rectangular bodies arranged in a circular pattern on the canvas; each body is positioned based on trigonometric calculations to ensure even distribution
    let r = sW / 2
    let parts = []
    let pegCount = 32
    const TAU = Math.PI * 2
    for (let i = 0; i < pegCount; i++) {
      let segment = TAU / pegCount
      let angle2 = (i / pegCount) * TAU + segment / 2
      let x2 = Math.cos(angle2)
      let y2 = Math.sin(angle2)
      let cx2 = x2 * r + sW / 2
      let cy2 = y2 * r + sW / 2
      let rect = addRect({
        x: cx2,
        y: cy2,
        w: 10 / 1000 * sW,
        h: 400 / 1000 * sW,
        options: {
          angle: angle2,
          isStatic: true,
          density: 1,
          render: {
            fillStyle: 'transparent',
            strokeStyle: 'transparent',
            lineWidth: 0,
          },
        },
      })
      parts.push(rect)
    }
    function addBody(...bodies) {
      World.add(engine.world, ...bodies)
    }
    function addRect({ x = 0, y = 0, w = 10, h = 10, options = {} } = {}) {
      let body = Bodies.rectangle(x, y, w, h, options)
      addBody(body)
      return body
    }

    Render.run(render)
    let runner = Runner.create()
    Runner.run(runner, engine)

const resizeLeftSphereCanvas = async () => {
  if (!leftSphereCanvas.current) return;

  // Store current positions and velocities
  const bodyStates = stack.map(body => ({
    position: Matter.Vector.clone(body.position),
    velocity: Matter.Vector.clone(body.velocity),
    angularVelocity: body.angularVelocity
  }));

  // Update dimensions
  sW = leftSphereCanvas.current.offsetWidth;
  let sH = leftSphereCanvas.current.offsetHeight;
  halfsW = sW / 2;
  circleW = sW / 10;

  // Update renderer
  render.bounds.max.x = sW;
  render.bounds.max.y = sH;
  render.options.width = sW;
  render.options.height = sH;
  render.canvas.width = sW * window.devicePixelRatio;
  render.canvas.height = sH * window.devicePixelRatio;
  render.canvas.style.width = `${sW}px`;
  render.canvas.style.height = `${sH}px`;

  // Clear and recreate world
  Composite.clear(engine.world, false);

  // Recreate boundary walls
  let r = sW / 2;
  parts = [];
  for (let i = 0; i < pegCount; i++) {
    let segment = TAU / pegCount;
    let angle2 = (i / pegCount) * TAU + segment / 2;
    let cx2 = Math.cos(angle2) * r + sW / 2;
    let cy2 = Math.sin(angle2) * r + sW / 2;
    let rect = Bodies.rectangle(cx2, cy2, 10 / 1000 * sW, 400 / 1000 * sW, {
      angle: angle2,
      isStatic: true,
      density: 1,
      render: {
        fillStyle: 'transparent',
        strokeStyle: 'transparent',
        lineWidth: 0,
      },
    });
    parts.push(rect);
  }
  Composite.add(engine.world, parts);

  // Recreate stack with previous states
  stack = [];
  for (let i = 0; i < 5; i++) {
    const body = Bodies.circle(
      bodyStates[i]?.position.x || halfsW,
      bodyStates[i]?.position.y || halfsW,
      circleW,
      {
        density: 0.00001,
        restitution: 0.5,
        collisionFilter: {
          category: 0x0003,
          mask: 0x0003 | 0x0001,
        },
        render: {
          fillStyle: "#9dbb81",
          strokeStyle: '#222222',
          sprite: {
            texture: freysmilesTexturePaths[i % freysmilesTexturePaths.length].path,
            xScale: 0.2,
            yScale: 0.2,
          }
        }
      }
    );
    
    if (bodyStates[i]) {
      Matter.Body.setVelocity(body, bodyStates[i].velocity);
      body.angularVelocity = bodyStates[i].angularVelocity;
    }
    
    stack.push(body);
  }
  Composite.add(engine.world, stack);

  // Reinitialize mouse constraint
  if (mouseConstraint) {
    World.remove(engine.world, mouseConstraint);
  }
  
  mouse = Mouse.create(render.canvas);
  mouseConstraint = MouseConstraint.create(engine, {
    mouse: mouse,
    constraint: {
      stiffness: 0.2,
      render: { visible: false },
    },
  });
  mouseConstraint.mouse.element.removeEventListener("mousewheel", mouseConstraint.mouse.mousewheel);
  mouseConstraint.mouse.element.removeEventListener("DOMMouseScroll", mouseConstraint.mouse.mousewheel);
  Composite.add(engine.world, mouseConstraint);

  Matter.Events.on(mouseConstraint, 'mousemove', (event) => {
    const foundBodies = Matter.Query.point(stack, event.mouse.position);
    shakeScene(engine, foundBodies);
  });
};
    const resizeRightSphereCanvas = async () => {
  if (!rightSphereCanvas.current) return;

  // Store current positions and velocities
  const bodyStates = stack.map(body => ({
    position: Matter.Vector.clone(body.position),
    velocity: Matter.Vector.clone(body.velocity),
    angularVelocity: body.angularVelocity
  }));

  // Update dimensions
  sW = rightSphereCanvas.current.offsetWidth;
  let sH = rightSphereCanvas.current.offsetHeight;
  halfsW = sW / 2;
  circleW = sW / 10;

  // Update renderer
  render.bounds.max.x = sW;
  render.bounds.max.y = sH;
  render.options.width = sW;
  render.options.height = sH;
  render.canvas.width = sW * window.devicePixelRatio;
  render.canvas.height = sH * window.devicePixelRatio;
  render.canvas.style.width = `${sW}px`;
  render.canvas.style.height = `${sH}px`;

  // Clear and recreate world
  Composite.clear(engine.world, false);

  // Recreate boundary walls
  let r = sW / 2;
  parts = [];
  for (let i = 0; i < pegCount; i++) {
    let segment = TAU / pegCount;
    let angle2 = (i / pegCount) * TAU + segment / 2;
    let cx2 = Math.cos(angle2) * r + sW / 2;
    let cy2 = Math.sin(angle2) * r + sW / 2;
    let rect = Bodies.rectangle(cx2, cy2, 10 / 1000 * sW, 400 / 1000 * sW, {
      angle: angle2,
      isStatic: true,
      density: 1,
      render: {
        fillStyle: 'transparent',
        strokeStyle: 'transparent',
        lineWidth: 0,
      },
    });
    parts.push(rect);
  }
  Composite.add(engine.world, parts);

  // Recreate stack with previous states
  stack = [];
  for (let i = 0; i < 1; i++) {
    const body = Bodies.circle(
      bodyStates[i]?.position.x || halfsW,
      bodyStates[i]?.position.y || halfsW,
      circleW,
      {
        density: 0.00001,
        restitution: 0.5,
        collisionFilter: {
          category: 0x0003,
          mask: 0x0003 | 0x0001,
        },
        render: {
          fillStyle: "#f2f2f2",
          strokeStyle: 'white',
          sprite: {
            texture: othersTexturePaths[i % othersTexturePaths.length].path,
            xScale: 0.15,
            yScale: 0.15,
          }
        }
      }
    );
    
    if (bodyStates[i]) {
      Matter.Body.setVelocity(body, bodyStates[i].velocity);
      body.angularVelocity = bodyStates[i].angularVelocity;
    }
    
    stack.push(body);
  }
  Composite.add(engine.world, stack);

  // Reinitialize mouse constraint
  if (mouseConstraint) {
    World.remove(engine.world, mouseConstraint);
  }
  
  mouse = Mouse.create(render.canvas);
  mouseConstraint = MouseConstraint.create(engine, {
    mouse: mouse,
    constraint: {
      stiffness: 0.2,
      render: { visible: false },
    },
  });
  mouseConstraint.mouse.element.removeEventListener("mousewheel", mouseConstraint.mouse.mousewheel);
  mouseConstraint.mouse.element.removeEventListener("DOMMouseScroll", mouseConstraint.mouse.mousewheel);
  Composite.add(engine.world, mouseConstraint);
};
    window.addEventListener('resize', resizeLeftSphereCanvas, resizeRightSphereCanvas)
  }

  const createRightSphereCanvas = () => {
    // create engine
    let engine = Engine.create()
    engine.gravity.y = 1
    engine.gravity.x = 0
    engine.gravity.scale = 0.0025

    // create a renderer
    let render = Render.create({
      element: rightSphereCanvas.current,
      engine: engine,
      options: {
        isSensor: true,
        width: rightSphereCanvas.current.offsetWidth,
        height: rightSphereCanvas.current.offsetHeight,
        background: "transparent",
        wireframes: false,
      },
    })
    render.context.imageSmoothingEnabled = false;
    render.context.webkitImageSmoothingEnabled = false;
    render.context.mozImageSmoothingEnabled = false;
    
    let sW = rightSphereCanvas.current.offsetWidth
    let halfsW = sW / 2
    let circleW = sW / 10

    // create stack circles
    let stack = []
    for (let i = 0; i < 1; i++) {
      stack.push(
        Bodies.circle(halfsW, halfsW, circleW, {
          density: 0.00001,
          restitution: 0.5,
          density: 0.05,
          collisionFilter: {
            category: 0x0003,
            mask: 0x0003 | 0x0001,
          },
          render: {
            fillStyle: "#f2f2f2",
            strokeStyle: 'white',
            sprite: {
              texture: othersTexturePaths[i % othersTexturePaths.length].path,
              xScale: 0.15,
              yScale: 0.15,
            }
          },
        })
      )
    }
    Composite.add(engine.world, stack)

    // add mouse control
    let mouse = Mouse.create(render.canvas),
      mouseConstraint = MouseConstraint.create(engine, {
        mouse: mouse,
        constraint: {
          stiffness: 0.2,
          render: {
            visible: false,
          },
        },
      })
    mouseConstraint.mouse.element.removeEventListener("mousewheel", mouseConstraint.mouse.mousewheel)
    mouseConstraint.mouse.element.removeEventListener("DOMMouseScroll", mouseConstraint.mouse.mousewheel)
    Composite.add(engine.world, mouseConstraint)

    // keep the mouse in sync with rendering
    render.mouse = mouse

    // create static rectangular bodies arranged in a circular pattern on the canvas; each body is positioned based on trigonometric calculations to ensure even distribution
    let r = sW / 2
    let parts = []
    let pegCount = 32
    const TAU = Math.PI * 2
    for (let i = 0; i < pegCount; i++) {
      let segment = TAU / pegCount
      let angle2 = (i / pegCount) * TAU + segment / 2
      let x2 = Math.cos(angle2)
      let y2 = Math.sin(angle2)
      let cx2 = x2 * r + sW / 2
      let cy2 = y2 * r + sW / 2
      let rect = addRect({
        x: cx2,
        y: cy2,
        w: 10 / 1000 * sW,
        h: 400 / 1000 * sW,
        options: {
          angle: angle2,
          isStatic: true,
          density: 1,
          render: {
            fillStyle: 'transparent',
            strokeStyle: 'transparent',
            lineWidth: 0,
          },
        },
      })
      parts.push(rect)
    }
    function addBody(...bodies) {
      World.add(engine.world, ...bodies)
    }
    function addRect({ x = 0, y = 0, w = 10, h = 10, options = {} } = {}) {
      let body = Bodies.rectangle(x, y, w, h, options)
      addBody(body)
      return body
    }

    Render.run(render)
    let runner = Runner.create()
    Runner.run(runner, engine)

const resizeRightSphereCanvas = async () => {
  if (!rightSphereCanvas.current) return;

  // Store current positions and velocities
  const bodyStates = stack.map(body => ({
    position: Matter.Vector.clone(body.position),
    velocity: Matter.Vector.clone(body.velocity),
    angularVelocity: body.angularVelocity
  }));

  // Update dimensions
  sW = rightSphereCanvas.current.offsetWidth;
  let sH = rightSphereCanvas.current.offsetHeight;
  halfsW = sW / 2;
  circleW = sW / 10;

  // Update renderer
  render.bounds.max.x = sW;
  render.bounds.max.y = sH;
  render.options.width = sW;
  render.options.height = sH;
  render.canvas.width = sW * window.devicePixelRatio;
  render.canvas.height = sH * window.devicePixelRatio;
  render.canvas.style.width = `${sW}px`;
  render.canvas.style.height = `${sH}px`;

  // Clear and recreate world
  Composite.clear(engine.world, false);

  // Recreate boundary walls
  let r = sW / 2;
  parts = [];
  for (let i = 0; i < pegCount; i++) {
    let segment = TAU / pegCount;
    let angle2 = (i / pegCount) * TAU + segment / 2;
    let cx2 = Math.cos(angle2) * r + sW / 2;
    let cy2 = Math.sin(angle2) * r + sW / 2;
    let rect = Bodies.rectangle(cx2, cy2, 10 / 1000 * sW, 400 / 1000 * sW, {
      angle: angle2,
      isStatic: true,
      density: 1,
      render: {
        fillStyle: 'transparent',
        strokeStyle: 'transparent',
        lineWidth: 0,
      },
    });
    parts.push(rect);
  }
  Composite.add(engine.world, parts);

  // Recreate stack with previous states
  stack = [];
  for (let i = 0; i < 1; i++) {
    const body = Bodies.circle(
      bodyStates[i]?.position.x || halfsW,
      bodyStates[i]?.position.y || halfsW,
      circleW,
      {
        density: 0.00001,
        restitution: 0.5,
        collisionFilter: {
          category: 0x0003,
          mask: 0x0003 | 0x0001,
        },
        render: {
          fillStyle: "#f2f2f2",
          strokeStyle: 'white',
          sprite: {
            texture: othersTexturePaths[i % othersTexturePaths.length].path,
            xScale: 0.15,
            yScale: 0.15,
          }
        }
      }
    );
    
    if (bodyStates[i]) {
      Matter.Body.setVelocity(body, bodyStates[i].velocity);
      body.angularVelocity = bodyStates[i].angularVelocity;
    }
    
    stack.push(body);
  }
  Composite.add(engine.world, stack);

  // Reinitialize mouse constraint
  if (mouseConstraint) {
    World.remove(engine.world, mouseConstraint);
  }
  
  mouse = Mouse.create(render.canvas);
  mouseConstraint = MouseConstraint.create(engine, {
    mouse: mouse,
    constraint: {
      stiffness: 0.2,
      render: { visible: false },
    },
  });
  mouseConstraint.mouse.element.removeEventListener("mousewheel", mouseConstraint.mouse.mousewheel);
  mouseConstraint.mouse.element.removeEventListener("DOMMouseScroll", mouseConstraint.mouse.mousewheel);
  Composite.add(engine.world, mouseConstraint);
};
    window.addEventListener('resize', resizeRightSphereCanvas)
  }

  useEffect(() => {
    if (leftSphereCanvas.current && rightSphereCanvas.current) {
      createLeftSphereCanvas()
      createRightSphereCanvas()
    }
  }, [])

  return (
    <div className="relative">
    <div className="absolute inset-0 z-0 pointer-events-none grid-overlay" />
<div className="z-10 flex items-end justify-center gap-12">

  <div className="flex flex-col items-center">
  <div className="mt-4 text-center font-neuehaas45 text-[20px]">Our Office</div>
    <div
      ref={leftSphereCanvas}
      className="w-[700px] h-[700px] rounded-full border border-black overflow-hidden"
    />

  </div>
  
  <div className="flex flex-col items-center">
  <div className="mt-4 text-center font-neuehaas45 text-[20px]">Their Office</div>
    <div
      ref={rightSphereCanvas}
      className="w-[700px] h-[700px] rounded-full border border-black overflow-hidden"
    />

  </div>
</div>
</div>
  )
}