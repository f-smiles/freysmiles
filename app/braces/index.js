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
import React, { useState, useEffect, useRef, useCallback } from "react";
import LocomotiveScroll from "locomotive-scroll";
import { gsap, Power3 } from "gsap-trial";
import Lenis from "@studio-freight/lenis";

const Braces = () => {
  const [activeAccordionIndex, setActiveAccordionIndex] = useState(null);
  const containerRef = useRef(null);
  const imageRef = useRef(null);

  const slides = [
    {
      title: "Brush and Floss",
      imageUrl: "../images/purplefloss.jpeg",
      text: "Brushing and flossing during orthodontic treatment is more important than ever. Orthodontic appliances such as clear aligners, brackets, and wires interfere with normal self-cleansing mechanisms of the mouth. Research shows that only 10% of patients brush and floss consistently during active treatment. We're here to ensure you don't just get lost in the statistics.",
    },
    {
      title: "General Soreness",
      imageUrl: "../images/soreness.jpg",
      text: "When you get your braces on, you may feel general soreness in your mouth and teeth may be tender to biting pressures for 3 –5 days. Take Tylenol or whatever you normally take for headache or discomfort. The lips, cheeks and tongue may also become irritated for one to two weeks as they toughen and become accustomed to the braces. We will supply wax to put on the braces in irritated areas to lessen discomfort.",
    },
    {
      title: "Loose teeth",
      imageUrl: "../images/lime_worm.svg",
      text: "This is to be expected throughout treatment. The teeth must loosen first so they can move. The teeth will settle into the bone and soft tissue in their desired position after treatment is completed if retainers are worn correctly.",
    },
    {
      title: "Loose wire/band",
      imageUrl: "../images/lime_worm.svg",
      text: "When crowding and/or significant dental rotations is the case initially, a new wire placed at the office may eventually slide longer than the last bracket. In this case, depending on the orientation of the last tooth, it may poke into your cheek or gums. If irritation to the lips or You  can place orthodontic wax on the wire to reduce prevent stabbing. If the wire doesn't settle in on its own, it will benefit from being clipped within two weeks. Call our office to schedule an appointment.",
    },
    {
      title: "Rubberbands",
      imageUrl: "../images/lime_worm.svg",
      text: "To successfully complete orthodontic treatment, the patient must work together with the orthodontist. If the doctor has prescribed rubber bands it will be necessary for you to follow the prescription for an ideal result. Failure to follow protocol will lead to a less than ideal treatment result. Excessive broken brackets will delay treatment and lead to an incomplete result. Compromised results due to lack of compliance is not grounds for financial reconciliation. ",
    },
    {
      title: "Athletics",
      imageUrl:
        "https://i.postimg.cc/g09w3j9Q/e21673ee1426e49ea1cd7bc5b895cbec.jpg",
      text: "Braces and mouthguards typically don't mix. Molded mouthguards will prevent planned tooth movement. If you require a mouthguard for contact sports, we stock ortho-friendly mouthguards which may work. ",
    },
    {
      title: "How long will I be in braces?",
      imageUrl:
        "https://i.postimg.cc/T35Lymsn/597b0f5fc5aa015c0ca280ebd1e4293b.jpg",
      text: "Every year hundreds of parents trust our experience to provide beautiful, healthy smiles for their children. Deepending on case complexity and compliance, your time in braces may vary, but at FreySmiles Orthodontics case completion may only be typically only 12-22 months away.",
    },
    {
      title: "Eating with braces",
      imageUrl:
        "https://i.postimg.cc/NMB5Pnjx/62f64bc801260984785ff729f001a120.gif",
      text: "Something to keep in mind with braces is to take caution when eating hard foods, i.e., tough meats,hard breads, granola, and the like.  But you’ll need to protect yourorthodontic appliances when you eat for as long as you’re wearing braces.",
    },
  ];

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const image = imageRef.current;
    const bounds = image.getBoundingClientRect();

    const handleMouseMove = (e) => {
      const target = e.target.closest(".slide-item");
      const imageSrc = target ? target.getAttribute("data-image") : null;

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
          force3D: true,
        });
      } else {
        gsap.set(image, { autoAlpha: 0 });
      }
    };

    const handleMouseLeave = () => {
      gsap.to(image, {
        autoAlpha: 0,
        duration: 0.5,
        ease: "power2.inOut",
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
      lerp: 0.03,
    });

    return () => {};
  }, []);

  const scrollContainerRef = useRef(null);
  const [scrollY, setScrollY] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [dragStart, setDragStart] = useState(0);
  const onDragStart = (e) => {
    setDragging(true);
    setDragStart(e.clientX);
    e.preventDefault(); // Prevent default action to ensure smooth dragging
};

const onDragMove = (e) => {
  if (dragging) {
      const dx = e.clientX - dragStart; // Change in horizontal mouse position
      const newScrollX = scrollY - dx; // Calculate the new scroll position
      setScrollY(newScrollX);
      setDragStart(e.clientX); // Update drag start to the new mouse position
  }
};


const onDragEnd = () => {
    setDragging(false);
};

useEffect(() => {
    const elem = scrollContainerRef.current;
    if (elem) {
        elem.addEventListener('mousedown', onDragStart);
        window.addEventListener('mousemove', onDragMove);
        window.addEventListener('mouseup', onDragEnd);

        return () => {
            elem.removeEventListener('mousedown', onDragStart);
            window.removeEventListener('mousemove', onDragMove);
            window.removeEventListener('mouseup', onDragEnd);
        };
    }
}, [onDragStart, onDragMove, onDragEnd]);

  const math = {
    lerp: (a, b, n) => (1 - n) * a + n * b,
    norm: (value, min, max) => (value - min) / (max - min)
  };

  // Function to update scroll position
  const scroll = useCallback(() => {
    if (!dragging) {
      setScrollY(window.scrollY);
    }
  }, [dragging]);


  useEffect(() => {
    const animate = () => {
      const newScrollY = math.lerp(scrollY, window.scrollY, 0.1);
      setScrollY(newScrollY);
      if (scrollContainerRef.current) {
        scrollContainerRef.current.style.transform = `translate3d(-${newScrollY}px, 0, 0)`;
      }
      requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  }, [scrollY]);

  useEffect(() => {
    window.addEventListener('scroll', scroll);
    window.addEventListener('resize', scroll);

    return () => {
      window.removeEventListener('scroll', scroll);
      window.removeEventListener('resize', scroll);
    };
  }, [scroll]);

  useEffect(() => {
  // Disable body scroll
  document.body.style.overflow = 'hidden';

  return () => {
    // Re-enable body scroll
    document.body.style.overflow = '';
  };
}, []);

  return (
    <>
      <div className="bg-[#FFFCF8]">
        <div>
          <div className="font-poppins container is-hero">
            {" "}
            <div style={{ maxWidth: "100%", textAlign: "center" }}>
              <p
                style={{
                  marginBottom: "0.6em",
                  fontSize: "2.2em",
                  lineHeight: "1",
                  fontWeight: "400",
                }}
              >
                DAMON
              </p>
              <h1
                style={{
                  marginTop: "0px",
                  marginBottom: "0px",
                  fontSize: "7em",
                  lineHeight: "0.8",
                  fontWeight: 700,
                }}
              >
                BRACES
              </h1>
              <div
                style={{
                  width: "26rem",
                  maxWidth: "100%",
                  marginRight: "auto",
                  marginLeft: "auto",
                  paddingTop: "1.5rem",
                }}
              >
                <p
                  style={{
                    marginTop: "0px",
                    marginBottom: "0px",
                    fontSize: "0.9rem",
                    lineHeight: "1.4",
                  }}
                >
                  We're the leading experts and top providers in the area of
                  this passive, self-ligating system. Damon braces use a slide
                  mechanism to hold the archwire, reducing the amount of
                  pressure exerted on the teeth and allowing the teeth to move
                  more freely, quickly, and comfortably.
                </p>
              </div>
            </div>
          </div>
        </div>
        <div  style={{
        height: '100vh', // Using '100vh' to take full viewport height which is similar to '100%' on the body
        overflowY: 'scroll',
        padding: 0,
        margin: 0,
        backgroundColor: '#111',
        userSelect: 'none',
        boxSizing: 'border-box' // Applying box-sizing to this element; typically, this would be globally set
      }} className="scrolle" ref={scrollContainerRef} data-scroll>
 
 <div class="scrollHorizontal-content" data-scroll-content>
    <article className="horizontalSlide horizontalSlide--1 js-slide">
     <div className="horizontalSlide__inner">
       <div className="horizontalSlide__img js-transition-img">
         <figure className="js-transition-img__inner">
           <img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/58281/project-one.png" draggable="false" />
         </figure>
       </div>
     </div>
   </article>
   
   <article className="horizontalSlide horizontalSlide--2 js-slide">
     <div className="horizontalSlide__inner">
       <div className="horizontalSlide__img js-transition-img">
         <figure className="js-transition-img__inner">
           <img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/58281/project-two.png" draggable="false" />
         </figure>
       </div>
     </div>
   </article>
   
   <article className="horizontalSlide horizontalSlide--3 js-slide">
     <div className="horizontalSlide__inner">
       <div className="horizontalSlide__img">
         <figure>
           <img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/58281/project-three.png" draggable="false" />
         </figure>
       </div>
     </div>
   </article>
 <article className="horizontalSlide horizontalSlide--1 js-slide">
     <div className="horizontalSlide__inner">
       <div className="horizontalSlide__img js-transition-img">
         <figure className="js-transition-img__inner">
           <img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/58281/project-one.png" draggable="false" />
         </figure>
       </div>
     </div>
   </article>
   
   <article className="horizontalSlide horizontalSlide--2 js-slide">
     <div className="horizontalSlide__inner">
       <div className="horizontalSlide__img js-transition-img">
         <figure className="js-transition-img__inner">
           <img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/58281/project-two.png" draggable="false" />
         </figure>
       </div>
     </div>
   </article>
   
   <article className="horizontalSlide horizontalSlide--3 js-slide">
     <div className="horizontalSlide__inner">
       <div className="horizontalSlide__img">
         <figure>
           <img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/58281/project-three.png" draggable="false" />
         </figure>
       </div>
     </div>
   </article>
 </div>  
 

 <div class="scrollHorizontal-content scrollHorizontal-content--last" data-scroll-content>
   
 <article className="horizontalSlide horizontalSlide--1 js-slide">
     <div className="horizontalSlide__inner">
       <div className="horizontalSlide__sub-title"><span>Project</span></div>
       <h1 className="horizontalSlide__title"><div className="js-transition-title">Oak Refuge</div></h1>
       <div className="horizontalSlide__img horizontalSlide__img--proxy"></div>
       <div className="horizontalSlide__project">Corpus Studio</div>
     </div>
   </article>
   
   <article className="horizontalSlide horizontalSlide--2 js-slide">
     <div className="horizontalSlide__inner">
       <div className="horizontalSlide__sub-title"><span>Project</span></div>
       <h1 className="horizontalSlide__title"><div className="js-transition-title">Teton Residence</div></h1>
       <div className="horizontalSlide__img horizontalSlide__img--proxy"></div>
       <div className="horizontalSlide__project">Ro Rocket Design</div>
     </div>
   </article>
   
   <article className="horizontalSlide horizontalSlide--3 js-slide">
     <div className="horizontalSlide__inner">
       <div className="horizontalSlide__sub-title"><span>Project</span></div>
       <h1 className="horizontalSlide__title">Oak Refuge</h1>
       <div className="horizontalSlide__img horizontalSlide__img--proxy"></div>
       <div className="horizontalSlide__project">Corpus Studio</div>
     </div>
   </article>
   <article className="horizontalSlide horizontalSlide--1 js-slide">
     <div className="horizontalSlide__inner">
       <div className="horizontalSlide__sub-title"><span>Project</span></div>
       <h1 className="horizontalSlide__title"><div className="js-transition-title">Oak Refuge</div></h1>
       <div className="horizontalSlide__img horizontalSlide__img--proxy"></div>
       <div className="horizontalSlide__project">Corpus Studio</div>
     </div>
   </article>
   
   <article className="horizontalSlide horizontalSlide--2 js-slide">
     <div className="horizontalSlide__inner">
       <div className="horizontalSlide__sub-title"><span>Project</span></div>
       <h1 className="horizontalSlide__title"><div className="js-transition-title">Teton Residence</div></h1>
       <div className="horizontalSlide__img horizontalSlide__img--proxy"></div>
       <div className="horizontalSlide__project">Ro Rocket Design</div>
     </div>
   </article>
   
   <article className="horizontalSlide horizontalSlide--3 js-slide">
     <div className="horizontalSlide__inner">
       <div className="horizontalSlide__sub-title"><span>Project</span></div>
       <h1 className="horizontalSlide__title">Oak Refuge</h1>
       <div className="horizontalSlide__img horizontalSlide__img--proxy"></div>
       <div className="horizontalSlide__project">Corpus Studio</div>
     </div>
   </article>
   
 </div>
 
 <div class="scrollbar" data-scrollbar>
   <div class="scrollbar__handle js-scrollbar__handle"></div>
 </div>
 
</div>

        {/* <main data-scroll-container >

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
</main> */}
      </div>
    </>
  );
};

export default Braces;
