// "use client";
// import { useEffect, useRef } from "react";
// import gsap from 'gsap';

// import {
//   motion,
//   stagger,
//   useAnimate,
//   useInView,
//   useScroll,
//   useTransform,
// } from "framer-motion";

// const featuredTestimonial = {
//   body: "Who says an adult can't dream? I've always wanted a perfect smile. Thanks to FreySmiles my dream has come true.",
//   author: {
//     name: "Ron Lucien",
//     treatment: "Invisalign",
//     imageUrl: "/../../images/testimonials/Ron_Lucien.png",
//   },
// };

// const testimonials = [
//   [
//     [
//       {
//         body: "FreySmiles is the best. I can't stop smiling thanks to Dr. Frey and his amazing team!",
//         author: {
//           name: "Brooke Walker",
//           treatment: "Braces",
//           imageUrl: "/../../../images/testimonials/Brooke_Walker.png",
//         },
//       },
//       {
//         body: "A thousand thanks to Dr. Frey and his wonderful team. Now I smile with confidence! FreySmiles delivers the best smiles!",
//         author: {
//           name: "Sophia Lee",
//           treatment: "Braces",
//           imageUrl: "/../../../images/testimonials/Sophia_Lee.png",
//         },
//       },
//       {
//         body: "I enjoyed how patient and kind Dr. Frey and his team were throughout my treatment. I love feeling confident with my smile!",
//         author: {
//           name: "Natasha Khela",
//           treatment: "Invisalign",
//           imageUrl: "/../../../images/testimonials/Natasha_Khela.png",
//         },
//       },
//       // More testimonials...
//     ],
//     [
//       {
//         body: "Thank you to Dr. Frey and the outstanding team for giving me a beautiful smile!",
//         author: {
//           name: "Maria Anagnostou",
//           treatment: "Braces",
//           imageUrl: "/../../../images/testimonials/Maria_Anagnostou.png",
//         },
//       },
//       {
//         body: "FreySmiles is the best! I'm so happy with my smile and the confidence it's brought me!",
//         author: {
//           name: "Lainie Walker",
//           treatment: "Braces",
//           imageUrl: "/../../../images/testimonials/Lainie_Walker.png",
//         },
//       },
//       // More testimonials...
//     ],
//   ],
//   [
//     [
//       {
//         body: "Thanks to the team at FreySmiles, I am able to smile with confidence.",
//         author: {
//           name: "James Cipolla",
//           treatment: "Braces",
//           imageUrl: "/../../../images/testimonials/James_Cipolla.png",
//         },
//       },
//       {
//         body: "As an adult patient, FreySmiles made my experience with braces a first class trip! Now I have a first class smile too.",
//         author: {
//           name: "Erica Brooks",
//           treatment: "Braces",
//           imageUrl: "/../../../images/testimonials/Erica_Brooks.png",
//         },
//       },
//       // More testimonials...
//     ],
//     [
//       {
//         body: "I'm so happy with the results of my Invisalign treatment and the confidence my FreySmile has given me.",
//         author: {
//           name: "Ibis Subero",
//           treatment: "Invisalign",
//           imageUrl: "/../../../images/testimonials/Ibis_Subero.png",
//         },
//       },
//       {
//         body: "I'm grateful to the team at Freysmiles for making my smile so beautiful.",
//         author: {
//           name: "Paige Mckenna",
//           treatment: "Braces",
//           imageUrl: "/../../../images/testimonials/Paige_Mckenna.png",
//         },
//       },
//       {
//         body: "A big thank you to Dr. Frey and his team for perfecting my teeth. I receive compliments on my radiant smile every day.",
//         author: {
//           name: "Devika Knafo",
//           treatment: "Braces",
//           imageUrl: "/../../../images/testimonials/Devika_Knafo.png",
//         },
//       },

//     ],
//   ],
// ];

// function classNames(...classes) {
//   return classes.filter(Boolean).join(" ");
// }

// export default function Testimonials() {
  
//   const fadeInOnScroll = {
//     initial: {
//       y: 100,
//       opacity: 0,
//     },
//     animate: {
//       y: 0,
//       opacity: 1,
//       transition: {
//         type: "spring",
//         bounce: 0.2,
//         duration: 0.8,
//       },
//     },
//   };
  
//   useEffect(() => {
//     let target = 0;
//     let current = 0;
//     const ease = 0.075;
  
//     const sliderWrapper = document.querySelector(".slider__wrapper");
//     const slides = document.querySelectorAll(".slider__item");
  
//     let maxScroll = sliderWrapper.offsetWidth - window.innerWidth - 600;
  
//     function lerp(start, end, factor) {
//       return start + (end - start) * factor;
//     }
  
//     function updateScaleAndPosition() {
//       slides.forEach((slide) => {
//         const rect = slide.getBoundingClientRect();
//         const centerPosition = (rect.left + rect.right) / 2;
//         const distanceFromCenter = centerPosition - window.innerWidth / 2;
  
//         let scale, offsetX;
//         if (distanceFromCenter > 0) {
//           scale = Math.min(1.75, 1 + distanceFromCenter / window.innerWidth);
//           offsetX = (scale - 1) * 300;
//         } else {
//           scale = Math.max(0.5, 1 - Math.abs(distanceFromCenter) / window.innerWidth);
//           offsetX = 0;
//         }
  
//         gsap.set(slide, {
//           scale: scale,
//           x: offsetX,
//         });
//       });
//     }
  
//     function update() {
//       current = lerp(current, target, ease);
  
//       gsap.set(sliderWrapper, {
//         x: -current,
//       });
  
//       updateScaleAndPosition();
  
//       requestAnimationFrame(update);
//     }
  
//     const handleWheel = (e) => {
//       target += e.deltaY;
//       target = Math.max(0, Math.min(maxScroll, target));
  
//       if (target > 0 && target < maxScroll) {
//         document.body.style.overflow = 'hidden';
//       } else {
//         document.body.style.overflow = '';
//       }
//     };
  
//     window.addEventListener("resize", () => {
//       maxScroll = sliderWrapper.offsetWidth - window.innerWidth;
//     });
  
//     window.addEventListener("wheel", handleWheel);
  
//     update();
  
//     return () => {
//       window.removeEventListener("resize", () => {});
//       window.removeEventListener("wheel", handleWheel);
//       document.body.style.overflow = '';
//     };
//   }, []);
  

  
//   const imageUrl = [
//     "/../../../images/testimonials/kinzie1.jpg", "/../../../images/testimonials/hurlburt.jpeg",  "/../../../images/carepatient2.png",  "/../../../images/testimonials/laniepurple.png",
//     "/../../../images/testimonials/Narvaez.jpg", "/../../../images/testimonials/Natasha_Khela.jpg",  "/../../../images/testimonials/schwarz.jpeg",
//     "/../../../images/freysmilepatient.jpg","/../../../images/testimonials/hobsonblue.png",
//     "/../../../images/testimonials/elizabeth1.png",
//     "/../../../images/testimonials/Nilaya.jpeg", 
  
//   ];

//   return (
//     <>
// <div className="bg-[#F4F1EC] min-h-screen ">
//       <div className="slider">
//       <div className="  w-screen h-screen relative ">
 
//  <div className="sidebar">
//    <div className="sidebar__item">
//    <p style={{ textTransform: 'uppercase', fontSize: '3.5rem', lineHeight: 1, marginBottom: '4rem' }} className="font-bold font-TerminaTest-Bold text-2xl uppercase mb-4">Our <br />Patients </p>

//      <p>Read Our Reviews <br/>link</p>
//    </div>
//    <div className="sidebar__item flex gap-24">
//      <p></p>
//      <p>&bull; &bull; &bull;</p>
//    </div>
//  </div>
//  <div className="slider__wrapper flex gap-24 p-6">
//   {imageUrl.map((imagePath, index) => (
//     <div key={index} className="slider__item relative group">
//       <img className="rounded-2xl transition-all duration-300 ease-in-out" src={imagePath} alt="" />
//       <div className="absolute inset-0 bg-[#000]/30 opacity-0 group-hover:opacity-100 flex items-center justify-center rounded-2xl transition-opacity duration-300 ease-in-out">
//         <span className="text-lg font-semibold text-black">Name</span> 
//       </div>
//     </div>
//   ))}
// </div>

        
//       </div>
//     </div>

//     </div>

//     </>
//   );
// }
'use client';
import { useEffect, useState } from "react";
import Scene from "./scene.js";
import Projects from "./projects.js";
import Lenis from '@studio-freight/lenis';
export default function Home() {

  const [activeMenu, setActiveMenu] = useState(null)
  useEffect( () => {
    const lenis = new Lenis()

    function raf(time) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)
  }, [])

  return (
    <main>
      <div className="h-[50vh]"></div>
      <Projects setActiveMenu={setActiveMenu}/>
      <Scene activeMenu={activeMenu}/>
      <div className="h-[50vh]"></div>
    </main>
  );
}