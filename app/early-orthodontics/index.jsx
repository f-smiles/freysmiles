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

export default function EarlyOrthodontics() {
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
        tl.fromTo(mediaContainers[0], { xPercent: -60, scale: 1, transformOrigin: '100% 100% 0px' }, { xPercent: -150, scale: 0.8, duration: .55 }, '<')
        tl.fromTo(mediaContainersInner[0], { xPercent: 0, scale: 1, transformOrigin: '50% 50% 0px' }, { xPercent: -150, scale: 1.2, duration: .5 }, '<')
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
        
        // --- Phase 2 ---
        tl.addLabel('phase-2', '>')
        tl.fromTo(items[1], { xPercent: 0 }, { xPercent: -100 })
        tl.fromTo(innerItems[1], { xPercent: 0 }, { xPercent: 100 }, '<')
        tl.fromTo(mediaContainers[1], { xPercent: -60, scale: 1.0, transformOrigin: '100% 100% 0px' }, { xPercent: -150, scale: 0.8, duration: .55 }, '<')
        tl.fromTo(mediaContainersInner[1], { scale: 1.0, transformOrigin: '50% 50% 0px' }, { scale: 1.2, duration: .5 }, '<')
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
        
        // --- Phase 3 ---
        tl.addLabel('phase-3', '>')
        tl.fromTo(items[2], { xPercent: 0 }, { xPercent: -100 })
        tl.fromTo(innerItems[2], { xPercent: 0 }, { xPercent: 100 }, '<')
        tl.fromTo(mediaContainers[2], { xPercent: -60, scale: 1.0, transformOrigin: '100% 100% 0px' }, { xPercent: -150, scale: 0.8, duration: .5 }, '<')
        tl.fromTo(mediaContainersInner[2], { scale: 1.0, transformOrigin: '50% 50% 0px' }, { scale: 1.2, duration: .45 }, '<')
        tl.fromTo(items[3], { xPercent: 80 }, { xPercent: 0 }, '<')
        tl.fromTo(innerItems[3], { xPercent: -80 }, { xPercent: 0 }, '<')
        tl.fromTo(mediaContainers[3], { xPercent: -15, scale: 0.45, transformOrigin: '100% 100% 0px' }, { xPercent: -60, scale: 1.0 }, '<')
        tl.fromTo(mediaContainersInner[3], { scale: 1.55, transformOrigin: '50% 50% 0px' }, { scale: 1.0 }, '<')
        tl.fromTo(items[4], { xPercent: 95 }, { xPercent: 80 }, '<')
        tl.fromTo(innerItems[4], { xPercent: -95 }, { xPercent: -80 }, '<')
        tl.fromTo(mediaContainers[4], { xPercent: 0, scale: 0.15, transformOrigin: '100% 100% 0px' }, { xPercent: -15, scale: 0.45 }, '<')
        tl.fromTo(mediaContainersInner[4], { scale: 1.85, transformOrigin: '50% 50% 0px' }, { scale: 1.55 }, '<')
        tl.fromTo(items[5], { xPercent: 100 }, { xPercent: 95 }, '<')
        tl.fromTo(innerItems[5], { xPercent: -100 }, { xPercent: -95 }, '<')
        tl.fromTo(mediaContainers[5], { scale: 0, transformOrigin: '100% 100% 0px' }, { scale: 0.15 }, '<')
        tl.fromTo(mediaContainersInner[5], { scale: 2, transformOrigin: '50% 50% 0px' }, { scale: 1.85 }, '<')
        
        // --- Phase 4 ---
        tl.addLabel('phase-4', '>')
        tl.fromTo(items[3], { xPercent: 0 }, { xPercent: -100 })
        tl.fromTo(innerItems[3], { xPercent: 0 }, { xPercent: 100 }, '<')
        tl.fromTo(mediaContainers[3], { xPercent: -60, scale: 1.0, transformOrigin: '100% 100% 0px' }, { xPercent: -150, scale: 0.8, duration: .55 }, '<')
        tl.fromTo(mediaContainersInner[3], { scale: 1.0, transformOrigin: '50% 50% 0px' }, { scale: 1.2, duration: .5 }, '<')
        tl.fromTo(items[4], { xPercent: 80 }, { xPercent: 0 }, '<')
        tl.fromTo(innerItems[4], { xPercent: -80 }, { xPercent: 0 }, '<')
        tl.fromTo(mediaContainers[4], { xPercent: -15, scale: 0.45, transformOrigin: '100% 100% 0px' }, { xPercent: -60, scale: 1.0 }, '<')
        tl.fromTo(mediaContainersInner[4], { scale: 1.55, transformOrigin: '50% 50% 0px' }, { scale: 1.0 }, '<')
        tl.fromTo(items[5], { xPercent: 95 }, { xPercent: 80 }, '<')
        tl.fromTo(innerItems[5], { xPercent: -95 }, { xPercent: -80 }, '<')
        tl.fromTo(mediaContainers[5], { scale: 0.15, transformOrigin: '100% 100% 0px' }, { scale: 0.6 }, '<')
        tl.fromTo(mediaContainersInner[5], { scale: 1.85, transformOrigin: '50% 50% 0px' }, { scale: 1.55 }, '<')

        // --- Phase 5 ---
        tl.addLabel('phase-5', '>')
        tl.fromTo(items[4], { xPercent: 0 }, { xPercent: -100 })
        tl.fromTo(innerItems[4], { xPercent: 0 }, { xPercent: 100 }, '<')
        tl.fromTo(mediaContainers[4], { xPercent: -60, scale: 1.0, transformOrigin: '100% 100% 0px' }, { xPercent: -150, scale: 0.8, duration: .55 }, '<')
        tl.fromTo(mediaContainersInner[4], { scale: 1.0, transformOrigin: '50% 50% 0px' }, { scale: 1.2, duration: .5 }, '<')
        tl.fromTo(items[5], { xPercent: 80 }, { xPercent: 0 }, '<')
        tl.fromTo(innerItems[5], { xPercent: -80 }, { xPercent: 0 }, '<')
        tl.fromTo(mediaContainers[5], { xPercent: 0, scale: 0.6, transformOrigin: '100% 100% 0px' }, { xPercent: -60, scale: 1.0 }, '<')
        tl.fromTo(mediaContainersInner[5], { scale: 1.55, transformOrigin: '50% 50% 0px' }, { scale: 1.0 }, '<')
      }, mainSection.current)
      return () => desktop.revert()
    })

    return () => mm.revert()
  }, [])
  
  return (
    <div className="EarlyOrthodontics">
      <div ref={mainSection} className="MainSection" style={{ backgroundColor: 'var(--white)', }}>
        <div className="MainSection-wrapper">
     <div className="MainSection-header">
  <div className="w-full flex justify-center items-center min-[1440px]:justify-start">
    <SlidingText
      text="Early Orthodontics"
      effect="2"
      totalCells={8}
      className="block font-lg font-canelathin translate-y-6 min-[1440px]:translate-y-0 text-center min-[1440px]:text-left"
    />
  </div>
</div>
          <div ref={itemsContainer} className="MainSection-items">
            <section className="MainSectionItem MainSection-item">
              <div className="--index-first MainSectionItem-inner">
                <div className="MainSectionItem-innerSticky">
                  <div className="MainSectionItem-background" style={{ backgroundColor: 'var(--white)', }} />
                  <div className="MainSectionItem-content">
                    <div className="MainSectionItem-contentTitle">
                      <span className="MainSectionItem-index">01</span>
                      <h3>Smart to Start</h3>
                    </div>
                    <div className="MainSectionItem-contentText">
                      <p>Our doctors—as well as the American Association of Orthodontists—recommend an initial orthodontic screening at around age 7. At this stage, 3D imaging is used to evaluate the developing bite and predict the trajectory of permanent teeth. It also helps identify issues such as supernumerary (extra) or missing teeth, assess airway development (including risk factors for sleep apnea), and detect jaw growth discrepancies. Obstructive habits like thumb sucking, tongue thrusting, or early malocclusion can be addressed early to support optimal jaw and airway development.</p>
                    </div>
                  </div>
                  <div className="MainSectionItem-mediaContainer">
                    <div className="MainSectionItem-mediaContainerInner">
                      <div className="MainSectionItem-media">
                        <img
                          src="/images/7milestone.png"
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
                  <div className="MainSectionItem-background" style={{ backgroundColor: 'var(--purple)', }} />
                  <div className="MainSectionItem-content">
                    <div className="MainSectionItem-contentTitle">
                      <span className="MainSectionItem-index">02</span>
                      <h3>Lucky Number 7</h3>
                    </div>
                    <div className="MainSectionItem-contentText">
                      <p>Key dental landmarks are typically in place: the permanent first molars are positioned in the dental arches, and all four upper and lower (eight total) permanent incisors are either fully erupted or close to erupting. These markers allow our doctors to accurately assess the width of the arches, the front-to-back (anterior-posterior) relationship of the jaws, and identify any crossbites—whether in the front or back of the mouth. This is also the stage when significant arch length deficiencies can be detected, giving us the chance to intervene early to provide room for all permanent teeth. and guide proper development before more complex problems arise.</p>
                    </div>
                  </div>
                  <div className="MainSectionItem-mediaContainer">
                    <div className="MainSectionItem-mediaContainerInner">
                      <div className="MainSectionItem-media image-wrapper">
                        <img
                          src="/images/childsideprofile.png"
                          alt="Facial silhouette"
                          loading="lazy"
                          className="profile-image"
                        />
                        <svg
                          className="overlay-lines"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 100 100"
                          preserveAspectRatio="xMidYMid slice"
                        >
                          <line x1="58" y1="38" x2="58" y2="64" stroke="#ffffff80" 
                            strokeWidth="0.5"
                            strokeLinecap="round"
                            stroke-dasharray="2 3"
                            vectorEffect="non-scaling-stroke"/>
                            <line
                          x1="55.5" y1="48"
                          x2="60.5" y2="48"
                          stroke="#ffffff80"
                          strokeWidth="0.5"
                          strokeLinecap="round"
                            stroke-dasharray="2 3"
                          vectorEffect="non-scaling-stroke"
                        />
                        <line
                          x1="58"
                          y1="65"
                          x2="74"
                          y2="66"
                          stroke="#ffffff80"
                          strokeWidth="0.5"
                          strokeLinecap="round"
                          stroke-dasharray="2 3"
                          vectorEffect="non-scaling-stroke"
                        />
                        <path
                          d="M61 66.5 Q69 68.5 77 67.5"
                          fill="none"
                          stroke="#ffffff80"
                          strokeWidth="0.5"
                          strokeLinecap="round"
                          stroke-dasharray="2 3"
                          vectorEffect="non-scaling-stroke"
                        />
                        <circle cx="58" cy="48" r="0.4" fill="#ffffff" />
                        <circle
                          cx="58"
                          cy="48"
                          r="1.1"
                          fill="none"
                          stroke="rgba(255,255,255,0.25)"
                          strokeWidth="0.2"
                        />
                        <circle
                          cx="58"
                          cy="65"
                          r="0.4"
                          fill="#ffffff"
                          vectorEffect="non-scaling-stroke"
                        />
                        <circle
                          cx="74"
                          cy="66"
                          r="0.4"
                          fill="#ffffff"
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
                  <div className="MainSectionItem-background" style={{ backgroundColor: 'var(--brightgreen)', }} />
                  <div className="MainSectionItem-content">
                    <div className="MainSectionItem-contentTitle">
                      <span className="MainSectionItem-index">03</span>
                      <h3>The Airway Equation</h3>
                    </div>
                    <div className="MainSectionItem-contentText">
                      <p>We also assess the airway and surrounding structures, including the tonsils and adenoids. Enlarged tonsils (tonsillar hypertrophy) and adenoids can restrict airflow, disrupt breathing during sleep, and negatively impact how the jaws and arches grow—often contributing to a condition known as adenoid facies, characterized by long, narrow facial development and mouth breathing.</p>
                    </div>
                  </div>
                  <div className="MainSectionItem-mediaContainer">
                    <div className="MainSectionItem-mediaContainerInner">
                      <div className="MainSectionItem-media">
                        <img
                          src="/images/airwayequation.png"
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
                  <div className="MainSectionItem-background" style={{ backgroundColor: 'var(--eggshellgrey)', }} />
                  <div className="MainSectionItem-content">
                    <div className="MainSectionItem-contentTitle">
                      <span className="MainSectionItem-index">04</span>
                                         <h3>Future-Proof</h3>
                    </div>
                    <div className="MainSectionItem-contentText">
                            <p>Once you visit us, we take care of the rest. If no treatment is needed right away, we'll place your child on a customized Growth & Guidance schedule—our way of future-proofing your child's smile. </p>
                 
                    </div>
                  </div>
                  <div className="MainSectionItem-mediaContainer">
                    <div className="MainSectionItem-mediaContainerInner">
                      <div className="MainSectionItem-media">
                          <img
                          src="/images/ffscard.jpg"
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
                  <div className="MainSectionItem-background" style={{ backgroundColor: 'var(--hotpink)', }} />
                  
                  <div className="MainSectionItem-content">
                    <div className="MainSectionItem-contentTitle">
                      <span className="MainSectionItem-index">05</span>
                        <h3>Interceptive Treatment</h3>

                    </div>
                    <div className="MainSectionItem-contentText">
                        <p>Timely intervention makes it possible to manage many cases more comfortably with clear aligners which gently guide growth while also functioning as protective mouth guards during sports or severe dental protrustion. Through proactive, individualized treatment we're able to minimize disruption, improve oral hygiene, reduce enamel damage, and help children avoid the physical and emotional burden of bulky appliances later on.</p>
                    </div>
                  </div>
                  <div className="MainSectionItem-mediaContainer">
                    <div className="MainSectionItem-mediaContainerInner">
                      <div className="MainSectionItem-media">
                               <video
                        src="/videos/luckynumber7.mp4"
                        autoPlay
                        loop
                        muted
                        playsInline
                        preload="metadata"
                      />
                          {/* <video
                        src="https://cdn.prod.website-files.com/678671a66edd3849bbcac5e3%2F678a1ef8f7108323f84eecda_4990242-sd_960_540_30fps-transcode.mp4"
                        autoPlay
                        loop
                        muted
                        playsInline
                        preload="metadata"
                      /> */}
                    
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
                      <h3>Early Is Still Now</h3>
                    </div>
                    <div className="MainSectionItem-contentText">
                      <p>Early visits build familiarity with our doctors and team and often leads to better compliance and the best treatment experience. Even if no treatment is needed right away, that first screening sets the stage for better results later. Think of it as laying the groundwork—not just for a great smile, but for a positive experience along the way.</p>
                    </div>
                  </div>
                  <div className="MainSectionItem-mediaContainer">
                    <div className="MainSectionItem-mediaContainerInner">
                      <div className="MainSectionItem-media">
                           <video
                        src="/videos/alwayslookingahead.mp4"
                        autoPlay
                        loop
                        muted
                        playsInline
                        preload="metadata"
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