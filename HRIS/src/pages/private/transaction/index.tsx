/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect } from 'react'
import { AllTransaction } from '../../../config/services/request'
import { saveTransactionList, selector } from '../../../zustand/store/store.provider'
import useStore from '../../../zustand/store/store'
import { Tag } from 'antd'
import { CustomTable } from '../../../components/table/customTable'
import { CustomButton } from '../../../components'
import { Guest } from '../../../types'
import { useNavigate } from 'react-router-dom'
import { RouterUrl } from '../../../routes'

export const TransactionPage = () => {
  const admin = useStore(selector('admin'))
  const navigate = useNavigate()

  async function Fetch(){
    const res = await AllTransaction.GET()
    saveTransactionList(res.data.data)
  }
  useEffect(() =>{
    Fetch();
  },[])

  const columns = [
    {key:0,title:'Guest Name',dataIndex:'guests',
      render:(data:any) =>(
        <div>{`${data?.firstName} ${data?.lastName}`}</div>
      )
    },
    {key:1,title:'Room Type',dataIndex:'guests',      
    render:(data:Guest) =>{
      return(
      <p>{data?.reservations[0]?.room.type}</p>
    )}},
    {key:2,title:'No. of Days',dataIndex:'guests',      
    render:(data:Guest) =>{
      return(
      <p>{data?.reservations[0]?.noOfDays}</p>
    )}},
    {key:3,title:'No. of Pax',dataIndex:'guests',      
    render:(data:Guest) =>{
      return(
      <p>{data?.reservations[0]?.noOfPax}</p>
    )}},
    {key:4,title:'Status',dataIndex:'guests',      
    render:(data:Guest) =>{
      return(
      <Tag color={data?.reservations[0]?.status === 'Pending' ? 'gold' : data?.reservations[0]?.status === 'Check-In' ? 'success' : 'error'}>{data?.reservations[0]?.status}</Tag>
    )}},
    {key:5,title:'Action',
    render:(data:any) =>(
      <div>
        <CustomButton
          children={'Pay now'}
        />
      </div>
    )
    },
  ]
  return (
    <div>
      <div className='flex justify-between items-center mb-4'>
        <h1 className='text-[24px] font-bold'>Transactions</h1>
        <CustomButton
          children='Add Reservation'
          onClick={() => navigate(RouterUrl.AddReservation)}
        />
      </div>
      <div>
        <CustomTable
         columns={columns}
         datasource={admin.transaction}
        />
      </div>
    </div>
  )
}
