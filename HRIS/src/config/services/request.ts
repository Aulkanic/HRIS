/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosInstance from "./axios";
import { Endpoints } from "./endpoint";

export const AdminLogin = {
    POST: (data:any) => axiosInstance.post(Endpoints.Login, data)
}