import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

export default function AdminTermsPage() {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold tracking-tight text-slate-900">Istifade Sertleri (Admin)</h2>
                <p className="text-slate-500">Saytda gosterilen istifade sertlerini buradan idare edin.</p>
            </div>

            <Card className="border-slate-200 shadow-sm">
                <CardHeader>
                    <CardTitle>Metn Redaktoru</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Textarea
                        className="min-h-[360px]"
                        defaultValue={`1. Umumi sertler\n2. Qebul qaydalari\n3. Mesuliyyetin mehdudlasdirilmasi\n\nBu metn admin terefden redakte oluna biler.`}
                    />
                    <div className="flex items-center gap-3">
                        <Button className="bg-blue-600 hover:bg-blue-700 text-white">Deyisiklikleri Yadda Saxla</Button>
                        <Button variant="outline">Onbaxis</Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
