'use client'
import './style.css'
import React, { useEffect, useRef } from 'react'
import gsap from 'gsap'
import ScrambleTextPlugin from 'gsap/ScrambleTextPlugin'

const patients = [
  {
    name: 'Lainie',
    image: '../images/testimonials/laniepurple.png',
    duration: '20 months',
  },
  {
    name: 'Ron L.',
    image: '../images/testimonials/Ron_Lucien.jpg',
    duration: 'INVISALIGN',
  },
  {
    name: 'Elizabeth',
    image: '../images/testimonials/elizabethpatient.jpeg',
    duration: 'INVISALIGN, GROWTH APPLIANCE',
  },
  {
    name: 'Kinzie',
    image: '../images/testimonials/kinzie1.jpg',
    duration: 'BRACES, 24 months',
  },
  { name: 'Kasprenski',
    image: '../images/testimonials/kasprenski.jpg',
    duration: '',
  },
  {
    name: 'Leanne',
    image: '../images/testimonials/leanne.png',
    duration: '12 months',
  },
  {
    name: 'Harold',
    image: '../images/testimonials/Narvaez.jpg',
    duration: 'Invisalign',
  },
  { name: 'Rosie & Grace',
    image: '../images/testimonials/Rosiegrace.png',
    duration: '',
  },
  {
    name: 'Keith',
    image: '../images/testimonials/hobsonblue.png',
    duration: '',
  },
  {
    name: 'Justin',
    image: '../images/testimonials/hurlburt.jpeg',
    duration: 'Invisalign, 2 years',
  },
  { name: 'Kara',
    image: '../images/testimonials/Kara.jpeg',
    duration: '',
  },
  {
    name: 'Sophia',
    image: '../images/testimonials/Sophia_Lee.jpg',
    duration: '2 years, Braces',
  },
  { name: 'Brynn',
    image: '../images/testimonials/brynnportrait.png',
    duration: '',
  },
  { name: 'Emma',
    image: '../images/testimonials/Emma.png',
    duration: '',
  },
  {
    name: 'Brooke',
    image: '../images/testimonials/Brooke_Walker.jpg',
    duration: '2 years, Braces',
  },
  {
    name: 'Nilaya',
    image: '../images/testimonials/nilaya.jpeg',
    duration: 'Braces',
  },
  { name: 'Maria A.',
    image: '../images/testimonials/Maria_Anagnostou.jpg',
    duration: '',
  },
  {
    name: 'Natasha K.',
    image: '../images/testimonials/Natasha_Khela.jpg',
    duration: '',
  },
  {
    name: 'James C.',
    image: '../images/testimonials/James_Cipolla.jpg',
    duration: 'Invisalign, 2 years',
  },
  {
    name: 'Devika K.',
    image: '../images/testimonials/Devika_Knafo.jpg',
    duration: '',
  },
  {
    name: 'Ibis S.',
    image: '../images/testimonials/Ibis_Subero.jpg',
    duration: 'Invisalign, 1 year',
  },
  { name: 'Abigail',
    image: '../images/testimonials/abigail.png',
    duration: '',
  },
  { name: 'Emma',
    image: '../images/testimonials/EmmaF.png',
    duration: '',
  },
  {
    name: 'Karoun G',
    image: '../images/test/base.jpg',
    duration: 'Motion Appliance, Invisalign',
  },
]

gsap.registerPlugin(ScrambleTextPlugin)

export default function ScrollList() {
  const headingRefs = useRef([])
  const descriptionRefs = useRef([])

  const handleHover = (i, name, duration) => {
    const scramble = {
      characters: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
      speed: 0.8,
      newChars: 0.3,
      revealDelay: 0,
      tweenLength: true,
    }
    gsap.to(headingRefs.current[i], {
      duration: 1.5,
      scrambleText: { text: name, ...scramble },
      ease: 'power2.out',
    })

    gsap.to(descriptionRefs.current[i], {
      duration: 1.5,
      scrambleText: { text: duration || '--', ...scramble },
      ease: 'power2.out',
    })
  }

  return (
    <div className='px-16 py-32 font-neuehaas45'>
      <div className='flex justify-center items-center gap-4 tracking-wider px-4 sm:px-0'>
        <span className='text-sm'>●</span>
        <h3 className='text-sm/6'>Our patient results</h3>
        <span className='text-sm text-gray-300'>●</span>
        <h3 className='mt-1 max-w-2xl text-sm/6'>Read the reviews</h3>
      </div>
      <div className='mt-6 border-t border-gray-100 dark:border-white/10'>
        <dl className='divide-y divide-gray-100 dark:divide-white/10'>
          {patients.map((_, i) => (
            <div key={`${i}-${_.name}`} className='px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0' onMouseEnter={() => handleHover(i, _.name, _.duration)}>
              <dt ref={(el) => headingRefs.current[i] = el} className='text-sm/6 tracking-wider uppercase'>{_.name}</dt>
              <dd ref={(el) => descriptionRefs.current[i] = el} className='mt-1 text-sm/6 tracking-wider uppercase sm:col-span-2 sm:mt-0'>{_.duration === '' ? '--' : _.duration}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  )
}