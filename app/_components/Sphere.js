export default function Sphere() {
  const sphereSize = '15vw';
  const ringStyles = [];

  for (let i = 1; i <= 16; i++) {
    ringStyles.push({
      transform: `rotateY(${i * 2}deg) rotateX(${i * 2}deg) rotateZ(${i * 3}deg)`,
      boxShadow: `0 0 ${1 + (i * 2)}px rgba(${255 - (i * 2)}, ${170 - Math.round(i * 0.5)}, ${45 * Math.round(i / 3)}, 0.1), inset 0 0 ${1 + (i * 2)}px rgba(${255 - (i * 2)}, ${170 - Math.round(i * 0.5)}, ${45 * Math.round(i / 3)}, 0.1)`,
    });
  }

  return (
    <div
      id="sphere"
      className="py-32"
      // className="absolute left-0 right-0 bottom-1/4"
      width={sphereSize}
      height={sphereSize} style={{transformStyle: 'preserve-3d', animation: 'spinSphere 20s infinite linear'}}
      // style={{position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, margin: 'auto', width: sphereSize, height: sphereSize, transformStyle: 'preserve-3d', animation: 'spinSphere 20s infinite linear'}}
    >
      {ringStyles.map((style, i) => (
        <div key={i} className={`ring-${i + 1}`} style={{position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, margin: 'auto', width: sphereSize, height: sphereSize, borderRadius: '50%', overflow: 'hidden', ...style}}></div>
      ))}
    </div>
  )
}
