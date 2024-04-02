"use client"
import Link from "next/link"
import { useDispatch } from 'react-redux'
import { clearBag } from "@/app/_store/reducers/bagReducer"
import Amex from "@/app/_components/card_brands/Amex"
import CashApp from "@/app/_components/card_brands/CashApp"
import Diners from "@/app/_components/card_brands/Diners"
import Discover from "@/app/_components/card_brands/Discover"
import JCB from "@/app/_components/card_brands/JCB"
import LinkLogo from "@/app/_components/card_brands/LinkLogo"
import MasterCard from "@/app/_components/card_brands/MasterCard"
import UnionPay from "@/app/_components/card_brands/UnionPay"
import Visa from "@/app/_components/card_brands/Visa"
import HomeIcon from "@/app/_components/ui/HomeIcon"
import HomeModernIcon from "@/app/_components/ui/HomeModernIcon"

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

const actions = [
  {
    location: 'Allentown',
    address_line1: '1251 S Cedar Crest Blvd Suite 210',
    address_line2: 'Allentown, PA 18103',
    href: '#',
    icon: HomeIcon,
    iconForeground: 'text-teal-700',
    iconBackground: 'bg-teal-50',
  },
  {
    location: 'Bethlehem',
    address_line1: '2901 Emrick Boulevard',
    address_line2: 'Bethlehem, PA 18020',
    href: '#',
    icon: HomeModernIcon,
    iconForeground: 'text-purple-700',
    iconBackground: 'bg-purple-50',
  },
  {
    location: 'Lehighton',
    address_line1: '4155 Independence Drive',
    address_line2: 'Schnecksville, PA 18078',
    href: '#',
    icon: HomeModernIcon,
    iconForeground: 'text-indigo-700',
    iconBackground: 'bg-indigo-50',
  },
  {
    location: 'Schnecksville',
    address_line1: '1080 Blakeslee Blvd Dr E',
    address_line2: 'Lehighton, PA 18235',
    href: '#',
    icon: HomeIcon,
    iconForeground: 'text-rose-700',
    iconBackground: 'bg-rose-50',
  },
]

function PickupLocations({ location }) {
  return (
    <div className="w-1/2 mt-8 overflow-hidden bg-gray-200 divide-y divide-gray-200 rounded-lg shadow sm:grid sm:gap-px sm:divide-y-0">
      {actions.filter((action) => action.location === location).map((action) => (
        <div
          key={action.location === location}
          className='relative p-6 bg-white group focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500'
        >
          <div>
            <span
              className={classNames(
                action.iconBackground,
                action.iconForeground,
                'inline-flex rounded-lg p-3 ring-4 ring-white'
              )}
            >
              <action.icon className="w-6 h-6" aria-hidden="true" />
            </span>
          </div>
          <div className="mt-8">
            <h3 className="text-base font-semibold leading-6 text-gray-900">
              <Link href={action.href} className="focus:outline-none">
                {/* Extend touch target to entire panel */}
                <span className="absolute inset-0" aria-hidden="true" />
                {action.location}
              </Link>
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              {action.address_line1}<br />
              {action.address_line2}
            </p>
          </div>
          <span
            className="absolute text-gray-300 transition-all duration-300 ease-in-out pointer-events-none right-6 top-6 group-hover:text-gray-400 group-hover:rotate-45"
            aria-hidden="true"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20 4h1a1 1 0 00-1-1v1zm-1 12a1 1 0 102 0h-2zM8 3a1 1 0 000 2V3zM3.293 19.293a1 1 0 101.414 1.414l-1.414-1.414zM19 4v12h2V4h-2zm1-1H8v2h12V3zm-.707.293l-16 16 1.414 1.414 16-16-1.414-1.414z" />
            </svg>
          </span>
        </div>
      ))}
    </div>
  )
}

export default function ThankYou({ checkoutSession, paymentDetails }) {
  const dispatch = useDispatch()

  if (checkoutSession.status === "complete") dispatch(clearBag())

  const { amount_subtotal, amount_total, shipping_cost, line_items, shipping_details, customer_details, metadata } = checkoutSession

  // console.log(checkoutSession)

  return (
    <section className="relative mx-auto lg:min-h-full">
      <div className="overflow-hidden h-80 lg:absolute lg:h-full lg:w-1/2 lg:pr-4 xl:pr-12">
        <img
          src="https://tailwindui.com/img/ecommerce-images/confirmation-page-06-hero.jpg"
          alt="TODO"
          className="object-cover object-center w-full h-full"
        />
      </div>
      <div>
        <div className="max-w-2xl px-4 py-16 mx-auto sm:px-6 sm:py-24 lg:grid lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8 lg:py-32 xl:gap-x-24">
          <div className="lg:col-start-2">
            <h1 className="text-sm font-medium text-indigo-600">Payment successful</h1>
            <p className="mt-4 text-4xl tracking-tight text-zinc-800 sm:text-5xl">Thanks for ordering</p>
            <p className="mt-4 text-base text-zinc-500">
              {/* We appreciate your order, we're currently processing it. So hang tight and we'll send you confirmation very soon! */}
              We appreciate your order! Your items will be ready for pick-up at one of our four office locations. We're currently processing your order, so hang tight and we'll send you confirmation very soon!
            </p>

            <dl className="mt-8 text-sm font-medium">
              <p className="text-base font-medium text-zinc-800">Pick-Up Location:</p>
              <PickupLocations location={metadata.pickup_location} />
            </dl>

            <dl className="mt-16 text-sm font-medium">
              {/* <dt className="text-gray-900">Tracking number</dt>
              <dd className="mt-2 text-indigo-600">51547878755545848512</dd> */}
              <dt className="text-zinc-800">A confirmation email was sent to</dt>
              <dd className="mt-2 text-indigo-600">{customer_details.email}</dd>
            </dl>

            <ul
              role="list"
              className="mt-16 text-sm font-medium border-t border-gray-200 divide-y divide-gray-200 text-zinc-500"
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
                    ) : paymentDetails.type === "link" ? (
                      <LinkLogo />
                    ) : null}
                  </div>
                  <div className="flex-auto">
                    <p className="text-zinc-800">{paymentDetails.type === "card" ? `Ending with ${paymentDetails.card.last4}` : ''}</p>
                    <p> {paymentDetails.type === "card" ? `Expires ${paymentDetails.card.exp_month} / ${paymentDetails.card.exp_year}` : (paymentDetails.type === "cashapp" ? paymentDetails.cashapp.buyer_id : '')}</p>
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
