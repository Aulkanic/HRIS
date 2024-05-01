/* eslint-disable @typescript-eslint/no-explicit-any */
import { FaUsers } from "react-icons/fa";
import { HiClipboardDocumentList } from "react-icons/hi2";
import { HiUserAdd } from "react-icons/hi";
import { IoHomeOutline } from "react-icons/io5";
import { CustomButton } from '../../../components';
import { CustomTable } from '../../../components/table/customTable';
import { useNavigate } from "react-router-dom";
import { RouterUrl } from "../../../routes";
import { AllGuests, AllReservations, AllRooms } from "../../../config/services/request";
import { saveGuestList, saveReservationList, saveRoomList, selector } from "../../../zustand/store/store.provider";
import { useEffect } from "react";
import useStore from "../../../zustand/store/store";
import { Room } from "../../../types";
import { dateFormatter } from "../../../config/utils/util";

export const Home = () => {
  const navigate = useNavigate()
  const admin = useStore(selector('admin'))

  async function Fetch(){
    const res = await AllRooms.GET()
    const res1 = await AllGuests.GET()
    const res2 = await AllReservations.GET()
    saveReservationList(res2.data.data)
    saveGuestList(res1.data.data)
    saveRoomList(res.data.data)
  }
  useEffect(() =>{
    Fetch()
  },[])
  
  const columns = [
    {key:0,title:"GUEST NAME",dataIndex:'guests',
      render:(data:any) =>(
        <p>{`${data?.firstName} ${data?.lastName}`}</p>
      )
    },
    {key:2,title:"ROOM TYPE",dataIndex:'room',
    render:(data:any) =>(
      <p>{`${data?.type}`}</p>
    )
    },
    {key:3,title:"NUMBER OF DAYS",dataIndex:'noOfDays'},
    {key:4,title:"ARRIVAL",dataIndex:'arrival',      
    render:(data:any) =>(
      <p>{dateFormatter(data)}</p>
    )},
    {key:5,title:"DEPARTURE",dataIndex:'departure',      
    render:(data:any) =>(
      <p>{dateFormatter(data)}</p>
    )},
  ]
  console.log(admin)
  return (
    <div>
      <div>
        <div className='flex flex-wrap h-[150px] gap-4'>
            <div className='flex-1 flex justify-between items-center p-4 rounded-md h-[100px] shadow-[0px_6px_10px_0px_#D3D3D3]'>
              <div>
              <p className='text-[#006394] font-semibold text-[20px]'>Total guest</p>
              <p className='text-[#006394] font-semibold text-[20px]'>{admin.guests?.length}</p>
              </div>
              <div>
              <FaUsers color='white' className='bg-sky-600 rounded-full p-2' size={60}/>
              </div>
            </div>

            <div className='flex-1 flex justify-between items-center p-4 rounded-md h-[100px] shadow-[0px_6px_10px_0px_#D3D3D3]'>
              <div>
              <p className='text-[#FFA800] font-semibold text-[20px]'>Total Reservation</p>
              <p className='text-[#FFA800] font-semibold text-[20px]'>{admin.reservation?.length}</p>
              </div>
              <div>
              <HiClipboardDocumentList color='white' className='bg-[#FFA800] rounded-full p-2' size={60}/>
              </div>
            </div>
            <CustomButton
              children='Add Guest'
              onClick={() => navigate(RouterUrl.AddGuest)}
              icon={<HiUserAdd color='white' className='bg-sky-600 rounded-full p-2' size={50} />}
              classes='w-[250px] text-[20px] ml-12 font-bold flex-row-reverse flex justify-center gap-4 items-center p-4 rounded-full h-[100px] shadow-[0px_6px_10px_0px_#D3D3D3]'
            />
        </div>
        <div className='w-full flex flex-nowrap'>
          <div className='w-[75%] h-full'>
          <h2 className='mb-1 text-[#006394] text-[20px]'>Latest Reservation</h2>
            <CustomTable
              columns={columns}
              classes='h-[400px]'
              datasource={admin.reservation?.filter((reservation:any) => reservation.createdAt.slice(0, 10) === new Date().toISOString().slice(0, 10)).sort((a:any, b:any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())}
            />
          </div>
          <div className='flex-1 h-max px-4'>
          <h2 className='mb-1 text-[#006394] text-[20px]'>Available Rooms</h2>
          <div className="flex flex-col space-y-4">
            {admin.rooms?.map((data:Room,idx:number) =>(
            <div key={idx} className='w-[252px] h-[50px] flex justify-between items-center px-2 bg-gradient-to-r from-slate-50 to-neutral-700 rounded-md shadow-[0px_0px_0px_1px_rgba(0,0,0,0.06),0px_1px_1px_-0.5px_rgba(0,0,0,0.06),0px_3px_3px_-1.5px_rgba(0,0,0,0.06),_0px_6px_6px_-3px_rgba(0,0,0,0.06),0px_12px_12px_-6px_rgba(0,0,0,0.06),0px_24px_24px_-12px_rgba(0,0,0,0.06)]'>
            <div>
              <p className="text-[#006394] text-[20px] font-normal">{data.type}</p>
            </div>
            <div className="flex gap-2 text-white font-semibold items-center">
              <p className="text-[20px] font-bold">{data.availableRooms - data.totalNoOfOccupiedRooms}/{data.availableRooms}</p>
              <IoHomeOutline size={20} />
            </div>
          </div>
            ))}
          </div>
          </div>
        </div>
      </div>
    </div>
  )
}
