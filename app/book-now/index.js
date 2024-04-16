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
    const templateParams = {
      patient_name,
      patient_lastName,
      guardian_name,
      phone_number,
      appointment_types,
      appointment_locations,
      email,
      date_of_birth: dateOfBirthRef.current.value,
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

  useEffect(() => {
    const timer = setTimeout(() => {
      if (svgRef.current) {
        svgRef.current.classList.add("initial-rotate");

        setTimeout(() => {
          svgRef.current.classList.remove("initial-rotate");
        }, 1200);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

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

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const container = containerRef.current;
    const textHider = container.querySelectorAll('.text-hider-fg');  
    const textBg = container.querySelectorAll(".text-highlight-bg");

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: "top 80%",
        markers: false,
      }
    });

    tl.to(textBg, { scaleX: 1, ease: "expo.easeIn", duration: 1, stagger: 0.08 })
      .set(textHider, { autoAlpha: 0 })
      .to(textBg, { scaleX: 0, ease: "power4.easeOut", duration: 0.5, transformOrigin: "100% 0%", delay: .5 });
  }, []);

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
          
          <div className="sticky top-0  h-screen items-start ">

            <div
              className="text-[#2E2A27] font-grandslang text-[140px] mt-40 text-center text-8xl "
              style={{ letterSpacing: "px" }}
            >
              SAY 
            </div>
            <div className="font-iCiel-Gotham-Ultra text-center text-7xl " ref={containerRef}>
      <h1 className="text-[140px] text-[#2E2A27] ">
        {['H', 'E', 'L', 'L', 'O'].map((letter, index) => (
          <span key={index} className="text-highlight inline-block relative">
            <span className="text-hider-fg absolute inset-0"></span>
            {letter}
            <span className="text-highlight-bg absolute inset-0"></span>
          </span>
        ))}
      </h1>
    </div>
    <div className="container flex justify-center items-center h-32px w-32px ">
      {[...Array(1)].map((_, index) => (
        <div key={index} className="moon">
          <div className="light"></div>
          <div className="texture"></div>
          <div className="sphere"></div>
        </div>
      ))}
    </div>
    <div >


    <div className="flex items-center justify-center w-full">
        <div className="containermarquee border border-black rounded-full p-5">
          <p className="text-md font-cera"> 
          <a href="facetime://6104374748" className="hover:underline">
          (610) 437-4748
        </a>     <span className="inline-block transform rotate-45 mx-2" style={{ width: '8px', height: '8px', backgroundColor: '#000' }}></span>
         <a href="mailto:info@freysmiles.com" className="hover:underline">
          info@freysmiles.com
        </a></p>
        </div>
      </div>
</div>





  
    
{/* 
            <div className="flex justify-evenly items-center w-full -mt-10">
              <div className="font-CeraProBold text-xl text-center">
                <a
                  className="hover:text-purple-500"
                  href="mailto:info@freysmiles.com"
                >
                  • info@freysmiles.com
                </a>
              </div>
              <div className="font-CeraProBold text-lg text-center">
                <a
                  href="facetime://6104374748"
                  className="hover:text-purple-500"
                >
                  • (610) 437-4748
                </a>
              </div>
              <div className="text-center text-xl">
                <div className="bg-body-bg text-blog-bg py-1.5 overflow-hidden whitespace-nowrap">
                  <div className="animate-marquee">
                    <a
                      href="https://www.instagram.com/freysmiles/"
                      className="hover:text-purple-500"
                    >
                      <span className="font-CeraProBold mx-4">
                        •@freysmiles
                      </span>
                    </a>
                  </div>
                </div>
              </div>
            </div> */}
            <div className="flex justify-center items-center h-screen ">
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

          <div className=" overflow-y-auto ">
            <div id="contact-form">
              {emailSent ? (
                <span className={emailSent ? "block" : "hidden"}>
                  Thank you for your message, we will be in touch soon!
                </span>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  className="  max-w-screen-sm mx-auto flex flex-col space-y-12 p-8 "
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
        className="w-full px-3 py-2 bg-transparent border-none placeholder-gray-400 focus:outline-none focus:ring-0 sm:text-sm"
      />
      {!inputValue && (
        <label
          htmlFor="nameInput"
          className="absolute left-3 top-2 font-CeraProBold text-sm text-gray-700 pointer-events-none"
        >
          Your Name
        </label>
      )}
    </div>
    <div className="relative  w-1/2">
    <div className="relative w-full border-b border-black" data-te-datepicker-init>
      <input
        id="dateInput"
        type="text"
        placeholder=""
        value={birthdayValue}
        onChange={(e) => setBirthdayValue(e.target.value)}
        // ref={dateInputRef}
        className="w-full px-3 py-2 bg-transparent border-none placeholder-gray-400 focus:outline-none focus:ring-0 sm:text-sm"
      />
      {!birthdayValue && (
        <label
          htmlFor="dateInput"
          className="absolute left-3 top-2 font-CeraProBold text-sm text-gray-700 pointer-events-none"
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

                    <div className="relative mt-10 w-full">
                    <div className="relative w-full border-b border-black">
  <input
    id="guardianInput"
    type="text"
    placeholder=""
    value={guardianValue}
    onChange={(e) => setGuardianValue(e.target.value)}
    className="w-full px-3 py-2 bg-transparent border-none placeholder-gray-400 focus:outline-none focus:ring-0 sm:text-sm"
  />
  {!guardianValue && (
    <label
      htmlFor="guardianInput"
      className="absolute left-3 top-2 font-CeraProBold text-sm text-gray-700 pointer-events-none"
    >
      Guardian *if applicable
    </label>
  )}
</div>
                    </div>

                    <div className="mt-5 w-full flex gap-2">
                      <div className="w-1/2 relative flex-1 py-4">
                      <div className="relative w-full border-b border-black">
  <input
    id="phoneInput"
    type="text"
    placeholder=""
    value={phoneValue}
    onChange={(e) => setPhoneValue(e.target.value)}
    className="w-full px-3 py-2 bg-transparent border-none placeholder-gray-400 focus:outline-none focus:ring-0 sm:text-sm"
  />
  {!phoneValue && (
    <label
      htmlFor="phoneInput"
      className="absolute left-3 top-2 font-CeraProBold text-sm text-gray-700 pointer-events-none"
    >
      Phone
    </label>
  )}
</div>

                      </div>

                      <div className="w-1/2 relative flex-1 py-4">
                      <div className="relative w-full border-b border-black">
  <input
    id="emailInput"
    type="email"  
    placeholder=""
    value={emailValue}
    onChange={(e) => setEmailValue(e.target.value)}
    className="w-full px-3 py-2 bg-transparent border-none placeholder-gray-400 focus:outline-none focus:ring-0 sm:text-sm"
  />
  {!emailValue && (
    <label
      htmlFor="emailInput"
      className="absolute left-3 top-2 font-CeraProBold text-sm text-gray-700 pointer-events-none"
    >
      Email
    </label>
  )}
</div>

                      </div>
                    </div>
                  </div>
               
                  {/* <div
                    className="my-4 relative mb-3"
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
        ? "bg-black text-white"
        : "text-black"
    } appointmentButton`}
    onClick={() => setTypeOfAppointment("virtual")}
  >
    Virtual
    <span className="appointmentBtnBg"></span>
  </button>
  <button
    type="button"
    className={`w-44 h-14 px-6 py-2 mx-auto relative ${
      typeOfAppointment === "inPerson"
        ? "bg-black text-white"
        : "text-black"
    } appointmentButton`}
    onClick={() => setTypeOfAppointment("inPerson")}
  >
    In-Person
    <span className="appointmentBtnBg"></span>
  </button>
</div>

                  {typeOfAppointment === "inPerson" && (
                    <div>
                      
                      <div className="font-CeraProBold px-4 pt-4 pb-2 text-sm grid grid-cols-2 gap-4">
  {locations.map((button, index) => (
    <button
      className="flex items-center space-x-2"
      key={button.location}
      type="button"
      onClick={() => handleClick(index)}
    >
      <span className="relative w-10 h-10 border border-black">
        {button.clicked && (
          <span className="absolute inset-1/4 bg-black w-1/2 h-1/2"></span>
        )}
      </span>
      <span className="text-gray-700">{button.location}</span>
    </button>
  ))}
</div>



                    </div>
                  )}
                  <div className="font-CeraProBold grid grid-cols-2 gap-4">
                    {appointmentType.map((button, index) => (
                      <button
                      type="button"  
                        className={`w-44 h-14 px-6 py-2 ${
                          button.clicked
                            ? "bg-black text-white"
                            : "border border-black text-black"
                        } mx-auto relative overflow-hidden appointmentButton`}
                        key={button.type}
                        onClick={() => handleAppointmentClick(index)}
                      >
                        {button.type}
                        <span className="appointmentBtnBg absolute top-0 left-0 w-0 h-0 bg-blue-600  z-0 transition-all duration-400"></span>{" "}
                  
                      </button>
                    ))}
                  </div>

                  <div className="font-CeraProBold flex justify-center flex-col">
                    Preferred Day(s):
                    <div className="flex flex-wrap justify-start py-4 gap-4 ml-4">
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
                  <div className="font-CeraProBold py-2 space-x-4">
                    Preferred Time(s):
                    <div className="font-CeraProBold flex flex-wrap justify-start py-4 gap-4 ml-4">
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

                  <div className="border-2 border-black h-32 flex flex-col">
                    <label className="flex flex-col h-full">
                      <textarea
                        placeholder="Please include as much detail as possible"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="font-CeraProBold h-full bg-transparent italic text-blue-600"
                      ></textarea>
                    </label>
                  </div>            
  <div className="flex justify-center items-center">
    <div className="intro mt-8">
      <button
        ref={btnRef}
        onClick={handleSubmit}
        className="btn relative px-12 py-4 border border-black max-w-max -mt-3 flex items-center justify-center overflow-hidden font-bold cursor-crosshair"
      >
        <span className="span-fill absolute bottom-0 left-0 right-0 bg-black h-full transition-transform duration-700 ease-out transform translate-y-full"></span>
        <span className="text-content z-10 relative">Send Message</span> 
        <div className="z-10" style={{ transform: "rotate(-90deg)" }}>
          {[...Array(2)].map((_, index) => (
            <svg
              key={index}
              className="arrow absolute w-full h-full"
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



                  {/* <div className="uppercase text-gray-500 font-CeraProBold flex justify-center">
             <button
  className="relative px-8 py-4 border border-black max-w-max -mt-3 flex items-center justify-center overflow-hidden"
  type="submit"
  onClick={handleSubmit}
>
  <span className="absolute inset-0 bg-white transform translate-y-full transition-transform duration-700 ease-out" />
  Send Message
  <div
    className="inline-block top-full left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 overflow-hidden"
    style={{ transform: "rotate(-90deg)" }}
  >
    {[...Array(2)].map((_, index) => (
      <svg
        key={index}
        className="arrow absolute w-full h-full"
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
