export interface ApiClientOptions {
  baseUrl?: string
  headers?: Record<string, string>
}

export class ApiClient {
  private baseUrl: string
  private defaultHeaders: Record<string, string>

  constructor(options: ApiClientOptions = {}) {
    this.baseUrl = options.baseUrl || process.env.NEXT_PUBLIC_API_BASE || ''
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    }
  }

  async get<T>(path: string, params?: Record<string, string | number | boolean>): Promise<T> {
    const url = new URL(this.resolve(path))
    if (params) {
      Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, String(v)))
    }
    const res = await fetch(url.toString(), { headers: this.defaultHeaders, method: 'GET' })
    if (!res.ok) throw new Error(`GET ${url} failed: ${res.status}`)
    return res.json() as Promise<T>
  }

  async post<T>(path: string, body?: unknown): Promise<T> {
    const url = this.resolve(path)
    const res = await fetch(url, {
      method: 'POST',
      headers: this.defaultHeaders,
      body: body ? JSON.stringify(body) : undefined
    })
    if (!res.ok) throw new Error(`POST ${url} failed: ${res.status}`)
    return res.json() as Promise<T>
  }

  private resolve(path: string): string {
    if (!this.baseUrl) return path
    return `${this.baseUrl.replace(/\/$/, '')}/${path.replace(/^\//, '')}`
  }
}

export const apiClient = new ApiClient()


