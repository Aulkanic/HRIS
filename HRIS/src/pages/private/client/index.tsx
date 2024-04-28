/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from 'react'
import { CustomTable } from '../../../components/table/customTable'
import { AllGuests } from '../../../config/services/request'
import { saveGuestList, selector } from '../../../zustand/store/store.provider'
import useStore from '../../../zustand/store/store'
import { CustomButton } from '../../../components'
import { HiUserAdd } from "react-icons/hi";
import { useNavigate } from 'react-router-dom'
import { RouterUrl } from '../../../routes'

export const ClientPage = () => {
  const navigate = useNavigate()
  const admin = useStore(selector('admin'))
  
  async function Fetch(){
    const res = await AllGuests.GET()
    saveGuestList(res.data.data)
  }
  useEffect(() =>{
    Fetch();
  },[])
  const columns = [
    {key:0,title:'First Name',dataIndex:'firstName'},
    {key:1,title:'Middle Initial',dataIndex:'middleInitial'},
    {key:2,title:'Last Name',dataIndex:'lastName'},
    {key:3,title:'House No',dataIndex:'houseNo'},
    {key:4,title:'Street',dataIndex:'street'},
    {key:5,title:'Barangay',dataIndex:'barangay'},
    {key:6,title:'City',dataIndex:'city'},
    {key:7,title:'Province',dataIndex:'province'},
    {key:8,title:'Contact Number',dataIndex:'contactNo'},
  ]
  return (
    <div>
      <div className='flex justify-between items-center mb-8'>
        <h1 className='text-[24px] font-bold'>Guest Information</h1>
        <CustomButton
            children='Add Guest'
            onClick={() => navigate(RouterUrl.AddGuest)}
            icon={<HiUserAdd color='white' className='bg-sky-600 rounded-full p-2' size={30} />}
            classes='w-[200px] text-[16px] font-bold flex-row-reverse flex justify-center gap-4 items-center p-4 rounded-full h-[50px] shadow-[0px_6px_10px_0px_#D3D3D3]'
          />
      </div>
      <div>
        <CustomTable
          columns={columns}
          datasource={admin.guests}
        />
      </div>
    </div>
  )
}
