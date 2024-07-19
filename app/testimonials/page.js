'use client';
import { useEffect, useState } from "react";
import Scene from "./scene.js";
import Projects from "./projects.js";
import Lenis from '@studio-freight/lenis';
export default function Home() {

  const [activeMenu, setActiveMenu] = useState(null)
  useEffect( () => {
    const lenis = new Lenis()

    function raf(time) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)
  }, [])

  return (
    <main className="bg-green-100">
      <div className="h-[50vh]"></div>
      <Projects setActiveMenu={setActiveMenu}/>
      <Scene activeMenu={activeMenu}/>
      <div className="h-[50vh]"></div>
    </main>
  );
}