"use client";
import React, { useState, useRef, useEffect } from "react";
import { gsap } from "gsap-trial";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import emailjs from "@emailjs/browser";
import "tw-elements";
import { Datepicker, Input, initTE } from "tw-elements";
import { init } from "emailjs-com";
import { Disclosure } from "@headlessui/react";

// import classNames from 'classnames';
import { motion, useAnimation } from "framer-motion";

// import Circle from "./svg/Circle"

// init(process.env.REACT_APP_PUBLIC_KEY);
const LeftColumn = () => {
  return (
    <div className="sticky top-0 flex flex-col items-center justify-center h-screen col-span-1">
      <div className="flex flex-col justify-center space-y-4">
        <h1 className="text-8xl font-aileron font-bold">LET'S GO</h1>

        <a
          href="facetime://6104374748"
          className="text-lg text-center text-blue-500"
        >
          (610) 437-4748
        </a>

          <a className="text-lg text-center text-blue-500 hover:text-blue-500" href="mailto:info@freysmiles.com">
            info@freysmiles.com
          </a>
        
        <div className="w-full border-t border-gray-400 my-4"></div>

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

const BookNow = () => {
  const controls = useAnimation();

  useEffect(() => {
    controls.start({ clipPath: `circle(150% at 50% 50%)` });
  }, [controls]);

  const [isFirstNameVisible, setIsFirstNameVisible] = useState(false);
  const [isLastNameVisible, setIsLastNameVisible] = useState(false);
  const [patient_name, setPatientName] = useState("");
  const [patient_lastName, setPatientLastName] = useState("");
  const [guardian_name, setGuardianName] = useState("");
  const [phone_number, setPhoneNumber] = useState("");
  const [appointment_types, setAppointmentTypes] = useState("");
  const [appointment_locations, setAppointmentLocations] = useState("");
  const [email, setEmail] = useState("");
  const dateOfBirthRef = useRef("");
  const [preferred_day, setPreferredDay] = useState("");
  const [preferred_time, setPreferredTime] = useState("");
  const [message, setMessage] = useState("");
  const [emailSent, setEmailSent] = useState(false);

  const [days, setDays] = useState([
    { day: "Monday", clicked: false },
    { day: "Tuesday", clicked: false },
    { day: "Wednesday", clicked: false },
    { day: "Thursday", clicked: false },
    { day: "Friday", clicked: false },
  ]);

  const [appointmentType, setAppointmentType] = useState([
    { type: "Reschedule", clicked: false },
    { type: "Consultation", clicked: false },
    { type: "Elastics", clicked: false },
    { type: "Emergency", clicked: false },
  ]);

  const [times, setTimes] = useState([
    { time: "Morning", clicked: false },
    { time: "Afternoon", clicked: false },
    { time: "Evening", clicked: false },
  ]);

  const [locations, setLocations] = useState([
    { location: "Allentown", clicked: false },
    { location: "Bethlehem", clicked: false },
    { location: "Schnecksville", clicked: false },
    { location: "Lehighton", clicked: false },
  ]);

  useEffect(() => {
    const delay = 500;
    const timeout1 = setTimeout(() => setIsFirstNameVisible(true), delay);
    const timeout2 = setTimeout(() => setIsLastNameVisible(true), delay * 2);

    return () => {
      clearTimeout(timeout1);
      clearTimeout(timeout2);
    };
  }, []);

  const handleAppointmentClick = (index) => {
    const updatedAppointmentType = [...appointmentType];
    updatedAppointmentType[index].clicked =
      !updatedAppointmentType[index].clicked;
    setAppointmentType(updatedAppointmentType);
    const selectedTypes = updatedAppointmentType
      .filter((type) => type.clicked)
      .map((type) => type.type);
    setAppointmentTypes(selectedTypes);
  };

  const handleClick = (index) => {
    const updatedLocations = [...locations];
    updatedLocations[index].clicked = !updatedLocations[index].clicked;
    setLocations(updatedLocations);
    const selectedLocations = updatedLocations
      .filter((location) => location.clicked)
      .map((location) => location.location);
    setAppointmentLocations(selectedLocations);
  };

  const handleDayClick = (index) => {
    const updatedDays = [...days];
    updatedDays[index].clicked = !updatedDays[index].clicked;
    setDays(updatedDays);
    const selectedDays = updatedDays
      .filter((day) => day.clicked)
      .map((day) => day.day);
    setPreferredDay(selectedDays);
  };

  const handleTimeClick = (index) => {
    const updatedTimes = [...times];
    updatedTimes[index].clicked = !updatedTimes[index].clicked;
    setTimes(updatedTimes);
    const selectedTimes = updatedTimes
      .filter((time) => time.clicked)
      .map((time) => time.time);
    setPreferredTime(selectedTimes);
  };

  useEffect(() => {
    initTE({ Datepicker, Input });
  }, []);

  const handleSubmit = (event) => {
    // event.preventDefault();
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(emailValue)) {
      alert("Please enter a valid email address.");
      return;
    }

    const stringifyAppointmentTypes = appointmentType
      .filter((item) => item.clicked)
      .map((item) => item.type);

    const templateParams = {
      inputValue,
      guardianValue,
      phoneValue,
      stringifyAppointmentTypes,
      appointment_locations,
      emailValue,
      typeOfAppointment,
      appointment_types,
      birthdayValue,
      // date_of_birth: dateOfBirthRef.current.value,
      preferred_day,
      preferred_time,
      message,
    };

    emailjs
      .send(
        process.env.REACT_APP_SERVICE_ID,
        process.env.REACT_APP_BOOK_NOW_TEMPLATE_ID,
        templateParams,
        process.env.REACT_APP_PUBLIC_KEY
      )
      .then(
        function (response) {
          console.log("Success!", response.status, response.text);
        },
        function (error) {
          console.log("Failed...", error);
        }
      );
    setEmailSent(true);
  };

  const baseButtonClass = "py-2 px-4 rounded-full border";
  const activeButtonClass = "rounded border bg-black text-white";
  const inactiveButtonClass =
    "border border-black hover:bg-black hover:text-white ";

  const [showForm, setShowForm] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [phoneValue, setPhoneValue] = useState("");
  const [emailValue, setEmailValue] = useState("");
  const [guardianValue, setGuardianValue] = useState("");
  const [birthdayValue, setBirthdayValue] = useState("");
  useEffect(() => {
    setShowForm(true);
  }, []);

  const svgRef = useRef(null);

  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     if (svgRef.current) {
  //       svgRef.current.classList.add("initial-rotate");

  //       setTimeout(() => {
  //         svgRef.current.classList.remove("initial-rotate");
  //       }, 1200);
  //     }
  //   }, 1000);

  //   return () => clearTimeout(timer);
  // }, []);

  const [typeOfAppointment, setTypeOfAppointment] = useState(null);
  useEffect(() => {
    gsap.set(".arrow", { yPercent: -100 });
    gsap.to(".arrow", {
      yPercent: 0,
      repeat: -1,
      ease: "expo.easeIn",
      duration: 1,
      repeatDelay: 1,
    });
  }, []);

  const containerRef = useRef(null);

  const btnRef = useRef(null);

  return (
    <main className="font-helvetica-now-thin bg-center bg-[#E7E7E7]">
      <motion.div
        initial={{ clipPath: `circle(0% at 50% 50%)` }}
        animate={{ clipPath: `circle(100% at 50% 50%)` }}
        transition={{ duration: 2, ease: "easeOut" }}
        style={{ width: "100%" }}
      >
        <div className="grid grid-cols-3">
          <LeftColumn />
          <div className="col-span-2 overflow-y-auto mt-40">
            <div id="contact-form">
              {emailSent ? (
                <span className={emailSent ? "block" : "hidden"}>
                  Thank you for your message, we will be in touch soon!
                </span>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  className="flex flex-col max-w-screen-lg p-8 mx-auto space-y-12"
                >

                  <div className="flex flex-col items-center">
                    <div className="flex w-full gap-2">
                    <div className="relative rounded-full border border-gray-400 p-2 flex items-center">
            <label className="absolute left-4 text-sm">FULL NAME *</label>
            <div className="border-l border-gray-400 h-full ml-32"></div>
            <input
              id="nameInput"
              type="text"
              placeholder="Type something"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="w-full bg-transparent focus:outline-none focus:ring-0 focus:border-none rounded-full border-none"
              style={{ paddingLeft: '16px' }}
            />
          </div>
                      <div className="relative w-1/2">
                      <div className="relative flex items-center rounded-full border border-gray-400 p-2" data-te-datepicker-init>
            <span className="pl-4 pr-4 text-sm">BIRTHDAY *</span>
            <div className="border-l border-gray-400 h-8"></div>
            <input
              id="dateInput"
              type="text"
              placeholder="Type something"
              value={birthdayValue}
              onChange={(e) => setBirthdayValue(e.target.value)}
              className="flex-1 bg-transparent pl-4 focus:outline-none focus:ring-0 focus:border-none border-none rounded-full"
            />
          </div>
                        {/* <div
                          className="relative w-full border-b border-black"
                          data-te-datepicker-init
                        >
                          <input
                            id="dateInput"
                            type="text"
                            placeholder=""
                            value={birthdayValue}
                            onChange={(e) => setBirthdayValue(e.target.value)}
                            className="w-full px-3 py-2 placeholder-gray-400 bg-transparent border-none focus:outline-none focus:ring-0 sm:text-sm"
                          />
                          {!birthdayValue && (
                            <label
                              htmlFor="dateInput"
                              className="absolute text-sm text-gray-700 pointer-events-none left-3 top-2 font-CeraProBold"
                            >
                           BIRTHDAY*
                            </label>
                          )}
                        </div> */}
                      </div>
                    </div>
                    <div className="relative w-full mt-10">
                    <div className="relative flex items-center rounded-full border border-gray-400 p-2">
            <span className="pl-4 pr-4 text-sm">GUARDIAN* if applicable</span>
            <div className="border-l border-gray-400 h-8"></div>
            <input
              id="guardianInput"
              type="text"
              placeholder="Type something"
              value={guardianValue}
              onChange={(e) => setGuardianValue(e.target.value)}
              className="flex-1 bg-transparent pl-4 focus:outline-none focus:ring-0 focus:border-none border-none"
            />
          </div>
                    </div>
                    <div className="flex w-full gap-2 mt-5">
                      <div className="relative flex-1 w-1/2 py-4">
                      <div className="relative w-full">
                    <div className="relative flex items-center rounded-full border border-gray-400 p-2">
            <span className="pl-4 pr-4 text-sm">PHONE*</span>
            <div className="border-l border-gray-400 h-8"></div>
            <input
              id="set"
              type="text"
              placeholder="Type something"
              value={phoneValue}
              onChange={(e) => setPhoneValue(e.target.value)}
              className="flex-1 bg-transparent pl-4 focus:outline-none focus:ring-0 focus:border-none border-none"
            />
          </div>
                    </div>
                      </div>
                      <div className="relative py-4 w-full">
                    <div className="relative flex items-center rounded-full border border-gray-400 p-2">
            <span className="pl-4 pr-4 text-sm">EMAIL*</span>
            <div className="border-l border-gray-400 h-8"></div>
            <input
              id="nameInput"
              type="text"
              placeholder="Type something"
              value={emailValue}
              onChange={(e) => setEmailValue(e.target.value)}
              className="flex-1 bg-transparent pl-4 focus:outline-none focus:ring-0 focus:border-none border-none"
            />
          </div>
                    </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      className={`w-44 h-14 px-6 py-2 mx-auto relative ${
                        typeOfAppointment === "virtual"
                          ? "bg-[#D3D6D1] rounded-full border border-gray-400  "
                          : "text-black rounded-full border border-gray-400  "
                      } appointmentButton`}
                      onClick={() => setTypeOfAppointment("virtual")}
                    >
                      <span className="buttonText">Virtual</span>
                      <span className="appointmentBtnBg"></span>
                    </button>
                    <button
                      type="button"
                      className={`w-44 h-14 px-6 py-2 mx-auto relative ${
                        typeOfAppointment === "inPerson"
                          ? "rounded-full border border-gray-400 bg-[#D3D6D1]"
                          : "rounded-full border border-gray-400  text-black"
                      } appointmentButton`}
                      onClick={() => setTypeOfAppointment("inPerson")}
                    >
                      <span className=" buttonText">In-Person</span>
                      <span className="appointmentBtnBg"></span>
                    </button>
                  </div>
                  {typeOfAppointment === "inPerson" && (
                    <div>
                      <div className="grid grid-cols-2 gap-4 px-4 pt-4 pb-2 text-sm font-CeraProBold">
                        {locations.map((button, index) => (
                          <button
                            className="flex items-center space-x-2"
                            key={button.location}
                            type="button"
                            onClick={() => handleClick(index)}
                          >
                            <span className="relative w-10 h-10 rounded-full border border-gray-400  ">
                              {button.clicked && (
                                <span className="absolute w-1/2 bg-black inset-1/4 h-1/2"></span>
                              )}
                            </span>
                            <span className="text-gray-700">
                              {button.location}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="grid grid-cols-2 gap-4 font-CeraProBold">
                    {appointmentType.map((button, index) => (
                      <button
                        type="button"
                        className={`w-44 h-14 px-6 py-2 ${
                          button.clicked
                            ? "bg-[#D3D6D1] rounded-full border border-gray-400  "
                            : "border rounded-full border border-gray-400  text-black"
                        } mx-auto relative overflow-hidden appointmentButton`}
                        key={button.type}
                        onClick={() => handleAppointmentClick(index)}
                      >
                        <span className="buttonText"> {button.type}</span>
                        <span className="absolute top-0 left-0 z-0 w-0 h-0 transition-all bg-blue-600 appointmentBtnBg duration-400"></span>
                      </button>
                    ))}
                  </div>
                  <div className="flex flex-col justify-center font-CeraProBold">
                    Preferred Day(s):
                    <div className="flex flex-wrap justify-start gap-4 py-4 ml-4">
                      {days.map((button, index) => (
                        <button
                          key={button.day}
                          type="button"
                          className={
                            button.clicked
                              ? `${baseButtonClass} ${activeButtonClass}`
                              : `${baseButtonClass} ${inactiveButtonClass}`
                          }
                          onClick={() => handleDayClick(index)}
                        >
                          {button.day}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="py-2 space-x-4 font-CeraProBold">
                    Preferred Time(s):
                    <div className="flex flex-wrap justify-start gap-4 py-4 ml-4 font-CeraProBold">
                      {times.map((button, index) => (
                        <button
                          key={button.time}
                          type="button"
                          className={
                            button.clicked
                              ? `${baseButtonClass} ${activeButtonClass}`
                              : `${baseButtonClass} ${inactiveButtonClass}`
                          }
                          onClick={() => handleTimeClick(index)}
                        >
                          {button.time}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col h-32 border-2 border-black">
                    <label className="flex flex-col h-full">
                      <textarea
                        placeholder="Please include as much detail as possible"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="h-full italic text-blue-600 bg-transparent font-CeraProBold"
                      ></textarea>
                    </label>
                  </div>
                  <div className="flex items-center justify-center">
                    <div className="mt-8 intro">
                      <button
                        ref={btnRef}
                        onClick={handleSubmit}
                        className="relative flex items-center justify-center px-12 py-4 -mt-3 overflow-hidden font-bold border border-black btn max-w-max cursor-crosshair"
                      >
                        <span className="absolute bottom-0 left-0 right-0 h-full transition-transform duration-700 ease-out transform translate-y-full bg-black span-fill"></span>
                        <span className="relative z-10 text-content">
                          Send Message
                        </span>
                        <div
                          className="z-10"
                          style={{ transform: "rotate(-90deg)" }}
                        >
                          {[...Array(2)].map((_, index) => (
                            <svg
                              key={index}
                              className="absolute w-full h-full arrow"
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 512 512"
                            >
                              <path d="M383.6 322.7 278.6 423c-5.8 6-13.7 9-22.4 9s-16.5-3-22.4-9L128.4 322.7a29.6 29.6 0 0 1 0-43.2 33 33 0 0 1 45.2 0l50.4 48.2v-217a31.3 31.3 0 0 1 32-30.6c17.7 0 32 13.7 32 30.6v217l50.4-48.2 a33 33 0 0 1 45.2 0 29.6 29.6 0 0 1 0 43.2z" />
                            </svg>
                          ))}
                        </div>
                      </button>
                    </div>
                  </div>
                  <style>{`
                  .btn:hover .span-fill {
                    transform: translateY(0);
                  }
                  .btn:hover .text-content {
                    color: white;
                  }
                `}</style>
                </form>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </main>
  );
};

export default BookNow;
