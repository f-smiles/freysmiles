'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Elements, AddressElement, PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js"

import getStripe from "@/lib/get-stripe"
import { useCartStore } from "@/lib/cart-store"
import { createInvoicePaymentIntent } from "@/server/actions/create-invoice-payment-intent"
import { Button } from "@/components/ui/button"


function CheckoutForm({ invoiceID, invoiceTotal, invoiceDescription }: { invoiceID: number, invoiceTotal: number, invoiceDescription: string }) {

  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

  const stripe = useStripe()
  const elements = useElements()

  const router = useRouter()

  const { setCheckoutProgress } = useCartStore()

  const handleSubmit =  async(event: React.FormEvent) => {
    event.preventDefault()
    setLoading(true)
    if (!stripe || !elements) {
      setLoading(false)
      return
    }

    // Stripe Elements submit
    const { error: stripeElementsSubmitError } = await elements.submit()
    if (stripeElementsSubmitError) {
      setErrorMessage(stripeElementsSubmitError.message ?? "An unknown error occured - Stripe Elements Submit")
      setLoading(false)
      console.log("elements submit error")
      return
    }

    // create Stripe PaymentIntent
    const result = await createInvoicePaymentIntent({
      invoiceID,
      amount: invoiceTotal,
      currency: "usd",
      description: invoiceDescription,
    })
    if (result?.data?.error) {
      setErrorMessage(result.data.error)
      setLoading(false)
      toast.error(result.data.error)
      console.log("create payment intent error")
    }
    if (result?.data?.success) {
       // confirm stripe payment
       const { error: stripeConfirmPaymentError } = await stripe.confirmPayment({
        elements,
        clientSecret: result.data.success.clientSecret,
        confirmParams: {
          return_url: `${window.location.origin}/invoices/success`,
          receipt_email: result.data.success.userEmail,
        },
        redirect: "if_required",
      })
      if (stripeConfirmPaymentError) {
        setErrorMessage(stripeConfirmPaymentError.message as string)
        setLoading(false)
        console.log("stripe confirm payment error")
        return
      } else {
        setLoading(false)
        router.refresh()
      }
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col justify-center space-y-8">

      <PaymentElement />
      <AddressElement options={{ mode: "billing" }} />

      <Button
        disabled={!stripe || !elements || loading}
        className="w-full max-w-md mx-auto"
      >
        {loading ? (
          <span className="inline-flex items-center">
            <svg className="w-5 h-5 mr-3 -ml-1 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p>Processing...</p>
          </span>
        ) : <p>Pay now</p>}
      </Button>
    </form>
  )
}

export default function PaymentForm({ invoiceID, invoiceTotal, invoiceDescription }: { invoiceID: number, invoiceTotal: number, invoiceDescription: string }) {
  return (
    <div className="max-w-2xl mx-auto">
      <Elements
        stripe={getStripe()}
        options={{
          mode: "payment",
          currency: "usd",
          amount: invoiceTotal,
        }}
      >
        <CheckoutForm invoiceID={invoiceID} invoiceTotal={invoiceTotal} invoiceDescription={invoiceDescription} />
      </Elements>
    </div>
  )
}
