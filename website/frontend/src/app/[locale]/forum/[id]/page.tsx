import { ForumService } from "@/features/forum/service";
import { getTranslations } from "next-intl/server";
import { CatContainer, CatVariant } from "@/components/ui/cat-container";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import { PageTransition } from "@/components/layout/page-transition";
import { Heart, MessageCircle, Share2, ArrowLeft } from "lucide-react";
import { AuthorAvatar } from "@/components/ui/author-avatar";
import { CategoryTag } from "@/components/ui/category-tag";

export async function generateMetadata(props: { params: Promise<{ locale: string; id: string }> }) {
    const { id } = await props.params; // Get ID first to fetch data if we were real
    // In a real app we'd fetch title here. For now just generic.
    const { locale } = await props.params;
    const t = await getTranslations({ locale, namespace: 'Forum' });

    return {
        title: `${t('title')} - ${id}`
    };
}

export default async function ForumDetailPage(props: { params: Promise<{ locale: string; id: string }> }) {
    const { id, locale } = await props.params;
    const t = await getTranslations({ locale, namespace: 'Forum.detail' });

    // Simulate fetching a specific post
    const allPosts = await ForumService.getLatestPosts();
    const post = allPosts.find(p => p.id === id) || allPosts[0]; // Fallback for demo

    // Deterministic variant
    const variants: CatVariant[] = ['british', 'orange', 'tuxedo', 'calico', 'white'];
    const hash = post.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const variant = variants[hash % variants.length];

    return (
        <div className="container mx-auto p-4 md:p-8 min-h-screen flex justify-center">
            <PageTransition direction="bottom" className="w-full max-w-4xl">
                <div className="mb-6">
                    <Button asChild variant="ghost" className="gap-2">
                        <Link href="/forum">
                            <ArrowLeft className="w-4 h-4" />
                            {t('back')}
                        </Link>
                    </Button>
                </div>

                <CatContainer className="bg-white min-h-[500px]" variant={variant} earSize="large">
                    {/* Header */}
                    <div className="flex justify-between items-start mb-8 w-full border-b-2 border-black/10 pb-6">
                        <div className="flex items-center gap-4">
                            <AuthorAvatar name={post.author.name} avatar={post.author.avatar} className="w-16 h-16 border-4" />
                            <div className="text-left">
                                <p className="font-bold text-lg text-slate-900">{post.author.name}</p>
                                <p className="text-sm text-slate-500">{post.date}</p>
                            </div>
                        </div>
                        <CategoryTag category={post.category} />
                    </div>

                    {/* Content */}
                    <div className="text-left w-full mb-8 flex-grow">
                        <h1 className="text-3xl md:text-4xl font-bold mb-6 text-slate-900 leading-tight">
                            {post.isHot && <span className="mr-2">🔥</span>}
                            {post.title}
                        </h1>
                        <div className="prose prose-lg prose-slate max-w-none">
                            <p>{post.content}</p>
                            <p>
                                (Simulated long content placeholder: Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                                Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
                                quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.)
                            </p>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="mt-8 w-full flex gap-6 pt-6 border-t-2 border-dashed border-black/20 text-slate-800 justify-center">
                        <button className="flex flex-col items-center gap-2 group">
                            <div className="p-4 rounded-full bg-pink-100 border-2 border-black group-hover:scale-110 transition-transform">
                                <Heart className="w-6 h-6 text-pink-500 fill-pink-500" />
                            </div>
                            <span className="font-bold">{post.likes}</span>
                        </button>
                        <button className="flex flex-col items-center gap-2 group">
                            <div className="p-4 rounded-full bg-blue-100 border-2 border-black group-hover:scale-110 transition-transform">
                                <Share2 className="w-6 h-6 text-blue-500" />
                            </div>
                            <span className="font-bold">Share</span>
                        </button>
                    </div>

                    {/* Comments Section (Stub) */}
                    <div className="w-full mt-12 text-left bg-slate-50 p-6 rounded-2xl border-2 border-black/5">
                        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <MessageCircle className="w-5 h-5" />
                            {t('comments')} ({post.comments})
                        </h3>
                        <div className="space-y-4">
                            <div className="p-4 bg-white rounded-xl border border-slate-200">
                                <p className="text-sm font-bold mb-1">HappyUser123</p>
                                <p className="text-slate-600">So cute! Thanks for sharing.</p>
                            </div>
                            <div className="p-4 bg-white rounded-xl border border-slate-200">
                                <p className="text-sm font-bold mb-1">DogLover99</p>
                                <p className="text-slate-600">Great tips!</p>
                            </div>
                        </div>
                    </div>

                </CatContainer>
            </PageTransition>
        </div>
    );
}
