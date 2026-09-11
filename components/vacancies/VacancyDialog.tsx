import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { DarkInput } from "@/components/custom-ui";
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  VACANCY_TYPE_LABELS,
  type VacancyType,
  type Vacancy,
  type CreateVacancyRequest,
} from '@/types/vacancies'
import type { VacancyCategory } from '@/types/vacancyCategories'
import { cn } from '@/lib/utils'
import { DarkTextarea } from "@/components/custom-ui"
import { DatePickerField } from '@/components/custom-ui'
import { useSettingsFeatures } from '@/hooks/use-settings-features'
import { useBranchesList } from '@/hooks/use-branches'
import { buildDeadlineIso, parseDeadlineDate } from '@/lib/vacancy-board'
interface VacancyDialogProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: CreateVacancyRequest) => void
  isPending?: boolean
  categories: VacancyCategory[]
  editingVacancy?: Vacancy | null
}

export const VacancyDialog: React.FC<VacancyDialogProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isPending,
  categories,
  editingVacancy,
}) => {
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [type, setType] = useState<VacancyType | ''>('')
  const [categoryId, setCategoryId] = useState<string>('')
  const [branchId, setBranchId] = useState<string>('')
  const [isPublished, setIsPublished] = useState(false)
  const [deadlineDate, setDeadlineDate] = useState('')
  const [hasDeadline, setHasDeadline] = useState(false)

  const { data: settingsFeatures } = useSettingsFeatures()
  const branchesEnabled = settingsFeatures?.features?.branches_enabled !== false
  const { data: branchesData } = useBranchesList('', 1, 20, false, branchesEnabled)
  const branches = branchesData?.items ?? []

  useEffect(() => {
    if (editingVacancy) {
      setTitle(editingVacancy.title)
      setBody(editingVacancy.body)
      setType(editingVacancy.type)
      setCategoryId(editingVacancy.category_id.toString())
      setBranchId(editingVacancy.branch_id ? String(editingVacancy.branch_id) : '')
      setIsPublished(editingVacancy.is_published)
      const parsedDeadline = parseDeadlineDate(editingVacancy.deadline_at)
      setDeadlineDate(parsedDeadline)
      setHasDeadline(Boolean(parsedDeadline))
    } else {
      setTitle('')
      setBody('')
      setType('')
      setCategoryId('')
      setBranchId('')
      setIsPublished(false)
      setDeadlineDate('')
      setHasDeadline(false)
    }
  }, [editingVacancy, isOpen])

  const isValid = title.trim() && body.trim() && type && categoryId

  const handleClose = () => {
    setTitle('')
    setBody('')
    setType('')
    setCategoryId('')
    setBranchId('')
    setIsPublished(false)
    setDeadlineDate('')
    setHasDeadline(false)
    onClose()
  }

  const handleSubmit = () => {
    if (!isValid) return
    const payload: CreateVacancyRequest = {
      title: title.trim(),
      body: body.trim(),
      type: type as VacancyType,
      category_id: Number(categoryId),
      branch_id: branchId ? Number(branchId) : null,
      is_published: isPublished,
    }
    if (hasDeadline && deadlineDate) {
      payload.deadline_at = buildDeadlineIso(deadlineDate)
    } else if (editingVacancy) {
      payload.deadline_at = null
    }
    onSubmit(payload)
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl bg-app-surface-0 border border-app-border-accent text-app-text">
        <DialogHeader>
          <DialogTitle className="text-lg font-extrabold tracking-tight text-app-text">
            {editingVacancy ? 'Редактировать вакансию' : 'Новая вакансия'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5 py-2">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="vacancy-title" className="text-xs uppercase tracking-widest font-black text-app-text-muted">
              Название вакансии <span className="text-brand-accent">*</span>
            </Label>
            <DarkInput
              placeholder="Введите название вакансии"
              value={title}
              onChange={(e: any) => setTitle(e.target.value)}
            />

          </div>

          {/* Category + Type row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-widest font-black text-app-text-muted">
                Категория <span className="text-brand-accent">*</span>
              </Label>
              <Select value={categoryId} onValueChange={setCategoryId}>
                <SelectTrigger className={cn(
                  'w-full h-10 text-sm border border-app-border-accent rounded-full px-4 transition-all duration-200 focus:ring-1 focus:ring-brand-accent/30',
                  categoryId
                    ? 'bg-brand-accent text-brand-accent-on font-bold shadow-[0_0_15px_rgb(var(--theme-primary-rgb) / 0.2)] [&_svg]:text-brand-accent-on'
                    : 'bg-app-surface-1 text-app-text-muted hover:text-app-text hover:bg-app-surface-2 [&_svg]:text-app-text-muted',
                )}>
                  <SelectValue placeholder="Выберите категорию" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id.toString()}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-widest font-black text-app-text-muted">
                Тип <span className="text-brand-accent">*</span>
              </Label>
              <Select value={type} onValueChange={(v) => setType(v as VacancyType)}>
                <SelectTrigger className={cn(
                  'w-full h-10 text-sm border border-app-border-accent rounded-full px-4 transition-all duration-200 focus:ring-1 focus:ring-brand-accent/30',
                  type
                    ? 'bg-brand-accent text-brand-accent-on font-bold shadow-[0_0_15px_rgb(var(--theme-primary-rgb) / 0.2)] [&_svg]:text-brand-accent-on'
                    : 'bg-app-surface-1 text-app-text-muted hover:text-app-text hover:bg-app-surface-2 [&_svg]:text-app-text-muted',
                )}>
                  <SelectValue placeholder="Выберите тип" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(VACANCY_TYPE_LABELS).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Branch */}
          {branchesEnabled ? (
            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-widest font-black text-app-text-muted">
                Филиал
              </Label>
              {branches.length === 0 ? (
                <div className="h-10 rounded-full px-4 flex items-center bg-app-surface-1 text-app-text-muted border border-app-border-accent">
                  Нет доступных филиалов
                </div>
              ) : (
                <Select value={branchId} onValueChange={setBranchId}>
                  <SelectTrigger
                    className={cn(
                      'w-full h-10 text-sm border border-app-border-accent rounded-full px-4 transition-all duration-200 focus:ring-1 focus:ring-brand-accent/30',
                      branchId
                        ? 'bg-brand-accent text-brand-accent-on font-bold shadow-[0_0_15px_rgb(var(--theme-primary-rgb) / 0.2)] [&_svg]:text-brand-accent-on'
                        : 'bg-app-surface-1 text-app-text-muted hover:text-app-text hover:bg-app-surface-2 [&_svg]:text-app-text-muted',
                    )}
                  >
                    <SelectValue placeholder="Без филиала" />
                  </SelectTrigger>
                  <SelectContent>
                    {branches.map((branch) => (
                      <SelectItem key={branch.id} value={String(branch.id)}>
                        {branch.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          ) : null}

          {/* Body */}
          <div className="space-y-2">
            < Label htmlFor="vacancy-body" className="text-xs uppercase tracking-widest font-black text-app-text-muted" >
              Описание <span className="text-brand-accent" >*</span>
            </Label>
            <DarkTextarea placeholder="Введите описание вакансии, требования и условия..." value={body} onChange={e => setBody(e.target.value)} />
          </div>

          {/* Deadline */}
          <div className="space-y-3 p-4 bg-app-surface-2 rounded-3xl border border-app-border-accent">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-app-text">Срок приёма откликов</p>
                <p className="text-xs text-app-text-muted mt-0.5">
                  После даты вакансия скрывается с публичной витрины
                </p>
              </div>
              <Switch
                checked={hasDeadline}
                onCheckedChange={(nextChecked) => {
                  setHasDeadline((prev) => {
                    if (prev && !nextChecked) setDeadlineDate('')
                    return nextChecked
                  })
                }}
                aria-label="Ограничить срок приёма откликов"
                size="sm"
              />
            </div>
            {hasDeadline ? (
              <DatePickerField
                value={deadlineDate}
                onChange={setDeadlineDate}
                placeholder="Выберите дату"
                minDate={new Date().toISOString().slice(0, 10)}
              />
            ) : null}
          </div>

          {/* Publish toggle */}
          <div className="flex items-center justify-between p-4 bg-app-surface-2 rounded-3xl border border-app-border-accent">
            <div>
              <p className="text-sm font-bold text-app-text">Опубликовать</p>
              <p className="text-xs text-app-text-muted mt-0.5">
                Вакансия будет сразу видна соискателям
              </p>
            </div>
            <Switch
              checked={isPublished}
              onCheckedChange={setIsPublished}
              aria-label="Опубликовать вакансию"
              offLabel="Черновик"
              onLabel="Опублик."
              size="sm"
            />
          </div>
        </div>

        <DialogFooter className="border-t border-app-border-accent pt-4">
          <Button
            variant="outline"
            onClick={handleClose}
            className="h-10 px-6 text-sm rounded-full border-app-border-accent bg-transparent text-app-text-muted hover:bg-app-surface-3 hover:text-app-text"
          >
            Отменить
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!isValid || isPending}
            className="h-10 px-6 text-sm rounded-full bg-brand-accent text-brand-accent-on-alt font-bold hover:bg-brand disabled:opacity-40 shadow-[0_0_20px_rgb(var(--theme-primary-rgb) / 0.15)]"
          >
            {isPending
              ? editingVacancy ? 'Сохранение...' : 'Создание...'
              : editingVacancy ? 'Сохранить' : 'Создать'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
