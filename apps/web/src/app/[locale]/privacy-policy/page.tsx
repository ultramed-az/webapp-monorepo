export default function PrivacyPolicyPage() {
    return (
        <div className="min-h-screen bg-white">
            <section className="py-16 lg:py-20 bg-slate-50 border-b border-slate-100">
                <div className="container mx-auto px-6 max-w-4xl">
                    <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">Mexfilik Siyaseti</h1>
                    <p className="text-slate-600 text-lg">
                        Bu siyaset pasiyent melumatlarinin toplanmasi, emali ve qorunmasi qaydalarini izah edir.
                    </p>
                </div>
            </section>

            <section className="py-12 lg:py-16">
                <div className="container mx-auto px-6 max-w-4xl space-y-8 text-slate-700 leading-relaxed">
                    <div>
                        <h2 className="text-2xl font-semibold text-slate-900 mb-3">1. Toplanan melumatlar</h2>
                        <p>
                            Qebul qeydiyyati ve tibbi xidmetin teskili ucun ad, soyad, elaqe vasitesi, dogum tarixi ve tibbi tarixce kimi melumatlar toplanir.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-2xl font-semibold text-slate-900 mb-3">2. Melumatlardan istifade meqsedleri</h2>
                        <p>
                            Toplanan melumatlar mualice prosesinin aparilmasi, qebul planlasdirilmasi, laboratoriya neticelerinin idare edilmesi ve keyfiyyet monitorinqi ucun istifade olunur.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-2xl font-semibold text-slate-900 mb-3">3. Ucuncu terefle paylasim</h2>
                        <p>
                            Qanunla nezerde tutulan hallar istisna olmaqla, melumatlar ucuncu sexslere sizin raziliginiz olmadan verilmir.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-2xl font-semibold text-slate-900 mb-3">4. Tehlukesizlik tedbirleri</h2>
                        <p>
                            Melumatlar qorunan infrastrukturda saxlanilir ve yalniz selahiyyetli personal terefinden elcatan olur.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-2xl font-semibold text-slate-900 mb-3">5. Elaqe</h2>
                        <p>
                            Mexfilik ile bagli suallar ucun <strong>privacy@ultramed.az</strong> unvanina muraciet ede bilersiniz.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
}
