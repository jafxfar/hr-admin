let lastActivityAt = typeof Date !== 'undefined' ? Date.now() : 0
const listeners = new Set<() => void>()

/** Вызывается после каждого HTTP-ответа к backend (кроме /auth/refresh). */
export const notifyActivity = () => {
    lastActivityAt = Date.now()
    listeners.forEach((cb) => cb())
}

export const getLastActivityAt = () => lastActivityAt

export const subscribeActivity = (cb: () => void) => {
    listeners.add(cb)
    return () => {
        listeners.delete(cb)
    }
}
