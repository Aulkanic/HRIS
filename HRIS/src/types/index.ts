export interface T_GuestForm{
    firstName: string;
    middleInitial: string;
    lastName: string;
    houseNo: string;
    street: string;
    barangay: string;
    city: string;
    province: string;
    contactNo: string;
    paymentMethod:string;
    amountToPay: number;
    amountReceived:number;
    discount: number;
    balance: number;
    status: string;
    arrival: Date | null;
    departure: Date | null;
    roomType: string;
    noOfDays: number;
    noOfPax: number;
}