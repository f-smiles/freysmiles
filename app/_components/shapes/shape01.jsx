export default function Shape01(props) {
  return (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g clipPath="url(#clip0_221_10)">
        <path
          d="M0 0H100C155.228 0 200 44.7715 200 100V200H100C44.7715 200 0 155.228 0 100V0Z"
          fill="url(#paint0_linear_221_10)"
        />
      </g>
      <defs>
        <linearGradient
          id="paint0_linear_221_10"
          x1="100"
          y1="0"
          x2="100"
          y2="200"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="rgba(251, 146, 60, 0.5)" />
          <stop offset="1" stopColor="rgba(251, 113, 133, 0.5)" />
          {/* <stop stopColor="rgba(251, 113, 133, 0.5)" />
          <stop offset="1" stopColor="rgba(253, 186, 116, 0.5)" /> */}
          {/* <stop stopColor="#fceeff" />
          <stop offset="1" stopColor="#e1e5fa" /> */}
          {/* <stop offset="0.0509862" stop-color="#FFB6E1"/>
              <stop offset="1" stop-color="#FBE3EA"/> */}
          {/* <stop stopColor="#A7B5FF"/>
                <stop offset="1" stopColor="#F3ACFF"/> */}
        </linearGradient>
        <clipPath id="clip0_221_10">
          <rect width="200" height="200" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}
