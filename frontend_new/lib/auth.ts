export function getToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('agrimind-token')
}

export function isAuthenticated(): boolean {
  return !!getToken()
}

export async function authFetch(url: string, options: RequestInit = {}) {
  const token = getToken()
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  }
  if (token) headers['Authorization'] = `Bearer ${token}`

  return fetch(url, { ...options, headers })
}