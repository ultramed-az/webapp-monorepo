const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5555').replace(/\/$/, '');

export const ADMIN_AUTH_COOKIE = 'ultramed_admin_token';

type RequestOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: unknown;
};

type AdminIdentity = {
  id: string;
  email: string;
  sessionId?: string;
};

export type AdminSessionResponse = {
  authenticated: boolean;
  admin: AdminIdentity;
};

export type AdminSessionItem = {
  id: string;
  createdAt: string;
  expiresAt: string;
  ipAddress: string | null;
  userAgent: string | null;
  isCurrent: boolean;
};

export type AdminServiceRecord = {
  id: string;
  titleAz: string;
  titleEn: string;
  titleRu: string;
  summaryAz: string;
  summaryEn: string;
  summaryRu: string;
  contentAz: string;
  contentEn: string;
  contentRu: string;
  highlightsAz: string[] | null;
  highlightsEn: string[] | null;
  highlightsRu: string[] | null;
  iconKey: string | null;
  image: string | null;
  sortOrder: number;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
};

export type AdminDoctorRecord = {
  id: string;
  name: string;
  titleAz: string;
  titleEn: string;
  titleRu: string;
  bioAz: string;
  bioEn: string;
  bioRu: string;
  profileAz: string | null;
  profileEn: string | null;
  profileRu: string | null;
  image: string | null;
  specialty: string;
  experience: string | null;
  educationAz: string | null;
  educationEn: string | null;
  educationRu: string | null;
  roomAz: string | null;
  roomEn: string | null;
  roomRu: string | null;
  scheduleAz: string[] | null;
  scheduleEn: string[] | null;
  scheduleRu: string[] | null;
  languagesAz: string[] | null;
  languagesEn: string[] | null;
  languagesRu: string[] | null;
  proceduresAz: string[] | null;
  proceduresEn: string[] | null;
  proceduresRu: string[] | null;
  phone: string | null;
  email: string | null;
  tagsAz: string[] | null;
  tagsEn: string[] | null;
  tagsRu: string[] | null;
  sortOrder: number;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
};

export type AdminBlogRecord = {
  id: string;
  titleAz: string;
  titleEn: string;
  titleRu: string;
  contentAz: string;
  contentEn: string;
  contentRu: string;
  excerptAz: string | null;
  excerptEn: string | null;
  excerptRu: string | null;
  authorName: string | null;
  categoryAz: string | null;
  categoryEn: string | null;
  categoryRu: string | null;
  image: string | null;
  published: boolean;
  featured: boolean;
  views: number;
  publishedAt: string | null;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
};

export type AdminTestimonialRecord = {
  id: string;
  name: string;
  roleAz: string | null;
  roleEn: string | null;
  roleRu: string | null;
  commentAz: string;
  commentEn: string;
  commentRu: string;
  rating: number;
  createdAt: string;
  updatedAt: string;
};

export type AdminContentSectionRecord = {
  title: string;
  content: string;
};

export type AdminContentPageRecord = {
  id: string;
  slug: string;
  titleAz: string;
  titleEn: string;
  titleRu: string;
  descriptionAz: string;
  descriptionEn: string;
  descriptionRu: string;
  sectionsAz: AdminContentSectionRecord[] | null;
  sectionsEn: AdminContentSectionRecord[] | null;
  sectionsRu: AdminContentSectionRecord[] | null;
  createdAt: string;
  updatedAt: string;
};

export type AdminFaqRecord = {
  id: string;
  questionAz: string;
  questionEn: string;
  questionRu: string;
  answerAz: string;
  answerEn: string;
  answerRu: string;
  createdAt: string;
  updatedAt: string;
};

export type AdminGalleryRecord = {
  id: string;
  imageUrl: string;
  captionAz: string | null;
  captionEn: string | null;
  captionRu: string | null;
  createdAt: string;
  updatedAt: string;
};

export type AdminMediaRecord = {
  id: string;
  originalName: string;
  mimeType: string;
  size: number;
  provider: string;
  storageKey: string;
  cdnUrl: string;
  createdAt: string;
  updatedAt: string;
};

type AdminMediaUploadResponse = {
  id: string;
  url: string;
  storageKey: string;
  mimeType: string;
  size: number;
};

function toErrorMessage(payload: unknown, fallback: string): string {
  if (!payload || typeof payload !== 'object') {
    return fallback;
  }

  const message = (payload as { message?: string | string[] }).message;
  if (Array.isArray(message)) {
    return message.join(', ');
  }
  if (typeof message === 'string') {
    return message;
  }
  return fallback;
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: options.method ?? 'GET',
    headers: options.body ? { 'Content-Type': 'application/json' } : undefined,
    credentials: 'include',
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  let payload: unknown = null;
  try {
    payload = await response.json();
  } catch {
    payload = null;
  }

  if (!response.ok) {
    throw new Error(toErrorMessage(payload, `Request failed (${response.status})`));
  }

  return payload as T;
}

export async function loginAdmin(email: string, password: string): Promise<{
  success: boolean;
  admin: AdminIdentity;
  expiresAt: string;
}> {
  return request('/admin/login', {
    method: 'POST',
    body: { email, password },
  });
}

export async function logoutAdmin(): Promise<void> {
  await request('/admin/logout', {
    method: 'POST',
  });
}

export async function getAdminSession(): Promise<AdminSessionResponse> {
  return request<AdminSessionResponse>('/admin/session');
}

export async function getAdminSessions(): Promise<AdminSessionItem[]> {
  return request<AdminSessionItem[]>('/admin/sessions');
}

export async function logoutAllAdmin(): Promise<void> {
  await request('/admin/logout-all', {
    method: 'POST',
  });
}

export async function revokeAdminSession(sessionId: string): Promise<{ success: boolean }> {
  return request<{ success: boolean }>(`/admin/sessions/${sessionId}`, {
    method: 'DELETE',
  });
}

export async function uploadAdminMedia(file: File): Promise<AdminMediaUploadResponse> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_BASE_URL}/admin/media/upload`, {
    method: 'POST',
    body: formData,
    credentials: 'include',
  });

  let payload: unknown = null;
  try {
    payload = await response.json();
  } catch {
    payload = null;
  }

  if (!response.ok) {
    throw new Error(toErrorMessage(payload, `Upload failed (${response.status})`));
  }

  return payload as AdminMediaUploadResponse;
}

export async function getAdminMedia(limit = 50): Promise<AdminMediaRecord[]> {
  return request<AdminMediaRecord[]>(`/admin/media?limit=${limit}`);
}

export async function deleteAdminMedia(id: string): Promise<{ success: boolean }> {
  return request<{ success: boolean }>(`/admin/media/${id}`, {
    method: 'DELETE',
  });
}

export async function getAdminServices(): Promise<AdminServiceRecord[]> {
  return request<AdminServiceRecord[]>('/services/admin/all');
}

export async function createAdminService(data: Partial<AdminServiceRecord>): Promise<AdminServiceRecord> {
  return request<AdminServiceRecord>('/services', {
    method: 'POST',
    body: data,
  });
}

export async function updateAdminService(id: string, data: Partial<AdminServiceRecord>): Promise<AdminServiceRecord> {
  return request<AdminServiceRecord>(`/services/${id}`, {
    method: 'PUT',
    body: data,
  });
}

export async function deleteAdminService(id: string): Promise<AdminServiceRecord> {
  return request<AdminServiceRecord>(`/services/${id}`, {
    method: 'DELETE',
  });
}

export async function getAdminDoctors(): Promise<AdminDoctorRecord[]> {
  return request<AdminDoctorRecord[]>('/doctors/admin/all');
}

export async function createAdminDoctor(data: Partial<AdminDoctorRecord>): Promise<AdminDoctorRecord> {
  return request<AdminDoctorRecord>('/doctors', {
    method: 'POST',
    body: data,
  });
}

export async function updateAdminDoctor(id: string, data: Partial<AdminDoctorRecord>): Promise<AdminDoctorRecord> {
  return request<AdminDoctorRecord>(`/doctors/${id}`, {
    method: 'PUT',
    body: data,
  });
}

export async function deleteAdminDoctor(id: string): Promise<AdminDoctorRecord> {
  return request<AdminDoctorRecord>(`/doctors/${id}`, {
    method: 'DELETE',
  });
}

export async function getAdminBlogPosts(): Promise<AdminBlogRecord[]> {
  return request<AdminBlogRecord[]>('/blog/admin/all');
}

export async function createAdminBlogPost(data: Partial<AdminBlogRecord>): Promise<AdminBlogRecord> {
  return request<AdminBlogRecord>('/blog', {
    method: 'POST',
    body: data,
  });
}

export async function updateAdminBlogPost(id: string, data: Partial<AdminBlogRecord>): Promise<AdminBlogRecord> {
  return request<AdminBlogRecord>(`/blog/${id}`, {
    method: 'PUT',
    body: data,
  });
}

export async function deleteAdminBlogPost(id: string): Promise<AdminBlogRecord> {
  return request<AdminBlogRecord>(`/blog/${id}`, {
    method: 'DELETE',
  });
}

export async function getAdminTestimonials(): Promise<AdminTestimonialRecord[]> {
  return request<AdminTestimonialRecord[]>('/content/admin/testimonials');
}

export async function createAdminTestimonial(
  data: Partial<AdminTestimonialRecord>,
): Promise<AdminTestimonialRecord> {
  return request<AdminTestimonialRecord>('/content/testimonials', {
    method: 'POST',
    body: data,
  });
}

export async function updateAdminTestimonial(
  id: string,
  data: Partial<AdminTestimonialRecord>,
): Promise<AdminTestimonialRecord> {
  return request<AdminTestimonialRecord>(`/content/testimonials/${id}`, {
    method: 'PUT',
    body: data,
  });
}

export async function deleteAdminTestimonial(id: string): Promise<AdminTestimonialRecord> {
  return request<AdminTestimonialRecord>(`/content/testimonials/${id}`, {
    method: 'DELETE',
  });
}

export async function getAdminContentPage(slug: string): Promise<AdminContentPageRecord | null> {
  return request<AdminContentPageRecord | null>(`/content/admin/pages/${slug}`);
}

export async function updateAdminContentPage(
  slug: string,
  data: Partial<AdminContentPageRecord>,
): Promise<AdminContentPageRecord> {
  return request<AdminContentPageRecord>(`/content/pages/${slug}`, {
    method: 'PUT',
    body: data,
  });
}

export async function getAdminFaqs(): Promise<AdminFaqRecord[]> {
  return request<AdminFaqRecord[]>('/faq/admin/all');
}

export async function createAdminFaq(data: Partial<AdminFaqRecord>): Promise<AdminFaqRecord> {
  return request<AdminFaqRecord>('/faq', {
    method: 'POST',
    body: data,
  });
}

export async function updateAdminFaq(id: string, data: Partial<AdminFaqRecord>): Promise<AdminFaqRecord> {
  return request<AdminFaqRecord>(`/faq/${id}`, {
    method: 'PUT',
    body: data,
  });
}

export async function deleteAdminFaq(id: string): Promise<AdminFaqRecord> {
  return request<AdminFaqRecord>(`/faq/${id}`, {
    method: 'DELETE',
  });
}

export async function getAdminGalleryItems(): Promise<AdminGalleryRecord[]> {
  return request<AdminGalleryRecord[]>('/gallery/admin/all');
}

export async function createAdminGalleryItem(
  data: Partial<AdminGalleryRecord>,
): Promise<AdminGalleryRecord> {
  return request<AdminGalleryRecord>('/gallery', {
    method: 'POST',
    body: data,
  });
}

export async function updateAdminGalleryItem(
  id: string,
  data: Partial<AdminGalleryRecord>,
): Promise<AdminGalleryRecord> {
  return request<AdminGalleryRecord>(`/gallery/${id}`, {
    method: 'PUT',
    body: data,
  });
}

export async function deleteAdminGalleryItem(id: string): Promise<AdminGalleryRecord> {
  return request<AdminGalleryRecord>(`/gallery/${id}`, {
    method: 'DELETE',
  });
}
