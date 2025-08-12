'use client'
import React, { useEffect, useRef } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'
import gsap from 'gsap'
import { data } from '../js/data.js'

export function Main() {
  const mainSection = useRef(null)
  const markerLeft = useRef(null)
  const markerRight = useRef(null)

  useEffect(() => {
    const items = document.querySelectorAll('.MainSectionItem')
    const innerItems = document.querySelectorAll('.MainSectionItem-inner')
    const innerStickies = document.querySelectorAll('.MainSectionItem-innerSticky')
    const imageContainers = document.querySelectorAll('.MainSectionItem-imageContainer')
    const imageContainersInner = document.querySelectorAll('.MainSectionItem-imageContainerInner')
    const images = document.querySelectorAll('.MainSectionItem-image')

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: mainSection.current,
          start: 'top top',
          end: () => `+=${items.length * 100}%`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
          markers: true,
        }
      })

      gsap.set(items[0], { xPercent: 0 })
      gsap.set(innerItems[0], { xPercent: 0 })
      gsap.set(innerStickies[0], { xPercent: 0 })
      gsap.set(imageContainers[0], { xPercent: -60, transformOrigin: '100% 100% 0px' })
      gsap.set(imageContainersInner[0], { xPercent: 0, transformOrigin: '50% 50% 0px' })
      gsap.set(images[0], { aspectRatio: 1.3793103448275863 })

      tl.to(items[0], { translateX: '-100%', duration: 2 }, '<')
      tl.to(innerItems[0], { translateX: '100%', duration: 2 }, '<')
      tl.to(imageContainers[0], { translateX: '-60%', scale: 0.8, duration: 2 }, '<') // translateX: '-150%'
      tl.to(imageContainersInner[0], { translateX: '0%', scale: 1.2, duration: 2 }, '<')

      gsap.set(items[1], { xPercent: 80 })
      gsap.set(innerItems[1], { xPercent: -80 })
      gsap.set(imageContainers[1], { xPercent: -15, scale: 0.45, transformOrigin: '100% 100% 0px' })
      gsap.set(imageContainersInner[1], { xPercent: 0, scale: 1.55, transformOrigin: '50% 50% 0px' })
      gsap.set(images[1], { aspectRatio: 1.3793103448275863 })
      
      tl.to(items[1], { translateX: '-100%', duration: 2 }, '<')
      tl.to(innerItems[1], { translateX: '100%', duration: 2 }, '<')
      tl.to(imageContainers[1], { translateX: '-150%', scale: 0.8, duration: 2 }, '<')
      tl.to(imageContainersInner[1], { translateX: '0%', scale: 1.2, duration: 2 }, '<')
      
      gsap.set(items[2], { xPercent: 95 })
      gsap.set(innerItems[2], { xPercent: -95, transformOrigin: '100% 100% 0px' })
      gsap.set(imageContainers[2], { xPercent: 0, scale: 0.15, transformOrigin: '100% 100% 0px' })
      gsap.set(imageContainersInner[2], { xPercent: 0, scale: 1.85, transformOrigin: '50% 50% 0px' })
      gsap.set(images[2], { aspectRatio: 1.3793103448275863 })

      tl.to(items[2], { translateX: '-100%', duration: 4 }, '<')
      tl.to(innerItems[2], { translateX: '100%', duration: 4 }, '<')
      tl.to(imageContainers[2], { translateX: '-150%', scale: 0.8, duration: 4 }, '<')
      tl.to(imageContainersInner[2], { translateX: '0%', scale: 1.2, duration: 4 }, '<')

      gsap.set(items[3], { xPercent: 100 })
      gsap.set(items[4], { xPercent: 100 })
      
      gsap.set(markerLeft.current, { left: mainSection.current.clientWidth * 0.33 })
      gsap.set(markerRight.current, { right: mainSection.current.clientWidth * 0.2 })

    }, mainSection.current)

    return () => ctx.revert()
  }, [])

  return (
    <>
      <div ref={mainSection} className="MainSection" style={{ backgroundColor: 'var(--blue)', '--91c5acce': 5, }}>
        <div className="MainSection-wrap" style={{ position: 'sticky' }}>
          <div className="MainSection-items">
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
                    <h3 className="MainSectionItem-contentTitle AppTitle-3">Nature's Masterpieces: Landscapes That Take Your Breath Away</h3>
                    <div className="MainSectionItem-contentText">
                      <div className="AppText-12 ">
                        <p>Discover stunning views of majestic mountains, endless oceans, and golden sunsets that remind us of nature's artistic brilliance.</p>
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
            <div className="MainSectionItem MainSection-item">
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
        </div>
      </div>
      <div ref={markerLeft} className="custom-marker left"></div>
      <div ref={markerRight} className="custom-marker right"></div>
    </>
  )
}

const Item = ({ backgroundColor, index, contentTitle, contentText, imgUrl, children }) => {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["end end", "start start"],
  })

  const animateX = useTransform(scrollYProgress, [0, 1], [100, 0])

  return (
    <motion.div ref={ref} style={{ transform: `translate3d(${animateX}, '0px', '0px')` }} className="MainSectionItem MainSection-item">
      <div className="--index-first MainSectionItem-inner">
        <div className="MainSectionItem-innerSticky">
          <div className="MainSectionItem-background" style={{ backgroundColor }} />
          <div className="MainSectionItem-content">
            <span className="MainSectionItem-index">{index}</span>
            <h3 className="MainSectionItem-contentTitle AppTitle-3">{contentTitle}</h3>
            <div className="MainSectionItem-contentText">
              <div className="AppText-12">
                <p>{contentText}</p>
              </div>
            </div>
          </div>
          <div className="MainSectionItem-imageContainer">
            <div className="MainSectionItem-imageContainerInner">
              <div className="AppImage MainSectionItem-image">
                <div className="AppImage-image --placeholder --lazy --loaded" style={{ objectFit: 'cover', backgroundImage: imgUrl, backgroundSize: 'cover', backgroundPosition: 'center center', }} ></div>
                <img src={imgUrl} width="480" height="348" alt="Video of a landscape" loading="lazy" style={{ objectFit: 'cover' }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

 {/* {data.map((_) => (
    <Item
      backgroundColor={_.backgroundColor}
      index={_.id}
      contentTitle={_.heading}
      contentText={_.description}
      backgroundImage={"/images/test/1.jpg"}
      imgUrl={"/images/test/1.jpg"}
    />
  ))} */}

//  <div className="MainSectionItem MainSection-item">
//   <div className="--index-first MainSectionItem-inner">
//     <div className="MainSectionItem-innerSticky">
//       <div className="MainSectionItem-background" style={{ backgroundColor: 'var(--blue)', }} />
//       <div className="MainSectionItem-content">
//         <span className="MainSectionItem-index">01</span>
//         <h3 className="MainSectionItem-contentTitle AppTitle-3">Wildlife in Action: A Glimpse into Nature's Daily Drama</h3>
//         <div className="MainSectionItem-contentText">
//           <div className="AppText-12 ">
//             <p>Explore the untouched beauty of forests, mountains, and rivers as we uncover the hidden secrets of nature's most breathtaking landscapes.</p>
//           </div>
//         </div>
//       </div>
//       <div className="MainSectionItem-imageContainer">
//         <div className="MainSectionItem-imageContainerInner">
//           <div className="AppImage MainSectionItem-image">
//             <div className="AppImage-image --placeholder --lazy --loaded" style={{ objectFit: 'cover', backgroundImage: "url('/images/test/1.jpg')", backgroundSize: 'cover', backgroundPosition: 'center center', }} ></div>
//             <img src="/images/test/1.jpg" width="480" height="348" alt="Video of a landscape" loading="lazy" style={{ objectFit: 'cover' }}></img>
//           </div>
//         </div>
//       </div>
//     </div>
//   </div>
// </div>
// <div className="MainSectionItem MainSection-item">
//   <div className="--index-between MainSectionItem-inner">
//     <div className="MainSectionItem-innerSticky">
//       <div className="MainSectionItem-background" style={{ backgroundColor: 'var(--pink)', }} />
//       <div className="MainSectionItem-content">
//         <span className="MainSectionItem-index">02</span>
//         <h3 className="MainSectionItem-contentTitle AppTitle-3">Nature's Symphony: The Sounds That Heal the Soul</h3>
//         <div className="MainSectionItem-contentText">
//           <div className="AppText-12 ">
//             <p>Immerse yourself in the soothing sounds of chirping birds, rustling leaves, and flowing streams - nature's music for peace and tranquility.</p>
//           </div>
//         </div>
//       </div>
//       <div className="MainSectionItem-imageContainer">
//         <div className="MainSectionItem-imageContainerInner">
//           <div className="AppImage MainSectionItem-image">
//             <div className="AppImage-image --placeholder --lazy --loaded" style={{ objectFit: 'cover', backgroundImage: "url('/images/test/2.jpg')", backgroundSize: 'cover', backgroundPosition: 'center center', }} ></div>
//             <img src="/images/test/2.jpg" width="480" height="348" alt="Video of a landscape" loading="lazy" style={{ objectFit: 'cover' }}></img>
//           </div>
//         </div>
//       </div>
//     </div>
//   </div>
// </div>
// <div className="MainSectionItem MainSection-item">
//   <div className="--index-between MainSectionItem-inner">
//     <div className="MainSectionItem-innerSticky">
//       <div className="MainSectionItem-background" style={{ backgroundColor: 'var(--green)', }} />
//       <div className="MainSectionItem-content">
//         <span className="MainSectionItem-index">03</span>
//         <h3 className="MainSectionItem-contentTitle AppTitle-3">Nature's Masterpieces: Landscapes That Take Your Breath Away</h3>
//         <div className="MainSectionItem-contentText">
//           <div className="AppText-12 ">
//             <p>Discover stunning views of majestic mountains, endless oceans, and golden sunsets that remind us of nature's artistic brilliance.</p>
//           </div>
//         </div>
//       </div>
//       <div className="MainSectionItem-imageContainer">
//         <div className="MainSectionItem-imageContainerInner">
//           <div className="AppImage MainSectionItem-image">
//             <div className="AppImage-image --placeholder --lazy --loaded" style={{ objectFit: 'cover', backgroundImage: "url('/images/test/3.jpg')", backgroundSize: 'cover', backgroundPosition: 'center center', }} ></div>
//             <img src="/images/test/3.jpg" width="480" height="348" alt="Video of a landscape" loading="lazy" style={{ objectFit: 'cover' }}></img>
//           </div>
//         </div>
//       </div>
//     </div>
//   </div>
// </div>