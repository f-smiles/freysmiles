"use client"

import type { Stripe } from "stripe"
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"


export default function SuccessMessage({ invoiceOrder }: { invoiceOrder: Stripe.Response<Stripe.PaymentIntent> }) {

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (invoiceOrder.status === "succeeded") {
      setLoading(false)
    }
  }, [])

  return (
    <>
      {!loading ? (
        <div className="flex flex-col items-center max-w-2xl pb-8 mx-auto overflow-auto md:pb-12">
          <p>Order Confirmed</p>
          <motion.figure className="text-center"
            initial={{ y: -12 }}
            animate={{ y: [12, 0, -12] }}
            transition={{
              delay: 0.3,
              duration: 1.25,
              repeat: Infinity,
              repeatType: "mirror"
            }}
          >
            <Image src="/images/shop/Email_sent.png" alt="Order confirmed. Email sent" width={720} height={1280} className="h-auto w-80 md:w-96" priority />
          </motion.figure>
          <p>A copy of your receipt will be sent to your email</p>

          <Link href="/dashboard/invoices" className="pt-8">
            <Button>View your invoice</Button>
          </Link>
        </div>
      ) : <p>Loading...</p>}
    </>
  )
}