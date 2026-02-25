/* eslint-disable no-console */
const { PrismaClient } = require('@prisma/client');
const { hash } = require('bcryptjs');

const prisma = new PrismaClient();

const services = [
  {
    id: 'svc-kardiologiya',
    titleAz: 'Kardiologiya',
    titleEn: 'Cardiology',
    titleRu: 'Кардиология',
    summaryAz:
      'Ürək-damar sisteminin xəstəliklərinin diaqnostikası, müalicəsi və profilaktikası üçün kompleks xidmət.',
    summaryEn:
      'Comprehensive diagnostic, treatment, and preventive services for cardiovascular diseases.',
    summaryRu:
      'Комплексные услуги по диагностике, лечению и профилактике сердечно-сосудистых заболеваний.',
    contentAz:
      'Kardiologiya şöbəmizdə arterial hipertenziya, aritmiya, ürək çatışmazlığı və koronar arteriya xəstəliyi kimi problemlərin müasir protokollar əsasında müalicəsi həyata keçirilir.\n\nPasiyentlər üçün EKQ, EXO-KQ, Holter monitorinqi və stress test daxil olmaqla geniş diaqnostik paket təqdim edilir. Müalicə planı risk faktorları, həyat tərzi və yanaşı xəstəliklər nəzərə alınaraq fərdi şəkildə qurulur.',
    contentEn:
      'Our cardiology unit treats hypertension, arrhythmia, heart failure, and coronary artery disease according to modern protocols.\n\nPatients receive a complete diagnostic package including ECG, echocardiography, Holter monitoring, and stress testing. Each treatment plan is personalized based on risk profile, lifestyle, and comorbidities.',
    contentRu:
      'В кардиологическом отделении проводится лечение артериальной гипертензии, аритмий, сердечной недостаточности и ишемической болезни сердца по современным протоколам.\n\nПациентам доступен полный диагностический пакет: ЭКГ, ЭхоКГ, Холтер-мониторинг и стресс-тест. План лечения формируется индивидуально с учетом факторов риска, образа жизни и сопутствующих заболеваний.',
    highlightsAz: ['EKQ və EXO-KQ', '24 saat Holter monitorinqi', 'Fərdi risk analizi'],
    highlightsEn: ['ECG and echocardiography', '24-hour Holter monitoring', 'Personalized risk analysis'],
    highlightsRu: ['ЭКГ и ЭхоКГ', 'Холтер-мониторинг 24 часа', 'Индивидуальная оценка рисков'],
    iconKey: 'heartPulse',
    image:
      'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?q=80&w=2400&auto=format&fit=crop',
    sortOrder: 1,
    isPublished: true,
  },
  {
    id: 'svc-nevrologiya',
    titleAz: 'Nevrologiya',
    titleEn: 'Neurology',
    titleRu: 'Неврология',
    summaryAz:
      'Mərkəzi və periferik sinir sistemi xəstəliklərinin diaqnostikası və mərhələli müalicəsi.',
    summaryEn:
      'Diagnosis and staged treatment of central and peripheral nervous system disorders.',
    summaryRu:
      'Диагностика и этапное лечение заболеваний центральной и периферической нервной системы.',
    contentAz:
      'Nevrologiya şöbəsində baş ağrıları, miqren, epilepsiya, nevropatiyalar və yuxu pozuntuları üzrə konsultasiya və müalicə aparılır.\n\nDiaqnostik proses nevroloji müayinə, klinik analiz və görüntüləmə nəticələrinin birgə dəyərləndirilməsinə əsaslanır. Məqsəd simptomların sürətli idarə olunması və uzunmüddətli nəzarətin təmin edilməsidir.',
    contentEn:
      'Our neurology department provides consultation and treatment for headaches, migraine, epilepsy, neuropathies, and sleep disorders.\n\nDiagnostics combine neurological examination, lab findings, and imaging results for evidence-based decisions. The goal is fast symptom control and sustainable long-term management.',
    contentRu:
      'Неврологическое отделение проводит консультации и лечение при головных болях, мигрени, эпилепсии, нейропатиях и нарушениях сна.\n\nДиагностика основана на сочетании неврологического осмотра, лабораторных и визуализационных данных. Наша цель — быстрое купирование симптомов и долгосрочный контроль состояния.',
    highlightsAz: ['Miqren və baş ağrısı klinikası', 'Epilepsiya nəzarət proqramı', 'Yuxu pozuntularının idarəsi'],
    highlightsEn: ['Headache and migraine clinic', 'Epilepsy follow-up program', 'Sleep disorder management'],
    highlightsRu: ['Клиника головной боли и мигрени', 'Программа наблюдения при эпилепсии', 'Контроль нарушений сна'],
    iconKey: 'brain',
    image:
      'https://images.unsplash.com/photo-1550831107-1553da8c8464?q=80&w=2400&auto=format&fit=crop',
    sortOrder: 2,
    isPublished: true,
  },
  {
    id: 'svc-stomatologiya',
    titleAz: 'Stomatologiya',
    titleEn: 'Dentistry',
    titleRu: 'Стоматология',
    summaryAz:
      'Terapevtik, cərrahi və estetik stomatoloji xidmətlər bir mərkəzdə.',
    summaryEn:
      'Therapeutic, surgical, and aesthetic dental care delivered in one center.',
    summaryRu:
      'Терапевтическая, хирургическая и эстетическая стоматология в одном центре.',
    contentAz:
      'Stomatologiya şöbəmiz kariyesin müalicəsi, kanal terapiyası, ortodontik korreksiya və implantoloji həllər təklif edir.\n\nAğız boşluğunun ümumi vəziyyətinə əsasən mərhələli müalicə planı hazırlanır. Xidmətlər sterilizasiya protokollarına tam uyğun aparılır və pasiyent rahatlığı prioritet tutulur.',
    contentEn:
      'Our dental unit offers caries treatment, endodontic therapy, orthodontic correction, and implant solutions.\n\nA phased treatment plan is developed based on full oral assessment. Procedures follow strict sterilization standards, with patient comfort as a core priority.',
    contentRu:
      'Стоматологическое отделение предлагает лечение кариеса, эндодонтическую терапию, ортодонтическую коррекцию и имплантологические решения.\n\nПошаговый план лечения составляется после полной оценки состояния полости рта. Все процедуры проводятся по строгим стандартам стерилизации с акцентом на комфорт пациента.',
    highlightsAz: ['Müasir implantologiya', 'Ortodontik planlama', 'Estetik bərpa'],
    highlightsEn: ['Modern implantology', 'Orthodontic planning', 'Aesthetic restoration'],
    highlightsRu: ['Современная имплантология', 'Ортодонтическое планирование', 'Эстетическая реставрация'],
    iconKey: 'shieldCheck',
    image:
      'https://images.unsplash.com/photo-1609840114035-3c981b782dfe?q=80&w=2400&auto=format&fit=crop',
    sortOrder: 3,
    isPublished: true,
  },
  {
    id: 'svc-laboratoriya',
    titleAz: 'Klinik Laboratoriya',
    titleEn: 'Clinical Laboratory',
    titleRu: 'Клиническая лаборатория',
    summaryAz:
      'Qan, sidik və digər bioloji nümunələr üçün yüksək dəqiqlikli laborator diaqnostika.',
    summaryEn:
      'High-precision laboratory diagnostics for blood, urine, and other biological samples.',
    summaryRu:
      'Высокоточная лабораторная диагностика крови, мочи и других биологических материалов.',
    contentAz:
      'Laboratoriya şöbəsində biokimyəvi, hematoloji, immunoloji və hormonal analizlər sürətli dövr ərzində icra olunur.\n\nAnalizlər avtomatlaşdırılmış sistemlərdə aparılır və nəticələr klinik qərarverməni sürətləndirmək üçün həkimlərə operativ ötürülür. Keyfiyyətə nəzarət daxili və xarici standartlarla dəstəklənir.',
    contentEn:
      'The laboratory performs biochemical, hematological, immunological, and hormonal tests with short turnaround times.\n\nAssays run on automated systems, and results are delivered quickly to support clinical decisions. Quality assurance is maintained through internal and external controls.',
    contentRu:
      'Лаборатория выполняет биохимические, гематологические, иммунологические и гормональные исследования с короткими сроками готовности.\n\nАнализы выполняются на автоматизированных системах, а результаты оперативно передаются врачам. Контроль качества обеспечивается внутренними и внешними стандартами.',
    highlightsAz: ['Biokimya və hematologiya', 'Hormonal panel', 'Sürətli nəticə dövriyyəsi'],
    highlightsEn: ['Biochemistry and hematology', 'Hormonal panel', 'Fast turnaround'],
    highlightsRu: ['Биохимия и гематология', 'Гормональные панели', 'Быстрая выдача результатов'],
    iconKey: 'activity',
    image:
      'https://images.unsplash.com/photo-1579154204601-01588f351e67?q=80&w=2400&auto=format&fit=crop',
    sortOrder: 4,
    isPublished: true,
  },
  {
    id: 'svc-pediatriya',
    titleAz: 'Pediatriya',
    titleEn: 'Pediatrics',
    titleRu: 'Педиатрия',
    summaryAz:
      'Yenidoğulmuşlardan yeniyetmələrə qədər uşaqlar üçün profilaktik və müalicəvi xidmətlər.',
    summaryEn:
      'Preventive and therapeutic care for children from newborn age to adolescence.',
    summaryRu:
      'Профилактическая и лечебная помощь детям от периода новорожденности до подросткового возраста.',
    contentAz:
      'Pediatriya şöbəsi uşaqların fiziki inkişafının izlənməsi, peyvənd planı və kəskin xəstəliklərin vaxtında müalicəsini təmin edir.\n\nMüayinələr valideynlərlə birgə planlanır, qidalanma və gündəlik rejim üzrə tövsiyələr verilir. Uşağın yaşına uyğun fərdi yanaşma əsas prinsipdir.',
    contentEn:
      'Our pediatrics department supports growth monitoring, vaccination planning, and timely treatment of acute childhood illnesses.\n\nVisits are structured together with parents, including guidance on nutrition and daily routines. Age-appropriate individualized care is our core approach.',
    contentRu:
      'Педиатрическое отделение обеспечивает мониторинг развития ребенка, план вакцинации и своевременное лечение острых заболеваний.\n\nПриемы проводятся с участием родителей, с рекомендациями по питанию и режиму дня. Ключевой принцип — индивидуальный подход с учетом возраста.',
    highlightsAz: ['Peyvənd təqvimi nəzarəti', 'İnkişaf monitorinqi', 'Valideyn məsləhəti'],
    highlightsEn: ['Vaccination schedule control', 'Growth monitoring', 'Parent counseling'],
    highlightsRu: ['Контроль календаря вакцинации', 'Мониторинг развития', 'Консультации для родителей'],
    iconKey: 'baby',
    image:
      'https://images.unsplash.com/photo-1600959907703-125ba1374a12?q=80&w=2400&auto=format&fit=crop',
    sortOrder: 5,
    isPublished: true,
  },
  {
    id: 'svc-oftalmologiya',
    titleAz: 'Oftalmologiya',
    titleEn: 'Ophthalmology',
    titleRu: 'Офтальмология',
    summaryAz:
      'Göz xəstəliklərinin erkən diaqnostikası, refraksiya dəyərləndirilməsi və müalicəsi.',
    summaryEn:
      'Early diagnosis, refraction assessment, and treatment of eye disorders.',
    summaryRu:
      'Ранняя диагностика, оценка рефракции и лечение заболеваний глаз.',
    contentAz:
      'Oftalmologiya şöbəsində görmə zəifliyi, qlaukoma, katarakta və digər göz patologiyaları üçün müasir diaqnostik xidmətlər təqdim edilir.\n\nAparat müayinələri nəticəsində dəqiq diaqnoz qoyulur və medikamentoz, optik və ya cərrahi yönümlü müalicə strategiyası müəyyən edilir.',
    contentEn:
      'The ophthalmology unit provides modern diagnostics for visual impairment, glaucoma, cataract, and other eye pathologies.\n\nInstrument-based assessment enables accurate diagnosis and selection of medical, optical, or surgical treatment pathways.',
    contentRu:
      'В офтальмологическом отделении доступны современные методы диагностики при снижении зрения, глаукоме, катаракте и других патологиях глаза.\n\nАппаратные исследования позволяют поставить точный диагноз и выбрать медикаментозную, оптическую или хирургическую тактику лечения.',
    highlightsAz: ['Refraksiya və göz dibi müayinəsi', 'Qlaukoma skrininqi', 'Katarakta dəyərləndirməsi'],
    highlightsEn: ['Refraction and fundus exam', 'Glaucoma screening', 'Cataract evaluation'],
    highlightsRu: ['Рефракция и осмотр глазного дна', 'Скрининг глаукомы', 'Оценка катаракты'],
    iconKey: 'eye',
    image:
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=2400&auto=format&fit=crop',
    sortOrder: 6,
    isPublished: true,
  },
  {
    id: 'svc-cerrahiyye',
    titleAz: 'Ümumi Cərrahiyyə',
    titleEn: 'General Surgery',
    titleRu: 'Общая хирургия',
    summaryAz:
      'Kiçik invaziv və açıq cərrahi prosedurlar üçün təhlükəsiz və planlı cərrahiyyə xidməti.',
    summaryEn:
      'Safe and structured surgical care including minimally invasive and open procedures.',
    summaryRu:
      'Безопасная и плановая хирургическая помощь, включая малоинвазивные и открытые операции.',
    contentAz:
      'Ümumi cərrahiyyə şöbəsi qarın boşluğu, yumşaq toxuma və digər ümumi cərrahi patologiyaların diaqnostikası və əməliyyatını həyata keçirir.\n\nƏməliyyatdan əvvəl qiymətləndirmə, anestezioloji hazırlıq və əməliyyatdan sonrakı nəzarət vahid protokol əsasında icra olunur.',
    contentEn:
      'The general surgery department handles diagnostics and operative care for abdominal, soft tissue, and other common surgical conditions.\n\nPre-operative evaluation, anesthesia preparation, and post-operative follow-up are managed under a unified protocol.',
    contentRu:
      'Отделение общей хирургии проводит диагностику и оперативное лечение абдоминальных, мягкотканных и других распространенных хирургических патологий.\n\nПредоперационная оценка, анестезиологическая подготовка и послеоперационное наблюдение выполняются по единому протоколу.',
    highlightsAz: ['Laparoskopik yanaşma', 'Əməliyyat öncəsi risk dəyərləndirməsi', 'Postoperativ nəzarət'],
    highlightsEn: ['Laparoscopic approach', 'Pre-op risk assessment', 'Post-operative follow-up'],
    highlightsRu: ['Лапароскопический подход', 'Предоперационная оценка рисков', 'Послеоперационное наблюдение'],
    iconKey: 'syringe',
    image:
      'https://images.unsplash.com/photo-1516549655169-df83a0774514?q=80&w=2400&auto=format&fit=crop',
    sortOrder: 7,
    isPublished: true,
  },
  {
    id: 'svc-travmatologiya',
    titleAz: 'Travmatologiya',
    titleEn: 'Traumatology',
    titleRu: 'Травматология',
    summaryAz:
      'Sümük-oynaq travmalarının diaqnostikası, konservativ və cərrahi müalicəsi.',
    summaryEn:
      'Diagnostic, conservative, and surgical treatment of bone and joint trauma.',
    summaryRu:
      'Диагностика, консервативное и хирургическое лечение травм костей и суставов.',
    contentAz:
      'Travmatologiya şöbəsi sınıq, çıxıq, bağ zədələri və digər dayaq-hərəkət sistemi travmaları üçün təcili və planlı yardım göstərir.\n\nMüalicə konservativ immobilizasiya, fizioterapiya və lazım olduqda cərrahi korreksiya ilə aparılır. Məqsəd ağrının azaldılması və funksiyanın tez bərpasıdır.',
    contentEn:
      'Our traumatology team provides urgent and planned care for fractures, dislocations, ligament injuries, and other musculoskeletal trauma.\n\nManagement includes conservative immobilization, physiotherapy, and surgical correction when indicated. The objective is pain reduction and rapid functional recovery.',
    contentRu:
      'Травматологическое отделение оказывает экстренную и плановую помощь при переломах, вывихах, повреждениях связок и других травмах опорно-двигательного аппарата.\n\nЛечение включает консервативную иммобилизацию, физиотерапию и при необходимости хирургическую коррекцию. Цель — уменьшение боли и быстрое восстановление функции.',
    highlightsAz: ['Sınıq və çıxıq müalicəsi', 'Ortopedik konsultasiya', 'Reabilitasiya planı'],
    highlightsEn: ['Fracture and dislocation care', 'Orthopedic consultation', 'Rehabilitation planning'],
    highlightsRu: ['Лечение переломов и вывихов', 'Ортопедическая консультация', 'План реабилитации'],
    iconKey: 'bone',
    image:
      'https://images.unsplash.com/photo-1538108149393-fbbd81895907?q=80&w=2400&auto=format&fit=crop',
    sortOrder: 8,
    isPublished: true,
  },
];

const doctors = [
  {
    id: 'doc-ali-veliyev',
    name: 'Dr. Əli Vəliyev',
    titleAz: 'Kardiologiya üzrə Uzman',
    titleEn: 'Expert Cardiologist',
    titleRu: 'Кардиолог-эксперт',
    bioAz: 'Ürək-damar xəstəliklərinin diaqnostikası və müalicəsi üzrə ixtisaslaşmış həkim.',
    bioEn: 'Specialized in diagnosis and treatment of cardiovascular diseases.',
    bioRu: 'Специализируется на диагностике и лечении сердечно-сосудистых заболеваний.',
    profileAz:
      'Dr. Əli Vəliyev arterial hipertenziya, ürək ritm pozuntuları və ürək çatışmazlığı üzrə klinik praktikaya malikdir. Hər pasiyent üçün risk faktorlarına əsaslanan fərdi müalicə planı hazırlayır və müntəzəm izləmə proqramı qurur.',
    profileEn:
      'Dr. Ali Valiyev has strong clinical expertise in hypertension, rhythm disorders, and heart failure. He designs personalized treatment and follow-up plans based on each patient risk profile.',
    profileRu:
      'Др. Али Велиев обладает клиническим опытом в лечении артериальной гипертензии, нарушений ритма и сердечной недостаточности. Для каждого пациента формируется индивидуальный план лечения и наблюдения.',
    specialty: 'Kardiologiya',
    experience: '15 il',
    educationAz: 'Ege Universiteti, Tibb Fakültəsi',
    educationEn: 'Ege University, Faculty of Medicine',
    educationRu: 'Эгейский университет, медицинский факультет',
    roomAz: '2-ci mərtəbə, otaq 214',
    roomEn: '2nd floor, room 214',
    roomRu: '2-й этаж, кабинет 214',
    scheduleAz: ['Bazar ertəsi - Cümə: 09:00 - 17:00', 'Şənbə: 10:00 - 14:00 (öncədən yazılış)'],
    scheduleEn: ['Monday - Friday: 09:00 - 17:00', 'Saturday: 10:00 - 14:00 (by appointment)'],
    scheduleRu: ['Понедельник - Пятница: 09:00 - 17:00', 'Суббота: 10:00 - 14:00 (по записи)'],
    languagesAz: ['Azərbaycan', 'Türk', 'Rus'],
    languagesEn: ['Azerbaijani', 'Turkish', 'Russian'],
    languagesRu: ['Азербайджанский', 'Турецкий', 'Русский'],
    proceduresAz: [
      'EKQ, EXO-KQ və Holter monitorinqinin dəyərləndirilməsi',
      'Hipertoniya və aritmiya üçün fərdi müalicə planı',
      'Kardioloji check-up və risk analizləri',
    ],
    proceduresEn: [
      'Interpretation of ECG, EchoCG, and Holter monitoring',
      'Personalized care plans for hypertension and arrhythmia',
      'Cardiovascular check-up and risk assessment',
    ],
    proceduresRu: [
      'Интерпретация ЭКГ, ЭхоКГ и Холтер-мониторинга',
      'Индивидуальные схемы лечения гипертензии и аритмий',
      'Кардиологический check-up и оценка рисков',
    ],
    phone: '+994 12 555 44 21',
    email: 'ali.veliyev@ultramed.az',
    tagsAz: ['Aritmiya', 'Ürək çatışmazlığı', 'EKQ'],
    tagsEn: ['Arrhythmia', 'Heart failure', 'ECG'],
    tagsRu: ['Аритмия', 'Сердечная недостаточность', 'ЭКГ'],
    image:
      'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=3400&auto=format&fit=crop',
    sortOrder: 1,
  },
  {
    id: 'doc-aysel-memmedova',
    name: 'Dr. Aysel Məmmədova',
    titleAz: 'Uzman Nevroloq',
    titleEn: 'Expert Neurologist',
    titleRu: 'Невролог-эксперт',
    bioAz: 'Sinir sistemi xəstəliklərinin müasir protokollarla müalicəsində təcrübəlidir.',
    bioEn: 'Experienced in treating neurological diseases with modern protocols.',
    bioRu: 'Имеет опыт лечения неврологических заболеваний по современным протоколам.',
    profileAz:
      'Dr. Aysel Məmmədova miqren, baş ağrıları, epilepsiya və periferik neyropatiyalar üzrə pasiyentləri qəbul edir. Müalicə planında dərman seçimi ilə yanaşı həyat tərzi və yuxu gigiyenası tövsiyələri də verilir.',
    profileEn:
      'Dr. Aysel Mammadova focuses on migraine, headaches, epilepsy, and peripheral neuropathies. She combines pharmacological treatment with lifestyle and sleep hygiene guidance.',
    profileRu:
      'Др. Айсель Мамедова ведет пациентов с мигренью, головными болями, эпилепсией и периферическими невропатиями. Лечение включает медикаментозную терапию и рекомендации по образу жизни и сну.',
    specialty: 'Nevrologiya',
    experience: '8 il',
    educationAz: 'Azərbaycan Tibb Universiteti',
    educationEn: 'Azerbaijan Medical University',
    educationRu: 'Азербайджанский медицинский университет',
    roomAz: '3-cü mərtəbə, otaq 305',
    roomEn: '3rd floor, room 305',
    roomRu: '3-й этаж, кабинет 305',
    scheduleAz: ['Bazar ertəsi - Cümə: 10:00 - 18:00', 'Şənbə: 10:00 - 13:00'],
    scheduleEn: ['Monday - Friday: 10:00 - 18:00', 'Saturday: 10:00 - 13:00'],
    scheduleRu: ['Понедельник - Пятница: 10:00 - 18:00', 'Суббота: 10:00 - 13:00'],
    languagesAz: ['Azərbaycan', 'İngilis', 'Rus'],
    languagesEn: ['Azerbaijani', 'English', 'Russian'],
    languagesRu: ['Азербайджанский', 'Английский', 'Русский'],
    proceduresAz: [
      'Miqren və xroniki baş ağrısı idarəolunması',
      'Epilepsiya üzrə diaqnostika və uzunmüddətli nəzarət',
      'Yuxu pozuntuları və periferik sinir sistemi konsultasiyası',
    ],
    proceduresEn: [
      'Migraine and chronic headache management',
      'Epilepsy diagnostics and long-term follow-up',
      'Consultation for sleep disorders and peripheral neuropathy',
    ],
    proceduresRu: [
      'Ведение мигрени и хронической головной боли',
      'Диагностика эпилепсии и длительное наблюдение',
      'Консультация по нарушениям сна и периферическим невропатиям',
    ],
    phone: '+994 12 555 44 22',
    email: 'aysel.mammadova@ultramed.az',
    tagsAz: ['Miqren', 'Epilepsiya', 'Yuxu pozuntuları'],
    tagsEn: ['Migraine', 'Epilepsy', 'Sleep disorders'],
    tagsRu: ['Мигрень', 'Эпилепсия', 'Нарушения сна'],
    image:
      'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=3400&auto=format&fit=crop',
    sortOrder: 2,
  },
  {
    id: 'doc-rashad-huseynov',
    name: 'Dr. Rəşad Hüseynov',
    titleAz: 'Cərrah Stomatoloq',
    titleEn: 'Oral and Maxillofacial Surgeon',
    titleRu: 'Стоматолог-хирург',
    bioAz: 'Ağız və çənə cərrahiyyəsi üzrə uzunmüddətli klinik təcrübəyə malikdir.',
    bioEn: 'Has extensive clinical experience in oral and maxillofacial surgery.',
    bioRu: 'Обладает большим клиническим опытом в челюстно-лицевой хирургии.',
    profileAz:
      'Dr. Rəşad Hüseynov implantologiya, çənə cərrahiyyəsi və estetik bərpa sahələrində çalışır. Kompleks hallarda görüntüləmə nəticələrinə əsaslanan mərhələli müalicə planı tətbiq edir.',
    profileEn:
      'Dr. Rashad Huseynov works in implantology, oral surgery, and aesthetic restoration. For complex cases, he uses staged treatment strategies based on imaging results.',
    profileRu:
      'Др. Рашад Гусейнов работает в области имплантологии, челюстно-лицевой хирургии и эстетической реставрации. В сложных случаях применяется поэтапная тактика на основе визуализационных данных.',
    specialty: 'Stomatologiya',
    experience: '12 il',
    educationAz: 'Hacettepe Universiteti, Diş Həkimliyi',
    educationEn: 'Hacettepe University, Dentistry',
    educationRu: 'Университет Хаджеттепе, стоматология',
    roomAz: '1-ci mərtəbə, otaq 112 (Stomatologiya bloku)',
    roomEn: '1st floor, room 112 (Dental unit)',
    roomRu: '1-й этаж, кабинет 112 (Стоматологический блок)',
    scheduleAz: ['Çərşənbə axşamı - Bazar: 09:00 - 18:00', 'Bazar ertəsi: istirahət günü'],
    scheduleEn: ['Tuesday - Sunday: 09:00 - 18:00', 'Monday: day off'],
    scheduleRu: ['Вторник - Воскресенье: 09:00 - 18:00', 'Понедельник: выходной'],
    languagesAz: ['Azərbaycan', 'Türk', 'İngilis'],
    languagesEn: ['Azerbaijani', 'Turkish', 'English'],
    languagesRu: ['Азербайджанский', 'Турецкий', 'Английский'],
    proceduresAz: [
      'Dental implantasiya və cərrahi planlama',
      'Ağız boşluğu cərrahi müdaxilələri',
      'Estetik gülüş dizaynı və kompleks bərpa',
    ],
    proceduresEn: [
      'Dental implantation and surgical planning',
      'Oral cavity surgical interventions',
      'Aesthetic smile design and full restoration',
    ],
    proceduresRu: [
      'Дентальная имплантация и хирургическое планирование',
      'Хирургические вмешательства в полости рта',
      'Эстетический дизайн улыбки и комплексная реставрация',
    ],
    phone: '+994 12 555 44 23',
    email: 'rashad.huseynov@ultramed.az',
    tagsAz: ['İmplantologiya', 'Ağız cərrahiyyəsi', 'Estetik'],
    tagsEn: ['Implantology', 'Oral surgery', 'Aesthetics'],
    tagsRu: ['Имплантология', 'Оральная хирургия', 'Эстетика'],
    image:
      'https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=3400&auto=format&fit=crop',
    sortOrder: 3,
  },
  {
    id: 'doc-leyla-guliyeva',
    name: 'Dr. Leyla Quliyeva',
    titleAz: 'Pediatr',
    titleEn: 'Pediatrician',
    titleRu: 'Педиатр',
    bioAz: 'Uşaq sağlamlığının izlənməsi və profilaktik müayinələr üzrə ixtisaslaşıb.',
    bioEn: 'Specialized in child health monitoring and preventive checkups.',
    bioRu: 'Специализируется на наблюдении за здоровьем детей и профилактике.',
    profileAz:
      'Dr. Leyla Quliyeva yenidoğulmuş dövrdən məktəb yaşına qədər uşaqların sağlamlıq monitorinqini aparır. Valideynlərlə birgə peyvənd, qidalanma və inkişaf mərhələləri üzrə fərdi plan tərtib edir.',
    profileEn:
      'Dr. Leyla Guliyeva follows children from newborn to school age with preventive and developmental care. She builds individualized plans with parents for vaccination, nutrition, and growth milestones.',
    profileRu:
      'Др. Лейла Гулиева наблюдает детей с периода новорожденности до школьного возраста. Совместно с родителями формирует индивидуальный план вакцинации, питания и контроля развития.',
    specialty: 'Pediatriya',
    experience: '5 il',
    educationAz: 'İstanbul Universiteti, Cərrahpaşa Tibb Fakültəsi',
    educationEn: 'Istanbul University, Cerrahpasa Faculty of Medicine',
    educationRu: 'Стамбульский университет, медицинский факультет Джеррахпаша',
    roomAz: '2-ci mərtəbə, otaq 225',
    roomEn: '2nd floor, room 225',
    roomRu: '2-й этаж, кабинет 225',
    scheduleAz: ['Bazar ertəsi - Cümə: 09:00 - 16:00', 'Şənbə: 09:00 - 13:00'],
    scheduleEn: ['Monday - Friday: 09:00 - 16:00', 'Saturday: 09:00 - 13:00'],
    scheduleRu: ['Понедельник - Пятница: 09:00 - 16:00', 'Суббота: 09:00 - 13:00'],
    languagesAz: ['Azərbaycan', 'Rus'],
    languagesEn: ['Azerbaijani', 'Russian'],
    languagesRu: ['Азербайджанский', 'Русский'],
    proceduresAz: [
      'Uşaq check-up və inkişaf monitorinqi',
      'Peyvənd təqviminin planlanması və nəzarəti',
      'Uşaq qidalanması və immun dəstək konsultasiyası',
    ],
    proceduresEn: [
      'Pediatric check-up and growth monitoring',
      'Vaccination calendar planning and follow-up',
      'Child nutrition and immunity support consultation',
    ],
    proceduresRu: [
      'Педиатрический check-up и мониторинг развития',
      'Планирование и контроль календаря вакцинации',
      'Консультации по детскому питанию и поддержке иммунитета',
    ],
    phone: '+994 12 555 44 24',
    email: 'leyla.guliyeva@ultramed.az',
    tagsAz: ['Yenidoğulmuşların izlənməsi', 'Peyvənd təqvimi', 'Uşaq qidalanması'],
    tagsEn: ['Newborn follow-up', 'Vaccination schedule', 'Child nutrition'],
    tagsRu: ['Наблюдение новорождённых', 'Календарь прививок', 'Питание детей'],
    image:
      'https://images.unsplash.com/photo-1594824436998-dd1bd3eb073d?q=80&w=3400&auto=format&fit=crop',
    sortOrder: 4,
  },
  {
    id: 'doc-rahman-qasimli',
    name: 'Dr. Rəhman Qasımlı',
    titleAz: 'Oftalmoloq Cərrah',
    titleEn: 'Ophthalmic Surgeon',
    titleRu: 'Офтальмохирург',
    bioAz: 'Katarakta və digər göz xəstəliklərinin cərrahi müalicəsində təcrübəlidir.',
    bioEn: 'Experienced in surgical treatment of cataract and other eye diseases.',
    bioRu: 'Имеет опыт хирургического лечения катаракты и других заболеваний глаз.',
    profileAz:
      'Dr. Rəhman Qasımlı katarakta, qlaukoma və retina patologiyalarının diaqnostikası və cərrahi müalicəsi üzrə ixtisaslaşıb. Müayinə zamanı müasir optik cihazlardan istifadə edilərək dəqiq qərar verilir.',
    profileEn:
      'Dr. Rahman Qasimli specializes in diagnosis and surgical treatment of cataract, glaucoma, and retinal conditions. Clinical decisions are supported by advanced optical imaging.',
    profileRu:
      'Др. Рахман Касымлы специализируется на диагностике и хирургическом лечении катаракты, глаукомы и патологий сетчатки. Решения принимаются на основе современных методов оптической диагностики.',
    specialty: 'Oftalmologiya',
    experience: '20 il',
    educationAz: 'Milli Oftalmologiya Mərkəzi',
    educationEn: 'National Ophthalmology Center',
    educationRu: 'Национальный центр офтальмологии',
    roomAz: '4-cü mərtəbə, otaq 402',
    roomEn: '4th floor, room 402',
    roomRu: '4-й этаж, кабинет 402',
    scheduleAz: ['Bazar ertəsi - Cümə: 09:00 - 18:00', 'Şənbə: 10:00 - 13:00 (əməliyyatdan sonrakı baxış)'],
    scheduleEn: ['Monday - Friday: 09:00 - 18:00', 'Saturday: 10:00 - 13:00 (post-op follow-up)'],
    scheduleRu: ['Понедельник - Пятница: 09:00 - 18:00', 'Суббота: 10:00 - 13:00 (послеоперационный осмотр)'],
    languagesAz: ['Azərbaycan', 'Rus', 'İngilis'],
    languagesEn: ['Azerbaijani', 'Russian', 'English'],
    languagesRu: ['Азербайджанский', 'Русский', 'Английский'],
    proceduresAz: [
      'Katarakta əməliyyatına hazırlıq və nəzarət',
      'Qlaukoma skrininqi və müalicə planı',
      'Lazer korreksiyası üzrə ilkin qiymətləndirmə',
    ],
    proceduresEn: [
      'Cataract surgery preparation and follow-up',
      'Glaucoma screening and treatment planning',
      'Pre-assessment for laser vision correction',
    ],
    proceduresRu: [
      'Подготовка к операции катаракты и наблюдение',
      'Скрининг глаукомы и план лечения',
      'Первичная оценка для лазерной коррекции зрения',
    ],
    phone: '+994 12 555 44 25',
    email: 'rahman.qasimli@ultramed.az',
    tagsAz: ['Katarakta', 'Qlaukoma cərrahiyyəsi', 'Lazer korreksiyası'],
    tagsEn: ['Cataract', 'Glaucoma surgery', 'Laser correction'],
    tagsRu: ['Катаракта', 'Хирургия глаукомы', 'Лазерная коррекция'],
    image:
      'https://images.unsplash.com/photo-1537368910025-702800a4bd8f?q=80&w=3400&auto=format&fit=crop',
    sortOrder: 5,
  },
  {
    id: 'doc-nermin-abbasova',
    name: 'Dr. Nərmin Abbasova',
    titleAz: 'Ginekoloq - Cərrah',
    titleEn: 'Gynecologic Surgeon',
    titleRu: 'Гинеколог-хирург',
    bioAz: 'Qadın sağlamlığı və ginekoloji əməliyyatlar üzrə ixtisaslaşmış həkim.',
    bioEn: 'Specialized in women’s health and gynecological surgeries.',
    bioRu: 'Специализируется на женском здоровье и гинекологических операциях.',
    profileAz:
      'Dr. Nərmin Abbasova qadın sağlamlığı üzrə profilaktik müayinələr, hormonal qiymətləndirmə və cərrahi konsultasiyalar aparır. Hamiləlik planlaması və reproduktiv sağlamlıq üzrə individual yanaşma tətbiq edir.',
    profileEn:
      'Dr. Nermin Abbasova provides preventive gynecological checkups, hormonal evaluations, and surgical consultations. She applies an individualized approach for pregnancy planning and reproductive health.',
    profileRu:
      'Др. Нермин Аббасова проводит профилактические гинекологические осмотры, гормональную оценку и хирургические консультации. Используется индивидуальный подход к планированию беременности и репродуктивному здоровью.',
    specialty: 'Ginekologiya',
    experience: '10 il',
    educationAz: 'Ankara Universiteti, Tibb Fakültəsi',
    educationEn: 'Ankara University, Faculty of Medicine',
    educationRu: 'Анкарский университет, медицинский факультет',
    roomAz: '3-cü mərtəbə, otaq 318',
    roomEn: '3rd floor, room 318',
    roomRu: '3-й этаж, кабинет 318',
    scheduleAz: ['Bazar ertəsi - Cümə: 10:00 - 17:00', 'Şənbə: 10:00 - 14:00'],
    scheduleEn: ['Monday - Friday: 10:00 - 17:00', 'Saturday: 10:00 - 14:00'],
    scheduleRu: ['Понедельник - Пятница: 10:00 - 17:00', 'Суббота: 10:00 - 14:00'],
    languagesAz: ['Azərbaycan', 'Türk', 'Rus'],
    languagesEn: ['Azerbaijani', 'Turkish', 'Russian'],
    languagesRu: ['Азербайджанский', 'Турецкий', 'Русский'],
    proceduresAz: [
      'Hamiləlik planlaması və prenatal müşahidə',
      'Ginekoloji USM nəticələrinin klinik dəyərləndirilməsi',
      'Laparoskopik cərrahiyyə üzrə konsultasiya',
    ],
    proceduresEn: [
      'Pregnancy planning and prenatal follow-up',
      'Clinical interpretation of gynecological ultrasound',
      'Consultation for laparoscopic procedures',
    ],
    proceduresRu: [
      'Планирование беременности и пренатальное наблюдение',
      'Клиническая интерпретация гинекологического УЗИ',
      'Консультация по лапароскопическим вмешательствам',
    ],
    phone: '+994 12 555 44 26',
    email: 'nermin.abbasova@ultramed.az',
    tagsAz: ['Hamiləlik təqibi', 'Laparoskopik cərrahiyyə', 'Sonsuzluq'],
    tagsEn: ['Pregnancy follow-up', 'Laparoscopic surgery', 'Infertility'],
    tagsRu: ['Ведение беременности', 'Лапароскопическая хирургия', 'Бесплодие'],
    image:
      'https://images.unsplash.com/photo-1527613426441-4da17471b66d?q=80&w=3400&auto=format&fit=crop',
    sortOrder: 6,
  },
];

const blogPosts = [
  {
    id: 'blog-heart-health-rules',
    titleAz: 'Ürək sağlamlığı üçün 5 qızıl qayda',
    titleEn: '5 golden rules for heart health',
    titleRu: '5 золотых правил для здоровья сердца',
    excerptAz:
      'Kardioloqlarımızın məsləhətləri ilə gündəlik həyatınızda edəcəyiniz kiçik dəyişikliklərlə ürəyinizi qoruya bilərsiniz.',
    excerptEn:
      'With practical advice from our cardiologists, small daily changes can protect your heart.',
    excerptRu:
      'С практическими советами наших кардиологов небольшие ежедневные привычки помогут защитить сердце.',
    contentAz:
      'Sağlam qidalanma, müntəzəm fiziki aktivlik və profilaktik yoxlamalar ürək sağlamlığı üçün əsasdır.',
    contentEn:
      'Balanced nutrition, regular exercise, and preventive checkups are essential for heart health.',
    contentRu:
      'Сбалансированное питание, регулярная активность и профилактические осмотры необходимы для здоровья сердца.',
    authorName: 'Dr. Əli Vəliyev',
    categoryAz: 'Kardiologiya',
    categoryEn: 'Cardiology',
    categoryRu: 'Кардиология',
    image:
      'https://images.unsplash.com/photo-1505576399279-565b52d4ac71?q=80&w=600&auto=format&fit=crop',
    published: true,
    featured: true,
    views: 1245,
    sortOrder: 1,
    publishedAt: new Date('2024-03-14T09:00:00.000Z'),
  },
  {
    id: 'blog-spring-allergy-prevention',
    titleAz: 'Bahar aylarında allergiyadan necə qorunmalı?',
    titleEn: 'How to prevent allergies in spring?',
    titleRu: 'Как защититься от аллергии весной?',
    excerptAz:
      'Mövsümi allergiyaların qarşısını almaq və simptomları yüngülləşdirmək üçün mütəxəssis tövsiyələri.',
    excerptEn:
      'Expert recommendations to prevent seasonal allergies and reduce symptoms.',
    excerptRu:
      'Рекомендации специалистов по профилактике сезонной аллергии и снижению симптомов.',
    contentAz:
      'Allergenlərlə təmasın azaldılması və düzgün müalicə planı bahar allergiyalarında ən vacib addımdır.',
    contentEn:
      'Reducing allergen exposure and following a proper treatment plan are key during spring allergies.',
    contentRu:
      'Снижение контакта с аллергенами и грамотная терапия являются ключевыми при весенней аллергии.',
    authorName: 'Dr. Famil Abbasov',
    categoryAz: 'Terapiya',
    categoryEn: 'Therapy',
    categoryRu: 'Терапия',
    image:
      'https://images.unsplash.com/photo-1512069772995-ec65ed45afd6?q=80&w=600&auto=format&fit=crop',
    published: true,
    featured: false,
    views: 856,
    sortOrder: 2,
    publishedAt: new Date('2024-03-10T09:00:00.000Z'),
  },
  {
    id: 'blog-nutrition-basics',
    titleAz: 'Sağlam qidalanmanın əsasları nədir?',
    titleEn: 'What are the basics of healthy nutrition?',
    titleRu: 'Каковы основы здорового питания?',
    excerptAz:
      'Düzgün və balanslı qidalanma rejimi ilə immun sisteminizi necə gücləndirə biləcəyiniz haqqında vacib məlumatlar.',
    excerptEn:
      'Important guidance on how balanced nutrition can strengthen your immune system.',
    excerptRu:
      'Важная информация о том, как сбалансированное питание укрепляет иммунитет.',
    contentAz:
      'Gündəlik rasionda zülal, karbohidrat və yağ balansı immun sisteminin güclənməsinə müsbət təsir edir.',
    contentEn:
      'A balanced intake of proteins, carbohydrates, and fats positively impacts immunity.',
    contentRu:
      'Сбалансированное потребление белков, углеводов и жиров положительно влияет на иммунитет.',
    authorName: 'Dr. Leyla Quliyeva',
    categoryAz: 'Dietologiya',
    categoryEn: 'Dietetics',
    categoryRu: 'Диетология',
    image:
      'https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=600&auto=format&fit=crop',
    published: true,
    featured: false,
    views: 2314,
    sortOrder: 3,
    publishedAt: new Date('2024-02-28T09:00:00.000Z'),
  },
  {
    id: 'blog-eye-health-rules',
    titleAz: 'Göz sağlamlığını qorumağın qızıl qaydaları',
    titleEn: 'Golden rules for eye health',
    titleRu: 'Золотые правила здоровья глаз',
    excerptAz:
      'Rəqəmsal cihazlardan istifadə zamanı göz yorğunluğunun və digər problemlərin qarşısını necə almalı?',
    excerptEn:
      'How to reduce eye strain and other problems while using digital devices?',
    excerptRu:
      'Как уменьшить усталость глаз и другие проблемы при работе с цифровыми устройствами?',
    contentAz:
      'Ekran fasilələri və düzgün işıqlandırma göz sağlamlığının qorunmasında vacib rol oynayır.',
    contentEn:
      'Screen breaks and proper lighting play an important role in protecting eye health.',
    contentRu:
      'Перерывы от экранов и правильное освещение играют важную роль в здоровье глаз.',
    authorName: 'Dr. Rəhman Qasımlı',
    categoryAz: 'Oftalmologiya',
    categoryEn: 'Ophthalmology',
    categoryRu: 'Офтальмология',
    image:
      'https://images.unsplash.com/photo-1516069632884-6997cf29f4b9?q=80&w=600&auto=format&fit=crop',
    published: true,
    featured: false,
    views: 1032,
    sortOrder: 4,
    publishedAt: new Date('2024-02-20T09:00:00.000Z'),
  },
  {
    id: 'blog-posture-habits-children',
    titleAz: 'Uşaqlarda düzgün qamət vərdişləri',
    titleEn: 'Correct posture habits in children',
    titleRu: 'Правильная осанка у детей',
    excerptAz:
      'Onurğa sütununun inkişafı və məktəb yaşlı uşaqlarda skoliozun qarşısının alınması üçün ən yaxşı üsullar.',
    excerptEn:
      'Best practices to support spinal development and prevent scoliosis in school-age children.',
    excerptRu:
      'Лучшие практики для развития позвоночника и профилактики сколиоза у школьников.',
    contentAz:
      'Müntəzəm fiziki aktivlik və düzgün oturuş vərdişləri uşaqlarda qamətin formalaşmasına kömək edir.',
    contentEn:
      'Regular physical activity and proper sitting habits help children develop healthy posture.',
    contentRu:
      'Регулярная физическая активность и правильная посадка помогают формировать здоровую осанку.',
    authorName: 'Dr. Leyla Quliyeva',
    categoryAz: 'Pediatriya',
    categoryEn: 'Pediatrics',
    categoryRu: 'Педиатрия',
    image:
      'https://images.unsplash.com/photo-1473215284483-e18d6e3860bb?q=80&w=600&auto=format&fit=crop',
    published: true,
    featured: false,
    views: 764,
    sortOrder: 5,
    publishedAt: new Date('2024-02-15T09:00:00.000Z'),
  },
];

const testimonials = [
  {
    id: 'testimonial-01-nigar-hesenli',
    name: 'Nigar Həsənli',
    roleAz: 'Pasiyent',
    roleEn: 'Patient',
    roleRu: 'Пациент',
    commentAz:
      'Ultramed-dəki diqqət və peşəkarlıq həqiqətən təsiredicidir. Həkimin yanaşmasından çox razı qaldım.',
    commentEn:
      'The care and professionalism at Ultramed are truly impressive. I was very satisfied with the doctor\'s approach.',
    commentRu:
      'Внимание и профессионализм в Ultramed действительно впечатляют. Я осталась очень довольна подходом врача.',
    rating: 5,
  },
  {
    id: 'testimonial-02-samir-eliyev',
    name: 'Samir Əliyev',
    roleAz: 'Pasiyent yaxını',
    roleEn: 'Patient relative',
    roleRu: 'Родственник пациента',
    commentAz:
      'Anamın müalicəsi zamanı komanda bütün suallarımızı səbrlə cavablandırdı. Klinika təmiz, proseslər isə çox yaxşı təşkil olunmuşdu.',
    commentEn:
      'During my mother\'s treatment, the team patiently answered all our questions. The clinic was clean and processes were very well organized.',
    commentRu:
      'Во время лечения моей мамы команда терпеливо отвечала на все наши вопросы. Клиника была чистой, а процессы отлично организованы.',
    rating: 5,
  },
  {
    id: 'testimonial-03-aysel-memmedova',
    name: 'Aysel Məmmədova',
    roleAz: 'Pasiyent',
    roleEn: 'Patient',
    roleRu: 'Пациент',
    commentAz:
      'Qəbul prosesi çox rahat keçdi və laboratoriya nəticələri vaxtında çatdırıldı. Bu klinikanı təkrar seçərdim.',
    commentEn:
      'The admission process was very smooth and lab results were delivered on time. I would choose this clinic again.',
    commentRu:
      'Процесс приема прошел очень комфортно, а результаты лаборатории были предоставлены вовремя. Я бы снова выбрала эту клинику.',
    rating: 5,
  },
  {
    id: 'testimonial-04-rasim-huseynov',
    name: 'Rasim Hüseynov',
    roleAz: 'Pasiyent',
    roleEn: 'Patient',
    roleRu: 'Пациент',
    commentAz:
      'Kardiologiya şöbəsində mükəmməl xidmət aldım. Müalicə planı mənə çox aydın şəkildə izah edildi.',
    commentEn:
      'I received excellent service in the cardiology department. The treatment plan was explained to me very clearly.',
    commentRu:
      'В кардиологическом отделении я получил отличный сервис. План лечения был объяснен мне очень понятно.',
    rating: 5,
  },
];

const contentPages = [
  {
    slug: 'testimonials',
    titleAz: 'Pasiyent Rəyləri',
    titleEn: 'Patient Testimonials',
    titleRu: 'Отзывы пациентов',
    descriptionAz:
      'Pasiyent məmnuniyyəti bizim əsas prioritetimizdir. Aşağıdakı rəylər real təcrübələri əks etdirir.',
    descriptionEn:
      'Patient satisfaction is our top priority. The testimonials below reflect real treatment experiences.',
    descriptionRu:
      'Удовлетворенность пациентов является нашим главным приоритетом. Ниже представлены отзывы, основанные на реальном опыте.',
    sectionsAz: [],
    sectionsEn: [],
    sectionsRu: [],
  },
  {
    slug: 'privacy-policy',
    titleAz: 'Məxfilik Siyasəti',
    titleEn: 'Privacy Policy',
    titleRu: 'Политика конфиденциальности',
    descriptionAz:
      'Bu siyasət pasiyent məlumatlarının necə toplanması, işlənməsi və qorunmasını izah edir.',
    descriptionEn:
      'This policy explains how patient data is collected, processed, and protected.',
    descriptionRu:
      'Эта политика объясняет, как собираются, обрабатываются и защищаются данные пациентов.',
    sectionsAz: [
      {
        title: '1. Topladığımız məlumatlar',
        content:
          'Qəbula yazılmaq və tibbi xidmət göstərmək üçün ad, soyad, əlaqə məlumatları, təvəllüd və tibbi keçmiş kimi məlumatları toplayırıq.',
      },
      {
        title: '2. Məlumatların istifadə məqsədi',
        content:
          'Toplanan məlumatlar müalicə prosesləri, görüşlərin planlaşdırılması, analiz nəticələrinin idarə edilməsi və xidmət keyfiyyətinin monitorinqi üçün istifadə olunur.',
      },
      {
        title: '3. Üçüncü tərəflərlə paylaşma',
        content:
          'Qanunla tələb olunan hallar istisna olmaqla, məlumatlarınız sizin razılığınız olmadan üçüncü tərəflərlə paylaşılmır.',
      },
      {
        title: '4. Təhlükəsizlik tədbirləri',
        content:
          'Məlumatlar qorunan infrastrukturda saxlanılır və yalnız səlahiyyətli işçilər tərəfindən əldə edilə bilər.',
      },
      {
        title: '5. Əlaqə',
        content:
          'Məxfiliklə bağlı suallarınız üçün privacy@ultramed.az ünvanına müraciət edə bilərsiniz.',
      },
    ],
    sectionsEn: [
      {
        title: '1. Data we collect',
        content:
          'To schedule appointments and provide medical services, we collect information such as first and last name, contact details, date of birth, and medical history.',
      },
      {
        title: '2. Purpose of data usage',
        content:
          'Collected data is used for treatment workflows, appointment scheduling, lab result management, and service quality monitoring.',
      },
      {
        title: '3. Sharing with third parties',
        content:
          'Except where required by law, your data is not shared with third parties without your consent.',
      },
      {
        title: '4. Security measures',
        content:
          'Data is stored in protected infrastructure and can only be accessed by authorized personnel.',
      },
      {
        title: '5. Contact',
        content:
          'For privacy-related questions, please contact privacy@ultramed.az.',
      },
    ],
    sectionsRu: [
      {
        title: '1. Какие данные мы собираем',
        content:
          'Для записи на прием и оказания медицинских услуг мы собираем такие данные, как имя, фамилия, контактная информация, дата рождения и медицинский анамнез.',
      },
      {
        title: '2. Цель использования данных',
        content:
          'Собранные данные используются для процессов лечения, планирования приемов, управления результатами анализов и мониторинга качества услуг.',
      },
      {
        title: '3. Передача третьим лицам',
        content:
          'За исключением случаев, предусмотренных законом, ваши данные не передаются третьим лицам без вашего согласия.',
      },
      {
        title: '4. Меры безопасности',
        content:
          'Данные хранятся в защищенной инфраструктуре и доступны только уполномоченным сотрудникам.',
      },
      {
        title: '5. Контакты',
        content:
          'По вопросам конфиденциальности обращайтесь на privacy@ultramed.az.',
      },
    ],
  },
  {
    slug: 'terms-of-service',
    titleAz: 'İstifadə Şərtləri',
    titleEn: 'Terms of Service',
    titleRu: 'Условия использования',
    descriptionAz:
      'Bu şərtlər Ultramed platformasının istifadə qaydalarını və tərəflərin öhdəliklərini müəyyən edir.',
    descriptionEn:
      'These terms define the rules for using the Ultramed platform and the obligations of the parties.',
    descriptionRu:
      'Данные условия определяют правила использования платформы Ultramed и обязательства сторон.',
    sectionsAz: [
      {
        title: '1. Ümumi müddəalar',
        content:
          'Veb-saytdan istifadə etməklə siz bu şərtlərlə razılaşırsınız. Şərtlər zərurət yarandıqda yenilənə bilər.',
      },
      {
        title: '2. Qəbula yazılma',
        content:
          'Onlayn qeydiyyat zamanı daxil edilən məlumatların dəqiqliyi pasiyentin məsuliyyətidir.',
      },
      {
        title: '3. Məsuliyyətin məhdudlaşdırılması',
        content:
          'Veb-saytdakı məlumatlar məlumatlandırma xarakteri daşıyır və peşəkar tibbi məsləhəti əvəz etmir.',
      },
      {
        title: '4. Müəllif hüquqları',
        content:
          'Veb-saytdakı mətnlər, dizayn və media elementləri Ultramed və onun tərəfdaşlarının müəllif hüquqları ilə qorunur.',
      },
      {
        title: '5. Tətbiq olunan hüquq',
        content:
          'Hər hansı mübahisələr Azərbaycan Respublikasının qanunvericiliyinə uyğun olaraq həll edilir.',
      },
    ],
    sectionsEn: [
      {
        title: '1. General provisions',
        content:
          'By using this website, you agree to these terms. The terms may be updated when necessary.',
      },
      {
        title: '2. Appointment booking',
        content:
          'The patient is responsible for the accuracy of information entered during online registration.',
      },
      {
        title: '3. Limitation of liability',
        content:
          'Information on the website is for informational purposes and does not replace professional medical advice.',
      },
      {
        title: '4. Copyright',
        content:
          'Texts, design, and media elements on the website are protected by the copyrights of Ultramed and its partners.',
      },
      {
        title: '5. Governing law',
        content:
          'Any disputes are resolved in accordance with the legislation of the Republic of Azerbaijan.',
      },
    ],
    sectionsRu: [
      {
        title: '1. Общие положения',
        content:
          'Используя сайт, вы соглашаетесь с настоящими условиями. Условия могут обновляться при необходимости.',
      },
      {
        title: '2. Запись на прием',
        content:
          'Пациент несет ответственность за точность данных, введенных при онлайн-регистрации.',
      },
      {
        title: '3. Ограничение ответственности',
        content:
          'Информация на сайте носит ознакомительный характер и не заменяет профессиональную медицинскую консультацию.',
      },
      {
        title: '4. Авторские права',
        content:
          'Тексты, дизайн и медиа-элементы сайта защищены авторскими правами Ultramed и его партнеров.',
      },
      {
        title: '5. Применимое право',
        content:
          'Любые споры разрешаются в соответствии с законодательством Азербайджанской Республики.',
      },
    ],
  },
];

const faqs = [
  {
    id: 'faq-appointment',
    questionAz: 'Qəbula necə yazıla bilərəm?',
    questionEn: 'How can I book an appointment?',
    questionRu: 'Как записаться на прием?',
    answerAz:
      'Qəbula yazılmaq üçün sayt üzərindən formu doldura, WhatsApp ilə əlaqə saxlaya və ya klinikamıza zəng edə bilərsiniz.',
    answerEn:
      'You can book an appointment through the website form, by contacting us on WhatsApp, or by calling the clinic.',
    answerRu:
      'Вы можете записаться через форму на сайте, связаться с нами в WhatsApp или позвонить в клинику.',
  },
  {
    id: 'faq-insurance',
    questionAz: 'Sığorta ilə xidmət göstərirsiniz?',
    questionEn: 'Do you provide services through insurance?',
    questionRu: 'Вы работаете со страхованием?',
    answerAz:
      'Bəli, bir sıra sığorta şirkətləri ilə əməkdaşlıq edirik. Dəqiq məlumat üçün qəbul şöbəsi ilə əlaqə saxlayın.',
    answerEn:
      'Yes, we cooperate with selected insurance providers. Please contact reception for exact coverage details.',
    answerRu:
      'Да, мы сотрудничаем с рядом страховых компаний. Для уточнения покрытия обратитесь в регистратуру.',
  },
  {
    id: 'faq-lab-results',
    questionAz: 'Laborator analiz nəticələri nə vaxt hazır olur?',
    questionEn: 'When are laboratory test results ready?',
    questionRu: 'Когда готовы результаты лабораторных анализов?',
    answerAz:
      'Əksər analizlər gün ərzində hazır olur. Bəzi xüsusi testlər üçün nəticə müddəti daha uzun ola bilər.',
    answerEn:
      'Most tests are completed the same day. Some specialized tests may require a longer turnaround.',
    answerRu:
      'Большинство анализов готово в течение дня. Для некоторых специализированных исследований срок может быть больше.',
  },
  {
    id: 'faq-documents',
    questionAz: 'Qəbula gələrkən hansı sənədlər lazımdır?',
    questionEn: 'What documents should I bring to my appointment?',
    questionRu: 'Какие документы нужно взять на прием?',
    answerAz:
      'Şəxsiyyət vəsiqəsi, varsa əvvəlki tibbi nəticələr və sığorta sənədlərinizi özünüzlə gətirməyiniz tövsiyə olunur.',
    answerEn:
      'Please bring your ID, previous medical records (if available), and insurance documents when applicable.',
    answerRu:
      'Рекомендуем взять удостоверение личности, предыдущие медицинские результаты и страховые документы (если есть).',
  },
  {
    id: 'faq-working-hours',
    questionAz: 'Klinikanın iş saatları necədir?',
    questionEn: 'What are the clinic working hours?',
    questionRu: 'Какой график работы клиники?',
    answerAz:
      'Bazar ertəsindən cüməyə 09:00-19:00, şənbə 10:00-16:00 xidmət göstəririk.',
    answerEn:
      'We are open Monday to Friday from 09:00 to 19:00, and Saturday from 10:00 to 16:00.',
    answerRu:
      'Мы работаем с понедельника по пятницу с 09:00 до 19:00, в субботу с 10:00 до 16:00.',
  },
];

const galleryItems = [
  {
    id: 'gallery-diagnostic-room',
    imageUrl:
      'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?q=80&w=1800&auto=format&fit=crop',
    captionAz: 'Diaqnostika otağı',
    captionEn: 'Diagnostics room',
    captionRu: 'Диагностический кабинет',
  },
  {
    id: 'gallery-operation-room',
    imageUrl:
      'https://images.unsplash.com/photo-1516549655669-df522f7c8f89?q=80&w=1800&auto=format&fit=crop',
    captionAz: 'Əməliyyat zalı',
    captionEn: 'Operation room',
    captionRu: 'Операционный зал',
  },
  {
    id: 'gallery-laboratory',
    imageUrl:
      'https://images.unsplash.com/photo-1579154204601-01588f351e67?q=80&w=1800&auto=format&fit=crop',
    captionAz: 'Klinik laboratoriya',
    captionEn: 'Clinical laboratory',
    captionRu: 'Клиническая лаборатория',
  },
  {
    id: 'gallery-reception',
    imageUrl:
      'https://images.unsplash.com/photo-1538108149393-fbbd81895907?q=80&w=1800&auto=format&fit=crop',
    captionAz: 'Resepsion sahəsi',
    captionEn: 'Reception area',
    captionRu: 'Зона ресепшн',
  },
  {
    id: 'gallery-imaging',
    imageUrl:
      'https://images.unsplash.com/photo-1666214280391-8ff5bd3c0bf0?q=80&w=1800&auto=format&fit=crop',
    captionAz: 'Görüntüləmə bölməsi',
    captionEn: 'Imaging department',
    captionRu: 'Отделение визуализации',
  },
  {
    id: 'gallery-cardiology',
    imageUrl:
      'https://images.unsplash.com/photo-1584515933487-779824d29309?q=80&w=1800&auto=format&fit=crop',
    captionAz: 'Kardiologiya şöbəsi',
    captionEn: 'Cardiology department',
    captionRu: 'Кардиологическое отделение',
  },
];

const homeStats = [
  { id: 'patients', value: '15,000+', sortOrder: 1 },
  { id: 'doctors', value: '50+', sortOrder: 2 },
  { id: 'departments', value: '20+', sortOrder: 3 },
  { id: 'years', value: '15+', sortOrder: 4 },
];

function toSafeSegment(value) {
  return String(value)
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function detectFileExtension(url) {
  try {
    const pathname = new URL(url).pathname;
    const match = pathname.match(/\.([a-zA-Z0-9]+)$/);
    if (!match) {
      return 'jpg';
    }

    const extension = match[1].toLowerCase();
    if (['jpg', 'jpeg', 'png', 'webp', 'svg', 'avif'].includes(extension)) {
      return extension;
    }
  } catch {
    // fallback handled below
  }

  return 'jpg';
}

function toMimeType(extension) {
  const map = {
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    webp: 'image/webp',
    svg: 'image/svg+xml',
    avif: 'image/avif',
  };

  return map[extension] ?? 'image/jpeg';
}

async function upsertSeedMedia(entityType, entityId, url) {
  if (!url || typeof url !== 'string' || url.trim().length === 0) {
    return null;
  }

  const safeEntityType = toSafeSegment(entityType);
  const safeEntityId = toSafeSegment(entityId);
  const extension = detectFileExtension(url);
  const mediaId = `media-${safeEntityType}-${safeEntityId}`;
  const storageKey = `seed/${safeEntityType}/${safeEntityId}.${extension}`;

  return prisma.media.upsert({
    where: { id: mediaId },
    update: {
      originalName: `${safeEntityId}.${extension}`,
      mimeType: toMimeType(extension),
      size: 0,
      provider: 'seed-external',
      storageKey,
      cdnUrl: url,
    },
    create: {
      id: mediaId,
      originalName: `${safeEntityId}.${extension}`,
      mimeType: toMimeType(extension),
      size: 0,
      provider: 'seed-external',
      storageKey,
      cdnUrl: url,
    },
  });
}

async function seedAdmin() {
  const adminEmail = process.env.ADMIN_SEED_EMAIL ?? 'admin@ultramed.az';
  const adminPassword = process.env.ADMIN_SEED_PASSWORD ?? 'admin123';
  const hashedPassword = await hash(adminPassword, 12);

  await prisma.admin.upsert({
    where: { email: adminEmail },
    update: {
      password: hashedPassword,
    },
    create: {
      email: adminEmail,
      password: hashedPassword,
    },
  });
}

async function seedServices() {
  for (const service of services) {
    const media = await upsertSeedMedia('service', service.id, service.image);
    const payload = {
      ...service,
      image: media?.cdnUrl ?? service.image ?? null,
      mediaId: media?.id ?? null,
    };

    await prisma.service.upsert({
      where: { id: service.id },
      update: payload,
      create: payload,
    });
  }
}

async function seedDoctors() {
  for (const doctor of doctors) {
    const media = await upsertSeedMedia('doctor', doctor.id, doctor.image);
    const payload = {
      ...doctor,
      image: media?.cdnUrl ?? doctor.image ?? null,
      mediaId: media?.id ?? null,
    };

    await prisma.doctor.upsert({
      where: { id: doctor.id },
      update: payload,
      create: payload,
    });
  }
}

async function seedBlog() {
  for (const post of blogPosts) {
    const media = await upsertSeedMedia('blog', post.id, post.image);
    const payload = {
      ...post,
      image: media?.cdnUrl ?? post.image ?? null,
      mediaId: media?.id ?? null,
    };

    await prisma.blogPost.upsert({
      where: { id: post.id },
      update: payload,
      create: payload,
    });
  }
}

async function seedTestimonials() {
  for (const testimonial of testimonials) {
    await prisma.testimonial.upsert({
      where: { id: testimonial.id },
      update: testimonial,
      create: testimonial,
    });
  }
}

async function seedContentPages() {
  for (const page of contentPages) {
    await prisma.contentPage.upsert({
      where: { slug: page.slug },
      update: page,
      create: page,
    });
  }
}

async function seedFaq() {
  for (const item of faqs) {
    await prisma.faq.upsert({
      where: { id: item.id },
      update: item,
      create: item,
    });
  }
}

async function seedGallery() {
  for (const item of galleryItems) {
    const media = await upsertSeedMedia('gallery', item.id, item.imageUrl);
    const payload = {
      ...item,
      imageUrl: media?.cdnUrl ?? item.imageUrl,
      mediaId: media?.id ?? null,
    };

    await prisma.gallery.upsert({
      where: { id: item.id },
      update: payload,
      create: payload,
    });
  }
}

async function seedContact() {
  const contactPayload = {
    addressAz: 'Xətai rayonu Nəsrəddin Tusi 55 (Amal-2015 yaşayış kompleksi), Ultramed Clinic, Bakı, Azərbaycan',
    addressEn: 'Ultramed Clinic, Nasraddin Tusi 55 (Amal-2015 residential complex), Khatai district, Baku, Azerbaijan',
    addressRu: 'Клиника Ultramed, ул. Насреддина Туси 55 (жилой комплекс Amal-2015), Хатаинский район, Баку, Азербайджан',
    mapLatitude: 40.3763297,
    mapLongitude: 49.9628667,
    mapEmbedUrl: 'https://maps.google.com/maps?q=N%C9%99sr%C9%99ddin%20Tusi%2055%20Baku&z=15&output=embed',
    phones: [
      {
        labelAz: 'Əlaqə nömrəsi',
        labelEn: 'Phone number',
        labelRu: 'Контактный номер',
        value: '055/070-223-58-56',
      },
      {
        labelAz: 'WhatsApp',
        labelEn: 'WhatsApp',
        labelRu: 'WhatsApp',
        value: 'https://wa.me/994552235856',
      },
    ],
    emails: [
      {
        labelAz: 'E-poçt',
        labelEn: 'Email',
        labelRu: 'Эл. почта',
        value: 'ultramedclinics@gmail.com',
      },
    ],
    workingHours: [
      { labelAz: 'B.E - C', labelEn: 'Mon - Fri', labelRu: 'Пн - Пт', value: '09:00 - 19:00' },
      { labelAz: 'Şənbə', labelEn: 'Saturday', labelRu: 'Суббота', value: '10:00 - 16:00' },
    ],
  };

  await prisma.contactInfo.upsert({
    where: { slug: 'main' },
    update: contactPayload,
    create: {
      slug: 'main',
      ...contactPayload,
    },
  });
}

async function seedHomeStats() {
  for (const stat of homeStats) {
    await prisma.homeStat.upsert({
      where: { id: stat.id },
      update: stat,
      create: stat,
    });
  }
}

async function main() {
  console.log('Seeding database...');
  await seedAdmin();
  await seedServices();
  await seedDoctors();
  await seedBlog();
  await seedTestimonials();
  await seedContentPages();
  await seedFaq();
  await seedGallery();
  await seedContact();
  await seedHomeStats();
  console.log('Database seeding complete.');
}

main()
  .catch((error) => {
    console.error('Seed failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
