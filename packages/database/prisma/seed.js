/* eslint-disable no-console */
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

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
    specialty: 'Kardiologiya',
    experience: '15 il',
    educationAz: 'Ege Universiteti, Tibb Fakültəsi',
    educationEn: 'Ege University, Faculty of Medicine',
    educationRu: 'Эгейский университет, медицинский факультет',
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
    specialty: 'Nevrologiya',
    experience: '8 il',
    educationAz: 'Azərbaycan Tibb Universiteti',
    educationEn: 'Azerbaijan Medical University',
    educationRu: 'Азербайджанский медицинский университет',
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
    specialty: 'Stomatologiya',
    experience: '12 il',
    educationAz: 'Hacettepe Universiteti, Diş Həkimliyi',
    educationEn: 'Hacettepe University, Dentistry',
    educationRu: 'Университет Хаджеттепе, стоматология',
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
    specialty: 'Pediatriya',
    experience: '5 il',
    educationAz: 'İstanbul Universiteti, Cərrahpaşa Tibb Fakültəsi',
    educationEn: 'Istanbul University, Cerrahpasa Faculty of Medicine',
    educationRu: 'Стамбульский университет, медицинский факультет Джеррахпаша',
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
    specialty: 'Oftalmologiya',
    experience: '20 il',
    educationAz: 'Milli Oftalmologiya Mərkəzi',
    educationEn: 'National Ophthalmology Center',
    educationRu: 'Национальный центр офтальмологии',
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
    specialty: 'Ginekologiya',
    experience: '10 il',
    educationAz: 'Ankara Universiteti, Tibb Fakültəsi',
    educationEn: 'Ankara University, Faculty of Medicine',
    educationRu: 'Анкарский университет, медицинский факультет',
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

const homeStats = [
  { id: 'patients', value: '15,000+', sortOrder: 1 },
  { id: 'doctors', value: '50+', sortOrder: 2 },
  { id: 'departments', value: '20+', sortOrder: 3 },
  { id: 'years', value: '15+', sortOrder: 4 },
];

async function seedAdmin() {
  await prisma.admin.upsert({
    where: { email: 'admin@ultramed.az' },
    update: {},
    create: {
      email: 'admin@ultramed.az',
      password: 'admin123',
    },
  });
}

async function seedDoctors() {
  for (const doctor of doctors) {
    await prisma.doctor.upsert({
      where: { id: doctor.id },
      update: doctor,
      create: doctor,
    });
  }
}

async function seedBlog() {
  for (const post of blogPosts) {
    await prisma.blogPost.upsert({
      where: { id: post.id },
      update: post,
      create: post,
    });
  }
}

async function seedContact() {
  await prisma.contactInfo.upsert({
    where: { slug: 'main' },
    update: {
      addressAz: 'Bakı şəhəri, Nəsimi rayonu, Səməd Vurğun küçəsi 14A',
      addressEn: '14A Samad Vurgun street, Nasimi district, Baku',
      addressRu: 'г. Баку, Насиминский район, ул. Самеда Вургуна 14A',
      mapLatitude: 40.3771901,
      mapLongitude: 49.8394444,
      mapEmbedUrl:
        'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3039.4286745147575!2d49.83944441539243!3d40.37719007936952!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40307dabacc0eb35%3A0xad52d0fa31b143ec!2sBaku%2C%20Azerbaijan!5e0!3m2!1sen!2s!4v1620000000000!5m2!1sen!2s',
      phones: [
        {
          labelAz: 'Mərkəzi Çağrı Mərkəzi',
          labelEn: 'Main Call Center',
          labelRu: 'Главный колл-центр',
          value: '*4444',
        },
        {
          labelAz: 'Əlaqə nömrəsi',
          labelEn: 'Phone number',
          labelRu: 'Контактный номер',
          value: '+994 12 555 44 44',
        },
      ],
      emails: [
        { labelAz: 'Ümumi', labelEn: 'General', labelRu: 'Общий', value: 'info@ultramed.az' },
        { labelAz: 'Dəstək', labelEn: 'Support', labelRu: 'Поддержка', value: 'support@ultramed.az' },
      ],
      workingHours: [
        { labelAz: 'B.E - Ş', labelEn: 'Mon - Fri', labelRu: 'Пн - Пт', value: '08:00 - 20:00' },
        { labelAz: 'Şənbə', labelEn: 'Saturday', labelRu: 'Суббота', value: '09:00 - 15:00' },
      ],
    },
    create: {
      slug: 'main',
      addressAz: 'Bakı şəhəri, Nəsimi rayonu, Səməd Vurğun küçəsi 14A',
      addressEn: '14A Samad Vurgun street, Nasimi district, Baku',
      addressRu: 'г. Баку, Насиминский район, ул. Самеда Вургуна 14A',
      mapLatitude: 40.3771901,
      mapLongitude: 49.8394444,
      mapEmbedUrl:
        'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3039.4286745147575!2d49.83944441539243!3d40.37719007936952!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40307dabacc0eb35%3A0xad52d0fa31b143ec!2sBaku%2C%20Azerbaijan!5e0!3m2!1sen!2s!4v1620000000000!5m2!1sen!2s',
      phones: [
        {
          labelAz: 'Mərkəzi Çağrı Mərkəzi',
          labelEn: 'Main Call Center',
          labelRu: 'Главный колл-центр',
          value: '*4444',
        },
        {
          labelAz: 'Əlaqə nömrəsi',
          labelEn: 'Phone number',
          labelRu: 'Контактный номер',
          value: '+994 12 555 44 44',
        },
      ],
      emails: [
        { labelAz: 'Ümumi', labelEn: 'General', labelRu: 'Общий', value: 'info@ultramed.az' },
        { labelAz: 'Dəstək', labelEn: 'Support', labelRu: 'Поддержка', value: 'support@ultramed.az' },
      ],
      workingHours: [
        { labelAz: 'B.E - Ş', labelEn: 'Mon - Fri', labelRu: 'Пн - Пт', value: '08:00 - 20:00' },
        { labelAz: 'Şənbə', labelEn: 'Saturday', labelRu: 'Суббота', value: '09:00 - 15:00' },
      ],
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
  await seedDoctors();
  await seedBlog();
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
