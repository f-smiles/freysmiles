'use client'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'

gsap.registerPlugin(ScrollTrigger, SplitText)

export function Main() {
  const mainSection = useRef(null)
  const itemsContainer = useRef(null)

  useEffect(() => {
    const items = document.querySelectorAll('.MainSectionItem')
    const innerItems = document.querySelectorAll('.MainSectionItem-inner')
    const innerStickies = document.querySelectorAll('.MainSectionItem-innerSticky')
    const imageContainers = document.querySelectorAll('.MainSectionItem-imageContainer')
    const imageContainersInner = document.querySelectorAll('.MainSectionItem-imageContainerInner')
    // const images = document.querySelectorAll('.MainSectionItem-image')
    // const headTitle = document.querySelector('.MainSection-headTitle')

    let mm = gsap.matchMedia()

    mm.add('(max-width: 1079px)', () => {
      const mobile = gsap.context(() => {
        innerStickies.forEach((item, i) => {
          ScrollTrigger.create({
            trigger: item,
            start: () => item.offsetHeight < window.innerHeight ? 'top top' : 'bottom bottom',
            pin: true,
            pinSpacing: false,
            invalidateOnRefresh: true,
            markers: true,
          })
        })
      }, itemsContainer.current)
      return () => mobile.revert()
    })

    mm.add('(min-width: 1080px)', () => {
      const desktop = gsap.context(() => {
        let tl = gsap.timeline({
          scrollTrigger: {
            trigger: mainSection.current,
            start: 'top top',
            end: `+=${items.length * 100}%`,
            pin: true,
            scrub: 1, // true
            invalidateOnRefresh: true,
            markers: true,
          },
          defaults: { ease: 'none' },
        })

        tl.fromTo(items[0], { xPercent: 0 }, { xPercent: -100 }, '<')
        tl.fromTo(innerItems[0], { xPercent: 0 }, { xPercent: 100 }, '<')
        tl.fromTo(imageContainers[0], { xPercent: -60, transformOrigin: '100% 100% 0px' }, { xPercent: -150, scale: 0.8 }, '<')
        tl.fromTo(imageContainersInner[0], { xPercent: 0, transformOrigin: '50% 50% 0px' }, { xPercent: -150, scale: 1.2 }, '<')

        tl.fromTo(items[1], { xPercent: 80 }, { xPercent: -100 }, '<')
        tl.fromTo(innerItems[1], { xPercent: -80 }, { xPercent: 100}, '<')
        tl.fromTo(imageContainers[1], { xPercent: -15, scale: 0.45, transformOrigin: '100% 100% 0px' }, { xPercent: -150, scale: 0.8 }, '<')
        tl.fromTo(imageContainersInner[1], { xPercent: 0, scale: 1.55, transformOrigin: '50% 50% 0px' }, { xPercent: -150, scale: 1.2 }, '<')

        tl.fromTo(items[2], { xPercent: 95 }, { xPercent: -100 }, '<')
        tl.fromTo(innerItems[2], { xPercent: -95 }, { xPercent: 100 }, '<')
        tl.fromTo(imageContainers[2], { xPercent: 0, scale: 0.15, transformOrigin: '100% 100% 0px' }, { xPercent: -150, scale: 0.8 }, '<')
        tl.fromTo(imageContainersInner[2], { xPercent: 0, scale: 1.85, transformOrigin: '50% 50% 0px' }, { xPercent: -150, scale: 1.2 }, '<')

        tl.fromTo(items[3], { xPercent: 100 }, { xPercent: -100 }, '<')
        tl.fromTo(innerItems[3], { xPercent: -100 }, { xPercent: 100 }, '<')
        tl.fromTo(imageContainers[3], { xPercent: 0, scale: 0, transformOrigin: '100% 100% 0px' }, { xPercent: -150, scale: 0.8 }, '<')
        tl.fromTo(imageContainersInner[3], { xPercent: 0, scale: 2, transformOrigin: '50% 50% 0px' }, { xPercent: -150, scale: 1.2 }, '<')

        tl.fromTo(items[4], { xPercent: 100 }, { xPercent: 0 }, '<')
        tl.fromTo(innerItems[4], { xPercent: -100 }, { xPercent: 0 }, '<')
        tl.fromTo(imageContainers[4], { xPercent: 0, scale: 0, transformOrigin: '100% 100% 0px' }, { xPercent: -150, scale: 0.8 }, '<')
        tl.fromTo(imageContainersInner[4], { xPercent: 0, scale: 2, transformOrigin: '50% 50% 0px' }, { xPercent: -150, scale: 1.2 }, '<')
      }, mainSection.current)
      return () => desktop.revert()
    })
    
    return () => mm.revert()
  }, [])
  
  return (
    <div ref={mainSection} className="MainSection` --dark --in-view" style={{ backgroundColor: 'var(--blue)', '--91c5acce': 5, }}>
      <div className="MainSection-wrap">
        <div ref={itemsContainer} className="MainSection-items">
          <div className="MainSectionItem MainSection-item">
            <div className="--index-first MainSectionItem-inner">
              <div className="MainSectionItem-innerSticky">
                <div className="MainSectionItem-background" style={{ backgroundColor: 'var(--blue)', }} />
                <div className="MainSectionItem-content">
                  <span className="MainSectionItem-index">01</span>
                  <h3 className="MainSectionItem-contentTitle AppTitle-3">Wildlife in Action: A Glimpse into Nature's Daily Drama</h3>
                  <div className="MainSectionItem-contentText">
                    <div className="AppText-12 ">
                      <p>Explore the untouched beauty of forests, mountains, and rivers as we uncover the hidden secrets of nature's most breathtaking landscapes.</p>
                    </div>
                  </div>
                </div>
                <div className="MainSectionItem-imageContainer">
                  <div className="MainSectionItem-imageContainerInner">
                    <div className="AppImage MainSectionItem-image">
                      <div className="AppImage-image --placeholder --lazy --loaded" style={{ objectFit: 'cover', backgroundImage: "url('/images/test/1.jpg')", backgroundSize: 'cover', backgroundPosition: 'center center', }} ></div>
                      <img src="/images/test/1.jpg" width="480" height="348" alt="Video of a landscape" loading="lazy" style={{ objectFit: 'cover' }}></img>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="MainSectionItem MainSection-item">
            <div className="--index-between MainSectionItem-inner">
              <div className="MainSectionItem-innerSticky">
                <div className="MainSectionItem-background" style={{ backgroundColor: 'var(--pink)', }} />
                <div className="MainSectionItem-content">
                  <span className="MainSectionItem-index">02</span>
                  <h3 className="MainSectionItem-contentTitle AppTitle-3">Nature's Symphony: The Sounds That Heal the Soul</h3>
                  <div className="MainSectionItem-contentText">
                    <div className="AppText-12 ">
                      <p>Immerse yourself in the soothing sounds of chirping birds, rustling leaves, and flowing streams - nature's music for peace and tranquility.</p>
                    </div>
                  </div>
                </div>
                <div className="MainSectionItem-imageContainer">
                  <div className="MainSectionItem-imageContainerInner">
                    <div className="AppImage MainSectionItem-image">
                      <div className="AppImage-image --placeholder --lazy --loaded" style={{ objectFit: 'cover', backgroundImage: "url('/images/test/2.jpg')", backgroundSize: 'cover', backgroundPosition: 'center center', }} ></div>
                      <img src="/images/test/2.jpg" width="480" height="348" alt="Video of a landscape" loading="lazy" style={{ objectFit: 'cover' }}></img>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="MainSectionItem MainSection-item">
            <div className="--index-between MainSectionItem-inner">
              <div className="MainSectionItem-innerSticky">
                <div className="MainSectionItem-background" style={{ backgroundColor: 'var(--green)', }} />
                <div className="MainSectionItem-content">
                  <span className="MainSectionItem-index">03</span>
                  <h3 className="MainSectionItem-contentTitle AppTitle-3">Wildlife in Action: A Glimpse into Nature's Daily Drama</h3>
                  <div className="MainSectionItem-contentText">
                    <div className="AppText-12 ">
                      <p>Explore the untouched beauty of forests, mountains, and rivers as we uncover the hidden secrets of nature's most breathtaking landscapes.</p>
                    </div>
                  </div>
                </div>
                <div className="MainSectionItem-imageContainer">
                  <div className="MainSectionItem-imageContainerInner">
                    <div className="AppImage MainSectionItem-image">
                      <div className="AppImage-image --placeholder --lazy --loaded" style={{ objectFit: 'cover', backgroundImage: "url('/images/test/3.jpg')", backgroundSize: 'cover', backgroundPosition: 'center center', }} ></div>
                      <img src="/images/test/3.jpg" width="480" height="348" alt="Video of a landscape" loading="lazy" style={{ objectFit: 'cover' }}></img>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="MainSectionItem MainSection-item">
            <div className="--index-between MainSectionItem-inner">
              <div className="MainSectionItem-innerSticky">
                <div className="MainSectionItem-background" style={{ backgroundColor: 'var(--beige)', }} />
                <div className="MainSectionItem-content">
                  <span className="MainSectionItem-index">04</span>
                  <h3 className="MainSectionItem-contentTitle AppTitle-3">The Power of Nature: How It Shapes Our World</h3>
                  <div className="MainSectionItem-contentText">
                    <div className="AppText-12 ">
                      <p>Dive into the incredible forces of nature - from roaring waterfalls to mighty hurricanes - and see how they sculpt the earth we live on.</p>
                    </div>
                  </div>
                </div>
                <div className="MainSectionItem-imageContainer">
                  <div className="MainSectionItem-imageContainerInner">
                    <div className="AppImage MainSectionItem-image">
                      <div className="AppImage-image --placeholder --lazy --loaded" style={{ objectFit: 'cover', backgroundImage: "url('/images/test/base.jpg')", backgroundSize: 'cover', backgroundPosition: 'center center', }} ></div>
                      <img src="/images/test/base.jpg" width="480" height="348" alt="Video of a landscape" loading="lazy" style={{ objectFit: 'cover' }}></img>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="MainSectionItem --bg-terra MainSection-item">
            <div className="--index-last MainSectionItem-inner">
              <div className="MainSectionItem-innerSticky">
                <div className="MainSectionItem-background" style={{ backgroundColor: 'var(--terra)', }} />
                <div className="MainSectionItem-content">
                  <span className="MainSectionItem-index">05</span>
                  <h3 className="MainSectionItem-contentTitle AppTitle-3">Nature's Symphony: The Sounds That Heal the Soul</h3>
                  <div className="MainSectionItem-contentText">
                    <div className="AppText-12 ">
                      <p>Immerse yourself in the soothing sounds of chirping birds, rustling leaves, and flowing streams - nature's music for peace and tranquility.</p>
                    </div>
                  </div>
                </div>
                <div className="MainSectionItem-imageContainer">
                  <div className="MainSectionItem-imageContainerInner">
                    <div className="AppImage MainSectionItem-image">
                      <div className="AppImage-image --placeholder --lazy --loaded" style={{ objectFit: 'cover', backgroundImage: "url('/images/test/hover.jpg')", backgroundSize: 'cover', backgroundPosition: 'center center', }} ></div>
                      <img src="/images/test/hover.jpg" width="480" height="348" alt="Video of a landscape" loading="lazy" style={{ objectFit: 'cover' }}></img>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="MainSection-nav">
          <div className="MainSection-navItem AppSmallText-1">
            <span>01</span>
            <span className="MainSection-navItemTitle">Section One</span>
          </div>
          <div className="MainSection-navItem AppSmallText-1">
            <span>02</span>
            <span className="MainSection-navItemTitle" style={{ translate: "none", rotate: "none", scale: "none", transform: "translate3d(0px, 5rem, 0px)" }}>Section Two</span>
          </div>
          <div className="MainSection-navItem AppSmallText-1">
            <span>03</span>
            <span className="MainSection-navItemTitle" style={{ translate: "none", rotate: "none", scale: "none", transform: "translate3d(0px, 5rem, 0px)" }}>Section Three</span>
          </div>
          <div className="MainSection-navItem AppSmallText-1">
            <span>04</span>
            <span className="MainSection-navItemTitle" style={{ translate: "none", rotate: "none", scale: "none", transform: "translate3d(0px, 5rem, 0px)" }}>Section Four</span>
          </div>
          <div className="MainSection-navItem AppSmallText-1">
            <span>05</span>
            <span className="MainSection-navItemTitle">Section Five</span>
          </div>
          <div className="MainSection-navProgress">
            <span className="MainSection-navProgressBar" style={{ translate: "none", rotate: "none", scale: "none", transform: "translate3d(-80%, 0px, 0px)" }}></span>
          </div>
        </div>
      </div>
    </div>
  )
}

// let splitheadTitle = SplitText.create(headTitle, { type: 'chars, words', charsClass: 'chars' })
// gsap.from(splitheadTitle.chars, {
//   y: 50,
//   transformOrigin: "0% 50% -50",
//   duration: 3,
//   ease: 'back',
//   stagger: 0.05,
//   onComplete: () => {
//     splitheadTitle.revert()
//     headTitle.removeAttribute("aria-hidden")
//   }
// })

{/* <div className="MainSection-head">
  <h2 className="SplitText AnimatedSplitText --anim-title MainSection-headTitle AppTitle-1 --in-view" style={{ opacity: 1, visibility: "inherit" }}>
    <div style={{ display: "block", textAlign: "start", position: "relative" }} className="head-lines head-lines1">
      <div className="chars-wrapper">
        <div
          style={{
            position: "relative",
            display: "inline-block",
            translate: "none",
            rotate: "none",
            scale: "none",
            transformOrigin: "50% 100% 0px",
            opacity: 1,
            visibility: "inherit",
            transform: "translate3d(0px, 0px, 0px)"
          }}
          className="chars chars1"
        >
          H
        </div>
      </div>
      <div className="chars-wrapper">
        <div
          style={{
            position: "relative",
            display: "inline-block",
            translate: "none",
            rotate: "none",
            scale: "none",
            transformOrigin: "50% 100% 0px",
            opacity: 1,
            visibility: "inherit",
            transform: "translate3d(0px, 0px, 0px)"
          }}
          className="chars chars2"
        >
          e
        </div>
      </div>
      <div className="chars-wrapper">
        <div
          style={{
            position: "relative",
            display: "inline-block",
            translate: "none",
            rotate: "none",
            scale: "none",
            transformOrigin: "50% 100% 0px",
            opacity: 1,
            visibility: "inherit",
            transform: "translate3d(0px, 0px, 0px)"
          }}
          className="chars chars3"
        >
          a
        </div>
      </div>
      <div className="chars-wrapper">
        <div
          style={{
            position: "relative",
            display: "inline-block",
            translate: "none",
            rotate: "none",
            scale: "none",
            transformOrigin: "50% 100% 0px",
            opacity: 1,
            visibility: "inherit",
            transform: "translate3d(0px, 0px, 0px)"
          }}
          className="chars chars4"
        >
          d
        </div>
      </div>
      <div className="chars-wrapper">
        <div
          style={{
            position: "relative",
            display: "inline-block",
            translate: "none",
            rotate: "none",
            scale: "none",
            transformOrigin: "50% 100% 0px",
            opacity: 1,
            visibility: "inherit",
            transform: "translate3d(0px, 0px, 0px)"
          }}
          className="chars chars5"
        >
          i
        </div>
      </div>
      <div className="chars-wrapper">
        <div
          style={{
            position: "relative",
            display: "inline-block",
            translate: "none",
            rotate: "none",
            scale: "none",
            transformOrigin: "50% 100% 0px",
            opacity: 1,
            visibility: "inherit",
            transform: "translate3d(0px, 0px, 0px)"
          }}
          className="chars chars6"
        >
          n
        </div>
      </div>
      <div className="chars-wrapper">
        <div
          style={{
            position: "relative",
            display: "inline-block",
            translate: "none",
            rotate: "none",
            scale: "none",
            transformOrigin: "50% 100% 0px",
            opacity: 1,
            visibility: "inherit",
            transform: "translate3d(0px, 0px, 0px)"
          }}
          className="chars chars7"
        >
          g
        </div>
      </div>
      <div className="chars-wrapper">
        <div
          style={{
            position: "relative",
            display: "inline-block",
            translate: "none",
            rotate: "none",
            scale: "none",
            transformOrigin: "50% 100% 0px",
            opacity: 1,
            visibility: "inherit",
            transform: "translate3d(0px, 0px, 0px)"
          }}
          className="chars chars8"
        >
          O
        </div>
      </div>
      <div className="chars-wrapper">
        <div
          style={{
            position: "relative",
            display: "inline-block",
            translate: "none",
            rotate: "none",
            scale: "none",
            transformOrigin: "50% 100% 0px",
            opacity: 1,
            visibility: "inherit",
            transform: "translate3d(0px, 0px, 0px)"
          }}
          className="chars chars9"
        >
          n
        </div>
      </div>
      <div className="chars-wrapper">
        <div
          style={{
            position: "relative",
            display: "inline-block",
            translate: "none",
            rotate: "none",
            scale: "none",
            transformOrigin: "50% 100% 0px",
            opacity: 1,
            visibility: "inherit",
            transform: "translate3d(0px, 0px, 0px)"
          }}
          className="chars chars10"
        >
          e
        </div>
      </div>
    </div>
  </h2>
</div> */}