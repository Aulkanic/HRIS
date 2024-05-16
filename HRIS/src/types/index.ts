/* eslint-disable @typescript-eslint/no-explicit-any */
export interface T_GuestForm{
    firstName: string;
    middleInitial: string;
    surName: string;
    houseNum: string;
    street: string;
    barangay: string;
    city: string;
    province: string;
    contactNum: string;
    paymentMethod:string;
    amountToPay: number;
    amountReceived:number;
    discount: number;
    balance: number;
    arrival: Date | null;
    departure: Date | null;
    roomType: string;
    noOfDays: number;
    noOfPax: number;
    paymentStatus: string;
}

export interface T_ReserveForm{
    firstName: string;
    middleInitial: string;
    surName: string;
    houseNum: string;
    street: string;
    barangay: string;
    city: string;
    province: string;
    contactNum: string;
    arrival: Date | null;
    departure: Date | null;
    roomType: string;
    noOfDays: number;
    noOfPax: number;
}


export interface Room {
    id: number;
    type: string;
    rate: number;
    status: number;
    minimumCapacity: number;
    maximumCapacity: number;
    availableRooms: number;
    totalNoOfOccupiedRooms: number;
    createdAt: Date;
    updatedAt: Date;
  }
  
 export interface Reservation {
    id: number;
    guestsId: number;
    roomId: number;
    noOfDays: number;
    noOfPax: number;
    arrival: Date;
    departure: Date;
    status: string;
    createdAt: Date;
    updatedAt: Date;
    total: number;
    room: Room; // Room interface as a property
  }
  
export interface Guest {
    id: number;
    firstName: string;
    middleInitial: string;
    lastName: string;
    houseNo: string;
    street: string;
    barangay: string;
    city: string;
    province: string;
    contactNo: string;
    createdAt: Date;
    updatedAt: Date;
    reservations: Reservation[]; // Reservation array as a property
  }
  
 export interface Transaction {
    id: number;
    guestsId: number;
    modeOfPayment: string;
    amountToPay: number;
    amountReceived: number;
    discount: number;
    chargesFromDepartments: any | null;
    serviceCharge: number | null;
    balance: number;
    status: string;
    remarks: string | null;
    createdAt: Date;
    updatedAt: Date;
    guests: Guest; // Guest interface as a property
  }
  