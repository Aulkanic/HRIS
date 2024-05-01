/* eslint-disable @typescript-eslint/no-explicit-any */
import { type StateCreator } from "zustand/vanilla";
import { T_GuestForm, T_ReserveForm } from "../../../types";


interface AdminState {
    loading?:boolean;
    info?:any;
    form?:T_GuestForm;
    reserveFrm?:T_ReserveForm;
    responseMsg?:string;
    rooms?:any;
    guests?:any;
    department?:any;
    reservation?:any;
    transaction?:any;
}

export interface AdminSlice {
    admin: AdminState;
    saveAdminInfo: (info: any) => void;
    saveGuestFormInfo: (values:any) => void;
    saveReserveFormInfo: (values:any) => Promise<boolean>;
    resetGuestForm:() => void;
    resetReserveForm: ()=>void;
    saveRoomList: (payload:any) => void;
    saveGuestList: (payload:any) => void;
    saveReservationList: (payload:any) => void;
    saveTransactionList: (payload:any) => void;
    saveDepartmentServices: (payload:any) => void;
}

const initialState:AdminState = {
    loading:false,
    info:null,
    responseMsg: "",
    form:{
        firstName:'',
        middleInitial:'',
        surName:'',
        houseNum:'',
        street:'',
        barangay:'',
        city:'',
        province:'',
        contactNum:'',
        paymentMethod:'',
        amountToPay:0,
        amountReceived:0,
        discount:0,
        balance:0,
        arrival:new Date(),
        departure: new Date(),
        roomType:'',
        noOfDays:1,
        noOfPax:0,
        paymentStatus:''
    },
    reserveFrm:{
        firstName:'',
        middleInitial:'',
        surName:'',
        houseNum:'',
        street:'',
        barangay:'',
        city:'',
        province:'',
        contactNum:'',
        arrival:new Date(),
        departure: new Date(),
        roomType:'',
        noOfDays:1,
        noOfPax:0,
    },
    rooms:[],
    guests:[],
    department:{
      list: [],
      services:[]
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
    },
    saveReserveFormInfo: async (payload: any) => {
        return new Promise((resolve, reject) => {
          try {
            set((state) => ({
              ...state,
              admin: {
                ...state.admin,
                reserveFrm: {
                  ...(state.admin!.reserveFrm || initialState.reserveFrm), // Keep existing form fields
                  ...payload // Update with new fields from payload
                }
              }
            }));
            resolve(true); // Resolve the promise once the state update is complete
          } catch (error) {
            reject(error); // Reject the promise if there's an error
          }
        });
    },
    resetGuestForm:() =>{
        set((state)=>{
           return {...state, admin : {...state.admin, form: initialState.form}};
       })
    },
    resetReserveForm:() =>{
        set((state)=>{
           return {...state, admin : {...state.admin, reserveFrm: initialState.reserveFrm}};
       })
    },
    saveRoomList:(payload:any) =>{
        set((state) => ({
            ...state,
            admin: {
              ...state.admin,
              rooms:payload,
              responseMsg: '',
            },
          })); 
    },
    saveGuestList:(payload:any) =>{
        set((state) => ({
            ...state,
            admin: {
              ...state.admin,
              guests:payload,
              responseMsg: '',
            },
          })); 
    },
    saveReservationList:(payload:any) =>{
        set((state) => ({
            ...state,
            admin: {
              ...state.admin,
              reservation:payload,
              responseMsg: '',
            },
          })); 
    },
    saveTransactionList:(payload:any) =>{
        console.log(payload)
        set((state) => ({
            ...state,
            admin: {
              ...state.admin,
              transaction:payload,
              responseMsg: '',
            },
          })); 
    },
    saveDepartmentServices:(payload:any) =>{
      set((state) => ({
          ...state,
          admin: {
            ...state.admin,
            department:{
              list:payload.department,
              services:payload.service
            },
            responseMsg: '',
          },
        })); 
  },
})

export default createAdminSlice