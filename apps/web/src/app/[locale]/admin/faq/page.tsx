import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const faqItems = [
    { id: 1, question: 'Qebula nece yazilim?', category: 'Qebul', status: 'active' },
    { id: 2, question: 'Sigorta xidmeti varmi?', category: 'Odenis', status: 'active' },
    { id: 3, question: 'Analiz neticeleri ne vaxt hazir olur?', category: 'Laboratoriya', status: 'draft' },
];

export default function AdminFaqPage() {
    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-slate-900">FAQ Idareetmesi</h2>
                    <p className="text-slate-500">Tez-tez sorusulan suallari redakte edin ve prioritetlesdirin.</p>
                </div>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">Yeni Sual Elave Et</Button>
            </div>

            <Card className="border-slate-200 shadow-sm">
                <CardHeader>
                    <CardTitle>FAQ Siyahisi</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    {faqItems.map((item) => (
                        <div key={item.id} className="rounded-lg border border-slate-200 p-4 bg-white flex items-center justify-between gap-4">
                            <div>
                                <p className="font-medium text-slate-900">{item.question}</p>
                                <p className="text-sm text-slate-500">Kateqoriya: {item.category}</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className={`text-xs px-2 py-1 rounded-full ${item.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                                    {item.status === 'active' ? 'Aktiv' : 'Qaralama'}
                                </span>
                                <Button size="sm" variant="outline">Redakte et</Button>
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>
        </div>
    );
}
