'use client'

import './css/style.css'
import InversionLens from './components/InversionLens'
import React, { Suspense } from 'react'

export default function Page() {
  return (
    <Suspense fallback={'Loading...'}>
      <InversionLens imgSrc={'/images/images/base.jpg'} />
    </Suspense>
  )
}