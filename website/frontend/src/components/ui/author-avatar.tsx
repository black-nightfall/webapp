/* eslint-disable @next/next/no-img-element */
import { cn } from "@/lib/utils";

interface AuthorAvatarProps {
    name: string;
    avatar?: string;
    className?: string;
}

export function AuthorAvatar({ name, avatar, className }: AuthorAvatarProps) {
    const src = avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`;

    return (
        <img
            src={src}
            alt={name}
            className={cn("rounded-full border-2 border-black bg-white object-cover", className)}
        />
    );
}
