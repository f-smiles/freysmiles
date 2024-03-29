'use client'
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function CurvyTimeline() {
  const refs = useRef([]);
  refs.current = [];

  const addToRefs = (el) => {
    if (el && !refs.current.includes(el)) {
      refs.current.push(el);
    }
  };

  useEffect(() => {
    refs.current.forEach((el, index) => {
      const isRightSide = index % 2 === 0;

      gsap.set(el, {
        borderRightColor: isRightSide ? 'transparent' : 'initial',
        borderLeftColor: isRightSide ? 'initial' : 'transparent',
        borderBottomColor: 'transparent'
      });

      ScrollTrigger.create({
        trigger: el,
        start: 'top center',
        end: 'bottom center',
        onEnter: () => animateBorder(el, isRightSide),
        onLeaveBack: () => resetBorder(el, isRightSide)
      });
    });
  }, []);

  const animateBorder = (element, isRightSide) => {
    const timeline = gsap.timeline();
    
    // Animate the side border (right or left)
    if (isRightSide) {
      timeline.to(element, { borderRightColor: '#4B5563', duration: 1 });
    } else {
      timeline.to(element, { borderLeftColor: '#4B5563', duration: 1 });
    }

    // Then animate the bottom border
    timeline.to(element, { borderBottomColor: '#991B1B', duration: 1 }, '+=0.5');
  };

  const resetBorder = (element, isRightSide) => {
    gsap.to(element, {
      borderRightColor: isRightSide ? 'transparent' : 'initial',
      borderLeftColor: isRightSide ? 'initial' : 'transparent',
      borderBottomColor: 'transparent',
      duration: 1
    });
  };



  return (
    <div  className="mt-40 mx-auto p-1 w-3/5">
      {/* <div className="flex -ml-20"><img src="../images/lime_worm.svg"></img></div> */}
      <div  ref={addToRefs} className="relative border-b border-gray-600 py-8 pl-12 pr-12 border-r border-gray-600" >
        <h3 className="font-altero uppercase py-5 text-6xl">Complimentary Consultation</h3>
        <div className="absolute top-1/2 transform -translate-y-1/2 translate-x-1/2 rounded-full border border-[#BEFC24] bg-[#BEFC24]  text-center p-3 right-0" style={{ height: '1.6rem', width: '1.6rem' }}></div>
        <p className="pt-2">Initial consultations are always free of charge.</p>
      </div>

      <div  ref={addToRefs} className="relative border-b border-gray-600 py-8 pl-12 pr-12 border-l border-gray-600" >


      <div
                  className=" md:w-1/2 flex justify-center items-center"
       
                >
                  <div
                    className="relative mx-2 "
                    style={{ width: "300px", height: "240px" }}
                  >
                    <img
                      className="rounded-full opacity-90 w-full h-full object-cover"
                      src="../../images/carepatient1.png"
                      alt="patient"
                      style={{ objectPosition: "40% 50%" }}
                    />
                  </div>
                  <div
                    className="relative mx-2 "
                    style={{ width: "300px", height: "300px" }}
                  >
                    <img
                      className="rounded-full opacity-90 w-full h-full object-cover"
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
                      className="rounded-full opacity-90 w-full h-full object-cover"
                      src="../../images/carepatient3.png"
                      alt="patient"
                    />
                  </div>
                  <div
                    className="relative mx-2 "
                    style={{ width: "330px", height: "400px" }}
                  >
                    <img
                      className="rounded-full opacity-90 w-full h-full object-cover"
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
                      className="rounded-full opacity-90 w-full h-full object-cover"
                      src="../../images/freysmilepatient1.jpg"
                      alt="patient"
                    />
                  </div>
                </div>
        <div className="absolute top-1/2 transform -translate-y-1/2 -translate-x-1/2 rounded-full border border-[#BEFC24] bg-[#BEFC24] text-center p-2.5 left-0" style={{ height: '1.6rem', width: '1.6rem' }}></div>
        <h3 className="font-altero uppercase stroke-text py-5 text-5xl">Payment Plans Are Available</h3>
        <p className="pt-2">We offer a variety of payment plans at no interest</p>
      </div>

      <div  ref={addToRefs} className="relative border-b border-gray-600 py-8 pl-12 pr-12 border-r border-gray-600" >

        <img
                      className="rounded-full opacity-90 w-full h-full object-cover"
                      src="../../images/carepatient2.png"
                      alt="patient"
                      style={{ objectPosition: "10% 50%" }}
                    />
        <div className="absolute top-1/2 transform -translate-y-1/2 translate-x-1/2 rounded-full border border-[#BEFC24] bg-[#BEFC24] text-center p-2.5 right-0" style={{ height: '1.6rem', width: '1.6rem' }}></div>
        <h3 className="font-altero uppercase stroke-text py-5 text-5xl">Keep it in the fam</h3>
        <p className="pt-2">Successive family members always receive the same excellent care. Ask about our family courtesies</p>
      </div>

      <div  ref={addToRefs} className="relative border-b border-gray-600 py-8 pl-12 pr-12 border-l border-gray-600" >
      <img
                      className="rounded-full opacity-90 w-full h-full object-cover"
                      src="../../images/carepatient2.png"
                      alt="patient"
                      style={{ objectPosition: "10% 50%" }}
                    />
        <div className="absolute top-1/2 transform -translate-y-1/2 -translate-x-1/2 rounded-full border border-[#BEFC24] bg-[#BEFC24] text-center p-2.5 left-0" style={{ height: '1.6rem', width: '1.6rem' }}></div>
        
        <h3 className="font-altero uppercase stroke-text py-5 text-5xl">One Year Follow Up Included</h3>

      </div>

      <div  ref={addToRefs} className="relative border-b border-gray-600 py-8 pl-12 pr-12 border-r border-gray-600" >
      <img
                      className="rounded-full opacity-90 w-full h-full object-cover"
                      src="../../images/carepatient2.png"
                      alt="patient"
                      style={{ objectPosition: "10% 50%" }}
                    />
        <div className="absolute top-1/2 transform -translate-y-1/2 translate-x-1/2 rounded-full border border-[#BEFC24] bg-[#BEFC24] text-center p-2.5 right-0" style={{ height: '1.6rem', width: '1.6rem' }}></div>
        <p className="pt-2">lets get started</p>
      </div>
    </div>
  );
}