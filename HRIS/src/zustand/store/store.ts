import { create } from "zustand";
import { persist, devtools } from "zustand/middleware";
import { createAdminSlice } from "../slices";
import { type AdminSlice } from "../slices/admin";

type TAppSlices = AdminSlice;
const useStore = create<TAppSlices>()(
    devtools(
        persist(
            (...args) =>({
                ...createAdminSlice(...args),
            }),
            {
                name:'HRIS'
            }
        )
    )
)

export default useStore