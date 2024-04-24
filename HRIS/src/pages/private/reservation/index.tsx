import React from 'react'
import { CustomTable } from '../../../components/table/customTable'

export const ReservationPage = () => {
  const columns = [
    {key:0,title:'First Name'},
    {key:1,title:'Middle Initial'},
    {key:2,title:'Last Name'},
    {key:3,title:'House No'},
    {key:4,title:'Street'},
    {key:5,title:'Barangay'},
    {key:6,title:'City'},
    {key:7,title:'Province'},
    {key:8,title:'Contact Number'},
  ]
  return (
    <div>
      <div>
        <h1>Reservations List</h1>
      </div>
      <div>
        <CustomTable
          columns={columns}
        />
      </div>
    </div>
  )
}
