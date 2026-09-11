
export interface Schedule {
    id?: number;
    days_per_week: number;
    hours_per_day: number;
    ended_at?: string;
    started_at: string;
    details?: Record<string, any>;
}

export interface CreateScheduleRequest extends Omit<Schedule, 'user_id'> {
    user_id: number;
}
