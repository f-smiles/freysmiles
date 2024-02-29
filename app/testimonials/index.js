"use client";
import { useEffect, useRef } from "react";

import {
  motion,
  stagger,
  useAnimate,
  useInView,
  useScroll,
  useTransform,
} from "framer-motion";

const featuredTestimonial = {
  body: "Who says an adult can't dream? I've always wanted a perfect smile. Thanks to FreySmiles my dream has come true.",
  author: {
    name: "Ron Lucien",
    treatment: "Invisalign",
    imageUrl: "/../../images/testimonials/Ron_Lucien.png",
  },
};

const testimonials = [
  [
    [
      {
        body: "FreySmiles is the best. I can't stop smiling thanks to Dr. Frey and his amazing team!",
        author: {
          name: "Brooke Walker",
          treatment: "Braces",
          imageUrl: "/../../../images/testimonials/Brooke_Walker.png",
        },
      },
      {
        body: "A thousand thanks to Dr. Frey and his wonderful team. Now I smile with confidence! FreySmiles delivers the best smiles!",
        author: {
          name: "Sophia Lee",
          treatment: "Braces",
          imageUrl: "/../../../images/testimonials/Sophia_Lee.png",
        },
      },
      {
        body: "I enjoyed how patient and kind Dr. Frey and his team were throughout my treatment. I love feeling confident with my smile!",
        author: {
          name: "Natasha Khela",
          treatment: "Invisalign",
          imageUrl: "/../../../images/testimonials/Natasha_Khela.png",
        },
      },
      // More testimonials...
    ],
    [
      {
        body: "Thank you to Dr. Frey and the outstanding team for giving me a beautiful smile!",
        author: {
          name: "Maria Anagnostou",
          treatment: "Braces",
          imageUrl: "/../../../images/testimonials/Maria_Anagnostou.png",
        },
      },
      {
        body: "FreySmiles is the best! I'm so happy with my smile and the confidence it's brought me!",
        author: {
          name: "Lainie Walker",
          treatment: "Braces",
          imageUrl: "/../../../images/testimonials/Lainie_Walker.png",
        },
      },
      // More testimonials...
    ],
  ],
  [
    [
      {
        body: "Thanks to the team at FreySmiles, I am able to smile with confidence.",
        author: {
          name: "James Cipolla",
          treatment: "Braces",
          imageUrl: "/../../../images/testimonials/James_Cipolla.png",
        },
      },
      {
        body: "As an adult patient, FreySmiles made my experience with braces a first class trip! Now I have a first class smile too.",
        author: {
          name: "Erica Brooks",
          treatment: "Braces",
          imageUrl: "/../../../images/testimonials/Erica_Brooks.png",
        },
      },
      // More testimonials...
    ],
    [
      {
        body: "I'm so happy with the results of my Invisalign treatment and the confidence my FreySmile has given me.",
        author: {
          name: "Ibis Subero",
          treatment: "Invisalign",
          imageUrl: "/../../../images/testimonials/Ibis_Subero.png",
        },
      },
      {
        body: "I'm grateful to the team at Freysmiles for making my smile so beautiful.",
        author: {
          name: "Paige Mckenna",
          treatment: "Braces",
          imageUrl: "/../../../images/testimonials/Paige_Mckenna.png",
        },
      },
      {
        body: "A big thank you to Dr. Frey and his team for perfecting my teeth. I receive compliments on my radiant smile every day.",
        author: {
          name: "Devika Knafo",
          treatment: "Braces",
          imageUrl: "/../../../images/testimonials/Devika_Knafo.png",
        },
      },
      // More testimonials...
    ],
  ],
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Testimonials() {
  const fadeInOnScroll = {
    initial: {
      y: 100,
      opacity: 0,
    },
    animate: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        bounce: 0.2,
        duration: 0.8,
      },
    },
  };

  return (
    <>

{/* <svg class="svg-blob" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1400 650">
    <path fill="#0F9381" fill-opacity=".9" d="M0,64L20,106.7C40,149,80,235,120,256C160,277,200,235,240,229.3C280,224,320,256,360,240C400,224,440,160,480,112C520,64,560,32,600,48C640,64,680,128,720,128C760,128,800,64,840,48C880,32,920,64,960,96C1000,128,1040,160,1080,165.3C1120,171,1160,149,1200,128C1240,107,1280,85,1320,74.7C1360,64,1400,64,1420,64L1440,64L1440,0L1420,0C1400,0,1360,0,1320,0C1280,0,1240,0,1200,0C1160,0,1120,0,1080,0C1040,0,1000,0,960,0C920,0,880,0,840,0C800,0,760,0,720,0C680,0,640,0,600,0C560,0,520,0,480,0C440,0,400,0,360,0C320,0,280,0,240,0C200,0,160,0,120,0C80,0,40,0,20,0L0,0Z"></path>
</svg> */}

<div className="-mt-80">
<svg class="svg-blob2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1400 650">
    <path fill="#0F9381" fill-opacity=".9" d="M0,128L20,160C40,192,80,256,120,245.3C160,235,200,149,240,117.3C280,85,320,107,360,106.7C400,107,440,85,480,101.3C520,117,560,171,600,181.3C640,192,680,160,720,176C760,192,800,256,840,282.7C880,309,920,299,960,288C1000,277,1040,267,1080,245.3C1120,224,1160,192,1200,186.7C1240,181,1280,203,1320,192C1360,181,1400,139,1420,117.3L1440,96L1440,320L1420,320C1400,320,1360,320,1320,320C1280,320,1240,320,1200,320C1160,320,1120,320,1080,320C1040,320,1000,320,960,320C920,320,880,320,840,320C800,320,760,320,720,320C680,320,640,320,600,320C560,320,520,320,480,320C440,320,400,320,360,320C320,320,280,320,240,320C200,320,160,320,120,320C80,320,40,320,20,320L0,320Z"></path>
</svg>
</div>
<section className="w-full">
      <div className="MainContainer">
      <div className="font-cera-bold ParallaxContainer">
        <section
          className="heroTestimonial"
          style={{
            position: "relative",
            zIndex: 1,
            overflow: "hidden",
            width: "100%",
            height: "135vh",
            textAlign: "center",
            backgroundColor: "#fffff",
       
          }}
        >
          <div
            className="groupTestimonial"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "space-evenly",
              width: "112vw",
              minHeight: "100vh",
              overflow: "hidden",
              transform: "rotate(-15deg) translateX(-60px)",
              transformOrigin: "center center",
            }}
          >
            <div
              className="row"
              style={{
                width: "260vw",
                display: "flex",
                flexDirection: "row",
                alignItems: "flex-start",
                justifyContent: "space-around",
                transform: "translate3d(25%, 0, 0)",
                whiteSpace: "nowrap",
                WebkitAnimationIterationCount: "infinite",
                animationIterationCount: "infinite",
                WebkitAnimationTimingFunction: "linear",
                animationTimingFunction: "linear",
                WebkitAnimationName: "marqueeTestimonial",
                animationName: "marqueeTestimonial",
                WebkitAnimationDuration: "30s",
                animationDuration: "30s",
              }}
            >
              <span>Why</span>
              <span>Our</span>
              <span>Patients</span>
              <span>Love</span>
              <span>Us</span>
              <span>Why</span>
              <span>Our</span>
              <span>Patients</span>
            </div>
            <div
              className="row"
              style={{
                width: "280vw",
                display: "flex",
                flexDirection: "row",
                alignItems: "flex-start",
                justifyContent: "space-around",
                transform: "translate3d(25%, 0, 0)",
                whiteSpace: "nowrap",
                WebkitAnimationIterationCount: "infinite",
                animationIterationCount: "infinite",
                WebkitAnimationTimingFunction: "linear",
                animationTimingFunction: "linear",
                WebkitAnimationName: "marqueeTestimonial",
                animationName: "marqueeTestimonial",
                WebkitAnimationDuration: "30s",
                animationDuration: "30s",
                animationDirection: "reverse",
              }}
            >
              <span style={{ fontStyle: "italic" }}>Love</span>
              <span style={{ fontStyle: "italic" }}>Us</span>
              <span style={{ fontStyle: "italic" }}>Patients</span>
              <span style={{ fontStyle: "italic" }}>Love</span>
              <span style={{ fontStyle: "italic" }}>Us</span>
              <span style={{ fontStyle: "italic" }}>Why</span>
              <span style={{ fontStyle: "italic" }}>Our</span>
              <span style={{ fontStyle: "italic" }}>Patients</span>
            </div>
            <div
              className="row"
              style={{
                width: "300vw",
                display: "flex",
                flexDirection: "row",
                alignItems: "flex-start",
                justifyContent: "space-around",
                transform: "translate3d(25%, 0, 0)",
                whiteSpace: "nowrap",
                WebkitAnimationIterationCount: "infinite",
                animationIterationCount: "infinite",
                WebkitAnimationTimingFunction: "linear",
                animationTimingFunction: "linear",
                WebkitAnimationName: "marqueeTestimonial",
                animationName: "marqueeTestimonial",
                WebkitAnimationDuration: "60s",
                animationDuration: "60s",
              }}
            >
              <span>Why</span>
              <span>Our</span>
              <span>Patients</span>
              <span>Love</span>
              <span>Us</span>
              <span>Why</span>
              <span>Our</span>
              <span>Patients</span>
            </div>
          </div>
        </section>
</div>
<div className="border rounded-2xl ContentContainer">
        <div className="relative isolate">
          <svg
            className="absolute inset-x-0 top-0 -z-10 h-[64rem] w-full stroke-gray-200 [mask-image:radial-gradient(32rem_32rem_at_center,white,transparent)]"
            aria-hidden="true"
          >
            <defs>
              <pattern
                id="1f932ae7-37de-4c0a-a8b0-a6e3b4d44b84"
                width={200}
                height={200}
                x="50%"
                y={-1}
                patternUnits="userSpaceOnUse"
              >
                <path d="M.5 200V.5H200" fill="none" />
              </pattern>
            </defs>
            <svg x="50%" y={-1} className="overflow-visible fill-gray-50">
              <path
                d="M-200 0h201v201h-201Z M600 0h201v201h-201Z M-400 600h201v201h-201Z M200 800h201v201h-201Z"
                strokeWidth={0}
              />
            </svg>
            <rect
              width="100%"
              height="100%"
              strokeWidth={0}
              fill="url(#1f932ae7-37de-4c0a-a8b0-a6e3b4d44b84)"
            />
          </svg>
          <div
            className="absolute top-0 right-0 -ml-24 overflow-hidden left-1/2 -z-10 transform-gpu blur-3xl lg:ml-24 xl:ml-48"
            aria-hidden="true"
          >
            <div
              className="aspect-[801/1036] w-[50.0625rem] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30"
              style={{
                clipPath:
                  "polygon(63.1% 29.5%, 100% 17.1%, 76.6% 3%, 48.4% 0%, 44.6% 4.7%, 54.5% 25.3%, 59.8% 49%, 55.2% 57.8%, 44.4% 57.2%, 27.8% 47.9%, 35.1% 81.5%, 0% 97.7%, 39.2% 100%, 35.2% 81.4%, 97.2% 52.8%, 63.1% 29.5%)",
              }}
            />
          </div>
          <div className="overflow-hidden">
            <div className="px-6 pb-32 mx-auto max-w-7xl pt-36 sm:pt-60 lg:px-8 lg:pt-32">
              <div className="max-w-2xl mx-auto gap-x-14 lg:mx-0 lg:flex lg:max-w-none lg:items-center">
                <motion.div
                  initial={{ y: -100, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.8 }}
                  className="w-full max-w-xl lg:shrink-0 xl:max-w-lg"
                >
                  <h2 className="normal-case text-primary-30">
                    We have served hundreds of amazing people
                  </h2>
                  <p className="relative mt-6 text-lg leading-8 text-gray-600 sm:max-w-md lg:max-w-none">
                    Cupidatat minim id magna ipsum sint dolor qui. Sunt sit in
                    quis cupidatat mollit aute velit. Et labore commodo nulla
                    aliqua proident mollit ullamco exercitation tempor. Sint
                    aliqua anim nulla sunt mollit id pariatur in voluptate
                    cillum.
                  </p>
                </motion.div>
                <div className="flex justify-end gap-8 mt-14 sm:-mt-44 sm:justify-start sm:pl-20 lg:mt-0 lg:pl-0">
                  <div className="flex-none pt-32 ml-auto space-y-8 w-44 sm:ml-0 sm:pt-80 lg:order-last lg:pt-36 xl:order-none xl:pt-80">
                    <motion.div
                      initial="initial"
                      whileInView="animate"
                      viewport={{ once: true, amount: 0 }}
                      variants={fadeInOnScroll}
                      className="relative"
                    >
                      <img
                        src="/../../../images/testimonials/Brooke_Walker.jpg"
                        alt="Previous FreySmiles patient, Brooke Walker"
                        className="aspect-[2/3] w-full rounded-xl bg-gray-900/5 object-cover shadow-lg"
                      />
                      <div className="absolute inset-0 pointer-events-none rounded-xl ring-1 ring-inset ring-gray-900/10" />
                    </motion.div>
                    <motion.div
                      initial="initial"
                      whileInView="animate"
                      viewport={{ once: true, amount: 0 }}
                      variants={fadeInOnScroll}
                      className="relative"
                    >
                      <img
                        src="/../../../images/testimonials/Sophia_Lee.jpg"
                        alt="Previous FreySmiles patient, Sophia Lee"
                        className="aspect-[2/3] w-full rounded-xl bg-gray-900/5 object-cover shadow-lg"
                      />
                      <div className="absolute inset-0 pointer-events-none rounded-xl ring-1 ring-inset ring-gray-900/10" />
                    </motion.div>
                  </div>
                  <div className="flex-none mr-auto space-y-8 w-44 sm:mr-0 sm:pt-52 lg:pt-36">
                    <motion.div
                      initial="initial"
                      whileInView="animate"
                      viewport={{ once: true, amount: 0 }}
                      variants={fadeInOnScroll}
                      className="relative"
                    >
                      <img
                        src="/../../../images/testimonials/Natasha_Khela.jpg"
                        alt="Previous FreySmiles patient, Natasha Khela"
                        className="aspect-[2/3] w-full rounded-xl bg-gray-900/5 object-cover shadow-lg"
                      />
                      <div className="absolute inset-0 pointer-events-none rounded-xl ring-1 ring-inset ring-gray-900/10" />
                    </motion.div>
                    <motion.div
                      initial="initial"
                      whileInView="animate"
                      viewport={{ once: true, amount: 0 }}
                      variants={fadeInOnScroll}
                      className="relative"
                    >
                      <img
                        src="/../../../images/testimonials/James_Cipolla.jpg"
                        alt="Previous FreySmiles patient, James Cipolla"
                        className="aspect-[2/3] w-full rounded-xl bg-gray-900/5 object-cover shadow-lg"
                      />
                      <div className="absolute inset-0 pointer-events-none rounded-xl ring-1 ring-inset ring-gray-900/10" />
                    </motion.div>
                    <motion.div
                      initial="initial"
                      whileInView="animate"
                      viewport={{ once: true, amount: 0 }}
                      variants={fadeInOnScroll}
                      className="relative"
                    >
                      <img
                        src="/../../../images/testimonials/Maria_Anagnostou.jpg"
                        alt="Previous FreySmiles patient, Maria Anagnostou"
                        className="aspect-[2/3] w-full rounded-xl bg-gray-900/5 object-cover shadow-lg"
                      />
                      <div className="absolute inset-0 pointer-events-none rounded-xl ring-1 ring-inset ring-gray-900/10" />
                    </motion.div>
                  </div>
                  <div className="flex-none pt-32 space-y-8 w-44 sm:pt-0">
                    <motion.div
                      initial="initial"
                      whileInView="animate"
                      viewport={{ once: true, amount: 0 }}
                      variants={fadeInOnScroll}
                      className="relative"
                    >
                      <img
                        src="/../../../images/testimonials/Erica_Brooks.jpg"
                        alt="Previous FreySmiles patient, Erica Brooks"
                        className="aspect-[2/3] w-full rounded-xl bg-gray-900/5 object-cover shadow-lg"
                      />
                      <div className="absolute inset-0 pointer-events-none rounded-xl ring-1 ring-inset ring-gray-900/10" />
                    </motion.div>
                    <motion.div
                      initial="initial"
                      whileInView="animate"
                      viewport={{ once: true, amount: 0 }}
                      variants={fadeInOnScroll}
                      className="relative"
                    >
                      <img
                        src="/../../../images/testimonials/Ibis_Subero.jpg"
                        alt="Previous FreySmiles patient, Ibis Subero"
                        className="aspect-[2/3] w-full rounded-xl bg-gray-900/5 object-cover shadow-lg"
                      />
                      <div className="absolute inset-0 pointer-events-none rounded-xl ring-1 ring-inset ring-gray-900/10" />
                    </motion.div>
                    <motion.div
                      initial="initial"
                      whileInView="animate"
                      viewport={{ once: true, amount: 0 }}
                      variants={fadeInOnScroll}
                      className="relative"
                    >
                      <img
                        src="/../../../images/testimonials/Paige_Mckenna.jpg"
                        alt="Previous FreySmiles patient, Paige McKenna"
                        className="aspect-[2/3] w-full rounded-xl bg-gray-900/5 object-cover shadow-lg"
                      />
                      <div className="absolute inset-0 pointer-events-none rounded-xl ring-1 ring-inset ring-gray-900/10" />
                    </motion.div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        </div>
        </div>
      </section>




      <section className="mb-32 sm:pb-32">
        <div className="relative mt-32 isolate sm:mt-56 sm:pt-32">
          <svg
            className="absolute inset-0 -z-10 hidden h-full w-full stroke-gray-200 [mask-image:radial-gradient(64rem_64rem_at_top,white,transparent)] sm:block"
            aria-hidden="true"
          >
            <defs>
              <pattern
                id="55d3d46d-692e-45f2-becd-d8bdc9344f45"
                width={200}
                height={200}
                x="50%"
                y={0}
                patternUnits="userSpaceOnUse"
              >
                <path d="M.5 200V.5H200" fill="none" />
              </pattern>
            </defs>
            <svg x="50%" y={0} className="overflow-visible fill-gray-50">
              <path
                d="M-200.5 0h201v201h-201Z M599.5 0h201v201h-201Z M399.5 400h201v201h-201Z M-400.5 600h201v201h-201Z"
                strokeWidth={0}
              />
            </svg>
            <rect
              width="100%"
              height="100%"
              strokeWidth={0}
              fill="url(#55d3d46d-692e-45f2-becd-d8bdc9344f45)"
            />
          </svg>
          <div className="relative">
            <div
              className="absolute inset-x-0 overflow-hidden -translate-y-1/2 top-1/2 -z-10 transform-gpu opacity-30 blur-3xl"
              aria-hidden="true"
            >
              <div
                className="ml-[max(50%,38rem)] aspect-[1313/771] w-[82.0625rem] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc]"
                style={{
                  clipPath:
                    "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
                }}
              />
            </div>
            <div
              className="absolute inset-x-0 top-0 flex pt-8 overflow-hidden opacity-25 -z-10 transform-gpu blur-3xl xl:justify-end"
              aria-hidden="true"
            >
              <div
                className="ml-[-22rem] aspect-[1313/771] w-[82.0625rem] flex-none origin-top-right rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] xl:ml-0 xl:mr-[calc(50%-12rem)]"
                style={{
                  clipPath:
                    "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
                }}
              />
            </div>

            <div className="px-6 mx-auto max-w-7xl lg:px-8">
              <div className="max-w-xl mx-auto sm:text-center">
        
                <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                  Here&apos;s what others had to say about us
                </p>
              </div>
              <div className="grid max-w-2xl grid-cols-1 grid-rows-1 gap-8 mx-auto mt-16 text-sm leading-6 text-gray-900 sm:mt-20 sm:grid-cols-2 xl:mx-0 xl:max-w-none xl:grid-flow-col xl:grid-cols-4">
                <motion.figure
                  initial="initial"
                  whileInView="animate"
                  viewport={{ once: true, amount: 0.2 }}
                  variants={fadeInOnScroll}
                  className="hidden col-span-2 sm:block sm:rounded-2xl sm:bg-white sm:shadow-lg sm:ring-1 sm:ring-gray-900/5 xl:col-start-2 xl:row-end-1"
                >
                  <blockquote className="p-12 text-xl font-semibold leading-8 tracking-tight text-gray-900">
                    <p>{`“${featuredTestimonial.body}”`}</p>
                  </blockquote>
                  <figcaption className="flex items-center px-6 py-4 border-t gap-x-4 border-gray-900/10">
                    <img
                      src={featuredTestimonial.author.imageUrl}
                      alt={featuredTestimonial.author.name}
                      className="flex-none w-10 h-10 rounded-full bg-gray-50"
                    />
                    <div className="flex-auto">
                      <div className="font-semibold">
                        {featuredTestimonial.author.name}
                      </div>
                      <div className="text-gray-600">{`${featuredTestimonial.author.treatment}`}</div>
                    </div>
                    {/* <img className="flex-none w-auto h-10" src={featuredTestimonial.author.logoUrl} alt="" /> */}
                  </figcaption>
                </motion.figure>
                {testimonials.map((columnGroup, columnGroupIdx) => (
                  <div
                    key={columnGroupIdx}
                    className="space-y-8 xl:contents xl:space-y-0"
                  >
                    {columnGroup.map((column, columnIdx) => (
                      <motion.div
                        key={columnIdx}
                        initial="initial"
                        whileInView="animate"
                        viewport={{ once: false, amount: 0.2 }}
                        variants={fadeInOnScroll}
                        className={classNames(
                          (columnGroupIdx === 0 && columnIdx === 0) ||
                            (columnGroupIdx === testimonials.length - 1 &&
                              columnIdx === columnGroup.length - 1)
                            ? "xl:row-span-2"
                            : "xl:row-start-1",
                          "space-y-8"
                        )}
                      >
                        {column.map((testimonial) => (
                          <figure
                            key={testimonial.author.name}
                            className="p-6 bg-white shadow-lg rounded-2xl ring-1 ring-gray-900/5"
                          >
                            <blockquote className="text-gray-900">
                              <p>{`“${testimonial.body}”`}</p>
                            </blockquote>
                            <figcaption className="flex items-center pt-4 mt-6 border-t border-gray-900/10 gap-x-4">
                              <img
                                src={testimonial.author.imageUrl}
                                alt={testimonial.author.name}
                                className="w-10 h-10 rounded-full bg-gray-50"
                              />
                              <div>
                                <div className="font-semibold">
                                  {testimonial.author.name}
                                </div>
                                <div className="text-gray-600">{`${testimonial.author.treatment}`}</div>
                              </div>
                            </figcaption>
                          </figure>
                        ))}
                      </motion.div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
