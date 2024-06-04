"use client";
import { useEffect, useState, useRef } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

export default function CurvyTimeline() {
  // const refs = useRef([]);
  // refs.current = [];

  // const addToRefs = (el) => {
  //   if (el && !refs.current.includes(el)) {
  //     refs.current.push(el);
  //   }
  // };

  // useEffect(() => {
  //   refs.current.forEach((el, index) => {
  //     const isRightSide = index % 2 === 0;

  //     gsap.set(el, {
  //       borderRightColor: isRightSide ? "transparent" : "initial",
  //       borderLeftColor: isRightSide ? "initial" : "transparent",
  //       borderBottomColor: "transparent",
  //     });

  //     ScrollTrigger.create({
  //       trigger: el,
  //       start: "top center",
  //       end: "bottom center",
  //       onEnter: () => animateBorder(el, isRightSide),
  //       onLeaveBack: () => resetBorder(el, isRightSide),
  //     });
  //   });
  // }, []);

  // const animateBorder = (element, isRightSide) => {
  //   const timeline = gsap.timeline();

  //   if (isRightSide) {
  //     timeline.to(element, { borderRightColor: "#4B5563", duration: 1 });
  //   } else {
  //     timeline.to(element, { borderLeftColor: "#4B5563", duration: 1 });
  //   }

  //   timeline.to(
  //     element,
  //     { borderBottomColor: "#4B5563", duration: 1 },
  //     "+=0.5"
  //   );
  // };

  // const resetBorder = (element, isRightSide) => {
  //   gsap.to(element, {
  //     borderRightColor: isRightSide ? "transparent" : "initial",
  //     borderLeftColor: isRightSide ? "initial" : "transparent",
  //     borderBottomColor: "transparent",
  //     duration: 1,
  //   });
  // };

  const [isOpen, setIsOpen] = useState(true);

  const shutterRef = useRef(null);

  const toggleShutter = () => {
    setIsOpen((prevState) => !prevState);
  };

  useEffect(() => {
    const container = shutterRef.current;
    if (!container) return;

    container.classList.add("c-shutter--opening");
    container.classList.remove("c-shutter--closing", "c-shutter--closed");

    const initialTimer = setTimeout(() => {
      setIsOpen(false);
    });

    return () => clearTimeout(initialTimer);
  }, []);
  // useEffect(() => {
  //   gsap.registerPlugin(ScrollTrigger);

  useGSAP(() => {
    let headingSection = gsap.timeline({
      scrollTrigger: {
        trigger: '#heading-section',
        start: '-20% 0%',
        end: '100% 100%',
        scrub: 1,
        // markers: true,
      },
      defaults: { ease: 'power1.in' },
    })
    headingSection.to('#heading-section-line-one', {
      width: "100%",
      height: "100%",
      opacity: 1,
      duration: 2,
    }, 0)
    headingSection.to('#heading-section-line-one', {
      borderBottomRightRadius: "0.75rem",
      opacity: 1,
      duration: 4,
    }, 2)
    headingSection.to('#heading-section-line-two', {
      borderBottomRightRadius: "0.75rem",
      opacity: 1,
      duration: 6,
    }, 4)
    headingSection.to('#heading-section-line-two', {
      width: "100%",
      height: "100%",
      opacity: 1,
      duration: 8,
    }, 6)

    let sectionOne = gsap.timeline({
      scrollTrigger: {
        trigger: '#section-one',
        start: '-20% 0%',
        end: '100% 100%',
        scrub: 1,
        // markers: true,
      },
    })
    sectionOne.to('#section-one-dot', {
      backgroundColor: "#BEFC24",
      duration: 4,
    }, 0)
    sectionOne.to('#section-one-line-one', {
      width: "100%",
      height: "100%",
      opacity: 1,
      duration: 2,
    }, 0)
    sectionOne.to('#section-one-line-one', {
      borderBottomLeftRadius: "0.75rem",
      opacity: 1,
      duration: 4,
    }, 2)
    sectionOne.to('#section-one-line-two', {
      borderBottomLeftRadius: "0.75rem",
      opacity: 1,
      duration: 6,
    }, 4)
    sectionOne.to('#section-one-line-two', {
      width: "100%",
      height: "100%",
      opacity: 1,
      duration: 8,
    }, 6)

    let sectionTwo = gsap.timeline({
      scrollTrigger: {
        trigger: '#section-two',
        start: '-25% 0%',
        end: '100% 100%',
        scrub: 1,
        // markers: true,
      },
    })
    sectionTwo.to('#section-two-dot', {
      backgroundColor: "#BEFC24",
      duration: 4,
    }, 0)
    sectionTwo.to('#section-two-line-one', {
      width: "100%",
      height: "100%",
      opacity: 1,
      duration: 2,
    }, 0)
    sectionTwo.to('#section-two-line-one', {
      borderBottomRightRadius: "0.75rem",
      opacity: 1,
      duration: 4,
    }, 2)
    sectionTwo.to('#section-two-line-two', {
      borderBottomRightRadius: "0.75rem",
      opacity: 1,
      duration: 6,
    }, 4)
    sectionTwo.to('#section-two-line-two', {
      width: "100%",
      height: "100%",
      opacity: 1,
      duration: 8,
    }, 6)

    let sectionThree = gsap.timeline({
      scrollTrigger: {
        trigger: '#section-three',
        start: '-20% 0%',
        end: '100% 100%',
        scrub: 1,
        // markers: true,
      },
    })
    sectionThree.to('#section-three-dot', {
      backgroundColor: "#BEFC24",
      duration: 4,
    }, 0)
    sectionThree.to('#section-three-line-one', {
      width: "100%",
      height: "100%",
      opacity: 1,
      duration: 2,
    }, 0)
    sectionThree.to('#section-three-line-one', {
      borderBottomLeftRadius: "0.75rem",
      opacity: 1,
      duration: 4,
    }, 2)
    sectionThree.to('#section-three-line-two', {
      borderBottomLeftRadius: "0.75rem",
      opacity: 1,
      duration: 6,
    }, 4)
    sectionThree.to('#section-three-line-two', {
      width: "100%",
      height: "100%",
      opacity: 1,
      duration: 8,
    }, 6)

    let sectionFour = gsap.timeline({
      scrollTrigger: {
        trigger: '#section-four',
        start: '-25% 0%',
        end: '100% 100%',
        scrub: 1,
        // markers: true,
      },
    })
    sectionFour.to('#section-four-dot', {
      backgroundColor: "#BEFC24",
      duration: 4,
    }, 0)
    sectionFour.to('#section-four-line-one', {
      width: "100%",
      height: "100%",
      opacity: 1,
      duration: 2,
    }, 0)
  })

  return (
    <div
      className="max-w-screen-xl px-10 py-24 mx-auto shutter-container sm:px-16 sm:py-32"
      style={{
        "--color-foreground": "#dcdce8",
        "--delay": 10,
      }}
    >
      <ul ref={shutterRef} className="z-10 c-shutter">
        {[...Array(10)].map((_, i) => (
          <li key={i} className="c-shutter__slat"></li>
        ))}
      </ul>

      <div>
        <section id="heading-section" className="relative p-8">
          <h3 className="py-5 text-6xl uppercase font-altero">Complimentary Consultation</h3>
          <p className="pt-2">Initial consultations are always free of charge.</p>
          <span id="heading-section-dot" className="absolute top-1/2 -translate-y-1/2 translate-x-1/2 rounded-full bg-[#BEFC24] text-center p-3 right-0" />
          <span id="heading-section-line-one" className="absolute top-0 right-0 w-0 h-0 border-r-2 opacity-0 border-[#BEFC24] rounded-br-0 -z-10" />
          <span id="heading-section-line-two" className="absolute bottom-0 right-0 w-0 h-0 border-b-2 rounded-br-xl border-[#BEFC24] -z-10" />
        </section>

        <section id="section-one" className="relative p-8">
          <div className="flex items-center justify-center md:w-1/2">
            <div
              className="relative mx-2"
              style={{ width: "300px", height: "240px" }}
            >
              <img
                className="object-cover w-full h-full rounded-full opacity-90"
                src="../../images/carepatient1.png"
                alt="patient"
                style={{ objectPosition: "40% 50%" }}
              />
            </div>
            <div
              className="relative mx-2"
              style={{ width: "300px", height: "300px" }}
            >
              <img
                className="object-cover w-full h-full rounded-full opacity-90"
                src="../../images/carepatient2.png"
                alt="patient"
                style={{ objectPosition: "10% 50%" }}
              />
            </div>

            <div
              className="relative mx-2 "
              style={{ width: "300px", height: "340px" }}
            >
              <img
                className="object-cover w-full h-full rounded-full opacity-90"
                src="../../images/carepatient3.png"
                alt="patient"
              />
            </div>
            <div
              className="relative mx-2 "
              style={{ width: "330px", height: "400px" }}
            >
              <img
                className="object-cover w-full h-full rounded-full opacity-90"
                src="../../images/carepatient4.png"
                alt="patient"
                style={{ objectPosition: "40% 50%" }}
              />
            </div>
            <div
              className="relative mx-2 "
              style={{ width: "300px", height: "480px" }}
            >
              <img
                className="object-cover w-full h-full rounded-full opacity-90"
                src="../../images/freysmilepatient1.jpg"
                alt="patient"
              />
            </div>
          </div>
          <h3 className="py-5 text-5xl uppercase font-altero stroke-text">Payment Plans Are Available</h3>
          <p className="pt-2">We offer a variety of payment plans at no interest</p>
          <span id="section-one-dot" className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 rounded-full border-2 border-[#BEFC24] text-center p-3 left-0" />
          <span id="section-one-line-one" className="absolute top-0 left-0 w-0 h-0 border-l-2 opacity-0 border-[#BEFC24] rounded-bl-0 -z-10" />
          <span id="section-one-line-two" className="absolute bottom-0 left-0 w-0 h-0 border-b-2 rounded-bl-xl border-[#BEFC24] -z-10" />
        </section>

        <section id="section-two" className="relative p-8">
          {/* <img
            className="object-cover w-full h-full rounded-full opacity-90"
            src="../../images/orangecylinder.svg"
            alt="patient"
          /> */}
          <h3 className="py-5 text-5xl uppercase font-altero stroke-text">Keep it in the fam</h3>
          <p className="pt-2">Successive family members always receive the same excellent care. Ask about our family courtesies.</p>
          <span id="section-two-dot" className="absolute top-1/2 -translate-y-1/2 translate-x-1/2 rounded-full border-2 border-[#BEFC24] text-center p-3 right-0" />
          <span id="section-two-line-one" className="absolute top-0 right-0 w-0 h-0 border-r-2 opacity-0 border-[#BEFC24] rounded-br-0 -z-10" />
          <span id="section-two-line-two" className="absolute bottom-0 right-0 w-0 h-0 border-b-2 rounded-br-xl border-[#BEFC24] -z-10" />
        </section>

        <section id="section-three" className="relative p-8">
          <img
            className="rounded-full w-96 h-96 aspect-square opacity-90"
            src="../../images/carepatient2.png"
            alt="patient"
            style={{ objectPosition: "10% 50%" }}
          />
          <h3 className="py-5 text-5xl uppercase font-altero stroke-text">One Year Follow Up Included</h3>
          <span id="section-three-dot" className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 rounded-full border-2 border-[#BEFC24] text-center p-3 left-0" />
          <span id="section-three-line-one" className="absolute top-0 left-0 w-0 h-0 border-l-2 opacity-0 border-[#BEFC24] rounded-bl-0 -z-10" />
          <span id="section-three-line-two" className="absolute bottom-0 left-0 w-0 h-0 border-b-2 rounded-bl-xl border-[#BEFC24] -z-10" />
        </section>

        <section id="section-four" className="relative p-8">
          <img
            className="rounded-full w-96 h-96 aspect-square opacity-90"
            src="../../images/carepatient2.png"
            alt="patient"
            style={{ objectPosition: "10% 50%" }}
          />
          <p className="pt-2">lets get started</p>
          <span id="section-four-dot" className="absolute top-1/2 -translate-y-1/2 translate-x-1/2 rounded-full border-2 border-[#BEFC24] text-center p-3 right-0" />
          <span id="section-four-line-one" className="absolute top-0 right-0 w-0 h-0 border-r-2 opacity-0 border-[#BEFC24] -z-10" />
        </section>
      </div>
    </div>

    // <motion.div
    //   className="line"
    //   variants={variants}
    //   initial="hidden"
    //   animate="visible"
    //   style={{
    //     originX: 0,
    //     backgroundColor: 'red',
    //     height: '5px',
    //     width: '100%',
    //   }}
    // />
  );
};
