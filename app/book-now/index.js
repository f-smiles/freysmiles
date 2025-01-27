"use client";
import { motion } from "framer-motion";
import "tw-elements";

const LeftColumn = () => {
  return (
    <div className="flex justify-center items-center px-4">
      <div className="w-full lg:text-left">
        <div className="w-full flex justify-between items-center">
          <h1 className="font-helvetica-neue-light text-[7rem] mb-6">
            <span>Say </span>
            <span className="text-[7rem]">hello</span>
          </h1>
        </div>

        <div className="flex flex-col lg:flex-row items-center lg:items-start justify-between gap-6 mb-10">
          <p className="uppercase font-neue-montreal text-[1.5em]">
            We look forward to hearing from you
          </p>

          <a
            href="#general"
            className="font-neue-montreal inline-block px-10 py-3 border border-black rounded-full hover:bg-black hover:text-white transition whitespace-nowrap flex items-center"
          >
            General
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              className="size-4 ml-2"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="m4.5 4.5 15 15m0 0V8.25m0 11.25H8.25"
              />
            </svg>
          </a>
        </div>

        <div className="text-end lg:text-right space-y-4">
          <a
            className="font-neue-montreal text-lg text-center hover:text-blue-500"
            href="mailto:info@freysmiles.com"
          >
            info@freysmiles.com
          </a>
          <div className="flex text-end lg:justify-end gap-10">
            <div>
              <a
                href="facetime://6104374748"
                className="font-neue-montreal text-lg text-center hover:text-blue-500"
              >
                (610) 437-4748
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const RightColumn = () => {
  return (
    <div className="relative top-0 my-auto overflow-y-auto lg:col-span-2">
      <iframe
        src="https://app.acuityscheduling.com/schedule.php?owner=34613267"
        title="Schedule Appointment"
        className="w-full min-h-[960px] max-h-[100vh] h-full"
      ></iframe>
    </div>
  );
};

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
  );
}
