import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AdminDashboard() {
    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-slate-900">Dashboard</h2>
                    <p className="text-slate-500">Klinika idarəetmə panelinə xoş gəlmisiniz.</p>
                </div>
            </div>

            <div>
                <Card className="hover:shadow-md transition-shadow border-slate-200">
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
                                        <p className="text-xs text-brand-orange-dark font-medium bg-brand-orange/10 px-2 py-0.5 rounded border border-brand-orange/20 mt-1">Gözləyir</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
