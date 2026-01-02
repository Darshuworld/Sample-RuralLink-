export type Persona = 'trucker' | 'factory';
export type Theme = 'light' | 'dark';

export interface DriverDetails {
  age: number;
  sex: 'Male' | 'Female' | 'Other';
  licenseNumber: string;
  experienceYears: number;
  photoUrl?: string;
}

export interface Truck {
  id: string;
  driverName: string;
  driverDetails: DriverDetails;
  vehicleModel: string;
  vehicleRegNo: string;
  origin: string;
  destination: string;
  departureDate: string;
  capacityTotal: number; // in Tons
  capacityFilled: number; // in Tons
  pricePerTon: number; // in INR
  isGroupShippingAllowed: boolean;
  status: 'Active' | 'Partial' | 'Almost Full' | 'Full';
  rating: {
    overall: number;
    punctuality: number;
    behavior: number;
    safety: number;
  };
  // Economics
  mileage?: number;
  dieselPrice?: number;
  tollEstimate?: number;
}

export type BookingStatus = 'Pending' | 'Accepted' | 'Pickup' | 'In-Transit' | 'Delivered' | 'Cancelled' | 'Revoked';

export interface Booking {
  id: string;
  truckId: string;
  factoryName: string;
  goodsType: string;
  isFragile: boolean;
  weight: number;
  originAddress: string;
  destinationAddress: string;
  price: number;
  status: BookingStatus;
  otp: string; // For pickup verification
  bookingTime: string; // ISO string
  expiryTime: string; // ISO string (12h later)
  coLoaders?: string[]; // Names of other companies sharing the load
  estimatedArrival?: string;
  chatHistory: ChatMessage[];
}

export interface ChatMessage {
  sender: 'trucker' | 'factory' | 'system';
  text: string;
  timestamp: string;
}

export interface LoadRequest {
  id: string;
  companyName: string;
  goodsType: string;
  weight: number; // Tons
  origin: string;
  destination: string;
  targetPrice: number;
  status: 'Pending' | 'Matched' | 'Completed';
}
