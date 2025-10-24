export interface Student {
    id: string;
    name: string;
    email: string;
    phone: string;
}

export interface Lesson {
    id: string;
    studentId: string;
    date: string;
    duration: number; // in minutes
    charge: number; // monetary value
    paymentStatus: 'paid' | 'pending' | 'canceled';
}

export interface RecurringLesson {
    id: string;
    studentId: string;
    frequency: 'daily' | 'weekly' | 'monthly';
    startDate: string;
    endDate: string;
    duration: number; // in minutes
    charge: number; // monetary value
}

export interface AuthCredentials {
    username: string;
    password: string;
}

export interface LessonFormData {
    studentId: string;
    date: string;
    duration: number;
    charge: number;
}