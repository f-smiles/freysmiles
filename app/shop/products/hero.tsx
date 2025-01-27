import React from 'react';

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
       <div className="flex justify-center py-16 px-4">
  <div className="bg-black max-w-7xl w-full rounded-2xl relative flex">

    <section className="w-1/2 flex flex-col justify-center items-center">
      <div
        className="relative w-full flex justify-center items-center"
        style={{ height: "45%" }}
      >
        <div className="absolute flex flex-wrap justify-center font-helvetica-neue-light">
          {letters.map((style, index) => (
            <span
              key={index}
              className={`text-white inline-block ${style.rotate} ${style.translateY} ${style.translateX} ${style.color} mx-1`}
              style={{ fontSize: "6rem" }}
            >
              {style.char}
            </span>
          ))}
        </div>
      </div>

      <div
        className="relative w-full flex justify-center items-center"
        style={{ height: "35%" }}
      >
        <div className="absolute flex justify-center font-neue-light">
          {lettersNow.map((style, index) => (
            <span
              key={`now-${index}`}
              className={`text-white inline-block ${style.rotate} ${style.translateY} ${style.color}`}
              style={{ fontSize: "6rem" }}
            >
              {style.char}
            </span>
          ))}
        </div>
      </div>
      
    </section>


    <section className="w-1/2 flex items-center justify-center">
      <img src="../images/shop.png" alt="Shop" className="rounded-xl" />
    </section>
  </div>
</div>



<div >
      <div className="shop-marquee">
        <div className="shop-marquee-track">
          {[...Array(20)].map((_, index: number) => (
            <React.Fragment key={index}>
              <img
              className=" w-6"
                src="../images//bullet-point.svg"
                loading="lazy"
                
              />
              <p className="font-neue-montreal shop-marquee-text">Click Here to Shop Gift Cards</p>
            </React.Fragment>
          ))}
        </div>
      </div>
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
    </div>
    </div>
  );


}

export default Hero;
