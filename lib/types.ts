export interface SimpliService {
    id: string;
    name: string;
    category: string;
    subcategory: string;
    duration: number;
    price: number;
}

export interface SimpliEmployee {
    id: string;
    first_name: string;
    last_name: string;
}

export interface AvailabilityResponse {
    date: string;
    serviceId: string;
    employeeId?: string;
    slots: string[];
}

export interface BookingRequest {
    name: string;
    phone: string;
    email?: string;
    serviceId: string;
    employeeId: string;
    date: string;
    time: string;
}

export interface BookingResponse {
    booking: {
        id: string;
        status: string;
        booking_date: string;
        booking_time: string;
    };
}
