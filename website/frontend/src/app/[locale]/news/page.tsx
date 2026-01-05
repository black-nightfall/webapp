import { NewsService } from "@/features/news/service";
import { NewsList } from "@/features/news/components/NewsList";
import { getTranslations } from "next-intl/server";
import { PageTransition } from "@/components/layout/page-transition";
import { CatContainer } from "@/components/ui/cat-container";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import { StickyHeader } from "@/components/layout/sticky-header";

export async function generateMetadata(props: { params: Promise<{ locale: string }> }) {
    const { locale } = await props.params;
    const t = await getTranslations({ locale, namespace: 'News' });

    return {
        title: t('title')
    };
}

export default async function NewsPage(props: { params: Promise<{ locale: string }> }) {
    await props.params; // Ensure params are available
    const news = await NewsService.getLatestNews();
    const { locale } = await props.params;
    const t = await getTranslations({ locale, namespace: 'News' });

    return (
        <div className="container mx-auto p-4 md:p-8 min-h-screen">
            <StickyHeader
                title={t('title')}
                actionLink="/news/new"
                actionLabel={t('createPost')}
            />

            <PageTransition direction="left">
                <div className="flex flex-col items-center mb-12">
                    <CatContainer className="mb-8 w-full max-w-2xl bg-white" entryDirection="left" variant="orange">
                        <h1 className="text-4xl font-bold mb-4">{t('title')}</h1>
                        <p className="text-xl font-medium mb-6 text-slate-600">{t('create.description')}</p>
                        <div className="flex gap-4 justify-center">
                            <Button asChild>
                                <Link href="/news/new">{t('createPost')}</Link>
                            </Button>
                            <Button asChild variant="outline">
                                <Link href="/">{t('backHome')}</Link>
                            </Button>
                        </div>
                    </CatContainer>
                </div>

                <NewsList items={news} />
            </PageTransition>
        </div>
    );
}
