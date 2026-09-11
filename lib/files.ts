/**
 * Returns the base URL for uploaded files served by the backend.
 *
 * Priority:
 *  1. NEXT_PUBLIC_FILES_URL  – explicitly set (build-time or .env.local)
 *  2. Derived from NEXT_PUBLIC_API_URL – strip the "/api/v1" suffix and
 *     append "/uploads", so http://host:8000/api/v1 → http://host:8000/uploads
 *  3. Hard-coded localhost fallback for local dev
 */
export function getFilesBase(): string {
    const explicit = process.env.NEXT_PUBLIC_FILES_URL
    if (explicit) return explicit.replace(/\/$/, '')

    const apiUrl = process.env.NEXT_PUBLIC_API_URL
    if (apiUrl) {
        // Remove trailing /api/v1 (or /api/v1/) and append /uploads
        const base = apiUrl.replace(/\/api\/v1\/?$/, '')
        return `${base}/uploads`
    }

    return 'http://localhost:8000/uploads'
}

/**
 * Builds a full URL to a file stored on the backend.
 * serverPath is the relative path returned by the API, e.g.
 *   "uploads/profile_photos/4/c72b296a.jpg"  → http://host:8000/uploads/profile_photos/4/c72b296a.jpg
 *   "profile_photos/4/c72b296a.jpg"           → http://host:8000/uploads/profile_photos/4/c72b296a.jpg
 *
 * The backend stores paths with an "uploads/" prefix, but getFilesBase() already
 * ends with "/uploads", so we strip the leading "uploads/" to avoid duplication.
 */
function isLoopbackHostname(hostname: string): boolean {
    return hostname === 'localhost' || hostname === '127.0.0.1'
}

/** См. platform/lib/files.ts — localhost в абсолютном URL ломает загрузку с другого хоста. */
function rewriteLoopbackUploadsUrl(url: string): string {
    try {
        const u = new URL(url)
        if (!u.pathname.startsWith('/uploads/')) return url
        if (!isLoopbackHostname(u.hostname)) return url

        const apiRoot = (process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000/api/v1').replace(
            /\/api\/v1\/?$/,
            '',
        )
        const target = new URL(apiRoot)
        if (isLoopbackHostname(target.hostname)) return url

        u.protocol = target.protocol
        u.hostname = target.hostname
        u.port = target.port
        return u.toString()
    } catch {
        return url
    }
}

export function buildFileUrl(serverPath: string): string {
    if (!serverPath) return ''
    if (
        serverPath.startsWith('http://') ||
        serverPath.startsWith('https://') ||
        serverPath.startsWith('data:')
    ) {
        if (serverPath.startsWith('data:')) return serverPath
        return rewriteLoopbackUploadsUrl(serverPath)
    }
    const clean = serverPath
        .replace(/^\/+/, '')       // strip leading slashes
        .replace(/^uploads\//, '') // strip "uploads/" prefix if present
    return rewriteLoopbackUploadsUrl(`${getFilesBase()}/${clean}`)
}
