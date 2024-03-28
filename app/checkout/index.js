'use client'
import Link from 'next/link'
// import Image from 'next/image'
// import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { selectBag, clearBag, removeFromBag, incrementQuantity, decrementQuantity } from '../_store/reducers/bagReducer'
import MinusIcon from '../_components/ui/MinusIcon'
import PlusIcon from '../_components/ui/PlusIcon'
// import QuestionMarkCircleIcon from '../_components/ui/QuestionMarkCircleIcon'
// import TrashIcon from '../_components/ui/TrashIcon'
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

export default function BagComponent() {
  const dispatch = useDispatch()

  const bag = useSelector(selectBag)

  const calculateSubtotal = () => {
    let subtotal = 0;
    subtotal = bag
      .map((item) => (item.product.price) * item.quantity)
      .reduce((acc, cur) => acc + cur, 0)
      .toFixed(2)
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
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/checkout/checkout-sessions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(bag)
      })
      const data = await res.json()
      window.location.assign(data)
      // const { data } = await axios.post("/api/checkout/checkout-sessions", 
      // bag, 
      // { "headers": { 
      //     "Content-Type": "application/json" 
      //   }
      // })
      // window.location.assign(data)
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
                                <a href={`/products/${item.product.id}`} className="font-medium text-gray-700 hover:text-gray-800">
                                  {item.product.name}
                                </a>
                              </h3>
                            </div>
                            {/* <div className="flex mt-1 text-sm">
                              <p className="text-gray-500">{product.color}</p>
                              {product.size ? (
                                <p className="pl-4 ml-4 text-gray-500 border-l border-gray-200">{product.size}</p>
                              ) : null}
                            </div> */}
                            <p className="mt-1 text-sm font-medium text-gray-900">${item.product.price}</p>
                            <p>Qty: {item.quantity}</p>
                          </div>
    
                          <div className="mt-4 sm:mt-0 sm:pr-9">
                            {/* <label htmlFor={`quantity-${productIdx}`} className="sr-only">
                              Quantity, {product.name}
                            </label>
                            <select
                              id={`quantity-${productIdx}`}
                              name={`quantity-${productIdx}`}
                              className="max-w-full rounded-md border border-gray-300 py-1.5 text-left text-base font-medium leading-5 text-gray-700 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
                            >
                              <option value={1}>1</option>
                              <option value={2}>2</option>
                              <option value={3}>3</option>
                              <option value={4}>4</option>
                              <option value={5}>5</option>
                              <option value={6}>6</option>
                              <option value={7}>7</option>
                              <option value={8}>8</option>
                            </select> */}
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

                        {/* <p className="flex mt-4 space-x-2 text-sm text-gray-700">
                          {product.inStock ? (
                            <CheckIcon className="flex-shrink-0 w-5 h-5 text-green-500" aria-hidden="true" />
                          ) : (
                            <ClockIcon className="flex-shrink-0 w-5 h-5 text-gray-300" aria-hidden="true" />
                          )}
    
                          <span>{product.inStock ? 'In stock' : `Ships in ${product.leadTime}`}</span>
                        </p> */}
                      </div>
                    </li>
                  ))}
                </ul>
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
                  {/* <div className="flex items-center justify-between">
                    <dt className="text-sm text-gray-600">Subtotal</dt>
                    <dd className="text-sm font-medium text-gray-900">$99.00</dd>
                  </div> */}
                  {/* <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <dt className="flex items-center text-sm text-gray-600">
                      <span>Shipping estimate</span>
                      <a href="#" className="flex-shrink-0 ml-2 text-gray-400 hover:text-gray-500">
                        <span className="sr-only">Learn more about how shipping is calculated</span>
                        <QuestionMarkCircleIcon className="w-5 h-5" aria-hidden="true" />
                      </a>
                    </dt>
                    <dd className="text-sm font-medium text-gray-900">$5.00</dd>
                  </div> */}
                  {/* <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <dt className="flex text-sm text-gray-600">
                      <span>Tax estimate</span>
                      <a href="#" className="flex-shrink-0 ml-2 text-gray-400 hover:text-gray-500">
                        <span className="sr-only">Learn more about how tax is calculated</span>
                        <QuestionMarkCircleIcon className="w-5 h-5" aria-hidden="true" />
                      </a>
                    </dt>
                    <dd className="text-sm font-medium text-gray-900">$8.32</dd>
                  </div> */}
                  {/* <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <dt className="text-base font-medium text-gray-900">Order total</dt>
                    <dd className="text-base font-medium text-gray-900">$112.32</dd>
                  </div> */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <dt className="text-base font-medium text-gray-900">Subtotal ({bag.length} items)</dt>
                    <dd className="text-base font-medium text-gray-900">${calculateSubtotal()}</dd>
                  </div>
                </dl>
    
                <div className="mt-6">
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

        // <div className="w-full space-y-10">
        //   <section className="border-b border-gray-200">
        //     <div className="p-6 text-neutral-800">
        //       <h1>Shopping Bag</h1>
        //     </div>
        //   </section>
        //   <section>
        //     <div className="flex justify-end w-full px-6 mb-6">
        //       <button
        //         className="flex items-center gap-2 px-4 py-2 border rounded text-secondary-50 border-secondary-50"
        //         type="button"
        //         onClick={() => dispatch(clearBag())}
        //       >
        //         Clear Bag
        //         <TrashIcon className="w-6 h-6" />
        //       </button>
        //     </div>
        //     {bag.length > 0 &&
        //       bag.map((item, index) => (
        //         <div
        //           key={index}
        //           className="p-6 border-b border-gray-200 sm:grid sm:grid-cols-3 sm:gap-4"
        //         >
        //           <dt className="text-sm font-medium leading-6 text-gray-900">
        //             <h3 className="text-base font-semibold leading-7 text-gray-900">
        //               {item.product.name}
        //             </h3>
        //             <p className="max-w-2xl mt-1 text-sm leading-6 text-gray-500">
        //               ${item.product.price}
        //             </p>
        //             <Image
        //               className="object-contain object-center mt-4 rounded-md aspect-square"
        //               width={128}
        //               height={128}
        //               src={item.product.images[0]}
        //               alt={item.product.name}
        //             />
        //           </dt>
        //           <dd className="flex justify-between mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
        //             <div
        //               id="controls"
        //               className="flex flex-col mx-auto mt-6 space-y-2 md:mt-0"
        //             >
        //               <span className="flex">
        //                 <button
        //                   className={`${
        //                     item.quantity === 1
        //                       ? "text-gray-300"
        //                       : "hover:bg-primary-50 hover:text-white"
        //                   } rounded-tl rounded-bl border py-1 px-2 border-primary-50 text-primary-50 transition-colors duration-150 ease-linear`}
        //                   type="button"
        //                   disabled={item.quantity === 1}
        //                   onClick={() => dispatch(decrementQuantity(item))}
        //                 >
        //                   <MinusIcon className="w-4 h-4" />
        //                 </button>
        //                 <p className="px-3 py-1 border-t border-b border-primary-50">
        //                   {item.quantity}
        //                 </p>
        //                 <button
        //                   className="px-2 py-1 transition-colors duration-150 ease-linear border rounded-tr rounded-br text-primary-50 border-primary-50 hover:bg-primary-50 hover:text-white"
        //                   type="button"
        //                   onClick={() => dispatch(incrementQuantity(item))}
        //                 >
        //                   <PlusIcon className="w-4 h-4" />
        //                 </button>
        //               </span>
        //               <button
        //                 className="flex justify-between gap-2 text-secondary-50 group"
        //                 type="button"
        //                 onClick={() => dispatch(removeFromBag(item))}
        //               >
        //                 <p>
        //                   Remove
        //                   <span className="block max-w-0 group-hover:max-w-full transition-all duration-300 h-0.5 bg-secondary-50 ease-out"></span>
        //                 </p>
        //                 <XCircleIcon className="w-6 h-6" />
        //               </button>
        //             </div>
        //             <div className="flex flex-col items-end mt-6 md:mt-0">
        //               <p>${item.product.price * item.quantity}</p>
        //               <p>Quantity: {item.quantity}</p>
        //             </div>
        //           </dd>
        //         </div>
        //     ))}
        //   </section>
        //   <section className="px-6">
        //     <div className="flex justify-between">
        //       <h3 className="mt-6 text-base leading-7 text-gray-900">
        //         Subtotal: ({calculateItemsQuantity()} items)
        //       </h3>
        //       <h3 className="mt-6 text-base leading-7 text-gray-900">
        //         ${calculateSubtotal()}
        //       </h3>
        //     </div>
        //     <p className="mt-1 text-sm leading-6 text-gray-500">
        //       Shipping and taxes will be calculated at checkout.
        //     </p>
        //     <div className="flex items-end justify-between">
        //       <Link
        //         href="/products"
        //         className="font-medium text-primary-50 group"
        //       >
        //         <span aria-hidden="true">&larr; </span>Continue Shopping
        //         <span className="block max-w-0 group-hover:max-w-full transition-all delay-75 duration-500 h-0.5 bg-primary-50 ease-in-out"></span>
        //       </Link>
        //       <button
        //         onClick={handleCheckout}
        //         type="submit"
        //         className="px-6 py-3 text-base font-medium text-white border border-transparent rounded-md shadow-sm bg-primary-50 hover:bg-primary-30"
        //       >
        //         Checkout
        //       </button>
        //     </div>
        //   </section>
        // </div>