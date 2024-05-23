/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react'
import { CustomTable } from '../../../components/table/customTable'
import { AllGuests, DeleteGuest, UpdateGuest } from '../../../config/services/request'
import { saveGuestList, selector } from '../../../zustand/store/store.provider'
import useStore from '../../../zustand/store/store'
import { CustomButton } from '../../../components'
import { HiUserAdd } from "react-icons/hi";
import { useNavigate } from 'react-router-dom'
import { RouterUrl } from '../../../routes'
import Swal from 'sweetalert2'
import { DatePicker, Form, Input, Modal, notification } from 'antd'
import dayjs from 'dayjs'

export const ClientPage = () => {
  const navigate = useNavigate()
  const [form] = Form.useForm()
  const admin = useStore(selector('admin'))
  const [isOpen,setIsOpen] = useState(false)
  const [isLoading,setIsLoading] = useState(false)
  const [id,setId] = useState(null)
  
  async function Fetch(){
    const res = await AllGuests.GET()
    saveGuestList(res.data.data)
  }
  useEffect(() =>{
    Fetch();
  },[])

  const handleDeletion = (data:any) => {
    console.log(data)
    Swal.fire({
      title: 'Are you sure?',
      text: `You want to delete this guests? ${data?.firstName} ${data?.lastName}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          setIsLoading(true)
          const formData = new FormData()
          formData.append('id',data.id)
          const res = await DeleteGuest.DELETE(formData);
          if(res.data.data && res.data.success === 1){
            setIsLoading(false)
            Fetch()
            Swal.fire('Deleted!', `Guest ${data?.firstName} ${data?.lastName} was deleted`, 'success');
          }else{
            setIsLoading(false)
            throw new Error();
          }
         
        } catch (error) {
          console.log(error)
          setIsLoading(false)
          Swal.fire('Error!', 'Failed to delete item.', 'error');
        }
      }else if (
        /* Read more about handling dismissals below */
        result.dismiss === Swal.DismissReason.cancel
      ) {
        Swal.fire({
          title: "Cancelled",
          text: "Delete was cancelled :)",
          icon: "error"
        });
      }
    });
  }

  const handleModalOpen = (data:any) =>{
     data.birthday = dayjs(data.birthday)
     form.setFieldsValue(data)
     setId(data.id)
     setIsOpen(true)
  }
  const handleModalClose = () =>{
    setIsOpen(false)
    form.resetFields()
  }

  const columns = [
    {key:0,title:'First Name',dataIndex:'firstName',
    render:(data:any) =>(
      <p>{data}</p>
    )},
    {key:1,title:'Middle Initial',dataIndex:'middleInitial',
    render:(data:any) =>(
      <p>{data}</p>
    )},
    {key:2,title:'Last Name',dataIndex:'lastName',
    render:(data:any) =>(
      <p>{data}</p>
    )},
    {key:3,title:'House No',dataIndex:'houseNo',
    render:(data:any) =>(
      <p>{data}</p>
    )},
    {key:4,title:'Street',dataIndex:'street',
    render:(data:any) =>(
      <p>{data}</p>
    )},
    {key:5,title:'Barangay',dataIndex:'barangay',
    render:(data:any) =>(
      <p>{data}</p>
    )},
    {key:6,title:'City',dataIndex:'city',
    render:(data:any) =>(
      <p>{data}</p>
    )},
    {key:7,title:'Province',dataIndex:'province',
    render:(data:any) =>(
      <p>{data}</p>
    )},
    {key:8,title:'Contact Number',dataIndex:'contactNo',
    render:(data:any) =>(
      <p>{data}</p>
    )},
    {key:9,title:'Actions',
      render:(data:any) =>(
        <div className='flex gap-2'>
          <CustomButton
            children='Edit'
            classes='bg-sky-600 text-white w-20'
            onClick={() => handleModalOpen(data)}
          />
          <CustomButton
            children='Delete'
            danger
            classes='w-20'
            onClick={() => handleDeletion(data)}
          />
        </div>
      )
    },
  ]

  const onFinish = async(values:any) =>{
try {
      if(!id){
        notification.error({
          message: 'No Id exist'
        })
        return
      }
      setIsLoading(true);
      setIsOpen(false)
      const formData = new FormData();
      formData.append('id',id)
      formData.append('firstName',values.firstName)
      formData.append('middleInitial',values.middleInitial)
      formData.append('lastName',values.lastName)
      formData.append('houseNo',values.houseNo)
      formData.append('street',values.street)
      formData.append('barangay',values.barangay)
      formData.append('city',values.city)
      formData.append('province',values.province)
      formData.append('contactNo',values.contactNo)  
      formData.append('birthday',new Date(values.birthday).toISOString())  
      formData.append('email',values.email)  
      formData.append('nationality',values.nationality)  
      const res = await UpdateGuest.PUT(formData)
      if(res.data.data){
        notification.success({
          message: "Update Guest",
          description:"Guest updated successfully"
        })
        setIsLoading(false)
        Fetch()
      }
} catch (error) {
  notification.error({
    message: "Error updating guest",
  })
  setIsLoading(false)
}
  }

  const renderModalContent = () =>(
    <Form form={form} onFinish={onFinish} layout='vertical'>
      <div className='flex gap-2 flex-nowrap'>
      <Form.Item className='flex-1' label={<p>Last Name</p>} name='lastName'>
        <Input />
      </Form.Item>
      <Form.Item className='flex-1' label={<p>First Name</p>} name='firstName'>
        <Input />
      </Form.Item>
      <Form.Item className='flex-1' label={<p>Middle Initial</p>} name='middleInitial'>
        <Input />
      </Form.Item>
      </div>
      <div className='flex gap-4'>
      <Form.Item className='flex-1' label={<p>House No.</p>} name='houseNo'>
        <Input />
      </Form.Item>
      <Form.Item className='flex-1' label={<p>Street</p>} name='street'>
        <Input />
      </Form.Item>
      <Form.Item className='flex-1' label={<p>Barangay</p>} name='barangay'>
        <Input />
      </Form.Item>
      </div>
      <div className='flex gap-4'>
      <Form.Item className='flex-1' label={<p>City</p>} name='city'>
        <Input />
      </Form.Item>
      <Form.Item className='flex-1' label={<p>Province</p>} name='province'>
        <Input />
      </Form.Item>
      <Form.Item className='flex-1' label={<p>Contact Number</p>} name='contactNo'>
        <Input addonBefore={<p className="bg-white">+63</p>} />
      </Form.Item>
      </div>
      <div className='flex gap-4'>
      <Form.Item className='flex-1' label={<p>Birthday</p>} name='birthday'>
        <DatePicker className='w-full' />
      </Form.Item>
      <Form.Item className='flex-1' label={<p>Email</p>} name='email'>
        <Input />
      </Form.Item>
      <Form.Item className='flex-1' label={<p>Nationality</p>} name='nationality'>
        <Input />
      </Form.Item>
      </div>
      <div className='w-full flex gap-4 justify-end items-end my-4'>
        <CustomButton
          children='Cancel'
          onClick={handleModalClose}
        />
        <CustomButton
          children='Save changes'
          htmlType='submit'
          classes='bg-sky-600 text-white'
        />
      </div>
    </Form>
  )
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
          loading={isLoading}
        />
      </div>
      <Modal footer={null} width={900} open={isOpen} title={<p>Edit Guest Informations:</p>} onCancel={handleModalClose}>
        {renderModalContent()}
      </Modal>
    </div>
  )
}
