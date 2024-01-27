'use client'
import Link from 'next/link'
import Image from 'next/image'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { selectBag, clearBag, removeFromBag, incrementQuantity, decrementQuantity } from '../_store/reducers/bagReducer'
import MinusIcon from '../_components/ui/MinusIcon'
import PlusIcon from '../_components/ui/PlusIcon'
import TrashIcon from '../_components/ui/TrashIcon'
import XCircleIcon from '../_components/ui/XCircleIcon'

export default function BagComponent() {
  const dispatch = useDispatch()

  const bag = useSelector(selectBag)

  const calculateSubtotal = () => {
    let subtotal = 0;
    subtotal = bag
      .map((item) => (item.product.price) * item.quantity)
      .reduce((acc, cur) => acc + cur, 0)
    return subtotal
  }

  const calculateItemsQuantity = () => {
    let itemsQuantity = 0
    itemsQuantity = bag
      .map((item) => item.quantity)
      .reduce((acc, cur) => acc + cur, 0)
    return itemsQuantity
  }

  const handleCheckout = async () => {
    const { data } = await axios.post("/api/checkout/checkout-sessions", 
    bag, 
    { "headers": { 
        "Content-Type": "application/json" 
      }
    })
    window.location.assign(data)
  }

  return (
    <>
      {bag.length === 0 ? (
        <div className="flex flex-col items-center w-full space-y-8 auto sm:px-0">
          <h1>Shopping Bag</h1>
          <p>You currently do not have any items in your bag.</p>
          <Link
            href="/products"
            className="block px-6 py-3 text-base font-medium text-white transition-colors duration-150 ease-in-out border border-transparent rounded-md shadow-sm bg-primary-50 w-max hover:bg-primary-30"
          >
            Shop Now &rarr;
          </Link>
        </div>
      ) : (
        <div className="w-full space-y-10">
          <section className="border-b border-gray-200">
            <div className="p-6 text-neutral-800">
              <h1>Shopping Bag</h1>
            </div>
          </section>
          <section>
            <div className="flex justify-end w-full px-6 mb-6">
              <button
                className="flex items-center gap-2 px-4 py-2 border rounded text-secondary-50 border-secondary-50"
                type="button"
                onClick={() => dispatch(clearBag())}
              >
                Clear Bag
                <TrashIcon className="w-6 h-6" />
              </button>
            </div>
            {bag.length > 0 &&
              bag.map((item, index) => (
                <div
                  key={index}
                  className="p-6 border-b border-gray-200 sm:grid sm:grid-cols-3 sm:gap-4"
                >
                  <dt className="text-sm font-medium leading-6 text-gray-900">
                    <h3 className="text-base font-semibold leading-7 text-gray-900">
                      {item.product.name}
                    </h3>
                    <p className="max-w-2xl mt-1 text-sm leading-6 text-gray-500">
                      ${item.product.price}
                    </p>
                    <Image
                      className="object-contain object-center mt-4 rounded-md aspect-square"
                      width={128}
                      height={128}
                      src={item.product.images[0]}
                      alt={item.product.name}
                    />
                  </dt>
                  <dd className="flex justify-between mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
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
                          onClick={() => dispatch(incrementQuantity(item))}
                        >
                          <PlusIcon className="w-4 h-4" />
                        </button>
                      </span>
                      <button
                        className="flex justify-between gap-2 text-secondary-50 group"
                        type="button"
                        onClick={() => dispatch(removeFromBag(item))}
                      >
                        <p>
                          Remove
                          <span className="block max-w-0 group-hover:max-w-full transition-all duration-300 h-0.5 bg-secondary-50 ease-out"></span>
                        </p>
                        <XCircleIcon className="w-6 h-6" />
                      </button>
                    </div>
                    <div className="flex flex-col items-end mt-6 md:mt-0">
                      <p>${item.product.price * item.quantity}</p>
                      <p>Quantity: {item.quantity}</p>
                    </div>
                  </dd>
                </div>
            ))}
          </section>
          <section className="px-6">
            <div className="flex justify-between">
              <h3 className="mt-6 text-base leading-7 text-gray-900">
                Subtotal: ({calculateItemsQuantity()} items)
              </h3>
              <h3 className="mt-6 text-base leading-7 text-gray-900">
                ${calculateSubtotal()}
              </h3>
            </div>
            <p className="mt-1 text-sm leading-6 text-gray-500">
              Shipping and taxes will be calculated at checkout.
            </p>
            <div className="flex items-end justify-between">
              <Link
                href="/products"
                className="font-medium text-primary-50 group"
              >
                <span aria-hidden="true">&larr; </span>Continue Shopping
                <span className="block max-w-0 group-hover:max-w-full transition-all delay-75 duration-500 h-0.5 bg-primary-50 ease-in-out"></span>
              </Link>
              <button
                onClick={handleCheckout}
                type="submit"
                className="px-6 py-3 text-base font-medium text-white border border-transparent rounded-md shadow-sm bg-primary-50 hover:bg-primary-30"
              >
                Checkout
              </button>
            </div>
          </section>
        </div>
      )}
    </>
  );
}
