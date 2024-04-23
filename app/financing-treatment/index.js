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
    setPath(progress);
  }, [])

  const setPath = (progress) => {
    const width = window.innerWidth * 0.7;
    path.current.setAttributeNS(null, "d", `M0 250 Q${width * x} ${250 + progress}, ${width} 250`)
  }

  const lerp = (x, y, a) => x * (1 - a) + y * a

  const manageMouseEnter = () => {
    if(reqId){
      cancelAnimationFrame(reqId)
      resetAnimation()
    }
  }

  const manageMouseMove = (e) => {
    const { movementY, clientX } = e;
    const pathBound =  path.current.getBoundingClientRect();
    x = (clientX - pathBound.left) / pathBound.width;
    progress+= movementY
    setPath(progress);
  }

  const manageMouseLeave = () => {
    animateOut();
  }

  const animateOut = () => {
    const newProgress = progress * Math.sin(time);
    progress = lerp(progress, 0, 0.025);
    time+=0.2;
    setPath(newProgress);
    if(Math.abs(progress) > 0.75){
      reqId = requestAnimationFrame(animateOut);
    }
    else{
      resetAnimation();
    }
  }

  const resetAnimation = () => {
    time = Math.PI / 2;
    progress = 0;
  }

  return (
    <div className="containerline">
    <div className="body">
      <div className="line">
        <div onMouseEnter={() => {manageMouseEnter()}} onMouseMove={(e) => {manageMouseMove(e)}} onMouseLeave={() => {manageMouseLeave()}} className="box"></div>
        <svg>
          <path ref={path}></path>
        </svg>
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
