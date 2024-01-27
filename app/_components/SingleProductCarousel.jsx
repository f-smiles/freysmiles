'use client'
import Image from 'next/image'
import { useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { FreeMode, Navigation, Thumbs } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/free-mode'
import 'swiper/css/navigation'
import 'swiper/css/thumbs'

export default function SingleProductCarousel({ product }) {
  let carouselImages
  if (product.metadata.images) {
    carouselImages = product.images.concat(product.metadata.images.split(", "))
  } else {
    carouselImages = product.images
  }

  const [thumbsSwiper, setThumbsSwiper] = useState(null)

  return (
    <>
      <Swiper
        style={{
          '--swiper-navigation-color': '#999999',
          '--swiper-navigation-size': '30px',
          // '--swiper-pagination-color': '#999999',
        }}
        loop={true}
        spaceBetween={10}
        navigation={true}
        // thumbs={{ swiper: thumbsSwiper }}
        thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
        modules={[FreeMode, Navigation, Thumbs]}
      >
        {carouselImages.length > 0 && carouselImages.map((image, index) => (
          <SwiperSlide key={index}>
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
      <Swiper
        onSwiper={setThumbsSwiper}
        loop={true}
        spaceBetween={10}
        slidesPerView={4}
        freeMode={true}
        watchSlidesProgress={true}
        modules={[FreeMode, Navigation, Thumbs]}
      >
        {/* {product && product.images && (
          <SwiperSlide>
            <Image
              src={product.images[0]}
              width="0"
              height="0"
              sizes="100vw"
              alt={product.name}
              className="object-cover object-center w-full h-full lg:object-contain lg:h-full lg:w-full"
            />
          </SwiperSlide>
        )} */}
        {carouselImages.length > 0 && carouselImages.map((image, index) => (
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
  )
}
