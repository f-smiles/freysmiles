import React from 'react';
const Marquee = () => {
  const items = [{ word: "Click here to shop gift cards" }, { word: "Click here to shop gift cards" }];

  return (
    <div className="relative flex  overflow-hidden py-5">
      <div className="flex min-w-max animate-marquee hover:[animation-play-state:paused]">
        {[...items, ...items].map((item, index) => (
          <div
            key={index}
            className="px-4 text-[1em] font-neue-montreal whitespace-nowrap"
          >
            {item.word}
          </div>
        ))}
      </div>
    </div>
  );
};

const Hero: React.FC = () => {
  const letters = [
    {
      char: "S",
      rotate: "rotate-12",
      translateY: "translate-y-0",
      color: "text-black",
    },
    {
      char: "H",
      rotate: "rotate-12",
      translateY: "translate-y-20",
      color: "text-black",
    },
    {
      char: "O",
      rotate: "rotate-6",
      translateY: "translate-y-2",
      color: "text-black",
    },
    {
      char: "P",
      rotate: "rotate-2",
      translateY: "translate-y-20",
      translateX: "translate-x-2",
      color: "text-black",
    },
  ];

  const lettersNow = [
    {
      char: "N",
      rotate: "rotate-12",
      translateY: "translate-y-1",
      color: "text-black",
    },
    {
      char: "O",
      rotate: "rotate-12",
      translateY: "translate-y-5",
      color: "text-black",
    },
    {
      char: "W",
      rotate: "rotate-6",
      translateY: "translate-y-1",
      color: "text-black",
    },
  ];

  return (
    <div className="bg-[#FCFAF5]">
       <div className="flex justify-center px-4">
       <section className="w-full min-h-screen grid grid-cols-2">
      <div className="relative w-full h-full">
        <img
          src="../images/shoptest1.png" 
          alt="mockup"
          className="w-full h-full object-cover"
        />
      </div>


      <div className="flex flex-col items-center justify-center px-12 text-center bg-white">
        <h1 className="text-6xl font-helvetica-neue-light leading-tight">
          Shop <br /> Now
        </h1>

        <p className="font-helvetica-neue-light mt-6 text-lg text-gray-700 max-w-md">
        Something exciting is coming. <br />
          Stay tuned for our next offer.
        </p>


        <div className="absolute bottom-10 right-10">
          <img
            src=""
            alt="Gradient Blob"
            className="w-32 h-32"
          />
        </div>
      </div>
    </section>
</div>
<Marquee />


<div >
      {/* <div className="shop-marquee">
        <div className="shop-marquee-track">
          {[...Array(20)].map((_, index: number) => (
            <React.Fragment key={index}>
              <img
              className=" w-6"
                src="../images//bullet-point.svg"
                loading="lazy"
                
              />
              <p className="font-neue-montreal shop-marquee-text">Click Here to Shop Gift Cards </p>
            </React.Fragment>
          ))}
        </div>
      </div> */}
      </div>

      <div >
      <div  className="mt-10 products_title_container">

        <div className="filter_wrapper">
          <h5 className="small_heading light">Filter by category</h5>
          <div className="filter_links_container">
            <a href="#clean" className="inner-link filter">Clean</a>
            <a href="#treat" className="inner-link filter">Treat</a>
            <a href="#whiten" className="inner-link filter">Whiten</a>
          </div>
        </div>

      </div>
      <section
  className="font-neue-montreal h-[50vh] flex flex-col items-center justify-center text-center px-6"
>
  <div className="max-w-3xl">
    <div className="text-5xl font-medium text-gray-900 leading-tight mb-4">
      Wellbeing starts with well doing.
    </div>
    <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-6 leading-snug font-neue-montreal">
      We’ve carefully curated a selection of premium products designed to elevate your 
      experience during treatment. From gentle yet effective whitening solutions to 
      comfort-enhancing essentials, each product is handpicked to support your journey 
      to a healthier, more confident smile. Shop smarter, smile brighter.
    </p>
  </div>

  <div className="h-[1px] w-[85vw] bg-gray-300 mt-6"></div>

</section>


    </div>
    </div>
  );


}

export default Hero;
