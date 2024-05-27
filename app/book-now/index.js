"use client";
import React, { useState, useRef, useEffect } from "react";
import { gsap } from "gsap-trial";
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import emailjs from "@emailjs/browser";
import "tw-elements";
import { Datepicker, Input, initTE } from "tw-elements";
import { init } from "emailjs-com";
import { Disclosure } from "@headlessui/react";

// import classNames from 'classnames';
import { motion, useAnimation } from "framer-motion";

// import Circle from "./svg/Circle"

// init(process.env.REACT_APP_PUBLIC_KEY);

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
    .filter(item => item.clicked)
    .map(item => item.type)

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

    emailjs.send(
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

  const baseButtonClass = "py-2 px-4 ";
  const activeButtonClass = "bg-violet-100";
  const inactiveButtonClass =
    "border border-black hover:bg-black hover:text-white ";

  const [showForm, setShowForm] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [phoneValue, setPhoneValue] = useState('');
  const [emailValue, setEmailValue] = useState('');
  const [guardianValue, setGuardianValue] = useState('');
  const [birthdayValue, setBirthdayValue] = useState('');
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
    <main
      className="font-helvetica-now-thin bg-center bg-[#E7E7E7] "
      // style={{
      //   backgroundImage: "url('../images/threecircles.png')",
      //   width: "100%",
      //   backgroundSize: "30%",
      //   backgroundRepeat: "no-repeat",
      //   backgroundPosition: "left 340px",
      // }}

    >
      <motion.div
        initial={{ clipPath: `circle(0% at 50% 50%)` }}
        animate={controls}
        transition={{ duration: 2, ease: "easeOut" }}
        style={{
          width: "100%",
          // overflow: "auto",
        }}
      >
        <div className="grid grid-cols-2">
          <div className="sticky top-0 items-start h-screen ">
<div >
<div className="text-center mt-40">
      <h1
        className="text-[#2E2A27] font-helvetica-neue text-[100px] text-8xl"
        style={{
          letterSpacing: 'px',
          backgroundImage: 'radial-gradient(circle farthest-corner at 100% 0,#ffaccf 28%,#5cb6f8 51%,#ba75e0 87%,#dd5183 96%)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          color: 'transparent'
        }}
      >
        Begin your smile journey today
      </h1>
    </div>
            <div className="text-center font-iCiel-Gotham-Ultra text-7xl " ref={containerRef}>
      <h1 className="text-[140px] text-[#2E2A27] ">
        {['H', 'E', 'L', 'L', 'O'].map((letter, index) => (
          <span key={index} className="relative inline-block text-highlight">
            <span className="absolute inset-0 text-hider-fg"></span>
            {letter}
            <span className="absolute inset-0 text-highlight-bg"></span>
          </span>
        ))}
      </h1>
    </div>
    </div>
    <button class="button button--marquee" data-text="(610) 437-4748 — info@freysmiles.com — (610) 437-4748 — freysmiles.com">
    (610) 437-4748 — info@freysmiles.com
</button>


   







{/*
            <div className="flex items-center w-full -mt-10 justify-evenly">
              <div className="text-xl text-center font-CeraProBold">
                <a
                  className="hover:text-purple-500"
                  href="mailto:info@freysmiles.com"
                >
                  • info@freysmiles.com
                </a>
              </div>
              <div className="text-lg text-center font-CeraProBold">
                <a
                  href="facetime://6104374748"
                  className="hover:text-purple-500"
                >
                  • (610) 437-4748
                </a>
              </div>
              <div className="text-xl text-center">
                <div className="bg-body-bg text-blog-bg py-1.5 overflow-hidden whitespace-nowrap">
                  <div className="animate-marquee">
                    <a
                      href="https://www.instagram.com/freysmiles/"
                      className="hover:text-purple-500"
                    >
                      <span className="mx-4 font-CeraProBold">
                        •@freysmiles
                      </span>
                    </a>
                  </div>
                </div>
              </div>
            </div> */}
            <div className="flex items-center justify-center h-screen ">
              <div className="w-1/5 max-w-xs">
                <svg
                  ref={svgRef}
                  viewBox="0 0 10 10"
                  className="w-full h-auto initial-rotate smiley"
                >
                  <circle
                    className="smile"
                    cx="5"
                    cy="5"
                    r="4"
                    stroke="#51414F"
                    strokeWidth=".75"
                    strokeDasharray="11.5,13.6327"
                    strokeLinecap="round"
                    fill="transparent"
                    style={{ strokeDashoffset: "-.5" }}
                  />
                  <circle
                    className="eyes"
                    cx="5"
                    cy="5"
                    r="4"
                    stroke="#51414F"
                    strokeWidth=".75"
                    strokeDasharray="0,6.6327,0,17.5"
                    strokeLinecap="round"
                    fill="transparent"
                    style={{ strokeDashoffset: "-15.5" }}
                  />
                </svg>
              </div>
            </div>
          </div>
          <div className="overflow-y-auto ">
            <div id="contact-form">
              {emailSent ? (
                <span className={emailSent ? "block" : "hidden"}>
                  Thank you for your message, we will be in touch soon!
                </span>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  className="flex flex-col max-w-screen-sm p-8 mx-auto space-y-12 "
                >
                  <div className="flex flex-col items-center">
                    <div className="flex w-full gap-2">
                    <div className="relative w-full border-b border-black">
      <input
        id="nameInput"
        type="text"
        placeholder=""
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        className="w-full px-3 py-2 placeholder-gray-400 bg-transparent border-none focus:outline-none focus:ring-0 sm:text-sm"
      />
      {!inputValue && (
        <label
          htmlFor="nameInput"
          className="absolute text-sm text-gray-700 pointer-events-none left-3 top-2 font-CeraProBold"
        >
          Your Name
        </label>
      )}
    </div>
    <div className="relative w-1/2">
    <div className="relative w-full border-b border-black" data-te-datepicker-init>
      <input
        id="dateInput"
        type="text"
        placeholder=""
        value={birthdayValue}
        onChange={(e) => setBirthdayValue(e.target.value)}
        // ref={dateInputRef}
        className="w-full px-3 py-2 placeholder-gray-400 bg-transparent border-none focus:outline-none focus:ring-0 sm:text-sm"
      />
      {!birthdayValue && (
        <label
          htmlFor="dateInput"
          className="absolute text-sm text-gray-700 pointer-events-none left-3 top-2 font-CeraProBold"
        >
          Birthday
        </label>
      )}
    </div>
                    </div>

                      {/* <div className="relative flex-1 w-1/2">
                        <input
                          type="text"
                          id="floating_filled"
                          className="mt-5 block px-2.5 pb-2.5 pt-5 w-full text-sm bg-transparent appearance-none dark:text-white focus:outline-none focus:border-blue-600 peer border border-black rounded-md"
                          placeholder=" "
                        />
                        <label
                          htmlFor="floating_filled"
                          className="font-CeraProBold absolute text-md dark:text-gray-400 -top-5 left-2.5 z-10"
                        >
                          Your Name*
                        </label>
                      </div> */}
                    </div>

                    <div className="relative w-full mt-10">
                    <div className="relative w-full border-b border-black">
  <input
    id="guardianInput"
    type="text"
    placeholder=""
    value={guardianValue}
    onChange={(e) => setGuardianValue(e.target.value)}
    className="w-full px-3 py-2 placeholder-gray-400 bg-transparent border-none focus:outline-none focus:ring-0 sm:text-sm"
  />
  {!guardianValue && (
    <label
      htmlFor="guardianInput"
      className="absolute text-sm text-gray-700 pointer-events-none left-3 top-2 font-CeraProBold"
    >
      Guardian *if applicable
    </label>
  )}
</div>
                    </div>

                    <div className="flex w-full gap-2 mt-5">
                      <div className="relative flex-1 w-1/2 py-4">
                      <div className="relative w-full border-b border-black">
  <input
    id="phoneInput"
    type="text"
    placeholder=""
    value={phoneValue}
    onChange={(e) => setPhoneValue(e.target.value)}
    className="w-full px-3 py-2 placeholder-gray-400 bg-transparent border-none focus:outline-none focus:ring-0 sm:text-sm"
  />
  {!phoneValue && (
    <label
      htmlFor="phoneInput"
      className="absolute text-sm text-gray-700 pointer-events-none left-3 top-2 font-CeraProBold"
    >
      Phone
    </label>
  )}
</div>

                      </div>

                      <div className="relative flex-1 w-1/2 py-4">
                      <div className="relative w-full border-b border-black">
  <input
    id="emailInput"
    type="email"
    placeholder=""
    value={emailValue}
    onChange={(e) => setEmailValue(e.target.value)}
    className="w-full px-3 py-2 placeholder-gray-400 bg-transparent border-none focus:outline-none focus:ring-0 sm:text-sm"
  />
  {!emailValue && (
    <label
      htmlFor="emailInput"
      className="absolute text-sm text-gray-700 pointer-events-none left-3 top-2 font-CeraProBold"
    >
      Email
    </label>
  )}
</div>

                      </div>
                    </div>
                  </div>

                  {/* <div
                    className="relative my-4 mb-3"
                    data-te-datepicker-init
                    data-te-input-wrapper-init
                  >
                    <input
                      required
                      type="text"
                      className="peer block min-h-[auto] w-full rounded border-0 bg-transparent px-3 py-[0.32rem] leading-[1.6] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 peer-focus:text-primary data-[te-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none dark:text-neutral-200 dark:placeholder:text-neutral-200 dark:peer-focus:text-primary [&:not([data-te-input-placeholder-active])]:placeholder:opacity-0"
                      placeholder="Select a date"
                      ref={dateOfBirthRef}
                    />
                    <label
                      htmlFor="floatingInput"
                      className=" pointer-events-none absolute left-3 top-0 mb-0 max-w-[90%] origin-[0_0] truncate pt-[0.37rem] leading-[1.6]  transition-all duration-200 ease-out peer-focus:-translate-y-[0.9rem] peer-focus:scale-[0.8] peer-focus:text-primary peer-data-[te-input-state-active]:-translate-y-[0.9rem] peer-data-[te-input-state-active]:scale-[0.8] motion-reduce:transition-none dark:text-neutral-200 dark:peer-focus:text-primary"
                    >
                      Date of Birth*
                    </label>
                  </div> */}
            <div className="grid grid-cols-2 gap-4">
  <button
    type="button"
    className={`w-44 h-14 px-6 py-2 mx-auto relative ${
      typeOfAppointment === "virtual"
        ? "bg-[#D3D6D1] "
        : "text-black"
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
        ? "bg-[#D3D6D1] "
        : "text-black"
    } appointmentButton`}
    onClick={() => setTypeOfAppointment("inPerson")}
  >
   <span className="buttonText">In-Person</span> 
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
      <span className="relative w-10 h-10 border border-black">
        {button.clicked && (
          <span className="absolute w-1/2 bg-black inset-1/4 h-1/2"></span>
        )}
      </span>
      <span className="text-gray-700">{button.location}</span>
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
                            ? "bg-[#D3D6D1] "
                            : "border border-black text-black"
                        } mx-auto relative overflow-hidden appointmentButton`}
                        key={button.type}
                        onClick={() => handleAppointmentClick(index)}
                      >
                        <span className="buttonText"> {button.type}</span>
                       
                        <span className="absolute top-0 left-0 z-0 w-0 h-0 transition-all bg-blue-600 appointmentBtnBg duration-400"></span>{" "}

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
                              ? `${baseButtonClass} ${activeButtonClass} `
                              : `${baseButtonClass} ${inactiveButtonClass}  `
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
        <span className="relative z-10 text-content">Send Message</span>
        <div className="z-10" style={{ transform: "rotate(-90deg)" }}>
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
  <style>
    {`
      .btn:hover .span-fill {
        transform: translateY(0);
      }
      .btn:hover .text-content {
        color: white;
      }
    `}
  </style>



                  {/* <div className="flex justify-center text-gray-500 uppercase font-CeraProBold">
             <button
  className="relative flex items-center justify-center px-8 py-4 -mt-3 overflow-hidden border border-black max-w-max"
  type="submit"
  onClick={handleSubmit}
>
  <span className="absolute inset-0 transition-transform duration-700 ease-out transform translate-y-full bg-white" />
  Send Message
  <div
    className="inline-block w-6 h-6 overflow-hidden transform -translate-x-1/2 -translate-y-1/2 top-full left-1/2"
    style={{ transform: "rotate(-90deg)" }}
  >
    {[...Array(2)].map((_, index) => (
      <svg
        key={index}
        className="absolute w-full h-full arrow"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 512 512"
      >
        <path d="M383.6 322.7 278.6 423c-5.8 6-13.7 9-22.4 9s-16.5-3-22.4-9L128.4 322.7a29.6 29.6 0 0 1 0-43.2 33 33 0 0 1 45.2 0l50.4 48.2v-217a31.3 31.3 0 0 1 32-30.6c17.7 0 32 13.7 32 30.6v217l50.4-48.2a33 33 0 0 1 45.2 0 29.6 29.6 0 0 1 0 43.2z" />
      </svg>
    ))}
  </div>
</button>

                  </div> */}
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
