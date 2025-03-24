import React from "react";
const Marquee = () => {
  const items = [
    { word: "Click here to shop gift cards" },
    { word: "Click here to shop gift cards" },
    { word: "Click here to shop gift cards" },
    { word: "Click here to shop gift cards" },
  ];

  return (
    <div className="relative overflow-hidden w-screen bg-[#FCFAF5]">
      <div className="flex animate-marquee min-w-full hover:[animation-play-state:paused]">
        {[...items, ...items].map((item, index) => (
          <div
            key={index}
            className="px-10 text-[1em] font-neue-montreal whitespace-nowrap"
          >
            {item.word}
          </div>
        ))}
      </div>
    </div>
  );
};


const Hero: React.FC = () => {

  const slices = [
    { id: 1, containerHeight: 50, translateY: -420 },
    { id: 2, containerHeight: 50, translateY: -370 },
    { id: 3, containerHeight: 50, translateY: -320 },
    { id: 4, containerHeight: 320, translateY: -0 },
  ];

  return (
    
<div className="bg-[#FCFAF5]">
  <div className="flex justify-center px-4">
    <section className="w-full min-h-screen grid grid-cols-1 md:grid-cols-2">
      <div className="relative w-full h-[50vh] md:h-full">
        <img
          src="../images/shoptest1.png"
          alt="mockup"
          className="w-full h-full object-cover"
        />
        <div className="shop-sectionslice">
          <div className="flex relative flex-col justify-center text-center items-center z-10">
            {slices.map((slice, index) => (
              <div
                key={slice.id}
                style={{
                  height: `${slice.containerHeight}px`,
                  overflow: "hidden",
                }}
              >
                <h1
                  style={{
                    fontFamily: "NeueHaasRoman",
                    fontSize: "100px",
                    color: "#0249FD",
                  }}
                >
                  SHOP
                </h1>
              </div>
            ))}
          </div>
        </div>
      </div>


      <div className="flex flex-col items-center justify-center px-12 text-center h-[50vh] md:h-auto">
        <div className="font-helvetica-neue-light mb-10 text-[#0249FD]">
          Shop smarter, smile brighter.
        </div>

        <h1 className="text-xl font-helvetica-neue-light leading-tight">
          We’ve carefully curated a selection of premium products designed to elevate your experience during treatment...
        </h1>
      </div>
    </section>
  </div>

  <section className="font-neue-montreal pt-10 overflow-hidden">
    <Marquee />
  </section>
</div>

  );
};

export default Hero;
