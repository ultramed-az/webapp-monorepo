import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';

const faqs = [
    {
        q: 'Qebula nece yazila bilerem?',
        a: 'Saytdaki qebul formasindan, cagri merkezine zeng ederek ve ya klinikaya yaxinlasaraq qeydiyyatdan kece bilersiniz.',
    },
    {
        q: 'Analiz neticelerini onlayn gormek mumkundur?',
        a: 'Beli. Sexsi kabinet funksiyasi aktiv olduqda neticeleri elektron formatda yuklemek mumkun olacaq.',
    },
    {
        q: 'Sigorta ile xidmet gosterilir?',
        a: 'Bir cox yerli sigorta sirketleri ile emekdasliq edirik. Daxil olmadan once administratorla deqiqlestirin.',
    },
    {
        q: 'Tecili yardim xidmeti movcuddurmu?',
        a: 'Tecili hallarda 7/24 xidmet gosteren hekim qrupu movcuddur. Zeng merkezimiz sizi uygun bolmeye yonlendirecek.',
    },
    {
        q: 'Qebula gelirken hansi senedler lazimdir?',
        a: 'Sexsiyyet vesiqesi, varsa evvelki analiz neticeleri ve mualice tarixcesi ile gelmeyiniz tovsiye olunur.',
    },
];

export default function FaqPage() {
    return (
        <div className="min-h-screen bg-slate-50">
            <section className="py-16 lg:py-20 bg-white border-b border-slate-100">
                <div className="container mx-auto px-6 max-w-4xl text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">Tez-tez Sorusulan Suallar</h1>
                    <p className="text-lg text-slate-600">
                        Pasiyentlerimizin en cox verdiyi suallari bir yerde topladig. Elave sualiniz olsa bizimle elaqe saxlayin.
                    </p>
                </div>
            </section>

            <section className="py-12 lg:py-16">
                <div className="container mx-auto px-6 max-w-4xl">
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 md:p-6">
                        <Accordion type="single" collapsible className="w-full">
                            {faqs.map((item, index) => (
                                <AccordionItem key={item.q} value={`item-${index}`}>
                                    <AccordionTrigger className="text-left text-slate-900 text-base md:text-lg">
                                        {item.q}
                                    </AccordionTrigger>
                                    <AccordionContent className="text-slate-600 leading-relaxed">
                                        {item.a}
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </div>
                </div>
            </section>
        </div>
    );
}
