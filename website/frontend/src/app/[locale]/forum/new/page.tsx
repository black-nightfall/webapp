import { getTranslations } from "next-intl/server";
import { CatContainer } from "@/components/ui/cat-container";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import { Input } from "@/components/ui/input";
import { PageTransition } from "@/components/layout/page-transition";
import { NeoField } from "@/components/ui/neo-field";

export async function generateMetadata(props: { params: Promise<{ locale: string }> }) {
    const { locale } = await props.params;
    const t = await getTranslations({ locale, namespace: 'Forum.create' });

    return {
        title: t('title')
    };
}

export default async function CreateForumPostPage(props: { params: Promise<{ locale: string }> }) {
    const { locale } = await props.params;
    const t = await getTranslations({ locale, namespace: 'Forum.create' });

    return (
        <div className="container mx-auto p-4 md:p-8 min-h-screen flex items-center justify-center">
            <PageTransition direction="bottom" className="w-full max-w-2xl">
                <CatContainer className="bg-white w-full" variant="calico" entryDirection="bottom">
                    <div className="flex justify-between items-center mb-6 border-b-2 border-black/10 pb-4">
                        <h1 className="text-3xl font-bold text-slate-900">{t('title')}</h1>
                        <Button asChild variant="outline" size="sm">
                            <Link href="/forum">{t('form.back')}</Link>
                        </Button>
                    </div>

                    <p className="text-lg text-slate-600 mb-8 font-medium">{t('description')}</p>

                    <form className="space-y-6 text-left">
                        <NeoField label={t('form.title')}>
                            <Input placeholder="Meow?" className="bg-slate-50" />
                        </NeoField>

                        <NeoField label={t('form.category')}>
                            <select className="flex h-12 w-full rounded-xl border-4 border-black bg-slate-50 px-3 py-2 text-sm font-bold shadow-hard focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                                <option>General</option>
                                <option>Help</option>
                                <option>Showcase</option>
                                <option>Funny</option>
                            </select>
                        </NeoField>

                        <NeoField label={t('form.content')}>
                            <textarea
                                className="flex min-h-[150px] w-full rounded-xl border-4 border-black bg-slate-50 px-3 py-2 text-sm font-bold shadow-hard focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-y"
                                placeholder="..."
                            />
                        </NeoField>

                        <div className="pt-4 flex justify-end">
                            <Button className="w-full md:w-auto bg-yellow-400 hover:bg-yellow-500 text-black min-w-[200px]">
                                {t('form.submit')}
                            </Button>
                        </div>
                    </form>

                </CatContainer>
            </PageTransition>
        </div>
    );
}
