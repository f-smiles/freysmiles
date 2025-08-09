'use client'
import React, { useEffect, useRef } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'
import gsap from 'gsap'
import { data } from '../js/data.js'

export function Main() {
  const mainSection = useRef(null)

  useEffect(() => {
    const items = document.querySelectorAll('.MainSectionItem')
    const texts = document.querySelectorAll('.MainSectionItem-content')
    const medias = document.querySelectorAll('.MainSectionItem-imageContainer')
    const innerStickies = document.querySelectorAll('.MainSectionItem-innerSticky')
    const backgrounds = document.querySelectorAll('.MainSectionItem-background')

    const ctx = gsap.context(() => {
      // items.forEach((item, i) => {
      //   if (i !== 0) gsap.set(item, { xPercent: 100 * i })
      // })

      // texts.forEach((text, i) => {
      //   if (i !== 0) { gsap.set(text, { xPercent: -111 })}
      // })

      gsap.set(items[0], { xPercent: 0 })
      gsap.set(items[1], { xPercent: 80 })
      gsap.set(items[2], { xPercent: 95 })
      gsap.set(items[3], { xPercent: 100 })
      gsap.set(items[4], { xPercent: 100 })

      gsap.set(medias[0], { xPercent: -60 })
      gsap.set(medias[1], { xPercent: -80, scale: 0.45 })

      // gsap.set(texts[1], { xPercent: -50 })

      const tl = gsap.timeline({
        defaults: { ease: 'none', },
        scrollTrigger: {
          trigger: mainSection.current,
          start: 'top top',
          end: () => `+=${(items.length) * 100}%`,
          pin: true,
          scrub: 1,
          markers: true,
        },
      })

      tl.to(medias[0], { xPercent: -100, scale: 0.8, transformOrigin: `100% 100% 0px`, duration: 0.1 }, '<')
      // tl.to(medias[1], { xPercent: 50, scale: 0.8 }, '<')
      
      // tl.to(texts[1], { xPercent: 0 }, '<')

      tl.to(items[1], { xPercent: 0, duration: 0.25 }, '<')
      tl.to(items[2], { xPercent: 0, duration: 0.5 }, '<')
      tl.to(items[3], { xPercent: 0, duration: 1.0 }, '<')
      tl.to(items[4], { xPercent: 0, duration: 2.0 }, '<')

      // for (let i = 1; i <= data.length; i ++) {
      //   items.forEach((item, idx) => {
      //     tl.to(items[idx + 1], {
      //       xPercent: -100,
      //       // duration: 1,
      //       // stagger: 2,
      //     }, idx)
      //   })

      //   texts.forEach((text, idx) => {
      //     tl.to(texts[idx + 1], {
      //       xPercent: 0,
      //     }, idx)
      //   })
      // }
    }, mainSection.current)
    return () => ctx.revert()
  }, [])

  return (
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