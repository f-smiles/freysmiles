"use client";
import React, { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function HorizontalContainer() {
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=9000",
          scrub: 1,
          pin: true,
        },
      });

      // 1st: purple expands, green & white expand together
      tl.to(
        ".purpleSection",
        { left: "0vw", width: "70vw", duration: 1, ease: "none" },
        0
      );
      tl.to(
        ".contentText",
        {
          x: "0%",
          duration: .5,
          ease: "none",
        },
        0.5
      );
      tl.to(
        ".image-wrapper",
        {
          scale: 1.5,
          transformOrigin: "bottom right",
          duration: 1,
          ease: "power2.out",
        },
        0
      );

      tl.to(
        ".greenSection",
        { left: "70vw", width: "20vw", duration: 1, ease: "none" },
        0
      );

      tl.to(
        ".whiteSection",
        { left: "90vw", width: "10vw", duration: 1, ease: "none" },
        0
      );

      tl.to(
        ".greenSection",
        { left: "0vw", width: "70vw", duration: 1, ease: "none" },
        1
      );
      tl.to(
        ".greenContentText",
        {
          x: "0%",
          duration: .5,
          ease: "none",
        },
        1.5
      );
      tl.to(
        ".image-wrapper2",
        {
          scale: 2.5,
          transformOrigin: "bottom right",
          duration: 1,
          ease: "power2.out",
        },
        1
      );
      tl.to(
        ".whiteSection",
        { left: "70vw", width: "15vw", duration: 1, ease: "none" },
        1
      );
      tl.to(
        ".orangeSection",
        { left: "85vw", width: "15vw", duration: 1, ease: "none" },
        1
      );
      tl.set(".greenSection", { zIndex: 4 }, 1);

      // 3rd: white moves over green, orange expands, red appears
      tl.to(
        ".whiteSection",
        { left: "0vw", width: "70vw", duration: 1, ease: "none" },
        2
      );
      tl.to(
        ".whiteContentText",
        {
          x: "0%",
          duration: .5,
          ease: "none",
        },
        2.5
      );
      tl.to(
        ".orangeSection",
        { left: "70vw", width: "20vw", duration: 1, ease: "none" },
        2
      );
      tl.to(
        ".redSection",
        { left: "90vw", width: "10vw", duration: 1, ease: "none" },
        2
      );
      tl.set(".whiteSection", { zIndex: 5 }, 2);

      // 4th: orange moves over white, red expands
      tl.to(
        ".orangeSection",
        { left: "0vw", width: "70vw", duration: 1, ease: "none" },
        3
      );
      tl.to(
        ".orangeContentText",
        {
          x: "0%",
          duration: .5,
          ease: "none",
        },
        3.5
      );
      tl.to(
        ".redSection",
        { left: "70vw", width: "30vw", duration: 1, ease: "none" },
        3
      );
      tl.set(".orangeSection", { zIndex: 6 }, 3);

      // 5th: red moves over orange as the final section
      tl.to(
        ".redSection",
        { left: "0vw", width: "100vw", duration: 1, ease: "none" },
        4
      );
      tl.set(".redSection", { zIndex: 7 }, 4);
      tl.to(
        ".redContentText",
        {
          x: "0%",
          duration: .5,

        },
        4.5
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);
  
  return (
    <>
      <div
        style={{
          position: "fixed",
          top: "10vh",
          left: "-150px",
          width: "100%",
          paddingLeft: "16rem",
          zIndex: 10,
          pointerEvents: "none",
        }}
      >
        <h1 className="text-[72px] font-generalregular">Self-Care</h1>
      </div>
      <section
        ref={containerRef}
        style={{
          position: "relative",
          height: "100vh",
          overflow: "hidden",
        }}
      >
        {/* blue */}
        <div
          className="blueSection"
          style={{
            position: "absolute",
            top: 0,
            left: "0vw",
            width: "70vw",
            height: "100%",
            overflow: "hidden",
            background: "#EFEFEF",
            zIndex: 1,
          }}
        >
          <div className="flex flex-col h-screen justify-center">
            <div className="h-2/3 flex flex-col md:flex-row gap-8 md:gap-16 ">
              <div
                style={{
                  position: "relative",
                  width: "100%",
                  height: "100%",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    transform: "translate(0%, 0%)",
                    width: "550px",
                    bottom: 0,
                    left: "10%",
                    paddingRight: "68px",
                  }}
                  className="contentText flex flex-col justify-end"
                >
                  <p className="text-[14px] font-helvetica-neue-light md:text-[16px] font-light leading-relaxed mb-8">
                  How long you’ll wear braces depends on your treatment plan and
                  how well you follow our team's instructions. At FreySmiles,
                  most patients achieve their ideal smile in 12 to 20 months.
                  Ready to get started? Let’s make it happen.

                  </p>
                  <hr className="border-t border-[#262626] mb-8" />
                  <div className="flex items-center space-x-2">
                    <h3 className="font-helvetica-neue-light text-sm font-medium uppercase tracking-widest mb-0 leading-none">
                      • Learn More
                    </h3>
                  </div>
                </div>
              </div>
              <div className="absolute right-0 bottom-[6%] flex justify-end">
                <div
                  className="image-wrapper rounded-2xl overflow-hidden"
                  style={{
                    width: "350px",
                    height: "auto",
                  }}
                >
                  <img
                    src="../images/purplefloss.jpeg"
                    className="w-full h-auto"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
 <div
          className="purpleSection"
          style={{
            position: "absolute",
            overflow: "hidden",
            top: 0,
            left: "70vw",
            width: "20vw",
            height: "100%",
            background: "#CABDFE",
            zIndex: 2,
          }}
        >
          <div className="flex flex-col h-screen justify-center">
            <div className="h-2/3 flex flex-col md:flex-row gap-8 md:gap-16 ">
              <div
                style={{
                  position: "relative",
                  width: "100%",
                  height: "100%",
                }}
              >
                <div
                  style={{
  position: "absolute",
    transform: "translateX(-650px)", 
    width: "550px", 
    bottom: 0,
    left: "100px",

    paddingRight: "68px",
                  }}
                  className="contentText flex flex-col justify-end"
                >
                  <p className="text-[14px] font-helvetica-neue-light md:text-[16px] font-light leading-relaxed mb-8">
                    Brushing and flossing during orthodontic treatment is more
                    important than ever. All orthodontic appliances such as
                    clear aligners, brackets, and wires interfere with normal
                    self-cleansing mechanisms of the mouth. Research shows that
                    only 10% of patients brush and floss consistently during
                    active treatment. We always recommend patients with braces
                    get three cleanings a year. Check with your insurance to see
                    if they'll cover a third cleaning. When you begin treatment
                    we will equip you with a number of tools to help with
                    cleaning, including spare toothbrushes, and dental floss.
                  </p>
                  <hr className="border-t border-[#262626] mb-8" />
                  <div className="flex items-center space-x-2">
                    <h3 className="font-helvetica-neue-light text-sm font-medium uppercase tracking-widest mb-0 leading-none">
                      • Brushing and Flossing
                    </h3>
                  </div>
                </div>
              </div>
              <div className="absolute right-0 bottom-[6%] flex justify-end">
                <div
                  className="image-wrapper rounded-2xl overflow-hidden"
                  style={{
                    width: "250px",
                    height: "auto",
                  }}
                >
                  <img
                    src="../images/purplefloss.jpeg"
                    className="w-full h-auto"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* green */}
        <div
          className="greenSection"
          style={{
            position: "absolute",
            top: 0,
            left: "90vw",
            width: "10vw",
            height: "100%",
            background: "#fb9474",
            zIndex: 3,
          }}
        >
          <div className="flex flex-col h-screen justify-center">
            <div className="h-2/3 flex flex-col md:flex-row gap-8 md:gap-16 ">
              <div
                style={{
                  overflow: "hidden",
                  position: "relative",
                  width: "100%",
                  height: "100%",
                }}
              >
                <div
                  style={{
                    transform: "translateX(-105%)",
                    width: "550px",
                    bottom: 0,
                    left: "10%",
                    paddingRight: "68px",
                  }}
                  className="absolute greenContentText flex flex-col justify-end"
                >
                  <p className="text-[14px] font-helvetica-neue-light md:text-[16px] font-light leading-relaxed mb-8">
                    When you first get braces, your mouth might feel sore, and
                    your teeth may be tender for 3–5 days—kind of like a dull
                    headache. Taking Tylenol or your usual pain reliever can
                    help ease the discomfort. Your lips, cheeks, and tongue
                    might also feel irritated for a week or two as they adjust.
                    No worries—we’ve got you covered with wax to prevent rubbing
                    and irritation. Hang in there—it gets easier!
                  </p>
                  <hr className="border-t border-[#262626] mb-8" />
                  <div className="flex items-center space-x-2">
                    <h3 className="font-helvetica-neue-light text-sm font-medium uppercase tracking-widest mb-0 leading-none">
                      • General Soreness
                    </h3>
                  </div>
                </div>
              </div>
              <div className="absolute right-0 bottom-[6%] flex justify-end">
                <div
                  className="image-wrapper2 rounded-2xl overflow-hidden"
                  style={{
                    width: "150px",
                    height: "auto",
                  }}
                >
                  <img src="../images/orthowax.png" className="w-full h-auto" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* white */}
        <div
          className="whiteSection"
          style={{
            position: "absolute",
            top: 0,
            left: "100vw",
            width: "0vw",
            height: "100%",
            background: "#8AADB2",
            zIndex: 1,
            overflow: "hidden",
          }}
        >
          <div className="flex flex-col h-screen justify-center">
            <div className="h-2/3 flex flex-col md:flex-row gap-8 md:gap-16 ">
              <div
                style={{
                  overflow: "hidden",
                  position: "relative",
                  width: "100%",
                  height: "100%",
                }}
              >
                <div
                  style={{
                    transform: "translateX(-105%)",
                    width: "550px",
                    left: "10%",
                    bottom: 0,
                    paddingRight: "68px",
                  }}
                  className="absolute whiteContentText flex flex-col justify-end"
                >
                  <p className="text-[14px] font-helvetica-neue-light md:text-[16px] font-light text-black leading-relaxed mb-8">
                    Traditionally, patients have been advised to avoid specific
                    foods during braces treatment. Overly aggressive and rapid
                    chewing will break your brackets. Crunchy, chewy, sugary,
                    and acidic foods should be avoided. While this is not a
                    comprehensive list, here is a basic guideline: Dense breads,
                    caramel, gum, soda, lean meats. apples should be sliced and
                    corn on the cob may require precise navigation.
                  </p>
                  <hr className="border-t border-[#262626] mb-8" />
                  <div className="flex items-center space-x-2">
                    <h3 className="font-helvetica-neue-light text-sm font-medium uppercase tracking-widest mb-0 leading-none">
                      • Eating with braces
                    </h3>
                  </div>
                </div>
              </div>
              <div className="absolute right-0 bottom-[6%] flex justify-end">
                <div
                  className="image-wrapper2 rounded-2xl overflow-hidden"
                  style={{
                    width: "150px",
                    height: "auto",
                  }}
                >
                  <img
                    src="../images/purplefloss.jpeg"
                    className="w-full h-auto"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* orange */}
        <div
          className="orangeSection"
          style={{
            position: "absolute",
            top: 0,
            left: "100vw",
            width: "0vw",
            height: "100%",
            background: "#87B0DF",
            zIndex: 1,
            overflow: "hidden",
          }}
        >
          <div className="flex flex-col h-screen justify-center">
            <div className="h-2/3 flex flex-col md:flex-row gap-8 md:gap-16 ">
              <div
                style={{
                  overflow: "hidden",
                  position: "relative",
                  width: "100%",
                  height: "100%",
                }}
              >
                <div
                  style={{
                    transform: "translate(-105%, 0%)",
                    maxWidth: "500px",
                    left: "10%",
                    bottom: 0,
                    paddingRight: "68px",
                  }}
                  className="orangeContentText absolute flex flex-col justify-end"
                >
                  <p className="text-[14px] font-helvetica-neue-light md:text-[16px] font-light text-black leading-relaxed mb-8">
                    If your doctor has prescribed rubber bands it's essential
                    for you to follow the prescription for an ideal result.
                    Failure to follow protocol and frequently breaking brackets
                    will lead to a less than ideal treatment result. You’ll be
                    given a number of different rubber band sizes during
                    treatment—these are determined by the wire size and planned
                    correction. You may accumulate a stockpile of various
                    elastics, but keep in mind that not all elastics are
                    interchangeable for every configuration.
                  </p>
                  <hr className="border-t border-[#262626] mb-8" />
                  <div className="flex items-center space-x-2">
                    <h3 className="font-helvetica-neue-light text-sm font-medium uppercase tracking-widest mb-0 leading-none">
                      • Rubberband wear
                    </h3>
                  </div>
                </div>
              </div>
              <div className="absolute right-0 bottom-[6%] flex justify-end">
                <div
                  className="image-wrapper2 rounded-2xl overflow-hidden"
                  style={{
                    width: "150px",
                    height: "auto",
                  }}
                >
                  <img
                    src="../images/bracesrubberbands.png"
                    className="w-full h-auto"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          className="redSection"
          style={{
            position: "absolute",
            top: 0,
            left: "100vw",
            width: "0vw",
            height: "100%",
            background: "#EAC9E4",
            zIndex: 1,
            overflow: "hidden",
          }}
        >
          <div className="flex flex-col h-screen justify-center">
            <div className="h-2/3 flex flex-col md:flex-row gap-8 md:gap-16 ">
              <div
                style={{
                  overflow: "hidden",
                  position: "relative",
                  width: "100%",
                  height: "100%",
                }}
              >
                <div
                  style={{
                    transform: "translateX(-105%)",
                    maxWidth: "550px",
                    left: "10%",
                    bottom: 0,
                    paddingRight: "68px",
                  }}
                  className="redContentText absolute flex flex-col justify-end"
                >
                  <p className="text-[14px] font-helvetica-neue-light md:text-[16px] font-light text-black leading-relaxed mb-8">
                    Teeth will become loose, and some more than others.The teeth
                    will settle into the bone and soft tissue and mobility will
                    return to physiologic norms at the end of treatment.
                    Brackets will also break. All orthodontic appliances are
                    temporary, breakages are expected and considered when
                    calculating your treatment time and retention. Dental
                    professionals,dental hygenists, and other specialists all
                    have different knowledge bases and motivations pertaining to
                    patient care. It is not unlikely that at some point during
                    treatment you may receive conflicting information. We're on
                    the cutting edge with our office and some people may not
                    comprehend what we're doing. We're always open educating
                    other professionals on our cutting edge treatment plans,
                    however patient care is our prority. Whenever in doubt, you
                    can always circle back with the doctor who treatment planned
                    your case. Trust our process.
                  </p>
                  <hr className="border-t border-[#262626] mb-8" />
                  <div className="flex items-center space-x-2">
                    <h3 className="font-helvetica-neue-light text-sm font-medium uppercase tracking-widest mb-0 leading-none">
                      • Final Considerations
                    </h3>
                  </div>
                </div>
              </div>
              <div className="absolute right-0 bottom-[6%] flex justify-end">
                <div
                  className="image-wrapper2 rounded-2xl overflow-hidden"
                  style={{
                    width: "150px",
                    height: "auto",
                  }}
                >
                  <img
                    src="../images/purplefloss.jpeg"
                    className="w-full h-auto"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
