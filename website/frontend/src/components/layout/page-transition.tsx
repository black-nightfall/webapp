"use client"

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface PageTransitionProps {
    children: React.ReactNode;
    className?: string;
    direction?: 'left' | 'right' | 'bottom';
}

export function PageTransition({ children, className, direction = 'bottom' }: PageTransitionProps) {
    const initialVariants = {
        bottom: { opacity: 0, y: 50 },
        left: { opacity: 0, x: -100 },
        right: { opacity: 0, x: 100 }
    };

    const animateVariants = {
        bottom: { opacity: 1, y: 0 },
        left: { opacity: 1, x: 0 },
        right: { opacity: 1, x: 0 }
    };

    return (
        <motion.div
            className={cn("w-full", className)}
            initial={initialVariants[direction]}
            animate={animateVariants[direction]}
            transition={{
                type: "spring",
                stiffness: 260,
                damping: 20
            }}
        >
            {children}
        </motion.div>
    );
}
