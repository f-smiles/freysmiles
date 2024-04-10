// import React, { useState, useEffect, useRef } from 'react';
// import { gsap } from "gsap";
// import { ScrollSmoother } from "gsap-trial/ScrollSmoother";
// import { ScrollTrigger } from "gsap/ScrollTrigger";
// const Braces = () => {

//   const [scrollY, setScrollY] = useState(0);
//   const repeatedText = 'DAMON BRACKET '.repeat(100);
//   const secondNumberOfImages = 5;
//   const rowImageTwo = "images/damon.png";

//   const images = [
//     "images/boyflossing.jpeg",
//     "images/damon.png",
//     "images/damonpatient1.png",

//   ];

//   const handleScroll = () => {
//     setScrollY(window.scrollY);
//   };

//   useEffect(() => {
//     window.addEventListener('scroll', handleScroll);

//     return () => {
//       window.removeEventListener('scroll', handleScroll);
//     };
//   }, []);

//   return (
//     <div className="font-helvetica m-0 h-[300vh] overflow-x-hidden"

// >
// <div
//     style={{
//       backgroundImage: `url("../../images/whitesquiggle.png")`,
//       backgroundRepeat: "no-repeat",
//       backgroundSize: "cover",
//       backgroundPosition: "center center",
//       height: '100vh',
//     }}>
//       </div>

//       <div className="title-container"
//       >
//       <div className="title text-[calc(100vw/24*3)] uppercase leading-none whitespace-nowrap m-0 transition-all duration-100 ease-out"
//             style={{ transform: `translateX(-${scrollY}px)` }}>
//           {repeatedText}
//         </div>
//       </div>

//       <div className="image-container whitespace-nowrap transition-all duration-100 ease-out"
//            style={{ transform: `translateX(${scrollY}px)` }}>
//         {Array.from({ length: secondNumberOfImages }, (_, index) => (
//           <img key={index} src={rowImageTwo} alt={`Damon ${index + 1}`} className="inline-block" />
//         ))}
//       </div>

//       <div className="title-container">
//         <div className="title reverse text-[calc(100vw/24*3)] uppercase leading-none whitespace-nowrap m-0 transition-all duration-100 ease-out"
//             style={{ transform: `translateX(-${scrollY}px)` }}>
//           DAMON BRACKET DAMON BRACKET
//         </div>
//       </div>

//       <div className="image-container reverse whitespace-nowrap transition-all duration-100 ease-out"
//      style={{ transform: `translateX(-${scrollY}px)` }}>
//   {images.map((image, index) => (
//     <img
//       key={index}
//       src={image}
//       alt={`patients`}
//       className={`inline-block ${index % 2 === 0 ? 'w-80 h-80 object-cover' : 'h-auto w-auto max-w-80 max-h-80'}`}
//     />
//   ))}
// </div>

//     </div>
//   );
// };

// export default Braces;
"use client";
import React, { useState, useEffect, useRef } from "react";
import LocomotiveScroll from 'locomotive-scroll';
import { gsap, Power3 } from "gsap-trial";
import Lenis from '@studio-freight/lenis';

const YourCare = () => {
  const colors = [
    "hsl(0 , 0% , 20%)",  
    "hsl(39, 5%, 78%)", 
    "hsl(260, 3%, 80%)" 
];
const [activeAccordionIndex, setActiveAccordionIndex] = useState(null);
const containerRef = useRef(null);
const imageRef = useRef(null);

const slides = [
  {
    title: "Brush and Floss",
    imageUrl: "../images/purplefloss.jpeg",
    text: "Brushing and flossing during orthodontic treatment is more important than ever. Orthodontic appliances such as clear aligners, brackets, and wires interfere with normal self-cleansing mechanisms of the mouth. Research shows that only 10% of patients brush and floss consistently during active treatment. We're here to ensure you don't just get lost in the statistics."
  },
  {
    title: "General Soreness",
    imageUrl: "../images/soreness.jpg",
    text:  "When you get your braces on, you may feel general soreness in your mouth and teeth may be tender to biting pressures for 3 –5 days. Take Tylenol or whatever you normally take for headache or discomfort. The lips, cheeks and tongue may also become irritated for one to two weeks as they toughen and become accustomed to the braces. We will supply wax to put on the braces in irritated areas to lessen discomfort.",
  },
  {
    title: "Loose teeth",
    imageUrl: "../images/lime_worm.svg",
    text:  "This is to be expected throughout treatment. The teeth must loosen first so they can move. The teeth will settle into the bone and soft tissue in their desired position after treatment is completed if retainers are worn correctly."
  },
  {
    title: "Loose wire/band",
    imageUrl: "../images/lime_worm.svg",
    text:   "When crowding and/or significant dental rotations is the case initially, a new wire placed at the office may eventually slide longer than the last bracket. In this case, depending on the orientation of the last tooth, it may poke into your cheek or gums. If irritation to the lips or You  can place orthodontic wax on the wire to reduce prevent stabbing. If the wire doesn't settle in on its own, it will benefit from being clipped within two weeks. Call our office to schedule an appointment."
  },
  {
    title: "Rubberbands",
    imageUrl: "../images/lime_worm.svg",
    text:  "To successfully complete orthodontic treatment, the patient must work together with the orthodontist. If the doctor has prescribed rubber bands it will be necessary for you to follow the prescription for an ideal result. Failure to follow protocol will lead to a less than ideal treatment result. Excessive broken brackets will delay treatment and lead to an incomplete result. Compromised results due to lack of compliance is not grounds for financial reconciliation. "
  },
  {
    title: "Athletics",
    imageUrl: "https://i.postimg.cc/g09w3j9Q/e21673ee1426e49ea1cd7bc5b895cbec.jpg",
    text:   "Braces and mouthguards typically don't mix. Molded mouthguards will prevent planned tooth movement. If you require a mouthguard for contact sports, we stock ortho-friendly mouthguards which may work. "
  },
  {
    title: "How long will I be in braces?",
    imageUrl: "https://i.postimg.cc/T35Lymsn/597b0f5fc5aa015c0ca280ebd1e4293b.jpg",
    text:  "Every year hundreds of parents trust our experience to provide beautiful, healthy smiles for their children. Deepending on case complexity and compliance, your time in braces may vary, but at FreySmiles Orthodontics case completion may only be typically only 12-22 months away." 
  },
  {
    title: "Eating with braces",
    imageUrl: "https://i.postimg.cc/NMB5Pnjx/62f64bc801260984785ff729f001a120.gif",
    text:       "Something to keep in mind with braces is to take caution when eating hard foods, i.e., tough meats,hard breads, granola, and the like.  But you’ll need to protect yourorthodontic appliances when you eat for as long as you’re wearing braces.",
  },
];

useEffect(() => {
  if (!containerRef.current) return;

  const container = containerRef.current;
  const image = imageRef.current;
  const bounds = image.getBoundingClientRect();

  const handleMouseMove = (e) => {
    const target = e.target.closest('.slide-item'); 
    const imageSrc = target ? target.getAttribute('data-image') : null;

    if (imageSrc) {
      image.src = imageSrc;

      const xMovement = Math.min(Math.max(parseInt(e.movementX), -20), 20);
      const yMovement = Math.min(Math.max(parseInt(e.movementY), -20), 20);

      gsap.to(image, {
        autoAlpha: 1,
        x: e.clientX - bounds.left,
        y: e.clientY - bounds.top - bounds.height / 2,
        transformOrigin: "center",
        rotation: xMovement,
        skewX: xMovement,
        skewY: yMovement,
        ease: "power1.out", 
        force3D: true
      });
    } else {
      gsap.set(image, { autoAlpha: 0 });
    }
  };

  const handleMouseLeave = () => {
    gsap.to(image, {
      autoAlpha: 0,
      duration: 0.5, 
      ease: "power2.inOut"
    });
  };

  container.addEventListener("mousemove", handleMouseMove);
  container.addEventListener("mouseleave", handleMouseLeave);

  return () => {
    container.removeEventListener("mousemove", handleMouseMove);
    container.removeEventListener("mouseleave", handleMouseLeave);
  };
}, []);

const toggleAccordion = (index) => {
  setActiveAccordionIndex(activeAccordionIndex === index ? null : index);
};


useEffect(() => {
  const scrollContainer = document.querySelector("main");
  if (!scrollContainer) {
    console.error("Scroll container not found");
    return;
  }
  
  const scroll = new LocomotiveScroll({
    el: scrollContainer,
    smooth: true,
    lerp: 0.03
  });



  return () => {

  };
}, []);





  return (
    <>
    
    <main data-scroll-container >

  <section className="bg-[#cbcacd] section-0" data-scroll-section>
    <h2 data-scroll data-scroll-speed="-2">Damon Brackets</h2>
    <div className="section-0__img-wrapper" data-scroll data-scroll-speed="-2" data-scroll-direction="horizontal">
      <img src="../images/grid.png" alt="" data-scroll data-scroll-speed="0.75" data-scroll-direction="horizontal" />
    </div>
  </section>

  <section className="section-1" data-scroll-section>
    <div className="section-1__text section-1__text--top" data-scroll data-scroll-speed="2" data-scroll-direction="horizontal" data-scroll-delay="0.5">
      {Array(8).fill(null).map((_, i) => (
        <React.Fragment key={i}>
          <span>learn</span>
          <span>more</span>
        </React.Fragment>
      ))}
    </div>
  </section>

  <section className="section-0" data-scroll-section>
    <h2 data-scroll data-scroll-speed="-2">Best results in less time</h2>
    <div className="section-0__img-wrapper" data-scroll data-scroll-speed="-2" data-scroll-direction="horizontal" data-scroll-call="bg">
      <img src="https://picsum.photos/id/1032/1600/1600" alt="" data-scroll data-scroll-speed="0.75" data-scroll-direction="horizontal" />
    </div>
  </section>

  <section className="section-1" data-scroll-section>
    <div className="section-1__text section-1__text--top" data-scroll data-scroll-speed="2" data-scroll-direction="horizontal" data-scroll-delay="0.5">
      {Array(8).fill(null).map((_, i) => (
        <React.Fragment key={i}>
          <span>faster</span>
          <span>results</span>
        </React.Fragment>
      ))}
    </div>
  </section>

  <section className="section-0" data-scroll-section>
    <h2 data-scroll data-scroll-speed="-2">Precise and effective </h2>
    <div className="section-0__img-wrapper" data-scroll data-scroll-speed="-2" data-scroll-direction="horizontal" data-scroll-call="bg1">
      <img src="https://picsum.photos/id/684/1600/1600" alt="" data-scroll data-scroll-speed="0.75" data-scroll-direction="horizontal" />
    </div>
  </section>

  <section className="section-1" data-scroll-section>
    <div className="section-1__text section-1__text--top" data-scroll data-scroll-speed="2" data-scroll-direction="horizontal" data-scroll-delay="0.5">
      {Array(8).fill(null).map((_, i) => (
        <React.Fragment key={i}>
          <span data-scroll data-scroll-speed="-2">parallax</span>
          <span data-scroll data-scroll-speed="2">scroll</span>
        </React.Fragment>
      ))}
    </div>
  </section>

  <section className="border border-black section-0" data-scroll-section>
    <h2 data-scroll data-scroll-speed="-2">Self-ligating braces</h2>
    <div className="section-0__img-wrapper" data-scroll data-scroll-speed="-2" data-scroll-direction="horizontal" data-scroll-call="bg2">
      <img src="https://picsum.photos/id/208/1600/1600" alt="" data-scroll data-scroll-speed="0.75" data-scroll-direction="horizontal" />
    </div>
  </section>
  <div className= "flex">
  <div ref={containerRef} className="w-1/2 ">
  <div className="relative">
  {slides.map((slide, index) => (
    <div key={index} className="relative py-16 border-b border-gray-200 cursor-pointer slide-item" data-image={slide.imageUrl} onClick={() => toggleAccordion(index)}>
        <div className="font-oakes- text-[40px] leading-tight text-black transition-colors duration-200 hover:text-purple-600">
            {slide.title}
        </div>
        <div className={`accordion-content ${activeAccordionIndex === index ? 'open' : ''}`}>
            <p>{slide.text}</p>
        </div>
    </div>
))}

  </div>

  <img ref={imageRef} className="blend-mode-class fixed object-cover h-30 w-auto rounded-lg pointer-events-none will-change-transform md:w-64 md:h-48 sm:w-64 sm:h-40" alt="" />
</div>
<div className="w-1/2 top-0 sticky h-screen">
<img className="w-1/2 justify-center h-auto" src="../images/beigewavy.png" ></img>
</div>
</div>
</main>

    </>
  );
};

export default YourCare;
