"use client"

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { CatContainer } from '@/components/ui/cat-container';
import { NeoField } from '@/components/ui/neo-field';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';

const registerSchema = z.object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(6),
    confirmPassword: z.string().min(6),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterPage() {
    const t = useTranslations('Auth');
    const router = useRouter();

    const { register, handleSubmit, formState: { errors } } = useForm<RegisterForm>({
        resolver: zodResolver(registerSchema),
    });

    const onSubmit = (data: RegisterForm) => {
        console.log('Register data:', data);
        // Simulating registration
        router.push('/login');
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-background overflow-hidden relative p-4">

            {/* Back Button */}
            <div className="absolute top-6 left-6 z-50">
                <Button asChild size="sm" variant="outline" className="bg-white">
                    <Link href="/">{t('noAccount').split('?')[0]}?</Link>
                </Button>
            </div>

            <CatContainer
                className="max-w-md w-full"
                variant="calico"
                entryDirection="bottom"
                earSize="small"
                leftEar={<span className="text-2xl">📝</span>}
                rightEar={<span className="text-2xl">🐾</span>}
            >
                <h1 className="text-3xl font-bold mb-2">{t('joinUs')}</h1>
                <p className="text-lg font-medium mb-6 text-muted-foreground">{t('register')}</p>

                <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-4">
                    <NeoField
                        label={t('name')}
                        error={errors.name?.message}
                    >
                        <input
                            {...register('name')}
                            type="text"
                            className="w-full h-12 px-4 rounded-xl border-4 border-black shadow-none bg-white focus:outline-none focus:translate-x-[2px] focus:translate-y-[2px] transition-all"
                            placeholder="Kitty Perry"
                        />
                    </NeoField>

                    <NeoField
                        label={t('email')}
                        error={errors.email?.message}
                    >
                        <input
                            {...register('email')}
                            type="email"
                            className="w-full h-12 px-4 rounded-xl border-4 border-black shadow-none bg-white focus:outline-none focus:translate-x-[2px] focus:translate-y-[2px] transition-all"
                            placeholder="meow@example.com"
                        />
                    </NeoField>

                    <NeoField
                        label={t('password')}
                        error={errors.password?.message}
                    >
                        <input
                            {...register('password')}
                            type="password"
                            className="w-full h-12 px-4 rounded-xl border-4 border-black shadow-none bg-white focus:outline-none focus:translate-x-[2px] focus:translate-y-[2px] transition-all"
                            placeholder="••••••••"
                        />
                    </NeoField>

                    <NeoField
                        label={t('confirmPassword')}
                        error={errors.confirmPassword?.message}
                    >
                        <input
                            {...register('confirmPassword')}
                            type="password"
                            className="w-full h-12 px-4 rounded-xl border-4 border-black shadow-none bg-white focus:outline-none focus:translate-x-[2px] focus:translate-y-[2px] transition-all"
                            placeholder="••••••••"
                        />
                    </NeoField>

                    <Button type="submit" size="lg" className="w-full bg-orange-400 hover:bg-orange-500 text-white mt-4">
                        {t('submitRegister')}
                    </Button>
                </form>

                <div className="mt-6">
                    <Link href="/login" className="text-sm font-bold hover:underline">
                        {t('haveAccount')}
                    </Link>
                </div>

            </CatContainer>
        </div>
    );
}
