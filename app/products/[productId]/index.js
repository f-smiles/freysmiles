"use client"
import Link from "next/link"
import react, {useEffect} from "react"
import Image from "next/image"
import { useState } from "react"
import { useDispatch } from "react-redux"
import { addToBag } from "@/app/_store/reducers/bagReducer"
// swiper
import { Swiper, SwiperSlide } from 'swiper/react'
import { FreeMode, Navigation, Thumbs } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/free-mode'
import 'swiper/css/navigation'
import 'swiper/css/thumbs'
import HomeIcon from "@/app/_components/ui/HomeIcon"
import MinusIcon from "@/app/_components/ui/MinusIcon"
import PlusIcon from "@/app/_components/ui/PlusIcon"

function SingleProductCarousel({ product }) {
  
  let carouselImages
  if (product.metadata.images) {
    carouselImages = product.images.concat(product.metadata.images.split(", "))
  } else {
    carouselImages = product.images
  }

  const [thumbsSwiper, setThumbsSwiper] = useState(null)
  const [imagesLoaded, setImagesLoaded] = useState(false); 

  useEffect(() => {

    const timer = setTimeout(() => {
      setImagesLoaded(true);
    }, 500); 

    return () => clearTimeout(timer);
  }, []);
  return (
    <>
      {imagesLoaded && (
        <>
          <Swiper
            style={{
              '--swiper-navigation-color': '#999999',
              '--swiper-navigation-size': '30px',
            }}
            loop={true}
            spaceBetween={10}
            navigation={true}
            thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
            modules={[FreeMode, Navigation, Thumbs]}
          >
            {carouselImages.map((image, index) => (
              <SwiperSlide key={index}>
                <Image
                  src={image}
                  width="0" // Adjust these as needed
                  height="0"
                  sizes="100vw"
                  alt={product.name}
                  className="object-cover object-center w-full h-full lg:object-contain lg:h-full lg:w-full"
                />
              </SwiperSlide>
            ))}
          </Swiper>
          <Swiper
            onSwiper={setThumbsSwiper}
            loop={true}
            spaceBetween={10}
            slidesPerView={4}
            freeMode={true}
            watchSlidesProgress={true}
            modules={[FreeMode, Navigation, Thumbs]}
          >
            {carouselImages.map((image, index) => (
              <SwiperSlide key={index} className="mt-6">
                <Image
                  src={image}
                  width="0"
                  height="0"
                  sizes="100vw"
                  alt={product.name}
                  className="object-cover object-center w-full h-full lg:object-contain lg:h-full lg:w-full"
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </>
      )}
    </>
  )
}

function Breadcrumb({ product }) {
  const pages = [
    { name: 'Products', href: '/products', current: false },
    { name: product.name, href: `/products/${product.id}`, current: true },
  ]

  return (
    <nav className="container flex w-full mx-10 mb-10" aria-label="Breadcrumb">
      <ol role="list" className="flex items-center space-x-4">
        <li>
          <div>
            <Link href="/" className="text-gray-400 transition duration-300 ease-in-out hover:text-primary-50">
              <HomeIcon className="flex-shrink-0 w-5 h-5" aria-hidden="true" />
              <span className="sr-only">Home</span>
            </Link>
          </div>
        </li>
        {pages.map((page) => (
          <li key={page.name}>
            <div className="flex items-center">
              <svg
                className="flex-shrink-0 w-5 h-5 text-gray-300"
                fill="currentColor"
                viewBox="0 0 20 20"
                aria-hidden="true"
              >
                <path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z" />
              </svg>
              <Link
                href={page.href}
                className="ml-4 text-sm font-medium text-gray-500 hover:text-gray-700"
                aria-current={page.current ? 'page' : undefined}
              >
                {page.name}
              </Link>
            </div>
          </li>
        ))}
      </ol>
    </nav>
  )
}

export default function ProductComponent({ product }) {
  const [quantity, setQuantity] = useState(1)

  const dispatch = useDispatch()

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity((prevQuantity) => prevQuantity -= 1)
    }
  }

  const handleIncrement = () => {
    setQuantity((prevQuantity) => prevQuantity += 1)
  }

  const handleAddToBag = async () => {
    await dispatch(addToBag({ product, quantity}))
  }

  return (
    <div className="max-w-2xl py-24 mx-auto lg:max-w-7xl">
      <Breadcrumb product={product} />
      <div className="grid w-full grid-cols-1 px-10 space-y-10 md:space-y-0 md:px-0 md:grid-cols-2 md:gap-12 lg:px-6">
        <section id="product" className="md:order-last">
          <div id="product-details" className="space-y-2">
            <h4 className="tracking-tight capitalize font-cera">{product.name}</h4>
            <h3 className="mb-4 tracking-tight font-cera text-primary-50">${product.price}</h3>
            <p className="pt-8 border-t border-gray-300">{product.description}</p>
          </div>

          {/* controls */}
          <div className="flex flex-col gap-8 my-6 lg:items-center lg:flex-row lg:justify-between">
            <span className="flex items-center group text-primary-50">
              <p className="mr-2 text-gray-700">Quantity:</p>
              <button
                onClick={handleDecrement}
                type="button"
                className={`${
                  quantity > 1
                    ? "hover:bg-primary-50 hover:text-white"
                    : "text-gray-300"
                  } p-2 transition-colors duration-150 ease-linear border rounded-tl rounded-bl border-primary-50`}
                disabled={quantity === 1}
              >
                <MinusIcon className="w-6 h-6" />
              </button>
              <span className="px-4 py-2 text-gray-700 border-t border-b border-primary-50">{quantity}</span>
              <button
                onClick={handleIncrement}
                type="button"
                className="p-2 transition-colors duration-150 ease-linear border rounded-tr rounded-br border-primary-50 hover:bg-primary-50 hover:text-white"
              >
                <PlusIcon className="w-6 h-6" />
              </button>
            </span>
            <button
              onClick={handleAddToBag}
              type="button"
              className="px-5 py-4 text-sm text-white uppercase transition-colors duration-300 rounded bg-primary-50 hover:bg-primary-30"
            >
              Add To Bag
            </button>
          </div>
        </section>
        <section id="image-carousel">
          <SingleProductCarousel product={product} />
        </section>
      </div>
    </div>
  )
}
