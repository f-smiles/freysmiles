'use client'

import Link from "next/link"
import Image from "next/image"
import { VariantsWithProductImagesTags } from "@/lib/infer-type"
import { formatPrice } from "@/lib/format-price"
import { useLayoutEffect, useRef, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { MotionPathPlugin } from "gsap/MotionPathPlugin"

gsap.registerPlugin(ScrollTrigger, MotionPathPlugin)



const Marquee = () => {
  const items = [
    { word: "Click here to shop gift cards" },
    { word: "Click here to shop gift cards" },
    { word: "Click here to shop gift cards" },
    { word: "Click here to shop gift cards" },
  ];

  return (
    <div className="relative overflow-hidden w-screen bg-[#F0EF59]">
      <div className="font-neuehaas45 flex animate-marquee min-w-full hover:[animation-play-state:paused]">
        {[...items, ...items].map((item, index) => (
          <div key={index} className="px-4 py-4 text-[12px] whitespace-nowrap">
            {item.word}
          </div>
        ))}
      </div>
    </div>
  );
};


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
useLayoutEffect(() => {
  if (!sectionContainerRef.current) return;

  const ctx = gsap.context(() => {
    const rows = gsap.utils.toArray<HTMLElement>(
      sectionContainerRef.current.querySelectorAll(".products-row")
    );

    rows.forEach((row) => {
      const cards = gsap.utils.toArray<HTMLElement>(
        row.querySelectorAll(".card-anim")
      );


      gsap.set(cards, {
        opacity: 0,
        x: 140,
        y: -40,
        force3D: true,
        willChange: "transform, opacity",
      });

      ScrollTrigger.create({
        trigger: row,
        start: "top 90%",
        once: true,
        onEnter: () => {
          const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

          tl.to(cards, {
            x: 0,
            y: 0,
            duration: 1.1,
            ease: "cubic-bezier(0.33, 1, 0.68, 1)", 
            stagger: { each: 0.12, from: "start" },
          }, 0);


          tl.to(cards, {
            opacity: 1,
            duration: 0.9,
            ease: "linear",
            stagger: { each: 0.12, from: "start" },
          }, 0.05);
        },
      });
    });
  }, sectionContainerRef);

  return () => ctx.revert();
}, []);
  return (
<>
    <Marquee />
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
            <div className="text-[18px] leading-tight text-zinc-500 font-canelathin">
              {group.prefix}
              <br />
            </div>
    
<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 products-row">
              {group.variants.map((variant) => (
<div
  key={variant.id}
        className="card-anim group relative flex flex-col justify-between bg-[#DBE5F2] rounded-[24px] overflow-hidden h-[460px] shadow-sm transition-transform duration-300 hover:scale-[1.015] hover:shadow-md will-change-transform"
>
  <Link
    href={`/shop/products/${variant.id}?id=${variant.id}&title=${variant.product.title}&variant=${variant.variantName}&prodId=${variant.productID}`}
    className="flex flex-col h-full p-5"
  >

    <div className="flex items-center justify-between mb-5">
      <span className="px-4 py-[5px] bg-white/50 text-black text-[11px] font-neuehaas45 rounded-full tracking-wide shadow-sm">
        {variant.product.title}
      </span>
    <div className="w-6 h-6 rounded-full bg-white/50 flex items-center justify-center shadow-sm">
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#111"
    strokeWidth="1"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-4 h-4 transition-transform duration-500 hover:-translate-y-[1.5px] hover:rotate-[5deg]"
  >
    <path d="M6 8h12l-1.5 12h-9L6 8z" />
    <path d="M9 8a3 3 0 0 1 6 0" />
  </svg>
</div>
    </div>


    <figure className="flex-1 flex items-center justify-center">
      <Image
        className="object-contain w-[58%] max-h-[210px]"
        src={variant.variantImages[0].url}
        alt={`${variant.product.title} - ${variant.variantName}`}
        width={400}
        height={600}
        priority
      />
    </figure>


    <div className="flex items-center justify-between pt-6">
      <span className="text-[13px] font-neuehaas45 text-black">
        {variant.variantName}
      </span>
      <span className="text-[13px] font-neuehaas45 text-black">
        {formatPrice(variant.product.price)}
      </span>
    </div>
  </Link>
</div>
              ))}
            </div>
          </div>
        ))}
      </section>
    </div>
</>

  );
}