/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react'
import { CustomButton } from '../../../components'
import { AddRooms, AllRooms, UpdateRoom } from '../../../config/services/request'
import { saveRoomList, selector } from '../../../zustand/store/store.provider'
import useStore from '../../../zustand/store/store'
import { CustomTable } from '../../../components/table/customTable'
import { Form, Input, InputNumber, Modal, Select, Tag, notification } from 'antd'

interface T_Form {
  id:number;
  type:string;
  rate:number;
  maximumCapacity:number;
  minimumCapacity:number;
  status:boolean;
  availableRooms:number;
  vacantRooms:number | null;
}
export const RoomPage = () => {
  const admin = useStore(selector('admin'))
  const [form] = Form.useForm()
  const [act,setAct] = useState('')
  const [isOpen,setIsOpen] = useState(false)
  const [isLoading,setIsLoading] = useState(false)
  const [id,setId] = useState(0)

  async function Fetch(){
    const res = await AllRooms.GET()
    saveRoomList(res.data.data)
  }
  useEffect(() =>{
    Fetch()
  },[])

  const showModalOpen = (act:string,data?:T_Form) =>{
    console.log(data)
    setAct(act)
    if(data){
      form.setFieldsValue(data)
      setId(data.id)
    }
    setIsOpen(true)
  }
  const onModalClose = () =>{
    setIsOpen(false)
    form.resetFields()
    setId(0)
  }
  const columns = [
    {key:0,title:"Room ID",dataIndex:'id'},
    {key:1,title:"Room Type",dataIndex:'type'},
    {key:2,title:"Rate",dataIndex:'rate'},
    {key:3,title:"Status",dataIndex:'status',
      render:(data:any) =>(
        data ? <Tag color='success'>Active</Tag> : <Tag color='error'>Inactive</Tag>
      )
    },
    {key:4,title:"Min Capacity",dataIndex:'maximumCapacity'},
    {key:5,title:"Max Capacity",dataIndex:'minimumCapacity'},
    {key:7,title:"Total No. of Rooms",dataIndex:'availableRooms'},
    {key:8,title:"Total Occupied Rooms",dataIndex:'totalNoOfOccupiedRooms'},
    {key:9,title:"Actions",
      render:(data:any) =>(
        <div className='flex gap-2'>
          <CustomButton
            children='Edit'
            classes='w-20 bg-sky-600 text-white'
            onClick={() =>showModalOpen('edit',data)}
          />
        </div>
      )
    },
  ]

  const onFinish = async(values:any) =>{
    try {
          values.id = id
          setIsLoading(true)
          setIsOpen(false)
          const formData = new FormData()
          if(act !== 'add'){
            formData.append('id',values.id)
          }
          formData.append('type',values.type)
          formData.append('rate',values.rate)
          formData.append('status',values.status)
          formData.append('minimumCapacity',values.minimumCapacity)
          formData.append('maximumCapacity',values.maximumCapacity)
          formData.append('availableRooms',values.availableRooms)
          const res = act == 'add' ? await AddRooms.POST(formData) : await UpdateRoom.PUT(formData)
          if(res.status === 200 && res.data.success === 1){
            notification.success({
              message:`${act==="add"?"Added":"Updated"} Room Successfully`
            })
            Fetch()
            setIsLoading(false)
          }else{
            notification.error({
              message:'Error Occurred While Processing Your Request!'
            })
            setIsLoading(false)
          }
    } catch (error) {
      notification.error({
        message:"Invalid Inputs!"
      });
      console.log("ERROR IN FORM", error);
      setIsLoading(false)
    }
  }
  const renderModalContent = () =>(
    <Form onFinish={onFinish} form={form} layout='vertical' className='mt-2'>
      <Form.Item className='mb-1' label='Room Type' name='type'>
        <Input />
      </Form.Item>
      <Form.Item className='mb-1' label='Rate' name='rate'>
        <InputNumber className='w-full' />
      </Form.Item>
      <Form.Item className='mb-1' label='Status' name='status'>
        <Select className="backdrop-shadow">
          <Select.Option value={0}>
            Inactive
          </Select.Option>
          <Select.Option value={1}>
            Active
          </Select.Option>
        </Select>
      </Form.Item>
      <div className='flex gap-4 w-full flex-nowrap'>
      <Form.Item className='mb-1 flex-1' label='Min. Capacity' name='minimumCapacity'>
        <InputNumber className='w-full' />
      </Form.Item>
      <Form.Item className='mb-1 flex-1' label='Max. Capacity' name='maximumCapacity'>
        <InputNumber className='w-full' />
      </Form.Item>
      </div>
      <Form.Item className='mb-1' label='Total No. of Rooms' name='availableRooms'>
        <InputNumber className='w-full' />
      </Form.Item>
      <div className='w-full flex gap-4 justify-end items-end my-4'>
        <CustomButton
          children='Cancel'
          onClick={onModalClose}
        />
        <CustomButton
          children='Submit'
          htmlType='submit'
        />
      </div>
    </Form>
  )
  console.log(admin.rooms)
  return (
    <div>
      <div className='flex justify-between items-center mb-8'>
        <h1 className='text-[24px] font-bold'>Rooms List</h1>
        <CustomButton
          children='Add New Room'
          classes='font-bold h-max text-[20px] rounded-full shadow-[0px_6px_10px_0px_#D3D3D3]'
          onClick={() =>showModalOpen('add')}
        />
      </div>
      <div>
        <CustomTable
        columns={columns}
        datasource={admin.rooms}
        loading={isLoading}
        />
      </div>
      <Modal footer={null} title={act === 'add' ? 'Add Rooms' : act === 'edit' ? 'Edit Rooms' : 'Delete Rooms'} 
      open={isOpen} onCancel={onModalClose}>
        {renderModalContent()}
      </Modal>
    </div>
  )
}
