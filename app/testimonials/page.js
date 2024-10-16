'use client';

import { useEffect } from "react";
import { gsap } from "gsap-trial";
import { ScrollTrigger } from "gsap-trial/ScrollTrigger";
import { ScrollSmoother } from "gsap-trial/ScrollSmoother";
import { Flip } from "gsap-trial/Flip";

gsap.registerPlugin(ScrollTrigger, ScrollSmoother, Flip);

export default function Home() {
  useEffect(() => {
    const smoother = ScrollSmoother.create({
      smooth: 2,
      effects: true,
      normalizeScroll: true,
    });

    const animateHeader = () => {
      gsap.fromTo(
        "#logo",
        { scale: 10, y: "80vh" },
        {
          scale: 1,
          y: 0,
          scrollTrigger: {
            trigger: "#smooth-wrapper",
            start: "top top",
            end: "bottom top",
            scrub: true,
            markers: true,
          },
        }
      );
    };

    const animateSection = () => {
      let timeline = gsap.timeline({
        scrollTrigger: {
          trigger: "#section-2",
          start: "top top",
          end: "+=200%",
          scrub: true,
          pin: true,
        },
      });

      const updateImgContainerState = () => {
        const gridImagesState = Flip.getState(".grid-image");
        const imgContainer = document.querySelector("#img-container");
        imgContainer?.classList.remove("images-initial-grid");
        imgContainer?.classList.add("images-after-grid");
        Flip.from(gridImagesState, { duration: 2, ease: "power1.inOut" });
      };

      timeline
        .from("#section-2-heading", { opacity: 0, duration: 1 })
        .from("#image-1", { y: window.innerHeight, opacity: 1 }, ">")
        .from("#image-2", { y: window.innerHeight, opacity: 1 }, ">")
        .from("#image-3", {
          y: window.innerHeight,
          opacity: 1,
          onComplete: updateImgContainerState,
        });
    };

    animateHeader();
    animateSection();

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);
  return (
    <>

      <div id="smooth-wrapper" className="w-full">
      <header className="flex flex-row w-full py-8 justify-center items-center fixed top-0 left-0 bg-slate-950 z-10">
        <div className="flex items-center justify-center max-w-6xl w-full">
          <a href="/" className="text-3xl text-slate-50" id="logo">
            Logo
          </a>
        </div>
      </header>
        <main id="smooth-content">
          {/* First Section */}
          <section className="h-[100vh] w-full grid place-items-center bg-slate-950"></section>

          {/* Second Section with images and heading */}
          <section
            id="section-2"
            className="h-[100vh] w-full grid place-items-center bg-slate-900"
            aria-labelledby="section-2-heading"
          >
            <div
              id="img-container"
              className="images-initial-grid"
              style={{
                display: "grid",
                placeItems: "center",
                gridTemplateColumns: "1fr", 
              }}
            >
              <a
                id="image-1"
                href="https://www.google.com"
                className="grid-image block w-full aspect-square max-w-[400px]"
                style={{
                  gridColumn: "1 / 2", 
                  gridRow: "1 / 2", 
                }}
              >
                <img
                  src="https://a.storyblok.com/f/187090/800x801/ac1f2976aa/package-starter.jpg/m/"
                  alt="Image 1"
                  className="w-full h-full object-cover"
                />
              </a>

              <a
                id="image-2"
                href="https://www.google.com"
                className="grid-image block w-full aspect-square max-w-[400px]"
                style={{
                  gridColumn: "1 / 2", 
                  gridRow: "1 / 2", 
                }}
              >
                <img
                  src="https://a.storyblok.com/f/187090/500x501/32480d7ad2/process-analysis.jpg/m/"
                  alt="Image 2"
                  className="w-full h-full object-cover"
                />
              </a>

              <a
                id="image-3"
                href="https://www.google.com"
                className="grid-image block w-full aspect-square max-w-[400px]"
                style={{
                  gridColumn: "1 / 2", 
                  gridRow: "1 / 2", 
                }}
              >
                <img
                  src="https://a.storyblok.com/f/187090/501x501/44fb6f9a2f/process-development.jpg/m/"
                  alt="Image 3"
                  className="w-full h-full object-cover"
                />
              </a>
            </div>

            <h1
              id="section-2-heading"
              className="text-5xl font-sans font-bold text-slate-50 max-w-[32rem] text-center share-grid"
              style={{
                gridRow: "1 / 2", 
                gridColumn: "1 / 2",
              }}
            >
              How do we know we are who we say we are?
            </h1>
          </section>

          {/* Third Section */}
          <section className="h-screen w-full grid place-items-center bg-yellow-100">
            <h1 className="text-5xl font-sans font-bold">Eh? World</h1>
          </section>
        </main>
      </div>
    </>
  );
}
