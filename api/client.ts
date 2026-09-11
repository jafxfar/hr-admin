import { clearAuthStorage } from '@/lib/auth-storage'
import { notifyActivity } from '@/lib/activity-tracker'
import { createApiErrorFromBody } from '@/lib/api-error'
import { USE_MOCK_DATA } from '@/lib/mock-config'
import { handleMockRequest } from '@/mock/handlers'

const PUBLIC_PATHS = ['/auth/login', '/auth/refresh']

function redirectToLogin() {
    if (typeof window !== 'undefined') {
        clearAuthStorage();
        window.location.href = '/login';
    }
}

class ApiClient {
    private readonly baseUrl: string;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    private async request<T>(
        endpoint: string,
        options: RequestInit = {},
        retry = true,
        responseType: 'blob' | 'json' = 'json',
    ): Promise<T> {
        if (USE_MOCK_DATA) {
            return handleMockRequest<T>(endpoint, options, responseType)
        }

        const url = `${this.baseUrl}${endpoint}`;

        const token = localStorage.getItem("accessToken");

        const isPublicEndpoint = PUBLIC_PATHS.some(path => endpoint.startsWith(path));

        if (!token && !isPublicEndpoint) {
            redirectToLogin();
            return Promise.reject(new Error('Unauthorized'));
        }

        const isFormData = options.body instanceof FormData;

        const config: RequestInit = {
            ...options,
            headers: {
                ...(isFormData ? {} : {"Content-Type": "application/json"}),
                ...(token ? {Authorization: `Bearer ${token}`} : {}),
                ...options.headers,
            },
        };

        const response = await fetch(url, config)

        const rolledRaw = response.headers.get('X-Access-Token') ?? response.headers.get('Authorization')
        if (rolledRaw) {
            const rolled = rolledRaw.startsWith('Bearer ') ? rolledRaw.slice(7).trim() : rolledRaw
            if (rolled) {
                localStorage.setItem('accessToken', rolled)
            }
        }

        const skipActivityPing = endpoint.startsWith('/auth/refresh');
        if (!skipActivityPing) {
            notifyActivity();
        }

        if (response.status === 401 && !isPublicEndpoint) {
            redirectToLogin();
            return Promise.reject(new Error('Unauthorized'));
        }

        if (!response.ok) {
            let errorData: unknown
            try {
                errorData = await response.json()
            } catch {
                errorData = undefined
            }

            throw createApiErrorFromBody(errorData, response.status)
        }

        if (responseType === "blob") {
            return await response.blob() as T;
        }

        const text = await response.text();
        if (!text) {
            return {} as T;
        }

        return JSON.parse(text) as T;
    }

    async get<T>(
        endpoint: string,
        params?: Record<string, string | number>,
        responseType: 'blob' | 'json' = 'json',
    ): Promise<T> {
        let url = endpoint;

        if (params) {
            const searchParams = new URLSearchParams();
            Object.entries(params).forEach(([key, value]) => {
                searchParams.append(key, String(value));
            });
            url = `${endpoint}?${searchParams.toString()}`;
        }

        return this.request<T>(url, {method: "GET"}, true, responseType);
    }

    async post<T>(endpoint: string, data?: unknown): Promise<T> {
        return this.request<T>(endpoint, {
            method: "POST",
            body:
                data instanceof FormData
                    ? data
                    : data
                        ? JSON.stringify(data)
                        : undefined,
        });
    }

    async put<T>(endpoint: string, data?: unknown): Promise<T> {
        return this.request<T>(endpoint, {
            method: "PUT",
            body:
                data instanceof FormData
                    ? data
                    : data
                        ? JSON.stringify(data)
                        : undefined,
        });
    }

    async patch<T>(endpoint: string, data?: unknown): Promise<T> {
        return this.request<T>(endpoint, {
            method: "PATCH",
            body:
                data instanceof FormData
                    ? data
                    : data
                        ? JSON.stringify(data)
                        : undefined,
        });
    }

    async delete<T>(endpoint: string): Promise<T> {
        return this.request<T>(endpoint, {method: "DELETE"});
    }
}

export const apiClient = new ApiClient(process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000/api/v1');
