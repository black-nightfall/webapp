import { ForumService } from "@/features/forum/service";
import { ForumList } from "@/features/forum/components/ForumList";
import { getTranslations } from "next-intl/server";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import { CatContainer } from "@/components/ui/cat-container";
import { PageTransition } from "@/components/layout/page-transition";
import { StickyHeader } from "@/components/layout/sticky-header";

export async function generateMetadata(props: { params: Promise<{ locale: string }> }) {
    const { locale } = await props.params;
    const t = await getTranslations({ locale, namespace: 'Forum' });

    return {
        title: t('title')
    };
}

export default async function ForumPage(props: { params: Promise<{ locale: string }> }) {
    await props.params;
    const posts = await ForumService.getLatestPosts();
    const { locale } = await props.params;
    const t = await getTranslations({ locale, namespace: 'Forum' });

    return (
        <div className="container mx-auto p-4 md:p-8 min-h-screen">
            <StickyHeader
                title={t('title')}
                actionLink="/forum/new"
                actionLabel={t('createPost')}
            />

            <PageTransition direction="right">
                <div className="flex flex-col items-center mb-12">
                    <CatContainer className="mb-8 w-full max-w-2xl bg-white" entryDirection="right">
                        <h1 className="text-4xl font-bold mb-4">{t('title')}</h1>
                        <p className="text-xl font-medium mb-6 text-slate-600">{t('description')}</p>
                        <div className="flex gap-4 justify-center">
                            <Button asChild>
                                <Link href="/forum/new">{t('createPost')}</Link>
                            </Button>
                            <Button asChild variant="outline">
                                <Link href="/">{t('backHome')}</Link>
                            </Button>
                        </div>
                    </CatContainer>
                </div>

                <ForumList posts={posts} />
            </PageTransition>
        </div>
    );
}
