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

  return (
    <div className="colorcontainer">
      <div
        id="first-color"
        className=" flex items-center justify-between px-8 py-16 lg:px-16 xl:px-24 lg:py-32 relative"
      >
        {/* Centered Cylinder Image */}
        {/* <img
    className="absolute left-1/2 transform -translate-x-1/2 object-contain w-1/2 h-1/2 opacity-90"
    src="../../images/orangecylinder.svg"
    alt="Cylinder"
  /> */}

        {/* Left Section */}
        <div className=" max-w-lg z-10">
          {" "}
          <h1 className="text-4xl font-bold font-neue-montreal text-gray-900 leading-snug">
            Your care plan is tailored{" "}
            <span className="text-gray-500 italic">to your needs,</span> and
            biology
          </h1>
          <ul className="font-neue-montreal mt-6 flex space-x-8">
            <li className="flex items-center justify-center">
              <div className="flex items-center justify-center w-28 h-28 border border-gray-400 rounded-full">
                <span className="text-center text-sm text-gray-700">
                  Effective
                </span>
              </div>
            </li>

            <li className="flex items-center justify-center">
              <div className="flex items-center justify-center w-28 h-28 border border-gray-400 rounded-full">
                <span className="text-center text-sm text-gray-700">
                  Virtual Care
                </span>
              </div>
            </li>

            <li className="flex items-center justify-center">
              <div className="flex items-center justify-center w-28 h-28 border border-gray-400 rounded-full">
                <span className="text-center text-sm text-gray-700">
                  Personalized
                </span>
              </div>
            </li>
          </ul>
          <div className="font-neue-montreal text-lg flex justify-end items-center space-x-4 mt-8">
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
</div>

        </div>

        {/* Right Section - Image */}
        <div className="hidden lg:block z-10">
          {" "}
          <img src="../images/budget.png" alt="Product" className="max-w-md" />
        </div>
      </div>

      <div id="second-color" className="w-full py-4">
        <div
          ref={marqueeRef}
          className="inline-block text-6xl font-sans whitespace-nowrap"
        >
          <span>Expert Clinical Care, Personalized Just for You&nbsp;</span>
        </div>
      </div>

      <div id="second-color" className="min-h-screen">
        <div className="grid grid-cols-2 max-w-6xl w-full mx-auto">
          {/* Left Column - Gif (Sticky) */}
          <div className="sticky top-0  h-[100vh] p-8">
            <img
              src="../../images/testimonial.gif"
              alt="Logo"
              className="w-full h-auto"
            />
          </div>

          {/* Right Column - Scrollable */}
          <div className="font-neue-montreal p-16 h-auto overflow-y-auto flex flex-col justify-center items-center">
            {/* Coverage */}
            <div className="w-full max-w-md border border-green-300 p-16 mb-24">
              <div className="flex flex-col items-center">
                <div className="flex items-center space-x-4 mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-green-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>

                <h2 className=" text-3xl font-bold text-gray-700">Coverage</h2>

                <p className="font-neue-montreal mt-4 text-center text-gray-500">
                  If you have orthodontic insurance, we’ll help you maximize
                  your lifetime benefits.
                </p>
              </div>
            </div>

            {/* HSA/FSA Box */}
            <div className="w-full max-w-md border border-green-300 p-16 mb-24">
              <div className="flex flex-col items-center">
                <div className="flex items-center space-x-4 mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-green-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>

                <h2 className="text-3xl font-bold text-gray-700">HSA/FSA</h2>

                <p className="font-neue-montreal mt-4 text-center text-gray-500">
                  We accept HSA/FSA to help you save on your orthodontic
                  treatment.
                </p>
              </div>
            </div>

            {/* Out of Network */}
            <div className="w-full max-w-md border border-green-300 p-16">
              <div className="flex flex-col items-center">
                <div className="flex items-center space-x-4 mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-green-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>

                <h2 className="text-3xl font-bold text-gray-700">
                  Out-of-network
                </h2>

                <p className="font-neue-montreal mt-4 text-center text-gray-500">
                  We will help you submit claims for reimbursement based on your
                  insurance plan’s guidelines
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
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
