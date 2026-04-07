"use client";
import "./style.css";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, SplitText);

interface SECTION {
  index: number
  backgroundColor: string
  heading: string
  texts: string[]
  mediaSrc: string
  mediaAlt: string
  mediaClassName1?: string[]
  mediaClassName2?: string[]
}

const sections: SECTION[] = [
  {
    index: 1,
    backgroundColor: "golden",
    heading: "Who do we treat?",
    texts: [
      "Whether you've had orthodontic treatment before or are exploring it for the first time, we're here to help you achieve your goals. It is true - our most remarkable results happen with growing children and adolescents. We have also successfully treated the most severe adult cases alongside those experiencing basic orthodontic relapse. Invisalign allows us to treat patients with periodontal concerns—including tissue loss and compromised bone support—with greater precision than braces.",
    ],
    mediaSrc: "/images/1920x10805.png",
    mediaAlt: "side profile of an adult male",
  },
  {
    index: 2,
    backgroundColor: "dream",
    heading: "Accelerated Movement",
    texts: [
      "We're proud to be the first practice in the area to focus on accelerated adult orthodontics, we've trialed extensive bio-optimization technologies and settled on light therapy as our first choice to optimize tooth movement in mature bone. Our doctors have trained extensively with leaders in TAD-assisted orthodontics (Temporary Anchorage Devices) and routinely design non-surgical treatment plans for patients seeking alternatives to orthognathic surgery.",
    ],
    mediaSrc: "/images/nasionanolines.png",
    mediaAlt: "Facial silhouette",
    mediaClassName1: ["image-wrapper"],
    mediaClassName2: ["profile-image"],
  },
  {
    index: 3,
    backgroundColor: "signal",
    heading: "Coordinated Care",
    texts: [
      "No referral is needed to consult with us. From your first visit, you'll be paired with a dedicated treatment coordinator—your point person for everything from scheduling to financial planning. If you don't already have a dentist, we'll help you find one. And when treatment involves additional specialists, we guide you toward trusted providers and coordinate care on your behalf. When jaw surgery is part of the plan, we work closely with the region's leading oral and maxillofacial surgeons to ensure continuity and precision. Exceptional care is always a collaborative effort.",
    ],
    mediaSrc: "/videos/SC1.mp4",
    mediaAlt: "Video of a computer monitor",
  },
  {
    index: 4,
    backgroundColor: "soft",
    heading: "Our Philosophy",
    texts: [
      "Our approach to orthodontics has always been rooted in understanding how bone structure, dental positioning, and soft tissue interact to shape the face—not just in growing faces, but in aging ones too. Our doctors bring a natural appreciation for facial aesthetics, shaped by their orthodontic training and clinical expertise.",
    ],
    mediaSrc: "/images/tabletfacelineart.png",
    mediaAlt: "tablet displaying line drawing of a human face",
  },
  {
    index: 5,
    backgroundColor: "fog",
    heading: "AAFE",
    texts: [
      "We approach cosmetic treatment as doctors that have completed training with the American Academy of Facial Esthetics (AAFE). We minimize reliance on overfilling and support outcomes that look natural and require less upkeep. Our doctors are actively pursuing fellowship-level training, offering Botox and dermal fillers as part of a comprehensive, structure-first approach to facial aesthetics."
    ],
    mediaSrc: "/images/aafe.png",
    mediaAlt: "aafe card",
  },
]

export default function AdultOrthodontics() {
  const mainSection = useRef(null);
  const itemsContainer = useRef(null);

  useEffect(() => {
    const isTouchDevice = 'ontouchstart' in window

    if (!isTouchDevice) {
      const items = document.querySelectorAll(".MainSection-item")
      const innerItems = document.querySelectorAll(".MainSectionItem-inner")
      const mediaContainers = document.querySelectorAll(".MainSectionItem-mediaContainer")
      const mediaContainersInner = document.querySelectorAll(".MainSectionItem-mediaContainerInner")
      const medias = document.querySelectorAll('.MainSectionItem-media')

      medias.forEach((media) => {
        gsap.set(media, { aspectRatio: 1.3793103448275863 })
      })

      let mm = gsap.matchMedia()
      
      mm.add("(max-width: 1279px)", () => {
        gsap.set(items, { clearProps: "all" })
        gsap.set(innerItems, { clearProps: "all" })
        gsap.set(mediaContainers, { clearProps: "all" })
        gsap.set(mediaContainersInner, { clearProps: "all" })
      
        const mobile = gsap.context(() => {
          items.forEach((item: HTMLElement) => {
            ScrollTrigger.create({
              trigger: item,
              start: () => item.offsetHeight < window.innerHeight ? "top top" : "bottom bottom",
              pin: true, 
              pinSpacing: false,
              scrub: 0.5,
            })
          })
          return () => ScrollTrigger.getAll().forEach(trigger => trigger.kill())
        }, itemsContainer.current)

        return () => mobile.revert()
      })

      mm.add("(min-width: 1280px)", () => {
        gsap.set(items, { clearProps: "all" });
        gsap.set(innerItems, { clearProps: "all" });
        gsap.set(mediaContainers, { clearProps: "all" });
        gsap.set(mediaContainersInner, { clearProps: "all" });
          
        const desktop = gsap.context(() => {
          let tl = gsap.timeline({
            scrollTrigger: {
              trigger: mainSection.current,
              start: "top top",
              end: `+=${items.length * 100}%`,
              pin: true,
              scrub: 1,
              invalidateOnRefresh: true,
              markers: false,
            },
            defaults: { ease: "none" },
          })

          // --- Phase 1 ---
          tl.addLabel("phase-1")
          tl.fromTo(items[0], { xPercent: 0 }, { xPercent: -100 })
          tl.fromTo(innerItems[0], { xPercent: 0 }, { xPercent: 100 }, "<")
          tl.fromTo(mediaContainers[0], { xPercent: -60, scale: 1, transformOrigin: "100% 100% 0px" }, { xPercent: -150, scale: 0.8 }, "<")
          tl.fromTo(mediaContainersInner[0], { xPercent: 0, scale: 1, transformOrigin: "50% 50% 0px" }, { xPercent: -150, scale: 1.2 }, "<")
          tl.fromTo(items[1], { xPercent: 80 }, { xPercent: 0 }, "<")
          tl.fromTo(innerItems[1], { xPercent: -80 }, { xPercent: 0 }, "<")
          tl.fromTo(mediaContainers[1], { xPercent: -15, scale: 0.45, transformOrigin: "100% 100% 0px" }, { xPercent: -60, scale: 1.0 }, "<")
          tl.fromTo(mediaContainersInner[1], { scale: 1.55, transformOrigin: "50% 50% 0px" }, { scale: 1.0 }, "<")
          tl.fromTo(items[2], { xPercent: 95 }, { xPercent: 80 }, "<")
          tl.fromTo(innerItems[2], { xPercent: -95 }, { xPercent: -80 }, "<")
          tl.fromTo(mediaContainers[2], { xPercent: 0, scale: 0.15, transformOrigin: "100% 100% 0px" }, { xPercent: -15, scale: 0.45 }, "<")
          tl.fromTo(mediaContainersInner[2], { scale: 1.85, transformOrigin: "50% 50% 0px" }, { scale: 1.55 }, "<")
          tl.fromTo(items[3], { xPercent: 100 }, { xPercent: 95 }, "<")
          tl.fromTo(innerItems[3], { xPercent: -100 }, { xPercent: -95 }, "<")
          tl.fromTo(mediaContainers[3], { scale: 0, transformOrigin: "100% 100% 0px" }, { scale: 0.15 }, "<")
          tl.fromTo(mediaContainersInner[3], { scale: 2, transformOrigin: "50% 50% 0px" }, { scale: 1.85 }, "<")
        
          // --- Phase 2 ---
          tl.addLabel("phase-2", ">")
          tl.fromTo(items[1], { xPercent: 0 }, { xPercent: -100 })
          tl.fromTo(innerItems[1], { xPercent: 0 }, { xPercent: 100 }, "<")
          tl.fromTo(mediaContainers[1], { xPercent: -60, scale: 1.0, transformOrigin: "100% 100% 0px" }, { xPercent: -150, scale: 0.8 }, "<")
          tl.fromTo(mediaContainersInner[1], { scale: 1.0, transformOrigin: "50% 50% 0px" }, { scale: 1.2 }, "<")
          tl.fromTo(items[2], { xPercent: 80 }, { xPercent: 0 }, "<")
          tl.fromTo(innerItems[2], { xPercent: -80 }, { xPercent: 0 }, "<")
          tl.fromTo(mediaContainers[2], { xPercent: -15, scale: 0.45, transformOrigin: "100% 100% 0px" }, { xPercent: -60, scale: 1.0 }, "<")
          tl.fromTo(mediaContainersInner[2],{ scale: 1.55, transformOrigin: "50% 50% 0px" },{ scale: 1.0 },"<")
          tl.fromTo(items[3], { xPercent: 95 }, { xPercent: 80 }, "<")
          tl.fromTo(innerItems[3], { xPercent: -95 }, { xPercent: -80 }, "<")
          tl.fromTo(mediaContainers[3],{ xPercent: 0, scale: 0.15, transformOrigin: "100% 100% 0px" },{ xPercent: -15, scale: 0.45 },"<")
          tl.fromTo(mediaContainersInner[3],{ scale: 1.85, transformOrigin: "50% 50% 0px" },{ scale: 1.55 },"<")
          tl.fromTo(items[4], { xPercent: 100 }, { xPercent: 95 }, "<")
          tl.fromTo(innerItems[4], { xPercent: -100 }, { xPercent: -95 }, "<")
          tl.fromTo(mediaContainers[4],{ scale: 0, transformOrigin: "100% 100% 0px" },{ scale: 0.15 },"<")
          tl.fromTo(mediaContainersInner[4],{ scale: 2, transformOrigin: "50% 50% 0px" },{ scale: 1.85 },"<")
        
          // --- Phase 3 ---
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
          
          // --- Phase 4 ---
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
    }
  }, [])

  return (
    <div className="AdultOrthodontics">
      <div ref={mainSection} className="MainSection">
        <div className="MainSection-wrapper"  style={{ backgroundColor: `var(--${sections[0].backgroundColor})`}}>
          <div className="MainSection-header">
            <div className="relative w-full flex justify-center items-center min-[1280px]:justify-start">
              <div className="relative w-full flex justify-center items-center min-[1280px]:justify-start">
                <div className="absolute inset-0 flex justify-center items-start min-[1280px]:justify-start">
                  <SlidingText
                    text="Adult Orthodontics"
                    totalCells={8}
                    className="font-lg font-canela italic translate-y-6 min-[1280px]:translate-y-0 text-center min-[1280px]:text-left"
                  />
                </div>
              </div>
            </div>
          </div>
          <div ref={itemsContainer} className="MainSection-items">
            {sections.map((section) => (
              <section className="MainSectionItem MainSection-item" key={section.index}>
                <div className={`${section.index === 0 ? "--inner-first" : section.index === sections.length - 1 ? "--index-last" : "--index-between"} MainSectionItem-inner`}>
                  <div className="MainSectionItem-innerSticky">
                    <div
                      className="MainSectionItem-background"
                      style={{ backgroundColor: `var(--${section.backgroundColor})` }}
                    />
                    <div className="MainSectionItem-content">
                      <div className="MainSectionItem-contentTitle">
                        <span className="MainSectionItem-index font-neuehaas45">
                          {section.index}
                        </span>
                        <h3>{section.heading}</h3>
                      </div>
                      <div className="MainSectionItem-contentText">
                        {section.texts.map((text) => (
                          <p key={text}>{text}</p>
                        ))}
                      </div>
                    </div>
                    <div className="MainSectionItem-mediaContainer">
                      <div className="MainSectionItem-mediaContainerInner">
                        <div className={`MainSectionItem-media ${section.mediaClassName1 ? section.mediaClassName1.join() : ""}`}>
                          {section.mediaSrc.includes(".jpg") ||
                          section.mediaSrc.includes(".png") ? (
                            <img
                              src={section.mediaSrc}
                              alt={section.mediaAlt}
                              loading="lazy"
                              className={section.mediaClassName2 ? section.mediaClassName2.join() : ""}
                            />
                          ) : null}
                          {(section?.mediaClassName1 && section?.mediaClassName2) ? (
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
                                strokeDasharray="2 3"
                                vectorEffect="non-scaling-stroke"
                              />

                              {/* Long diagonal */}
                              <line 
                                x1="30" y1="38" 
                                x2="72" y2="75" 
                                stroke="#ffffff80" 
                                strokeWidth="0.5" 
                                strokeLinecap="round" 
                                strokeDasharray="2 3"
                                vectorEffect="non-scaling-stroke"
                              />

                              {/* Upper horizontal */}
                              <line
                                x1="55" y1="31"
                                x2="74" y2="31"
                                stroke="#ffffff80"
                                strokeWidth="0.5"
                                strokeLinecap="round"
                                strokeDasharray="2 3"
                                vectorEffect="non-scaling-stroke"
                              />

                              {/* Lower horizontal */}
                              <line
                                x1="47" y1="61"
                                x2="73" y2="61"
                                stroke="#ffffff80"
                                strokeWidth="0.5"
                                strokeLinecap="round"
                                strokeDasharray="2 3"
                                vectorEffect="non-scaling-stroke"
                              />

                              <line
                                x1="75" y1="56"
                                x2="69" y2="73"
                                stroke="#ffffff80"
                                strokeWidth="0.5"
                                strokeLinecap="round"
                                strokeDasharray="2 3"
                                vectorEffect="non-scaling-stroke"
                              />
                            </svg>
                          ) : null}
                          {section.mediaSrc.includes(".mp4") ||
                          section.mediaSrc.includes(".mkv") ? (
                            <video autoPlay loop muted playsInline preload="metadata">
                              <source
                                src={section.mediaSrc}
                                type={"video/mp4"}
                              />
                            </video>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const SlidingText = ({ text = "DEFAULT", totalCells = 8, className = "" }) => {
  const containerRef = useRef(null);
  const innerRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const [textWidth, setTextWidth] = useState(0);
  const [isReady, setIsReady] = useState(false);

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container || !innerRefs.current.length) return;

    const setLayout = () => {
      const firstInner = innerRefs.current[0];
      if (!firstInner) return;

      const tempSpan = document.createElement("span");
      tempSpan.style.visibility = "hidden";
      tempSpan.style.position = "absolute";
      tempSpan.style.whiteSpace = "nowrap";
      tempSpan.style.fontSize = window.getComputedStyle(firstInner).fontSize;
      tempSpan.style.fontFamily = window.getComputedStyle(firstInner).fontFamily;
      tempSpan.style.letterSpacing = window.getComputedStyle(firstInner).letterSpacing;
      tempSpan.style.fontWeight = window.getComputedStyle(firstInner).fontWeight;
      tempSpan.innerText = text;

      document.body.appendChild(tempSpan);
      const measuredWidth = tempSpan.getBoundingClientRect().width;
      document.body.removeChild(tempSpan);

      const textWidthWithBuffer = measuredWidth * 1.2;
      setTextWidth(textWidthWithBuffer);

      const offset = textWidthWithBuffer / totalCells;

      container.style.setProperty("--text-width", `${textWidthWithBuffer}px`);
      container.style.setProperty("--gsplits", totalCells);
      container.style.setProperty("--offset", `${offset}px`);

      innerRefs.current.forEach((inner, i) => {
        if (inner) {
          gsap.set(inner, {
            x: -i * offset,
            position: "relative",
            display: "inline-block",
            willChange: "transform",
            opacity: 0, 
          });
        }
      });

      requestAnimationFrame(() => {
        setIsReady(true);
      });
    };

    const initLayout = () => {

      setTimeout(() => {
        requestAnimationFrame(() => {
          requestAnimationFrame(setLayout);
        });
      }, 50);
    };

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(initLayout);
    } else {
      initLayout();
    }

    window.addEventListener("resize", () => {
      setIsReady(false);
      initLayout();
    });

    return () => {
      window.removeEventListener("resize", initLayout);
    };
  }, [totalCells, text]);

  useEffect(() => {
    if (!isReady || !containerRef.current || !innerRefs.current.length || !textWidth) return;

    const offset = textWidth / totalCells;

    gsap.killTweensOf(innerRefs.current);

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
        onStart: () => {

          if (containerRef.current) {
            containerRef.current.style.visibility = "visible";
          }
        },
      }
    );
  }, [totalCells, text, textWidth, isReady]);

  if (!isReady) {
    return (
      <div 
        ref={containerRef} 
        className={`gtext ${className}`}
        style={{ 
          visibility: "hidden",
          position: "relative",

          minHeight: "2em"
        }}
      >
        {Array.from({ length: totalCells }).map((_, i) => (
          <span key={i} className="gtext__box" style={{ display: "inline-block" }}>
            <span
              className="gtext__box-inner"
              ref={(el) => { 
                innerRefs.current[i] = el; 
              }}
              style={{ 
                display: "inline-block",
                whiteSpace: "nowrap",
                visibility: "hidden"
              }}
            >
              {text}
            </span>
          </span>
        ))}
      </div>
    );
  }

  return (
    <div 
      ref={containerRef} 
      className={`gtext ${className}`}
      style={{ 
        visibility: "visible",
        position: "relative"
      }}
    >
      {Array.from({ length: totalCells }).map((_, i) => (
        <span key={i} className="gtext__box" style={{ display: "inline-block" }}>
          <span
            className="gtext__box-inner"
            ref={(el) => { 
              innerRefs.current[i] = el; 
            }}
            style={{ 
              display: "inline-block",
              whiteSpace: "nowrap"
            }}
          >
            {text}
          </span>
        </span>
      ))}
    </div>
  );
};