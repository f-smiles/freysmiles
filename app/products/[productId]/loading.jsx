"use client"
import HomeIcon from "@/app/_components/ui/HomeIcon"

export default function LoadingSingleProduct() {
  return (
    <div className="max-w-2xl py-24 mx-auto lg:max-w-7xl animate-pulse">

      <div className="flex w-full mb-10" aria-label="Breadcrumb">
        <ol role="list" className="flex items-center space-x-4">
          <li>
            <div>
              <p className="text-gray-400 transition duration-300 ease-in-out hover:text-primary-50">
                <HomeIcon className="flex-shrink-0 w-5 h-5" aria-hidden="true" />
                <span className="sr-only">Home</span>
              </p>
            </div>
          </li>
          <li>
            <div className="flex items-center">
              <svg
                className="flex-shrink-0 w-5 h-5 text-gray-300"
                fill="currentColor"
                viewBox="0 0 20 20"
                aria-hidden="true"
              >
                <path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z" />
              </svg>
              <div className="w-24 h-4 ml-4 text-sm font-medium rounded-full bg-zinc-300 hover:text-gray-700" />
            </div>
          </li>
          <li>
            <div className="flex items-center">
              <svg
                className="flex-shrink-0 w-5 h-5 text-gray-300"
                fill="currentColor"
                viewBox="0 0 20 20"
                aria-hidden="true"
              >
                <path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z" />
              </svg>
              <div className="w-48 h-4 ml-4 text-sm font-medium rounded-full bg-zinc-300 hover:text-gray-700" />
            </div>
          </li>
        </ol>
      </div>

      <div className="grid w-full grid-cols-1 px-10 space-y-10 md:space-y-0 md:px-0 md:grid-cols-2 md:gap-12 lg:px-6">
        <section id="product" className="md:order-last">
          <div id="product-details" className="flex flex-col space-y-2 place-content-start">
            <span className="h-8 rounded-full w-96 bg-zinc-300"/>
            <span className="w-12 h-8 mb-4 rounded-full bg-zinc-300" />
            <div className="flex flex-col pt-8 space-y-2 border-t border-gray-300 place-content-start">
              <span className="w-full h-4 rounded-full bg-zinc-300" />
              <span className="w-full h-4 rounded-full bg-zinc-300" />
              <span className="w-[40%] h-4 rounded-full bg-zinc-300" />
            </div>
          </div>

          {/* controls */}
          <div className="flex flex-col gap-8 my-6 lg:items-center lg:flex-row lg:justify-between">
            <div className="flex items-center group text-primary-50">
              <span className="w-24 h-6 mr-2 rounded-full bg-zinc-300" />
              <span className="w-8 h-8 p-2 border rounded-tl rounded-bl border-zinc-400 bg-zinc-300" />
              <span className="w-8 h-8 px-4 py-2 border-t border-b bg-zinc-100 border-zinc-400" />
              <span className="w-8 h-8 p-2 border rounded-tr rounded-br border-zinc-400 bg-zinc-300" />
            </div>
            <div className="w-24 h-12 px-5 py-4 text-sm rounded bg-zinc-400" />
          </div>
        </section>
        <section id="image-carousel">
          <div className="object-cover object-center w-full h-full aspect-square lg:object-contain lg:h-full lg:w-full bg-zinc-300" />
          <div className="flex flex-row w-full gap-4 mt-6 place-content-start">
            <span className="object-cover object-center w-1/4 aspect-square bg-zinc-300" />
            <span className="object-cover object-center w-1/4 aspect-square bg-zinc-300" />
            <span className="object-cover object-center w-1/4 aspect-square bg-zinc-300" />
            <span className="object-cover object-center w-1/4 aspect-square bg-zinc-300" />
          </div>
        </section>
      </div>
    </div>
  )
}
