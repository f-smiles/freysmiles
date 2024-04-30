"use client"
import Link from "next/link"
import Image from "next/image"
import { Fragment, useState } from "react"
import { Menu, Transition } from '@headlessui/react'
import ChevronDownIcon from "../_components/ui/ChevronDownIcon"

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

function Banner() {
  const text = "CLICK HERE TO SHOP GIFT CARDS ";
  const separator = " • ";
  const repeatedText = Array(50).fill(text + separator).join("");

  return (

    <div className="relative isolate flex justify-center items-center gap-x-6 overflow-hidden bg-gray-50 px-6 py-2.5 sm:px-3.5">

      <div
        className="absolute left-[max(-7rem,calc(50%-52rem))] top-1/2 -z-10 -translate-y-1/2 transform-gpu blur-2xl"
        aria-hidden="true"
      >
        <div
          className="aspect-[577/310] w-[36.0625rem] bg-gradient-to-r from-[#ff80b5] to-[#9089fc] opacity-30"
          style={{
            clipPath:
              'polygon(74.8% 41.9%, 97.2% 73.2%, 100% 34.9%, 92.5% 0.4%, 87.5% 0%, 75% 28.6%, 58.5% 54.6%, 50.1% 56.8%, 46.9% 44%, 48.3% 17.4%, 24.7% 53.9%, 0% 27.9%, 11.9% 74.2%, 24.9% 54.1%, 68.6% 100%, 74.8% 41.9%)',
          }}
        />
      </div>
      <div
        className="absolute left-[max(45rem,calc(50%+8rem))] top-1/2 -z-10 -translate-y-1/2 transform-gpu blur-2xl"
        aria-hidden="true"
      >
        <div
          className="aspect-[577/310] w-[36.0625rem] bg-gradient-to-r from-[#ff80b5] to-[#9089fc] opacity-30"
          style={{
            clipPath:
              'polygon(74.8% 41.9%, 97.2% 73.2%, 100% 34.9%, 92.5% 0.4%, 87.5% 0%, 75% 28.6%, 58.5% 54.6%, 50.1% 56.8%, 46.9% 44%, 48.3% 17.4%, 24.7% 53.9%, 0% 27.9%, 11.9% 74.2%, 24.9% 54.1%, 68.6% 100%, 74.8% 41.9%)',
          }}
        />
      </div>
      <div className="overflow-hidden">
        <Link href={`${process.env.NEXT_PUBLIC_SQUARE_GIFT_CARDS_URL}`} target='_blank'>
          <div className="animate-giftCardMarquee whitespace-nowrap block text-[15vw] text-purple-400 text-sm leading-6">
            {repeatedText}{repeatedText}
          </div>
        </Link>
      </div>
    </div>
  )
}

function Hero() {
  const letters = [
    { char: 'S', rotate: 'rotate-12', translateY: 'translate-y-', color: 'text-black' },
    { char: 'H', rotate: 'rotate-12', translateY: 'translate-y-20', color: 'text-black' },
    { char: 'O', rotate: 'rotate-6', translateY: 'translate-y-2', color: 'text-black' },
    { char: 'P', rotate: 'rotate-2', translateY: 'translate-y-20',translateX: 'translate-x-2', color: 'text-black' },
  ];

  const lettersNow = [
    { char: 'N', rotate: 'rotate-12', translateY: 'translate-y-1', color: 'text-black' },
    { char: 'O', rotate: 'rotate-12', translateY: 'translate-y-5', color: 'text-black' },
    { char: 'W', rotate: 'rotate-6', translateY: 'translate-y-1', color: 'text-black' },
  ];

  return (
    <section className="flex flex-col items-center justify-center h-screen space-y-8 ">
      <div className="flex flex-wrap items-end justify-center font-grandslang">
        {letters.map((style, index) => (
          <span
            key={index}
            className={`inline-block ${style.rotate} ${style.translateY} ${style.translateX}  ${style.color} mx-1`}
            style={{ fontSize: '8rem' }}
          >
            {style.char}
          </span>
        ))}
      </div>
      <div className="flex items-end justify-center font-grandslang">
        {lettersNow.map((style, index) => (
          <span
            key={`now-${index}`}
            className={`inline-block ${style.rotate} ${style.translateY} ${style.color}`}
            style={{ fontSize: '8rem' }}
          >
            {style.char}
          </span>
        ))}
      </div>
    </section>
  )
}

export default function ProductsComponent({ products, prices }) {
  const [selectedSortOption, setSelectedSortOption] = useState(null)

  const sortOptions = [
    { name: 'Price: Low to High', current: false },
    { name: 'Price: High to Low', current: false },
  ]

  const sortProducts = (option) => {
    if (option === "Price: Low to High") {
      return [...products].sort((a, b) => {
        const lowestPriceA = Math.min(...prices.filter((price) => price.product === a.id).map((productPrice) => productPrice.unit_amount))
        const lowestPriceB = Math.min(...prices.filter((price) => price.product === b.id).map((productPrice) => productPrice.unit_amount))
        return lowestPriceA - lowestPriceB
      })
    } else if (option === "Price: High to Low") {
      return [...products].sort((a, b) => {
        const highestPriceA = Math.max(...prices.filter((price) => price.product === a.id).map((productPrice) => productPrice.unit_amount))
        const highestPriceB = Math.max(...prices.filter((price) => price.product === b.id).map((productPrice) => productPrice.unit_amount))
        return highestPriceB - highestPriceA
      })
    }
    return products
  }

  const sortedProducts = selectedSortOption ? sortProducts(selectedSortOption) : products

  return (
    <div className="bg-[#F1F1F1]">
      <Banner />
      <Hero />

      <section className="max-w-2xl px-10 mx-auto my-16 mb-32 lg:max-w-7xl">
        <div className="flex items-baseline justify-between w-full pb-4 border-b-2 border-gray-100">

          <Menu as="div" className="relative inline-block text-left">
            <div>
              <Menu.Button className="inline-flex items-center justify-center text-lg font-medium text-gray-700 group hover:text-gray-900">
               SORT BY
                <ChevronDownIcon
                  className="flex-shrink-0 w-5 h-5 ml-1 -mr-1 text-gray-400 group-hover:text-gray-500"
                  aria-hidden="true"
                />
              </Menu.Button>
            </div>

            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute left-0 z-10 w-40 mt-2 origin-top-right rounded-md shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div className="py-1">
                  {sortOptions.map((option) => (
                    <Menu.Item key={option.name}>
                      {({ active }) => (
                        <p
                          className={classNames(
                            option.current ? 'font-medium text-gray-900' : 'text-gray-500',
                            active ? 'bg-gray-100' : '',
                            'block px-4 py-2 text-sm'
                          )}
                          onClick={() => setSelectedSortOption(option.name)}
                        >
                          {option.name}
                        </p>
                      )}
                    </Menu.Item>
                  ))}
                </div>
              </Menu.Items>
            </Transition>
          </Menu>
        </div>

        <div className="grid grid-cols-1 mt-6 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
          {sortedProducts.map((product) => (
            <div key={product.id} className="relative group">
              <div className="w-full overflow-hidden rounded-md aspect-h-1 aspect-w-1 lg:aspect-none group-hover:opacity-75 lg:h-80">
                <Image
                  className="object-cover object-center w-full h-full lg:object-contain lg:h-full lg:w-full"
                  src={product.images[0]}
                  width="0"
                  height="0"
                  sizes="100vw"
                  alt={product.name}
                  // loading="lazy"
                />
              </div>
              <div className="flex justify-between mt-4">
                <Link href={`/products/${product.id}`}>
                  <p className="tracking-tight text-gray-700 capitalize">
                    <span aria-hidden="true" className="absolute inset-0" />
                    {product.name}
                  </p>
                </Link>
                {prices.filter((price) => price.product === product.id).map((productPrice) => (
                  <p key={productPrice.id}>
                    ${productPrice.unit_amount / 100}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

