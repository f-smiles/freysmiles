"use client";
import { ScrollSmoother } from "gsap-trial/ScrollSmoother";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { gsap, Power3 } from "gsap-trial";

gsap.registerPlugin(ScrollTrigger);

const Braces = () => {
  const [activeAccordionIndex, setActiveAccordionIndex] = useState(null);
  const containerRef = useRef(null);
  const imageRef = useRef(null);

  const slide = [
    {
      title: "Brush and Floss",
      imageUrl: "../images/purplefloss.jpeg",
      text: "Brushing and flossing during orthodontic treatment is more important than ever. Orthodontic appliances such as clear aligners, brackets, and wires interfere with normal self-cleansing mechanisms of the mouth. Research shows that only 10% of patients brush and floss consistently during active treatment. We're here to ensure you don't just get lost in the statistics.",
    },
    {
      title: "General Soreness",
      imageUrl: "../images/soreness.jpg",
      text: "When you get your braces on, you may feel general soreness in your mouth and teeth may be tender to biting pressures for 3 –5 days. Take Tylenol or whatever you normally take for headache or discomfort. The lips, cheeks and tongue may also become irritated for one to two weeks as they toughen and become accustomed to the braces. We will supply wax to put on the braces in irritated areas to lessen discomfort.",
    },
    {
      title: "Loose teeth",
      imageUrl: "../images/lime_worm.svg",
      text: "This is to be expected throughout treatment. The teeth must loosen first so they can move. The teeth will settle into the bone and soft tissue in their desired position after treatment is completed if retainers are worn correctly.",
    },
    {
      title: "Loose wire/band",
      imageUrl: "../images/lime_worm.svg",
      text: "When crowding and/or significant dental rotations is the case initially, a new wire placed at the office may eventually slide longer than the last bracket. In this case, depending on the orientation of the last tooth, it may poke into your cheek or gums. If irritation to the lips or You  can place orthodontic wax on the wire to reduce prevent stabbing. If the wire doesn't settle in on its own, it will benefit from being clipped within two weeks. Call our office to schedule an appointment.",
    },
    {
      title: "Rubberbands",
      imageUrl: "../images/lime_worm.svg",
      text: "To successfully complete orthodontic treatment, the patient must work together with the orthodontist. If the doctor has prescribed rubber bands it will be necessary for you to follow the prescription for an ideal result. Failure to follow protocol will lead to a less than ideal treatment result. Excessive broken brackets will delay treatment and lead to an incomplete result. Compromised results due to lack of compliance is not grounds for financial reconciliation. ",
    },
    {
      title: "Athletics",
      imageUrl:
        "https://i.postimg.cc/g09w3j9Q/e21673ee1426e49ea1cd7bc5b895cbec.jpg",
      text: "Braces and mouthguards typically don't mix. Molded mouthguards will prevent planned tooth movement. If you require a mouthguard for contact sports, we stock ortho-friendly mouthguards which may work. ",
    },
    {
      title: "How long will I be in braces?",
      imageUrl:
        "https://i.postimg.cc/T35Lymsn/597b0f5fc5aa015c0ca280ebd1e4293b.jpg",
      text: "Every year hundreds of parents trust our experience to provide beautiful, healthy smiles for their children. Deepending on case complexity and compliance, your time in braces may vary, but at FreySmiles Orthodontics case completion may only be typically only 12-22 months away.",
    },
    {
      title: "Eating with braces",
      imageUrl:
        "https://i.postimg.cc/NMB5Pnjx/62f64bc801260984785ff729f001a120.gif",
      text: "Something to keep in mind with braces is to take caution when eating hard foods, i.e., tough meats,hard breads, granola, and the like.  But you’ll need to protect yourorthodontic appliances when you eat for as long as you’re wearing braces.",
    },
  ];


  return (
    <>
      <div className="flex h-screen">
        <div className="flex flex-col w-1/3">
          <img
            src="../images/damon1.png"
            alt="Placeholder 1"
            className="w-full h-1/3 object-cover"
          />
          <img
            src="../images/kinziebw.png"
            alt="Placeholder 3"
            className="w-full h-1/3 object-cover"
          />
          <img
            src="../images/toothbw.png"
            alt="Placeholder 2"
            className="w-full h-1/3 object-cover"
          />
        </div>

        <div className="w-2/3 bg-[#F1EFEB] flex flex-col justify-between p-10">
          <header className="flex justify-between items-center">
            <h1 className="text-[80px] text-black font-neue-montreal">
              Damon Braces
            </h1>
          </header>

          <div className="flex justify-end mt-10">
      
            <div className="font-neue-montreal space-y-10 text-right w-1/3">
              <div className="relative ">
                <div className="flex justify-between">
                  <span className="text-sm font-neue-montreal">01</span>
                  <span className="text-sm ml-4">
                    Precise control for faster results
                  </span>
                </div>
                <div className="absolute bottom-0 left-0 h-[1px] bg-black w-full"></div>
              </div>
              <div className="relative">
                <div className="flex justify-between">
                  <span className="text-sm font-neue-montreal">02</span>
                  <span className="text-sm ml-4">
                    Door design minimizes discomfort
                  </span>
                </div>
                <div className="absolute bottom-0 left-0 h-[1px] bg-black w-full"></div>
              </div>
              <div className="relative">
                <div className="flex justify-between">
                  <span className="text-sm font-neue-montreal">03</span>
                  <span className="text-sm ml-4">
                    Decreased chair time, faster finishing
                  </span>
                </div>
                <div className="absolute bottom-0 left-0 h-[1px] bg-black w-full"></div>
              </div>
              <div className="relative">
                <div className="flex justify-between">
                  <span className="text-sm font-neue-montreal">04</span>
                  <span className="text-sm ml-4">
                    Trusted by professionals worldwide
                  </span>
                </div>
                <div className="absolute bottom-0 left-0 h-[1px] bg-black w-full"></div>
              </div>
            </div>
          </div>
          {/* <div className="w-36 h-36">
  <img src="../images/pointystar.svg" alt="Pointy Star" className="w-full h-full object-contain" />
</div> */}

          <div className="mt-10">
            
            <p className="text-[20px] font-neue-montreal">
              We're the leading experts and top providers in the area of this
              passive, self-ligating system. Damon braces use a slide mechanism
              to hold the archwire, reducing the amount of pressure exerted on
              the teeth and allowing the teeth to move more freely, quickly, and
              comfortably.
            </p>
          </div>
          
        </div>
      </div>
      <div>
      <div className="left-[90px] w-48 h-48">
    <img
      src="../images/pointystar.svg"
      alt="Pointy Star"
      className="w-full h-full object-contain"
    />
  </div>
      </div>
    </>
  );
};

export default Braces;
