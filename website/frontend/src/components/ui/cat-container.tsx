"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

export type CatVariant = 'british' | 'orange' | 'tuxedo' | 'calico' | 'white';

interface CatContainerProps {
    children: React.ReactNode
    className?: string
    leftEar?: React.ReactNode
    rightEar?: React.ReactNode
    variant?: CatVariant
    earSize?: 'small' | 'large'
    entryDirection?: 'bottom' | 'left' | 'right' | 'none'
}

// Whiskers component to avoid repetition
const Whisker = ({ rotate, right = false }: { rotate: number, right?: boolean }) => (
    <motion.div
        className={cn(
            "absolute w-16 h-1 bg-black rounded-full",
            right ? "-right-10" : "-left-10"
        )}
        style={{ top: "50%", originX: right ? 0 : 1 }}
        initial={{ rotate: rotate }}
        whileHover={{
            rotate: right ? rotate + 5 : rotate - 5,
            scaleX: 1.1
        }}
        transition={{ type: "spring", stiffness: 300 }}
    />
);

interface EarProps {
    position: 'left' | 'right';
    variantConfig: { earColor: string; earShape: string };
    size: 'small' | 'large';
    children?: React.ReactNode;
}

const Ear = ({ position, variantConfig, size, children }: EarProps) => {
    const isLeft = position === 'left';

    // Size Logic
    const sizeClasses = size === 'large'
        ? "w-32 h-32 -top-10"
        : "w-16 h-16 -top-5";

    const textPadding = size === 'large' ? "pb-10" : "pb-3";

    // Position Logic
    const positionClasses = isLeft
        ? (size === 'small' ? "left-6" : "left-0")
        : (size === 'small' ? "right-6" : "right-0");

    // Animation Variants
    const rotateBase = isLeft ? -20 : 20;
    const rotateHover = isLeft ? -30 : 30;
    // For idle animation, we want a slight wiggle distinct for left/right
    const idleRotations = isLeft
        ? [-20, -25, -15, -20]
        : [20, 25, 15, 20];

    return (
        <motion.div
            className={cn(
                "absolute border-4 border-black z-0 flex items-center justify-center cursor-pointer overflow-hidden shadow-sm hover:shadow-md transition-shadow",
                variantConfig.earColor,
                variantConfig.earShape,
                sizeClasses,
                positionClasses
            )}
            variants={{
                initial: { rotate: rotateBase, y: 0, scale: 1 },
                idle: {
                    rotate: idleRotations,
                    y: 0,
                    scale: 1,
                    transition: {
                        rotate: {
                            repeat: Infinity,
                            repeatDelay: 2,
                            duration: 0.5,
                            ease: "easeInOut",
                            // Add slight delay for right ear to desync wiggles naturally if desired
                            // For simplicity, we can keep it synced or use a prop.
                            // The original code had delay: 0.1 for right ear.
                            delay: isLeft ? 0 : 0.1
                        }
                    }
                },
                hover: {
                    y: -8,
                    rotate: rotateHover,
                    scale: 1.1,
                    transition: { type: "spring", stiffness: 300 }
                }
            }}
            initial="initial"
            animate="idle"
            whileHover="hover"
        >
            <div className={cn("text-base font-bold text-slate-800 flex items-center justify-center w-full h-full", textPadding)}>
                {children}
            </div>
        </motion.div>
    );
};

export function CatContainer({
    children,
    className,
    leftEar,
    rightEar,
    variant = 'british',
    earSize = 'large',
    entryDirection = 'bottom'
}: CatContainerProps) {
    // Variant Configurations
    const variants = {
        british: {
            earColor: "bg-[#94a3b8]", // Blue Grey
            faceColor: "bg-white",
            earShape: "rounded-3xl", // Standard rounded
        },
        orange: {
            earColor: "bg-[#fdba74]", // Orange-ish
            faceColor: "bg-[#fff7ed]", // Light Orange tint
            earShape: "rounded-[2rem] rounded-tl-sm", // Slightly pointier
        },
        tuxedo: {
            earColor: "bg-black",
            faceColor: "bg-white",
            earShape: "rounded-xl", // Pointy
        },
        calico: {
            earColor: "bg-[#d97706]", // Brownish Gold
            faceColor: "bg-[#fef3c7]", // Cream
            earShape: "rounded-full", // Very round
        },
        white: {
            earColor: "bg-white",
            faceColor: "bg-white",
            earShape: "rounded-3xl",
        }
    };

    const currentVariant = variants[variant];



    // Ear Size Logic


    // Animation Variants based on entryDirection
    const initialVariants = {
        bottom: { opacity: 0, scale: 0.8, y: 50 },
        left: { opacity: 0, x: -100 },
        right: { opacity: 0, x: 100 },
        none: { opacity: 1, scale: 1, x: 0, y: 0 }
    };

    const animateVariants = {
        bottom: { opacity: 1, scale: 1, y: 0 },
        left: { opacity: 1, x: 0 },
        right: { opacity: 1, x: 0 },
        none: { opacity: 1, scale: 1, x: 0, y: 0 }
    };

    return (
        <motion.div
            className={cn("relative group", className)}
            initial={initialVariants[entryDirection]}
            animate={animateVariants[entryDirection]}
            transition={{
                type: "spring",
                stiffness: 200,
                damping: 15,
                delay: 0.2
            }}
            whileHover={{ scale: 1.02 }}
        >
            {/* 
        Ears with Variant Styling
        Updated: Control animate loop via state
      */}
            {/* 
        Ears with Variant Styling
        Updated: Use variants to isolate transitions properly
      */}
            {/* Left Ear */}
            <Ear
                position="left"
                variantConfig={currentVariant}
                size={earSize}
            >
                {leftEar}
            </Ear>

            {/* Right Ear */}
            <Ear
                position="right"
                variantConfig={currentVariant}
                size={earSize}
            >
                {rightEar}
            </Ear>

            {/* 
        Main Body
      */}
            <div className={cn(
                "relative z-10 border-4 border-black shadow-hard rounded-[3rem] p-10 flex flex-col items-center text-center text-slate-900 min-h-[300px] justify-center",
                currentVariant.faceColor
            )}>
                {/* Whiskers Container */}
                <div className="absolute top-1/2 w-full left-0 h-0 flex justify-between px-2 pointer-events-none">
                    {/* Left Whiskers */}
                    <div className="relative">
                        <Whisker rotate={10} />
                        <Whisker rotate={0} />
                        <Whisker rotate={-10} />
                    </div>
                    {/* Right Whiskers */}
                    <div className="relative">
                        <Whisker rotate={-10} right />
                        <Whisker rotate={0} right />
                        <Whisker rotate={10} right />
                    </div>
                </div>

                {children}
            </div>
        </motion.div>
    )
}
