import { Truck, LoadRequest, Booking } from './types';

// --- MOCK DATA: RURAL LINK (NAGPUR REGION) ---

export const initialTrucks: Truck[] = [
  {
    id: "TRK-001",
    driverName: "Rajesh Yadav",
    driverDetails: {
      age: 42,
      sex: 'Male',
      licenseNumber: "MH-31-2009-0043210",
      experienceYears: 15
    },
    vehicleModel: "Tata 407 (Light Commercial)",
    vehicleRegNo: "MH-31-CB-1234",
    origin: "Butibori MIDC",
    destination: "Pune (Chakan)",
    departureDate: "2024-10-25",
    capacityTotal: 4.0,
    capacityFilled: 0.0,
    pricePerTon: 3500,
    isGroupShippingAllowed: true,
    status: "Active",
    rating: { overall: 4.8, punctuality: 4.9, behavior: 4.5, safety: 5.0 },
    dieselPrice: 94.5,
    mileage: 10,
    tollEstimate: 1200
  },
  {
    id: "TRK-002",
    driverName: "Amit Singh",
    driverDetails: {
      age: 29,
      sex: 'Male',
      licenseNumber: "MH-40-2015-998877",
      experienceYears: 5
    },
    vehicleModel: "Eicher Pro 1049",
    vehicleRegNo: "MH-40-X-9090",
    origin: "Kalmeshwar",
    destination: "Mumbai (Bhiwandi)",
    departureDate: "2024-10-26",
    capacityTotal: 7.0,
    capacityFilled: 3.5, // 50% Full
    pricePerTon: 4200,
    isGroupShippingAllowed: true,
    status: "Partial",
    rating: { overall: 4.5, punctuality: 4.0, behavior: 4.8, safety: 4.7 },
    dieselPrice: 95.0,
    mileage: 8,
    tollEstimate: 2100
  },
  {
    id: "TRK-003",
    driverName: "Suresh Patil",
    driverDetails: {
      age: 51,
      sex: 'Male',
      licenseNumber: "MH-31-1995-112233",
      experienceYears: 25
    },
    vehicleModel: "Ashok Leyland Boss",
    vehicleRegNo: "MH-31-AL-5555",
    origin: "Hingna MIDC",
    destination: "Hyderabad",
    departureDate: "2024-10-25",
    capacityTotal: 10.0,
    capacityFilled: 9.0, // Only 1 Ton left
    pricePerTon: 3800,
    isGroupShippingAllowed: false,
    status: "Almost Full",
    rating: { overall: 4.2, punctuality: 3.8, behavior: 4.0, safety: 4.8 }
  }
];

export const initialLoadRequests: LoadRequest[] = [
  {
    id: "REQ-101",
    companyName: "Vidarbha Textiles",
    goodsType: "Cotton Bales",
    weight: 1.2,
    origin: "Butibori MIDC",
    destination: "Pune (Chakan)",
    targetPrice: 4000,
    status: "Pending"
  },
  {
    id: "REQ-102",
    companyName: "Nagpur Agro Foods",
    goodsType: "Orange Pulp Crate",
    weight: 2.0,
    origin: "Kalmeshwar",
    destination: "Mumbai (Bhiwandi)",
    targetPrice: 9000,
    status: "Pending"
  }
];

// Pre-seeded bookings including history
export const initialBookings: Booking[] = [
  {
    id: "BK-901",
    truckId: "TRK-002",
    factoryName: "My Factory Pvt Ltd",
    goodsType: "Processed Soy",
    isFragile: false,
    weight: 2.0,
    originAddress: "Plot No 45, Kalmeshwar Industrial Area, Nagpur",
    destinationAddress: "Bhiwandi Warehousing Corp, Mumbai",
    price: 8400,
    status: "In-Transit",
    otp: "4590",
    bookingTime: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    expiryTime: new Date(Date.now() - 43200000).toISOString(),
    coLoaders: ["Nagpur Agro Foods"],
    estimatedArrival: new Date(Date.now() + 12000000).toISOString(), // 3 hours from now
    chatHistory: [
      { sender: 'system', text: 'Booking Confirmed', timestamp: new Date(Date.now() - 86000000).toISOString() },
      { sender: 'trucker', text: 'Picked up the goods. Leaving Kalmeshwar now.', timestamp: new Date(Date.now() - 36000000).toISOString() },
      { sender: 'factory', text: 'Great, drive safely.', timestamp: new Date(Date.now() - 35000000).toISOString() }
    ]
  },
  {
    id: "BK-880",
    truckId: "TRK-001",
    factoryName: "My Factory Pvt Ltd",
    goodsType: "Machinery Parts",
    isFragile: true,
    weight: 1.0,
    originAddress: "Butibori MIDC",
    destinationAddress: "Pune (Chakan)",
    price: 3500,
    status: "Delivered",
    otp: "0000",
    bookingTime: new Date(Date.now() - 604800000).toISOString(), // 1 week ago
    expiryTime: "",
    chatHistory: []
  },
  {
    id: "BK-850",
    truckId: "TRK-003",
    factoryName: "My Factory Pvt Ltd",
    goodsType: "Textile Waste",
    isFragile: false,
    weight: 5.0,
    originAddress: "Hingna MIDC",
    destinationAddress: "Hyderabad",
    price: 19000,
    status: "Delivered",
    otp: "0000",
    bookingTime: new Date(Date.now() - 1209600000).toISOString(), // 2 weeks ago
    expiryTime: "",
    chatHistory: []
  }
];