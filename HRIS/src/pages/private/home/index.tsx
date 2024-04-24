/* eslint-disable @typescript-eslint/no-explicit-any */
import { FaUsers,FaDollarSign } from "react-icons/fa";
import { HiClipboardDocumentList } from "react-icons/hi2";
import { HiUserAdd } from "react-icons/hi";
import { IoHomeOutline } from "react-icons/io5";
import { CustomButton } from '../../../components';
import { CustomTable } from '../../../components/table/customTable';
import { useNavigate } from "react-router-dom";
import { RouterUrl } from "../../../routes";

export const Home = () => {
  const navigate = useNavigate()
  const columns = [
    {key:0,title:"BOOK NUMBER"},
    {key:1,title:"NAME"},
    {key:2,title:"ROOM TYPE"},
    {key:3,title:"DAYS OF STAY"},
    {key:4,title:"DATE"},
  ]
  return (
    <div>
      <div>
        <div className='flex h-[150px] gap-4'>
            <div className='w-[250px] flex justify-between items-center p-4 rounded-md h-[100px] shadow-[0px_6px_10px_0px_#D3D3D3]'>
              <div>
              <p className='text-[#006394] font-semibold text-[20px]'>Total guest</p>
              <p className='text-[#006394] font-semibold text-[20px]'>0</p>
              </div>
              <div>
              <FaUsers color='white' className='bg-sky-600 rounded-full p-2' size={60}/>
              </div>
            </div>
            <div className='w-[250px] flex justify-between items-center p-4 rounded-md h-[100px] shadow-[0px_6px_10px_0px_#D3D3D3]'>
              <div>
              <p className='text-[#03A000] font-semibold text-[20px]'>Revenue</p>
              <p className='text-[#03A000] font-semibold text-[20px]'>0</p>
              </div>
              <div>
              <FaDollarSign color='white' className='bg-[#03A000] rounded-full p-2' size={60}/>
              </div>
            </div>
            <div className='w-[250px] flex justify-between items-center p-4 rounded-md h-[100px] shadow-[0px_6px_10px_0px_#D3D3D3]'>
              <div>
              <p className='text-[#FFA800] font-semibold text-[20px]'>Total Reservation</p>
              <p className='text-[#FFA800] font-semibold text-[20px]'>0</p>
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
          <h2 className='mb-1 text-[#006394] text-[20px]'>Latest booking</h2>
            <CustomTable
              columns={columns}
              classes='h-[400px]'
            />
          </div>
          <div className='flex-1 h-max px-4'>
          <h2 className='mb-1 text-[#006394] text-[20px]'>Available Rooms</h2>
          <div className="flex flex-col space-y-4">
            <div className='w-[252px] h-[50px] flex justify-between items-center px-2 bg-gradient-to-r from-slate-50 to-neutral-700 rounded-md shadow-[0px_0px_0px_1px_rgba(0,0,0,0.06),0px_1px_1px_-0.5px_rgba(0,0,0,0.06),0px_3px_3px_-1.5px_rgba(0,0,0,0.06),_0px_6px_6px_-3px_rgba(0,0,0,0.06),0px_12px_12px_-6px_rgba(0,0,0,0.06),0px_24px_24px_-12px_rgba(0,0,0,0.06)]'>
              <div>
                <p className="text-[#006394] text-[20px] font-normal">Presidential</p>
              </div>
              <div className="flex gap-2 text-white font-semibold items-center">
                <p className="text-[20px] font-bold">0/10</p>
                <IoHomeOutline size={20} />
              </div>
            </div>
            <div className='w-[252px] h-[50px] flex justify-between items-center px-2 bg-gradient-to-r from-slate-50 to-neutral-700 rounded-md shadow-[0px_0px_0px_1px_rgba(0,0,0,0.06),0px_1px_1px_-0.5px_rgba(0,0,0,0.06),0px_3px_3px_-1.5px_rgba(0,0,0,0.06),_0px_6px_6px_-3px_rgba(0,0,0,0.06),0px_12px_12px_-6px_rgba(0,0,0,0.06),0px_24px_24px_-12px_rgba(0,0,0,0.06)]'>
              <div>
                <p className="text-[#006394] text-[20px]">Family Suits</p>
              </div>
              <div className="flex gap-2 text-white font-semibold items-center">
                <p className="text-[20px] font-bold">0/10</p>
                <IoHomeOutline size={20} />
              </div>
            </div>
            <div className='w-[252px] h-[50px] flex justify-between items-center px-2 bg-gradient-to-r from-slate-50 to-neutral-700 rounded-md shadow-[0px_0px_0px_1px_rgba(0,0,0,0.06),0px_1px_1px_-0.5px_rgba(0,0,0,0.06),0px_3px_3px_-1.5px_rgba(0,0,0,0.06),_0px_6px_6px_-3px_rgba(0,0,0,0.06),0px_12px_12px_-6px_rgba(0,0,0,0.06),0px_24px_24px_-12px_rgba(0,0,0,0.06)]'>
              <div>
                <p className="text-[#006394] text-[20px]">Superior</p>
              </div>
              <div className="flex gap-2 text-white font-semibold items-center">
                <p className="text-[20px] font-bold">0/10</p>
                <IoHomeOutline size={20} />
              </div>
            </div>
            <div className='w-[252px] h-[50px] flex justify-between items-center px-2 bg-gradient-to-r from-slate-50 to-neutral-700 rounded-md shadow-[0px_0px_0px_1px_rgba(0,0,0,0.06),0px_1px_1px_-0.5px_rgba(0,0,0,0.06),0px_3px_3px_-1.5px_rgba(0,0,0,0.06),_0px_6px_6px_-3px_rgba(0,0,0,0.06),0px_12px_12px_-6px_rgba(0,0,0,0.06),0px_24px_24px_-12px_rgba(0,0,0,0.06)]'>
              <div>
                <p className="text-[#006394] text-[20px]">Deluxe</p>
              </div>
              <div className="flex gap-2 text-white font-semibold items-center">
                <p className="text-[20px] font-bold">0/10</p>
                <IoHomeOutline size={20} />
              </div>
            </div>
            <div className='w-[252px] h-[50px] flex justify-between items-center px-2 bg-gradient-to-r from-slate-50 to-neutral-700 rounded-md shadow-[0px_0px_0px_1px_rgba(0,0,0,0.06),0px_1px_1px_-0.5px_rgba(0,0,0,0.06),0px_3px_3px_-1.5px_rgba(0,0,0,0.06),_0px_6px_6px_-3px_rgba(0,0,0,0.06),0px_12px_12px_-6px_rgba(0,0,0,0.06),0px_24px_24px_-12px_rgba(0,0,0,0.06)]'>
              <div>
                <p className="text-[#006394] text-[20px]">Standard</p>
              </div>
              <div className="flex gap-2 text-white font-semibold items-center">
                <p className="text-[20px] font-bold">0/10</p>
                <IoHomeOutline size={20} />
              </div>
            </div>
            <div className='w-[252px] h-[50px] flex justify-between items-center px-2 bg-gradient-to-r from-slate-50 to-neutral-700 rounded-md shadow-[0px_0px_0px_1px_rgba(0,0,0,0.06),0px_1px_1px_-0.5px_rgba(0,0,0,0.06),0px_3px_3px_-1.5px_rgba(0,0,0,0.06),_0px_6px_6px_-3px_rgba(0,0,0,0.06),0px_12px_12px_-6px_rgba(0,0,0,0.06),0px_24px_24px_-12px_rgba(0,0,0,0.06)]'>
              <div>
                <p className="text-[#006394] text-[20px]">Single Room</p>
              </div>
              <div className="flex gap-2 text-white font-semibold items-center">
                <p className="text-[20px] font-bold">0/10</p>
                <IoHomeOutline size={20} />
              </div>
            </div>
          </div>
          </div>
        </div>
      </div>
    </div>
  )
}
