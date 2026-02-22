export default function TermsOfServicePage() {
    return (
        <div className="min-h-screen bg-white">
            <section className="py-16 lg:py-20 bg-slate-50 border-b border-slate-100">
                <div className="container mx-auto px-6 max-w-4xl">
                    <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">Istifade Sertleri</h1>
                    <p className="text-slate-600 text-lg">
                        Bu sertler Ultramed platformasindan istifade qaydalarini ve tereflerin mesuliyyetlerini teyin edir.
                    </p>
                </div>
            </section>

            <section className="py-12 lg:py-16">
                <div className="container mx-auto px-6 max-w-4xl space-y-8 text-slate-700 leading-relaxed">
                    <div>
                        <h2 className="text-2xl font-semibold text-slate-900 mb-3">1. Umumi muddealar</h2>
                        <p>
                            Saytdan istifade etmeyiniz bu sertlerle razi oldugunuzu bildirir. Sertler ehtiyac olduqda yenilene biler.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-2xl font-semibold text-slate-900 mb-3">2. Qebul qeydiyyati</h2>
                        <p>
                            Onlayn qeydiyyat zamani daxil edilen melumatlarin duzgunluyu pasiyentin oz mesuliyyetindedir.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-2xl font-semibold text-slate-900 mb-3">3. Mesuliyyetin mehdudlasdirilmasi</h2>
                        <p>
                            Saytda yerlesen melumatlar maariflendirme xarakteri dasiyir ve hekim meslehetini evez etmir.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-2xl font-semibold text-slate-900 mb-3">4. Muellif huquqlari</h2>
                        <p>
                            Saytda olan metn, dizayn ve media elementleri Ultramed ve emekdas tereflerin muellif huquqlari ile qorunur.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-2xl font-semibold text-slate-900 mb-3">5. Muqavile huququ</h2>
                        <p>
                            Muveqqeti muiseler uzre yaranan muiseler Azerbaycan Respublikasinin qanunvericiliyine uygun hell edilir.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
}
