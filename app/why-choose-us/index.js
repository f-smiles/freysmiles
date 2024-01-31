'use client'
import Link from "next/link"
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/pagination'
import { Mousewheel, Pagination } from 'swiper/modules'
import clsx from "clsx"
import Shape02 from "../_components/shapes/shape02"
import Shape05 from "../_components/shapes/shape05"
import { TextReveal } from "../_components/TextReveal"

export default function WhyChooseUs() {
  return (
    <>
      <HeadingAnimation />
      <TextContentOne />
      <TextContentTwo />
      <AnimateTextScroll />
      <CTA />
    </>
  )
}

function HeadingAnimation() {
  return (
    <div className="w-full h-[100vh] flex flex-col justify-center items-center relative">
      <video autoPlay loop className="absolute inset-0 object-cover object-center w-full h-full -z-10">
        {/* undulating waves */}
        {/* <source src="/../../videos/production_id_4779866.mp4" type="video/mp4" /> */}
        {/* sharp waves */}
        {/* <source src="/../../videos/pexels-rostislav-uzunov-9150545.mp4" type="video/mp4" /> */}
        {/* shutterstock */}
        <source src="/../../videos/shutterstock_1111670177.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 m-4 bg-gray-300 border border-gray-100 rounded-xl -z-10 backdrop-filter bg-clip-padding backdrop-blur-sm bg-opacity-30" />
      <section className="flex flex-col gap-4 mx-auto my-16 text-center md:h-16 md:text-left md:flex-row w-max">
        <h1 className="py-1 text-zinc-800 font-helvetica-now-thin">Experts in</h1> {/* text-[#5f6368] */}
        <div className="h-full overflow-hidden">
          <ul
            style={{
              animation: "scroll-text-up 5s infinite",
            }}
          >
            <li className="text-[#ea4335] py-1">
              <h1 className="font-helvetica-now-thin">Invisalign</h1>
            </li>
            <li className="text-[#4285f4] py-1">
              <h1 className="font-helvetica-now-thin">Damon Braces</h1>
            </li>
            <li className="text-[#34a853] py-1">
              <h1 className="font-helvetica-now-thin">
                Accelerated Orthodontic Treatment
              </h1>
            </li>
            <li className="text-[#fbbc04] py-1">
              <h1 className="font-helvetica-now-thin">
                low-dose 3D Digital Radiographs
              </h1>
            </li>
            <li className="text-[#ea4335] py-1">
              <h1 className="font-helvetica-now-thin">Invisalign</h1>
            </li>
          </ul>
        </div>
      </section>
    </div>
  )
}

function TextContentOne() {
  return (
    <section className="flex flex-col items-center justify-between w-full gap-8 px-8 mx-auto mb-32 md:flex-row md:items-center max-w-7xl">
      <div className="overflow-hidden rounded-full">
        <img
          src="/../../images/freysmilepatient.jpg"
          alt="frey smiles patient"
          className="w-full aspect-square"
        />
      </div>
      <Swiper
        style={{
          width: "100%",
          height: "80vh",
          position: "relative",
          "--swiper-pagination-color": "#ad79e3", // primary-60
        }}
        // loop={true}
        pagination={true}
        mousewheel={true}
        direction={"vertical"}
        modules={[Pagination, Mousewheel]}
        className="mySwiper"
      >
        <SwiperSlide
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <div className="px-8 space-y-4">
            <h3>Uncompromising quality</h3>
            <h4>
              We strive to attain finished results consistent with the{" "}
              <span>American Board of Orthodontics (ABO)</span> qualitative
              standards. Our doctors place great priority on the certification
              and recertification process, ensuring that all diagnostic
              records adhere to ABO standards.
            </h4>
          </div>
        </SwiperSlide>
        <SwiperSlide
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <div className="px-8">
            <h4>
              Currently, Dr. Gregg Frey is a certified orthodontist, and is
              preparing cases for recertification. Dr. Daniel Frey is in the
              final stages of obtaining his initial certification.
            </h4>
          </div>
        </SwiperSlide>
        <SwiperSlide
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: "1rem",
          }}
        >
          <div className="px-8">
            <h4>
              To complement our use of cutting-edge diagnostic technology, we
              uphold the highest standards for our records, ensuring accuracy
              and precision throughout the treatment process.
            </h4>
          </div>
        </SwiperSlide>
      </Swiper>
    </section>
  )
}

function TextContentTwo() {
  return (
    <section className="flex flex-col-reverse items-center justify-between gap-16 px-8 mx-auto my-16 max-w-7xl md:gap-8 md:flex-row">
      <div className="px-4 md:w-1/2">
        <p className="text-2xl">
          Our office holds the distinction of being the{" "}
          <span className="text-4xl text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-violet-500">
            longest-standing, active board-certified orthodontic office in the
            area
          </span>
          . With four offices in the Lehigh Valley, we have been providing
          unparalleled orthodontic care for over four decades.
        </p>
      </div>
      <div className="relative h-full md:w-1/2">
        <Shape02 className="absolute inset-0 m-auto text-white border border-white" />
        <img
          className="object-fill object-center"
          src="/../../images/drfreyperfecting.jpg"
          alt="Dr. Gregg Frey attending a FreySmiles patient"
        />
      </div>
    </section>
  )
}

function AnimateTextScroll() {
  const text = "Frey Smiles believes in providing accessible orthodontic care for everyone. In 2011, they established a non-profit organization called More Than Smiles, which offers orthodontic treatment to deserving individuals who may not have access to world-class orthodontic care or cannot afford it."

  return (
    <section className="w-full px-10 mx-auto max-w-7xl">
      <div className="flex flex-col-reverse md:flex-row md:justify-between">
        <div className="w-full min-h-screen px-8 py-12 md:w-1/2 md:px-0">
          <TextReveal body={text} className="relative mx-auto h-[100vh] w-full max-w-lg">
            {(tokens) => (
              <div className="sticky top-0 left-0 flex items-center h-full text-2xl font-medium leading-tight text-primary-50">
                <div>
                  {tokens.map((token, index) => (
                    <TextReveal.Token key={index} index={index}>
                      {(isActive) => (
                        <span
                          className={clsx(
                            {
                              "opacity-20": !isActive,
                            },
                            "transition",
                          )}>
                          {token}
                        </span>
                      )}
                    </TextReveal.Token>
                  ))}
                </div>
              </div>
            )}
          </TextReveal>
        </div>
        <div className="flex flex-col items-center justify-center w-full md:w-1/2">
          <img
            className="mt-16 rounded-lg"
            src="/../../images/smilescholarship.jpg"
            alt="Frey Smiles patient receiving FreySmile scholarship"
          />
        </div>
      </div>
    </section>
  )
}

function CTA() {
  return (
    <section className="flex flex-col px-12 mx-auto md:flex-row md:justify-between md:gap-8 lg:gap-16 max-w-7xl sm:mb-32">
      <div className="flex flex-col justify-center space-y-8 md:w-1/2">
        <h4>If you know someone who could benefit from this gift, please visit the website for details on how to nominate a candidate.</h4>
        <Link href="https://morethansmiles.org/" className="block px-6 py-2 font-medium bg-indigo-500 text-white w-fit transition-all shadow-[6px_6px_0px_rgb(39,_39,_42)] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px]">Learn More</Link>
      </div>
      <Shape05 className="md:w-1/2" />
    </section>
  )
}

{/* <div className="relative self-center w-full md:w-1/2">
          <img
            className="w-full"
            src="/../../images/smilescholarship.jpg"
            alt="Frey Smiles patient receiving FreySmile scholarship"
          />
          <div className="absolute bottom-0 right-0 w-1/2 -translate-y-1/2 -translate-x-1/3">
            <div className="flex flex-col overflow-hidden shadow-[5px_5px_rgba(0,_98,_90,_0.4),_10px_10px_rgba(0,_98,_90,_0.3),_15px_15px_rgba(0,_98,_90,_0.2),_20px_20px_rgba(0,_98,_90,_0.1),_25px_25px_rgba(0,_98,_90,_0.05)] text-center bg-white p-8">
              <h3 className="font-helvetica-now-thin">Giving Back</h3>
            </div>
          </div>
        </div> */}
