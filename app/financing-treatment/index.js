'use client'
import { useRef, useEffect } from 'react'
import { motion, useScroll, useSpring, useTransform, useInView } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { SplitText } from "gsap-trial/all";
// import useIsomorphicLayoutEffect from '@/_helpers/useIsomorphicLayoutEffect'

gsap.registerPlugin(ScrollTrigger)

const details = [
  {
    number: "1.",
    heading: "Complimentary consultation",
    body: "Initial consultations are always free of charge.",
    img: "/../../images/initialconsult.png",
    alt: "FreySmiles team member warmly greeting a FreySmiles patient and shaking their hand",
  },
  {
    number: "2.",
    heading: "Payment plans are available",
    body:"We offer a variety of payment plans at no interest.",
    img: "/../../images/orangecylinder.svg",
    alt: "Scene of a girl sitting on top of bags holding a percent sign representing no interest payment at FreySmiles",
  },
  {
    number: "3.",
    heading: "No hidden fees",
    body: "Comprehensive treatment plans include retainers and supervision",
    img: "/../../images/familymembers.png",
    alt: "No hidden fees",
  },
  {
    number: "4.",
    heading: "One year post-treatment follow up",
    body: "Retainers and retention visits for one year post-treatment included.",
    img: "/../../images/followup.png",
    alt: "Booking future appointments",
  }
]

export default function FinancingTreatment() {
  
  const lineRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: lineRef,
    offset: ["start center", "end center"],
  })
  const spring = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  })
  let height = useTransform(spring, [0, 1], ["0%", "100%"])
  const textRef1 = useRef(null);
  const textRef2 = useRef(null);
  const textRef3 = useRef(null);

  const backgroundColors = ['#bcb8ad', '#eacbd1', '#b19bb0']; 


  const inputRange = backgroundColors.map((_, i, arr) => i / (arr.length - 1));


  const backgroundColor = useTransform(scrollYProgress, inputRange, backgroundColors);
  useEffect(() => {
    gsap.registerPlugin(SplitText);

    [textRef1, textRef2, textRef3].forEach(ref => {
      const split = new SplitText(ref.current, { type: 'lines' });
      gsap.from(split.lines, {
        duration: 1.5,
        y: '100%',
        stagger: 0.15,
        ease: 'power4.out'
      });
    });
  }, []);
  
  return (
    <>
    <motion.div  style={{ backgroundColor }} className="z-[-1] bg-[#DBDBDB] relative w-full mx-auto ">
      <section id="main-container" className=" md:flex md:justify-between md:gap-x-6">
  
        {/* LEFT HALF DESKTOP SECTION */}
        <div ref={lineRef} id="left" className="hidden md:block md:w-1/3 md:pl-12">
        <Detail>
  <span className="absolute p-5 rounded-full bg-[#355e3b] -left-12">
    <p className="absolute text-white -translate-x-2/4 -translate-y-2/4"></p>
  </span>
  <div className="flex flex-col justify-center items-center text-[#7D4459] text-6xl uppercase font-altero">
  <div>Complimentary</div>
  <div className="font-altero uppercase stroke-text py-5">Consultation</div>
</div>
<p className="flex text-xl text-center font-helvetica-now-thin ">Initial consultations are always free of charge.</p>


  {/* <img 
    src="../images/complimentary.png" 
    alt="Complimentary Consultation"
    className="w-full -mt-40 h-auto object-cover" 
  /> */}

</Detail>

          <Detail>
            <span className="absolute p-5 rounded-full bg-[#355e3b] -left-12">
              <p className="absolute text-white -translate-x-2/4 -translate-y-2/4"></p>
            </span>
            <div className="text-[#5062a6] text-5xl font-altero">
  <span className="block stroke-text py-5 text-center">PAYMENT PLANS</span>
  <span className="block font-altero uppercase py-2">ARE AVAILABLE</span>
</div>


            <p className="flex text-xl text-center font-helvetica-now-thin">We offer a variety of payment plans at no interest.</p>
          </Detail>
          <Detail>
            <span className="absolute p-5 rounded-full bg-[#355e3b] -left-12">
              <p className="absolute text-white -translate-x-2/4 -translate-y-2/4"></p>
            </span>
            <img 
    src="../images/keepitfam.png" 
    alt="Complimentary Consultation"
    className="w-full h-auto object-cover" 
  />
            <p className="flex text-xl text-center -mt-40 font-helvetica-now-thin">Successive family members always receive the same excellent care. Ask about our family courtesies</p>
          </Detail>
          <Detail>
            <span className="absolute p-5 rounded-full bg-[#355e3b] -left-12">
              <p className="absolute text-white -translate-x-2/4 -translate-y-2/4"></p>
            </span>
            <div className="flex flex-col items-center justify-center h-screen text-[#5062a6] text-5xl font-altero">
  <span className="text-3xl mb-2">One year</span>
  <span className="stroke-text font-altero uppercase mb-2">FOLLOW UP</span>
  <span className="text-3xl">INCLUDED</span>
</div>


            {/* <img 
    src="../images/onyear.png" 
    alt="Complimentary Consultation"
    className="w-full h-auto object-cover" 
  /> */}

          </Detail>
          <motion.div
            className="absolute top-0 hidden w-[2px] h-full left-[22px] md:block bg-[#355e3b] -z-10"
            style={{ height }}
          />
        </div>
        {/* RIGHT HALF DESKTOP SECTION */}
        <div id="right" className="md:w-2/3 md:flex md:flex-col md:justify-center md:items-center">
          {/* MOBILE VIEW */}
          <div id="mobile-view" className="block space-y-16 md:space-y-0 md:hidden">
            {details.map((detail, index) => (
              <figure key={index} className="aspect-square">
                <img
                  src={detail.img}
                  alt={detail.alt}
                  className="object-cover object-center rounded-md"
                />
                <figcaption className="mt-6">
                  <h5 className="normal-case text-primary-40">{detail.number} {detail.heading}</h5>
                  <p className="text-gray-700">{detail.body}</p>
                </figcaption>
              </figure>
            ))}
          </div>
          {/* DESKTOP VIEW */}
          <Images />
        </div>
      </section>
    </motion.div>
    </>
  )
}

function Detail({ children }) {
  const isInViewRef = useRef(null)
  const isInView = useInView(isInViewRef)

  return (
    <div
      ref={isInViewRef}
      id="text-content"
      className="relative flex flex-col justify-center w-full h-screen pl-4 "
      style={{
        transform: isInView ? "translateY(0px)" : "translateY(200px)",
        opacity: isInView ? 1 : 0,
        transition: "all 0.9s cubic-bezier(0.17, 0.55, 0.55, 1) 0.5s",
      }}
    >
      {children}
    </div>
  )
}

function Images() {
  const panelsRef = useRef(null)

  // useIsomorphicLayoutEffect(() => {
  //   gsap.registerPlugin(ScrollTrigger)
  //   let panels = gsap.utils.toArray(".panel")

  //   const ctx = gsap.context(() => {
  //     gsap.to(panels, {
  //       yPercent: 0,
  //       ease: "none",
  //       scrollTrigger: {
  //         trigger: ".wrapper",
  //         pin: true,
  //         scrub: true,
  //         snap: 1 / (panels.length - 1),
  //         start: "top top",
  //         end: "bottom bottom",
  //       }
  //     })
  //   }, panelsRef)
  //   return () => ctx.revert()
  // }, [])

  useGSAP(() => {
    const panels = gsap.utils.toArray(".panel")
    panels.forEach((panel) => {
      gsap.to(panel, {
        yPercent: 0,
        ease: "none",
        scrollTrigger: {
          trigger: ".wrapper",
          pin: true,
          scrub: true,
          snap: 1 / (panels.length - 1),
          start: "top top",
          end: "bottom bottom",
        }
      })
    })
  }, { scope: panelsRef })

  return (
    <div ref={panelsRef} className="hidden h-full md:block wrapper">
      {details.map((detail, index) => (
             <figure
             key={index}
             className="flex flex-col items-center justify-center w-4/5 h-screen mx-auto overflow-hidden panel"
           >
             <img
               src={detail.img}
               alt={detail.alt}
               style={{
                 width: index === 2 ? '70%' : '100%', 
                 margin: index === 2 ? 'auto' : '',    
                 borderRadius: '1rem',
                 height: 'auto'
               }}
             />
           </figure>
      ))}
    </div>
  )
}