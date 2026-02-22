import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Trash2, Pencil } from 'lucide-react';

const galleryItems = [
    {
        id: 1,
        title: 'Diaqnostika Otagi',
        image: 'https://images.unsplash.com/photo-1584515933487-779824d29309?q=80&w=1200&auto=format&fit=crop',
    },
    {
        id: 2,
        title: 'Emeliyyat Zali',
        image: 'https://images.unsplash.com/photo-1516549655669-df522f7c8f89?q=80&w=1200&auto=format&fit=crop',
    },
    {
        id: 3,
        title: 'Resepsn Sahesi',
        image: 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?q=80&w=1200&auto=format&fit=crop',
    },
];

export default function AdminGalleryPage() {
    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-slate-900">Qalereya Idareetmesi</h2>
                    <p className="text-slate-500">Klinikaya aid sekilleri elave edin, redakte edin ve silin.</p>
                </div>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                    <Plus className="w-4 h-4 mr-2" /> Yeni Sekil
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {galleryItems.map((item) => (
                    <Card key={item.id} className="overflow-hidden border-slate-200 shadow-sm">
                        <div className="relative aspect-[4/3] bg-slate-100">
                            <Image src={item.image} alt={item.title} fill className="object-cover" />
                        </div>
                        <CardContent className="p-4 space-y-3">
                            <p className="font-semibold text-slate-900">{item.title}</p>
                            <div className="flex items-center gap-2">
                                <Button variant="outline" size="sm">
                                    <Pencil className="w-4 h-4 mr-1" /> Redakte et
                                </Button>
                                <Button variant="outline" size="sm" className="text-red-600 border-red-200 hover:bg-red-50">
                                    <Trash2 className="w-4 h-4 mr-1" /> Sil
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
