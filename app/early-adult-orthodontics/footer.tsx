'use client'
import React, { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { SplitText } from 'gsap/SplitText'

gsap.registerPlugin(useGSAP, SplitText)

const Footer = () => {
  const containerTwo = useRef<HTMLDivElement>(null)
  const animateLinesTwo = useRef<gsap.core.Tween | null>(null)
  const animateWordsTwo = useRef<gsap.core.Tween | null>(null)

  useGSAP(() => {
     const splitLinesTwo = new SplitText(".split-lines", {
      type: "lines",
      linesClass: "line",
      autoSplit: true,
      mask: "lines",
      onSplit: (self) => {
        animateLinesTwo.current = gsap.from(self.lines, {
          duration: 0.6,
          yPercent: 100,
          opacity: 0,
          stagger: 0.1,
          ease: "power2.out",
        })
        return animateLinesTwo.current
      }
    })

    const splitWordsTwo = new SplitText(".split-words", {
      type: "words",
      wordsClass: "word",
      autoSplit: true,
      mask: "words",
      onSplit: (self) => {
        animateWordsTwo.current = gsap.from(self.words, {
          duration: 0.5,
          yPercent: 100,
          opacity: 0,
          stagger: 0.1,
          ease: "power2.out",
        })
        return animateWordsTwo.current
      }
    })

    return () => {
      splitLinesTwo.revert()
      splitWordsTwo.revert()
    }
  }, { scope: containerTwo })
  
  return (
    <section>
      <div className="relative w-full overflow-hidden max-h-[50vh] lg:max-h-[60vh] h-full rounded-3xl bg-zinc-50">
        <video autoPlay loop muted className="w-full h-full hue-rotate-180 saturate-200">
          <source src="/videos/abstract_orange_background.mp4" type="video/mp4" />
        </video>
        <div className="absolute top-0 left-0 w-full h-full bg-white/25 bg-clip-padding backdrop-filter backdrop-blur-xl" />
        <div ref={containerTwo} className="absolute top-[calc(50%-64px)] px-8 w-8/12">
          <h2 className="text-5xl font-editorial-new split-words">Ready for your appointment?</h2>
          <p className="text-lg font-neue-montreal split-lines">Lorem ipsum dolor sit amet consectetur adipisicing elit. Quidem alias placeat, consectetur quis autem id rerum ratione! Sint natus culpa blanditiis libero, tenetur sequi. Mollitia vero quia hic. Quisquam, velit! Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat hic, delectus corrupti ratione ipsam sunt animi excepturi, iure inventore fugiat a voluptatibus, aut doloremque modi possimus et. Quia, similique ab?</p>
        </div>
      </div>
    </section>
  )
}

export default Footer