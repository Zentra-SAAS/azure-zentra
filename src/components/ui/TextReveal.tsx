import React, { useEffect } from 'react';
import { motion, useAnimation, Variants } from 'framer-motion';

interface TextRevealProps {
    text: string;
    className?: string;
    delay?: number;
}

export const TextReveal: React.FC<TextRevealProps> = ({ text, className = "", delay = 0 }) => {
    const controls = useAnimation();

    // Split text into words and characters
    // formatting needs to be preserved

    useEffect(() => {
        controls.start("visible");
    }, [controls]);

    const containerVariants: Variants = {
        hidden: {},
        visible: {
            transition: {
                staggerChildren: 0.05,
                delayChildren: delay,
            },
        },
    };

    const charVariants: Variants = {
        hidden: { opacity: 0, y: 20, rotateX: 90 },
        visible: {
            opacity: 1,
            y: 0,
            rotateX: 0,
            transition: {
                type: "spring",
                damping: 12,
                stiffness: 100,
            },
        },
    };

    return (
        <motion.span
            className={`inline-block ${className}`}
            variants={containerVariants}
            initial="hidden"
            animate={controls}
        >
            {text.split(" ").map((word, i) => (
                <React.Fragment key={i}>
                    <span className="inline-block whitespace-nowrap">
                        {word.split("").map((char, charIndex) => (
                            <motion.span
                                key={`${char}-${charIndex}`}
                                className="inline-block"
                                variants={charVariants}
                            >
                                {char}
                            </motion.span>
                        ))}
                    </span>
                    {i < text.split(" ").length - 1 && <span className="inline-block"> </span>}
                </React.Fragment>
            ))}
        </motion.span>
    );
};
