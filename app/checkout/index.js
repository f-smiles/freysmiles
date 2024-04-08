'use client'
import Link from 'next/link'
import { Fragment, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Dialog, Transition } from '@headlessui/react'
import { selectBag, removeFromBag, incrementQuantity, decrementQuantity } from '../_store/reducers/bagReducer'
import ExclamationTriangleIcon from '../_components/ui/ExclamationTriangleIcon'
import MinusIcon from '../_components/ui/MinusIcon'
import PlusIcon from '../_components/ui/PlusIcon'
import XIcon from '../_components/ui/XIcon'

function EmptyBagState() {
  return (
    <div className="rounded-lg border-2 border-dashed border-gray-300 flex flex-col justify-center items-center max-w-2xl px-4 pt-16 pb-24 mx-auto space-y-8 text-center sm:px-6 lg:max-w-7xl lg:px-8 h-[40dvh] my-24 sm:my-32">
      <h1>Shopping Bag</h1>
      <p>You currently do not have any items in your bag.</p>
      <Link
        href="/products"
        className="block px-6 py-3 text-base font-medium text-white transition-colors duration-150 ease-in-out border border-transparent rounded-md shadow-sm bg-primary-50 w-max hover:bg-primary-30"
      >
        Shop Now &rarr;
      </Link>
    </div>
  )
}

function Warning({ open, setOpen }) {
  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={setOpen}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex items-end justify-center min-h-full p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative px-4 pt-5 pb-4 overflow-hidden text-left transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:w-full sm:max-w-sm sm:p-6">
                <div>
                  <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full">
                    <ExclamationTriangleIcon className="w-6 h-6 text-red-600" aria-hidden="true" />
                  </div>
                  <div className="mt-3 text-center sm:mt-5">
                    <Dialog.Title as="h3" className="text-base font-semibold leading-6 text-gray-900">
                      Pickup Location Missing
                    </Dialog.Title>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Please select an office to pick up your order items.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-5 sm:mt-6">
                  <button
                    type="button"
                    className="inline-flex justify-center w-full px-3 py-2 text-sm font-semibold text-white rounded-md shadow-sm bg-primary-60 hover:bg-primary-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-60"
                    onClick={() => setOpen(false)}
                  >
                    Go back
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}

export default function BagComponent() {
  const [open, setOpen] = useState(false)
  const [pickupLocation, setPickupLocation] = useState(null)

  const locations = [
    { id: 'allentown', name: 'Allentown', address_line1: '1251 S Cedar Crest Blvd Suite 210', address_line2: 'Allentown, PA 18103' },
    { id: 'bethlehem', name: 'Bethlehem', address_line1: '2901 Emrick Boulevard', address_line2: 'Bethlehem, PA 18020' },
    { id: 'lehighton', name: 'Lehighton', address_line1: '4155 Independence Drive', address_line2: 'Schnecksville, PA 18078' },
    { id: 'schnecksville', name: 'Schnecksville', address_line1: '1080 Blakeslee Blvd Dr E', address_line2: 'Lehighton, PA 18235' },
  ]

  const handleLocationChange = async (newLocation) => {
    await setPickupLocation(newLocation)
  }

  const dispatch = useDispatch()

  const bag = useSelector(selectBag)

  const calculateSubtotal = () => {
    let subtotal = 0
    subtotal = bag
      .map((item) => (item.product.price) * item.quantity)
      .reduce((acc, cur) => acc + cur, 0)
      .toFixed(2)
    return subtotal
  }

  const handleCheckout = async () => {
    if (!pickupLocation) {
      // alert('Please select a pickup location!')
      await setOpen(true)
      return
    }
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/checkout/checkout-sessions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ bag, pickupLocation })
      })
      const data = await res.json()
      window.location.assign(data)
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <>
      {bag.length === 0 ? (
        <EmptyBagState />
      ) : (
        <div className="bg-white">
          <div className="max-w-2xl px-4 pt-16 pb-24 mx-auto sm:px-6 lg:max-w-7xl lg:px-8">
            <h1 className="text-3xl tracking-tight text-gray-900 sm:text-4xl">Shopping Cart</h1>
            <div className="mt-12 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16">
              <section aria-labelledby="cart-heading" className="lg:col-span-7">
                <h2 id="cart-heading" className="sr-only">
                  Items in your shopping cart
                </h2>

                <ul role="list" className="border-t border-b border-gray-200 divide-y divide-gray-200">
                  {bag.map((item) => (
                    <li key={item.product.id} className="flex py-6 sm:py-10">
                      <div className="flex-shrink-0">
                        <img
                          src={item.product.images[0]}
                          alt={item.product.name}
                          className="object-cover object-center w-24 h-24 rounded-md sm:h-48 sm:w-48"
                        />
                      </div>

                      <div className="flex flex-col justify-between flex-1 ml-4 sm:ml-6">
                        <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
                          <div>
                            <div className="flex justify-between">
                              <h3 className="text-sm">
                                <Link href={`/products/${item.product.id}`} className="font-medium text-gray-700 hover:text-gray-800">
                                  {item.product.name}
                                </Link>
                              </h3>
                            </div>
                            <p className="mt-1 text-sm font-medium text-gray-900">${item.product.price}</p>
                            <p className="mt-1 text-sm font-medium text-gray-900">Qty: {item.quantity}</p>
                          </div>

                          <div className="mt-4 sm:mt-0 sm:pr-9">
                            <div
                              id="controls"
                              className="flex flex-col mx-auto mt-6 space-y-2 md:mt-0"
                            >
                              <span className="flex">
                                <button
                                  className={`${
                                      item.quantity === 1
                                      ? "text-gray-300"
                                      : "hover:bg-primary-50 hover:text-white"
                                  } rounded-tl rounded-bl border py-1 px-2 border-primary-50 text-primary-50 transition-colors duration-150 ease-linear`}
                                  type="button"
                                  disabled={item.quantity === 1}
                                  onClick={() => dispatch(decrementQuantity(item))}
                                >
                                  <MinusIcon className="w-4 h-4" />
                                </button>
                                <p className="px-3 py-1 border-t border-b border-primary-50">
                                  {item.quantity}
                                </p>
                                <button
                                  className="px-2 py-1 transition-colors duration-150 ease-linear border rounded-tr rounded-br text-primary-50 border-primary-50 hover:bg-primary-50 hover:text-white"
                                  type="button"
                                  disabled={item.quantity === 10}
                                  onClick={() => dispatch(incrementQuantity(item))}
                                >
                                  <PlusIcon className="w-4 h-4" />
                                </button>
                              </span>
                            </div>

                            <div className="absolute top-0 right-0">
                              <button type="button" className="inline-flex p-2 -m-2 text-gray-400 hover:text-gray-500"onClick={() => dispatch(removeFromBag(item))}>
                                <span className="sr-only">Remove</span>
                                <XIcon className="w-5 h-5" aria-hidden="true" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>

                {/* PICKUP LOCATIONS */}
                <div className="space-y-12">
                  <div className="p-4 my-12 rounded-md bg-yellow-50">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <ExclamationTriangleIcon className="w-5 h-5 text-yellow-400" aria-hidden="true" />
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-yellow-800">Attention needed</h3>
                        <div className="mt-2 text-sm text-yellow-700">
                          <p>All items are pickup only. We currently do not provide shipping. We apologize for the inconvenience!</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="my-12">
                    <h2 className="text-base font-semibold text-gray-900">Pickup Locations</h2>
                    <p className="mt-1 text-sm text-gray-500">Select an office to pick up your order items.</p>
                    <fieldset className="mt-2">
                      <legend className="sr-only">Bank account</legend>
                      <div className="divide-y divide-gray-200">
                        {locations.map((location) => (
                          <div key={location.id} className="relative flex items-start gap-4 pb-4 pt-3.5">
                            <div className="flex items-center h-6">
                              <input
                                id={`location-${location.id}`}
                                aria-describedby={`location-${location.id}-description`}
                                name="account"
                                type="radio"
                                defaultChecked={pickupLocation}
                                onChange={() => handleLocationChange(location.name)}
                                className="w-4 h-4 border-gray-300 text-primary-60 focus:ring-primary-60"
                                required
                              />
                            </div>
                            <div className="flex-1 min-w-0 ml-3 text-smleading-6">
                              <label htmlFor={`location-${location.id}`} className="font-medium text-gray-900">
                                {location.name}
                              </label>
                              <p id={`location-${location.id}-address-line-1`} className="text-gray-500">
                                {location.address_line1}
                              </p>
                              <p id={`location-${location.id}-address-line-2`} className="text-gray-500">
                                {location.address_line2}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </fieldset>
                  </div>
                </div>
              </section>

              {/* Order summary */}
              <section
                aria-labelledby="summary-heading"
                className="px-4 py-6 mt-16 rounded-lg bg-gray-50 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8"
              >
                <h2 id="summary-heading" className="text-lg font-medium text-gray-900">
                  Order summary
                </h2>

                <dl className="mt-6 space-y-4">
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <dt className="text-base font-medium text-gray-900">Subtotal ({bag.length} items)</dt>
                    <dd className="text-base font-medium text-gray-900">${calculateSubtotal()}</dd>
                  </div>
                </dl>

                <div className="mt-6">
                  <Warning open={open} setOpen={setOpen} />
                  <button
                    onClick={handleCheckout}
                    type="submit"
                    className="w-full px-4 py-3 text-base font-medium text-white border border-transparent rounded-md shadow-sm bg-primary-50 hover:bg-primary-60 focus:outline-none focus:ring-2 focus:ring-primary-40 focus:ring-offset-2 focus:ring-offset-gray-50"
                  >
                    Checkout
                  </button>
                </div>
              </section>
            </div>
          </div>
        </div>
      )}
    </>
  )
}