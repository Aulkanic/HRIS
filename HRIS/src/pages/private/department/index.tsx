/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react'
import { CustomTable } from '../../../components/table/customTable'
import { CustomButton } from '../../../components'
import useStore from '../../../zustand/store/store'
import { saveDepartmentServices, selector } from '../../../zustand/store/store.provider'
import { AddService, AllDepartmentServices, DeleteService, UpdateService } from '../../../config/services/request'
import { currencyFormat, dateFormatter } from '../../../config/utils/util'
import { Form, Input, InputNumber, Modal, Select, Tag, notification } from 'antd'
import Swal from 'sweetalert2'

export const DepartmentPage = () => {
  const admin = useStore(selector('admin'))
  const [form] = Form.useForm()
  const [isOpen,setIsOpen] = useState(false)
  const [isLoading,setIsLoading] = useState(false)
  const [id,setId] = useState(null)
  const [act,setAct] = useState('')
  
  async function Fetch(){
    const res = await AllDepartmentServices.GET()
    console.log(res.data.data)
    saveDepartmentServices(res.data.data)
  }
  useEffect(() =>{
    Fetch();
  },[])

  const handleModalOpen = (act:string,data?:any) =>{
    if(data){
      form.setFieldsValue(data)
    }
    setId(data?.id || null)
    setAct(act)
    setIsOpen(true)

  }
  const handleClose = () =>{
    setAct('')
    setIsOpen(false)
    form.resetFields()
  }

  const onFinish =async(values: any)=>{
          console.log(values)
      setIsLoading(true)
    try {
      const serviceId = id || ''
      const formData = new FormData()
      if(act === 'edit'){
        formData.append('id',serviceId)
      }
      formData.append('name',values.name)
      formData.append('price',values.price)
      formData.append('departmentId',values.departmentId)
      formData.append('status',values.status)
      const res = act === 'add' ? await AddService.POST(formData) : await UpdateService.PUT(formData)
      if(res.status === 200 && res.data.success === 1){
        notification.success({
          message:`${act==="add"?"Added":"Updated"} Service Successfully`
        })
        Fetch()
        setIsLoading(false)
        setIsOpen(false)
        form.resetFields()
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
  const columns = [
    {key:0,title:'Service Name',dataIndex:'name',
    render:(data:any) =>(
      <p>{data}</p>
    )
    },
    {key:1,title:'Price',dataIndex:'price',
      render:(data:any) =>(
        <p>{currencyFormat(data ?? 0)}</p>
      )
    },
    {key:2,title:'Department',dataIndex:'department',
    render:(data:any) =>(
      <p>{data?.name}</p>
    )},
    {key:3,title:'Status',dataIndex:'status',
    render:(data:any) =>(
      <Tag color={data ? 'success' : 'error'}>{data ? 'Active':'Inactive'}</Tag>
    )},
    {key:4,title:'Created At',dataIndex:'createdAt',
    render:(data:any) =>(
      <p>{dateFormatter(data)}</p>
    )},
    {key:5,title:'Updated At',dataIndex:'updatedAt',
    render:(data:any) =>(
      <p>{data && dateFormatter(data)}</p>
    )},
    {key:5,title:'Actions',
    render:(data:any) =>(
      <div className='flex gap-2'>
        <CustomButton
          children='Edit'
          onClick={() => handleModalOpen('edit',data)}
          classes='bg-sky-600 text-white w-24 text-[20px] h-max'
        />
          <CustomButton
            children='Delete'
            danger
            classes='w-24 text-[20px] h-max'
            onClick={() =>handleDelete(data)}
          />
      </div>
    )},
  ]

  const renderModalContent = () => (
    <Form form={form} onFinish={onFinish} layout='vertical'>
      <Form.Item className='mb-2' label={<p>Service Name</p>} name='name' rules={[{ required: true, message: 'Please input sevice name!' }]}>
        <Input />
      </Form.Item>
      <Form.Item className='mb-2' label={<p>Price</p>} name='price' rules={[{ required: true, message: 'Please input price!' }]}>
        <InputNumber min={0}  style={{width:'100%'}}/>
      </Form.Item>
      <Form.Item className='mb-1' label={<p>Department</p>} name='departmentId' rules={[{ required: true, message: 'Please select department!' }]}>
        <Select className="backdrop-shadow">
          {admin.department.list?.map((data:any) =>(
          <Select.Option value={data.id}>
            {data.name}
          </Select.Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item className='mb-1' label={<p>Status</p>} name='status' rules={[{ required: true, message: 'Please select status!' }]}>
        <Select className="backdrop-shadow">
          <Select.Option value={0}>
            Inactive
          </Select.Option>
          <Select.Option value={1}>
            Active
          </Select.Option>
        </Select>
      </Form.Item>
      <div className='mt-4 flex gap-4 justify-end items-end'>
        <CustomButton
          children='Cancel'
          onClick={handleClose}
        />
        <CustomButton
          children='Submit'
          htmlType='submit'
          loading={isLoading}
        />
      </div>
    </Form>
  )

  const handleDelete = (data: any) => {
    Swal.fire({
      title: 'Are you sure?',
      text: `You want to delete this service? ${data.name}`,
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
          const res = await DeleteService.DELETE(formData);
          if(res.data.data && res.data.success === 1){
            setIsLoading(false)
            Fetch()
            Swal.fire('Deleted!', `${data.name}`, 'success');
          }else{
            setIsLoading(false)
            throw new Error();
          }
          // Handle success or failure accordingly
         
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
  };
  return (
    <div>
      <div className='w-full flex justify-between items-center mb-4'>
        <h1 className='text-[36px] font-bold'>Department</h1>
        <div>
          <CustomButton 
            children='Add service'
            onClick={()=>handleModalOpen('add')}
            classes='text-[24px] w-max h-max'
          />
        </div>
      </div>
      <div>
        <CustomTable
          columns={columns}
          datasource={admin?.department?.services}
          loading={isLoading}
          classes='text-xl'
        />
      </div>
      <Modal footer={null} title={act === 'add' ? <p>Add Service</p> : <p>Edit Service</p>} open={isOpen} onCancel={handleClose}>
        {renderModalContent()}
      </Modal>
    </div>
  )
}
