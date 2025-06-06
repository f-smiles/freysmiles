"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const CaringForYourBraces = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    let tl;

    const updateGSAPValues = () => {
      const containerWidth = window.innerWidth;
      const numSections = document.querySelectorAll(".allsections").length;
      const totalScrollDistance = (numSections - 1) * containerWidth;

      const yellowOffset = -containerWidth * 0.64;
      const whiteOffset = -containerWidth * 1.44;
      const orangeOffset = -containerWidth * 2.24;
      const redOffset = -containerWidth * 3.04;
      const blackOffset = -containerWidth * 3.84;
      const imageWidth = containerWidth * 0.33333;
      const yellowImageOffset =
        yellowOffset + containerWidth * 0.77777 - imageWidth - containerWidth * 0.00;
      
      

      
      if (tl) {
        tl.kill();
        ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      }

      // Set initial text content X offsets
      gsap.set(".yellowContentText", { x: yellowOffset });
      gsap.set(".whiteContentText", { x: whiteOffset });
      gsap.set(".orangeContentText", { x: orangeOffset });
      gsap.set(".redContentText", { x: redOffset });
      gsap.set(".blackContentText", { x: blackOffset });

      // Set initial translateX for sections
      gsap.set(".purpleSection", { x: "0vw" });
      gsap.set(".yellowSection", { x: "80vw" });
      gsap.set(".whiteSection", { x: "95vw" });
      gsap.set(".orangeSection", { x: "100vw" });
      gsap.set(".redSection", { x: "100vw" });
      gsap.set(".blackSection", { x: "100vw" });



      tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: `+=${totalScrollDistance}`,
          scrub: 1,
          pin: true,
        },
      });

      // Slide each section using translateX
      tl.to(".yellowSection", { x: "0vw", duration: .8, ease: "none" }, 0);
      tl.to(".whiteSection", { x: "80vw", duration: 1, ease: "none" }, 0);
      tl.to(".orangeSection", { x: "95vw", duration: 1, ease: "none" }, 0);
      tl.to(".redSection", { x: "100vw", duration: 1, ease: "none" }, 0);
      tl.to(".blackSection", { x: "100vw", duration: 1, ease: "none" }, 0);

      tl.to(".whiteSection", { x: "0vw", duration: 1, ease: "none" }, 1);
      tl.to(".orangeSection", { x: "80vw", duration: 1, ease: "none" }, 1);
      tl.to(".redSection", { x: "95vw", duration: 1, ease: "none" }, 1);
      tl.to(".blackSection", { x: "100vw", duration: 1, ease: "none" }, 1);

      tl.to(".orangeSection", { x: "0vw", duration: 1, ease: "none" }, 2);
      tl.to(".redSection", { x: "80vw", duration: 1, ease: "none" }, 2);
      tl.to(".blackSection", { x: "95vw", duration: 1, ease: "none" }, 2);

      tl.to(".redSection", { x: "0vw", duration: 1, ease: "none" }, 3);
      tl.to(".blackSection", { x: "80vw", duration: 1, ease: "none" }, 3);

      tl.to(".blackSection", { x: "0vw", duration: 1, ease: "none" }, 4);

      // Reveal content text
      tl.to(".yellowContentText", { x: "0%", duration: 0.64, ease: "none" }, 0.16);
      tl.to(".whiteContentText", { x: "0%", duration: 1.8, ease: "none" }, 0.2);
      tl.to(
        ".orangeContentText",
        { x: "0%", duration: 2.8, ease: "none" },
        0.2
      );
      tl.to(".redContentText", { x: "0%", duration: 3.8, ease: "none" }, 0.2);
      tl.to(".blackContentText", { x: "0%", duration: 4.8, ease: "none" }, 0.2);

      setTimeout(() => {
        ScrollTrigger.refresh();
      }, 100);
    };

    const ctx = gsap.context(() => {
      updateGSAPValues();
    }, containerRef);

    updateGSAPValues();
    window.addEventListener("resize", updateGSAPValues);

    return () => {
      window.removeEventListener("resize", updateGSAPValues);
      ctx.revert();
    };
}, []);



  return (
    <div ref={containerRef} className="min-h-screen ">

<div
  style={{
    position: "fixed",
    top: "20vh",
    right: "25vw",
    zIndex: 10,
    pointerEvents: "none",
    width: "300px",
    height: "400px",
    overflow: "hidden", 
  }}
>
  <div
    className="relative border-4 border-red-400 w-[300px] h-[400px]"
  >
 {[
    "/images/stayontrack.png",
    // "/images/handholdingtoothbrush.jpg",
    // "/images/dentalwax3.png",
    // "/images/soda3.png",
    // "/images/rubberbands2.png"
  ].map((src, i) => (
    <img
      key={i}
      src={src}
      className={`slide-image absolute inset-0 w-full h-full object-cover ${i === 0 ? 'z-10' : 'z-0'}`}
      data-index={i}
    
    />
  ))}
  </div>
</div>



          <div
            style={{
              fontFamily: "NeueMontrealBook",
              height: "100%",
              position: "relative",
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
              className="purpleSection allsections"
            >
              <div>
                <div
                  className="purpleInner"
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "flex-start",
                    paddingLeft: "10rem",
                    paddingTop: "0vh",
                  }}
                >
                  <div
                    className="contentText"
                    style={{
                      marginTop: "18.25rem",
                      overflow: "hidden",
                      width: "475px",
                    }}
                  >
                    <div className="flex flex-row gap-4">
                      <button className="font-neueroman flex items-center justify-between text-[12px] uppercase">
                        <span className="mr-4 w-1.5 h-1.5 bg-black rounded-full"></span>
                        Treatment Duration
                      </button>
                    </div>{" "}
                    <p className="font-neueroman uppercase mt-10 text-[13px] leading-[1.5]">
                      Your treatment time will depend on your customized plan
                      and how closely you follow our team’s instructions. Most
                      Frey Smiles patients see their ideal smile in just 12 to
                      20 months with the right guidance along the way. When
                      you’re ready to begin, schedule a consultation, and we’ll
                      handle the rest.
                    </p>
                  </div>
                  {/* <div className="purpleImageWrapper">
                    <div
              className="purpleImageInnerContainer"
              
                    >
                      <img
                        src="../images/stayontrack.png"
                        alt="portal"
                        style={{
                          width: "100%",
                          height: "auto",
                          objectFit: "contain",
                        }}
                      />

                      <div
                        style={{
                          position: "absolute",
                          top: "70%",
                          left: "50%",
                          transform: "translate(-50%, -50%)",
                          textAlign: "center",
                          pointerEvents: "none",
                          display: "flex",
                          gap: "20px",
                          fontFamily: "NeueHaasRoman",
                        }}
                      >
                        <h1 id="effect">STAY ON TRACK</h1>
                      </div>
                    </div>
                  </div> */}
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
              className="yellowSection allsections"
            >
              <div
                style={{
                  display: "flex",
                  overflow: "hidden",
                  alignItems: "flex-start",
                  justifyContent: "flex-start",
                  paddingLeft: "10rem",
                  paddingTop: "0vh",
                }}
              >
                <div
                  className="yellowContentText"
                  style={{
                    marginTop: "18.25rem",
                    overflow: "hidden",
                    width: "475px",
                  }}
                >
                  <div className="flex flex-row gap-4">
                    <button className="font-neueroman flex items-center justify-between text-[12px] uppercase">
                      <span className="mr-4 w-1.5 h-1.5 uppercase bg-black rounded-full"></span>
                      Brushing & Flossing
                    </button>
                  </div>{" "}
                  <p className="font-neueroman uppercase mt-10 text-[13px] leading-[1.5]">
                    Brushing and flossing during orthodontic treatment is as
                    important as ever. all orthodontic appliances like clear
                    aligners, brackets, and wires interfere with the mouth's
                    normal self-cleansing mechanisms. Research shows only 10% of
                    patients brush and floss consistently during active
                    treatment. We recommend three cleanings a year for braces
                    patients; check if your insurance covers the third. When you
                    begin treatment, we'll equip you with tools such as spare
                    toothbrushes and dental floss to help with cleaning.
                  </p>
                  <div className="flex items-center space-x-2"></div>
                </div>
                {/* <div className="yellowImageWrapper">
  <div className="image-inner">
    <img
      src="../images/handholdingtoothbrush.jpg"
      alt="brushing"
      style={{
        width: "100%",
        height: "auto",
        objectFit: "cover",
      }}
    />
  </div>
</div> */}

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
              className="whiteSection allsections"
            >
              <div
                style={{
                  display: "flex",
                  overflow: "hidden",
                  alignItems: "flex-start",
                  justifyContent: "flex-start",
                  paddingLeft: "10rem",
                  paddingTop: "0vh",
                }}
              >
                <div
                  className="whiteContentText"
                  style={{
                    marginTop: "18.25rem",
                    overflow: "hidden",
                    width: "475px",
                  }}
                >
                  <div className="flex flex-row gap-4">
                    <button className="font-neueroman flex items-center justify-between text-[12px] uppercase">
                      <span className="mr-4 w-1.5 h-1.5 uppercase bg-black rounded-full"></span>
                      General Soreness
                    </button>
                  </div>
                  <div className="font-neueroman uppercase mt-10 text-[13px] leading-[1.5]">
                    When you first get braces, your mouth might feel sore, and
                    your teeth may be tender for 3–5 days—kind of like a dull
                    headache. Taking Tylenol or your usual pain reliever can
                    help ease the discomfort. Your lips, cheeks, and tongue
                    might also feel irritated for a week or two as they adjust.
                    No worries—we’ve got you covered with wax to prevent rubbing
                    and irritation. Hang in there—it gets easier!
                  </div>
                </div>
                {/* <div className="whiteImageWrapper">
  <div className="image-inner">
    <img
      src="../images/dentalwax3.png"
      alt="dental wax"
      style={{
        width: "100%",
        height: "auto",
        objectFit: "contain",
      }}
    />
  </div>
</div> */}

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
              className="orangeSection allsections"
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "flex-start",
                  paddingLeft: "10rem",
                  paddingTop: "0vh",
                }}
              >
                <div
                  className="orangeContentText"
                  style={{
                    width: "475px",
                    marginTop: "18.25rem",
                    overflow: "hidden",
                  }}
                >
                  <div className="flex flex-row gap-4">
                    <button className="font-neueroman flex items-center justify-between text-[12px] uppercase">
                      <span className="mr-4 w-1.5 h-1.5 uppercase bg-black rounded-full"></span>
                      Eating with braces
                    </button>
                  </div>
                  <div className="font-neueroman uppercase mt-10 text-[13px] leading-[1.5]">
                    Traditionally, patients have been advised to avoid certain
                    foods during braces treatment, as aggressive or rapid
                    chewing can break brackets. Crunchy, chewy, sugary, and
                    acidic foods should be avoided. While this is not a
                    comprehensive list, some examples include dense breads,
                    caramel, gum, soda, and lean meats. Apples should be sliced,
                    and corn on the cob may require careful navigation.
                  </div>
                </div>
                {/* <div className="orangeImageWrapper">
                   <div
              className="orangeImageInnerContainer"
             
                    >
                  <img
                    src="../images/soda3.png"
                    alt="portal"
                    style={{
                      width: "100%",
                      height: "auto",
                      objectFit: "contain",
                    }}
                  />
                </div>
</div> */}
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
              className=" redSection allsections"
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "flex-start",
                  paddingLeft: "10rem",
                  paddingTop: "0vh",
                }}
              >
                <div
                  className="redContentText"
                  style={{
                    width: "475px",
                    marginTop: "18.25rem",
                    overflow: "hidden",
                  }}
                >
                  <div className="flex flex-row gap-4">
                    <button className="font-neueroman flex items-center justify-between text-[12px] uppercase">
                      <span className="mr-4 w-1.5 h-1.5 uppercase bg-black rounded-full"></span>
                      Rubberband wear
                    </button>
                  </div>
                  <div className="font-neueroman uppercase mt-10 text-[13px] leading-[1.5]">
                    If your doctor has prescribed rubber bands, it’s essential
                    to follow the prescription for the best results. Not wearing
                    them as directed or frequently breaking brackets can affect
                    your treatment outcome. During treatment, you’ll receive
                    different rubber band sizes based on wire size and planned
                    corrections. While you may accumulate various elastics, keep
                    in mind that not all are interchangeable for every
                    configuration.
                  </div>
                </div>
                {/* <div className="redImageWrapper">
                <div
              className="redImageInnerContainer"
         
                    >
               
                </div>
</div> */}
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
              className=" blackSection allsections"
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "flex-start",
                  paddingLeft: "10rem",
                  paddingTop: "0vh",
                }}
              >
                <div
                  className="blackContentText"
                  style={{
                    width: "475px",
                    marginTop: "18.25rem",
                    overflow: "hidden",
                  }}
                >
                  <div className="flex flex-row gap-4">
                    <button className="font-neueroman flex items-center justify-between text-[12px] uppercase">
                      <span className="mr-4 w-1.5 h-1.5 uppercase bg-black rounded-full"></span>
                      Final Considerations
                    </button>
                  </div>
                  <div className="font-neueroman uppercase mt-10 text-[13px] leading-[1.5]">
                    Teeth will become loose, and some more than others. The
                    teeth will settle into the bone and soft tissue, and
                    mobility will return to physiologic norms at the end of
                    treatment. Brackets and other orthodontic appliances are
                    temporary, and occasional breakages are expected. These are
                    factored into your treatment time and retention plan. During
                    your treatment, you may encounter dental professionals,
                    hygienists, or specialists with different perspectives on
                    care. Our office uses advanced techniques that some may not
                    fully understand. While we're always open to discussing our
                    approach with other professionals, patient care remains our
                    priority. If you're ever unsure, you can always circle back
                    with the doctor who planned your treatment. Trust the
                    process—we're here to guide you.
                  </div>
                </div>
                <div className="blackSectionImage">
                <div
              // className="imageInnerContainer"
         
              >
                  {/* <video
                    src="https://video.wixstatic.com/video/11062b_163d7539f7824eb895994a6460f0995b/720p/mp4/file.mp4"
                    className="object-cover w-full h-full"
                    autoPlay
                    loop
                    muted
                    playsInline
                  >
                    
                  </video> */}
                </div>
                </div>
              </div>
            </div>
          </div>
  

    </div>
  );
};

export default CaringForYourBraces;
