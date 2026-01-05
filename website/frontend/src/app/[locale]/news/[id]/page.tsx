import { NewsService } from "@/features/news/service";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { getTranslations } from "next-intl/server";

interface Props {
    params: Promise<{ id: string; locale: string }>;
}

export async function generateMetadata(props: Props) {
    const { id } = await props.params;
    const news = await NewsService.getNewsById(id);

    if (!news) {
        return {
            title: 'Not Found'
        };
    }

    return {
        title: news.title,
        description: news.summary
    };
}

export default async function NewsDetailPage(props: Props) {
    const { id, locale } = await props.params;
    const news = await NewsService.getNewsById(id);
    const t = await getTranslations({ locale, namespace: 'News' });

    if (!news) {
        notFound();
    }

    return (
        <div className="container mx-auto p-8 min-h-screen max-w-4xl">
            <Button asChild variant="outline" className="mb-8">
                <Link href="/news">← {t('title')}</Link>
            </Button>

            <article className="neobrutalism-border bg-white p-8 rounded-3xl shadow-hard">
                <div className="flex gap-4 mb-6">
                    <span className="px-3 py-1 bg-secondary text-secondary-foreground font-bold border-2 border-black rounded-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] uppercase text-sm">
                        {news.tags[0]}
                    </span>
                    <span className="flex items-center text-muted-foreground font-mono">
                        {news.date}
                    </span>
                </div>

                <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                    {news.title}
                </h1>

                {news.imageUrl && (
                    <div className="aspect-video w-full rounded-2xl border-4 border-black mb-8 overflow-hidden shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={news.imageUrl} alt={news.title} className="w-full h-full object-cover" />
                    </div>
                )}

                <div className="prose prose-xl prose-stone max-w-none text-lg leading-relaxed font-medium">
                    <p>{news.content}</p>
                    <p className="text-muted-foreground italic mt-8">
                        Written by {news.author}
                    </p>
                </div>
            </article>
        </div>
    );
}
