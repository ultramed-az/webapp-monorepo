import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const testimonials = [
    { id: 1, author: 'Nigar Hasanli', text: 'Xidmet keyfiyyeti cox yuksekdir.', status: 'published' },
    { id: 2, author: 'Samir Aliyev', text: 'Qebul prosesi cox rahat idi.', status: 'draft' },
    { id: 3, author: 'Aysel Memmedova', text: 'Hekimler cox pesekardir.', status: 'published' },
];

export default function AdminTestimonialsPage() {
    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-slate-900">Reyler Idareetmesi</h2>
                    <p className="text-slate-500">Pasiyent reylerini moderasiya edin ve saytda gosterisini idare edin.</p>
                </div>
                <Button className="bg-brand-orange hover:bg-brand-orange-dark text-white">Yeni Rey Elave Et</Button>
            </div>

            <Card className="border-slate-200 shadow-sm">
                <CardHeader>
                    <CardTitle>Rey Siyahisi</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {testimonials.map((item) => (
                        <div key={item.id} className="rounded-xl border border-slate-200 p-4 bg-white">
                            <div className="flex items-center justify-between gap-3 mb-2">
                                <h3 className="font-semibold text-slate-900">{item.author}</h3>
                                <Badge variant="secondary" className={item.status === 'published' ? 'bg-brand-blue-soft text-brand-blue' : 'bg-brand-orange/15 text-brand-orange-dark'}>
                                    {item.status === 'published' ? 'Yayimlanib' : 'Qaralama'}
                                </Badge>
                            </div>
                            <p className="text-slate-600 mb-3">{item.text}</p>
                            <div className="flex items-center gap-2">
                                <Button size="sm" variant="outline">Redakte et</Button>
                                <Button size="sm" variant="outline" className="text-red-600 border-red-200 hover:bg-red-50">Sil</Button>
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>
        </div>
    );
}
