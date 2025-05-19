'use client'
import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { SplitText } from 'gsap/SplitText'

gsap.registerPlugin(useGSAP, SplitText)

const EarlyOrthodontics = () => {
  const container = useRef<HTMLDivElement>(null)
  const animateLines = useRef<gsap.core.Tween | null>(null)
  const animateWords = useRef<gsap.core.Tween | null>(null)

  useGSAP(() => {
    const splitLines = new SplitText(".split-lines", {
      type: "lines",
      linesClass: "line",
      autoSplit: true,
      mask: "lines",
      onSplit: (self) => {
        animateLines.current = gsap.from(self.lines, {
          duration: 0.6,
          yPercent: 100,
          opacity: 0,
          stagger: 0.1,
          ease: "power2.out",
        })
        return animateLines.current
      }
    })

    const splitWords = new SplitText(".split-words", {
      type: "words",
      wordsClass: "word",
      autoSplit: true,
      mask: "words",
      onSplit: (self) => {
        animateWords.current = gsap.from(self.words, {
          duration: 0.6,
          yPercent: 100,
          opacity: 0,
          stagger: 0.1,
          ease: "power2.out",
        })
        return animateWords.current
      }
    })

    return () => {
      splitLines.revert()
      splitWords.revert()
    }
  }, { scope: container })

  return (
    <section>
      <div className="flex gap-2">
        <div ref={container} className="w-8/12 h-full p-8 space-y-8 rounded-3xl bg-zinc-50">
          <h2 className="w-3/4 uppercase split-words">Jaded zombies acted quaintly but kept driving their oxen forward.</h2>
          <p className="w-1/2 text-sm uppercase split-lines">Two driven jocks help fax my big quiz. Five quacking zephyrs jolt my wax bed. The five boxing wizards jump quickly.Pack my box with five dozen liquor jugs.</p>
        </div>
        <div className="w-4/12 h-full p-8 rounded-3xl bg-zinc-50"></div>
      </div>
    </section>
  )
}

export default EarlyOrthodontics