'use client'

import Link from "next/link"
import Image from "next/image"
import { VariantsWithProductImagesTags } from "@/lib/infer-type"
import { formatPrice } from "@/lib/format-price"
import { useLayoutEffect, useRef, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

type ProductVariantsProps = {
  variants: VariantsWithProductImagesTags[]
}

export default function Variants({ variants }: ProductVariantsProps) {
  const searchParams = useSearchParams()
  const row1 = variants.filter((v) => v.productID === 1);
  const row2 = variants.filter((v) => v.productID === 2);
  const row3 = variants.filter((v) => v.productID === 3 || v.productID === 4);
  const row4 = variants.filter((v) => v.productID === 5 || v.productID === 6 || v.productID === 7);
  
  const groupedVariants = [
    {
      id: "devices",
      prefix: "Optimizing Treatment,",
      label: "Devices",
      variants: row4,
    },
    {
      id: "floss",
      prefix: "Our #1 Floss Pick,",
      label: "Floss",
      variants: row2,
    },
    {
      id: "whitening",
      prefix: "For a Brighter Smile,",
      label: "Whitening Gel",
      variants: row3,
    },
    {
      id: "cases",
      prefix: "Backups",
      label: "Cases",
      variants: row1,
    },
  ];
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);
  
  const asideRef = useRef<HTMLDivElement>(null)
  const sectionContainerRef = useRef<HTMLDivElement>(null)
  const filterContainerRef = useRef<HTMLDivElement>(null)
  

  useEffect(() => {
    const filter = searchParams?.get('filter');
    if (filter) {
      const sectionIndex = groupedVariants.findIndex(group => group.id === filter.toLowerCase());
      if (sectionIndex !== -1 && sectionRefs.current[sectionIndex]) {
        setTimeout(() => {
          sectionRefs.current[sectionIndex]?.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }, 100); 
      }
    }
  }, [searchParams]);

  useLayoutEffect(() => {
    if (!asideRef.current || !sectionContainerRef.current || !filterContainerRef.current) return

    const ctx = gsap.context(() => {
      const initialOffset = filterContainerRef.current?.offsetTop || 0
    
      ScrollTrigger.create({
        trigger: asideRef.current,
        start: `top ${32 + initialOffset}px`, 
        end: () => `+=${sectionContainerRef.current?.offsetHeight}`,
        onEnter: () => {
          gsap.to(filterContainerRef.current, {
            y: 0,
            duration: 0.3,
            ease: "power2.out"
          })
        },
        onLeaveBack: () => {
          gsap.to(filterContainerRef.current, {
            y: initialOffset,
            duration: 0.3,
            ease: "power2.out"
          })
        },
        pin: asideRef.current,
        pinSpacing: false,
      })

      gsap.set(filterContainerRef.current, { y: initialOffset })
    })

    return () => ctx.revert()
  }, [])

  useEffect(() => {
    const images = document.querySelectorAll("img")

    let loaded = 0
    images.forEach((img) => {
      if (img.complete) {
        loaded++
      } else {
        img.addEventListener("load", handleLoad)
      }
    })

    function handleLoad() {
      loaded++
      if (loaded === images.length) {
        ScrollTrigger.refresh()
      }
    }

    if (loaded === images.length) {
      ScrollTrigger.refresh()
    }

    return () => {
      images.forEach((img) => img.removeEventListener("load", handleLoad))
    }
  }, [])

  const handleFilterClick = (filterId: string) => {
    const sectionIndex = groupedVariants.findIndex(group => group.id === filterId);
    if (sectionIndex !== -1 && sectionRefs.current[sectionIndex]) {
      sectionRefs.current[sectionIndex]?.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
      
      window.history.replaceState({}, '', `?filter=${filterId}`);
    }
  };
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

  return (
    <div className="grid grid-cols-12 gap-8 relative">
      <aside ref={asideRef} className="col-span-3 -ml-2">
        <div 
          ref={filterContainerRef}
          className="pt-12 space-y-8 will-change-transform pl-2" 
        >
          <div className="space-y-4">
            <h3 className="text-[12px] font-neueroman uppercase text-gray-500">Filters</h3>
      
            <div className="space-y-2">
              <h4 className="text-[10px] font-neuehaas45 uppercase text-gray-400">Range</h4>
              {groupedVariants.map((group) => (
                <button 
                  key={group.id}
                  onClick={() => handleFilterClick(group.id)}
                  className="block text-left text-[11px] font-neuehaas45 text-black hover:underline"
                >
                  {group.label.toUpperCase()}
                </button>
              ))}
              <button 
                onClick={() => handleFilterClick('gift-card')}
                className="block text-left text-[11px] font-neuehaas45 text-black hover:underline"
              >
                GIFT CARD
              </button>
            </div>
      
            <div className="border-t pt-4 space-y-2">
              <h4 className="text-[10px] font-neuehaas45 uppercase text-gray-400">Price</h4>
              <button className="block text-left text-[11px] text-black font-neuehaas45 hover:underline">Dropdown</button>
            </div>
          </div>
        </div>
      </aside>
    
      <section ref={sectionContainerRef} className="col-span-9 space-y-8">
        {groupedVariants.map((group, index) => (
        <div 
        key={group.id}
        ref={(el) => {
          sectionRefs.current[index] = el;
        }}
        id={group.id}
        className="space-y-4"
      >
            <div className="text-[20px] leading-tight text-zinc-500 font-saolitalic tracking-tight">
              {group.prefix}
              <br />
            </div>
    
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {group.variants.map((variant) => (
                <div
                  key={variant.id}
                  className="flex flex-col justify-between overflow-hidden text-sm transition bg-white shadow-sm group font-neueroman rounded-2xl hover:shadow-md"
                >
                  <Link
                    href={`/shop/products/${variant.id}?id=${variant.id}&title=${variant.product.title}&variant=${variant.variantName}&prodId=${variant.productID}`}
                    className="flex flex-col h-full"
                  >
                    <figure className="w-full aspect-[1/1] p-6 flex items-center justify-center">
                      <Image
                        className="object-contain w-full h-full"
                        src={variant.variantImages[0].url}
                        alt={`${variant.product.title} - ${variant.variantName}`}
                        width={360}
                        height={640}
                        priority
                      />
                    </figure>
    
                    <div className="bg-[#F2F2F2] px-5 pt-4 pb-6 flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <h3 className="text-[12px] text-zinc-900 capitalize">
                          {variant.product.title}
                        </h3>
                        <span className="text-[12px] text-zinc-900 font-semibold">
                          {formatPrice(variant.product.price)}
                        </span>
                      </div>
    
                      <div className="h-[1px] bg-gray-300" />
    
                      <span className="text-[12px] text-zinc-900">{variant.variantName}</span>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}