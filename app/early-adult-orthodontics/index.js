"use client"
import { useRef } from "react"
import Link from "next/link"
import { motion, useInView } from "framer-motion"

export default function EarlyAdultOrthodontics() {
  return (
    <>
      <Header />
      <EarlyOrthodontics />
      <hr />
      <AdultOrthodontics />
    </>
  )
}

function Header() {
  return (
    <header className="relative z-10 w-screen py-24 overflow-hidden sm:py-32">
      <img
        src="/../../images/_mesh_gradients/37. Light Sky Blue.jpg"
        alt=""
        className="absolute inset-0 object-cover object-bottom w-full h-full -z-10"
      />
      <div className="px-6 mx-auto max-w-7xl lg:px-8">
        <div className="max-w-3xl mx-auto lg:mx-0">
          <h1 className="font-helvetica-now-thin">Early & Adult Orthodontics</h1>
          {/* <h2 className="text-4xl tracking-tight text-zinc-800 sm:text-6xl font-helvetica-now-thin">Early & Adult Orthodontics</h2> */}
        </div>
      </div>
    </header>
  )
}

function EarlyOrthodontics() {
  const ref = useRef(null)
  const isInView = useInView(ref)

  return (
    <section ref={ref} className="mb-32 lg:mb-64">
      {/* Background START */}
      <div className="relative py-12 md:py-16 lg:py-32 isolate">
        <svg className="absolute inset-0 -z-10 hidden h-full w-full stroke-gray-200 [mask-image:radial-gradient(64rem_64rem_at_top,white,transparent)] sm:block" aria-hidden="true">
          <defs>
            <pattern
              id="55d3d46d-692e-45f2-becd-d8bdc9344f45"
              width={200}
              height={200}
              x="50%"
              y={0}
              patternUnits="userSpaceOnUse"
            >
              <path d="M.5 200V.5H200" fill="none" />
            </pattern>
          </defs>
          <svg x="50%" y={0} className="overflow-visible fill-gray-50">
            <path
              d="M-200.5 0h201v201h-201Z M599.5 0h201v201h-201Z M399.5 400h201v201h-201Z M-400.5 600h201v201h-201Z"
              strokeWidth={0}
            />
          </svg>
          <rect width="100%" height="100%" strokeWidth={0} fill="url(#55d3d46d-692e-45f2-becd-d8bdc9344f45)" />
        </svg>
        <div className="relative">
          <div className="absolute inset-x-0 overflow-hidden -translate-y-1/2 top-1/2 -z-10 transform-gpu opacity-30 blur-3xl" aria-hidden="true">
            <div className="ml-[max(50%,38rem)] aspect-[1313/771] w-[82.0625rem] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc]"
              style={{
                clipPath:
                  'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
              }}
            />
          </div>
          <div className="absolute inset-x-0 top-0 flex pt-8 overflow-hidden opacity-25 -z-10 transform-gpu blur-3xl xl:justify-end" aria-hidden="true">
            <div className="ml-[-22rem] aspect-[1313/771] w-[82.0625rem] flex-none origin-top-right rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] xl:ml-0 xl:mr-[calc(50%-12rem)]"
              style={{
                clipPath:
                  'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
              }}
            />
          </div>
        </div>
      </div>
      {/* Background END */}
      
      <div className="max-w-2xl p-8 mx-auto mb-12 text-left md:text-center" style={{
        transform: isInView ? "translateY(0px)" : "translateY(200px)",
        opacity: isInView ? 1 : 0,
        transition: "all 0.5s",
      }}>
        <h2>Early Interceptive Orthodontics</h2>
        <p className="mt-6 text-lg leading-8 text-gray-600">Early treatment can begin the correction of significant problems, prevent more severe problems from developing, and simplify future treatment. Even though early treatment is rarely indicated, assessing dental development, the health of the airway, and evaluating the growth of the face and jaws through key developmental periods is essential to providing the best orthodontic outcomes.</p>
      </div>
      <article className="max-w-6xl mx-auto">
        <div ref={ref} className="grid grid-cols-12 grid-rows-2 gap-4 [&>*]:rounded-lg [&>*]:border-zinc-50 [&>*]:bg-zinc-100/30 [&>*]:backdrop-blur-md [&>*]:p-8 [&>*]:text-zinc-800">
          <div className="col-span-12 row-span-2 lg:col-span-6" style={{
            transform: isInView ? "translateX(0px)" : "translateX(-200px)",
            opacity: isInView ? 1 : 0,
            transition: "all 0.9s cubic-bezier(0.17, 0.55, 0.55, 1) 0.5s",
          }}>
            <h4>Guidance visits are free of charge.</h4>
            <p className="mt-6 text-lg leading-8 text-gray-600">At the guidance visit, our doctors will evaluate your child&apos;s facial and dental development and will notify you of any changes. We will also tell you, as accurately as possible, the estimated age when orthodontic treatment will begin so that you can plan accordingly. These easy and fun visits allow patients to become familiar with our friendly office and provide families with peace of mind. Generally, these appointments are scheduled every six to twelve months.</p>
          </div>
          <div className="col-span-12 row-span-1 lg:col-span-6" style={{
            transform: isInView ? "translateX(0px)" : "translateX(200px)",
            opacity: isInView ? 1 : 0,
            transition: "all 0.9s cubic-bezier(0.17, 0.55, 0.55, 1) 0.5s",
          }}>
            <h4>The American Association of Orthodontics recommends every child have their first orthodontic screening at age 7</h4>
          </div>
          <div className="col-span-12 row-span-1 lg:col-span-6" style={{
            transform: isInView ? "translateX(0px)" : "translateX(200px)",
            opacity: isInView ? 1 : 0,
            transition: "all 0.9s cubic-bezier(0.17, 0.55, 0.55, 1) 0.5s",
          }}>
            <h4>Patients who are not yet ready for orthodontic treatment are enrolled in our Future FreySmiles</h4>
          </div>
        </div>
      </article>
    </section>
  )
}

function AdultOrthodontics() {
  const ref = useRef(null)
  const isInView = useInView(ref)

  return (
    <section className="mb-32 lg:mb-64">
      {/* Background START */}
      <div className="relative py-12 md:py-16 lg:py-32 isolate">
        <svg className="absolute inset-0 -z-10 hidden h-full w-full stroke-gray-200 [mask-image:radial-gradient(64rem_64rem_at_top,white,transparent)] sm:block" aria-hidden="true">
          <defs>
            <pattern
              id="55d3d46d-692e-45f2-becd-d8bdc9344f45"
              width={200}
              height={200}
              x="50%"
              y={0}
              patternUnits="userSpaceOnUse"
            >
              <path d="M.5 200V.5H200" fill="none" />
            </pattern>
          </defs>
          <svg x="50%" y={0} className="overflow-visible fill-gray-50">
            <path
              d="M-200.5 0h201v201h-201Z M599.5 0h201v201h-201Z M399.5 400h201v201h-201Z M-400.5 600h201v201h-201Z"
              strokeWidth={0}
            />
          </svg>
          <rect width="100%" height="100%" strokeWidth={0} fill="url(#55d3d46d-692e-45f2-becd-d8bdc9344f45)" />
        </svg>
        <div className="relative">
          <div className="absolute inset-x-0 overflow-hidden -translate-y-1/2 top-1/2 -z-10 transform-gpu opacity-30 blur-3xl" aria-hidden="true">
            <div className="ml-[max(50%,38rem)] aspect-[1313/771] w-[82.0625rem] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc]"
              style={{
                clipPath:
                  'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
              }}
            />
          </div>
          <div className="absolute inset-x-0 top-0 flex pt-8 overflow-hidden opacity-25 -z-10 transform-gpu blur-3xl xl:justify-end" aria-hidden="true">
            <div className="ml-[-22rem] aspect-[1313/771] w-[82.0625rem] flex-none origin-top-right rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] xl:ml-0 xl:mr-[calc(50%-12rem)]"
              style={{
                clipPath:
                  'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
              }}
            />
          </div>
        </div>
      </div>
      {/* Background END */}

      <div ref={ref} className="max-w-2xl p-8 mx-auto mb-12 text-left md:text-center" style={{
        transform: isInView ? "translateY(0px)" : "translateY(200px)",
        opacity: isInView ? 1 : 0,
        transition: "all 0.5s"
      }}>
        <h2>Adult Orthodontics</h2>
        <p className="mt-6 text-lg leading-8 text-gray-600">It is a big step to invest in straighter teeth and a better bite for yourself, but truthfully many adults are taking the plunge these days. Whether you have grown up with crooked teeth and are looking for the smile you have always wanted, or some of your teeth have slowly crowded with age there is no better time to start than now with adult orthodontics.</p>
      </div>
      <article className="max-w-6xl mx-auto">
        <div ref={ref} className="grid grid-cols-12 grid-rows-2 gap-4 [&>*]:rounded-lg [&>*]:border-zinc-100 [&>*]:bg-zinc-100/30 [&>*]:backdrop-blur-sm [&>*]:p-8 [&>*]:text-zinc-800">
          <div className="col-span-12 row-span-2 lg:row-span-1 lg:col-span-4" style={{
            transform: isInView ? "translateY(0px)" : "translateY(200px)",
            opacity: isInView ? 1 : 0,
            transition: "all 0.9s cubic-bezier(0.17, 0.55, 0.55, 1) 0.5s"
          }}>
            <h4>Experience a beautiful smile without goopy gagging impressions with iTero digital scanner</h4>
          </div>
          <div className="col-span-12 row-span-2 lg:row-span-1 lg:col-span-4" style={{
            transform: isInView ? "translateY(0px)" : "translateY(200px)",
            opacity: isInView ? 1 : 0,
            transition: "all 0.9s cubic-bezier(0.17, 0.55, 0.55, 1) 0.5s"
          }}>
            <h4>Advances in orthodontic technology have made improving your smile with braces faster, more comfortable, and more discreet than ever before</h4>
          </div>
          <div className="col-span-12 row-span-2 lg:row-span-1 lg:col-span-4" style={{
            transform: isInView ? "translateY(0px)" : "translateY(200px)",
            opacity: isInView ? 1 : 0,
            transition: "all 0.9s cubic-bezier(0.17, 0.55, 0.55, 1) 0.5s"
          }}>
            <h4>With an average treatment time of just 12 to 16 months, we can help you achieve your desired smile in half the time</h4>
          </div>
          <div className="col-span-12 row-start-2 md:row-span-2 md:col-span-8" style={{
            transform: isInView ? "translateX(0px)" : "translateX(-200px)",
            opacity: isInView ? 1 : 0,
            transition: "all 0.9s cubic-bezier(0.17, 0.55, 0.55, 1) 0.5s"
          }}>
            <h4>Lehigh Valley&apos;s Top Invisalign Provider</h4>
            <p className="mt-6 text-lg leading-8 text-gray-600">We deliver the best in orthodontic care available today and an affordable cost. Our goal is to provide state-of-the-art orthodontic treatment, including Invisalign, the “braceless” alternative.</p>
          </div>
          <div className="col-span-12 row-start-2 md:row-span-2 md:col-span-4" style={{
            transform: isInView ? "translateX(0px)" : "translateX(200px)",
            opacity: isInView ? 1 : 0,
            transition: "all 0.9s cubic-bezier(0.17, 0.55, 0.55, 1) 0.5s"
          }}>
            <h4>4 Convenient Locations</h4>
            <ul className="mt-6 text-lg text-gray-600">
              <li>Bethlehem</li>
              <li>Allentown</li>
              <li>Schnecksville</li>
              <li>Lehighton</li>
            </ul>
            <Link href="/book-now" className="block mt-6 text-lg leading-8 text-gray-600 underline underline-offset-8">Schedule an appointment</Link>
          </div>
        </div>
      </article>
    </section>
  )
}