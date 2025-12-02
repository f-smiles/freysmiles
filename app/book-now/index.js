"use client";

export default function BookNow() {
  return (
    <div className="flex flex-col lg:flex-row w-full h-screen">
      <section
        className="relative z-10 w-full lg:w-1/2 h-[50vh] lg:h-full flex flex-col items-center justify-center text-white p-8"
        style={{
          background: `
            linear-gradient(
              180deg,
              #e9dccd 0%,
              #e8c1b0 20%,
              #d9b7b6 40%,
              #c4b8c9 60%,
              #b7bfd8 80%,
              #aebfda 100%
            )
          `
        }}
      >
        <h1 className="text-4xl lg:text-6xl tracking-tight text-center font-sinistre">
          Website Coming Soon
        </h1>

        <p className="mt-4 text-[14px] lg:text-[16px] font-neuehaas35 text-center leading-relaxed">
          Text Us: 610-437-4748 <br/>
          Email Us: info@freysmiles.com
        </p>
      </section>

      <div className="acuity-font w-full lg:w-1/2 h-[50vh] lg:h-full flex items-center justify-center bg-white">
        <iframe
          src={process.env.NEXT_PUBLIC_ACUITY_SCHEDULING_SRC}
          title="Schedule Appointment"
          width="100%"
          height="100%"
          frameBorder="0"
          allow="payment"
          className="border-0"
        ></iframe>
      </div>
    </div>
  )
}