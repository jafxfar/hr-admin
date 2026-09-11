'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import {
  ArrowLeft,
  BookOpen,
  ChevronDown,
  ChevronRight,
  FileText,
  Layers,
  PlusCircle,
  Video,
} from 'lucide-react'
import { HRLayout } from '@/components/hr-layout'
import Loading from '@/components/ui/loading'
import { HeaderActionButton } from '@/components/hr-header-controls'
import {
  useCreateLmsChapter,
  useCreateLmsModules,
  useCreateLmsStep,
  useLmsFullCourse,
} from '@/hooks/use-lms'
import { useToast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'
import type { LmsModule, LmsStepType } from '@/types/lms'

const STEP_TYPES: { value: LmsStepType; label: string }[] = [
  { value: 'info', label: 'Текст' },
  { value: 'video', label: 'Видео' },
  { value: 'quiz', label: 'Тест' },
]

const inputClassName =
  'h-10 w-full rounded-full border border-app-border-accent bg-[rgb(var(--theme-primary-rgb)/0.08)] px-4 text-sm text-app-text outline-none focus:ring-2 focus:ring-brand-accent/15'

const textareaClassName =
  'w-full rounded-2xl border border-app-border-accent bg-[rgb(var(--theme-primary-rgb)/0.08)] px-4 py-3 text-sm text-app-text outline-none focus:ring-2 focus:ring-brand-accent/15'

type Selection = {
  moduleId: number
  chapterId?: number
  stepId?: number
}

const nextPosition = (items: { position: number }[] | null | undefined) =>
  (Array.isArray(items) ? items : []).reduce((max, item) => Math.max(max, item.position), 0) + 1

export const TrainingCourseEditor = () => {
  const params = useParams<{ id: string }>()
  const courseId = Number(params.id)
  const { toast } = useToast()
  const { data: course, isLoading, isError } = useLmsFullCourse(courseId)
  const createModules = useCreateLmsModules(courseId)
  const createChapter = useCreateLmsChapter(courseId)
  const createStep = useCreateLmsStep(courseId)

  const [selection, setSelection] = useState<Selection | null>(null)
  const [moduleTitle, setModuleTitle] = useState('')
  const [chapterTitle, setChapterTitle] = useState('')
  const [stepTitle, setStepTitle] = useState('')
  const [stepType, setStepType] = useState<LmsStepType>('info')
  const [stepContent, setStepContent] = useState('')
  const [stepVideoUrl, setStepVideoUrl] = useState('')
  const [quizQuestion, setQuizQuestion] = useState('')

  const selectedModule = useMemo(
    () => (course?.modules ?? []).find((module) => module.id === selection?.moduleId) ?? null,
    [course, selection],
  )
  const selectedChapter = useMemo(
    () => (selectedModule?.chapters ?? []).find((chapter) => chapter.id === selection?.chapterId) ?? null,
    [selectedModule, selection],
  )
  const selectedStep = useMemo(
    () => (selectedChapter?.steps ?? []).find((step) => step.id === selection?.stepId) ?? null,
    [selectedChapter, selection],
  )

  const handleCreateModule = () => {
    const title = moduleTitle.trim()
    if (!title || !course) return
    createModules.mutate(
      [{ title, position: nextPosition(course.modules) }],
      {
        onSuccess: () => {
          setModuleTitle('')
          toast({ title: 'Модуль добавлен' })
        },
        onError: () => toast({ title: 'Не удалось добавить модуль', variant: 'destructive' }),
      },
    )
  }

  const handleCreateChapter = () => {
    const title = chapterTitle.trim()
    if (!title || !selectedModule) return
    createChapter.mutate(
      {
        moduleId: selectedModule.id,
        chapter: { title, position: nextPosition(selectedModule.chapters) },
      },
      {
        onSuccess: () => {
          setChapterTitle('')
          toast({ title: 'Глава добавлена' })
        },
        onError: () => toast({ title: 'Не удалось добавить главу', variant: 'destructive' }),
      },
    )
  }

  const handleCreateStep = () => {
    const title = stepTitle.trim()
    if (!title || !selectedChapter) return
    createStep.mutate(
      {
        chapterId: selectedChapter.id,
        step: {
          title,
          points: 10,
          position: nextPosition(selectedChapter.steps),
          type: stepType,
          content: stepType === 'info' ? stepContent.trim() || null : null,
          video_url: stepType === 'video' ? stepVideoUrl.trim() || null : null,
          questions:
            stepType === 'quiz' && quizQuestion.trim()
              ? [
                  {
                    question_text: quizQuestion.trim(),
                    type: 'single',
                    points: 10,
                    options: [
                      { text: 'Верно', is_correct: true },
                      { text: 'Неверно', is_correct: false },
                    ],
                  },
                ]
              : undefined,
        },
      },
      {
        onSuccess: () => {
          setStepTitle('')
          setStepContent('')
          setStepVideoUrl('')
          setQuizQuestion('')
          toast({ title: 'Шаг добавлен' })
        },
        onError: () => toast({ title: 'Не удалось добавить шаг', variant: 'destructive' }),
      },
    )
  }

  if (!Number.isFinite(courseId) || courseId <= 0) {
    return (
      <HRLayout title="Курс">
        <p className="admin-content-inset text-sm text-app-text-muted">Некорректный идентификатор курса.</p>
      </HRLayout>
    )
  }

  if (isLoading) {
    return (
      <HRLayout title="Курс">
        <Loading />
      </HRLayout>
    )
  }

  if (isError || !course) {
    return (
      <HRLayout title="Курс">
        <p className="admin-content-inset text-sm text-app-text-muted">Курс не найден.</p>
      </HRLayout>
    )
  }

  return (
    <HRLayout
      title={course.title}
      topActions={
        <Link
          href="/training/courses"
          className="inline-flex h-10 items-center gap-2 rounded-full px-3 text-sm font-semibold text-app-text-muted hover:text-app-text"
        >
          <ArrowLeft className="h-4 w-4" />
          К курсам
        </Link>
      }
    >
      <div className="admin-content-inset grid gap-4 lg:grid-cols-[260px_1fr]">
        <aside className="app-panel-glass p-3">
          <p className="mb-2 px-2 text-xs font-bold uppercase tracking-wide text-app-text-muted">Содержание</p>
          <div className="space-y-1">
            {(course.modules ?? []).map((module, moduleIndex) => (
              <ModuleTree
                key={module.id}
                module={module}
                moduleIndex={moduleIndex}
                selection={selection}
                onSelect={setSelection}
              />
            ))}
          </div>
          <div className="mt-3 space-y-2 border-t border-app-border pt-3">
            <input
              value={moduleTitle}
              onChange={(event) => setModuleTitle(event.target.value)}
              placeholder="Название модуля"
              className={inputClassName}
              aria-label="Название модуля"
            />
            <HeaderActionButton
              onClick={handleCreateModule}
              disabled={!moduleTitle.trim() || createModules.isPending}
              icon={<PlusCircle className="h-4 w-4" />}
            >
              Модуль
            </HeaderActionButton>
          </div>
        </aside>

        <section className="app-panel-glass space-y-4 p-5">
          {!selectedModule ? (
            <p className="text-sm text-app-text-muted">
              Добавьте модуль слева или выберите главу, чтобы редактировать содержание.
            </p>
          ) : (
            <>
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-app-text-muted">Модуль</p>
                <h2 className="text-lg font-bold text-app-text">{selectedModule.title}</h2>
              </div>

              <div className="grid gap-2 rounded-xl border border-app-border p-4">
                <p className="text-xs font-bold uppercase tracking-wide text-app-text-muted">Новая глава</p>
                <input
                  value={chapterTitle}
                  onChange={(event) => setChapterTitle(event.target.value)}
                  placeholder="Название главы"
                  className={inputClassName}
                  aria-label="Название главы"
                />
                <HeaderActionButton
                  variant="ghost"
                  onClick={handleCreateChapter}
                  disabled={!chapterTitle.trim() || createChapter.isPending}
                  icon={<PlusCircle className="h-4 w-4" />}
                >
                  Добавить главу
                </HeaderActionButton>
              </div>

              {selectedChapter ? (
                <>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-app-text-muted">Глава</p>
                    <h3 className="text-base font-bold text-app-text">{selectedChapter.title}</h3>
                  </div>

                  <div className="space-y-2">
                    {(selectedChapter.steps ?? []).map((step) => (
                      <button
                        key={step.id}
                        type="button"
                        onClick={() =>
                          setSelection({
                            moduleId: selectedModule.id,
                            chapterId: selectedChapter.id,
                            stepId: step.id,
                          })
                        }
                        className={cn(
                          'flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm',
                          selectedStep?.id === step.id
                            ? 'nav-pill-active'
                            : 'bg-[rgb(var(--theme-primary-rgb)/0.06)] text-app-text hover:bg-[rgb(var(--theme-primary-rgb)/0.1)]',
                        )}
                      >
                        {step.type === 'video' ? <Video className="h-4 w-4" /> : <FileText className="h-4 w-4" />}
                        <span className="truncate">{step.title}</span>
                      </button>
                    ))}
                  </div>

                  {selectedStep ? (
                    <div className="rounded-xl border border-app-border p-4 text-sm text-app-text">
                      <p className="font-semibold">{selectedStep.title}</p>
                      <p className="mt-1 text-xs text-app-text-muted">Тип: {selectedStep.type}</p>
                      {selectedStep.content ? (
                        <p className="mt-3 whitespace-pre-wrap">{selectedStep.content}</p>
                      ) : null}
                      {selectedStep.video_url ? (
                        <p className="mt-3 text-xs text-brand-accent">{selectedStep.video_url}</p>
                      ) : null}
                    </div>
                  ) : null}

                  <div className="grid gap-3 border-t border-app-border pt-4">
                    <p className="text-xs font-bold uppercase tracking-wide text-app-text-muted">Новый шаг</p>
                    <input
                      value={stepTitle}
                      onChange={(event) => setStepTitle(event.target.value)}
                      placeholder="Название шага"
                      className={inputClassName}
                      aria-label="Название шага"
                    />
                    <div className="flex flex-wrap gap-2">
                      {STEP_TYPES.map((item) => (
                        <button
                          key={item.value}
                          type="button"
                          onClick={() => setStepType(item.value)}
                          className={cn(
                            'rounded-full px-3 py-1.5 text-xs font-semibold',
                            stepType === item.value
                              ? 'nav-pill-active'
                              : 'bg-[rgb(var(--theme-primary-rgb)/0.08)] text-app-text-muted',
                          )}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                    {stepType === 'info' ? (
                      <textarea
                        value={stepContent}
                        onChange={(event) => setStepContent(event.target.value)}
                        rows={4}
                        placeholder="Текст шага"
                        className={textareaClassName}
                        aria-label="Текст шага"
                      />
                    ) : null}
                    {stepType === 'video' ? (
                      <input
                        value={stepVideoUrl}
                        onChange={(event) => setStepVideoUrl(event.target.value)}
                        placeholder="URL видео"
                        className={inputClassName}
                        aria-label="URL видео"
                      />
                    ) : null}
                    {stepType === 'quiz' ? (
                      <input
                        value={quizQuestion}
                        onChange={(event) => setQuizQuestion(event.target.value)}
                        placeholder="Вопрос теста"
                        className={inputClassName}
                        aria-label="Вопрос теста"
                      />
                    ) : null}
                    <HeaderActionButton
                      onClick={handleCreateStep}
                      disabled={!stepTitle.trim() || createStep.isPending}
                      icon={<PlusCircle className="h-4 w-4" />}
                    >
                      Добавить шаг
                    </HeaderActionButton>
                  </div>
                </>
              ) : (
                <p className="text-sm text-app-text-muted">Выберите главу слева или создайте новую.</p>
              )}
            </>
          )}
        </section>
      </div>
    </HRLayout>
  )
}

const ModuleTree = ({
  module,
  moduleIndex,
  selection,
  onSelect,
}: {
  module: LmsModule
  moduleIndex: number
  selection: Selection | null
  onSelect: (selection: Selection) => void
}) => {
  const [open, setOpen] = useState(true)

  return (
    <div>
      <button
        type="button"
        onClick={() => {
          onSelect({ moduleId: module.id })
          setOpen(true)
        }}
        className={cn(
          'flex w-full items-center gap-2 rounded-xl px-2 py-2 text-left text-app-text hover:bg-[rgb(var(--theme-primary-rgb)/0.08)]',
          selection?.moduleId === module.id && !selection.chapterId
            ? 'bg-[rgb(var(--theme-primary-rgb)/0.1)]'
            : '',
        )}
      >
        {open ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
        <span className="flex h-5 w-5 items-center justify-center rounded-md bg-brand-accent text-brand-accent-on">
          <Layers className="h-3 w-3" />
        </span>
        <span className="truncate text-[12px] font-bold">
          {moduleIndex + 1}. {module.title}
        </span>
      </button>
      {open ? (
        <div className="ml-6 space-y-0.5">
          {(module.chapters ?? []).map((chapter) => (
            <button
              key={chapter.id}
              type="button"
              onClick={() => onSelect({ moduleId: module.id, chapterId: chapter.id })}
              className={cn(
                'flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-[12px]',
                selection?.chapterId === chapter.id && selection.moduleId === module.id
                  ? 'nav-pill-active'
                  : 'text-app-text-muted hover:bg-[rgb(var(--theme-primary-rgb)/0.08)] hover:text-app-text',
              )}
            >
              <BookOpen className="h-3 w-3 shrink-0" />
              <span className="truncate">{chapter.title}</span>
            </button>
          ))}
        </div>
      ) : null}
    </div>
  )
}
