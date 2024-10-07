"use client";
import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';

gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

const ScrollPath = () => {
  const ballRef = useRef(null);

  useEffect(() => {
    gsap.to(ballRef.current, {
      scrollTrigger: {
        trigger: ".sections-container",
        start: "top top",
        end: "bottom bottom",
        scrub: 1,
      },
      motionPath: {
        path: "#path", // Link to your SVG path's ID
        align: "#path",
        autoRotate: true,
        alignOrigin: [0.5, 0.5],
      },
    });
  }, []);

  return (
    <div className="">
        <header>
    <h1 class="page-title">
      <div class='revealer'>
        <div class='revealer-inner'>Cassie Evans</div>
      </div>
      <div class='page-title-secondary revealer'>
        <div class='revealer-inner'>Keyframers</div>
      </div>
    </h1>
  </header>
  <figure>
      <figcaption class='revealer'>
        <div class='revealer-inner'>And this dress</div>
      </figcaption>
      <div class="revealer">
        <img class='revealer-img' src="https://images.unsplash.com/photo-1602741070475-fc55f644c3f7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxNDU4OXwwfDF8cmFuZG9tfHx8fHx8fHx8MTYyMTA4ODI5MA&ixlib=rb-1.2.1&q=80&w=400" alt="" />
      </div>
    </figure>

    <figure>
      <figcaption class='revealer'>
        <div class='revealer-inner'>Also this blouse</div>
      </figcaption>
      <div class="revealer">
        <img class='revealer-img' src='https://images.unsplash.com/photo-1614282860993-c9f7e9acdf44?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxNDU4OXwwfDF8cmFuZG9tfHx8fHx8fHx8MTYyMTA4Nzk2OQ&ixlib=rb-1.2.1&q=80&w=400' alt=''/>
      </div>
    </figure>

    <figure>
      <figcaption class='revealer'>
        <div class='revealer-inner'>The table, actually</div>
      </figcaption>

      <div class="revealer">
        <img class='revealer-img' src='https://images.unsplash.com/photo-1614283232994-7f56849e2359?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxNDU4OXwwfDF8cmFuZG9tfHx8fHx8fHx8MTYyMTA4Nzk2OQ&ixlib=rb-1.2.1&q=80&w=400' alt=''/>
      </div>
    </figure>

    <figure>
      <figcaption class='revealer'>
        <div class='revealer-inner'>Whatever she's holding</div>
      </figcaption>

      <div class="revealer">
        <img class='revealer-img' src='https://images.unsplash.com/photo-1620916927285-21c5218d64a4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxNDU4OXwwfDF8cmFuZG9tfHx8fHx8fHx8MTYyMTA4ODI5MA&ixlib=rb-1.2.1&q=80&w=400' alt=''/>
      </div>
    </figure>
<svg  style={{
    display: 'block',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  }}
  preserveAspectRatio="xMidYMid slice"
  fillRule="evenodd"
  strokeMiterlimit="1.5"
  clipRule="evenodd"
  viewBox="0 0 2132 5344">
     <defs>
    <mask id="stroke-mask">
      <path
        id="path"
        fill="none"
        stroke="white"
        strokeWidth="5"
        d="M324.813-52.135C204.651 65.523 458.362 173.469 601.765 189.285c169.887 18.737 410.22-29.224 520.966-82.617 100.731-48.564 154.809-138.521 101.624-165.772-55.127-28.247-560.763 155.569-415.777 300.554 49.997 49.998 502.244 145.465 784.213 38.725 155.512-58.87 188.43-160.067 172.708-189.71-27.518-51.882-247.239 28.961-305.985 65.473-276.859 172.073-515.191 899.522-201.638 1338.54 206.052 288.502 827.828 487.908 785.773 164.706-17.293-132.902-272.903-149.223-367.935-88.64-113.522 72.37-335.863 193.745-231.163 504.727 88.882 264 678.637 273.92 544.444 558.087-147.028 311.346-586.597 149.888-757.298 124.559-379.379-56.295-803.402-136.829-955.247 297.618-59.843 171.216-44.961 489.493 70.837 631.153 162.443 198.723 459.583-129.982 369.648-294.59-96.415-176.467-322.65 22.711-396.282 105.313-97.708 109.612-166.931 399.956-39.123 502.579 267.219 214.564 622.086-28.76 831.909 21.963 561.219 135.67 235.391 679.206 457.463 917.719 221.323 237.708 654.322-95.359 407.084-266.334-358.912-248.2-527.841 403.197-687.761 495.191-241.38 138.854-374.262-119.763-602.689-142.606-73.378-7.337-157.751-.818-224.685 31.794-15.142 7.378-52.177 37.97-69.586 37.97"
      />
    </mask>
  </defs>
 
  <path
    id="path"
    stroke="grey"
    mask="url(#stroke-mask)"
    strokeDasharray="20"
    strokeDashoffset="var(--dashOffset)"
    fill="none"
    strokeWidth="5"
    d="M324.813-52.135C204.651 65.523 458.362 173.469 601.765 189.285c169.887 18.737 410.22-29.224 520.966-82.617 100.731-48.564 154.809-138.521 101.624-165.772-55.127-28.247-560.763 155.569-415.777 300.554 49.997 49.998 502.244 145.465 784.213 38.725 155.512-58.87 188.43-160.067 172.708-189.71-27.518-51.882-247.239 28.961-305.985 65.473-276.859 172.073-515.191 899.522-201.638 1338.54 206.052 288.502 827.828 487.908 785.773 164.706-17.293-132.902-272.903-149.223-367.935-88.64-113.522 72.37-335.863 193.745-231.163 504.727 88.882 264 678.637 273.92 544.444 558.087-147.028 311.346-586.597 149.888-757.298 124.559-379.379-56.295-803.402-136.829-955.247 297.618-59.843 171.216-44.961 489.493 70.837 631.153 162.443 198.723 459.583-129.982 369.648-294.59-96.415-176.467-322.65 22.711-396.282 105.313-97.708 109.612-166.931 399.956-39.123 502.579 267.219 214.564 622.086-28.76 831.909 21.963 561.219 135.67 235.391 679.206 457.463 917.719 221.323 237.708 654.322-95.359 407.084-266.334-358.912-248.2-527.841 403.197-687.761 495.191-241.38 138.854-374.262-119.763-602.689-142.606-73.378-7.337-157.751-.818-224.685 31.794-15.142 7.378-52.177 37.97-69.586 37.97"
  />

</svg>
      <div
        ref={ballRef}
        className="absolute w-10 h-10 bg-blue-500 rounded-full"
        style={{ top: 0, left: '90px' }}
      />
    </div>
  );
};
export default ScrollPath;
