/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosInstance from "./axios";
import { Endpoints } from "./endpoint";

export const AdminLogin = {
    POST: (data:any) => axiosInstance.post(Endpoints.Login, data)
}
export const AddRooms = {
    POST: (data:any) => axiosInstance.post(Endpoints.AddRoom, data)
}
export const AddGuest = {
    POST: (data:any) => axiosInstance.post(Endpoints.AddGuest, data)
}
export const AddReservation = {
    POST: (data:any) => axiosInstance.post(Endpoints.AddReservation, data)
}
export const AddTransaction = {
    POST: (data:any) => axiosInstance.post(Endpoints.AddTransaction, data)
}
export const AddService = {
    POST: (data:any) => axiosInstance.post(Endpoints.AddService, data)
}
export const CheckoutTransaction = {
    POST: (data:any) => axiosInstance.post(Endpoints.CheckOutTransaction, data)
}

export const AllRooms = {
    GET: () => axiosInstance.get(Endpoints.FetchRoom)
}
export const AllGuests = {
    GET: () => axiosInstance.get(Endpoints.FetchGuest)
}
export const AllReservations = {
    GET: () => axiosInstance.get(Endpoints.FetchReservation)
}
export const AllTransaction= {
    GET: () => axiosInstance.get(Endpoints.FetchTransaction)
}
export const AllDepartmentServices= {
    GET: () => axiosInstance.get(Endpoints.FetchDepartmentService)
}


export const UpdateRoom = {
    PUT: (data:any) => axiosInstance.put(Endpoints.UpdateRoom + `/${data?.get('id')}`, data)
}
export const UpdateService = {
    PUT: (data:any) => axiosInstance.put(Endpoints.UpdateService + `/${data?.get('id')}`, data)
}
export const UpdateTransaction = {
    PUT: (data:any) => axiosInstance.put(Endpoints.UpdateTransaction + `/${data?.get('id')}`, data)
}
export const UpdateReservation = {
    PUT: (data:any) => axiosInstance.put(Endpoints.UpdateReservation + `/${data?.get('reservationId')}`, data)
}
export const UpdateGuest= {
    PUT: (data:any) => axiosInstance.put(Endpoints.UpdateGuest + `/${data?.get('id')}`, data)
}


export const DeleteService = {
    DELETE: (data:any) => axiosInstance.delete(Endpoints.DeleteService + `/${data?.get('id')}`,{data})
}
export const DeleteGuest = {
    DELETE: (data:any) => axiosInstance.delete(Endpoints.DeleteGuest + `/${data?.get('id')}`,{data})
}
export const DeleteRoom = {
    DELETE: (data:any) => axiosInstance.delete(Endpoints.DeleteRoom + `/${data?.get('id')}`,{data})
}