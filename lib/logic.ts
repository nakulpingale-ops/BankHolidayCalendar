import { isSaturday, isSunday, getDate, format } from 'date-fns';
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
        const weekOfMonth = Math.ceil(dayOfMonth / 7);

        if (weekOfMonth === 2 || weekOfMonth === 4) {
            return { isOpen: false, reason: `${weekOfMonth === 2 ? '2nd' : '4th'} Saturday`, type: 'weekend' };
        }
    }

    // 3. Check for Holidays
    const dateString = format(date, 'yyyy-MM-dd');

    if (HOLIDAYS_2025.ALL[dateString]) {
        return { isOpen: false, reason: HOLIDAYS_2025.ALL[dateString], type: 'holiday' };
    }

    const stateHolidays = HOLIDAYS_2025[state] || {};
    if (stateHolidays[dateString]) {
        return { isOpen: false, reason: stateHolidays[dateString], type: 'holiday' };
    }

    return { isOpen: true, reason: "Working Day", type: 'weekday' };
}
