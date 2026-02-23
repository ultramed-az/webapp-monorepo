const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5555').replace(/\/$/, '');

export const ADMIN_AUTH_COOKIE = 'ultramed_admin_token';

type AdminIdentity = {
  id: string;
  email: string;
  sessionId?: string;
};

export type AdminSessionResponse = {
  authenticated: boolean;
  admin: AdminIdentity;
};

export async function loginAdmin(email: string, password: string): Promise<{
  success: boolean;
  admin: AdminIdentity;
  expiresAt: string;
}> {
  const response = await fetch(`${API_BASE_URL}/admin/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    let message = 'Login failed';

    try {
      const payload = (await response.json()) as { message?: string | string[] };
      if (Array.isArray(payload.message)) {
        message = payload.message.join(', ');
      } else if (typeof payload.message === 'string') {
        message = payload.message;
      }
    } catch {
      // Ignore JSON parse errors and keep fallback text.
    }

    throw new Error(message);
  }

  return response.json() as Promise<{
    success: boolean;
    admin: AdminIdentity;
    expiresAt: string;
  }>;
}

export async function logoutAdmin(): Promise<void> {
  await fetch(`${API_BASE_URL}/admin/logout`, {
    method: 'POST',
    credentials: 'include',
  });
}
