"use client"
import ArrowLongRight from "../_components/ui/ArrowLongRight"
import ChevronDownIcon from "../_components/ui/ChevronDownIcon"

export default function LoadingAllProducts() {
  return (
    <div>
      <section className="relative isolate flex justify-center items-center gap-x-6 overflow-hidden bg-gray-50 px-6 py-2.5 sm:px-3.5">
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
        <p className="flex items-center gap-2 text-sm leading-6 text-gray-900">
          Unwrap Smiles, Gift Oral Wellness!
          <span className="font-semibold whitespace-nowrap" target='_blank'>
            <span className="flex items-center gap-1">
              Shop Gift Cards <ArrowLongRight className="w-4" />
            </span>
          </span>
        </p>
      </section>
      <section className="max-w-2xl px-10 mx-auto my-16 mb-32 lg:max-w-7xl">
        <div className="flex items-baseline justify-between w-full pb-4 border-b-2 border-gray-100">
          <h4 className="tracking-tight capitalize font-cera text-primary-30">Products</h4>
          <div className="relative inline-block text-left">
            <p className="inline-flex items-center justify-center text-sm font-medium text-gray-700 group hover:text-gray-900">
              Sort by
              <ChevronDownIcon
                className="flex-shrink-0 w-5 h-5 ml-1 -mr-1 text-gray-400 group-hover:text-gray-500"
                aria-hidden="true"
              />
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 mt-6 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="w-full overflow-hidden bg-white rounded-md h-80 aspect-h-1 aspect-w-1 lg:aspect-none lg:h-80">
                <div className="object-cover object-center w-full h-full lg:object-contain lg:h-full lg:w-full bg-zinc-200"/>
              </div>
              <div className="flex justify-between gap-4 mt-4">
                <div className="w-3/5 h-4 rounded-full bg-zinc-200" />
                <div className="w-1/5 h-4 rounded-full bg-zinc-200" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
