'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, MapPin, Calendar, HeartPulse } from 'lucide-react';
import Image from 'next/image';

const doctorsList = [
    {
        id: 1,
        name: 'Dr. Əli Vəliyev',
        specialty: 'Kardiologiya üzrə Uzman',
        image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=3400&auto=format&fit=crop',
        experience: '15 il',
        education: 'Ege Universiteti, Tibb Fakültəsi',
        tags: ['Aritmiya', 'Ürək Çatışmazlığı', 'EKQ']
    },
    {
        id: 2,
        name: 'Dr. Aysel Məmmədova',
        specialty: 'Uzman Nevroloq',
        image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=3400&auto=format&fit=crop',
        experience: '8 il',
        education: 'Azərbaycan Tibb Universiteti',
        tags: ['Miqren', 'Epilepsiya', 'Yuxu Pozuntuları']
    },
    {
        id: 3,
        name: 'Dr. Rəşad Hüseynov',
        specialty: 'Cərrah Stomatoloq',
        image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=3400&auto=format&fit=crop',
        experience: '12 il',
        education: 'Hacettepe Universiteti, Diş Həkimliyi',
        tags: ['İmplantologiya', 'Ağız Tiktərəhi Cərrahiyyə', 'Estetik']
    },
    {
        id: 4,
        name: 'Dr. Leyla Quliyeva',
        specialty: 'Pediatr',
        image: 'https://images.unsplash.com/photo-1594824436998-dd1bd3eb073d?q=80&w=3400&auto=format&fit=crop',
        experience: '5 il',
        education: 'İstanbul Universiteti, Cərrahpaşa Tibb Fakültəsi',
        tags: ['Yenidoğulmuşların İzlənməsi', 'Peyvənd Təqvimi', 'Uşaq Qidalanması']
    },
    {
        id: 5,
        name: 'Dr. Rəhman Qasımlı',
        specialty: 'Oftalmoloq Cərrah',
        image: 'https://images.unsplash.com/photo-1537368910025-702800a4bd8f?q=80&w=3400&auto=format&fit=crop',
        experience: '20 il',
        education: 'Milli Oftalmologiya Mərkəzi',
        tags: ['Katarakta', 'Qlaukoma Xirurgiyası', 'Lazer Korreksiyası']
    },
    {
        id: 6,
        name: 'Dr. Nərmin Abbasova',
        specialty: 'Ginekoloq - Cərrah',
        image: 'https://images.unsplash.com/photo-1527613426441-4da17471b66d?q=80&w=3400&auto=format&fit=crop',
        experience: '10 il',
        education: 'Ankara Universiteti, Tibb Fakültəsi',
        tags: ['Hamiləlik Təqibi', 'Laparoskopik Cərrahiyyə', 'Sonsuzluq']
    }
];

export default function DoctorsPage() {
    const t = useTranslations('Doctors');
    const [searchQuery, setSearchQuery] = useState('');

    const filteredDoctors = doctorsList.filter(doc =>
        doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    return (
        <div className="flex flex-col min-h-screen">
            {/* Header */}
            <section className="bg-slate-50 py-16 lg:py-24 relative overflow-hidden">
                <div className="container mx-auto px-6 relative z-10 text-center">
                    <div className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur border border-blue-100 text-blue-700 font-medium px-4 py-2 rounded-full text-sm mb-6 shadow-sm">
                        <HeartPulse className="h-4 w-4" />
                        <span>Ultramed Komandası</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">
                        Peşəkar Həkimlərimiz
                    </h1>
                    <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
                        Tibb sahəsində aparıcı təhsil ocaqlarında ixtisaslaşmış, uzun illərin təcrübəsinə malik həkimlərimiz sizin sağlamlığınız üçün ən düzgün diaqnoz və müalicəni təklif edir.
                    </p>

                    {/* Search Field */}
                    <div className="mt-10 max-w-md mx-auto relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                        </div>
                        <Input
                            type="text"
                            placeholder="Həkimin adı, şöbəsi və ya xəstəlik üzrə axtarış..."
                            className="pl-12 pr-4 py-6 w-full rounded-2xl border-slate-200 shadow-sm focus-visible:ring-blue-500 focus-visible:ring-offset-2 text-[15px] transition-shadow"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
            </section>

            {/* Doctors Grid */}
            <section className="py-20 bg-white flex-grow border-t border-slate-100">
                <div className="container mx-auto px-6">
                    {filteredDoctors.length === 0 ? (
                        <div className="text-center py-20 bg-slate-50 rounded-3xl border border-slate-100">
                            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400 shadow-sm">
                                <Search className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-semibold text-slate-900 mb-2">Axtarışa uyğun nəticə tapılmadı</h3>
                            <p className="text-slate-500">Zəhmət olmasa digər açar sözlərdən istifadə edərək yenidən yoxlayın.</p>
                            <Button
                                variant="outline"
                                className="mt-6 border-slate-200 text-slate-700"
                                onClick={() => setSearchQuery('')}
                            >
                                Axtarışı Təmizlə
                            </Button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredDoctors.map(doctor => (
                                <Card key={doctor.id} className="overflow-hidden border-slate-100 hover:shadow-xl transition-all duration-300 group flex flex-col bg-white rounded-2xl">
                                    <div className="aspect-[4/3] bg-slate-100 relative overflow-hidden">
                                        <Image
                                            src={doctor.image}
                                            alt={doctor.name}
                                            fill
                                            className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                                        <div className="absolute max-w-full bottom-0 left-0 p-6 w-full">
                                            <div className="inline-block bg-blue-600 text-white text-xs font-semibold px-2 py-1 rounded mb-2">
                                                {doctor.specialty}
                                            </div>
                                            <h3 className="text-xl font-bold text-white truncate max-w-full block" title={doctor.name}>{doctor.name}</h3>
                                        </div>
                                    </div>
                                    <CardContent className="pt-6 pb-2 px-6 flex-grow">
                                        <ul className="space-y-3">
                                            <li className="flex items-start">
                                                <MapPin className="w-5 h-5 text-blue-500 mr-3 mt-0.5 shrink-0" />
                                                <span className="text-sm text-slate-700 leading-relaxed font-medium">{doctor.education}</span>
                                            </li>
                                            <li className="flex items-start">
                                                <Calendar className="w-5 h-5 text-amber-500 mr-3 mt-0.5 shrink-0" />
                                                <span className="text-sm text-slate-600">İş təcrübəsi: <span className="font-semibold text-slate-900">{doctor.experience}</span></span>
                                            </li>
                                        </ul>
                                        <div className="mt-5 flex flex-wrap gap-2">
                                            {doctor.tags.map(tag => (
                                                <span key={tag} className="bg-slate-50 border border-slate-100 text-slate-600 px-2.5 py-1 text-xs font-medium rounded-md whitespace-nowrap">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </CardContent>
                                    <CardFooter className="px-6 py-5 border-t border-slate-50 mt-auto bg-slate-50/50">
                                        <div className="grid grid-cols-2 gap-3 w-full">
                                            <Button variant="outline" className="w-full border-slate-200 text-slate-700 bg-white hover:bg-slate-50 hover:text-slate-900">
                                                Profili
                                            </Button>
                                            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-sm">
                                                Qəbul
                                            </Button>
                                        </div>
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
