export type SupportedLocale = 'az' | 'en' | 'ru';

export type DoctorListItem = {
    id: string;
    name: string;
    specialty: string;
    bio: string;
    experience: string;
    education: string;
    tags: string[];
    image: string | null;
};

export type BlogListItem = {
    id: string;
    title: string;
    excerpt: string;
    content: string;
    author: string;
    category: string;
    image: string | null;
    featured: boolean;
    views: number;
    date: string;
};

export type ContactItem = {
    label: string;
    value: string;
};

export type ContactInfoResponse = {
    address: string;
    map: {
        latitude: number;
        longitude: number;
        embedUrl: string;
    };
    phones: ContactItem[];
    emails: ContactItem[];
    workingHours: ContactItem[];
};

export type HomeStatItem = {
    id: string;
    value: string;
};

export type ServiceListItem = {
    id: string;
    title: string;
    summary: string;
    iconKey: string | null;
    image: string | null;
};

export type ServiceDetailItem = {
    id: string;
    title: string;
    summary: string;
    content: string;
    highlights: string[];
    iconKey: string | null;
    image: string | null;
};

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5555').replace(/\/$/, '');

function toLocale(locale: string | undefined): SupportedLocale {
    if (locale === 'en' || locale === 'ru') {
        return locale;
    }
    return 'az';
}

async function request<T>(path: string, query?: Record<string, string | undefined>): Promise<T> {
    const params = new URLSearchParams();
    if (query) {
        for (const [key, value] of Object.entries(query)) {
            if (typeof value === 'string' && value.length > 0) {
                params.set(key, value);
            }
        }
    }

    const queryString = params.toString();
    const url = `${API_BASE_URL}${path}${queryString ? `?${queryString}` : ''}`;

    const response = await fetch(url, { cache: 'no-store' });
    if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}: ${url}`);
    }

    return response.json() as Promise<T>;
}

export async function getDoctors(locale: string | undefined): Promise<DoctorListItem[]> {
    return request<DoctorListItem[]>('/doctors', { locale: toLocale(locale) });
}

export async function getBlogPosts(locale: string | undefined): Promise<BlogListItem[]> {
    return request<BlogListItem[]>('/blog', { locale: toLocale(locale) });
}

export async function getContactInfo(locale: string | undefined): Promise<ContactInfoResponse> {
    return request<ContactInfoResponse>('/contact', { locale: toLocale(locale) });
}

export async function getHomeStats(): Promise<HomeStatItem[]> {
    return request<HomeStatItem[]>('/home/stats');
}

export async function getServices(locale: string | undefined): Promise<ServiceListItem[]> {
    return request<ServiceListItem[]>('/services', { locale: toLocale(locale) });
}

export async function getServiceById(id: string, locale: string | undefined): Promise<ServiceDetailItem | null> {
    return request<ServiceDetailItem | null>(`/services/${id}`, { locale: toLocale(locale) });
}
