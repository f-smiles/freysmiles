"use client";
import "./style.css";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useScroll } from "motion/react";

gsap.registerPlugin(ScrollTrigger, SplitText)

interface SECTION {
  index: number
  backgroundColor: string
  heading: string
  texts: string[]
  mediaSrc: string
  mediaAlt: string
}

const sections: SECTION[] = [
  {
    index: 1,
    backgroundColor: "white",
    heading: "Smart to Start",
    texts: [
      "Our doctors—as well as the American Association of Orthodontists—recommend an initial orthodontic screening at around age 7. At this stage, 3D imaging is used to evaluate the developing bite and predict the trajectory of permanent teeth. It also helps identify issues such as supernumerary (extra) or missing teeth, assess airway development (including risk factors for sleep apnea), and detect jaw growth discrepancies. Habit reduction is also a part of early treatment. Obstructive habits like thumb sucking, lip biting, tongue thrusting, or early malocclusion can be addressed early to support optimal jaw and airway development.",
    ],
    mediaSrc: "/images/7milestone.png",
    mediaAlt: "design of a manual",
  },
  {
    index: 2,
    backgroundColor: "purple",
    heading: "Lucky Number 7",
    texts: [
      "Key dental landmarks are typically in place: the permanent first molars should be positioned in the dental arches, and almost all four upper and lower (eight total) permanent incisors are either fully erupted or close to erupting. These markers allow our doctors to accurately assess the width of the arches, the front-to-back jaw positioning, and identify any crossbites. This is also the stage when significant arch length deficiencies (crowding) can be detected, giving us the chance to intervene and provide room for all permanent teeth.",
    ],
    mediaSrc: "/images/childsideprofile5.png",
    mediaAlt: "Facial silhouette",
  },
  {
    index: 3,
    backgroundColor: "brightgreen",
    heading: "The Airway Equation",
    texts: [
      "We assess the airway and surrounding structures—including the tonsils—as part of every evaluation. Using advanced 3D imaging and specialized training, our doctors design treatment plans that support optimal airway development and function. Token orthodontic treatment planning can overlook the root cause of airway constriction. Whether we're your first consultation or you've already had one, a second opinion is always welcomed."
    ],
    mediaSrc: "/images/airwayequation.png",
    mediaAlt: "shot of child sitting",
  },
  {
    index: 4,
    backgroundColor: "eggshellgrey",
    heading: "Future-Proof",
    texts: [
      "Once you visit us, we take care of the rest. If no treatment is needed right away, we'll place your child on a customized Growth & Guidance schedule—our way of future-proofing their smile and their youthfulness.",
    ],
    mediaSrc: "/images/ffscard.jpg",
    mediaAlt: "future smiles",
  },
  {
    index: 5,
    backgroundColor: "hotpink",
    heading: "Interceptive Treatment",
    texts: [
      "Timely intervention makes it possible to manage many cases seamlessly. Early Orthodontic treatment with us guides tooth alignment and growth. Orthodontic appliances do in fact function as a protection in the case of facial trauma - not to mention Invisalign is a great mouthguard for sports. Through proactive, individualized treatment we're able to minimize appointments, improve oral hygiene and habits, reduce enamel damage, and help patients avoid the burden of bulky appliances during life's special moments.",
    ],
    mediaSrc: "/videos/luckynumber7.mp4",
    mediaAlt: "7 year old",
  },
  {
    index: 6,
    backgroundColor: "terra",
    heading: "Early Is Still Now",
    texts: [
      "Early visits build familiarity with our doctors and team and often leads to better compliance and the best treatment experience. Even if no treatment is needed right away, that first screening sets the stage for better results later. Think of it as laying the groundwork—not just for a great smile, but for a positive experience along the way.",
    ],
    mediaSrc: "/videos/alwayslookingahead.mp4",
    mediaAlt: "landscape",
  }
]

export default function EarlyOrthodontics() {
  const mainSection = useRef(null)
  const itemsContainer = useRef(null)

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
          tl.addLabel("phase-3", ">")
          tl.fromTo(items[2], { xPercent: 0 }, { xPercent: -100 })
          tl.fromTo(innerItems[2], { xPercent: 0 }, { xPercent: 100 }, "<")
          tl.fromTo(mediaContainers[2],{ xPercent: -60, scale: 1.0, transformOrigin: "100% 100% 0px" },{ xPercent: -150, scale: 0.8 },"<")
          tl.fromTo(mediaContainersInner[2], { scale: 1.0, transformOrigin: "50% 50% 0px" }, { scale: 1.2 }, "<")
          tl.fromTo(items[3], { xPercent: 80 }, { xPercent: 0 }, "<")
          tl.fromTo(innerItems[3], { xPercent: -80 }, { xPercent: 0 }, "<")
          tl.fromTo(mediaContainers[3], { xPercent: -15, scale: 0.45, transformOrigin: "100% 100% 0px" }, { xPercent: -60, scale: 1.0 }, "<")
          tl.fromTo(mediaContainersInner[3], { scale: 1.55, transformOrigin: "50% 50% 0px" }, { scale: 1.0 }, "<")
          tl.fromTo(items[4], { xPercent: 95 }, { xPercent: 80 }, "<")
          tl.fromTo(innerItems[4], { xPercent: -95 }, { xPercent: -80 }, "<")
          tl.fromTo(mediaContainers[4], { xPercent: 0, scale: 0.15, transformOrigin: "100% 100% 0px" }, { xPercent: -15, scale: 0.45 }, "<")
          tl.fromTo(mediaContainersInner[4], { scale: 1.85, transformOrigin: "50% 50% 0px" }, { scale: 1.55 }, "<")
          tl.fromTo(items[5], { xPercent: 100 }, { xPercent: 95 }, "<")
          tl.fromTo(innerItems[5], { xPercent: -100 }, { xPercent: -95 }, "<")
          tl.fromTo(mediaContainers[5], { scale: 0, transformOrigin: "100% 100% 0px" }, { scale: 0.15 }, "<")
          tl.fromTo(mediaContainersInner[5], { scale: 2, transformOrigin: "50% 50% 0px" }, { scale: 1.85 }, "<")
          
          // --- Phase 4 ---
          tl.addLabel("phase-4", ">")
          tl.fromTo(items[3], { xPercent: 0 }, { xPercent: -100 })
          tl.fromTo(innerItems[3], { xPercent: 0 }, { xPercent: 100 }, "<")
          tl.fromTo(mediaContainers[3], { xPercent: -60, scale: 1.0, transformOrigin: "100% 100% 0px" }, { xPercent: -150, scale: 0.8 }, "<")
          tl.fromTo(mediaContainersInner[3], { scale: 1.0, transformOrigin: "50% 50% 0px" }, { scale: 1.2 }, "<")
          tl.fromTo(items[4], { xPercent: 80 }, { xPercent: 0 }, "<")
          tl.fromTo(innerItems[4], { xPercent: -80 }, { xPercent: 0 }, "<")
          tl.fromTo(mediaContainers[4], { xPercent: -15, scale: 0.45, transformOrigin: "100% 100% 0px" }, { xPercent: -60, scale: 1.0 }, "<")
          tl.fromTo(mediaContainersInner[4], { scale: 1.55, transformOrigin: "50% 50% 0px" }, { scale: 1.0 }, "<")
          tl.fromTo(items[5], { xPercent: 95 }, { xPercent: 80 }, "<")
          tl.fromTo(innerItems[5], { xPercent: -95 }, { xPercent: -80 }, "<")
          tl.fromTo(mediaContainers[5], { scale: 0.15, transformOrigin: "100% 100% 0px" }, { scale: 0.6 }, "<")
          tl.fromTo(mediaContainersInner[5], { scale: 1.85, transformOrigin: "50% 50% 0px" }, { scale: 1.55 }, "<")
        
          // --- Phase 5 ---
          tl.addLabel("phase-5", ">")
          tl.fromTo(items[4], { xPercent: 0 }, { xPercent: -100 })
          tl.fromTo(innerItems[4], { xPercent: 0 }, { xPercent: 100 }, "<")
          tl.fromTo(mediaContainers[4], { xPercent: -60, scale: 1.0, transformOrigin: "100% 100% 0px" }, { xPercent: -150, scale: 0.8 }, "<")
          tl.fromTo(mediaContainersInner[4], { scale: 1.0, transformOrigin: "50% 50% 0px" }, { scale: 1.2 }, "<")
          tl.fromTo(items[5], { xPercent: 80 }, { xPercent: 0 }, "<")
          tl.fromTo(innerItems[5], { xPercent: -80 }, { xPercent: 0 }, "<")
          tl.fromTo(mediaContainers[5], { xPercent: 0, scale: 0.6, transformOrigin: "100% 100% 0px" }, { xPercent: -60, scale: 1.0 }, "<")
          tl.fromTo(mediaContainersInner[5], { scale: 1.55, transformOrigin: "50% 50% 0px" }, { scale: 1.0 }, "<")
        }, mainSection.current)

        return () => desktop.revert()
      })

      return () => mm.revert()
    }
  }, [])

  return (
    <div className="EarlyOrthodontics">
      <div ref={mainSection} className="MainSection">
        <div className="MainSection-wrapper" style={{ backgroundColor: `var(--${sections[0].backgroundColor})`}}>
          <div className="MainSection-header">
            <div className="relative w-full flex justify-center items-center min-[1280px]:justify-start">
              <div className="absolute inset-0 flex justify-center items-start min-[1280px]:justify-start">
                <SlidingText
                  text="Early Orthodontics"
                  totalCells={8}
                  className="font-lg font-canela italic text-center translate-y-6 min-[1280px]:translate-y-0 min-[1280px]:text-left"
                />
              </div>
            </div>
          </div>
          <div ref={itemsContainer} className="MainSection-items">
            {sections.map((section) => (
              <section className="MainSectionItem MainSection-item" key={section.index}>
                <div className={`MainSectionItem-inner ${section.index === 0 ? "--inner-first" : section.index === sections.length - 1 ? "--index-last" : "--index-between"}`}>
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
                        <div className="MainSectionItem-media">
                          {section.mediaSrc.includes(".jpg") ||
                          section.mediaSrc.includes(".png") ? (
                            <img
                              src={section.mediaSrc}
                              alt={section.mediaAlt}
                              loading="lazy"
                            />
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
  )
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