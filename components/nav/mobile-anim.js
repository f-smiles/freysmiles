export const sidebarVariants = {
  open: {
    clipPath: "circle(125vh at calc(100% - 48px) 48px)",
    opacity: 1,
    transition: { type: "linear", stiffness: 400, damping: 400 },
    backgroundColor: "#fafafa",
  },
  closed: {
    clipPath: "circle(24px at calc(100% - 48px) 48px)",
    opacity: 0,
    transition: { delay: 0.2, type: "linear", stiffness: 400, damping: 400 },
  },
}

export const staggerVariants = {
  open: {
    transition: { staggerChildren: 0.07, delayChildren: 0.2 },
  },
  closed: {
    transition: { staggerChildren: 0.05, staggerDirection: -1 },
  },
}

export const itemVariants = {
  open: {
    y: 0,
    transition: { type: "linear", stiffness: 1500, damping: 1000 },
  },
  closed: {
    y: 10,
    transition: { type: "linear", stiffness: 1500, damping: 1000 },
  },
}