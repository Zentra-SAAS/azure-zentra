import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

interface PageTransitionProps {
    children: React.ReactNode;
    className?: string;
}

const PageTransition: React.FC<PageTransitionProps> = ({ children, className = '' }) => {
    const shouldReduceMotion = useReducedMotion();

    const variants = {
        initial: {
            opacity: 0,
            y: shouldReduceMotion ? 0 : 12,
            scale: shouldReduceMotion ? 1 : 0.98
        },
        enter: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                duration: 0.4,
                ease: [0.61, 1, 0.88, 1], // Custom easing for smooth "snap"
                staggerChildren: 0.1
            }
        },
        exit: {
            opacity: 0,
            y: shouldReduceMotion ? 0 : -12,
            transition: {
                duration: 0.3,
                ease: "easeIn"
            }
        }
    };

    return (
        <motion.div
            initial="initial"
            animate="enter"
            exit="exit"
            variants={variants}
            className={`w-full h-full ${className}`}
        >
            {/* Optional: Add a subtle background parallax element here if desired */}
            {children}
        </motion.div>
    );
};

export default PageTransition;
