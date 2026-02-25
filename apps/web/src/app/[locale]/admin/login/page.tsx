'use client';

import { useEffect, useState } from 'react';
import { useRouter } from '@/i18n/routing';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import Image from 'next/image';
import { getAdminRetryAfterSeconds, isAdminApiError, loginAdmin } from '@/lib/admin-api';

function isSafeAdminNextPath(nextPath: string | null): nextPath is string {
    if (!nextPath) {
        return false;
    }

    if (!nextPath.startsWith('/') || nextPath.startsWith('//')) {
        return false;
    }

    return /^\/(?:(az|en|ru)\/)?admin(\/|$)/.test(nextPath);
}

export default function AdminLoginPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [cooldownSeconds, setCooldownSeconds] = useState(0);

    // In a real app we would use react-hook-form + zod here
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    useEffect(() => {
        if (cooldownSeconds <= 0) {
            return;
        }

        const timer = window.setTimeout(() => {
            setCooldownSeconds((value) => Math.max(0, value - 1));
        }, 1000);

        return () => window.clearTimeout(timer);
    }, [cooldownSeconds]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (cooldownSeconds > 0) {
            return;
        }
        setIsLoading(true);
        setErrorMessage(null);

        try {
            await loginAdmin(email, password);
            const nextPath = searchParams.get('next');
            if (isSafeAdminNextPath(nextPath)) {
                window.location.assign(nextPath);
                return;
            }
            router.push('/admin/dashboard');
            router.refresh();
        } catch (error) {
            if (isAdminApiError(error)) {
                const retryAfterSeconds = getAdminRetryAfterSeconds(error);
                if (retryAfterSeconds && retryAfterSeconds > 0) {
                    setCooldownSeconds(retryAfterSeconds);
                }
                setErrorMessage(error.message);
                return;
            }

            const message =
                error instanceof Error
                    ? error.message
                    : 'Daxil olarkən xəta baş verdi.';
            setErrorMessage(message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center p-4 min-h-screen">
            <Card className="w-full max-w-md shadow-lg border-slate-200">
                <CardHeader className="space-y-3 pb-6 text-center">
                    <div className="flex justify-center mb-4">
                        <Image
                            src="/logo.png"
                            alt="Ultramed"
                            width={200}
                            height={58}
                            priority
                            className="h-14 w-auto"
                        />
                    </div>
                    <CardTitle className="text-2xl font-bold tracking-tight text-slate-900">
                        Ultramed Admin
                    </CardTitle>
                    <CardDescription className="text-sm text-slate-500">
                        Zəhmət olmasa, idarəetmə panelinə daxil olmaq üçün məlumatlarınızı daxil edin.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-sm font-medium text-slate-700">E-poçt ünvanı</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="ad@ultramed.az"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="h-11 border-slate-200 focus-visible:ring-brand-blue"
                            />
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password" className="text-sm font-medium text-slate-700">Şifrə</Label>
                                <span className="text-sm font-medium text-slate-400 cursor-not-allowed">Şifrəni unutmusunuz?</span>
                            </div>
                            <Input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="h-11 border-slate-200 focus-visible:ring-brand-blue"
                            />
                        </div>
                        {errorMessage ? (
                            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
                                {errorMessage}
                            </p>
                        ) : null}
                        <Button
                            type="submit"
                            className="w-full h-11 bg-brand-orange hover:bg-brand-orange-dark text-white mt-6 rounded-lg text-sm font-medium transition-colors"
                            disabled={isLoading || cooldownSeconds > 0}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Daxil olunur...
                                </>
                            ) : cooldownSeconds > 0 ? (
                                `Yeniden cehd: ${cooldownSeconds}s`
                            ) : (
                                "Sistemə daxil ol"
                            )}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex justify-center border-t border-slate-100 pt-6 pb-2">
                    <p className="text-xs text-slate-400">
                        &copy; {new Date().getFullYear()} Ultramed Klinika İdarəetmə Sistemi
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
}
