"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const ExpandingSections = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: () => `+=${window.innerWidth * 7}`,
          scrub: 0,
          pin: true,
        },
      });

      gsap.set(".purpleSection", { left: "0vw" });
      gsap.set(".greenSection", { left: "80vw" });
      gsap.set(".whiteSection", { left: "95vw" });
      gsap.set(".orangeSection", { left: "100vw" });
      gsap.set(".redSection", { left: "100vw" });
      gsap.set(".blackSection", { left: "100vw" });

      tl.to(".greenSection", { left: "0vw", duration: 1, ease: "none" }, 1);
      tl.to(".whiteSection", { left: "80vw", duration: 1, ease: "none" }, 1);
      tl.to(".orangeSection", { left: "95vw", duration: 1, ease: "none" }, 1);
      tl.to(".redSection", { left: "100vw", duration: 1, ease: "none" }, 1);
      tl.to(".blackSection", { left: "100vw", duration: 1, ease: "none" }, 1);

      tl.to(".whiteSection", { left: "0vw", duration: 1, ease: "none" }, 2);
      tl.to(".orangeSection", { left: "80vw", duration: 1, ease: "none" }, 2);
      tl.to(".redSection", { left: "95vw", duration: 1, ease: "none" }, 2);
      tl.to(".blackSection", { left: "100vw", duration: 1, ease: "none" }, 2);

      tl.to(".orangeSection", { left: "0vw", duration: 1, ease: "none" }, 3);
      tl.to(".redSection", { left: "80vw", duration: 1, ease: "none" }, 3);
      tl.to(".blackSection", { left: "95vw", duration: 1, ease: "none" }, 3);

      tl.to(".redSection", { left: "0vw", duration: 1, ease: "none" }, 4);
      tl.to(".blackSection", { left: "80vw", duration: 1, ease: "none" }, 4);

      tl.to(".blackSection", { left: "0vw", duration: 1, ease: "none" }, 5);

      tl.to(".greenContentText", { x: "0%", duration: 0.8, ease: "none" }, 1.2);
      gsap.set(".greenContentText", { x: "-64%" });
      tl.to(".whiteContentText", { x: "0%", duration: 1.8, ease: "none" }, 1.2);
      gsap.set(".whiteContentText", { x: "-144%" });
      tl.to(
        ".orangeContentText",
        { x: "0%", duration: 2.8, ease: "none" },
        1.2
      );
      gsap.set(".orangeContentText", { x: "-224%" });
      tl.to(".redContentText", { x: "0%", duration: 3.8, ease: "none" }, 1.2);
      gsap.set(".redContentText", { x: "-304%" });
      tl.to(".blackContentText", { x: "0%", duration: 4.8, ease: "none" }, 1.2);
      gsap.set(".blackContentText", { x: "-385%" });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    gsap.to(".fixedNav", {
      duration: 0.5,
      scrollTrigger: {
        trigger: "body",
        start: "top -10px",
      },
    });
  }, []);

  return (
    <div>
      <div ref={containerRef} className="h-screen sticky">
        <nav className="font-neue-montreal text-[12px] fixed top-0 left-0 w-full h-8 flex z-50">
          <div className="w-1/5 h-full  flex items-center justify-center">
            <span className="text-black ">• Brushing and Flossing</span>
          </div>
          <div className="w-1/5 h-full  flex items-center justify-center">
            <span className="text-black ">• General Soreness</span>
          </div>
          <div className="w-1/5 h-full flex items-center justify-center">
            <span className="text-black "> • Eating with braces</span>
          </div>
          <div className="w-1/5 h-full flex items-center justify-center">
            <span className="text-black font-semibold"> • Rubberband wear</span>
          </div>
          <div className="w-1/5 h-full flex items-center justify-center">
            <span className="text-black font-semibold">
              • Final Considerations
            </span>
          </div>
        </nav>
        <div
          style={{
            position: "fixed",
            top: "20vh",

            width: "100%",
            paddingLeft: "13rem",
            zIndex: 10,
            pointerEvents: "none",
          }}
        >
          <h1 className="text-[82px] font-generalregular">Self-Care</h1>
        </div>

        <div
          style={{
            fontFamily: "NeueMontrealBook",
            height: "100%",
            position: "absolute",
            top: "0",
            width: "100%",
          }}
        >
          <div
            style={{
              height: "100vh",
              overflow: "hidden",
              position: "absolute",
              top: "0",
              width: "100%",
            }}
            className="purpleSection"
          >
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "flex-start",
                  paddingLeft: "12rem",
                  paddingTop: "0vh",
                }}
              >
                <div
                  className="contentText"
                  style={{
                    marginTop: "23.25rem",
                    overflow: "hidden",
                    width: "450px",
                  }}
                >
                  {" "}
                  <p className="font-neue-montreal">
                    {" "}
                    Braces treatment time varies based on your unique case and
                    how well you follow care instructions. At FreySmiles
                    Orthodontics, most patients achieve their ideal smile in 12
                    to 22 months. Ready to get started? Let’s make it happen.
                  </p>
                  <hr className="border-t border-[#262626] mt-10 mb-8" />
                  <div className="flex items-center space-x-2"></div>
                </div>
              </div>
            </div>
          </div>
          <div
            style={{
              height: "100vh",
              overflow: "hidden",
              position: "absolute",
              top: "0",
              width: "100%",
            }}
            className="greenSection"
          >
            <div
              className="greenContentText"
              style={{
                display: "flex",
                overflow: "hidden",
                alignItems: "flex-start",
                justifyContent: "flex-start",
                paddingLeft: "12rem",
                paddingTop: "0vh",
              }}
            >
              <div
                style={{
                  marginTop: "23.25rem",
                  overflow: "hidden",
                  width: "450px",
                }}
              >
                {" "}
                <p className="font-neue-montreal">
                  Brushing and flossing are especially important during
                  orthodontic treatment since appliances like aligners and
                  braces interfere with the mouth’s natural cleaning. Only 10%
                  of patients maintain consistent oral hygiene, so we recommend
                  at least three professional cleanings a year—check with your
                  insurance for coverage.
                </p>
                <hr className="border-t border-[#262626] mt-10 mb-8" />
                <div className="flex items-center space-x-2"></div>
              </div>
            </div>
          </div>

          <div
            style={{
              height: "100vh",
              overflow: "hidden",
              position: "absolute",
              top: "0",
              width: "100%",
            }}
            className="whiteSection"
          >
            <div
              className="whiteContentText"
              style={{
                display: "flex",
                overflow: "hidden",
                alignItems: "flex-start",
                justifyContent: "flex-start",
                paddingLeft: "12rem",
                paddingTop: "0vh",
              }}
            >
              <div
                style={{
                  marginTop: "23.25rem",
                  overflow: "hidden",
                  width: "450px",
                }}
              >
                {" "}
                When you first get braces, your mouth might feel sore, and your
                teeth may be tender for 3–5 days—kind of like a dull headache.
                Taking Tylenol or your usual pain reliever can help ease the
                discomfort. Your lips, cheeks, and tongue might also feel
                irritated for a week or two as they adjust. No worries—we’ve got
                you covered with wax to prevent rubbing and irritation. Hang in
                there—it gets easier!
              </div>
            </div>
          </div>
          <div
            style={{
              height: "100vh",
              overflow: "hidden",
              position: "absolute",
              top: "0",
              width: "100%",
            }}
            className=" orangeSection"
          >
            <div
              className="orangeContentText"
              style={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "flex-start",
                paddingLeft: "12rem",
                paddingTop: "0vh",
              }}
            >
              <div
                style={{
                  width: "450px",
                  marginTop: "23.25rem",
                  overflow: "hidden",
                }}
              >
                {" "}
                Traditionally, patients have been advised to avoid certain foods
                during braces treatment, as aggressive or rapid chewing can
                break brackets. Crunchy, chewy, sugary, and acidic foods should
                be avoided. While this is not a comprehensive list, some
                examples include dense breads, caramel, gum, soda, and lean
                meats. Apples should be sliced, and corn on the cob may require
                careful navigation.
              </div>
            </div>
          </div>
          <div
            style={{
              height: "100vh",
              overflow: "hidden",
              position: "absolute",
              top: "0",
              width: "100%",
            }}
            className=" redSection"
          >
            <div
              className="redContentText"
              style={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "flex-start",
                paddingLeft: "12rem",
                paddingTop: "0vh",
              }}
            >
              <div
                style={{
                  width: "450px",
                  marginTop: "23.25rem",
                  overflow: "hidden",
                }}
              >
                {" "}
                If your doctor has prescribed rubber bands, it’s essential to
                follow the prescription for the best results. Not wearing them
                as directed or frequently breaking brackets can affect your
                treatment outcome. During treatment, you’ll receive different
                rubber band sizes based on wire size and planned corrections.
                While you may accumulate various elastics, keep in mind that not
                all are interchangeable for every configuration.
              </div>
            </div>
          </div>
          <div
            style={{
              height: "100vh",
              overflow: "hidden",
              position: "absolute",
              top: "0",
              width: "100%",
            }}
            className=" blackSection"
          >
            <div
              className="blackContentText"
              style={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "flex-start",
                paddingLeft: "12rem",
                paddingTop: "0vh",
              }}
            >
              <div
                style={{
                  width: "450px",
                  marginTop: "23.25rem",
                  overflow: "hidden",
                }}
              >
                {" "}
                If your doctor has prescribed rubber bands, it’s essential to
                follow the prescription for the best results. Not wearing them
                as directed or frequently breaking brackets can affect your
                treatment outcome. During treatment, you’ll receive different
                rubber band sizes based on wire size and planned corrections.
                While you may accumulate various elastics, keep in mind that not
                all are interchangeable for every configuration.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpandingSections;

// "use client";
// import React, { useRef, useEffect } from "react";
// import { gsap } from "gsap";
// import { ScrollTrigger } from "gsap/ScrollTrigger";

// gsap.registerPlugin(ScrollTrigger);

// export default function HorizontalContainer() {
//   const containerRef = useRef(null);

//   useEffect(() => {
//     const ctx = gsap.context(() => {
//       const tl = gsap.timeline({
//         scrollTrigger: {
//           trigger: containerRef.current,
//           start: "top top",
//           end: "+=9000",
//           scrub: 1,
//           pin: true,

//         },
//       });

//       // 1st: purple expands, green & white expand together
//       tl.to(
//         ".purpleSection",
//         { left: "0vw", width: "70vw", duration: 1, ease: "none" },
//         0
//       );
//       tl.to(
//         ".contentText",
//         {
//           x: "0",
//           duration: 0.5,
//           ease: "none",
//         },
//         .5
//       );
//       tl.to(
//         ".image-wrapper",
//         {
//           scale: 1.5,
//           transformOrigin: "bottom right",
//           duration: 1,
//           ease: "power2.out",
//         },
//         0
//       );

//       tl.to(
//         ".greenSection",
//         { left: "70vw", width: "20vw", duration: 1, ease: "none" },
//         0
//       );

//       tl.to(
//         ".whiteSection",
//         { left: "90vw", width: "10vw", duration: 1, ease: "none" },
//         0
//       );

//       tl.to(
//         ".greenSection",
//         { left: "0vw", width: "70vw", duration: 1, ease: "none" },
//         1
//       );
//       tl.to(
//         ".greenContentText",
//         {
//           x: "0%",
//           duration: 0.5,
//           ease: "none",
//         },
//         1.5
//       );
//       tl.to(
//         ".image-wrapper2",
//         {
//           scale: 2.5,
//           transformOrigin: "bottom right",
//           duration: 1,
//           ease: "power2.out",
//         },
//         1
//       );
//       tl.to(
//         ".whiteSection",
//         { left: "70vw", width: "15vw", duration: 1, ease: "none" },
//         1
//       );
//       tl.to(
//         ".orangeSection",
//         { left: "85vw", width: "15vw", duration: 1, ease: "none" },
//         1
//       );
//       tl.set(".greenSection", { zIndex: 4 }, 1);

//       // 3rd: white moves over green, orange expands, red appears
//       tl.to(
//         ".whiteSection",
//         { left: "0vw", width: "70vw", duration: 1, ease: "none" },
//         2
//       );
//       tl.to(
//         ".whiteContentText",
//         {
//           x: "0%",
//           duration: 0.5,
//           ease: "none",
//         },
//         2.5
//       );
//       tl.to(
//         ".orangeSection",
//         { left: "70vw", width: "20vw", duration: 1, ease: "none" },
//         2
//       );
//       tl.to(
//         ".redSection",
//         { left: "90vw", width: "10vw", duration: 1, ease: "none" },
//         2
//       );
//       tl.set(".whiteSection", { zIndex: 5 }, 2);

//       // 4th: orange moves over white, red expands
//       tl.to(
//         ".orangeSection",
//         { left: "0vw", width: "70vw", duration: 1, ease: "none" },
//         3
//       );
//       tl.to(
//         ".orangeContentText",
//         {
//           x: "0%",
//           duration: 0.5,
//           ease: "none",
//         },
//         3.5
//       );
//       tl.to(
//         ".redSection",
//         { left: "70vw", width: "30vw", duration: 1, ease: "none" },
//         3
//       );
//       tl.set(".orangeSection", { zIndex: 6 }, 3);

//       // 5th: red moves over orange as the final section
//       tl.to(
//         ".redSection",
//         { left: "0vw", width: "100vw", duration: 1, ease: "none" },
//         4
//       );
//       tl.set(".redSection", { zIndex: 7 }, 4);
//       tl.to(
//         ".redContentText",
//         {
//           x: "0%",
//           duration: 0.5,
//         },
//         4.5
//       );
//     }, containerRef);

//     return () => ctx.revert();
//   }, []);

//   return (
//     <>
//       <div
//    style={{
//     position: "fixed",
//     top: "20vh",
//     left: "-150px",
//     width: "100%",
//     paddingLeft: "16rem",
//     zIndex: 10,
//     pointerEvents: "none",
//   }}
//       >
//         <h1 className="text-[82px] font-generalregular">Self-Care</h1>
//       </div>
//       <section
//         ref={containerRef}
//         style={{
//           position: "relative",
//           height: "100vh",
//           overflow: "hidden",
//         }}
//       >
//         {/* gray */}
//         <div
//           className="graySection"
//           style={{
//             position: "absolute",
//             top: 0,
//             left: "0vw",
//             width: "70vw",
//             height: "100%",
//             overflow: "hidden",
//             background: "#EFEFEF",
//             zIndex: 1,
//           }}
//         >
//           <div className="flex flex-col h-screen justify-center">
//             <div className="h-2/3 flex flex-col md:flex-row gap-8 md:gap-16 ">
//               <div
//                 style={{
//                   position: "relative",
//                   width: "100%",
//                   height: "100%",
//                 }}
//               >
//                 <div
//                   style={{
//                     position: "absolute",
//                     transform: "translate(0%, 0%)",
//                     width: "550px",
//                     bottom: 30,
//                     left: "10%",
//                     paddingRight: "68px",
//                   }}
//                   className="contentText flex flex-col justify-end"
//                 >
//                   <p className="text-[14px] font-neue-montreal md:text-[16px] leading-relaxed mb-8">
//                     How long you’ll wear braces depends on your treatment plan
//                     and how well you follow our team's instructions. At
//                     FreySmiles, most patients achieve their ideal smile in 12 to
//                     20 months. Ready to get started? Let’s make it happen.
//                   </p>
//                   <hr className="border-t border-[#262626] mb-8" />
//                   <div className="flex items-center space-x-2">
//                     <h3 className="font-helvetica-neue-light text-sm font-medium uppercase tracking-widest mb-0 leading-none">
//                       • Learn More
//                     </h3>
//                   </div>
//                 </div>
//               </div>
//               <div className="absolute right-0 bottom-[10%] flex justify-end">
//                 <div
//                   className="image-wrapper rounded-2xl overflow-hidden"
//                   style={{
//                     width: "350px",
//                     height: "auto",
//                   }}
//                 >
//       <div className="relative w-full h-screen flex items-center justify-center overflow-visible">
//   {/* Arch - Positioned Correctly */}
//   <div className="absolute w-[250px] top-[30%] right-[20%]">
//     <img
//       src="https://cdn.prod.website-files.com/5ffdc00ed84c8443afac3d5f/60b114b72343062eb3433b53_Doorway%401.5x.png"
//       alt="Arch"
//     />
//   </div>

//   {/* Staggered Steps - Adjusted to Prevent Cropping */}
//   <div className="absolute bottom-[5%] left-[10%] flex flex-col items-center">
//     {/* Bottom Step - Furthest Left */}
//     <img
//       src="https://cdn.prod.website-files.com/5ffdc00ed84c8443afac3d5f/60b114b63e81a1741fde0d23_Step%20Bottom%401.5x.png"
//       alt="Step"
//       className="w-[250px] ml-[-50px]"
//     />

//     {/* Middle Step - Slightly Right */}
//     <img
//       src="https://cdn.prod.website-files.com/5ffdc00ed84c8443afac3d5f/60b114b63e81a1741fde0d23_Step%20Bottom%401.5x.png"
//       alt="Step"
//       className="w-[230px] ml-[-30px] mt-[-30px]"
//     />

//     {/* Top Step - Most Right */}
//     <img
//       src="https://cdn.prod.website-files.com/5ffdc00ed84c8443afac3d5f/60b114b63e81a1741fde0d23_Step%20Bottom%401.5x.png"
//       alt="Step"
//       className="w-[210px] ml-[-10px] mt-[-30px]"
//     />
//   </div>
// </div>

//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* purple */}
//         <div
//           className="purpleSection"
//           style={{
//             position: "absolute",
//             overflow: "hidden",
//             top: 0,
//             left: "70vw",
//             width: "20vw",
//             height: "100%",
//             background: "#CABDFE",
//             zIndex: 2,
//           }}
//         >
//           <div className="flex flex-col h-screen justify-center">
//             <div className="h-2/3 flex flex-col md:flex-row gap-8 md:gap-16 ">
//               <div
//                 style={{
//                   position: "relative",
//                   width: "100%",
//                   height: "100%",
//                 }}
//               >
//                 <div
//                   style={{
//                     position: "absolute",

//                     transform: "translateX(-650px)",
//                     width: "550px",
//                     bottom: 30,
//                     left: "100px",
//                     paddingRight: "68px",
//                   }}
//                   className="contentText flex flex-col justify-end"
//                 >
//                   <p className="text-[14px] font-helvetica-neue-light md:text-[16px] font-light leading-relaxed mb-8">
//                     Brushing and flossing during orthodontic treatment is more
//                     important than ever. All orthodontic appliances such as
//                     clear aligners, brackets, and wires interfere with normal
//                     self-cleansing mechanisms of the mouth. Research shows that
//                     only 10% of patients brush and floss consistently during
//                     active treatment. We always recommend patients with braces
//                     get three cleanings a year. Check with your insurance to see
//                     if they'll cover a third cleaning. When you begin treatment
//                     we will equip you with a number of tools to help with
//                     cleaning, including spare toothbrushes, and dental floss.
//                   </p>
//                   <hr className="border-t border-[#262626] mb-8" />
//                   <div className="flex items-center space-x-2">
//                     <h3 className="font-helvetica-neue-light text-black text-sm font-medium uppercase tracking-widest mb-0 leading-none">
//                       • Brushing and Flossing
//                     </h3>
//                   </div>
//                 </div>
//               </div>
//               <div className="absolute right-0 bottom-[6%] flex justify-end">
//                 <div
//                   className="image-wrapper rounded-2xl overflow-hidden"
//                   style={{
//                     width: "250px",
//                     height: "auto",
//                   }}
//                 >
//                   <img
//                     src="../images/purplefloss.jpeg"
//                     className="w-full h-auto"
//                   />
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* green */}
//         <div
//           className="greenSection"
//           style={{
//             position: "absolute",
//             top: 0,
//             left: "90vw",
//             width: "10vw",
//             height: "100%",
//             background: "#fb9474",
//             zIndex: 3,
//           }}
//         >
//           <div className="flex flex-col h-screen justify-center">
//             <div className="h-2/3 flex flex-col md:flex-row gap-8 md:gap-16 ">
//               <div
//                 style={{
//                   overflow: "hidden",
//                   position: "relative",
//                   width: "100%",
//                   height: "100%",
//                 }}
//               >
//                 <div
//                   style={{
//                     transform: "translateX(-105%)",
//                     width: "550px",
//                     bottom: 30,
//                     left: "10%",
//                     paddingRight: "68px",
//                   }}
//                   className="absolute greenContentText flex flex-col justify-end"
//                 >
//                   <p className="text-[14px] font-helvetica-neue-light md:text-[16px] font-light leading-relaxed mb-8">
//                     When you first get braces, your mouth might feel sore, and
//                     your teeth may be tender for 3–5 days—kind of like a dull
//                     headache. Taking Tylenol or your usual pain reliever can
//                     help ease the discomfort. Your lips, cheeks, and tongue
//                     might also feel irritated for a week or two as they adjust.
//                     No worries—we’ve got you covered with wax to prevent rubbing
//                     and irritation. Hang in there—it gets easier!
//                   </p>
//                   <hr className="border-t border-[#262626] mb-8" />
//                   <div className="flex items-center space-x-2">
//                     <h3 className="font-helvetica-neue-light text-sm font-medium uppercase tracking-widest mb-0 leading-none">
//                       • General Soreness
//                     </h3>
//                   </div>
//                 </div>
//               </div>
//               <div className="absolute right-0 bottom-[6%] flex justify-end">
//                 <div
//                   className="image-wrapper2 rounded-2xl overflow-hidden"
//                   style={{
//                     width: "150px",
//                     height: "auto",
//                   }}
//                 >
//                   <img src="https://cdn.prod.website-files.com/63088dc6f3670c21541c6fe6/639bd720adaf8a32db61b090_Gallery%2018-p-1080.jpg" className="w-full h-auto" />
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* white */}
//         <div
//           className="whiteSection"
//           style={{
//             position: "absolute",
//             top: 0,
//             left: "100vw",
//             width: "0vw",
//             height: "100%",
//             background: "#C3D393",
//             zIndex: 1,
//             overflow: "hidden",
//           }}
//         >
//           <div className="flex flex-col h-screen justify-center">
//             <div className="h-2/3 flex flex-col md:flex-row gap-8 md:gap-16 ">
//               <div
//                 style={{
//                   overflow: "hidden",
//                   position: "relative",
//                   width: "100%",
//                   height: "100%",
//                 }}
//               >
//                 <div
//                   style={{
//                     transform: "translateX(-105%)",
//                     width: "550px",
//                     left: "10%",
//                     bottom: 30,
//                     paddingRight: "68px",
//                   }}
//                   className="absolute whiteContentText flex flex-col justify-end"
//                 >
//                   <p className="text-[14px] font-helvetica-neue-light md:text-[16px] font-light text-black leading-relaxed mb-8">
//                     Traditionally, patients have been advised to avoid specific
//                     foods during braces treatment. Overly aggressive and rapid
//                     chewing will break your brackets. Crunchy, chewy, sugary,
//                     and acidic foods should be avoided. While this is not a
//                     comprehensive list, here is a basic guideline: Dense breads,
//                     caramel, gum, soda, lean meats. apples should be sliced and
//                     corn on the cob may require precise navigation.
//                   </p>
//                   <hr className="border-t border-[#262626] mb-8" />
//                   <div className="flex items-center space-x-2">
//                     <h3 className="font-helvetica-neue-light text-sm font-medium uppercase tracking-widest mb-0 leading-none">
//                       • Eating with braces
//                     </h3>
//                   </div>
//                 </div>
//               </div>
//               <div className="absolute right-0 bottom-[6%] flex justify-end">
//                 <div
//                   className="image-wrapper2 rounded-2xl overflow-hidden"
//                   style={{
//                     width: "150px",
//                     height: "auto",
//                   }}
//                 >
//                   <img
//                     src="https://cdn.prod.website-files.com/63088dc6f3670c21541c6fe6/639bd699a51be20ee78cf192_Gallery%209-p-1080.jpg"
//                     className="w-full h-auto"
//                   />
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* orange */}
//         <div
//           className="orangeSection"
//           style={{
//             position: "absolute",
//             top: 0,
//             left: "100vw",
//             width: "0vw",
//             height: "100%",
//             background: "#9DD2D6",
//             zIndex: 1,
//             overflow: "hidden",
//           }}
//         >
//           <div className="flex flex-col h-screen justify-center">
//             <div className="h-2/3 flex flex-col md:flex-row gap-8 md:gap-16 ">
//               <div
//                 style={{
//                   overflow: "hidden",
//                   position: "relative",
//                   width: "100%",
//                   height: "100%",
//                 }}
//               >
//                 <div
//                   style={{
//                     transform: "translate(-105%, 0%)",
//                     maxWidth: "500px",
//                     left: "10%",
//                     bottom: 30,
//                     paddingRight: "68px",
//                   }}
//                   className="orangeContentText absolute flex flex-col justify-end"
//                 >
//                   <p className="text-[14px] font-helvetica-neue-light md:text-[16px] font-light text-black leading-relaxed mb-8">
//                     If your doctor has prescribed rubber bands it's essential
//                     for you to follow the prescription for an ideal result.
//                     Failure to follow protocol and frequently breaking brackets
//                     will lead to a less than ideal treatment result. You’ll be
//                     given a number of different rubber band sizes during
//                     treatment—these are determined by the wire size and planned
//                     correction. You may accumulate a stockpile of various
//                     elastics, but keep in mind that not all elastics are
//                     interchangeable for every configuration.
//                   </p>
//                   <hr className="border-t border-[#262626] mb-8" />
//                   <div className="flex items-center space-x-2">
//                     <h3 className="font-helvetica-neue-light text-sm font-medium uppercase tracking-widest mb-0 leading-none">
//                       • Rubberband wear
//                     </h3>
//                   </div>
//                 </div>
//               </div>
//               <div className="absolute right-0 bottom-[6%] flex justify-end">
//                 <div
//                   className="image-wrapper2 rounded-2xl overflow-hidden"
//                   style={{
//                     width: "150px",
//                     height: "auto",
//                   }}
//                 >
//                   <img
//                     src="../images/bracesrubberbands.png"
//                     className="w-full h-auto"
//                   />
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//         <div
//           className="redSection"
//           style={{
//             position: "absolute",
//             top: 0,
//             left: "100vw",
//             width: "0vw",
//             height: "100%",
//             background: "#EFE9F5",
//             zIndex: 1,
//             overflow: "hidden",
//           }}
//         >
//           <div className="flex flex-col h-screen justify-center">
//             <div className="h-2/3 flex flex-col md:flex-row gap-8 md:gap-16 ">
//               <div
//                 style={{
//                   overflow: "hidden",
//                   position: "relative",
//                   width: "100%",
//                   height: "100%",
//                 }}
//               >
//                 <div
//                   style={{
//                     transform: "translateX(-105%)",
//                     maxWidth: "550px",
//                     left: "10%",
//                     bottom: 30,
//                     paddingRight: "68px",
//                   }}
//                   className="redContentText absolute flex flex-col justify-end"
//                 >
//                   <p className="text-[14px] font-helvetica-neue-light md:text-[16px] font-light text-black leading-relaxed mb-8">
//                     Teeth will become loose, and some more than others.The teeth
//                     will settle into the bone and soft tissue and mobility will
//                     return to physiologic norms at the end of treatment.
//                     Brackets will also break. All orthodontic appliances are
//                     temporary, breakages are expected and considered when
//                     calculating your treatment time and retention. Dental
//                     professionals,dental hygenists, and other specialists all
//                     have different knowledge bases and motivations pertaining to
//                     patient care. It is not unlikely that at some point during
//                     treatment you may receive conflicting information. We're on
//                     the cutting edge with our office and some people may not
//                     comprehend what we're doing. We're always open educating
//                     other professionals on our cutting edge treatment plans,
//                     however patient care is our prority. Whenever in doubt, you
//                     can always circle back with the doctor who treatment planned
//                     your case. Trust our process.
//                   </p>
//                   <hr className="border-t border-[#262626] mb-8" />
//                   <div className="flex items-center space-x-2">
//                     <h3 className="font-helvetica-neue-light text-sm font-medium uppercase tracking-widest mb-0 leading-none">
//                       • Final Considerations
//                     </h3>
//                   </div>
//                 </div>
//               </div>
//               <div className="absolute right-0 bottom-[6%] flex justify-end">
//                 <div
//                   className="image-wrapper2 rounded-2xl overflow-hidden"
//                   style={{
//                     width: "150px",
//                     height: "auto",
//                   }}
//                 >
//                          <img src="../images/portal.avif" className="w-full h-auto" />
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>
//     </>
//   );
// }
