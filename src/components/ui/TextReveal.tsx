import React, { useEffect } from 'react';
import { motion, useAnimation, Variants } from 'framer-motion';

interface TextRevealProps {
    text: string;
    className?: string;
    delay?: number;
}

export const TextReveal: React.FC<TextRevealProps> = ({ text, className = "", delay = 0 }) => {
    const controls = useAnimation();

    useEffect(() => {
        controls.start("visible");
    }, [controls]);

    if (typeof text !== 'string') {
        return <span className={className}>{String(text || '')}</span>;
    }

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

    try {
        const words = text.split(" ");
        return (
            <motion.span
                className={`inline-block ${className}`}
                variants={containerVariants}
                initial="hidden"
                animate={controls}
            >
                {words.map((word, i) => (
                    <React.Fragment key={i}>
                        <span className="inline-block whitespace-nowrap">
                            {(word || "").split("").map((char, charIndex) => (
                                <motion.span
                                    key={`${char}-${charIndex}`}
                                    className="inline-block"
                                    variants={charVariants}
                                >
                                    {char}
                                </motion.span>
                            ))}
                        </span>
                        {i < words.length - 1 && <span className="inline-block"> </span>}
                    </React.Fragment>
                ))}
            </motion.span>
        );
    } catch (e) {
        console.error("TextReveal Error:", e);
        return <span className={className}>{text}</span>;
    }
};
