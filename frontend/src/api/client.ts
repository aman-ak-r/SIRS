const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

interface RequestOptions extends RequestInit {
  token?: string;
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (options.token) {
    headers.Authorization = `Bearer ${options.token}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let message = 'Something went wrong';
    try {
      const errorBody = (await response.json()) as { message?: string | string[] };
      message = Array.isArray(errorBody.message)
        ? errorBody.message.join(', ')
        : (errorBody.message ?? message);
    } catch {
      // keep default message when API does not return JSON
    }
    throw new Error(message);
  }

  return response.json() as Promise<T>;
}
