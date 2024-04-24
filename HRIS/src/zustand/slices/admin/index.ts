/* eslint-disable @typescript-eslint/no-explicit-any */
import { type StateCreator } from "zustand/vanilla";
import { T_GuestForm } from "../../../types";


interface AdminState {
    loading?:boolean;
    info?:any;
    form?:T_GuestForm;
    responseMsg?:string;
}

export interface AdminSlice {
    admin: AdminState;
    saveAdminInfo: (info: any) => void;
    saveGuestFormInfo: (values:any) => void;
}

const initialState:AdminState = {
    loading:false,
    info:null,
    responseMsg: "",
    form:{
        firstName:'',
        middleInitial:'',
        lastName:'',
        houseNo:'',
        street:'',
        barangay:'',
        city:'',
        province:'',
        contactNo:'',
        paymentMethod:'',
        amountToPay:0,
        amountReceived:0,
        discount:0,
        balance:0,
        status:'Pending',
        arrival:new Date(),
        departure: new Date(),
        roomType:'',
        noOfDays:1,
        noOfPax:0
    }
}

const createAdminSlice: StateCreator<AdminSlice> = (set) =>({
    admin:initialState,
    saveAdminInfo:(payload:any) =>{
        set((state) => ({
            ...state,
            admin: {
              ...state.admin,
              info:payload,
              responseMsg: '',
            },
          })); 
    },
    saveGuestFormInfo:(payload:any) =>{
        try {
            set((state) => ({
                ...state,
                admin: {
                    ...state.admin,
                    form: {
                        ...(state.admin!.form || initialState.form), // Keep existing form fields
                        ...payload // Update with new fields from payload
                    }
                }
            }));
        } catch (error) {
            set((state) =>({
                ...state,
                admin:{
                    ...state.admin,
                responseMsg:'err'
                }
            }))
        }
    }
})

export default createAdminSlice