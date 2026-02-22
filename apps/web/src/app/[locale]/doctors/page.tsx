'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, MapPin, Calendar, HeartPulse } from 'lucide-react';
import Image from 'next/image';
import { getDoctors, type DoctorListItem } from '@/lib/api';

export default function DoctorsPage() {
    const params = useParams<{ locale: string }>();
    const locale = params?.locale ?? 'az';

    const [searchQuery, setSearchQuery] = useState('');
    const [refreshKey, setRefreshKey] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [doctors, setDoctors] = useState<DoctorListItem[]>([]);

    useEffect(() => {
        let isCancelled = false;

        async function loadDoctors() {
            setIsLoading(true);
            setError(null);

            try {
                const data = await getDoctors(locale);
                if (!isCancelled) {
                    setDoctors(data);
                }
            } catch (fetchError) {
                if (!isCancelled) {
                    const message = fetchError instanceof Error ? fetchError.message : 'Həkimlər yüklənmədi.';
                    setError(message);
                }
            } finally {
                if (!isCancelled) {
                    setIsLoading(false);
                }
            }
        }

        void loadDoctors();

        return () => {
            isCancelled = true;
        };
    }, [locale, refreshKey]);

    const filteredDoctors = useMemo(() => {
        const needle = searchQuery.trim().toLowerCase();
        if (!needle) {
            return doctors;
        }

        return doctors.filter((doctor) => {
            const tagMatch = doctor.tags.some((tag) => tag.toLowerCase().includes(needle));
            return (
                doctor.name.toLowerCase().includes(needle) ||
                doctor.specialty.toLowerCase().includes(needle) ||
                doctor.education.toLowerCase().includes(needle) ||
                tagMatch
            );
        });
    }, [doctors, searchQuery]);

    return (
        <div className="flex flex-col min-h-screen">
            {/* Header */}
            <section className="bg-brand-cream py-16 lg:py-24 relative overflow-hidden">
                <div className="container mx-auto px-6 relative z-10 text-center">
                    <div className="inline-flex items-center space-x-2 bg-brand-blue-soft/80 backdrop-blur border border-brand-blue-soft text-brand-blue font-medium px-4 py-2 rounded-full text-sm mb-6 shadow-sm">
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
                            <Search className="h-5 w-5 text-slate-400 group-focus-within:text-brand-blue transition-colors" />
                        </div>
                        <Input
                            type="text"
                            placeholder="Həkimin adı, şöbəsi və ya xəstəlik üzrə axtarış..."
                            className="pl-12 pr-4 py-6 w-full rounded-2xl border-slate-200 shadow-sm focus-visible:ring-brand-blue focus-visible:ring-offset-2 text-[15px] transition-shadow"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
            </section>

            {/* Doctors Grid */}
            <section className="py-20 bg-white flex-grow border-t border-slate-100">
                <div className="container mx-auto px-6">
                    {isLoading && doctors.length === 0 ? (
                        <div className="text-center py-20 bg-slate-50 rounded-3xl border border-slate-100">
                            <h3 className="text-xl font-semibold text-slate-900 mb-2">Həkimlər yüklənir...</h3>
                        </div>
                    ) : error && doctors.length === 0 ? (
                        <div className="text-center py-20 bg-slate-50 rounded-3xl border border-slate-100">
                            <h3 className="text-xl font-semibold text-slate-900 mb-2">Məlumat yüklənmədi</h3>
                            <p className="text-slate-500 mb-6">Zəhmət olmasa bir daha cəhd edin.</p>
                            <Button
                                variant="outline"
                                className="border-brand-blue text-brand-blue hover:bg-brand-blue-soft"
                                onClick={() => setRefreshKey((key) => key + 1)}
                            >
                                Yenidən yoxla
                            </Button>
                        </div>
                    ) : filteredDoctors.length === 0 ? (
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
                            {filteredDoctors.map((doctor) => (
                                <Card key={doctor.id} className="overflow-hidden border-slate-100 hover:shadow-xl transition-all duration-300 group flex flex-col bg-white rounded-2xl">
                                    <div className="aspect-[4/3] bg-slate-100 relative overflow-hidden">
                                        <Image
                                            src={doctor.image || '/logo.png'}
                                            alt={doctor.name}
                                            fill
                                            className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                                        <div className="absolute max-w-full bottom-0 left-0 p-6 w-full">
                                            <div className="inline-block bg-brand-blue text-white text-xs font-semibold px-2 py-1 rounded mb-2">
                                                {doctor.specialty}
                                            </div>
                                            <h3 className="text-xl font-bold text-white truncate max-w-full block" title={doctor.name}>{doctor.name}</h3>
                                        </div>
                                    </div>
                                    <CardContent className="pt-6 pb-2 px-6 flex-grow">
                                        <ul className="space-y-3">
                                            <li className="flex items-start">
                                                <MapPin className="w-5 h-5 text-brand-blue mr-3 mt-0.5 shrink-0" />
                                                <span className="text-sm text-slate-700 leading-relaxed font-medium">{doctor.education}</span>
                                            </li>
                                            <li className="flex items-start">
                                                <Calendar className="w-5 h-5 text-brand-orange mr-3 mt-0.5 shrink-0" />
                                                <span className="text-sm text-slate-600">İş təcrübəsi: <span className="font-semibold text-slate-900">{doctor.experience}</span></span>
                                            </li>
                                        </ul>
                                        <div className="mt-5 flex flex-wrap gap-2">
                                            {doctor.tags.map((tag) => (
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
                                            <Button className="w-full bg-brand-orange hover:bg-brand-orange-dark text-white shadow-sm">
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

