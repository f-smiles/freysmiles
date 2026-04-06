"use client"
import { useEffect, useState } from "react";
import JoinTeamForm from "./index";
import VerticalColorSpectrum from "@/components/vertical-color-spectrum";

export default function Careers() {
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