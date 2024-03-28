"use client"
import Link from "next/link"
import { useDispatch } from 'react-redux'
import { clearBag } from "@/app/_store/reducers/bagReducer"
import Amex from "@/app/_components/card_brands/Amex"
import CashApp from "@/app/_components/card_brands/CashApp"
import Diners from "@/app/_components/card_brands/Diners"
import Discover from "@/app/_components/card_brands/Discover"
import JCB from "@/app/_components/card_brands/JCB"
import MasterCard from "@/app/_components/card_brands/MasterCard"
import UnionPay from "@/app/_components/card_brands/UnionPay"
import Visa from "@/app/_components/card_brands/Visa"

export default function ThankYou({ checkoutSession, paymentDetails }) {  
  const dispatch = useDispatch()
  
  if (checkoutSession.status === "complete") dispatch(clearBag())

  const { amount_subtotal, amount_total, shipping_cost, line_items, shipping_details, customer_details } = checkoutSession

  return (
    <section className="relative mx-auto lg:min-h-full lg:h-[100dvh]">
      <div className="overflow-hidden h-80 lg:absolute lg:h-full lg:w-1/2 lg:pr-4 xl:pr-12">
        <img
          src="https://tailwindui.com/img/ecommerce-images/confirmation-page-06-hero.jpg"
          alt="TODO"
          className="object-cover object-center w-full h-full"
        />
      </div>
      {/* <div className="w-full h-full bg-[#EDE0D9]/60"> */}
      <div>
        <div className="max-w-2xl px-4 py-16 mx-auto sm:px-6 sm:py-24 lg:grid lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8 lg:py-32 xl:gap-x-24">
          <div className="lg:col-start-2">
            <h1 className="text-sm font-medium text-indigo-600">Payment successful</h1>
            <p className="mt-2 text-4xl tracking-tight text-zinc-800 sm:text-5xl">Thanks for ordering</p>
            <p className="mt-2 text-base text-zinc-500">
              We appreciate your order, we're currently processing it. So hang tight and we'll send you confirmation
              very soon!
            </p>

            <dl className="mt-16 text-sm font-medium">
              {/* <dt className="text-gray-900">Tracking number</dt>
              <dd className="mt-2 text-indigo-600">51547878755545848512</dd> */}
              <dt className="text-zinc-800">A confirmation email was sent to</dt>
              <dd className="mt-2 text-indigo-600">{customer_details.email}</dd>
            </dl>

            <ul
              role="list"
              className="mt-6 text-sm font-medium border-t border-gray-200 divide-y divide-gray-200 text-zinc-500"
            >
              {line_items.data.map((lineItem) => (
                <li key={lineItem.id} className="flex py-6 space-x-6">
                  {/* <img
                    src={product.imageSrc}
                    alt={product.imageAlt}
                    className="flex-none object-cover object-center w-24 h-24 bg-gray-100 rounded-md"
                  /> */}
                  <div className="flex-auto space-y-1">
                    <p className="text-zinc-800">{lineItem.description}</p>
                    <p className="text-sm">Qty: {lineItem.quantity}</p>
                  </div>
                  <p className="flex-none font-medium text-zinc-800">${(lineItem.amount_total / 100).toFixed(2)}</p>
                </li>
              ))}
            </ul>

            <dl className="pt-6 space-y-6 text-sm font-medium border-t border-gray-200 text-zinc-500">
              <div className="flex justify-between">
                <dt>Subtotal</dt>
                <dd className="text-zinc-800">${(amount_subtotal / 100).toFixed(2)}</dd>
              </div>

              <div className="flex justify-between">
                <dt>Shipping</dt>
                <dd className="text-zinc-800">${(shipping_cost / 100).toFixed(2)}</dd>
              </div>

              {/* <div className="flex justify-between">
                <dt>Taxes</dt>
                <dd className="text-gray-900">$6.40</dd>
              </div> */}

              <div className="flex items-center justify-between pt-6 border-t border-gray-200 text-zinc-800">
                <dt className="text-base">Total</dt>
                <dd className="text-base">${(amount_total / 100).toFixed(2)}</dd>
              </div>
            </dl>

            <dl className="grid grid-cols-2 mt-16 text-sm text-zinc-500 gap-x-4">
              <div>
                <dt className="font-medium text-zinc-800">Shipping Address</dt>
                <dd className="mt-2">
                  <address className="not-italic">
                    <span className="block">{customer_details.name}</span>
                    <span className="block">{shipping_details.address.line1}</span>
                    <span className="block">{shipping_details.address.line2}</span>
                    <span className="block">{shipping_details.address.city}, {shipping_details.address.state} {shipping_details.address.postal_code}</span>
                    <span className="block">{shipping_details.address.country}</span>
                  </address>
                </dd>
              </div>
              <div>
                <dt className="font-medium text-zinc-800">Payment Information</dt>
                <dd className="mt-2 space-y-2 sm:flex sm:space-x-4 sm:space-y-0">
                  <div className="flex-none">
                    {paymentDetails.type === "card" && paymentDetails.card.brand === "amex" ? (
                      <>
                        <Amex />
                        <p className="sr-only">Amex</p>
                      </>
                    ) : paymentDetails.type === "card" && paymentDetails.card.brand === "bccard" ? (
                      <>
                        <Diners />
                        <p className="sr-only">BCcard and DinaCard</p>
                      </>
                    ) : paymentDetails.type === "card" && paymentDetails.card.brand === "diners" ? (
                      <>
                        <Diners />
                        <p className="sr-only">Diners Club</p>
                      </>
                    ) : paymentDetails.type === "card" && paymentDetails.card.brand === "discover" ? (
                      <>
                        <Discover />
                        <p className="sr-only">Discover</p>
                      </>
                    ) : paymentDetails.type === "card" && paymentDetails.card.brand === "jcb" ? (
                      <>
                        <JCB />
                        <p className="sr-only">JCB</p>
                      </>
                    ) : paymentDetails.type === "card" && paymentDetails.card.brand === "mastercard" ? (
                      <>
                        <MasterCard />
                        <p className="sr-only">Mastercard</p>
                      </>
                    ) : paymentDetails.type === "card" && paymentDetails.card.brand === "visa" ? (
                      <>
                        <Visa />
                        <p className="sr-only">Visa</p>
                      </>
                    ) : paymentDetails.type === "card" && paymentDetails.card.brand === "unionpay" ? (
                      <>
                        <UnionPay />
                        <p className="sr-only">Unionpay</p>
                      </>
                    ) : paymentDetails.type === "cashapp" ? (
                      <>
                        <CashApp />
                        <p className="sr-only">Cashapp</p>
                      </>
                    ) : null}
                  </div>
                  <div className="flex-auto">
                    <p className="text-zinc-800">{paymentDetails.type === "card" ? `Ending with ${paymentDetails.card.last4}` : `${paymentDetails.cashapp.buyer_id}`}</p>
                    <p>{paymentDetails.type === "card" ? `Expires ${paymentDetails.card.exp_month} / ${paymentDetails.card.exp_year}` : `${paymentDetails.cashapp.buyer_id}`}</p>
                  </div>
                </dd>
              </div>
            </dl>

            <div className="py-6 mt-16 text-right border-t border-gray-200">
              <Link href="/products" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                Continue Shopping
                <span aria-hidden="true"> &rarr;</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
