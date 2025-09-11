'use client'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { data } from '../js/data.js'

gsap.registerPlugin(ScrollTrigger)

export function Main() {
  const scrollSection = useRef(null)

  useEffect(() => {
    const sectionWrapper = document.querySelector(".section-wrapper")
    const items = document.querySelectorAll(".item")
    const texts = document.querySelectorAll(".item_content")
    const medias = document.querySelectorAll(".item_media")

    const ctx = gsap.context(() => {
      items.forEach((item, i) => {
        if (i !== 0) {
          gsap.set(item, { xPercent: (100 * i) - 20 })
        }
      })

      texts.forEach((text, i) => {
        if (i !== 0) {
          gsap.set(text, { xPercent: -(100 * i) - 60, })
        }
      })

      medias.forEach((media, i) => {
        if (i !== 0) {
          gsap.set(media, { xPercent: -(100 * i) })
        }
      })

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: scrollSection.current,
          pin: true,
          start: 'top top',
          end: () => `+=${items.length * 100}%`,
          scrub: 1,
          invalidateOnRefresh: true,
          markers: true,
        },
        defaults: { ease: 'none' },
      })

      items.forEach((item, i) => {
        tl.to(items[i + 1], {
          xPercent: 0,
        }, '<')
      })
      texts.forEach((text, i) => {
        tl.to(texts[i + 1], {
          xPercent: 0,
        }, '<')
      })
      medias.forEach((media, i) => {
        tl.to(medias[i], {
          scale: 0.8,
        }, '<')
        tl.to(medias[i + 1], {
          xPercent: 0,
        }, '<')
      })
    }, sectionWrapper)

    return () => { ctx.revert() }
  }, [])

  return (
    <div ref={scrollSection} className="scroll-section section border border-lime-300">
      <section className="section-wrapper">
        <div role="list" className="list">
          {data.map((_, i) => (
            <div key={i} role="listitem" className="item">
              <div className="item_background" style={{ backgroundColor: _.backgroundColor }} />
              <div className="item_content">
                {/* <span className="item_number">{_.id}</span> */}
                <h2 className="item_h2">{_.heading}</h2>
                <p className="item_p">{_.description}</p>
              </div>
              <video className="item_media" loading="lazy" autoPlay muted loop>
                <source src={_.media} />
              </video>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

export function OldMain() {
  const containerRef = useRef(null)

  useEffect(() =>{
    let sections = gsap.utils.toArray(".panel_container .panel")

    let ctx = gsap.context(() => {
      const scrollTween = gsap.to(sections, {
        xPercent: -100 * (sections.length - 1),
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          pin: true,
          scrub: 0.1,
          //snap: directionalSnap(1 / (sections.length - 1)),
          end: "+=3000",
        }
      })

      gsap.set([".box-1", ".box-2"], { scale: 0.9, })

      // red section
      gsap.to(".box-1", {
        scale: 1.1,
        duration: 2,
        ease: "elastic",
        scrollTrigger: {
          trigger: ".box-1",
          containerAnimation: scrollTween,
          start: "left center",
          toggleActions: "play none none reset",
          id: "1",
        }
      })

      // gray section
      gsap.to(".box-2", {
        scale: 1.1,
        ease: "none",
        scrollTrigger: {
          trigger: ".box-2",
          containerAnimation: scrollTween,
          start: "center 80%",
          end: "center 20%",
          scrub: true,
          id: "2"
        }
      })

      // purple section
      ScrollTrigger.create({
        trigger: ".box-3",
        containerAnimation: scrollTween,
        toggleClass: "active",
        start: "center 60%",
        id: "3"
      })

      // green section
      ScrollTrigger.create({
        trigger: ".green",
        containerAnimation: scrollTween,
        start: "center 65%",
        end: "center 51%",
        onEnter: () => console.log("enter"),
        onLeave: () => console.log("leave"),
        onEnterBack: () => console.log("enterBack"),
        onLeaveBack: () => console.log("leaveBack"),
        onToggle: self => console.log("active", self.isActive),
        id: "4"
      })

      ScrollTrigger.defaults({ markers: { startColor: "white", endColor: "white" }})
      // only show the relevant section's markers at any given time
      gsap.set(".gsap-marker-start, .gsap-marker-end, .gsap-marker-scroller-start, .gsap-marker-scroller-end", { autoAlpha: 0 });
      ["red","gray","purple","green"].forEach((triggerClass, i) => {
        ScrollTrigger.create({
          trigger: `.${triggerClass}`,
          containerAnimation: scrollTween,
          start: "left 30%",
          end: i === 3 ? "right right" : "right 30%",
          markers: false,
          onToggle: self => gsap.to(`.marker-${i + 1}`, { duration: 0.25, autoAlpha: self.isActive ? 1 : 0 })
        })
      })
    }, containerRef)

    return () => ctx.revert()
  }, [])


  return (
    <div ref={containerRef} className="panel_container">
      <section className="panel grey">
        <p>Scroll down to animate horizontally &gt;</p>
      </section>
      <section className="panel red">
        <div>
          <pre className="code-block">
            <code className="language-js">
              {`gsap.to(".box-1", {
                  y: -130,
                  duration: 2,
                  ease: "elastic",
                  scrollTrigger: {
                    trigger: ".box-1",
                    containerAnimation: scrollTween,
                    start: "left center",
                    toggleActions: "play none none reset"
                  }
                });
              `}
            </code>
          </pre>
          <p>Fire an animation at a particular spot...</p>
        </div>
        <div className="box-1 box gradient-pink">box-1</div>
      </section>
      <section className="panel gray">
        <div>
          <pre className="code-block">
            <code className="language-js">
              {`gsap.to(".box-2", {
                y: -120,
                backgroundColor: "#1e90ff",
                ease: "none",
                scrollTrigger: {
                  trigger: ".box-2",
                  containerAnimation: scrollTween,
                  start: "center 80%",
                  end: "center 20%",
                  scrub: true
                }
              });`}
            </code>
          </pre>
          <p>...or scrub it back &amp; forth with the scrollbar</p>
        </div>
        <div className="box-2 box">box-2</div>
      </section>
      <section className="panel purple">
        <div>
          <pre className="code-block">
            <code className="language-js">
              {`ScrollTrigger.create({
                trigger: ".box-3",
                containerAnimation: scrollTween,
                toggleClass: "active",
                start: "center 60%"
              });`}
            </code>
          </pre>
          <p>Toggle a CSS class</p>
        </div>
        <div className="box-3 box">box-3</div>
      </section>
      <section className="panel green">
        <div>
          <pre className="code-block">
            <code className="language-js">
              {`ScrollTrigger.create({
                trigger: ".green",
                containerAnimation: scrollTween,
                start: "center 65%",
                end: "center 51%",
                onEnter: () => console.log("enter"),
                onLeave: () => console.log("leave"),
                onEnterBack: () => console.log("enterBack"),
                onLeaveBack: () => console.log("leaveBack"),
                onToggle: self => console.log("active", self.isActive)
              });`}
            </code>
          </pre>
          <p>Use the rich callback system</p>
        </div>
      </section>
    </div>
  )
}