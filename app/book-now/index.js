"use client";
import { motion } from "framer-motion";
import "tw-elements";

const LeftColumn = () => {
  return (
    <div className="my-auto lg:sticky lg:top-0 lg:pt-0 lg:col-span-1">
      <div className="flex flex-col justify-center space-y-4">
        <h1 className="font-bold text-center text-8xl font-aileron">LET&apos;S GO</h1>

        <a
          href="facetime://6104374748"
          className="text-lg text-center text-blue-500"
        >
          (610) 437-4748
        </a>

          <a className="text-lg text-center text-blue-500 hover:text-blue-500" href="mailto:info@freysmiles.com">
            info@freysmiles.com
          </a>

        <div className="w-full my-4 border-t border-gray-400"></div>

        <div className="flex space-x-4">
          <a href="#" className="text-lg">
            <i className="fab fa-instagram"></i>
          </a>
          <a href="#" className="text-lg">
            <i className="fab fa-facebook"></i>
          </a>
          <a href="#" className="text-lg">
            <i className="fab fa-tiktok"></i>
          </a>
        </div>
      </div>
    </div>
  );
};

const RightColumn = () => {
  return (
    <div className="relative top-0 my-auto overflow-y-auto lg:col-span-2">
      <iframe src="https://app.acuityscheduling.com/schedule.php?owner=33979021&ref=embedded_csp" title="Schedule Appointment" className="w-full min-h-[960px] max-h-[100vh] h-full"></iframe>
    </div>
  )
}

export default function BookNow() {
  return (
    <section className="font-helvetica-now-thin bg-center h-[100vh] bg-[#E7E7E7]">
      <motion.div
        initial={{ clipPath: `circle(0% at 50% 50%)` }}
        animate={{ clipPath: `circle(100% at 50% 50%)` }}
        transition={{ duration: 2, ease: "easeOut" }}
        className="flex items-center justify-center w-full h-full"
      >
        <div className="grid h-full grid-cols-1 gap-8 py-24 lg:py-36 lg:grid-cols-3">
          <LeftColumn />
          <RightColumn />
        </div>
      </motion.div>
    </section>
  )
}