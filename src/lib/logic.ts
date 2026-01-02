import { isSaturday, isSunday, getDate, getMonth, getYear, format, parseISO } from 'date-fns';
import { HOLIDAYS_2025 } from './constants';

export type BankStatus = {
    isOpen: boolean;
    reason: string;
    type: 'weekend' | 'holiday' | 'weekday';
};

export function isBankOpen(date: Date, state: string): BankStatus {
    // 1. Check for Sunday
    if (isSunday(date)) {
        return { isOpen: false, reason: "Sunday", type: 'weekend' };
    }

    // 2. Check for Saturdays
    if (isSaturday(date)) {
        const dayOfMonth = getDate(date);
        // 2nd Saturday: 8-14
        // 4th Saturday: 22-28
        // 5th Saturday (if exists): 29-31 -> OPEN

        // We can calculate the week number of the month more precisely
        // Week 1: 1-7, Week 2: 8-14, Week 3: 15-21, Week 4: 22-28, Week 5: 29-31
        const weekOfMonth = Math.ceil(dayOfMonth / 7);

        if (weekOfMonth === 2 || weekOfMonth === 4) {
            return { isOpen: false, reason: `${weekOfMonth === 2 ? '2nd' : '4th'} Saturday`, type: 'weekend' };
        }
        // 1st, 3rd, 5th Saturdays are generally open unless it's a holiday
    }

    // 3. Check for Holidays
    const dateString = format(date, 'yyyy-MM-dd');

    // Check National/All-India holidays
    if (HOLIDAYS_2025.ALL.includes(dateString)) {
        // We need to fetch the specific holiday name if we had a map, for now generic
        return { isOpen: false, reason: "Public Holiday", type: 'holiday' };
    }

    // Check State-specific holidays
    const stateHolidays = HOLIDAYS_2025[state] || [];
    if (stateHolidays.includes(dateString)) {
        return { isOpen: false, reason: `${state} State Holiday`, type: 'holiday' };
    }

    return { isOpen: true, reason: "Working Day", type: 'weekday' };
}

export function getStatusColor(status: BankStatus): string {
    if (status.isOpen) return "text-green-500";
    return "text-red-500";
}
