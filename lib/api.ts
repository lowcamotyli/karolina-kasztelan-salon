import {
    SimpliService,
    SimpliEmployee,
    AvailabilityResponse,
    BookingRequest,
    BookingResponse,
} from './types';

const API_URL = import.meta.env.VITE_SIMPLI_API_URL;
const API_KEY = import.meta.env.VITE_SIMPLI_API_KEY;
const SALON_ID = import.meta.env.VITE_SIMPLI_SALON_ID;

console.log('[API] URL:', API_URL);
console.log('[API] KEY:', API_KEY);

if (!API_URL || !API_KEY) {
    console.error('Missing VITE_SIMPLI_API_URL or VITE_SIMPLI_API_KEY in environment variables');
}

async function fetchWithAuth<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    console.log('[FETCH-DEBUG] === START ===')
    console.log('[FETCH-DEBUG] Endpoint:', endpoint)
    console.log('[FETCH-DEBUG] API_URL:', API_URL)
    console.log('[FETCH-DEBUG] API_KEY:', API_KEY)
    console.log('[FETCH-DEBUG] Full URL:', `${API_URL}${endpoint}`)

    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'X-API-Key': API_KEY || '',
        'X-Salon-Id': SALON_ID || '',
        ...(options.headers as Record<string, string>),
    }
    console.log('[FETCH-DEBUG] Headers object:', headers)
    console.log('[FETCH-DEBUG] X-API-Key value:', headers['X-API-Key'])
    console.log('[FETCH-DEBUG] X-API-Key typeof:', typeof headers['X-API-Key'])

    try {
        console.log('[FETCH-DEBUG] About to fetch...')
        const response = await fetch(`${API_URL}${endpoint}`, {
            ...options,
            headers,
        })
        console.log('[FETCH-DEBUG] Response received:', response.status, response.statusText)
        console.log('[FETCH-DEBUG] Response headers:', Object.fromEntries(response.headers.entries()))

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}))
            console.error('[FETCH-DEBUG] Error response:', errorData)
            throw new Error(errorData.message || `API Error: ${response.status} ${response.statusText}`)
        }

        const data = await response.json()
        console.log('[FETCH-DEBUG] Success data:', data)
        console.log('[FETCH-DEBUG] === END ===')
        return data
    } catch (error) {
        console.error('[FETCH-DEBUG] Catch block error:', error)
        console.error('[FETCH-DEBUG] Error name:', error instanceof Error ? error.name : 'unknown')
        console.error('[FETCH-DEBUG] Error message:', error instanceof Error ? error.message : String(error))
        console.log('[FETCH-DEBUG] === END WITH ERROR ===')
        throw error
    }
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

export async function createBooking(data: BookingRequest): Promise<BookingResponse> {
    return fetchWithAuth<BookingResponse>('/api/public/bookings', {
        method: 'POST',
        body: JSON.stringify(data),
    });
}
