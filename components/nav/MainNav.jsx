'use client'
import React from 'react'
import MobileNav from './MobileNav'
import DesktopNav from './DesktopNav'

export default function MainNav({ user }) {
  return (
    <>
      <MobileNav user={user} />
      {/* <DesktopNav user={user} /> */}
    </>
  )
}