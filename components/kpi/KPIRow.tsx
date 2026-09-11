/**
 * Компонент строки KPI в таблице
 */

'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Trash2, Edit } from 'lucide-react'
import { KPI } from '@/types/kpi'
import { useState } from 'react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

interface KPIRowProps {
  kpi: KPI
  onDelete?: (id: number) => void
  onEdit?: (kpi: KPI) => void
}

export function KPIRow({ kpi, onDelete, onEdit }: KPIRowProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const handleDelete = () => {
    onDelete?.(kpi.id)
    setShowDeleteDialog(false)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <>
      <tr className="border-b border-[#E5E5E7] hover:bg-[#FAFAFA] transition-colors">
        <td className="p-4">
          <span className="text-[14px] text-[#6B7280]">#{kpi.id}</span>
        </td>
        <td className="p-4">
          <span className="text-[14px] text-app-text">{kpi.kpi}</span>
        </td>
        <td className="p-4">
          <div className="flex items-center gap-3">
            <Avatar className="w-10 h-10">
              <AvatarImage src="/placeholder-user.jpg" />
              <AvatarFallback className="bg-brand-accent text-brand-accent-on text-sm">
                {kpi.user_id.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="text-[14px] font-medium text-app-text">
                ID: {kpi.user_id}
              </div>
            </div>
          </div>
        </td>
        <td className="p-4">
          <div className="flex items-center gap-3">
            <Avatar className="w-10 h-10">
              <AvatarImage src="/placeholder-user.jpg" />
              <AvatarFallback className="bg-[#059669] text-white text-sm">
                {kpi.added_by.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="text-[14px] font-medium text-app-text">
                ID: {kpi.added_by}
              </div>
            </div>
          </div>
        </td>
        <td className="p-4">
          <span className="text-[13px] text-[#6B7280]">
            {formatDate(kpi.created_dt)}
          </span>
        </td>
        <td className="p-4">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="w-9 h-9 hover:bg-blue-50 hover:text-blue-600"
              onClick={() => onEdit?.(kpi)}
            >
              <Edit className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="w-9 h-9 hover:bg-red-50 hover:text-red-600"
              onClick={() => setShowDeleteDialog(true)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </td>
      </tr>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Удалить KPI?</AlertDialogTitle>
            <AlertDialogDescription>
              Вы уверены, что хотите удалить показатель эффективности? Это действие
              нельзя отменить.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Отмена</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Удалить
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
