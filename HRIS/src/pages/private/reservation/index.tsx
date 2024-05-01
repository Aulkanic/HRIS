/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react'
import { CustomTable } from '../../../components/table/customTable'
import { AllReservations } from '../../../config/services/request'
import { saveReservationList, selector } from '../../../zustand/store/store.provider'
import useStore from '../../../zustand/store/store'
import { dateFormatter } from '../../../config/utils/util'
import { Select, Tag } from 'antd'

export const ReservationPage = () => {
  const admin = useStore(selector('admin'))
  const [filter,setFilter] = useState('')

  async function Fetch(){
    const res = await AllReservations.GET()
    saveReservationList(res.data.data)
  }
  useEffect(() =>{
    Fetch();
  },[])

  const onChangeTab = (key: any) => {
    console.log(key)
    setFilter(key);
};
  const columns = [
    {key:0,title:'Reservation ID',dataIndex:'id'},
    {key:1,title:'Guest',dataIndex:'guests',
      render:(data:any) =>(
        <div>{`${data?.firstName} ${data?.lastName}`}</div>
      )
    },
    {key:2,title:'No of Days',dataIndex:'noOfDays'
    },
    {key:3,title:'No of Pax',dataIndex:'noOfPax'},
    {key:4,title:'Room ID',dataIndex:'roomId'},
    {key:5,title:'Arrival',dataIndex:'arrival',      
    render:(data:any) =>(
      <p>{dateFormatter(data)}</p>
    )},
    {key:6,title:'Departure',dataIndex:'departure',      
    render:(data:any) =>(
      <p>{dateFormatter(data)}</p>
    )},
    {key:7,title:'Status',dataIndex:'status',
      render:(data:any) =>(
        <Tag color={data === 'Pending' ? 'gold' : data === 'Check-In' ? 'success' : 'error'}>{data}</Tag>
      )
    },
  ]
  console.log(admin)
  const filterData = admin.reservation?.filter((data:any) =>{
    const Stat = !filter || data.status === filter
    return Stat
  })
  return (
    <div>
      <div className='flex justify-between items-center mb-2'>
        <h1 className='text-[24px] font-bold'>Reservations List</h1>
      </div>
      <div>
        <div className='mb-4'>
        <Select
            style={{ width: 200 }}
            onChange={onChangeTab}
            value={filter}
        >
            <Select.Option value="">All</Select.Option>
            <Select.Option value="Pending">Pending</Select.Option>
            <Select.Option value="Check-In">Check-In</Select.Option>
            <Select.Option value="Check-Out">Check-Out</Select.Option>
        </Select>
        </div>
        <CustomTable
          columns={columns}
          datasource={filterData}
        />
      </div>
    </div>
  )
}
