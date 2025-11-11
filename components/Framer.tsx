"use client";
import { Variants } from "framer-motion";

export const defaultEasing = [0.6, -0.05, 0.01, 0.99] as const;

export const staggerHalf: Variants = {
  animate: {
    transition: {
      staggerChildren: 0.05,
    },
  },
};

export const staggerImmediate: Variants = {
  animate: {
    transition: {
      staggerChildren: 0.01,
    },
  },
};

export const fadeInHalf: Variants = {
  initial: {
    opacity: 0,
    transition: { duration: 0.5, ease: defaultEasing },
    willChange: "opacity",
  },
  animate: {
    opacity: 1,
    transition: { duration: 0.5, ease: defaultEasing },
    willChange: "opacity",
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.5, ease: defaultEasing },
    willChange: "opacity",
  },
};

export const fadeIn: Variants = {
  initial: {
    opacity: 0,
    transition: { duration: 0.8, ease: defaultEasing },
    willChange: "opacity",
  },
  animate: {
    opacity: 1,
    transition: { duration: 0.8, ease: defaultEasing },
    willChange: "opacity",
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.8, ease: defaultEasing },
    willChange: "opacity",
  },
};

export const fadeInUp: Variants = {
  initial: {
    y: 20,
    opacity: 0,
    transition: { duration: 0.6, ease: defaultEasing },
    willChange: "opacity, transform",
  },
  animate: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.6, ease: defaultEasing },
    willChange: "opacity, transform",
  },
  exit: {
    y: 20,
    opacity: 0,
    transition: { duration: 0.6, ease: defaultEasing },
    willChange: "opacity, transform",
  },
};

export const fadeInRight: Variants = {
  initial: {
    x: 20,
    opacity: 0,
    transition: { duration: 0.6, ease: defaultEasing },
    willChange: "opacity, transform",
  },
  animate: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.6, ease: defaultEasing },
    willChange: "opacity, transform",
  },
  exit: {
    x: 20,
    opacity: 0,
    transition: { duration: 0.6, ease: defaultEasing },
    willChange: "opacity, transform",
  },
};

export const scaleUp: Variants = {
  initial: {
    scale: 0.95,
    opacity: 0,
    transition: { duration: 0.6, ease: defaultEasing },
    willChange: "opacity, transform",
  },
  animate: {
    scale: 1,
    opacity: 1,
    transition: { duration: 0.6, ease: defaultEasing },
    willChange: "opacity, transform",
  },
  exit: {
    scale: 0.95,
    opacity: 0,
    transition: { duration: 0.6, ease: defaultEasing },
    willChange: "opacity, transform",
  },
};

export const menu: Variants = {
  initial: {
    opacity: 0,
    scale: 0.9,
    y: -10,
    transition: { duration: 0.2, ease: defaultEasing },
    willChange: "opacity, transform",
  },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.2, ease: defaultEasing },
    willChange: "opacity, transform",
  },
  exit: {
    opacity: 0,
    scale: 0.9,
    y: -10,
    transition: { duration: 0.2, ease: defaultEasing },
    willChange: "opacity, transform",
  },
};

export const stagger: Variants = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};
