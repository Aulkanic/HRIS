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


export const UpdateRoom = {
    PUT: (data:any) => axiosInstance.put(Endpoints.UpdateRoom + `/${data?.get('id')}`, data)
}