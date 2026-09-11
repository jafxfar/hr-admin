export interface TaskUserBrief {
  id: number
  first_name?: string | null
  last_name?: string | null
  avatar?: string | null
}

export interface TaskProjectBrief {
  id: number
  name: string
}

export interface TaskItem {
  id: number
  title: string
  description?: string | null
  created_by: number
  created_by_user?: TaskUserBrief | null
  deadline?: string | null
  status: string
  status_title?: string | null
  is_overdue?: boolean
  parent_id?: number | null
  project_id?: number | null
  project?: TaskProjectBrief | null
  board_sort_order: number
  subtask_sort_order: number
  assignees: TaskUserBrief[]
  comments_count: number
  subtasks_count: number
  archived_at?: string | null
  created_at?: string | null
  updated_at?: string | null
}

export interface TaskDetail extends TaskItem {
  subtasks: TaskItem[]
  archived_by?: number | null
}

export interface CreateTaskDTO {
  title: string
  description?: string | null
  deadline?: string | null
  status?: string
  assignee_ids?: number[]
  parent_id?: number | null
  project_id?: number | null
}

export interface UpdateTaskDTO {
  title?: string
  description?: string | null
  deadline?: string | null
  status?: string
  assignee_ids?: number[]
  parent_id?: number | null
  project_id?: number | null
}

export interface TaskCommentRevision {
  id: number
  body: string
  edited_by: number
  edited_at?: string | null
}

export interface TaskComment {
  id: number
  task_id: number
  author_user_id: number
  author_user?: TaskUserBrief | null
  body: string
  is_important: boolean
  mentioned_user_ids: number[]
  mentioned_users: TaskUserBrief[]
  created_at?: string | null
  updated_at?: string | null
  revisions: TaskCommentRevision[]
}

export interface CreateTaskCommentDTO {
  body: string
  is_important?: boolean
  mentioned_user_ids?: number[]
}

export interface UpdateTaskCommentDTO {
  body?: string
  is_important?: boolean
  mentioned_user_ids?: number[]
}

export interface TaskChangeItem {
  id: number
  task_id: number
  actor_user_id: number
  actor_user?: TaskUserBrief | null
  field: string
  old_value?: string | null
  new_value?: string | null
  created_at?: string | null
}

export interface PaginatedTaskChanges {
  items: TaskChangeItem[]
  total: number
  page: number
  page_size: number
  total_pages: number
}

export interface PaginatedTasks {
  items: TaskItem[]
  total: number
  page: number
  page_size: number
  total_pages: number
}

export type TaskSortBy = 'created_at' | 'updated_at' | 'deadline' | 'title' | 'status'
export type TaskSortOrder = 'asc' | 'desc'

export interface TaskListQuery {
  page?: number
  page_size?: number
  parent_id?: number | null
  status?: string
  assignee_id?: number | null
  created_by?: number | null
  project_id?: number | null
  q?: string
  deadline_from?: string
  deadline_to?: string
  overdue?: boolean
  unassigned?: boolean
  no_project?: boolean
  include_subtasks?: boolean
  sort_by?: TaskSortBy
  sort_order?: TaskSortOrder
}

export interface TaskTableColumn {
  key: string
  label: string
  sortable: boolean
}

export interface TaskTableResponse {
  columns: TaskTableColumn[]
  items: TaskItem[]
  total: number
  page: number
  page_size: number
  total_pages: number
}

export interface TaskDashboardStatusItem {
  code: string
  title: string
  count: number
  percent: number
}

export interface TaskDashboardProjectItem {
  id?: number | null
  name: string
  total: number
  completed: number
  overdue: number
  completion_percent: number
}

export interface TaskDashboardResponse {
  total: number
  completed: number
  open: number
  overdue: number
  unassigned: number
  without_project: number
  due_today: number
  due_this_week: number
  completion_percent: number
  done_status?: string | null
  by_status: TaskDashboardStatusItem[]
  by_project: TaskDashboardProjectItem[]
}

export interface TaskDashboardFilters {
  projectId?: number | null
  assigneeId?: number | null
  createdBy?: number | null
  mine?: boolean
  includeSubtasks?: boolean
}
