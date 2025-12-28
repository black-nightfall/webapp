"use client";

import { motion, useScroll, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import { Home } from "lucide-react";

interface StickyHeaderProps {
    title: string;
    actionLink: string;
    actionLabel: string;
    backLink?: string;
    backLabel?: string;
    className?: string; // Allow customizing the background for variety if needed
}

export function StickyHeader({
    title,
    actionLink,
    actionLabel,
    backLink = "/",
    backLabel = "Home",
    className
}: StickyHeaderProps) {
    const { scrollY } = useScroll();
    const [isVisible, setIsVisible] = useState(false);

    // Use a motion value listener to update state avoiding re-renders on every scroll pixel
    useEffect(() => {
        return scrollY.on("change", (latest) => {
            const show = latest > 300; // Show after scrolling down 300px
            if (show !== isVisible) {
                setIsVisible(show);
            }
        });
    }, [scrollY, isVisible]);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ y: -100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -100, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className={cn(
                        "fixed top-0 left-0 right-0 z-50 h-20 px-4 md:px-8",
                        "flex items-center justify-between",
                        "bg-white border-b-4 border-black shadow-hard",
                        className
                    )}
                >
                    <div className="flex items-center">
                        <h2 className="text-xl md:text-2xl font-bold truncate max-w-[200px] md:max-w-none">
                            {title}
                        </h2>
                    </div>

                    <div className="flex gap-2 md:gap-4">
                        <Button asChild size="sm" variant="outline" className="px-2 md:px-4 bg-white text-black border-2 border-black hover:bg-slate-100">
                            <Link href={backLink}>
                                <Home className="w-5 h-5 md:hidden" />
                                <span className="hidden md:inline">{backLabel}</span>
                            </Link>
                        </Button>
                        <Button asChild size="sm" className="bg-pink-400 hover:bg-pink-500 text-white">
                            <Link href={actionLink}>{actionLabel}</Link>
                        </Button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
