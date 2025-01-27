'use client'

import { useEffect, useState } from 'react'
import { Carousel, CarouselApi, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'
import { VariantsWithImagesTags } from '@/lib/infer-type'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation'
import { cn } from '@/lib/utils'


export default function ProductCarousel({ variants }: { variants: VariantsWithImagesTags[] }) {
  const [api,setApi] = useState<CarouselApi>()
  const [activeThumbnail, setActiveThumbnail] = useState([0])

  const searchParams = useSearchParams()
  const selectedVariant = searchParams.get("variant") || variants[0].variantName

  useEffect(() => {
    if (!api) return

    api.on("slidesInView", (e) => {
      setActiveThumbnail(e.slidesInView())
    })
  }, [api])

  const updatePreview = (index: number) => {
    api?.scrollTo(index)
  }


  return (
    <Carousel setApi={setApi} opts={{ loop: true }}>
      <CarouselContent>
        {variants.map((variant) =>
          variant.variantName === selectedVariant &&
          variant.variantImages.map((img, index) => {
            return (
              <CarouselItem key={img.url} className="bg-[#FCFAF5] flex flex-col justify-center">
                {img.url ? (
                  <Image
                    priority
                    className="w-full h-auto rounded-md"
                    width={1280}
                    height={720}
                    src={img.url}
                    alt={img.name}
                  />
                ) : null}
              </CarouselItem>
            )
        }))}
      </CarouselContent>

      {/* <CarouselPrevious className="ml-16 transition-all duration-300 ease-in-out opacity-75 hover:opacity-100" />
      <CarouselNext className="mr-16 transition-all duration-300 ease-in-out opacity-75 hover:opacity-100" /> */}

      <div className="flex gap-3 mt-4 overflow-clip">
        {variants.map((variant) =>
          variant.variantName === selectedVariant &&
          variant.variantImages.map((img, index) => {
            return (
              <span key={img.url}>
                {img.url ? (
                  <Image
                    priority
                    className={cn(
                      "rounded-sm transition-all duration-300 ease-in-out cursor-pointer hover:opacity-75 w-full h-full",
                      index === activeThumbnail[0] ? "opacity-100" : "opacity-50",
                    )}
                    width={64}
                    height={64}
                    src={img.url}
                    alt={img.name}
                    onClick={() => updatePreview(index)}
                  />
                ) : null}
              </span>
            )
        }))}
      </div>
    </Carousel>
  )
}
