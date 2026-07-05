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

export type AdminMediaSummary = {
  id: string;
  cdnUrl: string;
  mimeType: string;
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
  mediaId: string | null;
  media: AdminMediaSummary | null;
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
  educationDetailsAz: string | null;
  educationDetailsEn: string | null;
  educationDetailsRu: string | null;
  experienceDetailsAz: string | null;
  experienceDetailsEn: string | null;
  experienceDetailsRu: string | null;
  certificationsAz: string | null;
  certificationsEn: string | null;
  certificationsRu: string | null;
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
  mediaId: string | null;
  media: AdminMediaSummary | null;
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
  mediaId: string | null;
  media: AdminMediaSummary | null;
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

export type AdminAnnouncementRecord = {
  id: string;
  textAz: string;
  textEn: string;
  textRu: string;
  href: string | null;
  sortOrder: number;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
};

export type AdminCheckupPackageRecord = {
  id: string;
  titleAz: string;
  titleEn: string;
  titleRu: string;
  subtitleAz: string | null;
  subtitleEn: string | null;
  subtitleRu: string | null;
  price: string;
  currency: string;
  sortOrder: number;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
};

export type AdminContactLocalizedItem = {
  labelAz: string;
  labelEn: string;
  labelRu: string;
  value: string;
};

export type AdminContactInfoRecord = {
  id: string;
  slug: string;
  addressAz: string;
  addressEn: string;
  addressRu: string;
  mapLatitude: number;
  mapLongitude: number;
  mapEmbedUrl: string;
  phones: AdminContactLocalizedItem[];
  emails: AdminContactLocalizedItem[];
  workingHours: AdminContactLocalizedItem[];
  createdAt: string;
  updatedAt: string;
};

export type AdminAppointmentRequestRecord = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  serviceId: string | null;
  serviceTitle: string;
  preferredDate: string;
  preferredTime: string;
  message: string | null;
  locale: string;
  source: string;
  status: string;
  createdAt: string;
  updatedAt: string;
};

export type AdminContactMessageRecord = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  locale: string;
  source: string;
  status: string;
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
  usage?: {
    services: number;
    doctors: number;
    blogPosts: number;
    galleryItems: number;
    total: number;
  };
  isOrphan?: boolean;
};

type AdminMediaUploadResponse = {
  id: string;
  url: string;
  storageKey: string;
  mimeType: string;
  size: number;
};

export type AdminMediaCleanupResult = {
  dryRun: boolean;
  olderThanHours: number;
  threshold: string;
  scannedCount: number;
  deletedCount: number;
  skippedInUseCount: number;
  fileDeletedCount: number;
  fileMissingCount: number;
  fileDeleteErrorCount: number;
  items: Array<{
    id: string;
    storageKey: string;
    cdnUrl: string;
    status:
      | 'would_delete'
      | 'deleted'
      | 'skipped_in_use'
      | 'deleted_file_missing'
      | 'deleted_file_error';
    reason?: string;
  }>;
};

type AdminErrorPayload = {
  statusCode?: number;
  code?: string;
  message?: string | string[];
  details?: unknown;
  requestId?: string;
  error?: {
    code?: string;
    message?: string | string[];
    details?: unknown;
  };
};

type ParsedAdminError = {
  code?: string;
  message?: string;
  details?: unknown;
  requestId?: string;
};

const AUTH_REAUTH_CODES = new Set([
  'AUTH_REQUIRED',
  'AUTH_SESSION_INVALID',
  'AUTH_SESSION_EXPIRED',
  'AUTH_SESSION_FINGERPRINT_MISMATCH',
  'AUTH_SESSION_IP_MISMATCH',
  'AUTH_TOKEN_INVALID',
  'AUTH_TOKEN_MALFORMED',
  'AUTH_TOKEN_EXPIRED',
  'UNAUTHORIZED',
]);

let isReauthRedirectStarted = false;

function normalizeMessage(message: string | string[] | undefined): string | undefined {
  if (Array.isArray(message)) {
    const list = message.filter((item): item is string => typeof item === 'string');
    return list.length > 0 ? list.join(', ') : undefined;
  }

  if (typeof message === 'string' && message.length > 0) {
    return message;
  }

  return undefined;
}

function parseAdminError(payload: unknown): ParsedAdminError {
  if (!payload || typeof payload !== 'object') {
    return {};
  }

  const value = payload as AdminErrorPayload;
  return {
    code: value.code ?? value.error?.code,
    message: normalizeMessage(value.message ?? value.error?.message),
    details: value.details ?? value.error?.details,
    requestId: typeof value.requestId === 'string' ? value.requestId : undefined,
  };
}

function readRetryAfterSeconds(details: unknown): number | undefined {
  if (!details || typeof details !== 'object') {
    return undefined;
  }

  const value = details as { retryAfterSeconds?: unknown };
  const retryAfterSeconds = value.retryAfterSeconds;
  if (typeof retryAfterSeconds === 'number' && Number.isFinite(retryAfterSeconds) && retryAfterSeconds > 0) {
    return Math.ceil(retryAfterSeconds);
  }

  return undefined;
}

function mapAdminErrorMessage(
  status: number,
  parsed: ParsedAdminError,
  fallback: string,
): { message: string; shouldReauthenticate: boolean; isRetryable: boolean; retryAfterSeconds?: number } {
  const code = parsed.code;
  const retryAfterSeconds = readRetryAfterSeconds(parsed.details);

  if (code === 'AUTH_INVALID_CREDENTIALS') {
    return {
      message: 'E-poct ve ya sifre yanlisdir.',
      shouldReauthenticate: false,
      isRetryable: false,
    };
  }

  if (code === 'AUTH_LOGIN_RATE_LIMITED' || code === 'TOO_MANY_REQUESTS' || status === 429) {
    return {
      message:
        retryAfterSeconds && retryAfterSeconds > 0
          ? `Cox sayda ugursuz cehd edildi. ${retryAfterSeconds} saniye sonra yeniden yoxlayin.`
          : 'Cox sayda ugursuz cehd edildi. Zehmet olmasa biraz sonra yeniden yoxlayin.',
      shouldReauthenticate: false,
      isRetryable: true,
      retryAfterSeconds,
    };
  }

  if (code === 'AUTH_ORIGIN_REQUIRED' || code === 'AUTH_ORIGIN_NOT_ALLOWED' || code === 'FORBIDDEN' || status === 403) {
    return {
      message:
        parsed.message ?? 'Tehlukesizlik yoxlamasi ugursuz oldu. Sehifeni yenileyib yeniden cehd edin.',
      shouldReauthenticate: false,
      isRetryable: false,
    };
  }

  if (code === 'MEDIA_UNSUPPORTED_FILE_TYPE') {
    return {
      message:
        'Desteklenmeyen fayl novu. JPG, PNG, WEBP, SVG ve ya AVIF istifade edin.',
      shouldReauthenticate: false,
      isRetryable: false,
    };
  }

  const shouldReauthenticate =
    (typeof code === 'string' && AUTH_REAUTH_CODES.has(code)) ||
    (status === 401 && code !== 'AUTH_INVALID_CREDENTIALS');

  if (shouldReauthenticate) {
    return {
      message: 'Sessiya bitib ve ya etibarsizdir. Zehmet olmasa yeniden daxil olun.',
      shouldReauthenticate: true,
      isRetryable: false,
    };
  }

  if (code === 'VALIDATION_ERROR' || code === 'BAD_REQUEST' || code === 'UNPROCESSABLE_ENTITY' || status === 400 || status === 422) {
    return {
      message: parsed.message ?? 'Gonderilen melumatlar duzgun deyil.',
      shouldReauthenticate: false,
      isRetryable: false,
    };
  }

  if (status >= 500) {
    return {
      message:
        parsed.message ??
        'Server terefde muveqqeti problem var. Zehmet olmasa biraz sonra yeniden yoxlayin.',
      shouldReauthenticate: false,
      isRetryable: true,
    };
  }

  return {
    message: parsed.message ?? fallback,
    shouldReauthenticate: false,
    isRetryable: status >= 500,
  };
}

export class AdminApiError extends Error {
  readonly status: number;
  readonly url: string;
  readonly code?: string;
  readonly details: unknown;
  readonly requestId?: string;
  readonly shouldReauthenticate: boolean;
  readonly isRetryable: boolean;
  readonly retryAfterSeconds?: number;

  constructor(
    status: number,
    url: string,
    options: {
      message: string;
      code?: string;
      details?: unknown;
      requestId?: string;
      shouldReauthenticate?: boolean;
      isRetryable?: boolean;
      retryAfterSeconds?: number;
    },
  ) {
    super(options.message);
    this.name = 'AdminApiError';
    this.status = status;
    this.url = url;
    this.code = options.code;
    this.details = options.details ?? null;
    this.requestId = options.requestId;
    this.shouldReauthenticate = options.shouldReauthenticate ?? false;
    this.isRetryable = options.isRetryable ?? false;
    this.retryAfterSeconds = options.retryAfterSeconds;
  }
}

export function isAdminApiError(error: unknown): error is AdminApiError {
  return error instanceof AdminApiError;
}

export function shouldForceAdminReauth(error: unknown): boolean {
  return isAdminApiError(error) && error.shouldReauthenticate;
}

export function getAdminRetryAfterSeconds(error: unknown): number | undefined {
  if (!isAdminApiError(error)) {
    return undefined;
  }
  return error.retryAfterSeconds;
}

function isAdminLoginPath(pathname: string): boolean {
  return /^(\/(az|en|ru))?\/admin\/login(\/|$)/.test(pathname);
}

function buildAdminLoginPath(pathname: string): string {
  const localeMatch = pathname.match(/^\/(az|en|ru)(?=\/|$)/);
  const localePrefix = localeMatch ? `/${localeMatch[1]}` : '';
  return `${localePrefix}/admin/login`;
}

function triggerReauthRedirect(error: AdminApiError): void {
  if (!error.shouldReauthenticate || typeof window === 'undefined') {
    return;
  }

  const pathname = window.location.pathname;
  if (isAdminLoginPath(pathname) || isReauthRedirectStarted) {
    return;
  }

  isReauthRedirectStarted = true;
  const nextPath = `${window.location.pathname}${window.location.search}`;
  const loginPath = buildAdminLoginPath(pathname);
  const target = `${loginPath}?next=${encodeURIComponent(nextPath)}`;
  window.location.assign(target);
}

function createAdminApiError(
  status: number,
  url: string,
  payload: unknown,
  fallback: string,
): AdminApiError {
  const parsed = parseAdminError(payload);
  const mapped = mapAdminErrorMessage(status, parsed, fallback);

  return new AdminApiError(status, url, {
    message: mapped.message,
    code: parsed.code,
    details: parsed.details,
    requestId: parsed.requestId,
    shouldReauthenticate: mapped.shouldReauthenticate,
    isRetryable: mapped.isRetryable,
    retryAfterSeconds: mapped.retryAfterSeconds,
  });
}

async function parseResponsePayload(response: Response): Promise<unknown> {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

function buildNetworkError(url: string, error: unknown): AdminApiError {
  const details = error instanceof Error ? { reason: error.message } : null;
  return new AdminApiError(503, url, {
    code: 'NETWORK_ERROR',
    message: 'Servere qosulmaq mumkun olmadi. Zehmet olmasa yeniden cehd edin.',
    details,
    shouldReauthenticate: false,
    isRetryable: true,
  });
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const url = `${API_BASE_URL}${path}`;

  let response: Response;
  try {
    response = await fetch(url, {
      method: options.method ?? 'GET',
      headers: options.body ? { 'Content-Type': 'application/json' } : undefined,
      credentials: 'include',
      body: options.body ? JSON.stringify(options.body) : undefined,
    });
  } catch (error) {
    throw buildNetworkError(url, error);
  }

  const payload = await parseResponsePayload(response);

  if (!response.ok) {
    const adminError = createAdminApiError(
      response.status,
      url,
      payload,
      `Request failed (${response.status})`,
    );
    triggerReauthRedirect(adminError);
    throw adminError;
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

  const url = `${API_BASE_URL}/admin/media/upload`;
  let response: Response;
  try {
    response = await fetch(url, {
      method: 'POST',
      body: formData,
      credentials: 'include',
    });
  } catch (error) {
    throw buildNetworkError(url, error);
  }

  const payload = await parseResponsePayload(response);

  if (!response.ok) {
    const adminError = createAdminApiError(
      response.status,
      url,
      payload,
      `Upload failed (${response.status})`,
    );
    triggerReauthRedirect(adminError);
    throw adminError;
  }

  return payload as AdminMediaUploadResponse;
}

export async function getAdminMedia(
  limit = 50,
  options?: { orphansOnly?: boolean; olderThanHours?: number },
): Promise<AdminMediaRecord[]> {
  const params = new URLSearchParams();
  params.set('limit', String(limit));
  if (options?.orphansOnly) {
    params.set('orphansOnly', 'true');
  }
  if (
    typeof options?.olderThanHours === 'number' &&
    Number.isFinite(options.olderThanHours) &&
    options.olderThanHours > 0
  ) {
    params.set('olderThanHours', String(Math.floor(options.olderThanHours)));
  }

  return request<AdminMediaRecord[]>(`/admin/media?${params.toString()}`);
}

export async function deleteAdminMedia(id: string): Promise<{ success: boolean }> {
  return request<{ success: boolean }>(`/admin/media/${id}`, {
    method: 'DELETE',
  });
}

export async function cleanupAdminOrphanMedia(options?: {
  dryRun?: boolean;
  limit?: number;
  olderThanHours?: number;
}): Promise<AdminMediaCleanupResult> {
  const params = new URLSearchParams();

  if (typeof options?.dryRun === 'boolean') {
    params.set('dryRun', options.dryRun ? 'true' : 'false');
  }
  if (typeof options?.limit === 'number' && Number.isFinite(options.limit) && options.limit > 0) {
    params.set('limit', String(Math.floor(options.limit)));
  }
  if (
    typeof options?.olderThanHours === 'number' &&
    Number.isFinite(options.olderThanHours) &&
    options.olderThanHours > 0
  ) {
    params.set('olderThanHours', String(Math.floor(options.olderThanHours)));
  }

  const query = params.toString();
  const path = query.length > 0
    ? `/admin/media/cleanup-orphans?${query}`
    : '/admin/media/cleanup-orphans';

  return request<AdminMediaCleanupResult>(path, {
    method: 'POST',
  });
}

export async function getAdminAnnouncements(): Promise<AdminAnnouncementRecord[]> {
  return request<AdminAnnouncementRecord[]>('/home/announcements/admin/all');
}

export async function createAdminAnnouncement(
  data: Partial<AdminAnnouncementRecord>,
): Promise<AdminAnnouncementRecord> {
  return request<AdminAnnouncementRecord>('/home/announcements', {
    method: 'POST',
    body: data,
  });
}

export async function updateAdminAnnouncement(
  id: string,
  data: Partial<AdminAnnouncementRecord>,
): Promise<AdminAnnouncementRecord> {
  return request<AdminAnnouncementRecord>(`/home/announcements/${id}`, {
    method: 'PUT',
    body: data,
  });
}

export async function deleteAdminAnnouncement(id: string): Promise<AdminAnnouncementRecord> {
  return request<AdminAnnouncementRecord>(`/home/announcements/${id}`, {
    method: 'DELETE',
  });
}

export async function getAdminCheckupPackages(): Promise<AdminCheckupPackageRecord[]> {
  return request<AdminCheckupPackageRecord[]>('/home/checkup-packages/admin/all');
}

export async function createAdminCheckupPackage(
  data: Partial<AdminCheckupPackageRecord>,
): Promise<AdminCheckupPackageRecord> {
  return request<AdminCheckupPackageRecord>('/home/checkup-packages', {
    method: 'POST',
    body: data,
  });
}

export async function updateAdminCheckupPackage(
  id: string,
  data: Partial<AdminCheckupPackageRecord>,
): Promise<AdminCheckupPackageRecord> {
  return request<AdminCheckupPackageRecord>(`/home/checkup-packages/${id}`, {
    method: 'PUT',
    body: data,
  });
}

export async function deleteAdminCheckupPackage(id: string): Promise<AdminCheckupPackageRecord> {
  return request<AdminCheckupPackageRecord>(`/home/checkup-packages/${id}`, {
    method: 'DELETE',
  });
}

export async function getAdminContactInfos(): Promise<AdminContactInfoRecord[]> {
  return request<AdminContactInfoRecord[]>('/contact/admin/all');
}

export async function createAdminContactInfo(
  data: Partial<AdminContactInfoRecord>,
): Promise<AdminContactInfoRecord> {
  return request<AdminContactInfoRecord>('/contact', {
    method: 'POST',
    body: data,
  });
}

export async function updateAdminContactInfo(
  slug: string,
  data: Partial<AdminContactInfoRecord>,
): Promise<AdminContactInfoRecord> {
  return request<AdminContactInfoRecord>(`/contact/${slug}`, {
    method: 'PUT',
    body: data,
  });
}

export async function deleteAdminContactInfo(slug: string): Promise<AdminContactInfoRecord> {
  return request<AdminContactInfoRecord>(`/contact/${slug}`, {
    method: 'DELETE',
  });
}

export async function getAdminAppointmentRequests(limit = 200): Promise<AdminAppointmentRequestRecord[]> {
  return request<AdminAppointmentRequestRecord[]>(`/appointments/admin/all?limit=${limit}`);
}

export async function deleteAdminAppointmentRequest(id: string): Promise<{ id: string }> {
  return request<{ id: string }>(`/appointments/admin/${id}`, {
    method: 'DELETE',
  });
}

export async function deleteAdminAppointmentRequests(ids: string[]): Promise<{ deletedCount: number }> {
  return request<{ deletedCount: number }>('/appointments/admin/delete-many', {
    method: 'POST',
    body: { ids },
  });
}

export async function getAdminContactMessages(limit = 200): Promise<AdminContactMessageRecord[]> {
  return request<AdminContactMessageRecord[]>(`/contact/messages/admin/all?limit=${limit}`);
}

export async function deleteAdminContactMessage(id: string): Promise<{ id: string }> {
  return request<{ id: string }>(`/contact/messages/admin/${id}`, {
    method: 'DELETE',
  });
}

export async function deleteAdminContactMessages(ids: string[]): Promise<{ deletedCount: number }> {
  return request<{ deletedCount: number }>('/contact/messages/admin/delete-many', {
    method: 'POST',
    body: { ids },
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
