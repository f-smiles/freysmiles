"use client"
// framer motion
import { motion, useScroll, useTransform } from "framer-motion"
// gsap
import { gsap } from "gsap-trial"
import { ScrollSmoother } from "gsap-trial/ScrollSmoother"
import { ScrollTrigger } from "gsap-trial/ScrollTrigger"
import { SplitText } from "gsap-trial/SplitText"
import useIsomorphicLayoutEffect from "@/_helpers/isomorphicEffect"

export default function Test() {
  useIsomorphicLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger, ScrollSmoother, SplitText)

    const smoother = ScrollSmoother.create({
      content: "#scrollsmoother-container",
      smooth: 3,
      normalizeScroll: true,
      ignoreMobileResize: true,
      effects: true,
      //preventDefault: true,
      //ease: 'power4.out',
      //smoothTouch: 0.1, 
    })

    // smoother.effects("img", { speed: "auto" })

    let headings = gsap.utils.toArray(".js-title").reverse()
    headings.forEach((heading, i) => {
      let headingIndex = i + 1
      let mySplitText = new SplitText(heading, { type: "chars" })
      let chars = mySplitText.chars

      chars.forEach((char, i) => {
        smoother.effects(char, { lag: (i + headingIndex) * 0.1, speed: 1 })
      })
    })

    let splitTextLines = gsap.utils.toArray(".js-splittext-lines")

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: splitTextLines,
        start: 'top 90%',
        end: 'bottom 60%',
        scrub: 2,
        markers: false,
        toggleActions: 'play none play reset'
      }
    })
    const itemSplitted = new SplitText(splitTextLines, { type: 'lines' });
			tl.from(itemSplitted.lines, { y: 100, opacity: 0, stagger: 0.05, duration: 0.5, ease: 'back.inOut' })

  }, [])

  return (
    <div id="scrollsmoother-container">
      <section className="relative overflow-hidden w-full h-[90vh]">
        <img className="absolute bottom-0 mx-auto w-full object-cover h-[140%]" data-speed="auto" src="https://images.unsplash.com/photo-1519608487953-e999c86e7455?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2340&q=80" />
      </section>

      <div className="relative px-6 lg:px-44">
        <section className="grid grid-cols-3 gap-4 border-pink-500 border-dashed border-y-2 my-44">
          <div className="col-span-1 overflow-hidden rounded-lg aspect-square" data-speed="1" data-lag="0.1">
            <img data-speed="auto" src="https://images.unsplash.com/photo-1561344640-2453889cde5b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=967&q=80" />
          </div>
          <div className="col-span-1 overflow-hidden rounded-lg aspect-square" data-speed="1" data-lag="0.4">
            <img data-speed="auto" src="https://images.unsplash.com/photo-1561344640-2453889cde5b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=967&q=80" />
          </div>
          <div className="col-span-1 overflow-hidden rounded-lg aspect-square" data-speed="1" data-lag="0.8">
            <img data-speed="auto" src="https://images.unsplash.com/photo-1561344640-2453889cde5b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=967&q=80" />
          </div>
        </section>

        <section className="relative flex items-center border-pink-500 border-dashed h-96 border-y-2 my-44">
          <h1 className="js-title">Smoother</h1>
          <h1 className="js-title">Smoother</h1>
          <h1 className="js-title">Smoother</h1>
        </section>

        <section className="grid grid-cols-3 gap-4 border-pink-500 border-dashed border-y-2 my-44">
          <div className="col-span-1 overflow-hidden rounded-lg aspect-w-3 aspect-h-4" data-speed="1" data-lag="0.1">
            <img data-speed="auto" src="https://images.unsplash.com/photo-1561344640-2453889cde5b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=967&q=80" />
          </div>
          <div className="col-span-1 overflow-hidden rounded-lg aspect-w-3 aspect-h-4" data-speed="1" data-lag="0.4">
            <img data-speed="auto" src="https://images.unsplash.com/photo-1561344640-2453889cde5b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=967&q=80" />
          </div>
          <div className="col-span-1 overflow-hidden rounded-lg aspect-w-3 aspect-h-4" data-speed="1" data-lag="0.8">
            <img data-speed="auto" src="https://images.unsplash.com/photo-1561344640-2453889cde5b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=967&q=80" />
          </div>
        </section>

        <section className="my-24 text-center">
          <h1 className="text-6xl font-bold text-center js-splittext-lines">
            Split by <span className="text-pink-500">LINES:</span> Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis gravida faucibus tincidunt. Donec a nisl dignissim, dictum sem in, mattis velit. Nulla nec gravida erat. Nunc scelerisque augue placerat lacus tristique rutrum. Vestibulum vulputate felis quis dolor lacinia pretium.
          </h1>
        </section>

        <section className="container px-0 bg-white md:flex md:items-center md:space-x-28 bg-opacity-5 my-44">		
          <div className="relative py-12 pl-6 border-l-4 border-pink-500 md:py-0">
            <h2 className="mb-6 text-6xl font-bold"><strong>Easy parallax image effects</strong></h2>
            <p>Pop your images in a container with overflow hidden, size them a little larger than the container and set data-speed to auto. GSAP does the rest.</p>
          </div>
          <div className="relative w-full h-screen overflow-hidden rounded-lg"> 
            <img className="absolute bottom-0 mx-auto w-full object-cover h-[120%]" data-speed="auto" src="https://images.unsplash.com/photo-1561344640-2453889cde5b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=967&q=80" alt="" />
          </div>
        </section>

        <section className="container px-0 mt-12 bg-white md:flex md:items-center md:space-x-28 bg-opacity-5 my-44">	
          <div className="relative w-full h-screen overflow-hidden rounded-lg"> 
            <img className="absolute bottom-0 mx-auto w-full object-cover h-[120%]" data-speed="auto" src="https://images.unsplash.com/photo-1561344640-2453889cde5b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=967&q=80" alt="" />
          </div>	
          <div className="relative py-12 pr-6 border-r-4 border-pink-500 md:py-0">
            <h2 className="mb-6 text-6xl font-bold"><strong>Easy parallax image effects</strong></h2>
            <p>Pop your images in a container with overflow hidden, size them a little larger than the container and set data-speed to auto. GSAP does the rest.</p>
          </div>		
        </section>

        <section className="flex justify-center space-x-12 my-44">
          <div className="p-16 my-12 bg-pink-500 rounded-lg" data-speed="1" data-lag="0.2"></div>
          <div className="p-16 my-12 bg-pink-500 rounded-lg" data-speed="1" data-lag="0.4"></div>
          <div className="p-16 my-12 bg-pink-500 rounded-lg" data-speed="1" data-lag="0.6"></div>
          <div className="p-16 my-12 bg-pink-500 rounded-lg" data-speed="1" data-lag="0.8"></div>
          <div className="p-16 my-12 bg-pink-500 rounded-lg" data-speed="1" data-lag="1"></div>
        </section>

        <section className="flex justify-center space-x-12 my-44">
          <div className="p-16 my-12 bg-pink-500 rounded-lg" data-speed="0.9"></div>
          <div className="p-16 my-12 bg-pink-500 rounded-lg" data-speed="1.1"></div>
          <div className="p-16 my-12 bg-pink-500 rounded-lg" data-speed="0.75"></div>
          <div className="p-16 my-12 bg-pink-500 rounded-lg" data-speed="1.25"></div>
          <div className="p-16 my-12 bg-pink-500 rounded-lg" data-speed="1.5"></div>
        </section>

        <section className="relative border-pink-500 border-dashed border-y-2 mt-44">
          <h2 className="p-12 text-2xl text-center bg-pink-500">END</h2>
        </section>
      </div>
    </div>
  )
}


function ScaleCircleTest() {
  const { scrollYProgress } = useScroll()
  const scale = useTransform(scrollYProgress, [0, 1], [0.2, 2])

  return (
    <div className="relative mx-auto my-32 max-w-7xl">
      <div className="absolute w-full h-full -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
        <motion.svg
          viewBox="0 0 100 100"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full overflow-hidden rounded-full"
          style={{ scale }}
        >
          <circle cx="50" cy="50" r="50" />
        </motion.svg>
      </div>
      <section>
        {/* YOUR CONTENT HERE  - DELETE THE H4 */}
        <h4>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean non
          diam nisi. Sed auctor posuere semper. Nullam egestas volutpat tellus
          ac ullamcorper. Praesent euismod aliquam orci sed condimentum.
          Curabitur id nisl non neque vulputate sollicitudin quis quis orci.
          Fusce ut magna eleifend, venenatis tortor vitae, tincidunt ipsum.
          Quisque dignissim, orci nec malesuada mattis, odio turpis laoreet dui,
          vitae faucibus mauris lectus in lectus. Vestibulum turpis eros,
          faucibus quis dapibus vel, scelerisque at ipsum. Etiam eget felis
          blandit, sollicitudin eros id, ultricies nibh. Nam faucibus eros
          finibus molestie luctus.
        </h4>
        <h4>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean non
          diam nisi. Sed auctor posuere semper. Nullam egestas volutpat tellus
          ac ullamcorper. Praesent euismod aliquam orci sed condimentum.
          Curabitur id nisl non neque vulputate sollicitudin quis quis orci.
          Fusce ut magna eleifend, venenatis tortor vitae, tincidunt ipsum.
          Quisque dignissim, orci nec malesuada mattis, odio turpis laoreet dui,
          vitae faucibus mauris lectus in lectus. Vestibulum turpis eros,
          faucibus quis dapibus vel, scelerisque at ipsum. Etiam eget felis
          blandit, sollicitudin eros id, ultricies nibh. Nam faucibus eros
          finibus molestie luctus.
        </h4>
      </section>
    </div>
  )
}
