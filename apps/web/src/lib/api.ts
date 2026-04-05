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

export type DoctorDetailItem = {
    id: string;
    name: string;
    specialty: string;
    bio: string;
    profile: string;
    experience: string;
    education: string;
    educationDetails: string[];
    experienceDetails: string[];
    certifications: string[];
    room: string;
    schedule: string[];
    languages: string[];
    procedures: string[];
    tags: string[];
    phone: string;
    email: string;
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

export type TestimonialItem = {
    id: string;
    name: string;
    role: string;
    quote: string;
    rating: number;
};

export type TestimonialsPageResponse = {
    title: string;
    description: string;
    items: TestimonialItem[];
};

export type ContentSectionItem = {
    title: string;
    content: string;
};

export type ContentPageResponse = {
    title: string;
    description: string;
    sections: ContentSectionItem[];
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

export type FaqItem = {
    id: string;
    question: string;
    answer: string;
};

export type GalleryItem = {
    id: string;
    imageUrl: string;
    caption: string;
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

function resolveApiBaseUrl(): string {
    if (typeof window === 'undefined') {
        return (
            process.env.API_INTERNAL_URL ??
            process.env.NEXT_PUBLIC_API_URL ??
            'http://localhost:5555'
        ).replace(/\/$/, '');
    }

    return (process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5555').replace(/\/$/, '');
}

const API_BASE_URL = resolveApiBaseUrl();
const REQUEST_TIMEOUT_MS = 6000;

export class ApiRequestError extends Error {
    status: number;
    url: string;
    code?: string;

    constructor(status: number, url: string, message?: string, code?: string) {
        super(message ?? `Request failed with status ${status}: ${url}`);
        this.name = 'ApiRequestError';
        this.status = status;
        this.url = url;
        this.code = code;
    }
}

export class BackendUnavailableError extends ApiRequestError {
    constructor(url: string, message?: string, status = 503) {
        super(status, url, message ?? `Backend is temporarily unavailable: ${url}`);
        this.name = 'BackendUnavailableError';
    }
}

function isUnavailableStatus(status: number): boolean {
    return status === 502 || status === 503 || status === 504;
}

async function fetchWithTimeout(url: string): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    try {
        return await fetch(url, {
            cache: 'no-store',
            signal: controller.signal,
        });
    } catch (error) {
        const message = error instanceof Error ? error.message : undefined;
        throw new BackendUnavailableError(url, message);
    } finally {
        clearTimeout(timeoutId);
    }
}

type ApiErrorPayload = {
    message?: string | string[];
    code?: string;
    error?: {
        message?: string | string[];
        code?: string;
    };
};

function extractApiError(payload: unknown): { message?: string; code?: string } {
    if (!payload || typeof payload !== 'object') {
        return {};
    }

    const value = payload as ApiErrorPayload;
    const messageCandidate = value.message ?? value.error?.message;
    const code = value.code ?? value.error?.code;

    let message: string | undefined;
    if (Array.isArray(messageCandidate)) {
        const list = messageCandidate.filter((item): item is string => typeof item === 'string');
        if (list.length > 0) {
            message = list.join(', ');
        }
    } else if (typeof messageCandidate === 'string' && messageCandidate.length > 0) {
        message = messageCandidate;
    }

    return { message, code };
}

async function checkBackendHealth(): Promise<void> {
    const healthUrl = `${API_BASE_URL}/health`;
    const response = await fetchWithTimeout(healthUrl);

    if (!response.ok) {
        if (isUnavailableStatus(response.status) || response.status >= 500) {
            throw new BackendUnavailableError(healthUrl, undefined, response.status);
        }
        throw new ApiRequestError(response.status, healthUrl);
    }
}

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

    await checkBackendHealth();

    const response = await fetchWithTimeout(url);
    if (!response.ok) {
        let payload: unknown = null;
        try {
            payload = await response.json();
        } catch {
            payload = null;
        }

        const parsedError = extractApiError(payload);

        if (isUnavailableStatus(response.status)) {
            throw new BackendUnavailableError(url, parsedError.message, response.status);
        }
        throw new ApiRequestError(response.status, url, parsedError.message, parsedError.code);
    }

    return response.json() as Promise<T>;
}

export function isBackendUnavailableError(error: unknown): error is BackendUnavailableError {
    return error instanceof BackendUnavailableError;
}

export async function getDoctors(locale: string | undefined): Promise<DoctorListItem[]> {
    return request<DoctorListItem[]>('/doctors', { locale: toLocale(locale) });
}

export async function getDoctorById(id: string, locale: string | undefined): Promise<DoctorDetailItem | null> {
    return request<DoctorDetailItem | null>(`/doctors/${id}`, { locale: toLocale(locale) });
}

export async function getBlogPosts(locale: string | undefined): Promise<BlogListItem[]> {
    return request<BlogListItem[]>('/blog', { locale: toLocale(locale) });
}

export async function getBlogPostById(id: string, locale: string | undefined): Promise<BlogListItem | null> {
    return request<BlogListItem | null>(`/blog/${id}`, { locale: toLocale(locale) });
}

export async function getTestimonialsPage(locale: string | undefined): Promise<TestimonialsPageResponse> {
    return request<TestimonialsPageResponse>('/content/testimonials', { locale: toLocale(locale) });
}

export async function getPrivacyPolicyPage(locale: string | undefined): Promise<ContentPageResponse> {
    return request<ContentPageResponse>('/content/privacy-policy', { locale: toLocale(locale) });
}

export async function getTermsOfServicePage(locale: string | undefined): Promise<ContentPageResponse> {
    return request<ContentPageResponse>('/content/terms-of-service', { locale: toLocale(locale) });
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

export async function getFaqItems(locale: string | undefined): Promise<FaqItem[]> {
    return request<FaqItem[]>('/faq', { locale: toLocale(locale) });
}

export async function getGalleryItems(locale: string | undefined): Promise<GalleryItem[]> {
    return request<GalleryItem[]>('/gallery', { locale: toLocale(locale) });
}
