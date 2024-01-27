'use client'
import Link from 'next/link'
import { useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import ArrowLeftIcon from '../_components/ui/ArrowLeftIcon'
import ArrowRightIcon from '../_components/ui/ArrowRightIcon'

export default function OurTeam() {
  return (
    <>
      <DoctorsSection />
      <MembersSection />
    </>
  )
}

function DoctorsSection() {
  const [index, setIndex] = useState(1)
  const [switchDoctor, setSwitchDoctor] = useState(false)

  const toggleSwitchDoctor = () => {
    setSwitchDoctor(!switchDoctor)
  }

  return (
    <section className="py-24 bg-white sm:py-32">
      <div className="w-full px-6 mx-auto mb-12 lg:px-8 max-w-7xl">
        <h1 className="tracking-tight uppercase font-helvetica-now-thin">Our Doctors</h1>
      </div>
      <div className="grid grid-cols-12 gap-8 px-6 mx-auto max-w-7xl lg:px-8">
        <div className="col-span-12 col-start-1 grid-rows-2 space-y-8 lg:col-span-6">
          {/* slider controls */}
          <div id="controls" className="flex items-center justify-start row-span-1 row-start-1 space-x-4">
            <button 
              className="z-0 p-3 transition-all duration-200 ease-linear border rounded-full hover:text-white text-primary-50 border-primary-50 hover:bg-primary-50"
              onClick={toggleSwitchDoctor}
            >
              <ArrowLeftIcon className="w-5 h-5" />
            </button>
            <span>0{!switchDoctor ? index : index + 1} - 02</span>
            <button 
              className="z-0 p-3 transition-all duration-200 ease-linear border rounded-full hover:text-white text-primary-50 border-primary-50 hover:bg-primary-50"
              onClick={toggleSwitchDoctor}
            >
              <ArrowRightIcon className="w-5 h-5" />
            </button>
          </div>
          <div className="row-span-1 row-start-2">
            {/* doctor bio */}
            {switchDoctor ? 
              <p>
                Dr. Daniel Frey graduated from high school in 2005. He then pursued his pre-dental requisites at the University of Pittsburgh, majoring in Biology. Dr. Frey excelled in his studies and was admitted to Temple University's dental school, graduating at the top of his class with the prestigious Summa Cum Laude designation. Continuing his education, Dr. Frey was admitted to the esteemed orthodontic residency program at the University of the Pacific in San Francisco where he worked with students and faculty from around the world and utilized cutting-edge orthodontic techniques. During his time in San Francisco, he conducted research in three-dimensional craniofacial analysis and earned his Master of Science degree. Dr. Frey is a member of the American Association of Orthodontists and the American Dental Association. In his leisure time, he enjoys staying active outdoors, camping, playing music, and spending time with loved ones.
              </p> 
            : 
              <p>
                Dr. Gregg Frey is an orthodontist based in Pennsylvania, who graduated from Temple University School of Dentistry with honors and served in the U.S. Navy Dental Corps before establishing his practice in the Lehigh Valley. He is a Diplomat of the American Board of Orthodontics and has received numerous distinctions, accreditations, and honors, including being named one of America's Top Orthodontists by the Consumer Review Council of America. This distinction is held by fewer than 25% of orthodontists nationwide. ABO certification represents the culmination of 5-10 years of written and oral examinations and independent expert review of actual treated patients. Recently Dr. Frey voluntarily re-certified. Dr. Frey enjoys coaching soccer, vintage car racing, and playing the drums.
              </p>
            }
          </div>
        </div>
        <div className="col-span-7 lg:col-span-4 lg:col-start-7">
          <figure className="w-full aspect-[3/4] h-max overflow-hidden flex items-start">
            <img
              className={`${
                switchDoctor ? "right" : "switch-right"
              } object-contain w-full transition-all duration-2000`}
              src="../../images/team_members/GreggFrey.jpg"
              alt="Dr. Gregg Frey"
            />
            <img
              className={`${
                switchDoctor ? "left" : "switch-left"
              } object-contain w-full transition-all duration-2000`}
              src="../../images/team_members/DanFrey.jpg"
              alt="Dr. Daniel Frey"
            />
          </figure>
          <figcaption>
            <h4>{!switchDoctor ? "Dr. Gregg Frey" : "Dr. Daniel Frey"}</h4>
            <p>{!switchDoctor ? "DDS" : "DMD, MSD"}</p>
          </figcaption>
        </div>
        <div className="col-span-5 lg:col-span-2 lg:col-start-11">
          <figure 
            className="grayscale h-max w-full aspect-[3/4] overflow-hidden flex items-start hover:cursor-pointer"
            onClick={toggleSwitchDoctor}
          >
            <img
              className={`${
                switchDoctor ? "right" : "switch-right"
              } object-contain w-full transition-all duration-2000`}
              src="../../images/team_members/DanFrey.jpg"
              alt="Dr. Daniel Frey"
            />
            <img
              className={`${
                switchDoctor ? "left" : "switch-left"
              } object-contain w-full transition-all duration-2000`}
              src="../../images/team_members/GreggFrey.jpg"
              alt="Dr. Gregg Frey"
            />
          </figure>
        </div>
      </div>
    </section>
  )
}

function MembersSection() {
  let memberCardRef = useRef(null)

  let { scrollYProgress } = useScroll({
    target: memberCardRef,
    offset: ["start start", "end start"]
  })

  let y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"])

  return (
    <section className="flex flex-col items-center justify-center w-full px-0 py-24 md:px-14 xl:px-8">
      <div className="max-w-screen-lg">
        <h2 className="mb-6 text-center capitalize md:mb-8 text-primary-30">Our Members</h2>
        <p className="sm:text-left md:text-center">
          Our members are X-ray certified, trained in CPR and first aid and most
          of them have received the designation of Specialized Orthodontic
          Assistant{" "}
          <Link
            href="https://www.trapezio.com/training-resources/course-outlines/soa-prep-course-outline/"
            className="underline transition duration-200 underline-offset-4 text-secondary-40 hover:text-secondary-50"
          >
            (SOA)
          </Link>
          . This is a voluntary certification program started by the American
          Association of Orthodontists to recognize those in the profession for
          their knowledge and experience.
        </p>
      </div>
      <div className="relative flex items-center justify-center px-12 mt-8 xl:mt-14 md:px-10 2xl:px-14">
        <div className="relative z-10 flex flex-col items-center justify-center w-full space-y-4 sm:space-y-6 xl:space-y-0 xl:flex-row xl:space-x-6">
          <section className="flex flex-col items-center justify-center sm:justify-start sm:flex-row sm:items-start">
            <motion.div
              style={{ y }}
              className="flex flex-col items-center justify-center w-64 px-6 py-10 mb-4 space-y-8 transition duration-500 ease-in-out rounded-lg xl:w-72 md:py-14 md:mb-0 sm:mr-6 xl:mr-6 2xl:mr-8"
            >
              <img
                src="/../../images/team_members/Alyssa_blob.png"
                alt="Alyssa"
                className="w-3/4 xl:w-48 2xl:w-48"
              />
              <div className="flex flex-col items-center justify-center space-y-1 text-center ">
                <p className="text-primary-50">Alyssa</p>
                <p>Treatment Coordinator</p>
              </div>
            </motion.div>
            <motion.div
              style={{ y }}
              className="flex flex-col items-center justify-center w-64 px-6 py-10 space-y-8 transition duration-500 ease-in-out rounded-lg xl:w-72 md:py-14 sm:mt-14 xl:mt-32"
            >
              <img
                src="/../../images/team_members/Lexi_blob.png"
                alt="Lexi"
                className="w-3/4 xl:w-48 2xl:w-48"
              />
              <div className="flex flex-col items-center justify-center space-y-1 text-center ">
                <p className=" text-primary-50">Lexi</p>
                <p>Treatment Coordinator</p>
              </div>
            </motion.div>
          </section>
          <section className="flex flex-col items-center justify-center sm:justify-start sm:flex-row sm:items-start">
            <motion.div
              style={{ y }}
              className="flex flex-col items-center justify-center w-64 px-6 py-10 mb-4 space-y-8 transition duration-500 ease-in-out rounded-lg xl:w-72 md:py-14 md:mb-0 sm:mr-6 xl:mr-6 2xl:mr-8"
            >
              <img
                src="/../../images/team_members/Dana_blob.png"
                alt="Dana"
                className="w-3/4 xl:w-48 2xl:w-48"
              />
              <div className="flex flex-col items-center justify-center space-y-1 text-center">
                <p className="text-primary-50">Dana</p>
                <p>Marketing Operations</p>
              </div>
            </motion.div>
            <motion.div
              style={{ y }}
              className="flex flex-col items-center justify-center w-64 px-6 py-10 space-y-8 transition duration-500 ease-in-out rounded-lg xl:w-72 md:py-14 sm:mt-14 xl:mt-32"
            >
              <img
                src="/../../images/team_members/Lizzie_blob.png"
                alt="Lizzie"
                className="w-3/4 xl:w-48 2xl:w-48"
              />
              <div className="flex flex-col items-center justify-center space-y-1 text-center">
                <p className="text-primary-50">Lizzie</p>
                <p>Patient Services</p>
              </div>
            </motion.div>
          </section>
        </div>
      </div>
      <div className="relative flex items-center justify-center px-12 mt-8 xl:mt-14 md:px-10 2xl:px-14">
        <div className="relative z-10 flex flex-col items-center justify-center w-full space-y-4 sm:space-y-6 xl:space-y-0 xl:flex-row xl:space-x-6">
          <section className="flex flex-col items-center justify-center sm:justify-start sm:flex-row sm:items-start">
            <motion.div
              style={{ y }}
              className="flex flex-col items-center justify-center w-64 px-6 py-10 mb-4 space-y-8 transition duration-500 ease-in-out rounded-lg xl:w-72 md:py-14 md:mb-0 sm:mr-6 xl:mr-6 2xl:mr-8"
            >
              <img
                src="/../../images/team_members/Kayli_blob.png"
                alt="Kayli"
                className="w-3/4 xl:w-48 2xl:w-48"
              />
              <div className="flex flex-col items-center justify-center space-y-1 text-center">
                <p className="text-primary-50">Kayli</p>
                <p>Financial Coordinator</p>
              </div>
            </motion.div>
            <motion.div
              style={{ y }}
              className="flex flex-col items-center justify-center w-64 px-6 py-10 space-y-8 transition duration-500 ease-in-out rounded-lg xl:w-72 md:py-14 sm:mt-14 xl:mt-32"
            >
              <img
                src="/../../images/team_members/Adriana_blob.png"
                alt="Adriana"
                className="w-3/4 xl:w-48 2xl:w-48"
              />
              <div className="flex flex-col items-center justify-center space-y-1 text-center">
                <p className="text-primary-50">Adriana</p>
                <p>Insurance Coordinator</p>
              </div>
            </motion.div>
          </section>
          <section className="flex flex-col items-center justify-center sm:justify-start sm:flex-row sm:items-start">
            <motion.div
              style={{ y }}
              className="flex flex-col items-center justify-center w-64 px-6 py-10 mb-4 space-y-8 transition duration-500 ease-in-out rounded-lg xl:w-72 md:py-14 md:mb-0 sm:mr-6 xl:mr-6 2xl:mr-8"
            >
              <img
                src="/../../images/team_members/Ibis_blob.png"
                alt="Ibis"
                className="w-3/4 xl:w-48 2xl:w-48"
              />
              <div className="flex flex-col items-center justify-center space-y-1 text-center">
                <p className="text-primary-50">Ibis</p>
                <p>Lab Manager</p>
              </div>
            </motion.div>
            <motion.div
              style={{ y }}
              className="flex flex-col items-center justify-center w-64 px-6 py-10 space-y-8 transition duration-500 ease-in-out rounded-lg xl:w-72 md:py-14 sm:mt-14 xl:mt-32"
            >
              <img
                src="/../../images/team_members/Aleah_blob.png"
                alt="Aleah"
                className="w-3/4 xl:w-48 2xl:w-48"
              />
              <div className="flex flex-col items-center justify-center space-y-2 text-center">
                <p className="text-primary-50">Aleah</p>
                <p>Specialized Orthodontic Assistant</p>
              </div>
            </motion.div>
          </section>
        </div>
      </div>
      <div className="relative flex items-center justify-center px-12 mt-8 xl:mt-14 md:px-10 2xl:px-14">
        <div className="relative z-10 flex flex-col items-center justify-center w-full space-y-4 sm:space-y-6 xl:space-y-0 xl:flex-row xl:space-x-6">
          <section className="flex flex-col items-center justify-center sm:justify-start sm:flex-row sm:items-start">
            <motion.div
              style={{ y }}
              className="flex flex-col items-center justify-center w-64 px-6 py-10 mb-4 space-y-8 transition duration-500 ease-in-out rounded-lg xl:w-72 md:py-14 md:mb-0 sm:mr-6 xl:mr-6 2xl:mr-8"
            >
              <img
                src="/../../images/team_members/Nicolle_blob.png"
                alt="Nicolle"
                className="w-3/4 xl:w-48 2xl:w-48"
              />
              <div className="flex flex-col items-center justify-center space-y-2 text-center">
                <p className="text-primary-50">Nicolle</p>
                <p>Specialized Orthodontic Assistant</p>
              </div>
            </motion.div>
            <motion.div
              style={{ y }}
              className="flex flex-col items-center justify-center w-64 px-6 py-10 space-y-8 transition duration-500 ease-in-out rounded-lg xl:w-72 md:py-14 sm:mt-14 xl:mt-32"
            >
              <img
                src="/../../images/team_members/Grace_blob.png"
                alt="Grace"
                className="w-3/4 xl:w-48 2xl:w-48"
              />
              <div className="flex flex-col items-center justify-center space-y-2 text-center">
                <p className="text-primary-50">Grace</p>
                <p>Specialized Orthodontic Assistant</p>
              </div>
            </motion.div>
          </section>
          <section className="flex flex-col items-center justify-center sm:justify-start sm:flex-row sm:items-start">
            <motion.div
              style={{ y }}
              className="flex flex-col items-center justify-center w-64 px-6 py-10 mb-4 space-y-8 transition duration-500 ease-in-out rounded-lg xl:w-72 md:py-14 md:mb-0 sm:mr-6 xl:mr-6 2xl:mr-8"
            >
              <img
                src="/../../images/team_members/Samantha_blob.png"
                alt="Samantha"
                className="w-3/4 xl:w-48 2xl:w-48"
              />
              <div className="flex flex-col items-center justify-center space-y-1 text-center">
                <p className="text-primary-50">Samantha</p>
                <p>Patient Services</p>
              </div>
            </motion.div>
            <motion.div
              style={{ y }}
              className="flex flex-col items-center justify-center w-64 px-6 py-10 space-y-8 transition duration-500 ease-in-out rounded-lg xl:w-72 md:py-14 sm:mt-14 xl:mt-32"
            >
              <img
                src="/../../images/team_members/Elizabeth_blob.png"
                alt="Elizabeth"
                className="w-3/4 xl:w-48 2xl:w-48"
              />
              <div className="flex flex-col items-center justify-center space-y-1 text-center">
                <p className="text-primary-50">Elizabeth</p>
                <p>Patient Services</p>
              </div>
            </motion.div>
          </section>
        </div>
      </div>
    </section>
  )
}
