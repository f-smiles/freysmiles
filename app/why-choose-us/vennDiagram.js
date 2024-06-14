import { useEffect, useRef } from 'react'
import Matter from 'matter-js'

export default function VennDiagram() {
  const leftSphereCanvas = useRef(null)
  const rightSphereCanvas = useRef(null)

  const { Engine, Render, Runner, Bodies, Composite, World, Mouse, MouseConstraint } = Matter

  const freysmilesTexturePaths = [
    { path: "/../../images/circle_text/freysmiles_text_1.svg" },
    { path: "/../../images/circle_text/freysmiles_text_2.svg" },
    { path: "/../../images/circle_text/freysmiles_text_3.svg" },
    { path: "/../../images/circle_text/freysmiles_text_4.svg" },
    { path: "/../../images/circle_text/freysmiles_text_5.svg" },
  ]

  const othersTexturePaths = [
    { path: "/../../images/circle_text/others_text_1.svg" },
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
              xScale: 0.3,
              yScale: 0.3,
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

    const resizeLeftSphereCanvas = async () => {
      if (!leftSphereCanvas.current) return

      await Composite.clear(engine.world, stack)

      sW = leftSphereCanvas.current.offsetWidth
      halfsW = sW / 2
      circleW = sW / 10
      let sH = leftSphereCanvas.current.offsetHeight
      render.bounds.max.x = sW
      render.bounds.max.y = sH
      render.options.width = sW
      render.options.height = sH
      render.canvas.width = sW
      render.canvas.height = sH

      let newStack = []
      for (let i = 0; i < 5; i++) {
        newStack.push(
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
                xScale: 0.3,
                yScale: 0.3,
              }
            },
          })
        )
      }
      Composite.add(engine.world, newStack)
      Composite.add(engine.world, mouseConstraint)
    }
    window.addEventListener('resize', resizeLeftSphereCanvas)
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
              xScale: 0.3,
              yScale: 0.3,
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
      if (!rightSphereCanvas.current) return

      await Composite.clear(engine.world, stack)

      sW = rightSphereCanvas.current.offsetWidth
      let sH = rightSphereCanvas.current.offsetHeight
      let halfsW = sW / 2
      let circleW = sW / 10
      render.bounds.max.x = sW
      render.bounds.max.y = sH
      render.options.width = sW
      render.options.height = sH
      render.canvas.width = sW
      render.canvas.height = sH

      let newStack = []
      for (let i = 0; i < 1; i++) {
        newStack.push(
          Bodies.circle(halfsW, halfsW, circleW, {
            density: 0.00001,
            restitution: 0.5,
            density: 0.05,
            collisionFilter: {
              category: 0x0003,
              mask: 0x0003 | 0x0001,
            },
            render: {
              fillStyle: "#555555",
              strokeStyle: "white",
              lineWidth: 2,
              sprite: {
                texture: othersTexturePaths[i % othersTexturePaths.length].path,
                xScale: 0.3,
                yScale: 0.3,
              }
            },
          })
        )
      }
      Composite.add(engine.world, newStack)
      Composite.add(engine.world, mouseConstraint)
    }
    window.addEventListener('resize', resizeRightSphereCanvas)
  }

  useEffect(() => {
    if (leftSphereCanvas.current && rightSphereCanvas.current) {
      createLeftSphereCanvas()
      createRightSphereCanvas()
    }
  }, [])

  return (
    <div className="sphere">
      <div className="translate-x-10 sphere-item">
        <div ref={leftSphereCanvas} id="sphere-real"></div>
        <div className="sphere-item__text">FreySmiles Orthodontics</div>
      </div>
      <div className="-translate-x-10 sphere-item">
        <div ref={rightSphereCanvas} id="sphere-real"></div>
        <div className="sphere-item__text">Others</div>
      </div>
    </div>
  )
}