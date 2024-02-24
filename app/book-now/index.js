'use client';
import React, { useState, useRef, useEffect } from "react";
// import emailjs from "@emailjs/browser";
// import "tw-elements";
// import { Datepicker, Input, initTE } from "tw-elements";
// import { init } from "emailjs-com";
import { Disclosure } from "@headlessui/react";

// import classNames from 'classnames';
import { motion, useAnimation } from 'framer-motion';
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
    { day: "Saturday", clicked: false },
    { day: "Sunday", clicked: false },
  ]);

  const [appointmentType, setAppointmentType] = useState([
    { type: "Missed Appointment", clicked: false },
    { type: "Request Consultation", clicked: false },
    { type: "Need Elastics", clicked: false },
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

//   useEffect(() => {
//     initTE({ Datepicker, Input });
//   }, []);

  const handleSubmit = () => {
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
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

  const baseButtonClass = "text-indigo-700 py-2 px-4 rounded-full";
  const activeButtonClass = "bg-violet-100";
  const inactiveButtonClass =
    "border border-violet-400 hover:bg-violet-400 hover:text-white text-indigo-700";

    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
      setShowForm(true);
    }, []);

    const svgRef = useRef(null);

    useEffect(() => {
    
      const timer = setTimeout(() => {
          if (svgRef.current) {
              svgRef.current.classList.add('initial-rotate');

              setTimeout(() => {
                  svgRef.current.classList.remove('initial-rotate');
              }, 1200); 
          }
      }, 1000); 

      return () => clearTimeout(timer); 
  }, []);
  return (
    <main className="">
           <motion.div
        initial={{ clipPath: `circle(0% at 50% 50%)` }}
        animate={controls}
        transition={{ duration: 0.8, ease: "easeOut" }}
        style={{ width: '100%', height: '200vh', background: '#C8A2C8', overflow: 'hidden' }}
      >
        <div className="flex">
      <div className="w-1/2">
      <div className=" mt-10 text-center text-5xl mb-20" style={{letterSpacing:"px"}}>
               SAY HELLO
              </div>
              <div className="text-center">We can't wait to meet you</div>

              <div className="text-center">
      <a className="underline" href="mailto:info@freysmiles.com">info@freysmiles.com</a>
    </div>
    <div className="flex justify-center items-center h-screen ">


            <div className="w-1/5 max-w-xs">
            <svg ref={svgRef} viewBox="0 0 10 10" className="w-full h-auto smiley">
                    <circle className="smile"
                            cx="5" cy="5" r="4"
                            stroke="#51414F" strokeWidth=".75"
                            strokeDasharray="11.5,13.6327"
                            strokeLinecap="round"
                            fill="transparent"
                            style={{ strokeDashoffset: '-.5' }} />
                    <circle className="eyes"
                            cx="5" cy="5" r="4"
                            stroke="#51414F" strokeWidth=".75"
                            strokeDasharray="0,6.6327,0,17.5"
                            strokeLinecap="round"
                            fill="transparent"
                            style={{ strokeDashoffset: '-15.5' }} />
                </svg>

            </div>
        </div>
      </div>
      <div className="w-1/2">
  
        
      <div id="contact-form">
        {emailSent ? (
          <span className={emailSent ? "block" : "hidden"}>
            Thank you for your message, we will be in touch soon!
          </span>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="  max-w-screen-sm mx-auto flex flex-col space-y-12 p-8 rounded-xl"
          >
            <div className="flex flex-col items-center">
        
              <div className="flex w-full gap-2">
                <div className="relative flex-1 w-1/2">
                <input
  type="text"
  id="floating_filled"
  style={{ borderRadius: "0", borderBottom: "1px solid black" }}
  className="block px-2.5 pb-2.5 pt-5 w-full text-sm  bg-transparent appearance-none dark:text-white focus:outline-none focus:border-blue-600 peer"
  placeholder=" "
/>
                  <label
                    for="floating_filled"
                    className="absolute -mt-1 ml-4 px-2 text-sm dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] left-2.5 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4"
                  >
                    First Name
                  </label>
                </div>
                <div className="relative flex-1 w-1/2">
                <input
  type="text"
  id="floating_filled"
  style={{ borderRadius: "0", borderBottom: "1px solid black" }}
  className="block px-2.5 pb-2.5 pt-5 w-full text-sm bg-transparent appearance-none dark:text-white focus:outline-none focus:border-blue-600 peer"
  placeholder=" "
/>
                  <label
                    for="floating_second"
                    className="absolute -mt-1 ml-4 px-2 text-sm  dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] left-2.5 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4"
                  >
                    Last Name
                  </label>
                </div>
              </div>

              <div className="relative mt-2  w-full">
              <input
  type="text"
  id="floating_filled"
  style={{ borderRadius: "0", borderBottom: "1px solid black" }}
  className="block px-2.5 pb-2.5 pt-5 w-full text-sm  bg-transparent appearance-none dark:text-white focus:outline-none focus:border-blue-600 peer"
  placeholder=" "
/>
                <label
                  for="guardian"
                  className="absolute mt-2  ml-4 px-2 text-sm  duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] left-2.5 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                >
                  Guardian
                </label>
              </div>

              <div className="w-full flex gap-2">
                <div className="w-1/2 relative flex-1 py-4">
                <input
  type="text"
  id="floating_filled"
  style={{ borderRadius: "0", borderBottom: "1px solid black" }}
  className="block px-2.5 pb-2.5 pt-5 w-full text-sm  bg-transparent appearance-none dark:text-white focus:outline-none focus:border-blue-600 peer"
  placeholder=" "
/>
                  <label
                    for="phone"
                    className="absolute mt-4 ml-4  px-2 text-sm  dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] left-2.5 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                  >
                    Phone Number
                  </label>
                </div>

                <div className="w-1/2 relative flex-1 py-4">
                <input
  type="text"
  id="floating_filled"
  style={{ borderRadius: "0", borderBottom: "1px solid black" }}
  className="block px-2.5 pb-2.5 pt-5 w-full text-sm  bg-transparent appearance-none dark:text-white focus:outline-none focus:border-blue-600 peer"
  placeholder=" "
/>
                  <label
                    for="email"
                    className="absolute mt-4 ml-4 px-2 text-sm  dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] left-2.5 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                  >
                    Email
                  </label>
                </div>
              </div>
            </div>

            <div
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
            </div>
            <div className="grid grid-cols-2 gap-4">
 {appointmentType.map((button, index) => (
  <button
    className={`px-6 ${button.clicked ? 'py-2 border rounded-full border-purple-500 bg-purple-500 text-white' : 'py-2 rounded-full border border-purple-500 text-black'}`}
    key={button.type}
    type="button"
    onClick={() => handleAppointmentClick(index)}
  >
    {button.type}
  </button>
))}

</div>





<div>
  <div className="flex w-full justify-between rounded-lg px-4 py-2 text-left text-md font-medium text-indigo-700 focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75">
    <span>Choose Location</span>
  </div>
  <div className="px-4 pt-4 pb-2 text-sm text-gray-500">
    {locations.map((button, index) => (
      <button
        className="px-4"
        key={button.location}
        type="button"
        onClick={() => handleClick(index)}
      >
        {button.clicked ? (
          <svg
            className="w-8"
            id="gradient_concentrics"
            data-name="gradient_concentrics"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 500 500"
          >
            <g
              className="hover:shadow-lg hover:shadow-cyan-500/50"
              id="gradient_concentric"
              data-name="gradient_concentric"
            >
              <g>
                <circle cx="250" cy="250" r="250" fill="white" />
                <circle cx="250" cy="250" r="221.43" fill="#ddd6fe" />
                <circle cx="250" cy="250" r="192.86" fill="#ddd6fe" />
                <circle cx="250" cy="250" r="164.29" fill="#c4b5fd" />
                <circle cx="250" cy="250" r="135.71" fill="#c4b5fd" />
                <circle cx="250" cy="250" r="107.14" fill="#a78bfa" />
                <circle cx="250" cy="250" r="78.57" fill="#a78bfa" />
                {/* <circle cx="250" cy="250" r="50" fill="#ba9bc9" /> */}
              </g>
            </g>
          </svg>
        ) : (
          <svg
            className="w-8"
            stroke="black"
            id="gradient_concentrics"
            data-name="gradient_concentrics"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 500 500"
          >
            <g id="gradient_concentric" data-name="gradient_concentric">
              <g>
                <circle cx="250" cy="250" r="250" fill="#f3f4f6" />
                {/* <circle cx="250" cy="250" r="192.86" fill="#f3f4f6" /> */}
                <circle cx="250" cy="250" r="164.29" fill="#d1d5db" />
                <circle cx="250" cy="250" r="78.57" fill="#9ca3af" />
              </g>
            </g>
          </svg>
        )}
        {button.location}
      </button>
    ))}
  </div>
</div>


            <div className="text-indigo-700 flex justify-center flex-col">
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
            <div className="text-indigo-700 py-2 space-x-4">
              Preferred Time(s):
              <div className="flex flex-wrap justify-start py-4 gap-4 ml-4">
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

            <div className="border-2 h-32 border-indigo-100 flex flex-col">
              <label className="flex flex-col" style={{ height: "100%" }}>
                <textarea
                  placeholder="Your message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  style={{ fontStyle: "italic", color: "blue", height: "100%" }}
                ></textarea>
              </label>
            </div>

            <div className="flex justify-center">
              <button
                className="text-white rounded-lg px-4 py-2 bg-indigo-700 max-w-max -mt-3"
                type="submit"
                onClick={handleSubmit}
              >
                Send Message
              </button>
            </div>
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