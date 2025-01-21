"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger, MotionPathPlugin } from "gsap/all";

gsap.registerPlugin(MotionPathPlugin, ScrollTrigger);

const HeaderBanner = () => {
  const marqueeRef = useRef(null);

  useEffect(() => {
    const marqueeElement = marqueeRef.current;
    const windowWidth = window.innerWidth;

    const marqueeSpan = marqueeElement.querySelector("span");
    const spanWidth = marqueeSpan.offsetWidth;

    const numberOfClones = Math.floor(windowWidth / spanWidth) + 1;
    let innerContent = marqueeElement.innerHTML;

    marqueeElement.style.width = (numberOfClones + 1) * spanWidth + "px";

    for (let i = 0; i < numberOfClones; i++) {
      innerContent += marqueeElement.innerHTML;
    }

    marqueeElement.innerHTML = innerContent;

    gsap.to(marqueeElement, {
      duration: 8,
      repeat: -1,
      x: "-=" + spanWidth,
      modifiers: {
        x: (x) => gsap.utils.wrap(-spanWidth, 0, parseFloat(x)) + "px",
      },
      ease: "linear",
    });
  }, []);

  const [hover, setHover] = useState(false);

  useEffect(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: "#tracking-section",
        start: "top center",
        end: "bottom center",
        scrub: true,
      },
    });

    tl.fromTo(
      "#element",
      { x: 0, y: 0 },
      {
        ease: "none",
        motionPath: {
          path: [
            { x: "50vw", y: "100vh" },
            { x: "25vw", y: "200vh" },
            { x: "75vw", y: "300vh" },
            { x: "0vw", y: "400vh" },
          ],
        },
      }
    );
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const timelineBlocks = document.querySelectorAll(".cd-timeline-block");
      timelineBlocks.forEach((block) => {
        const top = block.getBoundingClientRect().top;
        if (top <= window.innerHeight * 0.75) {
          block.querySelector(".cd-timeline-img").classList.remove("is-hidden");
          block.querySelector(".cd-timeline-img").classList.add("bounce-in");
          block
            .querySelector(".cd-timeline-content")
            .classList.remove("is-hidden");
          block
            .querySelector(".cd-timeline-content")
            .classList.add("bounce-in");
        } else {
          block.querySelector(".cd-timeline-img").classList.add("is-hidden");
          block.querySelector(".cd-timeline-img").classList.remove("bounce-in");
          block
            .querySelector(".cd-timeline-content")
            .classList.add("is-hidden");
          block
            .querySelector(".cd-timeline-content")
            .classList.remove("bounce-in");
        }
      });
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    const firstSection = {
      section: "#first-color",
      bgColor: "#EDE7E6",
      // fontColor: "#2F796D",
    };

    const secondSection = {
      section: "#second-color",
      bgColor: "#D9D2D6 ",
      fontColor: "#2F796D ",
    };

    const thirdSection = {
      section: ".third-color",
      bgColor: "#D8EBE3",
      // fontColor: "#233329",
    };

    const setColors = (curr, next) => {
      let tl = gsap.timeline({ ease: "power2.inOut" });

      tl.to(".colorcontainer", {
        duration: 1.5,
        backgroundColor: next.bgColor,
        color: next.fontColor,
      });
    };

    gsap.set(".colorcontainer", {
      backgroundColor: firstSection.bgColor,
      color: firstSection.fontColor,
    });

    gsap.to(secondSection.section, {
      duration: 1,
      scrollTrigger: {
        trigger: secondSection.section,
        start: "top 70%",
        end: "bottom 30%",
        scrub: true,
        onEnter: () => setColors(firstSection, secondSection),
        onLeaveBack: () => setColors(secondSection, firstSection),
      },
    });

    gsap.to(thirdSection.section, {
      duration: 1,
      scrollTrigger: {
        trigger: thirdSection.section,
        start: "top 70%",
        end: "bottom 30%",
        scrub: true,
        onEnter: () => setColors(secondSection, thirdSection),
        onLeaveBack: () => setColors(thirdSection, secondSection),
      },
    });
  }, []);


  const cardRefs = useRef([]);
  const sectionRef = useRef(null);
  useEffect(() => {
    const cards = cardRefs.current;
  
    cards.forEach((card, index) => {
      if (card) {
        gsap.to(card, {
          height: 0,
          ease: "power1.out",
          scrollTrigger: {
            trigger: sectionRef.current, // Use the entire section as the trigger
            start: `top+=${index * 100} top`, // Cards collapse sequentially
            end: `+=100`, // Collapse each card over 100px
            scrub: true,
          },
        });
      }
    });
  
    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);
  
  const svgRef = useRef(null);

  useEffect(() => {
    const circles = svgRef.current.querySelectorAll("circle");
  
    circles.forEach((circle, index) => {
      gsap.to(circle, {
        scrollTrigger: {
          trigger: circle,
          start: "top 80%",
          end: "bottom 20%",
          scrub: 1,
        },
        attr: {
          cy: 400 + index * 50,
        },
        duration: 1,
        ease: "power1.inOut",
      });
    });
  
    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <div className="max-w-[100vw]">
     <div className="flex justify-center py-16 px-4">
  <div className="bg-[#F3DACF] max-w-7xl w-full rounded-2xl p-12">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Left Column */}
      <div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col items-start">
            <div className="flex items-center justify-center text-white">
              <span>
                <img src="../images/appts.svg" />
              </span>
            </div>
            <p className="font-neue-montreal mt-4 text-green-900 text-md">
              10 medical visits so all your concerns are heard
            </p>
          </div>
          <div className="flex flex-col items-start">
            <div className="w-16 h-16 flex items-center justify-center text-white">
              <span>
                <img src="../images/tech.svg" />
              </span>
            </div>
            <p className="font-neue-montreal mt-4 text-green-900 text-md">
              Access to advanced technology others don’t offer
            </p>
          </div>
          <div className="flex flex-col items-start">
            <div className="w-12 h-12 flex items-center justify-center text-white">
              <span>
                <img src="../images/paperwork.svg" />
              </span>
            </div>
            <p className="font-neue-montreal mt-4 text-green-900 text-md">
              No Hidden Costs. We do not upcharge for “special braces,” including Invisalign, and fees are all inclusive.
            </p>
          </div>
        </div>
      </div>

      {/* Right Column */}
      <div className="flex flex-col items-end space-y-8">
        {/* Circle */}
        <svg
              ref={svgRef}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 400 600"
              className="w-64 h-auto"
            >
              {[...Array(5)].map((_, index) => (
                <circle
                  key={index}
                  cx="200"
                  cy={150 + index * 50} 
                  r="196"
                  fill="none"
                  stroke="white"
                  strokeWidth="2"
                />
              ))}
            </svg>



        {/* <div className="font-neue-montreal text-lg flex items-center space-x-4">
          <Link href="/book-now" className="flex items-center space-x-2">
            <button
              className="px-6 py-3"
              onMouseEnter={() => setHover(true)}
              onMouseLeave={() => setHover(false)}
            >
              Get started
            </button>
            <svg
              className="cursor-pointer w-12"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 13"
              onMouseEnter={() => setHover(true)}
              onMouseLeave={() => setHover(false)}
            >
              <path
                d="M19.4 6.4L13 0l-1.4 1.4 4 4H4.8v2h10.8l-4 4 1.4 1.4 6.4-6.4z"
                className="head"
                style={{
                  transform: hover ? "translateX(0)" : "translateX(-3px)",
                  transition: "all 0.35s ease",
                }}
              />
              <path
                d="M0 5.4h9.7v2H0z"
                className="tail"
                style={{
                  transform: hover ? "translateX(0)" : "translateX(5px)",
                  transition: "all 0.35s ease",
                }}
              />
            </svg>
          </Link>
        </div> */}
      </div>
    </div>

    {/* Bottom Section */}
    <div className="mt-48">
      <h1 className="font-helvetica-neue-light text-green-900 text-6xl">
        Your plan is tailored
        <br />
        to your needs
      </h1>
    </div>
  </div>
</div>



      <div id="second-color" className="overflow-hidden w-full py-4">
        <div
          ref={marqueeRef}
          className="inline-block text-6xl font-sans whitespace-nowrap"
        >
          <span>Expert Clinical Care, Personalized Just for You&nbsp;</span>
        </div>
      </div>
      <section ref={sectionRef} className="section-home-services">
  <div className="home-services-grid">
    <div className="home-services-grid-left">
      <div className="home-services-grid-left-inner">
        <img src="../images/testimonial.gif" alt="Testimonial" />
      </div>
    </div>
    <div className="home-services-grid-right">

      {[
        {
          title: "Coverage",
          description:
            "If you have orthodontic insurance, we’ll help you maximize your lifetime benefits",
        },
        {
          title: "FSA/HSA",
          description:
            "We accept HSA/FSA to help you save on your orthodontic treatment",
        },
        {
          title: "INSURANCE",
          description:
            "We will help you submit claims for reimbursement based on your insurance plan’s guidelines",
        },
        
      ].map((card, index) => (
        <div
          key={index}
          className="home-services-card-wrapper"
          ref={(el) => (cardRefs.current[index] = el)}
        >
          <div className="home-services-card">
          <div className="home-services-card-title-wrapper">
          <img src="../images/star.png" alt="Star" className="home-services-card-star" />
  <h2 className="home-services-card-title">{card.title}</h2>
</div>
  <p className="home-services-card-description">{card.description}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
</section>

      <div
        className="third-color py-16 px-8 bg-cover bg-center"
        id="tracking-section"
        // style={{ backgroundImage: "url('../images/background_min.png')" }}
      >
        <div
          id="element"
          className="absolute w-12 h-12 bg-black rounded-full top-0 left-0"
        ></div>

        <section
          id="cd-timeline"
          className="relative mx-auto w-[90%] max-w-[1170px]"
        >
          {/* Vertical line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 top-0 h-full w-[2px] bg-gray-300"></div>

          {/* Section 1 (Left Aligned) */}
          <div className="cd-timeline-block relative my-8 flex lg:flex-row-reverse">
            <div className="cd-timeline-img absolute left-1/2 transform -translate-x-1/2 top-0 w-10 h-10  flex items-center justify-center">
              <img
                src="../images/starbullet.svg"
                alt="Location"
                className="w-15 h-15"
              />
            </div>

            <div className="cd-timeline-content flex justify-end">
              <div className="relative bg-[#68C9BA1A] p-12 rounded-3xl m-6 lg:w-[45%] min-w-[min-content]">
                <img
                  src="../images/consultgraphic.svg"
                  alt="Consult Graphic"
                  className="absolute left-[-100px] top-0 w-[150px] h-auto"
                />

                <h3 className="text-4xl font-bold text-[#212353] mb-4">
                  Complimentary Consultation
                </h3>

                <p className="text-md text-[#4B5D68] mb-6">
                  Initial consultations are always free of charge.
                </p>

                <a
                  href="#0"
                  className="float-right text-white bg-black px-4 py-2 rounded-full hover:bg-gray-300"
                >
                  Book Now
                </a>
              </div>
            </div>
          </div>

          {/* Section 2 (Right Aligned) */}
          <div className="cd-timeline-block relative my-8 flex lg:flex-row">
            <div className="cd-timeline-img absolute left-1/2 transform -translate-x-1/2 top-0 w-10 h-10 flex items-center justify-center">
              <img
                src="../images/starbullet.svg"
                alt="Location"
                className="w-15 h-15"
              />
            </div>

            <div className="cd-timeline-content">
              <div className="relative bg-[#F063B81A] p-12 rounded-3xl m-6 lg:w-[45%]">
                <img
                  src="../../images/orangecylinder.svg"
                  alt="Consult Graphic"
                  className="absolute left-[-100px] top-0 w-[150px] h-auto"
                />

                <h3 className="text-4xl font-bold text-[#212353] mb-4">
                  Explore Flexible Ways to Pay
                </h3>

                <p className="text-md text-[#4B5D68] mb-6">
                  Choose from flexible payment plans or enjoy 10% off when you
                  pay in full prior to starting treatment
                </p>

                <a
                  href="https://www.klarna.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="float-right"
                >
                  <img
                    src="../images/klarna.svg"
                    alt="Klarna"
                    className="w-12 h-auto"
                  />
                </a>
              </div>
            </div>
          </div>

          {/* Section 3 (Left Aligned) */}
          <div className="cd-timeline-block relative my-8 flex lg:flex-row-reverse">
            <div className="cd-timeline-img absolute left-1/2 transform -translate-x-1/2 top-0 w-10 h-10  flex items-center justify-center">
              <img
                src="../images/starbullet.svg"
                alt="Location"
                className="w-15 h-15"
              />
            </div>
            <div className="cd-timeline-content flex justify-end">
              <div className="relative bg-[#9C69E21A] p-12 rounded-3xl m-6 lg:w-[45%] min-w-[min-content]">
                <img
                  src="../images/consultgraphic.svg"
                  alt="Caring Tradition"
                  className="absolute left-[-100px] top-0 w-[150px] h-auto"
                />

                <h3 className="text-4xl font-bold text-[#212353] mb-4">
                  Caring Tradition
                </h3>

                <p className="text-md text-[#4B5D68] mb-6">
                  Successive family members always receive the same excellent
                  care. Ask about our family courtesies.
                </p>

                <a
                  href="#0"
                  className="float-right text-white bg-black px-4 py-2 rounded-full hover:bg-gray-300"
                >
                  Inquire
                </a>
              </div>
            </div>
          </div>

          {/* Section 4 (Right Aligned) */}
          <div className="cd-timeline-block relative my-8 flex lg:flex-row">
            <div className="cd-timeline-img absolute left-1/2 transform -translate-x-1/2 top-0 w-10 h-10  flex items-center justify-center">
              <img
                src="../images/starbullet.svg"
                alt="Location"
                className="w-15 h-15"
              />
            </div>
            <div className="cd-timeline-content flex justify-start">
              <div className="relative bg-[#68C9BA1A] p-12 rounded-3xl m-6 lg:w-[45%] min-w-[min-content]">
                <img
                  src="../images/winky.svg"
                  alt="Post-Op Care Graphic"
                  className="absolute left-[-100px] top-0 w-[150px] h-auto"
                />

                <h3 className="text-4xl font-bold text-[#212353] mb-4">
                  Our Support Doesn&apos;t End When Treatment Does
                </h3>

                <p className="text-md text-[#4B5D68] mb-6">
                  Your treatment includes one year of follow-up care. We&apos;re
                  never cheap with our energy.
                </p>
              </div>
            </div>
          </div>
        </section>
        <div className="flex">
          <section className="relative p-8 w-1/2 ">
            <div className="flex w-2/3 items-center justify-center ">
              <div
                className="relative mx-2"
                style={{ width: "300px", height: "240px" }}
              >
                <img
                  className="object-cover w-full h-full rounded-full opacity-90"
                  src="../../images/carepatient1.png"
                  alt="patient"
                  style={{ objectPosition: "40% 50%" }}
                />
              </div>
              <div
                className="relative mx-2"
                style={{ width: "300px", height: "300px" }}
              >
                <img
                  className="object-cover w-full h-full rounded-full opacity-90"
                  src="../../images/carepatient2.png"
                  alt="patient"
                  style={{ objectPosition: "10% 50%" }}
                />
              </div>

              <div
                className="relative mx-2 "
                style={{ width: "300px", height: "340px" }}
              >
                <img
                  className="object-cover w-full h-full rounded-full opacity-90"
                  src="../../images/carepatient3.png"
                  alt="patient"
                />
              </div>
              <div
                className="relative mx-2 "
                style={{ width: "330px", height: "400px" }}
              >
                <img
                  className="object-cover w-full h-full rounded-full opacity-90"
                  src="../../images/carepatient4.png"
                  alt="patient"
                  style={{ objectPosition: "40% 50%" }}
                />
              </div>
              <div
                className="relative mx-2 "
                style={{ width: "300px", height: "480px" }}
              >
                <img
                  className="object-cover w-full h-full rounded-full opacity-90"
                  src="../../images/freysmilepatient1.jpg"
                  alt="patient"
                />
              </div>
            </div>
          </section>

          <div className="flex  ">
            <div className="relative bg-white bg-opacity-10 p-12 rounded-3xl m-6 backdrop-filter backdrop-blur-lg shadow-lg max-w-lg w-full">
              <div className="flex items-center justify-center mb-8">
                <img
                  src="../../images/logo_icon.png"
                  alt="Logo"
                  className="w-20 h-20 mr-4"
                />
              </div>

              <p className="text-lg text-gray-700 mb-8">
                &quot;Frey Smiles has made the whole process from start to finish
                incredibly pleasant and sooo easy on my kids to follow. They
                were able to make a miracle happen with my son&apos;s tooth that was
                coming in sideways. He now has a perfect smile and I couldn&apos;t be
                happier. My daughter is halfway through her treatment and the
                difference already has been great. I 100% recommend this place
                to anyone!!!&quot;
              </p>

              <div className="mt-8">
                <p className="text-xl font-bold text-[#212353]">James P</p>
                <p className="text-sm text-gray-500">Happy Customer</p>
              </div>
            </div>
          </div>
        </div>
        {/* <section className="relative p-8 w-full ">
          <div className="flex w-full items-center justify-center ">
            <div
              className="relative mx-2"
              style={{ width: "300px", height: "240px" }}
            >
              <img
                className="object-cover w-full h-full rounded-full opacity-90"
                src="../../images/carepatient1.png"
                alt="patient"
                style={{ objectPosition: "40% 50%" }}
              />
            </div>
            <div
              className="relative mx-2"
              style={{ width: "300px", height: "300px" }}
            >
              <img
                className="object-cover w-full h-full rounded-full opacity-90"
                src="../../images/carepatient2.png"
                alt="patient"
                style={{ objectPosition: "10% 50%" }}
              />
            </div>

            <div
              className="relative mx-2 "
              style={{ width: "300px", height: "340px" }}
            >
              <img
                className="object-cover w-full h-full rounded-full opacity-90"
                src="../../images/carepatient3.png"
                alt="patient"
              />
            </div>
            <div
              className="relative mx-2 "
              style={{ width: "330px", height: "400px" }}
            >
              <img
                className="object-cover w-full h-full rounded-full opacity-90"
                src="../../images/carepatient4.png"
                alt="patient"
                style={{ objectPosition: "40% 50%" }}
              />
            </div>
            <div
              className="relative mx-2 "
              style={{ width: "300px", height: "480px" }}
            >
              <img
                className="object-cover w-full h-full rounded-full opacity-90"
                src="../../images/freysmilepatient1.jpg"
                alt="patient"
              />
            </div>
          </div>
        </section> */}
      </div>
    </div>
  );
};

export default HeaderBanner;

{
  /* <div className="flex items-center w-1/4 h-full justify-center bg-[#e5c2cc]">
      <p className="text-2xl font-bold tracking-wider text-black transform -rotate-90">REVIEWS</p>
    </div>


    <div className="p-8">
      <p className="text-gray-500">
      "Frey Smiles has made the whole process from start to finish incredibly pleasant and sooo easy on my kids to follow. They were able to make a miracle happen with my son's tooth that was coming in sideways. He now has a perfect smile and I couldn't be happier. My daughter is halfway through her treatment and the difference already has been great. I 100% recommend this place to anyone!!!"
      </p>
      <p className="mt-4 font-bold text-black">
   <a href="/testimonials" className="text-black underline">Read More</a>
      </p>
    </div> */
}
