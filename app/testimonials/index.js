'use client';
import { useEffect } from "react";
import { gsap } from "gsap-trial";
import { ScrollTrigger } from "gsap-trial/ScrollTrigger";
import { Flip } from "gsap-trial/Flip";

gsap.registerPlugin(ScrollTrigger, Flip);

export default function Home() {
  useEffect(() => {
    const animateHeader = () => {
      gsap.fromTo(
        "#testimonials",
        { scale: 10, y: "80vh" },
        {
          scale: 1,
          y: 0,
          scrollTrigger: {
            trigger: "#smooth-wrapper",
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        }
      );
    };
    animateHeader();

    const animateSection = () => {
        let timeline = gsap.timeline({
          scrollTrigger: {
            trigger: "#section-2",
            start: "top top",
            end: "+=100%",
            scrub: true,
            pin: true,
          },
        });
      
        const updateImgContainerState = () => {
          const gridImagesState = Flip.getState(".grid-image");
          const imgContainer = document.querySelector("#img-container");
          
          imgContainer?.style.setProperty('min-height', '100vh');
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
      
      
      animateSection();

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  useEffect(() => {
    gsap.fromTo(
      ".logo",
      { y: "50vh", scale: 6, yPercent: -50 },
      {
        y: 0,
        scale: 1,
        scrollTrigger: {
          trigger: ".content",
          start: "top bottom",
          end: "top center",
          scrub: true,
        }
      }
    );
  }, []);
  return (
    <div style={{ margin: 0, padding: 0, boxSizing: 'border-box' }}>
    <div
      className="logo__container"
      style={{
        position: 'fixed',
        top: 40,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 1000,
      }}
    >
      <h1 className="logo" style={{
        margin: 0,
        padding: '1em',
        fontFamily: 'NeueMontrealMedium',
        fontWeight: 400,
        textTransform: 'uppercase',
        letterSpacing: '-2px',
        color: '#000',
        background: 'none', 
      }}>
        REVIEWS
      </h1>
    </div>

    <div
      className="container"
      style={{
        width: '100%',
        height: '100vh',
        backgroundColor: '#fff',
        margin: 0,
        padding: 0,
        boxSizing: 'border-box',
      }}
    ></div>

    <div
      className="content"
      style={{
        position: 'relative',
        padding: '0 4em',
        width: '100%',
        height: '100vh',
        backgroundColor: '#fff',
        boxSizing: 'border-box',
      }}
    >
      <img
        src="https://images.unsplash.com/photo-1722185128411-456d36207767?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        alt=""
        style={{
          marginBottom: '4em',
          width: '100%',
        }}
      />
    </div>
  </div>
  
  );
}


{/* <div>
      <header className="flex flex-row w-full py-8 justify-center items-center fixed top-0 left-0 bg-slate-950 z-10">
        <div className="flex items-center justify-center max-w-6xl w-full">
          <a href="/" className="text-3xl text-slate-50" id="testimonials">
            Testimonials
          </a>
        </div>
      </header>

      <div id="smooth-wrapper" className="w-full">
        <main id="smooth-content">

          <section className="h-[100vh] w-full grid place-items-center bg-slate-950"></section>

    
          <section
            id="section-2"
            className="h-[100vh] w-full grid place-items-center bg-slate-900"
            aria-labelledby="section-2-heading"
          >
            <div
              id="img-container"
              className="share-grid gap-4 w-full h-full justify-center images-grid images-initial-grid"
            >
              <a
                id="image-1"
                href="https://www.google.com"
                className="grid-image block w-full aspect-square max-w-[400px]"
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
            >
              How do we know we are who we say we are?
            </h1>
          </section>

       
          <section className="h-screen w-full grid place-items-center bg-yellow-100">
            <h1 className="text-5xl font-sans font-bold">Eh? World</h1>
          </section>
        </main>
      </div>
    </div> */}