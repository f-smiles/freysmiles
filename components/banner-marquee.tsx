export const BannerMarquee = () => {
  // const text = "Reserve an appointment now to experience our new year courtesy of up to 700 dollars off full treatment.";
  const texts = ["Allentown", "Bethlehem", "Lehighton", "Schnecksville", "Complimentary Consultation"]
  const repeatCount = 12;

  return (
    <div className="relative w-full overflow-hidden bg-[#ABF926]">
      <div className="marquee">
        <div className="marqueegroup">
          {Array.from({ length: repeatCount }).map((_, i) => (
            <div key={`a-${i}`} className="flex items-center">
              {texts.map((text, j) => (
                <div key={`a-${i}-${j}`}>
                  <span className="px-6 py-2 text-[12px] font-neuehaas45 whitespace-nowrap tracking-wide">
                    {text}
                  </span>
                  <span className="mx-4 text-[12px] font-light opacity-50">+</span>
                </div>
              ))}
            </div>
          ))}
        </div>

        <div className="marqueegroup">
          {Array.from({ length: repeatCount }).map((_, i) => (
            <div key={`a-${i}`} className="flex items-center">
              {texts.map((text, j) => (
                <div key={`b-${i}-${j}`}>
                  <span className="px-6 py-2 text-[12px] font-neuehaas45 whitespace-nowrap tracking-wide">
                    {text}
                  </span>
                  <span className="mx-4 text-[12px] font-light opacity-50">+</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
