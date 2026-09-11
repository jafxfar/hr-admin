'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

export type SessionTimeoutDialogProps = {
  open: boolean
  countdownSeconds: number
  isContinuing: boolean
  onContinue: () => void
  onLogout: () => void
}

export const SessionTimeoutDialog = ({
  open,
  countdownSeconds,
  isContinuing,
  onContinue,
  onLogout,
}: SessionTimeoutDialogProps) => {
  const handlePointerDownOutside = (e: Event) => {
    e.preventDefault()
  }

  const handleEscapeKeyDown = (e: KeyboardEvent) => {
    e.preventDefault()
  }

  return (
    <Dialog open={open} onOpenChange={() => undefined}>
      <DialogContent
        showCloseButton={false}
        onPointerDownOutside={handlePointerDownOutside}
        onEscapeKeyDown={handleEscapeKeyDown}
        aria-describedby="session-timeout-desc"
      >
        <DialogHeader>
          <DialogTitle>Ваша сессия скоро истечёт</DialogTitle>
          <DialogDescription id="session-timeout-desc">
            В целях безопасности сессия будет завершена через {countdownSeconds} сек.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:gap-2">
          <Button type="button" variant="outline" onClick={onLogout} disabled={isContinuing}>
            Выйти
          </Button>
          <Button type="button" variant="primary" onClick={onContinue} disabled={isContinuing}>
            {isContinuing ? 'Продление…' : 'Продолжить сессию'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
