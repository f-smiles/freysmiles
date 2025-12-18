export const HolidayMarquee = () => {
  const text = "Reserve an appointment now to experience our year end holiday courtesy of up to 700 dollars off full treatment.";
  const repeatCount = 12;

  return (
    <div className="relative overflow-hidden w-full bg-[#F0EF59]">
      <div className="marquee flex">
        <div className="marqueegroup">
          {[...Array(repeatCount)].map((_, i) => (
            <span
              key={i}
              className="px-6 py-2 text-[12px] font-neuehaas45 whitespace-nowrap tracking-wide"
            >
              {text}
            </span>
          ))}
        </div>

        <div className="marqueegroup" aria-hidden="true">
          {[...Array(repeatCount)].map((_, i) => (
            <span
              key={i}
              className="px-8 py-2 text-[12px] font-neuehaas45 whitespace-nowrap tracking-wide"
            >
              {text}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}