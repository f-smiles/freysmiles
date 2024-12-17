'use client'
import gsap from "gsap"
import { useGSAP } from "@gsap/react"

if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP)
}

export default function EarlyAdultOrthodontics() {
  return (
    <>
      <EarlyOrthoGrid />
      <AdultOrthoGrid />
    </>
  );
}

function EarlyOrthoGrid() {
  {
    /*
    --beige: #f8f1de;
    --black: #171616;
    --orange: #ff6432; hsl(14 100% 52%)
    --white: white;
    --rosemary: #147b5d;
    --rosemary-text: #fee5e1;
  */
  }

  useGSAP(() => {
    const isTouchDevice = 'ontouchstart' in window

    let targetMedias = gsap.utils.toArray('.media')

    const parallaxMouse = () => {
      document.addEventListener('mousemove', (e) => {
        targetMedias.forEach((targetMedia, i) => {
          const deltaX = (e.clientX - window.innerWidth / 2) * 0.01
          const deltaY = (e.clientY - window.innerHeight / 2) * 0.01

          gsap.to(targetMedia, {
            x: deltaX,
            y: deltaY,
            scale: 1.02,
            duration: 0.75,
            ease: "power4",
          })
        })
      })

      document.addEventListener('mouseleave', (e) => {
        targetMedias.forEach((targetMedia) => {
          gsap.to(targetMedia, {
            x: 0,
            y: 0,
            scale: 1.02,
            duration: 0.75,
            ease: "power4",
          })
        })
      })
    }

    if (!isTouchDevice) {
      parallaxMouse()
    }
  })

  return (
    <section>
      <div className="grid grid-cols-8 h-[60dvh]">
        <div className="col-span-4 lg:col-span-5 h-full place-content-center place-items-center bg-[#fcf5e5] text-center flex gap-2 p-8">
          <h2 className="text-2xl break-words lg:text-4xl xl:text-6xl font-editorial-new">
            <span
              className="text-4xl lg:text-6xl xl:text-8xl font-nautica"
              style={{
                color: "#171616",
                WebkitTextFillColor: "#fcf5e5",
                WebkitTextStroke: "1px #171616",
              }}
            >
              E
            </span>
            arly{" "}
            <span
              className="text-4xl lg:text-6xl xl:text-8xl font-nautica"
              style={{
                color: "#171616",
                WebkitTextFillColor: "#fcf5e5",
                WebkitTextStroke: "1px #171616",
              }}
            >
              I
            </span>
            nterceptive{" "}
            <span
              className="text-4xl lg:text-6xl xl:text-8xl font-nautica"
              style={{
                color: "#171616",
                WebkitTextFillColor: "#fcf5e5",
                WebkitTextStroke: "1px #171616",
              }}
            >
              O
            </span>
            rthodontics{" "}
          </h2>
        </div>
        <div className="relative h-full col-span-4 overflow-hidden lg:col-span-3">
          <video
            autoPlay
            loop
            muted
            preload="true"
            className="absolute inset-0 object-cover object-center w-full h-full media"
          >
            <source src="/../../videos/boyholdingaligner.mp4" type="video/mp4" />
          </video>
        </div>
      </div>
      <div className="grid grid-cols-9 lg:h-[50vh]">
        <div className="min-h-[50vh] h-full col-span-9 bg-[#6a7265] text-[#fef9f0] lg:col-span-3 place-content-center place-items-center p-8">
          <p className="text-2xl tracking-wide text-center font-editorial-new">
            Our guidance visits are{" "}
            <span className="block uppercase font-agrandir-grandheavy">
              free of charge
            </span>
          </p>
        </div>
        <div className="relative min-h-[50vh] h-full col-span-9 lg:col-span-3 place-content-center overflow-hidden">
          <img
            src="/../../images/IMG_0321-scaled.jpg"
            className="absolute inset-0 object-cover object-center w-full media h-ful"
          />
        </div>
        <div className="min-h-[50vh] h-full col-span-9 bg-[#6a7265] text-[#fef9f0] lg:col-span-3 place-content-center place-items-center p-8">
          <p className="text-2xl leading-tight tracking-wide text-center font-editorial-new">
            <span className="font-agrandir-bold">
              American Association of Orthodontics{" "}
            </span>{" "}
            recommends screening starting at{" "}
            <span className="uppercase font-agrandir-grandheavy"> age 7</span>
          </p>
        </div>
      </div>
    </section>
  );
}

function AdultOrthoGrid() {
  return (
    <section>
      <div className="grid grid-cols-8 h-[60dvh]">
        <div className="col-span-4 lg:col-span-5 h-full place-content-center place-items-center bg-[#fcf5e5] text-center flex gap-2 p-8">
          <h2 className="text-2xl break-words lg:text-4xl xl:text-6xl font-editorial-new">
            <span
              className="text-4xl lg:text-6xl xl:text-8xl font-nautica"
              style={{
                color: "#171616",
                WebkitTextFillColor: "#fcf5e5",
                WebkitTextStroke: "1px #171616",
              }}
            >
              A
            </span>
            dult{" "}
            <span
              className="text-4xl lg:text-6xl xl:text-8xl font-nautica"
              style={{
                color: "#171616",
                WebkitTextFillColor: "#fcf5e5",
                WebkitTextStroke: "1px #171616",
              }}
            >
              O
            </span>
            rthodontics
          </h2>
        </div>
        <div className="relative h-full col-span-4 overflow-hidden lg:col-span-3">
          <video
            autoPlay
            loop
            muted
            preload="true"
            className="absolute inset-0 object-cover object-center w-full h-full media"
          >
            <source src="/../../videos/boyholdingaligner.mp4" type="video/mp4" />
          </video>
        </div>
      </div>
      <div className="grid grid-cols-9 lg:h-[50vh]">
        <div className="min-h-[50vh] h-full col-span-9 bg-[#988193] text-[#f4f4f4] lg:col-span-3 place-content-center place-items-center p-8">
          <p className="text-2xl tracking-wide text-center font-editorial-new">
            Average treatment time{" "}
            <span className="block uppercase font-agrandir-grandheavy">
              12 to 16 months
            </span>
          </p>
        </div>
        <div className="relative min-h-[50vh] h-full col-span-9 lg:col-span-3 place-content-center overflow-hidden">
          <video
            autoPlay
            loop
            muted
            preload="true"
            className="absolute inset-0 object-cover object-center w-full h-full media"
          >
            <source
              src="/../../videos/invisalign_glow_up_crop_1440x1440_4k60fps.mp4"
              type="video/mp4"
            />
          </video>
        </div>
        <div className="min-h-[50vh] h-full col-span-9 bg-[#988193] text-[#f4f4f4] lg:col-span-3 place-content-center place-items-center p-8">
          <p className="text-2xl leading-tight tracking-wide text-center font-editorial-new">
            <span className="font-agrandir-bold">
              Experience a beautiful smile{" "}
            </span>
            without goopy gagging impressions thanks to
            <span className="font-agrandir-bold"> iTero's digital scanner</span>
          </p>
        </div>
      </div>
      <div className="grid grid-cols-9 lg:h-[50vh]">
        <div className="relative min-h-[50vh] h-full col-span-9 lg:col-span-3 place-content-center overflow-hidden">
          <video
            autoPlay
            loop
            muted
            preload="true"
            className="absolute inset-0 object-cover object-center w-full h-full media"
          >
            <source
              src="/../../videos/pexels-polina-kovaleva-7089151.mp4"
              type="video/mp4"
            />
          </video>
        </div>
        <div className="min-h-[50vh] h-full col-span-9 bg-[#988193] text-[#f4f4f4] lg:col-span-3 place-content-center place-items-center p-8">
          <p className="text-2xl tracking-wide text-center font-editorial-new">
            Improving your smile with braces is{" "}
            <span className="block uppercase font-agrandir-grandheavy">
              faster, more comfortable, and more discreet
            </span>{" "}
            than ever before
          </p>
        </div>
        <div className="relative min-h-[50vh] h-full col-span-9 lg:col-span-3 place-content-center overflow-hidden">
          <video
            autoPlay
            loop
            muted
            preload="true"
            className="absolute inset-0 object-cover object-center w-full h-full media"
          >
            <source
              src="/../../videos/pexels-polina-kovaleva-7089151.mp4"
              type="video/mp4"
            />
          </video>
        </div>
      </div>
    </section>
  );
}