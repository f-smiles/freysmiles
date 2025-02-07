"use client";
import React, { useEffect, useState, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "@studio-freight/lenis";

gsap.registerPlugin(ScrollTrigger);

const CaringForYourBraces = () => {
  // const containerRef = useRef(null);
  // const wrapperRef = useRef(null);

  // useEffect(() => {
  //   const scrubValue = 0.5;
  //   const container = containerRef.current;
  //   const wrapper = wrapperRef.current;

  //   const scrollBar = gsap.to(".scrollbar", {
  //     x: () => window.innerWidth - (150 + 20),
  //     ease: "none",
  //   });

  //   ScrollTrigger.create({
  //     trigger: container,
  //     start: "top top",
  //     end: () => wrapper.scrollWidth - window.innerWidth,
  //     pin: true,
  //     anticipatePin: 1,
  //     scrub: scrubValue,
  //     animation: scrollBar,
  //     invalidateOnRefresh: true,
  //   });

  //   const thumbNails = gsap.utils.toArray(".horizontalpin-thumbnail");

  //   thumbNails.forEach((thumb) => {
  //     const getTotalWidthToMove = () => {
  //       let totalWidthToMove = 0;
  //       let prevElement = thumb.previousElementSibling;

  //       while (prevElement) {
  //         const style = window.getComputedStyle(prevElement);
  //         const marginRight = parseInt(style.marginRight) || 0;
  //         totalWidthToMove += prevElement.offsetWidth + marginRight;
  //         prevElement = prevElement.previousElementSibling;
  //       }

  //       return totalWidthToMove;
  //     };

  //     if (thumb.classList.contains("fakePin")) {
  //       gsap.to(thumb, {
  //         x: () => -getTotalWidthToMove(),
  //         ease: "none",
  //         scrollTrigger: {
  //           trigger: wrapper,
  //           start: "top top",
  //           scrub: scrubValue,
  //           invalidateOnRefresh: true,
  //           end: () => `+=${getTotalWidthToMove()}`,
  //         },
  //       });
  //     } else {
  //       gsap.to(thumb, {
  //         x: () => -container.scrollWidth,
  //         ease: "none",
  //         scrollTrigger: {
  //           trigger: wrapper,
  //           start: "top top",
  //           scrub: scrubValue,
  //           invalidateOnRefresh: true,
  //           end: () => `+=${container.scrollWidth}`,
  //         },
  //       });
  //     }
  //   });

  //   return () => {
  //     ScrollTrigger.getAll().forEach((t) => t.kill());
  //   };
  // }, []);




  const sectionsRef = useRef([]);

  useEffect(() => {
    const lenis = new Lenis({
      smooth: true,
      direction: "vertical",
    });
    const updateSections = (scrollY) => {
      const viewportHeight = window.innerHeight;
    
      sectionsRef.current.forEach((section, index) => {
        //this calculates when the section starts appearing
        const sectionStart = index * viewportHeight;
    
        // how far the section has been scrolled from 0 to 1
        const progress = Math.min(
          Math.max((scrollY - sectionStart) / viewportHeight, 0),
          1
        );
    
        const width = progress * 100; // expands from 0% to 100%
    
        // clip-path top right bottom left reveal section from right to left
        section.style.clipPath = `inset(0 0 0 ${100 - width}%)`;
        section.style.transformOrigin = "right"; 

      });
    };
    
    lenis.on("scroll", ({ scroll }) => {
      updateSections(scroll);
    });
  
    const raf = (time) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };
  
    requestAnimationFrame(raf);
  
    return () => lenis.destroy();
  }, []);
  
  return (
    <>
   <div
  style={{
    height: "600vh", 
    position: "relative",
  }}
>
  <div
    style={{
      position: "sticky",
      top: 0,
      height: "100vh",
      overflow: "hidden", 
    }}
  >
    {["#d3e0f4", "#f4d3e5", "#f5f5f5", "#f7e4d3", "#f4d4a0"].map(
      (color, index) => (
        <div
          key={index}
          ref={(el) => (sectionsRef.current[index] = el)}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            height: "100vh",
            width: "100vw",
            backgroundColor: color,
            clipPath: "inset(0 100% 0 0)",
            transition: "clip-path 0.1s ease-out",
          }}
        >
          <div
            style={{
              padding: "20px",
              color: "#333",
              fontSize: "2rem",
              fontWeight: "bold",
              textAlign: "right", 
              lineHeight: "90vh",
            }}
          >
            Section {index + 1}
          </div>
        </div>
      )
    )}
  </div>
</div>
      {/* <div ref={containerRef} className="h-screen horizontalpin-container">
        <div
          ref={wrapperRef}
          className="horizontalpin-wrapper"
          style={{
            display: "flex",
            position: "relative",
            height: "80vh",
            width: "calc((800px * 8) + ((100vw - 20px) * 3) + (10px * 10))",
            padding: "0px 10px",
            borderTop: "10vh white solid",
            borderBottom: "10vh white solid",
          }}
        >
          <div className="horizontalpin-thumbnail fakePin flex flex-col h-screen">
            <div className="flex items-center h-1/3 px-8 md:px-16 lg:px-24">
              <h1 className="text-[72px] font-generalitalic ">Self-Care</h1>
            </div>

            <div className="h-2/3 flex flex-col md:flex-row gap-8 md:gap-16 px-8 md:px-16 lg:px-24">
              <div className="md:w-1/2 flex flex-col justify-center">
                <p className="text-[14px] font-helvetica-neue-light md:text-[16px] font-light leading-relaxed mb-8">
                  Braces treatment time varies based on your unique case and how
                  well you follow care instructions. At FreySmiles Orthodontics,
                  most patients achieve their ideal smile in 12 to 22 months.
                  Ready to get started? Let’s make it happen.
                </p>
                <hr className="border-t border-[#262626] mb-8" />
                <div className="flex items-center space-x-2">
                  <h3 className="font-helvetica-neue-light text-sm font-medium uppercase tracking-widest mb-0 leading-none">
                    • Learn More
                  </h3>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    className="w-4 h-4"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3"
                    />
                  </svg>
                </div>
              </div>

              <div className="absolute right-0 w-1/3 h-1/2 flex justify-end">
                <div className="max-w-lg w-full h-auto overflow-hidden rounded-2xl">
                  <video
                    src="https://video.wixstatic.com/video/11062b_163d7539f7824eb895994a6460f0995b/720p/mp4/file.mp4"
                    className="object-cover w-full h-full"
                    autoPlay
                    loop
                    muted
                    playsInline
                  ></video>
                </div>
              </div>
            </div>
          </div>

          <div className="horizontalpin-thumbnail full fakePin">
            <div className="flex items-center h-1/3 px-8 md:px-16 lg:px-24">
              <h1 className="text-[72px] font-generalitalic ">Self-Care</h1>
            </div>

            <div className="h-2/3 flex flex-col md:flex-row gap-8 md:gap-16 px-8 md:px-16 lg:px-24">
              <div className="md:w-1/2 flex flex-col justify-center">
                <p className="text-[14px] font-helvetica-neue-light md:text-[16px] font-light leading-relaxed mb-8">
                  Brushing and flossing during orthodontic treatment is more
                  important than ever. Orthodontic appliances such as clear
                  aligners, brackets, and wires interfere with normal
                  self-cleansing mechanisms of the mouth. Research shows that
                  only 10% of patients brush and floss consistently during
                  active treatment. We're here to ensure you don't just get lost
                  in the statistics.
                </p>
                <hr className="border-t border-[#262626] mb-8" />
                <div className="flex items-center space-x-2">
                  <h3 className="font-helvetica-neue-light text-sm font-medium uppercase tracking-widest mb-0 leading-none">
                    • Learn More
                  </h3>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    className="w-4 h-4"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3"
                    />
                  </svg>
                </div>
              </div>

              <div className="absolute right-0 w-1/3 h-1/2 flex justify-end">
                <div className="max-w-lg w-full h-auto overflow-hidden rounded-2xl">
                  <img
                    src="../images/purplefloss.jpeg"
                    className="object-cover w-full h-full"
               
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="horizontalpin-thumbnail fakePin"></div>
          <div className="horizontalpin-thumbnail fakePin"></div>
          <div className="horizontalpin-thumbnail fakePin"></div>
          <div className="horizontalpin-thumbnail full fakePin"></div>
          <div className="horizontalpin-thumbnail fakePin"></div>
          <div className="horizontalpin-thumbnail fakePin"></div>
        </div>
      </div> */}
    </>
  );
};

export default CaringForYourBraces;

{
  /* <div ref={scrollContainerRef} className=" bg-[#1B1C1D] flex flex-row items-stretch"
      
>
  <div className="flex flex-col w-1/2 border-r border-[#949494] sticky top-0 h-screen">
  <div className="absolute w-full h-full flex items-center justify-center image-wrapper">

        <div className="flex justify-center items-center absolute w-auto h-1/2 top-0 left-0 image-wrapper">
        <img src="../images/testpic.png" />

</div>
</div>



<div className="absolute w-full h-full top-0 left-0 image-wrapper" style={{ zIndex: 3 }}>
<div className="flex justify-center items-center h-screen">
  <img
    src="/images/brushing.png"
    alt="Profile"
    className="blob-image1 object-cover"
  />
</div>
</div>
  </div>

  <div className="w-1/2 overflow-auto" >
    {sections.map((section, index) => (
      <section
        key={index}
        className="p-20 min-h-[75vh] flex flex-col justify-center mb-5"
      >
        <div className="text-white font-neue-montreal font-thin text-2xl mb-4">
          {section.title}
        </div>
        <p className="text-center text-white font-neue-montreal">{section.content}</p>
      </section>
    ))}
  </div>
</div> 
 */
}

// const sections = [
//   {
//     title: "Brush and floss",
//     content:
//       "Brushing and flossing during orthodontic treatment is more important than ever. Orthodontic appliances such as clear aligners, brackets, and wires interfere with normal self-cleansing mechanisms of the mouth. Research shows that only 10% of patients brush and floss consistently during active treatment. We're here to ensure you don't just get lost in the statistics.",
//   },

//   {
//     title: "General Soreness",
//     content:
//       "When you get your braces on, you may feel general soreness in your mouth and teeth may be tender to biting pressures for 3 –5 days. Take Tylenol or whatever you normally take for headache or discomfort. The lips, cheeks and tongue may also become irritated for one to two weeks as they toughen and become accustomed to the braces. We will supply wax to put on the braces in irritated areas to lessen discomfort.",
//   },
//   {
//     title: "Loosening of Teeth",
//     content:
//       "This is to be expected throughout treatment. The teeth must loosen first so they can move. The teeth will settle into the bone and soft tissue in their desired position after treatment is completed if retainers are worn correctly.",
//   },
//   {
//     title: "Loose Wire or Band",
//     content:
//       "When crowding and/or significant dental rotations is the case initially, a new wire placed at the office may eventually slide longer than the last bracket. In this case, depending on the orientation of the last tooth, it may poke into your cheek or gums. If irritation to the lips or You  can place orthodontic wax on the wire to reduce prevent stabbing. If the wire doesn't settle in on its own, it will benefit from being clipped within two weeks. Call our office to schedule an appointment.",
//   },
//   {
//     title: "Rubberband wear",
//     content:
//       "To successfully complete orthodontic treatment, the patient must work together with the orthodontist. If the doctor has prescribed rubber bands it will be necessary for you to follow the prescription for an ideal result. Failure to follow protocol will lead to a less than ideal treatment result. Excessive broken brackets will delay treatment and lead to an incomplete result. Compromised results due to lack of compliance is not grounds for financial reconciliation. ",
//   },
//   {
//     title: "Athletics",
//     content:
//       "Braces and mouthguards typically don't mix. Molded mouthguards will prevent planned tooth movement. If you require a mouthguard for contact sports, we stock ortho-friendly mouthguards which may work. ",
//   },
//   {
//     title: "How long will I be in braces",
//     content:
//       "Every year hundreds of parents trust our experience to provide beautiful, healthy smiles for their children. Deepending on case complexity and compliance, your time in braces may vary, but at FreySmiles Orthodontics case completion may only be typically only 12-22 months away.",
//   },

//   {
//     title: "Eating with braces",
//     content:
//       "Something to keep in mind with braces is to take caution when eating hard foods, i.e., tough meats,hard breads, granola, and the like.  But you’ll need to protect yourorthodontic appliances when you eat for as long as you’re wearing braces.",
//   },
// ];

// const scrollContainerRef = useRef(null);

// useEffect(() => {
//   const scrollContainer = scrollContainerRef.current;
//   let scrollingImages = scrollContainer.querySelectorAll(".image-wrapper");

//   scrollingImages = Array.from(scrollingImages);
//   scrollingImages.forEach((e, i) => {
//     e.style.zIndex = `${scrollingImages.length - i}`;
//   });

//   const setScrollHeight = () => {
//     const offset =
//       scrollContainer.getBoundingClientRect().top + window.scrollY;
//     const scrollHeight = window.innerHeight;
//     return { offset, scrollHeight };
//   };

//   const updateImages = () => {
//     const { offset, scrollHeight } = setScrollHeight();

//     scrollingImages.forEach((e, i) => {
//       let scrollPct =
//         ((window.scrollY - offset - scrollHeight * i) / scrollHeight) * 100;
//       scrollPct = 100 - scrollPct;
//       scrollPct = Math.min(Math.max(scrollPct, 0), 100);

//       let clipPath = `polygon(0% 0%, 100% 0%, 100% ${scrollPct}%, 0% ${scrollPct}%)`;
//       e.style.clipPath = clipPath;
//       e.style.webkitClipPath = clipPath;
//     });
//   };

//   window.addEventListener("scroll", updateImages);
//   window.addEventListener("resize", () => {
//     setScrollHeight();
//     updateImages();
//   });

//   return () => {
//     window.removeEventListener("scroll", updateImages);
//     window.removeEventListener("resize", updateImages);
//   };
// }, []);

//                 <h3>Food To Avoid</h3>
{
  /* <p>
<ul>
   <li>Chewy foods: dense baked goods, such as bagels and baguettes, licorice.</li>
   <li>Crunchy foods: popcorn, ice.</li>
  <li>Sticky foods: caramels, gum.</li>
    <li>Hard foods: nuts, candy.</li>
   <li>
   Foods you have to bite into: corn on the cob, apples,
    carrots.
  </li>
 </ul>
Chewing on hard things (for example, pens, pencils or
fingernails) can damage the braces. Damaged braces will cause
 treatment to take longer.
</p> */
}

// export default CaringForYourBraces
// import React, { useEffect } from 'react';
// import { gsap } from "gsap-trial";
// import { ScrollTrigger } from "gsap/ScrollTrigger";
// import Scrollbar from 'smooth-scrollbar';

// useEffect(() => {
//   gsap.registerPlugin(ScrollTrigger);

//   gsap.to(".bglinear", {
//     scrollTrigger: {
//       trigger: "#p2",
//       scrub: true,
//       start: "10% bottom",
//       end: "80% 80%",
//     },
//     backgroundImage: "linear-gradient(270deg, #000 50%, #fff 0%)",
//     duration: 3,
//   });

//   gsap.to(".bglinear", {
//     scrollTrigger: {
//       trigger: "#p2",
//       scrub: true,
//       start: "10% 80%",
//       end: "80% 80%",
//     },
//     letterSpacing: "10px",
//     duration: 3,
//   });

//   return () => {
//     ScrollTrigger.getAll().forEach((t) => t.kill());
//   };
// }, []);

//   useEffect(() => {
//     gsap.registerPlugin(ScrollTrigger);

//     // Initialize custom scrollbar
//     let bodyScrollBar = Scrollbar.init(document.querySelector('.scroller'), {
//         damping: 0.1,
//         delegateTo: document,
//     });

//     // Proxy scroller for ScrollTrigger
//     ScrollTrigger.scrollerProxy(".scroller", {
//         scrollTop(value) {
//             if (arguments.length) {
//                 bodyScrollBar.scrollTop = value;
//             }
//             return bodyScrollBar.scrollTop;
//         },
//     });

//     bodyScrollBar.addListener(ScrollTrigger.update);

//     // Set zIndex for panels
//     gsap.set(".panel", { zIndex: (i, target, targets) => targets.length - i });

//     // Animating panels
//     gsap.utils.toArray('.panel:not(.purple)').forEach((image, i) => {
//         gsap.timeline({
//             scrollTrigger: {
//                 trigger: ".black",
//                 scroller: ".scroller",
//                 start: () => "top -" + (window.innerHeight * (i + 0.5)),
//                 end: () => "+=" + window.innerHeight,
//                 scrub: true,
//                 invalidateOnRefresh: true,
//             }
//         })
//         .to(image, { height: 0 });
//     });

//     // Set zIndex for panel texts
//     gsap.set(".panel-text", { zIndex: (i, target, targets) => targets.length - i });

//     // Animating panel texts
//     gsap.utils.toArray('.panel-text').forEach((text, i) => {
//         gsap.timeline({
//             scrollTrigger: {
//                 trigger: ".black",
//                 scroller: ".scroller",
//                 start: () => "top -" + (window.innerHeight * i),
//                 end: () => "+=" + window.innerHeight,
//                 scrub: true,
//                 invalidateOnRefresh: true,
//             }
//         })
//         .to(text, { duration: 0.33, opacity: 1, y: "50%" })
//         .to(text, { duration: 0.33, opacity: 0, y: "0%" }, 0.66);
//     });

//     // Create ScrollTrigger for pinning
//     ScrollTrigger.create({
//         trigger: ".black",
//         scroller: ".scroller",
//         start: "top top",
//         end: () => "+=" + ((gsap.utils.toArray('.panel').length + 1) * window.innerHeight),
//         pin: true,
//         scrub: true,
//         invalidateOnRefresh: true,
//         markers: true
//     });

//     return () => {
//         ScrollTrigger.kill();
//         bodyScrollBar.destroy();
//     };
// }, []);

//     return (
// <>
//         <div className="scroller h-screen overflow-hidden">
//             <section className="black flex justify-around items-center h-screen bg-black sticky top-0 z-10">
//                 <div className="text-wrap relative overflow-hidden w-[450px] h-[80vh]">
//                     <div className="panel-text blue-text absolute inset-0 z-10 w-full h-full text-4xl uppercase font-bold text-center bg-black text-blue-500">Blue</div>
//                     <div className="panel-text red-text absolute inset-0 z-10 w-full h-full text-4xl uppercase font-bold text-center bg-black text-red-500">Red</div>
//                     <div className="panel-text orange-text absolute inset-0 z-10 w-full h-full text-4xl uppercase font-bold text-center bg-black text-orange-500">Orange</div>
//                     <div className="panel-text purple-text absolute inset-0 z-10 w-full h-full text-4xl uppercase font-bold text-center bg-black text-purple-500">Purple</div>
//                 </div>
//                 <div className="p-wrap relative overflow-hidden w-[450px] h-[80vh]">
//                     <div className="panel blue absolute inset-0 bg-blue-800"></div>
//                     <div className="panel red absolute inset-0 bg-red-500"></div>
//                     <div className="panel orange absolute inset-0 bg-orange-600"></div>
//                     <div className="panel purple absolute inset-0 bg-purple-700"></div>
//                 </div>
//             </section>
//             <section className="h-screen bg-blue-800"></section>
//         </div>
// {/* <div>
{
  /* <section
  className="bglinear"
  style={{
    position: "fixed",
    width: "100%",
    height: "100vh",
    backgroundImage: "linear-gradient(90deg, #000 50%, #fff 50%)",
    zIndex: -1,
    transition: "all 0.1s ease",
    perspective: "1px",
  }}
>
  <span
    style={{
      color: "transparent",
      fontSize: "122px",
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      WebkitBackgroundClip: "text",
      WebkitTextStroke: "2px rgba(133, 133, 133, 1)",
      backfaceVisibility: "none",
    }}
  >
   FOODS
  </span>
</section>

<section
  id="p1"
  className="flex justify-around items-center w-full h-screen bg-transparent z-10"
>
  <h1 className="text-white text-4xl">YES</h1>
  <h1 className="text-black text-4xl">NO</h1>
  <a
    href="#p2"
    className="text-black text-2xl absolute left-1/2 top-0 mt-2 p-2 bg-gray-200 rounded transform -translate-x-1/2"
  >
    <i className="fas fa-arrow-down"></i>
  </a>
</section>

<section
  id="p2"
  className="flex justify-around items-center w-full h-screen bg-transparent z-10 relative"
>
  <h1 className="text-black text-4xl">FOODS TO AVOID</h1>
  <h1 className="text-white text-4xl">OK</h1>
  <a
    href="#p1"
    className="text-black text-2xl absolute left-1/2 top-5/6 mt-2 p-2 bg-gray-200 rounded transform -translate-x-1/2"
  >
    <i className="fas fa-arrow-up"></i>
  </a>
</section> */
}
//</>

//     );
// };
