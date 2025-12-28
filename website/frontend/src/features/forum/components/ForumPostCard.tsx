import { ForumPost } from "../schema";
import { CatContainer, CatVariant } from "@/components/ui/cat-container";
import { Heart, MessageCircle } from "lucide-react";
import { Link } from "@/i18n/routing";
import { AuthorAvatar } from "@/components/ui/author-avatar";
import { CategoryTag } from "@/components/ui/category-tag";
import { Button } from "@/components/ui/button";

interface ForumPostCardProps {
    post: ForumPost;
}

export function ForumPostCard({ post }: ForumPostCardProps) {
    // Deterministic variant based on post ID (so it doesn't change on hydration/render)
    const variants: CatVariant[] = ['british', 'orange', 'tuxedo', 'calico', 'white'];
    // Simple hash function for numbers/strings
    const hash = post.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const variant = variants[hash % variants.length];

    return (
        <Link href={`/forum/${post.id}`} className="block h-full group/card">
            <CatContainer
                className="h-full min-h-[250px] p-6 transition-transform hover:-translate-y-1"
                variant={variant}
                earSize="small"
            >
                <div className="flex justify-between items-start mb-4 w-full">
                    <div className="flex items-center gap-3">
                        <AuthorAvatar name={post.author.name} avatar={post.author.avatar} className="w-10 h-10" />
                        <div className="text-left">
                            <p className="font-bold text-sm text-slate-900">{post.author.name}</p>
                            <p className="text-xs text-slate-500">{post.date}</p>
                        </div>
                    </div>
                    <CategoryTag category={post.category} />
                </div>

                <div className="text-left w-full mb-6 flex-grow">
                    <h3 className="text-xl font-bold mb-2 flex items-center gap-2 text-slate-900">
                        {post.isHot && <span className="text-red-500">🔥</span>}
                        {post.title}
                    </h3>
                    <p className="text-slate-600 text-sm line-clamp-3">{post.content}</p>
                </div>

                <div className="mt-auto w-full flex gap-4 pt-4 border-t-2 border-dashed border-black/20 text-slate-800">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="flex items-center gap-1 text-sm font-bold hover:text-pink-500 hover:bg-transparent px-0 border-none shadow-none"
                    >
                        <Heart className="w-5 h-5 group-hover/btn:scale-110 transition-transform" />
                        {post.likes}
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="flex items-center gap-1 text-sm font-bold hover:text-blue-500 hover:bg-transparent px-0 border-none shadow-none"
                    >
                        <MessageCircle className="w-5 h-5" />
                        {post.comments}
                    </Button>
                </div>
            </CatContainer>
        </Link>
    );
}
