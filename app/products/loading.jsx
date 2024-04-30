"use client"
import Link from "next/link"
import ArrowLongRight from "../_components/ui/ArrowLongRight"
import ChevronDownIcon from "../_components/ui/ChevronDownIcon"

function Banner() {
  const text = "CLICK HERE TO SHOP GIFT CARDS ";
  const separator = " • ";
  const repeatedText = Array(50).fill(text + separator).join("");

  return (
    <div className="relative isolate flex justify-center items-center gap-x-6 overflow-hidden bg-gray-50 px-6 py-2.5 sm:px-3.5">
      <div
        className="absolute left-[max(-7rem,calc(50%-52rem))] top-1/2 -z-10 -translate-y-1/2 transform-gpu blur-2xl"
        aria-hidden="true"
      >
        <div
          className="aspect-[577/310] w-[36.0625rem] bg-gradient-to-r from-[#ff80b5] to-[#9089fc] opacity-30"
          style={{
            clipPath:
              'polygon(74.8% 41.9%, 97.2% 73.2%, 100% 34.9%, 92.5% 0.4%, 87.5% 0%, 75% 28.6%, 58.5% 54.6%, 50.1% 56.8%, 46.9% 44%, 48.3% 17.4%, 24.7% 53.9%, 0% 27.9%, 11.9% 74.2%, 24.9% 54.1%, 68.6% 100%, 74.8% 41.9%)',
          }}
        />
      </div>
      <div
        className="absolute left-[max(45rem,calc(50%+8rem))] top-1/2 -z-10 -translate-y-1/2 transform-gpu blur-2xl"
        aria-hidden="true"
      >
        <div
          className="aspect-[577/310] w-[36.0625rem] bg-gradient-to-r from-[#ff80b5] to-[#9089fc] opacity-30"
          style={{
            clipPath:
              'polygon(74.8% 41.9%, 97.2% 73.2%, 100% 34.9%, 92.5% 0.4%, 87.5% 0%, 75% 28.6%, 58.5% 54.6%, 50.1% 56.8%, 46.9% 44%, 48.3% 17.4%, 24.7% 53.9%, 0% 27.9%, 11.9% 74.2%, 24.9% 54.1%, 68.6% 100%, 74.8% 41.9%)',
          }}
        />
      </div>
      <div className="overflow-hidden">
        <Link href={`${process.env.NEXT_PUBLIC_SQUARE_GIFT_CARDS_URL}`} target='_blank'>
          <div className="animate-giftCardMarquee whitespace-nowrap block text-[15vw] text-purple-400 text-sm leading-6">
            {repeatedText}{repeatedText}
          </div>
        </Link>
      </div>
    </div>
  )
}

function Hero() {
  const letters = [
    { char: 'S', rotate: 'rotate-12', translateY: 'translate-y-', color: 'text-black' },
    { char: 'H', rotate: 'rotate-12', translateY: 'translate-y-20', color: 'text-black' },
    { char: 'O', rotate: 'rotate-6', translateY: 'translate-y-2', color: 'text-black' },
    { char: 'P', rotate: 'rotate-2', translateY: 'translate-y-20',translateX: 'translate-x-2', color: 'text-black' },
  ]

  const lettersNow = [
    { char: 'N', rotate: 'rotate-12', translateY: 'translate-y-1', color: 'text-black' },
    { char: 'O', rotate: 'rotate-12', translateY: 'translate-y-5', color: 'text-black' },
    { char: 'W', rotate: 'rotate-6', translateY: 'translate-y-1', color: 'text-black' },
  ]

  return (
    <section className="flex flex-col items-center justify-center h-screen space-y-8 ">
      <div className="flex flex-wrap items-end justify-center font-grandslang">
        {letters.map((style, index) => (
          <span
            key={index}
            className={`inline-block ${style.rotate} ${style.translateY} ${style.translateX}  ${style.color} mx-1`}
            style={{ fontSize: '8rem' }}
          >
            {style.char}
          </span>
        ))}
      </div>
      <div className="flex items-end justify-center font-grandslang">
        {lettersNow.map((style, index) => (
          <span
            key={`now-${index}`}
            className={`inline-block ${style.rotate} ${style.translateY} ${style.color}`}
            style={{ fontSize: '8rem' }}
          >
            {style.char}
          </span>
        ))}
      </div>
    </section>
  )
}

export default function LoadingAllProducts() {
  return (
    <div>
      <Banner />
      <Hero />
      <section className="max-w-2xl px-10 mx-auto my-16 mb-32 lg:max-w-7xl">
        <div className="flex items-baseline justify-between w-full pb-4 border-b-2 border-gray-100">
          <div className="relative inline-block text-left">
            <p className="inline-flex items-center justify-center text-lg font-medium text-gray-700 uppercase group hover:text-gray-900">
              Sort by
              <ChevronDownIcon
                className="flex-shrink-0 w-5 h-5 ml-1 -mr-1 text-gray-400 group-hover:text-gray-500"
                aria-hidden="true"
              />
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 mt-6 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="w-full overflow-hidden bg-white rounded-md h-80 aspect-h-1 aspect-w-1 lg:aspect-none lg:h-80">
                <div className="object-cover object-center w-full h-full lg:object-contain lg:h-full lg:w-full bg-zinc-200"/>
              </div>
              <div className="flex justify-between gap-4 mt-4">
                <div className="w-3/5 h-4 rounded-full bg-zinc-200" />
                <div className="w-1/5 h-4 rounded-full bg-zinc-200" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
