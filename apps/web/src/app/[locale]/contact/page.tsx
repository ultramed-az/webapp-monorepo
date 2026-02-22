'use client';

import { useTranslations } from 'next-intl';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { MapPin, Phone, Mail, Clock, Send, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';

export default function ContactPage() {
    const t = useTranslations('Contact');

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        toast.success('Mesajınız uğurla göndərildi!', {
            description: 'Ən qısa zamanda sizinlə əlaqə saxlayacağıq.',
        });
    };

    return (
        <div className="flex flex-col min-h-screen">
            {/* Header */}
            <section className="bg-slate-50 py-16 lg:py-24 relative overflow-hidden">
                <div className="absolute inset-0 z-0 opacity-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-700 via-slate-100 to-transparent"></div>
                <div className="container mx-auto px-6 relative z-10 text-center">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">
                        Bizimlə Əlaqə
                    </h1>
                    <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
                        Suallarınız, təklifləriniz və ya qəbula yazılmaq üçün bizimlə əlaqə saxlamaqdan çəkinməyin. Komandamız sizə kömək etməyə hər zaman hazırdır.
                    </p>
                </div>
            </section>

            {/* Main Content */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

                        {/* Contact Information Cards */}
                        <div className="lg:col-span-5 space-y-6">
                            <h2 className="text-2xl font-bold text-slate-900 mb-6">Əlaqə Vasitələri</h2>

                            <Card className="border-slate-100 shadow-sm hover:shadow-md transition-shadow bg-blue-50/50">
                                <CardContent className="p-6 flex items-start">
                                    <div className="bg-blue-100 p-3 rounded-full mr-4 text-blue-600 shrink-0">
                                        <MapPin className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-slate-900 mb-1">Ünvanımız</h3>
                                        <p className="text-slate-600 text-sm leading-relaxed">
                                            Bakı şəhəri, Nəsimi rayonu<br />
                                            Səməd Vurğun küçəsi 14A
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                                <CardContent className="p-6 flex items-start">
                                    <div className="bg-emerald-100 p-3 rounded-full mr-4 text-emerald-600 shrink-0">
                                        <Phone className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-slate-900 mb-1">Telefon</h3>
                                        <p className="text-slate-600 text-sm mb-1">Mərkəzi Çağrı Mərkəzi</p>
                                        <p className="font-bold text-lg text-emerald-700">*4444</p>
                                        <p className="text-slate-500 text-sm mt-1">+994 12 555 44 44</p>
                                    </div>
                                </CardContent>
                            </Card>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <Card className="border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                                    <CardContent className="p-6 flex flex-col items-center text-center">
                                        <div className="bg-amber-100 p-3 rounded-full mb-4 text-amber-600">
                                            <Clock className="h-6 w-6" />
                                        </div>
                                        <h3 className="font-semibold text-slate-900 mb-1">İş Saatları</h3>
                                        <p className="text-slate-600 text-sm">B.E - Ş: 08:00 - 20:00</p>
                                        <p className="text-slate-600 text-sm">B: 09:00 - 15:00</p>
                                    </CardContent>
                                </Card>

                                <Card className="border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                                    <CardContent className="p-6 flex flex-col items-center text-center">
                                        <div className="bg-rose-100 p-3 rounded-full mb-4 text-rose-600">
                                            <Mail className="h-6 w-6" />
                                        </div>
                                        <h3 className="font-semibold text-slate-900 mb-1">E-poçt</h3>
                                        <p className="text-slate-600 text-sm">info@ultramed.az</p>
                                        <p className="text-slate-600 text-sm">support@ultramed.az</p>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div className="lg:col-span-7">
                            <Card className="border-slate-200 shadow-xl h-full bg-white">
                                <CardContent className="p-8 sm:p-10">
                                    <div className="flex items-center space-x-3 mb-8">
                                        <div className="bg-blue-600 p-2 rounded-lg text-white">
                                            <MessageSquare className="w-5 h-5" />
                                        </div>
                                        <h2 className="text-2xl font-bold text-slate-900">Bizə Yazın</h2>
                                    </div>

                                    <form onSubmit={handleFormSubmit} className="space-y-6">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <Label htmlFor="firstName" className="text-slate-700">Adınız</Label>
                                                <Input id="firstName" placeholder="Adınızı daxil edin" required className="h-12 bg-slate-50 border-slate-200 focus-visible:ring-blue-500" />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="lastName" className="text-slate-700">Soyadınız</Label>
                                                <Input id="lastName" placeholder="Soyadınızı daxil edin" required className="h-12 bg-slate-50 border-slate-200 focus-visible:ring-blue-500" />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <Label htmlFor="email" className="text-slate-700">E-poçt Ünvanı</Label>
                                                <Input id="email" type="email" placeholder="E-poçtunuzu daxil edin" required className="h-12 bg-slate-50 border-slate-200 focus-visible:ring-blue-500" />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="phone" className="text-slate-700">Əlaqə Nömrəsi</Label>
                                                <Input id="phone" type="tel" placeholder="+994" className="h-12 bg-slate-50 border-slate-200 focus-visible:ring-blue-500" />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="subject" className="text-slate-700">Mövzu</Label>
                                            <Input id="subject" placeholder="Müraciətinizin mövzusu" required className="h-12 bg-slate-50 border-slate-200 focus-visible:ring-blue-500" />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="message" className="text-slate-700">Mesajınız</Label>
                                            <Textarea
                                                id="message"
                                                placeholder="Bizə nə demək istəyirsiniz?"
                                                rows={5}
                                                required
                                                className="bg-slate-50 border-slate-200 focus-visible:ring-blue-500 resize-none"
                                            />
                                        </div>

                                        <Button type="submit" className="w-full h-14 bg-blue-600 hover:bg-blue-700 text-white font-medium text-lg rounded-xl">
                                            Müraciəti Göndər <Send className="ml-2 w-5 h-5" />
                                        </Button>
                                    </form>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </section>

            {/* Map Section */}
            <section className="h-[400px] md:h-[500px] w-full bg-slate-100 relative grayscale hover:grayscale-0 transition-all duration-1000">
                {/* Embedded Google Maps Placeholder - Use an actual embed URL in production */}
                <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3039.4286745147575!2d49.83944441539243!3d40.37719007936952!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40307dabacc0eb35%3A0xad52d0fa31b143ec!2sBaku%2C%20Azerbaijan!5e0!3m2!1sen!2s!4v1620000000000!5m2!1sen!2s"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen={false}
                    loading="lazy"
                    title="Clinic Location"
                    className="absolute inset-0"
                ></iframe>
            </section>
        </div>
    );
}
