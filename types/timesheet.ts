
export interface Timesheet {
    work_date: string;
    check_in: string;
    check_out: string;
    status: string;
    details: {
        [key: string]: any;
    };
}

export interface CreateTimesheetRequest extends Omit<Timesheet, 'user_id'> {
    user_id: number;
}