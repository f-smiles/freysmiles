"use client";
import { useEffect, useRef } from "react";
import gsap from 'gsap';

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
  
  useEffect(() => {
    let target = 0;
    let current = 0;
    const ease = 0.075;
  
    const sliderWrapper = document.querySelector(".slider__wrapper");
    const slides = document.querySelectorAll(".slider__item");
  
    let maxScroll = sliderWrapper.offsetWidth - window.innerWidth - 600;
  
    function lerp(start, end, factor) {
      return start + (end - start) * factor;
    }
  
    function updateScaleAndPosition() {
      slides.forEach((slide) => {
        const rect = slide.getBoundingClientRect();
        const centerPosition = (rect.left + rect.right) / 2;
        const distanceFromCenter = centerPosition - window.innerWidth / 2;
  
        let scale, offsetX;
        if (distanceFromCenter > 0) {
          scale = Math.min(1.75, 1 + distanceFromCenter / window.innerWidth);
          offsetX = (scale - 1) * 300;
        } else {
          scale = Math.max(0.5, 1 - Math.abs(distanceFromCenter) / window.innerWidth);
          offsetX = 0;
        }
  
        gsap.set(slide, {
          scale: scale,
          x: offsetX,
        });
      });
    }
  
    function update() {
      current = lerp(current, target, ease);
  
      gsap.set(sliderWrapper, {
        x: -current,
      });
  
      updateScaleAndPosition();
  
      requestAnimationFrame(update);
    }
  
    const handleWheel = (e) => {
      target += e.deltaY;
      target = Math.max(0, Math.min(maxScroll, target));
  
      if (target > 0 && target < maxScroll) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    };
  
    window.addEventListener("resize", () => {
      maxScroll = sliderWrapper.offsetWidth - window.innerWidth;
    });
  
    window.addEventListener("wheel", handleWheel);
  
    update();
  
    return () => {
      window.removeEventListener("resize", () => {});
      window.removeEventListener("wheel", handleWheel);
      document.body.style.overflow = '';
    };
  }, []);
  

  
  const imageUrl = [
    "/../../../images/testimonials/kinzie1.jpg", "/../../../images/testimonials/hurlburt.jpeg",  "/../../../images/carepatient2.png",  "/../../../images/testimonials/laniepurple.png",
    "/../../../images/testimonials/Narvaez.jpg", "/../../../images/testimonials/Natasha_Khela.jpg",  "/../../../images/testimonials/schwarz.jpeg",
    "/../../../images/freysmilepatient.jpg","/../../../images/testimonials/hobsonblue.png",
    "/../../../images/testimonials/elizabeth1.png",
    "/../../../images/testimonials/Nilaya.jpeg", 
  
  ];

  return (
    <>
<div className="bg-[#F4F1EC] min-h-screen ">
      <div className="slider">
      <div className="  w-screen h-screen relative ">
 
 <div className="sidebar">
   <div className="sidebar__item">
   <p style={{ textTransform: 'uppercase', fontSize: '3.5rem', lineHeight: 1, marginBottom: '4rem' }} className="font-bold font-TerminaTest-Bold text-2xl uppercase mb-4">Our <br />Patients </p>

     <p>Read Our Reviews <br/>link</p>
   </div>
   <div className="sidebar__item flex gap-24">
     <p></p>
     <p>&bull; &bull; &bull;</p>
   </div>
 </div>
        <div className="slider__wrapper flex gap-24 p-6">
       
        {imageUrl.map((imagePath, index) => (
  <div key={index} className="slider__item ">
    <img className="rounded-2xl " src={imagePath} alt="" />
  </div>
))} <div className="additional-content">

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

            <div className="reviews px-6 mx-auto max-w-7xl lg:px-8">
              <div className="max-w-xl mx-auto sm:text-center">
        
                {/* <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                  Here&apos;s what others had to say about us
                </p> */}
              </div>
              <div className="grid max-w-2xl grid-cols-1 grid-rows-1 gap-8 mx-auto mt-16 text-sm leading-6 text-gray-900 sm:mt-20 sm:grid-cols-2 xl:mx-0 xl:max-w-none xl:grid-flow-col xl:grid-cols-4">
                <motion.figure
                  initial="initial"
                  whileInView="animate"
                  viewport={{ once: true, amount: 0.2 }}
                  variants={fadeInOnScroll}
                  className="hidden col-span-2 sm:block sm:rounded-2xl sm:shadow-lg sm:ring-1 sm:ring-gray-900/5 xl:col-start-2 xl:row-end-1"
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
                            className="p-6  shadow-lg rounded-2xl ring-1 ring-gray-900/5"
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

</div>
        </div>
        
      </div>
    </div>

    </div>

    </>
  );
}
