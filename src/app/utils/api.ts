export const API_URL = 'http://localhost:5000/api';

export async function apiFetch(
  path: string,
  init: RequestInit = {},
  token = '',
): Promise<Response> {
  try {
    return await fetch(`${API_URL}${path}`, {
      ...init,
      headers: {
        'content-type': 'application/json',
        ...(token ? { authorization: `Bearer ${token}` } : {}),
      },
    });
  } catch {
    return Response.error();
  }
}
