export default function Hero() {
  const letters = [
    { char: 'S', rotate: 'rotate-12', translateY: 'translate-y-', color: 'text-black' },
    { char: 'H', rotate: 'rotate-12', translateY: 'translate-y-20', color: 'text-black' },
    { char: 'O', rotate: 'rotate-6', translateY: 'translate-y-2', color: 'text-black' },
    { char: 'P', rotate: 'rotate-2', translateY: 'translate-y-20',translateX: 'translate-x-2', color: 'text-black' },
  ];

  const lettersNow = [
    { char: 'N', rotate: 'rotate-12', translateY: 'translate-y-1', color: 'text-black' },
    { char: 'O', rotate: 'rotate-12', translateY: 'translate-y-5', color: 'text-black' },
    { char: 'W', rotate: 'rotate-6', translateY: 'translate-y-1', color: 'text-black' },
  ];

  return (
    <section className="flex flex-col items-center justify-center h-screen space-y-8 ">
      <div className="flex flex-wrap items-end justify-center font-grandslang">
        {letters.map((style, index) => (
          <span
            key={index}
            className={`inline-block ${style.rotate} ${style.translateY} ${style.translateX}  ${style.color} mx-1`}
            style={{ fontSize: '8rem' }}
          >
            {style.char}
          </span>
        ))}
      </div>
      <div className="flex items-end justify-center font-grandslang">
        {lettersNow.map((style, index) => (
          <span
            key={`now-${index}`}
            className={`inline-block ${style.rotate} ${style.translateY} ${style.color}`}
            style={{ fontSize: '8rem' }}
          >
            {style.char}
          </span>
        ))}
      </div>
    </section>
  )
}