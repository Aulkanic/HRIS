/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react'
import { DatePicker, Form, Input, InputNumber, Select, Steps, notification, theme } from 'antd';
import { currencyFormat } from '../../../config/utils/util';
import { CustomButton } from '../../../components';
import { resetReserveForm, saveReserveFormInfo, saveRoomList, selector } from '../../../zustand/store/store.provider';
import useStore from '../../../zustand/store/store';
import dayjs from 'dayjs';
import { AddReservation, AllRooms } from '../../../config/services/request';
import { useNavigate } from 'react-router-dom';
import { RouterUrl } from '../../../routes';

export const AddReservationForm = () => {
    const navigate = useNavigate()
    const [isLoading,setIsLoading] = useState(false)
    const [form] = Form.useForm();
    const admin = useStore(selector('admin'))
    const { token } = theme.useToken();
    const [current, setCurrent] = useState(0);

    async function Fetch(){
      const res = await AllRooms.GET()
      saveRoomList(res.data.data)
    }
    useEffect(() =>{
      Fetch()
    },[])

    useEffect(() => {
      if(admin.reserveFrm){
        if(admin.reserveFrm.arrival){
          admin.reserveFrm.arrival = dayjs(admin.reserveFrm.arrival || '')
          admin.reserveFrm.departure = dayjs(admin.reserveFrm.departure || '')
        }
        form.setFieldsValue(admin.reserveFrm)
      }
    },[admin.reserveFrm, form])

    const onValuesChange = (changedValues: any, allValues: any) => {
      console.log(changedValues)
      const { arrival, noOfDays } = allValues;
  
      if (arrival && noOfDays) {
        const arrivalDate = new Date(arrival || '');
        const departure = new Date(arrivalDate.setDate(arrivalDate.getDate() + noOfDays));
        form.setFieldsValue({
          departure: dayjs(departure),
        });
      }
    };

    const saveFirstPart = (values:any) =>{
      console.log('Success:', values);
      values.status = 'Pending'
      saveReserveFormInfo(values)
    //   resetReserveForm()
      setCurrent(current + 1);
    }
    const saveSecondPart = async(values:any) =>{
      admin.reserveFrm.noOfDays = values.noOfDays
      admin.reserveFrm.noOfPax = values.noOfPax
      admin.reserveFrm.roomId = values.roomId
      admin.reserveFrm.roomType = admin.rooms?.find((item:any) => item.id === values.roomId)?.type
      admin.reserveFrm.arrival = new Date(values.arrival).toISOString()
      admin.reserveFrm.departure = new Date(values.departure).toISOString()
      admin.reserveFrm.birthday = new Date(admin.reserveFrm.birthday).toISOString()
      try { 
        setIsLoading(true)
          const formData = new FormData();
         for (const key in admin.reserveFrm) {
                if (Object.hasOwnProperty.call(admin.reserveFrm,key)) {
                  if (!Array.isArray(admin.reserveFrm[key])) {
                    formData.append(key,String(admin.reserveFrm[key]))
                    console.log(`${key}: ${String(admin.reserveFrm[key])}`)
                  }else{
                    for (let index = 0; index < admin.reserveFrm[key].length; index++) {
                      formData.append(`${key}[${index}]`, String(admin.reserveFrm[key][index]))
                      console.log(`${key}[${index}]: ${String(admin.reserveFrm[key][index])}`);
                    }
                  }
                }
          }
          const res = await AddReservation.POST(formData)
          if(res.data.data){
            notification.success({
              message: "Add Guest",
              description:"New reservation added successfully"
            })
            setIsLoading(false)
            navigate(RouterUrl.Home)
            resetReserveForm()
          }

    } catch (error) {
      notification.error({
        message: "Error adding guest",
      })
      setIsLoading(false)
    }
    }

    const steps = [
      {
        title: 'Personal Information',
        content: <div className='p-4'>
            <p className='mb-4'>Please input personal data of the guest here.</p>
            <Form form={form} layout='vertical' onFinish={saveFirstPart}>
                <div className='flex w-full gap-4 flex-nowrap'>
                <Form.Item name='surName' className='flex-1' label='Surname' rules={[{ required: true, message: 'Please input Surname!' }]}>
                    <Input  />
                </Form.Item>
                <Form.Item name='firstName' className='flex-1' label='Given name' rules={[{ required: true, message: 'Please input Givenname!' }]}>
                    <Input  />
                </Form.Item>
                <Form.Item name='middleInitial' className='flex-1' label='Middle initial' rules={[{ required: true, message: 'Please input Middle initial!' }]}>
                    <Input   />
                </Form.Item>
                <Form.Item name='contactNum' className='w-64' label='Contact/Telephone #' rules={[{ required: true, message: 'Please input Contact number!' }]}>
                <Input className="bg-white rounded-lg" addonBefore={<p className="bg-white">+63</p>}  />
                </Form.Item>
                </div>
                <div className='flex w-full gap-4 flex-nowrap'>
                <Form.Item name='houseNum' className='flex-1' label='House #' rules={[{ required: true, message: 'Please input House number!' }]}>
                    <Input  />
                </Form.Item>
                <Form.Item name='street' className='flex-1' label='Street' rules={[{ required: true, message: 'Please input Street!' }]}>
                    <Input  />
                </Form.Item>
                <Form.Item name='barangay' className='flex-1' label='Barangay' rules={[{ required: true, message: 'Please input Barangay!' }]}>
                    <Input  />
                </Form.Item>
                </div>
                <div className='flex w-full gap-4 flex-nowrap'>
                <Form.Item name='city' className='flex-1' label='City' rules={[{ required: true, message: 'Please input City!' }]}>
                    <Input  />
                </Form.Item>
                <Form.Item name='province' className='flex-1' label='Province' rules={[{ required: true, message: 'Please input Province!' }]}>
                    <Input  />
                </Form.Item>
                </div>
                <div className='flex w-full gap-4 flex-nowrap'>
                <Form.Item name='birthday' className='flex-1' label='Birthday' rules={[{ required: true, message: 'Please select birthday!' }]}>
                    <DatePicker className='w-full'  />
                </Form.Item>
                <Form.Item name='email' className='flex-1' label='Email' rules={[{ required: true, message: 'Please input email!' }]}>
                    <Input  />
                </Form.Item>
                <Form.Item name='nationality' className='flex-1' label='Nationality'>
                    <Input  />
                </Form.Item>
                </div>
                <div className='w-full flex justify-end items-end'>
                  <CustomButton
                    children='Next'
                    htmlType='submit'
                  />
                </div>
            </Form>
        </div>,
      },
      {
        title: 'Availing Room Type',
        content: <Form onValuesChange={onValuesChange} form={form} onFinish={saveSecondPart} className='flex flex-col justify-top items-center py-8' layout='vertical'>
                <div className='w-[80%] flex justify-center items-center gap-8'>
                <div className='w-[50%]'>
                <Form.Item name='roomId' className='w-full mb-2' label='Room Type'>
                <Select className="backdrop-shadow">
                  {admin.rooms?.filter((det:any) => det.status)?.map((val:any,idx:number) =>(
                  <Select.Option key={idx} value={val.id}>
                    <div className='flex justify-between'><p>{val.type}</p><span>{currencyFormat(val.rate)}</span></div>
                  </Select.Option>
                  ))}
                </Select>
                </Form.Item>
                <Form.Item name='roomNumber' className='w-full mb-2' label='Room Number'  rules={[{ required: true, message: 'Please input room number!' }]}>
                    <Input  />
                </Form.Item>
                <Form.Item name='noOfDays' className='w-full mb-2' label='Number of Days'>
                    <InputNumber min={1} className='w-full'  />
                </Form.Item>
                <Form.Item name='noOfPax' className='w-full mb-2' label='Number of Pax'>
                    <InputNumber min={1} className='w-full'  />
                </Form.Item>
                <Form.Item name='arrival' className='w-full mb-2' label='Arrival'>
                    <DatePicker className="w-full" />
                </Form.Item>     
                <Form.Item name='departure' className='w-full mb-2' label='Departure'>
                    <DatePicker readOnly className="w-full" />
                </Form.Item>  
                </div>
                </div>
                <div className='w-full mt-8 flex gap-4 justify-end pr-8'>
                  <CustomButton
                    children='Previous'
                    onClick={() => setCurrent(current - 1)}
                  />
                  <CustomButton
                    children='Add to Reservation'
                    htmlType='submit'
                    loading={isLoading}
                  />
                </div>
        </Form>,
      },
    ];

    const items = steps.map((item) => ({ key: item.title, title: item.title }));

    const contentStyle: React.CSSProperties = {
        color: token.colorTextTertiary,
        backgroundColor: token.colorFillAlter,
        borderRadius: token.borderRadiusLG,
        border: `1px dashed ${token.colorBorder}`,
        marginTop: 16,
    };
    console.log(admin.reserveFrm)
  return (
    <>
    <div>
      <div className='w-full flex justify-center items-center'>
      <Steps className='w-[70%]' current={current} items={items} />
      </div>
      <div style={contentStyle}>
        {steps[current].content}
      </div>

    </div>

    </>
  )
}
