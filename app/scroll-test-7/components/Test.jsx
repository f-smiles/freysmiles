'use client'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { data } from '../js/data.js'

gsap.registerPlugin(ScrollTrigger)

export function Test() {
  const mainSection = useRef(null)
  const imageContainerOne = useRef(null)

  useEffect(() => {
    const sections = gsap.utils.toArray('.MainSectionItem')

    const ctx = gsap.context(() => {
      gsap.fromTo(
        imageContainerOne.current,
        { transform: 'translate3d(-60%, 0px, 0px)' },
        {
          transformOrigin: '100% 100% 0px',
          transform: 'translate3d(-150%, 0px, 0px) scale(0.8)',
          ease: 'none',
          delay: 1,
          scrollTrigger: {
            trigger: mainSection.current,
            start: 'top top',
            end: 'top center',
            scrub: 1,
          }
        },
      )
      // gsap.fromTo(
      //   sections[0],
      //   { transform: 'translate3d(0%, 0px, 0px)' },
      //   {
      //     transform: 'translate3d(-100%, 0px, 0px)',
      //     ease: 'none',
      //     scrollTrigger: {
      //       trigger: sections[0],
      //       start: 'top top',
      //       end: 'bottom top',
      //       scrub: true,
      //     }
      //   },
      // )
      gsap.fromTo(
        sections[1],
        { transform: 'translate3d(80%, 0px, 0px)' },
        {
          transform: 'translate3d(-100%, 0px, 0px)',
          ease: 'none',
          scrollTrigger: {
            trigger: sections[1],
            start: 'top top',
            end: 'bottom top',
            scrub: 1,
          }
        },
      )
      gsap.fromTo(
        sections[2],
        { transform: 'translate3d(95%, 0px, 0px)' },
        {
          transform: 'translate3d(-100%, 0px, 0px)',
          ease: 'none',
          scrollTrigger: {
            trigger: sections[2],
            start: 'top top',
            end: 'bottom top',
            scrub: 1,
          }
        },
      )
    }, mainSection.current)

    return () => ctx.revert()
  }, [])

  return (
    <div ref={mainSection} className="MainSection" style={{ backgroundColor: 'var(--blue)', '--91c5acce': 5, }}>
      <div className="MainSection-wrap" style={{ position: 'sticky' }}> {/* style={{ position: 'sticky' }} */}
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
                <div ref={imageContainerOne} className="MainSectionItem-imageContainer">
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
        </div>
      </div>
    </div>
  )
}

// gsap.fromTo(
//   imageContainerOne.current,
//   { transform: 'translate3d(-60%, 0px, 0px)' },
//   {
//     transformOrigin: '100% 100% 0px',
//     transform: 'translate3d(-150%, 0px, 0px) scale(0.8)',
//     ease: 'none',
//     scrollTrigger: {
//       trigger: imageContainerOne.current,
//       start: 'top center',
//       end: 'bottom top',
//       scrub: true,
//     }
//   },
// )

{/* <a href="/expertises/conseil-et-strategie-digitale/" className="AppLink AppButton --light --is-show HomeExpertisesItem-button">
  <div className="AppButton-border"></div>
  <div className="AppButton-label AppSmallText-1">
    <span>Voir l'expertise</span>
  </div>
  <div className="AppButton-svgWrap">
    <div className="AppButton-svgWrapDot"></div>
    <div class="AppButton-arrowWrap">
      <span className="AppSvg AppButton-svg">
        <svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0.292893 17.2929C-0.0976311 17.6834 -0.0976311 18.3166 0.292893 18.7071C0.683418 19.0976 1.31658 19.0976 1.70711 18.7071L0.292893 17.2929ZM18.9706 1.02944C18.9706 0.477153 18.5228 0.0294373 17.9706 0.029437L8.97056 0.0294378C8.41828 0.0294375 7.97056 0.477153 7.97056 1.02944C7.97056 1.58172 8.41828 2.02944 8.97056 2.02944L16.9706 2.02944L16.9706 10.0294C16.9706 10.5817 17.4183 11.0294 17.9706 11.0294C18.5228 11.0294 18.9706 10.5817 18.9706 10.0294L18.9706 1.02944ZM1.70711 18.7071L18.6777 1.73654L17.2635 0.322331L0.292893 17.2929L1.70711 18.7071Z" fill="inherit"></path>
        </svg>
      </span>
    </div>
  </div>
</a> */}