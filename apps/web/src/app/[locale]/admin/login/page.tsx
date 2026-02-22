'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/routing';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { HeartPulse, Loader2 } from 'lucide-react';

export default function AdminLoginPage() {
    const t = useTranslations('Admin');
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    // In a real app we would use react-hook-form + zod here
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
            // Redirect to dashboard after "successful" login
            router.push('/admin/dashboard');
        }, 1500);
    };

    return (
        <div className="flex items-center justify-center p-4 min-h-screen">
            <Card className="w-full max-w-md shadow-lg border-slate-200">
                <CardHeader className="space-y-3 pb-6 text-center">
                    <div className="flex justify-center mb-4">
                        <div className="bg-blue-600 p-3 rounded-xl shadow-sm">
                            <HeartPulse className="w-8 h-8 text-white" />
                        </div>
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
                                className="h-11 border-slate-200 focus-visible:ring-blue-500"
                            />
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password" className="text-sm font-medium text-slate-700">Şifrə</Label>
                                <a href="#" className="text-sm font-medium text-blue-600 hover:underline">Şifrəni unutmusunuz?</a>
                            </div>
                            <Input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="h-11 border-slate-200 focus-visible:ring-blue-500"
                            />
                        </div>
                        <Button
                            type="submit"
                            className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white mt-6 rounded-lg text-sm font-medium transition-colors"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Daxil olunur...
                                </>
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
