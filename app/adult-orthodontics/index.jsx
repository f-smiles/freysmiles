'use client'
import './style.css'
import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'

gsap.registerPlugin(ScrollTrigger, SplitText)
const SlidingText = ({ 
  text = "DEFAULT",
  totalCells = 8, 
  className = ""
}) => {
  const containerRef = useRef(null);
  const innerRefs = useRef([]);
  const [textWidth, setTextWidth] = useState(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !innerRefs.current.length) return;

    const setLayout = () => {
      const firstInner = innerRefs.current[0];
      

      const tempSpan = document.createElement('span');
      tempSpan.style.visibility = 'hidden';
      tempSpan.style.position = 'absolute';
      tempSpan.style.whiteSpace = 'nowrap';
      tempSpan.style.fontSize = window.getComputedStyle(firstInner).fontSize;
      tempSpan.style.fontFamily = window.getComputedStyle(firstInner).fontFamily;
      tempSpan.style.letterSpacing = window.getComputedStyle(firstInner).letterSpacing;
      tempSpan.style.fontWeight = window.getComputedStyle(firstInner).fontWeight;
      tempSpan.innerText = text;
      
      document.body.appendChild(tempSpan);
      const measuredWidth = tempSpan.getBoundingClientRect().width;
      document.body.removeChild(tempSpan);
      
      // Add more buffer for larger text (20% buffer)
      const textWidthWithBuffer = measuredWidth * 1.2;
      setTextWidth(textWidthWithBuffer);
      
      const offset = textWidthWithBuffer / totalCells;

      container.style.setProperty("--text-width", `${textWidthWithBuffer}px`);
      container.style.setProperty("--gsplits", totalCells);
      container.style.setProperty("--offset", `${offset}px`);

      innerRefs.current.forEach((inner, i) => {
        gsap.set(inner, {
          x: Math.round(-i * offset * 100) / 100, 
          position: 'relative',
          display: 'inline-block',
          willChange: 'transform',
        });
      });
    };

    const initLayout = () => {
      requestAnimationFrame(() => {
        requestAnimationFrame(setLayout); 
      });
    };

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(initLayout);
    } else {
      setTimeout(initLayout, 100);
    }
    
    window.addEventListener("resize", initLayout);

    return () => {
      window.removeEventListener("resize", initLayout);
    };
  }, [totalCells, text]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || !innerRefs.current.length || !textWidth) return;

    const offset = textWidth / totalCells;

    gsap.fromTo(
      innerRefs.current,
      {
        x: (i) => {
          const targetX = -i * offset;

          const randomOffset = (i % 2 === 0 ? -1 : 1) * (textWidth * 0.15);
          return targetX + randomOffset;
        },
        opacity: 0,
      },
      {
        x: (i) => -i * offset,
        opacity: 1,
        duration: 0.8,
        stagger: 0.03,
        ease: "power2.out",
        clearProps: "position",
      },
    );

    return () => {
      gsap.killTweensOf(innerRefs.current);
    };
  }, [totalCells, text, textWidth]);

  return (
    <div ref={containerRef} className={`gtext ${className}`}>
      {Array.from({ length: totalCells }).map((_, i) => (
        <span key={i} className="gtext__box">
          <span
            className="gtext__box-inner"
            ref={(el) => (innerRefs.current[i] = el)}
          >
            {text}
          </span>
        </span>
      ))}
    </div>
  );
};
export default function AdultOrthodontics() {
  const mainSection = useRef(null)
  const itemsContainer = useRef(null)

  useEffect(() => {
    const items = document.querySelectorAll('.MainSectionItem')
    const innerItems = document.querySelectorAll('.MainSectionItem-inner')
    const innerStickies = document.querySelectorAll('.MainSectionItem-innerSticky')
    const mediaContainers = document.querySelectorAll('.MainSectionItem-mediaContainer')
    const mediaContainersInner = document.querySelectorAll('.MainSectionItem-mediaContainerInner')
    const medias = document.querySelectorAll('.MainSectionItem-media')
    const headerTitle = document.querySelector('.MainSection-headerTitle')

    medias.forEach((media) => {
      gsap.set(media, { aspectRatio: 1.3793103448275863 })
    })

    // let splitheaderTitle = SplitText.create(headerTitle, { type: 'chars, words', charsClass: 'chars' })
    // gsap.from(splitheaderTitle.chars, {
    //   y: 50,
    //   opacity: 0,
    //   transformOrigin: '0% 50% -50',
    //   stagger: 0.05,
    //   duration: 2,
    //   ease: 'none',
    //   onComplete: () => {
    //     headerTitle.removeAttribute('aria-hidden')
    //   }
    // })

    let mm = gsap.matchMedia()

    mm.add('(max-width: 1439px)', () => {
      gsap.set(items, { clearProps: 'all' })
      gsap.set(innerItems, { clearProps: 'all' })
      gsap.set(mediaContainers, { clearProps: 'all' })
      gsap.set(mediaContainersInner, { clearProps: 'all' })
      
      const mobile = gsap.context(() => {
        innerStickies.forEach((item, i) => {
          ScrollTrigger.create({
            trigger: item,
            start: item.offsetHeight < window.innerHeight ? 'top top' : 'bottom bottom',
            endTrigger: innerStickies[i + 1],
            end: 'top top',
            pin: true,
            pinSpacing: false,
            invalidateOnRefresh: true,
            markers: false,
          })
        })
      }, itemsContainer.current)
      return () => mobile.revert()
    })

    mm.add('(min-width: 1440px)', () => {
      gsap.set(items, { clearProps: 'all' })
      gsap.set(innerItems, { clearProps: 'all' })
      gsap.set(mediaContainers, { clearProps: 'all' })
      gsap.set(mediaContainersInner, { clearProps: 'all' })
      
      const desktop = gsap.context(() => {
        let tl = gsap.timeline({
          scrollTrigger: {
            trigger: mainSection.current,
            start: 'top top',
            end: `+=${items.length * 100}%`,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
            markers: false,
          },
          defaults: { ease: 'none' },
        })

        // --- Phase 1 ---        
        tl.addLabel('phase-1')
        tl.fromTo(items[0], { xPercent: 0 }, { xPercent: -100 })
        tl.fromTo(innerItems[0], { xPercent: 0 }, { xPercent: 100 }, '<')
        tl.fromTo(mediaContainers[0], { xPercent: -60, scale: 1, transformOrigin: '100% 100% 0px' }, { xPercent: -150, scale: 0.8 }, '<')
        tl.fromTo(mediaContainersInner[0], { xPercent: 0, scale: 1, transformOrigin: '50% 50% 0px' }, { xPercent: -150, scale: 1.2 }, '<')
        tl.fromTo(items[1], { xPercent: 80 }, { xPercent: 0 }, '<')
        tl.fromTo(innerItems[1], { xPercent: -80 }, { xPercent: 0 }, '<')
        tl.fromTo(mediaContainers[1], { xPercent: -15, scale: 0.45, transformOrigin: '100% 100% 0px' }, { xPercent: -60, scale: 1.0 }, '<')
        tl.fromTo(mediaContainersInner[1], { scale: 1.55, transformOrigin: '50% 50% 0px' }, { scale: 1.0 }, '<')
        tl.fromTo(items[2], { xPercent: 95 }, { xPercent: 80 }, '<')
        tl.fromTo(innerItems[2], { xPercent: -95 }, { xPercent: -80 }, '<')
        tl.fromTo(mediaContainers[2], { xPercent: 0, scale: 0.15, transformOrigin: '100% 100% 0px' }, { xPercent: -15, scale: 0.45 }, '<')
        tl.fromTo(mediaContainersInner[2], { scale: 1.85, transformOrigin: '50% 50% 0px' }, { scale: 1.55 }, '<')
        tl.fromTo(items[3], { xPercent: 100 }, { xPercent: 95 }, '<')
        tl.fromTo(innerItems[3], { xPercent: -100 }, { xPercent: -95 }, '<')
        tl.fromTo(mediaContainers[3], { scale: 0, transformOrigin: '100% 100% 0px' }, { scale: 0.15 }, '<')
        tl.fromTo(mediaContainersInner[3], { scale: 2, transformOrigin: '50% 50% 0px' }, { scale: 1.85 }, '<')
        
        // --- Phase 2 (starts AFTER phase 1 finishes) ---
        tl.addLabel('phase-2', '>')
        tl.fromTo(items[1], { xPercent: 0 }, { xPercent: -100 })
        tl.fromTo(innerItems[1], { xPercent: 0 }, { xPercent: 100 }, '<')
        tl.fromTo(mediaContainers[1], { xPercent: -60, scale: 1.0, transformOrigin: '100% 100% 0px' }, { xPercent: -150, scale: 0.8 }, '<')
        tl.fromTo(mediaContainersInner[1], { scale: 1.0, transformOrigin: '50% 50% 0px' }, { scale: 1.2 }, '<')
        tl.fromTo(items[2], { xPercent: 80 }, { xPercent: 0 }, '<')
        tl.fromTo(innerItems[2], { xPercent: -80 }, { xPercent: 0 }, '<')
        tl.fromTo(mediaContainers[2], { xPercent: -15, scale: 0.45, transformOrigin: '100% 100% 0px' }, { xPercent: -60, scale: 1.0 }, '<')
        tl.fromTo(mediaContainersInner[2], { scale: 1.55, transformOrigin: '50% 50% 0px' }, { scale: 1.0 }, '<')
        tl.fromTo(items[3], { xPercent: 95 }, { xPercent: 80 }, '<')
        tl.fromTo(innerItems[3], { xPercent: -95 }, { xPercent: -80 }, '<')
        tl.fromTo(mediaContainers[3], { xPercent: 0, scale: 0.15, transformOrigin: '100% 100% 0px' }, { xPercent: -15, scale: 0.45 }, '<')
        tl.fromTo(mediaContainersInner[3], { scale: 1.85, transformOrigin: '50% 50% 0px' }, { scale: 1.55 }, '<')
        tl.fromTo(items[4], { xPercent: 100 }, { xPercent: 95 }, '<')
        tl.fromTo(innerItems[4], { xPercent: -100 }, { xPercent: -95 }, '<')
        tl.fromTo(mediaContainers[4], { scale: 0, transformOrigin: '100% 100% 0px' }, { scale: 0.15 }, '<')
        tl.fromTo(mediaContainersInner[4], { scale: 2, transformOrigin: '50% 50% 0px' }, { scale: 1.85 }, '<')
        
        // --- Phase 3 (starts AFTER phase 2 finishes) ---
        tl.addLabel('phase-3', '>')
        tl.fromTo(items[2], { xPercent: 0 }, { xPercent: -100 })
        tl.fromTo(innerItems[2], { xPercent: 0 }, { xPercent: 100 }, '<')
        tl.fromTo(mediaContainers[2], { xPercent: -60, scale: 1.0, transformOrigin: '100% 100% 0px' }, { xPercent: -150, scale: 0.8 }, '<')
        tl.fromTo(mediaContainersInner[2], { scale: 1.0, transformOrigin: '50% 50% 0px' }, { scale: 1.2 }, '<')
        tl.fromTo(items[3], { xPercent: 80 }, { xPercent: 0 }, '<')
        tl.fromTo(innerItems[3], { xPercent: -80 }, { xPercent: 0 }, '<')
        tl.fromTo(mediaContainers[3], { xPercent: -15, scale: 0.45, transformOrigin: '100% 100% 0px' }, { xPercent: -60, scale: 1.0 }, '<')
        tl.fromTo(mediaContainersInner[3], { scale: 1.55, transformOrigin: '50% 50% 0px' }, { scale: 1.0 }, '<')
        tl.fromTo(items[4], { xPercent: 95 }, { xPercent: 80 }, '<')
        tl.fromTo(innerItems[4], { xPercent: -95 }, { xPercent: -80 }, '<')
        tl.fromTo(mediaContainers[4], { scale: 0.15, transformOrigin: '100% 100% 0px' }, { scale: 0.6 }, '<')
        tl.fromTo(mediaContainersInner[4], { scale: 1.85, transformOrigin: '50% 50% 0px' }, { scale: 1.55 }, '<')
        
        // --- Phase 4 (starts AFTER phase 3 finishes) ---
        tl.addLabel('phase-4', '>')
        tl.fromTo(items[3], { xPercent: 0 }, { xPercent: -100 })
        tl.fromTo(innerItems[3], { xPercent: 0 }, { xPercent: 100 }, '<')
        tl.fromTo(mediaContainers[3], { xPercent: -60, scale: 1.0, transformOrigin: '100% 100% 0px' }, { xPercent: -150, scale: 0.8 }, '<')
        tl.fromTo(mediaContainersInner[3], { scale: 1.0, transformOrigin: '50% 50% 0px' }, { scale: 1.2 }, '<')
        tl.fromTo(items[4], { xPercent: 80 }, { xPercent: 0 }, '<')
        tl.fromTo(innerItems[4], { xPercent: -80 }, { xPercent: 0 }, '<')
        tl.fromTo(mediaContainers[4], { xPercent: 0, scale: 0.6, transformOrigin: '100% 100% 0px' }, { xPercent: -60, scale: 1.0 }, '<')
        tl.fromTo(mediaContainersInner[4], { scale: 1.55, transformOrigin: '50% 50% 0px' }, { scale: 1.0 }, '<')
      }, mainSection.current)
      return () => desktop.revert()
    })
    
    return () => mm.revert()
  }, [])
  
  return (
    <div className="AdultOrthodontics">
      <div ref={mainSection} className="MainSection" style={{ backgroundColor: 'var(--blue)', }}>
        <div className="MainSection-wrapper">
          <div className="MainSection-header">
             <SlidingText
                  text="Adult Orthodontics"
                  effect="2"
                  totalCells={8}
                  className="font-lg font-canelathin"
            
                />
          </div>
          <div ref={itemsContainer} className="MainSection-items">
            <section className="MainSectionItem MainSection-item">
              <div className="--index-first MainSectionItem-inner">
                <div className="MainSectionItem-innerSticky">
                  <div className="MainSectionItem-background" style={{ backgroundColor: 'var(--blue)', }} />
                  <div className="MainSectionItem-content">
                    <div className="MainSectionItem-contentTitle">
                      <span className="MainSectionItem-index">01</span>
                      <h3>Who do we treat?</h3>
                    </div>
                    <div className="MainSectionItem-contentText">
                      <p>Whether you've had orthodontic treatment before or are exploring it for the first time, we're here to help you achieve your smile goals. We treat adults experiencing orthodontic relapse after previous treatment, as well as those who've noticed gradual dental shifting over the years. Invisalign allows us to treat patients with periodontal concerns—including tissue loss and compromised bone support—with greater precision than braces.</p>
                    </div>
                  </div>
                  <div className="MainSectionItem-mediaContainer">
                    <div className="MainSectionItem-mediaContainerInner">
                      <div className="MainSectionItem-media">
                        <video
                          src="https://www.stephen-wells.com/media/pages/projects/nutiani/fc3e968038-1730620681/taichi_3.3.mp4#t=0.1"
                          alt="Video of a landscape"
                          loading="lazy"
                          loop
                          autoPlay
                          muted
                          playsInline
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
            <section className="MainSectionItem MainSection-item">
              <div className="--index-between MainSectionItem-inner">
                <div className="MainSectionItem-innerSticky">
                  <div className="MainSectionItem-background" style={{ backgroundColor: 'var(--pink)', }} />
                  <div className="MainSectionItem-content">
                    <div className="MainSectionItem-contentTitle">
                      <span className="MainSectionItem-index">02</span>
                      <h3>Accelerated Movement</h3>
                    </div>
                    <div className="MainSectionItem-contentText">
                      <p>We're proud to be the first practice in the area to focus on accelerated adult orthodontics, using devices that optimize tooth movement in mature bone. Our doctors have trained extensively with leaders in TAD-assisted orthodontics (Temporary Anchorage Devices) and routinely design non-surgical treatment plans for patients seeking alternatives to orthognathic surgery.</p>
                    </div>
                  </div>
                  <div className="MainSectionItem-mediaContainer">
                    <div className="MainSectionItem-mediaContainerInner">
                      <div className="MainSectionItem-media image-wrapper">
                        <img
                          src="/images/nasionanolines.png"
                          alt="Facial silhouette"
                          loading="lazy"
                          className="profile-image"
                        />
                        <svg
                          className="overlay-lines"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 100 100"
                          preserveAspectRatio="none"
                        >
                          {/* Vertical line */}
                          <line 
                            x1="69" y1="30" 
                            x2="69" y2="73" 
                            stroke="#ffffff80" 
                            strokeWidth="0.5"
                            strokeLinecap="round"
                            stroke-dasharray="2 3"
                            vectorEffect="non-scaling-stroke"
                          />

                          {/* Long diagonal */}
                          <line 
                            x1="30" y1="38" 
                            x2="72" y2="75" 
                            stroke="#ffffff80" 
                            strokeWidth="0.5" 
                            strokeLinecap="round" 
                            stroke-dasharray="2 3"
                            vectorEffect="non-scaling-stroke"
                          />

                          {/* Upper horizontal */}
                          <line
                            x1="55" y1="31"
                            x2="74" y2="31"
                            stroke="#ffffff80"
                            strokeWidth="0.5"
                            strokeLinecap="round"
                            stroke-dasharray="2 3"
                            vectorEffect="non-scaling-stroke"
                          />

                          {/* Lower horizontal */}
                          <line
                            x1="47" y1="61"
                            x2="73" y2="61"
                            stroke="#ffffff80"
                            strokeWidth="0.5"
                            strokeLinecap="round"
                            stroke-dasharray="2 3"
                            vectorEffect="non-scaling-stroke"
                          />

                          <line
                            x1="75" y1="56"
                            x2="69" y2="73"
                            stroke="#ffffff80"
                            strokeWidth="0.5"
                            strokeLinecap="round"
                            stroke-dasharray="2 3"
                            vectorEffect="non-scaling-stroke"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
            <section className="MainSectionItem MainSection-item">
              <div className="--index-between MainSectionItem-inner">
                <div className="MainSectionItem-innerSticky">
                  <div className="MainSectionItem-background" style={{ backgroundColor: 'var(--green)', }} />
                  <div className="MainSectionItem-content">
                    <div className="MainSectionItem-contentTitle">
                      <span className="MainSectionItem-index">03</span>
                      <h3>Coordinated Care</h3>
                    </div>
                    <div className="MainSectionItem-contentText">
                      <p>When jaw surgery is the pursued path, we coordinate closely with the region's top oral and maxillofacial surgeons to ensure care continuity, expert management, and care that remains conveniently local.</p>
                    </div>
                  </div>
                  <div className="MainSectionItem-mediaContainer">
                    <div className="MainSectionItem-mediaContainerInner">
                      <div className="MainSectionItem-media">
                        <img
                          src="/images/testposter1.png"
                          alt="Video of a landscape"
                          loading="lazy"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
            <section className="MainSectionItem MainSection-item">
              <div className="--index-between MainSectionItem-inner">
                <div className="MainSectionItem-innerSticky">
                  <div className="MainSectionItem-background" style={{ backgroundColor: 'var(--beige)', }} />
                  <div className="MainSectionItem-content">
                    <div className="MainSectionItem-contentTitle">
                      <span className="MainSectionItem-index">04</span>
                      <h3>Our Philosophy</h3>
                    </div>
                    <div className="MainSectionItem-contentText">
                      <p>Orthodontics has always been rooted in understanding how bone structure, dental positioning, and soft tissue interact to shape the face—not just in growing faces, but in aging ones too. Our doctors bring a natural appreciation for facial aesthetics, shaped by their orthodontic training and clinical expertise.</p>
                    </div>
                  </div>
                  <div className="MainSectionItem-mediaContainer">
                    <div className="MainSectionItem-mediaContainerInner">
                      <div className="MainSectionItem-media">
                        <img
                          src="/images/tabletfacelineart.png"
                          alt="Video of a landscape"
                          loading="lazy"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
            <section className="MainSectionItem --bg-terra MainSection-item">
              <div className="--index-last MainSectionItem-inner">
                <div className="MainSectionItem-innerSticky">
                  <div className="MainSectionItem-background" style={{ backgroundColor: 'var(--terra)', }} />
                  <div className="MainSectionItem-content">
                    <div className="MainSectionItem-contentTitle">
                      <span className="MainSectionItem-index">05</span>
                      <h3>AAFE</h3>
                    </div>
                    <div className="MainSectionItem-contentText">
                      <p>Because of this foundation, we approach cosmetic treatment by addressing skeletal balance first—restoring harmony at the level of the hard tissue. Prioritizing the skeletal foundation allows us to minimize reliance on overfilling and support outcomes that look natural and require less upkeep.  As members of the American Academy of Facial Esthetics (AAFE), our doctors offer Botox and dermal fillers as part of a comprehensive, structure-first approach to confidence and care.</p>
                    </div>
                  </div>
                  <div className="MainSectionItem-mediaContainer">
                    <div className="MainSectionItem-mediaContainerInner">
                      <div className="MainSectionItem-media">
                        <img
                          src="/images/aafe.png"
                          alt="Video of a landscape"
                          loading="lazy"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}