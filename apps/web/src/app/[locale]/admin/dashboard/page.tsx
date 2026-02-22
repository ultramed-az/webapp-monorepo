import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Calendar, DollarSign, Activity, TrendingUp, FileText } from 'lucide-react';

export default function AdminDashboard() {
    // Note: To use Next Intl in app/[locale]/... page components that are server components,
    // we should use the async getTranslations rather than useTranslations for better performance,
    // but useTranslations works fine in client components.

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-slate-900">Dashboard</h2>
                    <p className="text-slate-500">Klinika idarəetmə panelinə xoş gəlmisiniz.</p>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Card className="hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500">Ümumi Pasiyent</CardTitle>
                        <Users className="h-4 w-4 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-slate-900">14,231</div>
                        <p className="text-xs text-green-600 flex items-center mt-1 font-medium">
                            <TrendingUp className="h-3 w-3 mr-1" />
                            +20.1% ötən aydan
                        </p>
                    </CardContent>
                </Card>
                <Card className="hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500">Bugünkü Qəbullar</CardTitle>
                        <Calendar className="h-4 w-4 text-orange-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-slate-900">+42</div>
                        <p className="text-xs text-green-600 flex items-center mt-1 font-medium">
                            <TrendingUp className="h-3 w-3 mr-1" />
                            +5% ötən gündən
                        </p>
                    </CardContent>
                </Card>
                <Card className="hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500">Gəlir (Bu Ay)</CardTitle>
                        <DollarSign className="h-4 w-4 text-emerald-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-slate-900">₼45,231.89</div>
                        <p className="text-xs text-green-600 flex items-center mt-1 font-medium">
                            <TrendingUp className="h-3 w-3 mr-1" />
                            +19% ötən aydan
                        </p>
                    </CardContent>
                </Card>
                <Card className="hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500">Aktiv Həkimlər</CardTitle>
                        <Activity className="h-4 w-4 text-rose-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-slate-900">24</div>
                        <p className="text-xs text-slate-500 mt-1">
                            növbədə olan mütəxəssislər
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Quick Actions & Recent Activity area can go here */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4 lg:col-span-4 hover:shadow-md transition-shadow border-slate-200">
                    <CardHeader>
                        <CardTitle className="text-lg">Son Qəbullar</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <div key={i} className="flex items-center justify-between border-b border-slate-100 last:border-0 pb-4 last:pb-0">
                                    <div className="flex items-center gap-4">
                                        <div className="h-9 w-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-medium text-sm">
                                            {`P${i}`}
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-slate-900">Pasiyent Adı {i}</p>
                                            <p className="text-xs text-slate-500">Kardiologiya - Dr. Əliyev</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-medium text-slate-900">14:{i}0</p>
                                        <p className="text-xs text-amber-600 font-medium bg-amber-50 px-2 py-0.5 rounded border border-amber-100 mt-1">Gözləyir</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card className="col-span-4 lg:col-span-3 hover:shadow-md transition-shadow border-slate-200">
                    <CardHeader>
                        <CardTitle className="text-lg">Sürətli Əməliyyatlar</CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-4">
                        <div className="flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 cursor-pointer transition-colors group">
                            <div className="flex items-center gap-4">
                                <div className="p-2 bg-blue-100 text-blue-600 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                    <Calendar className="h-5 w-5" />
                                </div>
                                <div className="font-medium text-sm text-slate-900">Yeni Qəbul Yarat</div>
                            </div>
                        </div>
                        <div className="flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 cursor-pointer transition-colors group">
                            <div className="flex items-center gap-4">
                                <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                                    <Users className="h-5 w-5" />
                                </div>
                                <div className="font-medium text-sm text-slate-900">Pasiyent Əlavə Et</div>
                            </div>
                        </div>
                        <div className="flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 cursor-pointer transition-colors group">
                            <div className="flex items-center gap-4">
                                <div className="p-2 bg-purple-100 text-purple-600 rounded-lg group-hover:bg-purple-600 group-hover:text-white transition-colors">
                                    <FileText className="h-5 w-5" />
                                </div>
                                <div className="font-medium text-sm text-slate-900">Hesabat Çıxart</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
