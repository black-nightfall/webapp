"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { motion, HTMLMotionProps } from "framer-motion"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
    "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-bold ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border-4 border-black",
    {
        variants: {
            variant: {
                default: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[4px] active:translate-y-[4px]",
                destructive:
                    "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[4px] active:translate-y-[4px]",
                outline:
                    "bg-background text-foreground hover:bg-accent hover:text-accent-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[4px] active:translate-y-[4px]",
                secondary:
                    "bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[4px] active:translate-y-[4px]",
                ghost: "hover:bg-accent hover:text-accent-foreground border-transparent shadow-none hover:shadow-none hover:translate-none",
                link: "text-primary underline-offset-4 hover:underline border-none shadow-none",
            },
            size: {
                default: "h-12 px-6 py-3",
                sm: "h-10 rounded-lg px-4",
                lg: "h-14 rounded-2xl px-10 text-lg",
                icon: "h-12 w-12",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
)

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
    asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, asChild = false, ...props }, ref) => {
        const Comp = asChild ? Slot : "button"

        // For motion, we might need to wrap or use motion.button if not using asChild.
        // However, for simplicity with Shadcn, we can use CSS transitions for the shadows/translate as defined in variants.
        // But prompt asks for "Bouncy & Squishy". Framer motion tap scale is good for that.

        if (asChild) {
            return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
        }

        return (
            <Comp
                className={cn(buttonVariants({ variant, size, className }))}
                ref={ref}
                {...props}
            />
        )
    }
)
Button.displayName = "Button"

// Create a Motion version if needed specifically for extra bounce
export const MotionButton = motion.create(Button)

export { Button, buttonVariants }
