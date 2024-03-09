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

const YourCare = () => {
  const colors = [
    "hsl(36° , 38% , 73%)",  
    "hsl(39, 5%, 78%)", 
    "hsl(260, 3%, 80%)" 
];

useEffect(() => {
  const scrollContainer = document.querySelector("main");

  const scroll = new LocomotiveScroll({
    el: scrollContainer,
    smooth: true,
    lerp: 0.03
  });

  scroll.on("scroll", (e) => {
    // Calculate the color index based on the scroll position
    const index = Math.floor(e.scroll.y / window.innerHeight) % colors.length;

    // Calculate the progress of scrolling within a section
    const sectionProgress = (e.scroll.y % window.innerHeight) / window.innerHeight;

    const currentColor = colors[index];
    const nextColor = colors[(index + 1) % colors.length];
    const interpolatedColor = gsap.utils.interpolate(currentColor, nextColor, sectionProgress);

    scrollContainer.style.backgroundColor = interpolatedColor;
  });

  return () => {
    scroll.destroy();

    scrollContainer.style.backgroundColor = "";
  };
}, []);


  return (
    <>
    <main data-scroll-container id="js-scroll">
  <section className="section-0" data-scroll-section>
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

  <section className="section-0" data-scroll-section>
    <h2 data-scroll data-scroll-speed="-2">Self-ligating braces</h2>
    <div className="section-0__img-wrapper" data-scroll data-scroll-speed="-2" data-scroll-direction="horizontal" data-scroll-call="bg2">
      <img src="https://picsum.photos/id/208/1600/1600" alt="" data-scroll data-scroll-speed="0.75" data-scroll-direction="horizontal" />
    </div>
  </section>
</main>

    </>
  );
};

export default YourCare;
