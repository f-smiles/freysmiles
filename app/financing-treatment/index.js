// "use client";
// import React, { useEffect, useRef } from 'react';
// import { gsap } from 'gsap';
// import { ScrollTrigger } from 'gsap/ScrollTrigger';
// import { MotionPathPlugin } from 'gsap/MotionPathPlugin';

// gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

// const ScrollPath = () => {
//   const ballRef = useRef(null);

//   useEffect(() => {
//     gsap.to(ballRef.current, {
//       scrollTrigger: {
//         trigger: ".sections-container",
//         start: "top top",
//         end: "bottom bottom",
//         scrub: 1,
//       },
//       motionPath: {
//         path: "#path",
//         align: "#path",
//         autoRotate: true,
//         alignOrigin: [0.5, 0.5],
//       },
//     });
//   }, []);

//   return (
//     <div className="">
//         <header>
//     <h1 class="page-title">
//       <div class='revealer'>
//         <div class='revealer-inner'>Cassie Evans</div>
//       </div>
//       <div class='page-title-secondary revealer'>
//         <div class='revealer-inner'>Keyframers</div>
//       </div>
//     </h1>
//   </header>
//   <figure>
//       <figcaption class='revealer'>
//         <div class='revealer-inner'>And this dress</div>
//       </figcaption>
//       <div class="revealer">
//         <img class='revealer-img' src="https://images.unsplash.com/photo-1602741070475-fc55f644c3f7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxNDU4OXwwfDF8cmFuZG9tfHx8fHx8fHx8MTYyMTA4ODI5MA&ixlib=rb-1.2.1&q=80&w=400" alt="" />
//       </div>
//     </figure>

//     <figure>
//       <figcaption class='revealer'>
//         <div class='revealer-inner'>Also this blouse</div>
//       </figcaption>
//       <div class="revealer">
//         <img class='revealer-img' src='https://images.unsplash.com/photo-1614282860993-c9f7e9acdf44?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxNDU4OXwwfDF8cmFuZG9tfHx8fHx8fHx8MTYyMTA4Nzk2OQ&ixlib=rb-1.2.1&q=80&w=400' alt=''/>
//       </div>
//     </figure>

//     <figure>
//       <figcaption class='revealer'>
//         <div class='revealer-inner'>The table, actually</div>
//       </figcaption>

//       <div class="revealer">
//         <img class='revealer-img' src='https://images.unsplash.com/photo-1614283232994-7f56849e2359?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxNDU4OXwwfDF8cmFuZG9tfHx8fHx8fHx8MTYyMTA4Nzk2OQ&ixlib=rb-1.2.1&q=80&w=400' alt=''/>
//       </div>
//     </figure>

//     <figure>
//       <figcaption class='revealer'>
//         <div class='revealer-inner'>Whatever she's holding</div>
//       </figcaption>

//       <div class="revealer">
//         <img class='revealer-img' src='https://images.unsplash.com/photo-1620916927285-21c5218d64a4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxNDU4OXwwfDF8cmFuZG9tfHx8fHx8fHx8MTYyMTA4ODI5MA&ixlib=rb-1.2.1&q=80&w=400' alt=''/>
//       </div>
//     </figure>
// <svg  style={{
//     display: 'block',
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     width: '100%',
//     height: '100%',
//   }}
//   preserveAspectRatio="xMidYMid slice"
//   fillRule="evenodd"
//   strokeMiterlimit="1.5"
//   clipRule="evenodd"
//   viewBox="0 0 2132 5344">
//      <defs>
//     <mask id="stroke-mask">
//       <path
//         id="path"
//         fill="none"
//         stroke="white"
//         strokeWidth="5"
//         d="M324.813-52.135C204.651 65.523 458.362 173.469 601.765 189.285c169.887 18.737 410.22-29.224 520.966-82.617 100.731-48.564 154.809-138.521 101.624-165.772-55.127-28.247-560.763 155.569-415.777 300.554 49.997 49.998 502.244 145.465 784.213 38.725 155.512-58.87 188.43-160.067 172.708-189.71-27.518-51.882-247.239 28.961-305.985 65.473-276.859 172.073-515.191 899.522-201.638 1338.54 206.052 288.502 827.828 487.908 785.773 164.706-17.293-132.902-272.903-149.223-367.935-88.64-113.522 72.37-335.863 193.745-231.163 504.727 88.882 264 678.637 273.92 544.444 558.087-147.028 311.346-586.597 149.888-757.298 124.559-379.379-56.295-803.402-136.829-955.247 297.618-59.843 171.216-44.961 489.493 70.837 631.153 162.443 198.723 459.583-129.982 369.648-294.59-96.415-176.467-322.65 22.711-396.282 105.313-97.708 109.612-166.931 399.956-39.123 502.579 267.219 214.564 622.086-28.76 831.909 21.963 561.219 135.67 235.391 679.206 457.463 917.719 221.323 237.708 654.322-95.359 407.084-266.334-358.912-248.2-527.841 403.197-687.761 495.191-241.38 138.854-374.262-119.763-602.689-142.606-73.378-7.337-157.751-.818-224.685 31.794-15.142 7.378-52.177 37.97-69.586 37.97"
//       />
//     </mask>
//   </defs>

//   <path
//     id="path"
//     stroke="grey"
//     mask="url(#stroke-mask)"
//     strokeDasharray="20"
//     strokeDashoffset="var(--dashOffset)"
//     fill="none"
//     strokeWidth="5"
//     d="M324.813-52.135C204.651 65.523 458.362 173.469 601.765 189.285c169.887 18.737 410.22-29.224 520.966-82.617 100.731-48.564 154.809-138.521 101.624-165.772-55.127-28.247-560.763 155.569-415.777 300.554 49.997 49.998 502.244 145.465 784.213 38.725 155.512-58.87 188.43-160.067 172.708-189.71-27.518-51.882-247.239 28.961-305.985 65.473-276.859 172.073-515.191 899.522-201.638 1338.54 206.052 288.502 827.828 487.908 785.773 164.706-17.293-132.902-272.903-149.223-367.935-88.64-113.522 72.37-335.863 193.745-231.163 504.727 88.882 264 678.637 273.92 544.444 558.087-147.028 311.346-586.597 149.888-757.298 124.559-379.379-56.295-803.402-136.829-955.247 297.618-59.843 171.216-44.961 489.493 70.837 631.153 162.443 198.723 459.583-129.982 369.648-294.59-96.415-176.467-322.65 22.711-396.282 105.313-97.708 109.612-166.931 399.956-39.123 502.579 267.219 214.564 622.086-28.76 831.909 21.963 561.219 135.67 235.391 679.206 457.463 917.719 221.323 237.708 654.322-95.359 407.084-266.334-358.912-248.2-527.841 403.197-687.761 495.191-241.38 138.854-374.262-119.763-602.689-142.606-73.378-7.337-157.751-.818-224.685 31.794-15.142 7.378-52.177 37.97-69.586 37.97"
//   />

// </svg>
//       <div
//         ref={ballRef}
//         className="absolute w-10 h-10 bg-blue-500 rounded-full"
//         style={{ top: 0, left: '90px' }}
//       />
//     </div>
//   );
// };
// export default ScrollPath;

"use client";
import React, {useState, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger, MotionPathPlugin } from "gsap/all";

gsap.registerPlugin(MotionPathPlugin, ScrollTrigger);


const HeaderBanner = () => {
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
        }
      });
    };

    const timelineBlocks = document.querySelectorAll(".cd-timeline-block");
    timelineBlocks.forEach((block) => {
      const top = block.getBoundingClientRect().top;
      if (top > window.innerHeight * 0.75) {
        block.querySelector(".cd-timeline-img").classList.add("is-hidden");
        block.querySelector(".cd-timeline-content").classList.add("is-hidden");
      }
    });

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div>
      <div className="bg-gray-50 flex items-center justify-between px-8 py-16 lg:px-16 xl:px-24 lg:py-32 relative">
        {/* Centered Cylinder Image */}
        {/* <img
    className="absolute left-1/2 transform -translate-x-1/2 object-contain w-1/2 h-1/2 opacity-90"
    src="../../images/orangecylinder.svg"
    alt="Cylinder"
  /> */}

        {/* Left Section */}
        <div className="max-w-lg z-10">
          {" "}
          {/* Add z-10 to bring the content above the image */}
          <h1 className="text-4xl font-bold font-neue-montreal text-gray-900 leading-snug">
            Your care plan is tailored{" "}
            <span className="text-gray-500 italic">to your needs,</span> and
            biology
          </h1>
          <ul className="font-neue-montreal mt-6 flex space-x-8">
      <li className="flex items-center justify-center">
        <div className="flex items-center justify-center w-28 h-28 border border-gray-400 rounded-full">
          <span className="text-center text-sm text-gray-700">Effective</span>
        </div>
      </li>

      <li className="flex items-center justify-center">
        <div className="flex items-center justify-center w-28 h-28 border border-gray-400 rounded-full">
          <span className="text-center text-sm text-gray-700">Virtual Care</span>
        </div>
      </li>

      <li className="flex items-center justify-center">
        <div className="flex items-center justify-center w-28 h-28 border border-gray-400 rounded-full">
          <span className="text-center text-sm text-gray-700">Personalized</span>
        </div>
      </li>
    </ul>

    <div className="font-neue-montreal text-lg flex items-center space-x-4 mt-8">
  <button className="px-6 py-3">
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
        transform: hover ? 'translateX(0)' : 'translateX(-3px)',
        transition: 'all 0.35s ease',
      }}
    />
    <path
      d="M0 5.4h9.7v2H0z"
      className="tail"
      style={{
        transform: hover ? 'translateX(0)' : 'translateX(5px)',
        transition: 'all 0.35s ease',
      }}
    />
  </svg>
</div>

        </div>

        {/* Right Section - Image */}
        <div className="hidden lg:block z-10">
          {" "}
          {/* Add z-10 to bring the content above the image */}
          <img src="../images/budget.png" alt="Product" className="max-w-md" />
        </div>
      </div>

      <div></div>
      {/* Timeline Section */}

      <div className="py-16 px-8 bg-cover bg-center" id="tracking-section" style={{ backgroundImage: "url('../images/background_min.png')" }}>
        <div
          id="element"
          className="absolute w-12 h-12 bg-black rounded-full top-0 left-0"
        ></div>

        <section
          id="cd-timeline"
          className="relative mx-auto w-[90%] max-w-[1170px]"
        >
          {/* Vertical line */}
          <div className="absolute left-1/2 top-0 h-full w-[2px] bg-gray-300 hidden lg:block"></div>

          {/* Section 1 (Left Aligned) */}
          <div className="cd-timeline-block relative my-8 flex lg:flex-row-reverse">
            <div className="cd-timeline-img absolute left-1/2 transform -translate-x-1/2 top-0 w-10 h-10  flex items-center justify-center">
              <img
                src="../images/starbullet.svg"
                alt="Location"
                className="w-15 h-15"
              />
            </div>
            <div
              className="py-10 cd-timeline-content relative ml-16 lg:ml-0 lg:w-[45%] p-4 "
              style={{
                background:
                  "linear-gradient(183deg, hsla(240, 9%, 98%, 0.4) 26.79%, rgba(233, 237, 245, 0.4))",
                backdropFilter: "blur(3px)",
                WebkitBackdropFilter: "blur(3px)",
                borderRadius: "6px",
                border: "1px solid rgba(255, 255, 255, 0.2)",
              }}
            >
              <h2 className="text-3xl text-center font-oakes-regular ">
                Complimentary Consultation
              </h2>
              <p className="text-gray-700 text-md text-center my-4">
                Initial consultations are always free of charge
              </p>
              <a
                href="#0"
                className="float-right text-white bg-black px-4 py-2 rounded-full hover:bg-gray-300"
              >
                Book Now
              </a>
              <span className="block text-gray-400 text-sm mt-2"></span>
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

            <div
              className="py-10 cd-timeline-content relative ml-16 lg:ml-0 lg:w-[45%] p-4 "
              style={{
                background:
                  "linear-gradient(183deg, hsla(240, 9%, 98%, 0.4) 26.79%, rgba(233, 237, 245, 0.4))",
                backdropFilter: "blur(3px)",
                WebkitBackdropFilter: "blur(3px)",
                borderRadius: "6px",
                border: "1px solid rgba(255, 255, 255, 0.2)",
              }}
            >
              <h2 className="text-3xl  font-oakes-regular text-center ">
                Explore Flexible Ways to Pay
              </h2>
              <p className="text-gray-700 text-md text-center my-4">
                Choose from flexible payment plans or enjoy 10% off when you pay
                in full prior to starting treatment
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

          {/* Section 3 (Left Aligned) */}
          <div className="cd-timeline-block relative my-8 flex lg:flex-row-reverse">
            <div className="cd-timeline-img absolute left-1/2 transform -translate-x-1/2 top-0 w-10 h-10  flex items-center justify-center">
              <img
                src="../images/starbullet.svg"
                alt="Location"
                className="w-15 h-15"
              />
            </div>
            <div
              className="py-10 cd-timeline-content relative ml-16 lg:ml-0 lg:w-[45%] p-4 "
              style={{
                background:
                  "linear-gradient(183deg, hsla(240, 9%, 98%, 0.4) 26.79%, rgba(233, 237, 245, 0.4))",
                backdropFilter: "blur(3px)",
                WebkitBackdropFilter: "blur(3px)",
                borderRadius: "6px",
                border: "1px solid rgba(255, 255, 255, 0.2)",
              }}
            >
              <h2 className="text-3xl text-center font-oakes-regular">
                Caring Tradition{" "}
              </h2>
              <p className="text-gray-700 text-md my-4 text-center">
                Successive family members always receive the same excellent
                care. Ask about our family courtesies
              </p>
              <a
                href="#0"
                className="float-right text-blue-500 bg-gray-200 px-4 py-2 rounded-full hover:bg-gray-300"
              >
                Read more
              </a>
              <span className="block text-gray-400 text-sm mt-2"></span>
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
            <div
              className="py-10 cd-timeline-content relative ml-16 lg:ml-0 lg:w-[45%] p-4 "
              style={{
                background:
                  "linear-gradient(183deg, hsla(240, 9%, 98%, 0.4) 26.79%, rgba(233, 237, 245, 0.4))",
                backdropFilter: "blur(3px)",
                WebkitBackdropFilter: "blur(3px)",
                borderRadius: "6px",
                border: "1px solid rgba(255, 255, 255, 0.2)",
              }}
            >
              <h2 className="text-3xl text-center font-oakes-regular">
                Post-Op Care
              </h2>
              <p className="text-gray-700 text-md text-center my-4">
                Your treatment includes one year of follow-up care
              </p>
              <span className="block text-gray-400 text-sm mt-2"></span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default HeaderBanner;
