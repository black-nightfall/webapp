import { cn } from "@/lib/utils";

interface CategoryTagProps {
    category: string;
    className?: string;
}

export function CategoryTag({ category, className }: CategoryTagProps) {
    return (
        <span className={cn(
            "px-2 py-1 text-xs font-bold border-2 border-black rounded-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] uppercase bg-white text-slate-900",
            category === 'Health' && "bg-blue-100",
            category === 'Cute' && "bg-pink-100",
            category === 'Training' && "bg-yellow-100",
            category === 'General' && "bg-slate-100",
            category === 'Help' && "bg-purple-100",
            category === 'Showcase' && "bg-green-100",
            category === 'Funny' && "bg-orange-100",
            className
        )}>
            {category}
        </span>
    );
}
