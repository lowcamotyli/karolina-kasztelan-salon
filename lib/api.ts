import {
    SimpliService,
    SimpliEmployee,
    AvailabilityResponse,
    BookingRequest,
    GroupBookingRequest,
    GroupBookingResponse,
    BookingResponse,
    PaymentInitResponse,
    PaymentStatusResponse,
} from './types';

// Use relative proxy path to avoid CORS — Vercel rewrites /api/simpli/* → simplisaloncloud.vercel.app/api/*
const API_URL = '/api/simpli';
const API_KEY = import.meta.env.VITE_SIMPLI_API_KEY;
const SALON_ID = import.meta.env.VITE_SIMPLI_SALON_ID;

async function fetchWithAuth<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'X-API-Key': API_KEY || '',
        'X-Salon-Id': SALON_ID || '',
        ...(options.headers as Record<string, string>),
    };

    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers,
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const validationMessage = Array.isArray(errorData.error)
            ? errorData.error
                .map((issue: { path?: string[]; message?: string }) => {
                    const field = issue.path?.join('.');
                    return field ? `${field}: ${issue.message}` : issue.message;
                })
                .filter(Boolean)
                .join(', ')
            : null;
        const conflictMessage = response.status === 409
            ? 'Ten termin jest już zajęty. Wróć i wybierz inny termin.'
            : null;
        throw new Error(validationMessage || errorData.message || conflictMessage || `API Error: ${response.status}`);
    }

    return response.json();
}

export async function fetchServices(): Promise<SimpliService[]> {
    const response = await fetchWithAuth<{ services: SimpliService[] }>('/api/public/services');
    return response.services;
}

export async function fetchEmployees(): Promise<SimpliEmployee[]> {
    const response = await fetchWithAuth<{ employees: SimpliEmployee[] }>('/api/public/employees');
    return response.employees;
}

export async function fetchAvailability(date: string, serviceId: string, employeeId?: string): Promise<string[]> {
    let url = `/api/public/availability?date=${date}&serviceId=${serviceId}`;
    if (employeeId) {
        url += `&employeeId=${employeeId}`;
    }
    const data = await fetchWithAuth<AvailabilityResponse>(url);
    return data.slots;
}

export async function fetchAvailableDates(startDate: string, endDate: string, serviceId: string, employeeId?: string): Promise<string[]> {
    let url = `/api/public/availability/dates?startDate=${startDate}&endDate=${endDate}&serviceId=${serviceId}`;
    if (employeeId) {
        url += `&employeeId=${employeeId}`;
    }
    const data = await fetchWithAuth<{ availableDates: string[] }>(url);
    return data.availableDates;
}

export async function createBooking(data: BookingRequest): Promise<BookingResponse> {
    return fetchWithAuth<BookingResponse>('/api/public/bookings', {
        method: 'POST',
        body: JSON.stringify(data),
    });
}

export async function createGroupBooking(data: GroupBookingRequest): Promise<GroupBookingResponse> {
    return fetchWithAuth<GroupBookingResponse>('/api/public/bookings/group', {
        method: 'POST',
        body: JSON.stringify(data),
    });
}

export async function initiatePayment(bookingId: string, returnUrl: string): Promise<PaymentInitResponse> {
    return fetchWithAuth<PaymentInitResponse>('/api/public/payments/initiate', {
        method: 'POST',
        body: JSON.stringify({ bookingId, returnUrl }),
    });
}

export async function getPaymentStatus(sessionId: string): Promise<PaymentStatusResponse> {
    return fetchWithAuth<PaymentStatusResponse>(`/api/public/payments/status?sessionId=${encodeURIComponent(sessionId)}`);
}
