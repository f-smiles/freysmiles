'use client'

import Link from "next/link"
import Image from "next/image"
import { VariantsWithProductImagesTags } from "@/lib/infer-type"
import { formatPrice } from "@/lib/format-price"
import { useLayoutEffect, useRef, useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { MotionPathPlugin } from "gsap/MotionPathPlugin"

gsap.registerPlugin(ScrollTrigger, MotionPathPlugin)





type ProductVariantsProps = {
  variants: VariantsWithProductImagesTags[]
}

function ProductCard({ variant, backgroundUrl }: ProductCardProps) {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [vars, setVars] = useState({
    mx: "50%",
    my: "50%",
    posx: "50%",
    posy: "50%",
    hyp: "0",
  });

  const round = (n: number, fix = 3) => parseFloat(n.toFixed(fix));

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;

    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;

      const pctX = round((100 / r.width) * x);
      const pctY = round((100 / r.height) * y);

      // tilt
      setRotation({
        y: (pctX - 50) * 0.2,
        x: (50 - pctY) * 0.2,
      });

      // light
      const posx = round(50 + pctX / 4 - 12.5);
      const posy = round(50 + pctY / 3 - 16.67);
      const hyp = Math.sqrt((pctY - 50) ** 2 + (pctX - 50) ** 2) / 50;

      setVars({
        mx: `${pctX}%`,
        my: `${pctY}%`,
        posx: `${posx}%`,
        posy: `${posy}%`,
        hyp: `${round(hyp)}`,
      });
    };

    const onLeave = () => {
      setRotation({ x: 0, y: 0 });
      setVars({ mx: "50%", my: "50%", posx: "50%", posy: "50%", hyp: "0" });
    };

    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, []);


const holoOverlayStyle: React.CSSProperties = {
  backgroundImage: `
    url("https://res.cloudinary.com/simey/image/upload/Dev/PokemonCards/illusion.webp"),
    repeating-linear-gradient(
      0deg,
      rgba(255, 119, 115, 0.55) calc(5% * 1),
      rgba(255, 237, 95, 0.55) calc(5% * 2),
      rgba(168, 255, 95, 0.55) calc(5% * 3),
      rgba(131, 255, 247, 0.55) calc(5% * 4),
      rgba(120, 148, 255, 0.55) calc(5% * 5),
      rgba(216, 117, 255, 0.55) calc(5% * 6),
      rgba(255, 119, 115, 0.55) calc(5% * 7)
    ),
    repeating-linear-gradient(
      133deg,
      rgba(14, 21, 46, 0.4) 0%,
      rgba(143, 163, 163, 0.5) 3.8%,
      rgba(143, 193, 193, 0.5) 4.5%,
      rgba(143, 163, 163, 0.5) 5.2%,
      rgba(14, 21, 46, 0.4) 10%,
      rgba(14, 21, 46, 0.4) 12%
    ),
    radial-gradient(
      farthest-corner circle at var(--mx) var(--my),
      rgb(0 0 0 / 0.05) 10%,
      rgb(0 0 0 / 0.12) 25%,
      rgb(0 0 0 / 0.25) 120%
    )
  `,
  backgroundSize: `50%, 200% 700%, 300%, 200%`,
  backgroundPosition: `center, 0% var(--posy), var(--posx) var(--posy), var(--posx) var(--posy)`,
  backgroundBlendMode: `exclusion, hue, hard-light, exclusion`,
  mixBlendMode: "color-dodge",
  filter: `brightness(calc((var(--hyp) * 0.35) + 0.8)) contrast(1.7) saturate(1.8)`,
  opacity: 0.8,
  transition: "background-position 0.25s ease, filter 0.25s ease",
};

  return (
<div
  ref={cardRef}
  className="card-anim holo-card relative rounded-[24px] overflow-hidden h-[460px] will-change-transform group"
  style={{
    transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
    transformStyle: "preserve-3d",
    "--mx": vars.mx,
    "--my": vars.my,
    "--posx": vars.posx,
    "--posy": vars.posy,
    "--hyp": vars.hyp,
  }}
>

  <div className="absolute inset-0 z-[0]">
    {backgroundUrl && (
      <img
        src={backgroundUrl}
        alt=""
        className="absolute inset-0 w-full h-full object-cover"
        loading="lazy"
      />
    )}
    <div
      className="absolute inset-0 pointer-events-none"
      style={holoOverlayStyle}
    />
  </div>


  <Link
    href={`/shop/products/${variant.id}?id=${variant.id}&title=${variant.product.title}&variant=${variant.variantName}&prodId=${variant.productID}`}
    className="relative z-[10] flex flex-col h-full p-5"
  >
    <div className="flex items-center justify-between mb-5">
      <span className="px-4 py-[5px] bg-white/60 text-black text-[11px] font-neuehaas45 rounded-full tracking-wide shadow-sm">
        {variant.product.title}
      </span>
      <div className="w-6 h-6 rounded-full bg-white/60 flex items-center justify-center shadow-sm">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#111"
          strokeWidth="1"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-4 h-4 transition-transform duration-500 group-hover:-translate-y-[1.5px] group-hover:rotate-[5deg]"
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
      <span className="text-[12px] font-neuehaas45 text-zinc-800">
        {variant.variantName}
      </span>
      <span className="text-[12px] font-neuehaas45 text-zinc-800">
        ${Number(variant.product.price).toFixed(2)}
      </span>
    </div>
  </Link>
</div>
  );
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
  const itemRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [currentIndices, setCurrentIndices] = useState<Record<string, number>>(() => 
    groupedVariants.reduce((acc, group) => ({ ...acc, [group.id]: 0 }), {})
  );
  const [steps, setSteps] = useState<Record<string, number>>({});
  
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

  useEffect(() => {
    const handleResize = () => {
      const newSteps: Record<string, number> = {};
      Object.keys(itemRefs.current).forEach((id) => {
        const item = itemRefs.current[id];
        if (!item || !item.parentNode) return;
        const parent = item.parentNode as HTMLElement;
        const gap = parseFloat(getComputedStyle(parent).gap) || 24;
        const itemW = item.offsetWidth;
        newSteps[id] = itemW + gap;
      });
      setSteps(newSteps);
    };


    setTimeout(handleResize, 0); 

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [groupedVariants]);

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

  const handlePrev = (groupId: string, maxIndex: number) => {
    setCurrentIndices((prev) => ({
      ...prev,
      [groupId]: Math.max(0, prev[groupId] - 1),
    }));
  };

  const handleNext = (groupId: string, maxIndex: number) => {
    setCurrentIndices((prev) => ({
      ...prev,
      [groupId]: Math.min(maxIndex, prev[groupId] + 1),
    }));
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
            gsap.set(row, { overflow: 'visible' });

            const tl = gsap.timeline({ 
              defaults: { ease: "power3.out" },
              onComplete: () => {
                // overflow hidden after animation
                gsap.set(row, { overflow: 'hidden' });
              }
            });

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
      <div className="grid grid-cols-12 gap-8 relative">
        
        <aside ref={asideRef} className="col-span-3 -ml-2">
          <div 
            ref={filterContainerRef}
            className="pt-12 space-y-8 will-change-transform pl-2" 
          >
            <div className="space-y-4 space-x-6">
              <h3 className="text-[12px] font-neuehaas45 uppercase tracking-wide text-gray-400 pl-6">Filters</h3>
        
              <div className="space-y-2">
                <h4 className="text-[10px] font-neuehaas45 uppercase text-gray-400">Range</h4>
                {groupedVariants.map((group) => (
                  <button 
                    key={group.id}
                    onClick={() => handleFilterClick(group.id)}
                    className="block text-left text-[11px] font-neuehaas45 tracking-wide text-black hover:underline"
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
        
              <div className="border-t w-[70%] pt-4 space-y-2">
                <h4 className="text-[10px] font-neuehaas45 uppercase text-gray-400">Price</h4>
                <div className="block text-left text-[11px] text-black font-neuehaas45 hover:underline">Low to high</div>
                <div className="block text-left text-[11px] text-black font-neuehaas45 hover:underline">High to low</div>
              </div>
            </div>
          </div>
        </aside>
      
      <section ref={sectionContainerRef} className="col-span-9 space-y-8">
{groupedVariants.map((group, index) => {
  const maxIndex = Math.max(0, group.variants.length - 3);
  const translateX = group.variants.length <= 3 
    ? 0 
    : -currentIndices[group.id] * (steps[group.id] || 0);
  const showArrows = group.variants.length > 3;
  const currentIndex = currentIndices[group.id];

  let backgroundUrl = "/images/_mesh_gradients/metallicdream.png";

  switch (group.id) {
    case "devices":
      backgroundUrl = "/images/_mesh_gradients/metallicdream.png";
      break;
    case "floss":
      backgroundUrl = "/images/_mesh_gradients/wavyrainbow.png";
      break;
    case "whitening":
      backgroundUrl = "/images/_mesh_gradients/metallicblue.png";
      break;
    case "cases":
      backgroundUrl = "/images/_mesh_gradients/wavyrainbow.png";
      break;
  }

  return (
    <div
      key={group.id}
      ref={(el) => (sectionRefs.current[index] = el)}
      id={group.id}
      className="space-y-4"
    >
      <div className="flex items-start gap-2">
        <div className="text-[18px] text-zinc-500 font-canelathin">
          {group.prefix}
          <br />
        </div>
        {showArrows && (
     <div className="flex items-center gap-2">
  <button
    onClick={() => handlePrev(group.id, maxIndex)}
    disabled={currentIndex === 0}
    className={`w-8 h-8 flex items-center border justify-center rounded-full text-sm transition-all duration-200 ${
      currentIndex === 0
        ? "opacity-90"
        : "bg-[#B4DCE1]/80 hover:bg-white text-white"
    }`}
  >
    ←
  </button>

  <button
    onClick={() => handleNext(group.id, maxIndex)}
    disabled={currentIndex >= maxIndex}
    className={`w-8 h-8 flex items-center border justify-center rounded-full text-sm transition-all duration-200 ${
      currentIndex >= maxIndex
        ? "opacity-90"
        : "bg-[#B4DCE1]/80 hover:bg-white text-white"
    }`}
  >
    →
  </button>
</div>
        )}
      </div>

      <div className="relative products-row overflow-hidden px-4 sm:px-6 -ml-[18px] sm:-ml-[34px]">
        <div 
          className="flex gap-6 transition-transform duration-300 ease-in-out"
          style={{ 
            transform: `translateX(${translateX}px)`,
            width: 'calc(100%)'
          }}
        >
          {group.variants.map((variant, idx) => (
            <div
              key={variant.id}
              ref={
                showArrows && idx === 0 
                  ? (el) => { itemRefs.current[group.id] = el; } 
                  : null
              }
              className="flex-shrink-0 min-w-0 w-full sm:w-1/2 lg:w-1/3 max-w-[calc(33.333%-1rem)]"
            >
              <ProductCard
                variant={variant}
                backgroundUrl={backgroundUrl}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
})}
      </section>
      </div>
    </>
  );
}