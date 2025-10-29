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
        #ff7773 calc(5% * 1),
        #ffed5f calc(5% * 2),
        #a8ff5f calc(5% * 3),
        #83fff7 calc(5% * 4),
        #7894ff calc(5% * 5),
        #d875ff calc(5% * 6),
        #ff7773 calc(5% * 7)
      ),
      repeating-linear-gradient(
        133deg,
        #0e152e 0%,
        #8fa3a3 3.8%,
        #8fc1c1 4.5%,
        #8fa3a3 5.2%,
        #0e152e 10%,
        #0e152e 12%
      ),
      radial-gradient(
        farthest-corner circle at var(--mx) var(--my),
        rgb(0 0 0 / 0.1) 12%,
        rgb(0 0 0 / 0.15) 20%,
        rgb(0 0 0 / 0.25) 120%
      )
    `,
    backgroundSize: `50%, 200% 700%, 300%, 200%`,
    backgroundPosition: `center, 0% var(--posy), var(--posx) var(--posy), var(--posx) var(--posy)`,
    backgroundBlendMode: `exclusion, hue, hard-light, exclusion`,
    mixBlendMode: "color-dodge", 
    filter: `brightness(calc((var(--hyp) * 0.3) + 0.5)) contrast(2) saturate(1.5)`,
    opacity: 1,
    transition: "background-position 0.25s ease, filter 0.25s ease",
  };

  return (
    <div
      ref={cardRef}
      className="holo-card relative rounded-[24px] overflow-hidden h-[460px] shadow-sm will-change-transform group"
      style={{
        transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
        transformStyle: "preserve-3d",
        // expose CSS vars to overlay
        "--mx": vars.mx,
        "--my": vars.my,
        "--posx": vars.posx,
        "--posy": vars.posy,
        "--hyp": vars.hyp,
      }}
    >
    
      {backgroundUrl && (
        <img
          src={backgroundUrl}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          loading="lazy"
        />
      )}


      <Link
        href={`/shop/products/${variant.id}?id=${variant.id}&title=${variant.product.title}&variant=${variant.variantName}&prodId=${variant.productID}`}
        className="relative z-10 flex flex-col h-full p-5"
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

      {/* foil overlay on top of everything */}
      <div
        className="absolute inset-0 z-[20] pointer-events-none"
        style={holoOverlayStyle}
      />
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
          <div className="space-y-4 space-x-6">
            <h3 className="text-[12px] font-neuehaas45 uppercase tracking-wide text-gray-400 pl-6">Filters</h3>
      
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
      ref={(el) => (sectionRefs.current[index] = el)}
      id={group.id}
      className="space-y-4"
    >
      <div className="text-[18px] text-zinc-500 font-canelathin">
        {group.prefix}
        <br />
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 products-row">
      {group.variants.map((variant) => {
  let backgroundUrl = "/images/_mesh_gradients/metallicdream.png";

  switch (group.id) {
    case "devices":
      backgroundUrl = "/images/_mesh_gradients/metallicdream.png";
      break;
    case "floss":
      backgroundUrl = "/images/_mesh_gradients/greenpurpleyellow.png";
      break;
    case "whitening":
      backgroundUrl = "/images/_mesh_gradients/lightblue.png";
      break;
    case "cases":
      backgroundUrl = "/images/_mesh_gradients/47. Whisper.jpg";
      break;
  }

  return (
    <ProductCard
      key={variant.id}
      variant={variant}
      backgroundUrl={backgroundUrl}
    />
  );
})}
      </div>
    </div>
  ))}
</section>
    </div>
</>

  );
}