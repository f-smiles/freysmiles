"use client"
import React, { useEffect, useState } from 'react'
import JoinTeamForm from '@/components/forms/join-team-form';
import VerticalColorSpectrum from '@/components/vertical-color-spectrum';

export default function Index() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (loading) {
      setTimeout(() => {
        setLoading(false)
      }, 2400)
    }
  }, [loading])

  return (
    <>
      {loading ? (
        <VerticalColorSpectrum />
      ) : <JoinTeamForm /> }
    </>
  )
}