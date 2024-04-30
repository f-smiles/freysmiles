'use client'
import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

const Line = () => {

  const variants = {
    hidden: {
      scaleX: 0.1,
      x: -1200,
      opacity: 0
    },
    visible: {
      scaleX: 1,
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut" 
      }
    }
  };
  const path = useRef(null);
  let progress = 0;
  let x = 0.5;
  let time = Math.PI / 2;
  let reqId = null;

  useEffect(() => {
    refs.current.forEach((el, index) => {
      const isRightSide = index % 2 === 0;

      gsap.set(el, {
        borderRightColor: isRightSide ? 'transparent' : 'initial',
        borderLeftColor: isRightSide ? 'initial' : 'transparent',
        borderBottomColor: 'transparent'
      });

      ScrollTrigger.create({
        trigger: el,
        start: 'top center',
        end: 'bottom center',
        onEnter: () => animateBorder(el, isRightSide),
        onLeaveBack: () => resetBorder(el, isRightSide)
      });
    });
  }, []);

  const animateBorder = (element, isRightSide) => {
    const timeline = gsap.timeline();
    
    if (isRightSide) {
      timeline.to(element, { borderRightColor: '#4B5563', duration: 1 });
    } else {
      timeline.to(element, { borderLeftColor: '#4B5563', duration: 1 });
    }

    timeline.to(element, { borderBottomColor: '#4B5563', duration: 1 }, '+=0.5');
  };

  const resetBorder = (element, isRightSide) => {
    gsap.to(element, {
      borderRightColor: isRightSide ? 'transparent' : 'initial',
      borderLeftColor: isRightSide ? 'initial' : 'transparent',
      borderBottomColor: 'transparent',
      duration: 1
    });
  };
  const [isOpen, setIsOpen] = useState(true);
 
  const shutterRef = useRef(null);

  const toggleShutter = () => {
    setIsOpen((prevState) => !prevState);
  };

  useEffect(() => {
    const container = shutterRef.current;
    if (!container) return;

    container.classList.add("c-shutter--opening");
    container.classList.remove("c-shutter--closing", "c-shutter--closed");

    const initialTimer = setTimeout(() => {
      setIsOpen(false);
    });

    return () => clearTimeout(initialTimer);
  }, []);
  // useEffect(() => {
  //   gsap.registerPlugin(ScrollTrigger);

  //   const path = document.querySelector('#stroke');
  //   const pathLength = path.getTotalLength();
  //   gsap.set("#stroke", { strokeDasharray: pathLength, strokeDashoffset: pathLength });

  //   gsap.to("#stroke", {
  //     strokeDashoffset: 0, 
  //     ease: "none",
  //     scrollTrigger: {
  //       trigger: "#page",
  //       start: "top top", 
  //       end: "bottom bottom", 
  //       scrub: 1 
  //     }
  //   });
  // }, []);

  return (
    <div 
    className="shutter-container "
    style={{
      "--color-foreground": "#dcdce8",
      "--delay": 10,
    }}>
       <ul ref={shutterRef} className="z-10 c-shutter">
            {[...Array(10)].map((_, i) => (
              <li key={i} className="c-shutter__slat"></li>
            ))}
          </ul>
      
    <div  className="mt-40 mx-auto p-1 w-3/5">
      {/* <div className="flex -ml-20"><img src="../images/lime_worm.svg"></img></div> */}
      <div  ref={addToRefs} className="relative border-b border-gray-600 py-8 pl-12 pr-12 border-r border-gray-600" >
        <h3 className="font-altero uppercase py-5 text-6xl">Complimentary Consultation</h3>
        <div className="absolute top-1/2 transform -translate-y-1/2 translate-x-1/2 rounded-full border border-[#BEFC24] bg-[#BEFC24]  text-center p-3 right-0" style={{ height: '1.6rem', width: '1.6rem' }}></div>
        <p className="pt-2">Initial consultations are always free of charge.</p>
      </div>
  
    
  
    </div>
  </div>
  
    // <motion.div
    //   className="line"
    //   variants={variants}
    //   initial="hidden"
    //   animate="visible"
    //   style={{
    //     originX: 0, 
    //     backgroundColor: 'red',
    //     height: '5px',
    //     width: '100%',
    //   }}
    // />

    
  );
};

export default Line;
