const transition = { duration: 1, ease: [0.76, 0, 0.24, 1] };

export const opacity = {
  initial: {
    opacity: 0,
  },
  open: {
    opacity: 1,
    transition: { duration: 0.35 },
  },
  closed: {
    opacity: 0,
    transition: { duration: 0.35 },
  },
};

export const height = {
  initial: {
    height: 0,
    y: -30,
    opacity: 1,
  },
  enter: {
    height: "auto",
    y: 0,
    opacity: 1,
    transition: {
      duration: 1.2,
      ease: [0.075, 0.82, 0.165, 1],
      delay: 0.1,
    },
  },
  exit: {
    height: 0,
    y: -30,
    opacity: 1,
    transition: {
      duration: 0.8, 
      ease: [0.33, 1, 0.68, 1],
      delay: 0.2,
    },
  },
};


export const background = {
  initial: { y: '-100%', opacity: 0 },
  open: {
    y: '0%',
    opacity: 1,
    transition: { duration: 0.7, ease: [0.075, 0.82, 0.165, 1] }
  },
  closed: {
    y: '-100%',
    opacity: 1,
    transition: {
      duration: 1.1,
      ease: [0.33, 1, 0.68, 1],
      delay: 0.2
    }
  }
}


export const blur = {
  initial: {
    filter: "blur(0px)",
    opacity: 1,
  },
  open: {
    filter: "blur(4px)",
    opacity: 0.6,
    transition: { duration: 0.3 },
  },
  closed: {
    filter: "blur(0px)",
    opacity: 1,
    transition: { duration: 0.3 },
  },
};

export const translate = {
  initial: {
    y: "100%",
    opacity: 0,
  },
  enter: (i) => ({
    y: 0,
    opacity: 1,
    transition: { duration: 1, ease: [0.76, 0, 0.24, 1], delay: i[0] },
  }),
  exit: (i) => ({
    y: "100%",
    opacity: 0,
    transition: { duration: 0.7, ease: [0.76, 0, 0.24, 1], delay: i[1] },
  }),
};

export const sublinkVariants = {
  initial: {
    y: 30,
    opacity: 0,
    clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
  },
  open: (i) => ({
    y: 0,
    opacity: 1,
    clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
    transition: {
      duration: 0.75,
      delay: i * 0.2,
      ease: [0.76, 0, 0.24, 1],
    },
  }),
  closed: (i) => ({
    y: 30,
    opacity: 0,
    clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
    transition: {
      duration: 0.5,
      delay: i * 0.05,
      ease: [0.76, 0, 0.24, 1],
    },
  }),
};
