'use client'
import './style.css'
import React, { useEffect, useRef } from 'react'
import gsap from 'gsap'
import ScrambleTextPlugin from 'gsap/ScrambleTextPlugin'
import { patients } from './patients'
import { BounceLine } from './bounce-line'

gsap.registerPlugin(ScrambleTextPlugin)

export default function ScrollList() {
  const awardRef = useRef(null)
  const awardCardArea = useRef(null)
  const awardCardItem = useRef(null)
  const awardItem = useRef(null)

  return (
    <div ref={awardRef} className='award'>
      <div ref={awardCardArea} className='award-card-area'>
        {patients.map((patient, i) => (
          <div
            key={`${i}-${patient.name}`}
            ref={awardCardItem}
            className='award-card-item'
          >
            <CardAward {...patient} />
          </div>
        ))}
      </div>

      <div className='award-bg'>
        <div className='award-inner'>
          <div className='l-container'>
            <span className='award-title-read-area'>
              <AppReadTitle />
            </span>
            <div className='award-list-wrapper'>
              <div className='award-list'>
                {patients.map((patient, i) => (
                  <div
                    key={`${patient.name}-${i}`}
                    ref={awardItem}
                    className='award-item'
                  >
                    <BounceLine />
                    <p className='award-group'>{patient.name}</p>
                    <p className='award-title'>{patient.duration}</p>
                  </div>
                ))}
                <div className='award-list-bottom-line'>
                  <BounceLine />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const CardAward = () => {
  return (
    <div className='w-full h-full'>CardAward</div>
  )
}

const AppReadTitle = () => {
  return (
    <div className='flex justify-center items-center gap-4 tracking-wider px-4 sm:px-0'>
      <span className='text-xs'>●</span>
      <h3 className='text-sm/6'>Our patient results</h3>
      <span className='text-xs text-gray-300'>●</span>
      <h3 className='mt-1 max-w-2xl text-sm/6'>Read the reviews</h3>
    </div>
  )
}

function OldScrollList() {
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