/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useRef, useState } from 'react'
import { DatePicker, Divider, Form, Input, InputNumber, Select, Steps, notification, theme } from 'antd';
import { currencyFormat } from '../../../config/utils/util';
import { CustomButton } from '../../../components';
import cashPaymentIcon from '../../../assets/icon3.png'
import cashPaymentIconActive from '../../../assets/icon31.png'
import creditCardIcon from '../../../assets/icon4.png'
import creditCardIconActive from '../../../assets/icon41.png'
import debitCardIcon from '../../../assets/icon5.png'
import debitCardIconActive from '../../../assets/icon51.png'
import clsx from 'clsx';
import { resetGuestForm, saveGuestFormInfo, saveRoomList, selector } from '../../../zustand/store/store.provider';
import useStore from '../../../zustand/store/store';
import dayjs from 'dayjs';
import { AddGuest, AllRooms } from '../../../config/services/request';
import { useNavigate } from 'react-router-dom';
import { RouterUrl } from '../../../routes';
import { useReactToPrint } from 'react-to-print'

const paymentMethod = [
  {label:'Cash Payment',icon1:cashPaymentIcon,icon2:cashPaymentIconActive},
  {label:'Credit Card',icon1:creditCardIcon,icon2:creditCardIconActive},
  {label:'Debit Card',icon1:debitCardIcon,icon2:debitCardIconActive},
]

export const AddGuestForm = () => {
    const navigate = useNavigate()
    const componentRef = useRef<HTMLDivElement | null>(null);
    const [isLoading,setIsLoading] = useState(false)
    const [form] = Form.useForm();
    const admin = useStore(selector('admin'))
    const [pay,setPay] = useState(admin.form.paymentMethod || 'Cash Payment')
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
      if(admin.form){
        if(admin.form.arrival){
          admin.form.arrival = dayjs(admin.form.arrival || '')
          admin.form.departure = dayjs(admin.form.departure || '')
          admin.form.birthday = admin.form.birthday ? dayjs(admin.form.birthday) : undefined
          admin.form.expiryDate = dayjs(admin.form.expiryDate)
        }
        form.setFieldsValue(admin.form)
      }
    },[admin.form, form])

    const handlePrint = useReactToPrint({
      content: () => componentRef.current,
      documentTitle:'Receipt',
      onAfterPrint:() => notification.success({
          message: 'Printed Successfully',
      })
  })

    const onValuesChange = (changedValues: any, allValues: any) => {
      const { arrival, noOfDays } = allValues;
      console.log(changedValues)
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
      saveGuestFormInfo(values)
      setCurrent(current + 1);
    }
    const saveSecondPart = (values:any) =>{
      console.log('Success:', values);
      values.roomType = admin.rooms.find((item:any) => item.id === values.roomId)?.type
      values.paymentMethod = pay
      values.status = 'Check-In'
      values.amountToPay = values.roomType === 'Presidential' ? 8000 : values.roomType === 'Family Suit' ? 5500 : 
      values.roomType === 'Superior' ? 4100 : values.roomType === 'Standard' ? 2000 : 1200
      values.total = (values.amountToPay * values.noOfDays) 
      values.balance = (values.total/2).toFixed(2)
      values.amountReceived = (values.total/2).toFixed(2)
      values.paymentStatus = 'Partially paid'
      values.discount = 0
      saveGuestFormInfo(values)
      setCurrent(current + 1);
    }
    const handleSaveGuest = async() =>{
    try { 
        setIsLoading(true)
        admin.form.arrival = new Date(admin.form.arrival).toISOString()
        admin.form.departure = new Date(admin.form.departure).toISOString()
        admin.form.birthday = new Date(admin.form.birthday).toISOString()
        admin.form.expiryDate = new Date(admin.form.expiryDate).toISOString()
          const formData = new FormData();
              for (const key in admin.form) {
                if (Object.hasOwnProperty.call(admin.form,key)) {
                  if (!Array.isArray(admin.form[key])) {
                    formData.append(key,String(admin.form[key]))
                    console.log(`${key}: ${String(admin.form[key])}`)
                  }else{
                    for (let index = 0; index < admin.form[key].length; index++) {
                      formData.append(`${key}[${index}]`, String(admin.form[key][index]))
                      console.log(`${key}[${index}]: ${String(admin.form[key][index])}`);
                    }
                  }
                }
          }

          const res = await AddGuest.POST(formData)
          if(res.data.data){
            notification.success({
              message: "Add Guest",
              description:"New guest added successfully"
            })
            setIsLoading(false)
            navigate(RouterUrl.Home)
            resetGuestForm()
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
                <div className='w-[80%] flex gap-8'>
                <div className='w-[50%]'>
                <Form.Item name='roomId' className='w-full mb-2' label='Room Type'  rules={[{ required: true, message: 'Please select room type!' }]}>
                <Select className="backdrop-shadow">
                  {admin.rooms.filter((det:any) => det.status)?.map((val:any,idx:number) =>(
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
                  <div className='w-[40%]'>
                    <p className='mb-2'>Choose payment method</p>
                    <div className='space-y-2'>
                        {paymentMethod?.map((data:any,idx:number) =>(
                          <div key={idx} className={clsx(pay === data.label ? 'bg-sky-600 text-white' : 'bg-white text-sky-600','cursor-pointer flex justify-between items-center w-full border-2 px-4 py-3 rounded-lg')}
                          onClick={() => setPay(data.label)}
                          >
                          <p>{data.label}</p>
                          <img className='w-8' src={pay === data.label ? data.icon2 : data.icon1} alt="" />
                        </div>
                        ))}
                    </div>
                    {pay !== 'Cash Payment' && <div className='flex flex-col gap-2 mt-4'>
                    <Form.Item name='cardHolderName' className='w-full mb-2' label='Card Holder Name'>
                      <Input  />
                    </Form.Item>
                    <Form.Item name='digitCardNumber' className='w-full mb-2' label='16 Digit Card number'>
                      <Input  />
                    </Form.Item>
                    <Form.Item name='expiryDate' className='w-full mb-2' label='Expiration date'>
                      <DatePicker className='w-full'  />
                    </Form.Item>
                    <Form.Item name='referenceNumber' className='w-full mb-2' label='Reference number'>
                      <Input  />
                    </Form.Item>
                    </div>}
                  </div>
                </div>
                <div className='w-full mt-8 flex gap-4 justify-end pr-8'>
                  <CustomButton
                    children='Previous'
                    onClick={() => setCurrent(current - 1)}
                  />
                  <CustomButton
                    children='Next'
                    htmlType='submit'
                  />
                </div>
        </Form>,
      },
      {
        title: 'Check out',
        content: <div className='flex flex-col justify-center items-center py-4 '>
          <div ref={componentRef} className='w-[70%] flex flex-col gap-4 bg-white text-black p-4'>
            <div className='flex justify-between items-center'>
              <strong>Guest Name</strong>
              <p>{admin.form.firstName} {admin.form.middleInitial || ''} {admin.form.surName}</p>
            </div>
            <div className='flex justify-between items-center'>
              <strong>Email</strong>
              <p>{admin.form.email}</p>
            </div>
            <div className='flex justify-between items-center'>
              <strong>Address</strong>
              <p>{admin.form.houseNum} {admin.form.barangay} {admin.form.city} {admin.form.province}</p>
            </div>
            <div className='flex justify-between items-center'>
              <strong>Contact Number</strong>
              <p>{admin.form.contactNum}</p>
            </div>
            <div className='flex justify-between items-center'>
              <strong>Room Type</strong>
              <p>{admin.form.roomType} {currencyFormat(admin.form.amountToPay)}</p>
            </div>
            <div className='flex justify-between items-center'>
              <strong>Room Number</strong>
              <p>{admin.form.roomNumber}</p>
            </div>
            <div className='flex justify-between items-center'>
              <strong>Number of Days</strong>
              <p>{admin.form.noOfDays}</p>
            </div>
            <div className='flex justify-between items-center'>
              <strong>Number of Pax</strong>
              <p>{admin.form.noOfPax}</p>
            </div>
            <div className='flex justify-between items-center'>
              <strong>Arrival Date</strong>
              <p>{new Date(admin.form.arrival).toLocaleDateString()}</p>
            </div>
            <div className='flex justify-between items-center'>
              <strong>Departure Date</strong>
              <p>{new Date(admin.form.departure).toLocaleDateString()}</p>
            </div>
            <div className='flex justify-between items-center'>
              <strong>Payment Method</strong>
              <p>{admin.form.paymentMethod}(Partially Paid)</p>
            </div>
            <div className='flex justify-between items-center'>
              <strong>Amount to Received</strong>
              <p>{currencyFormat(admin.form.amountReceived)}</p>
            </div>
            <div className='flex justify-between items-center'>
              <strong>Balance</strong>
              <p>{currencyFormat(admin.form.balance)}</p>
            </div>
            <Divider className='m-1' />
            <div className='flex justify-between items-center'>
              <strong className='text-[20px]'>Total</strong>
              <p className='text-[20px]'>{currencyFormat(admin.form.total)}</p>
            </div>

          </div>
          <div className='w-[70%] flex justify-between items-center mt-4'>
              <CustomButton
              children='Previous'
              onClick={() => setCurrent(current - 1)}
              />
              <div className='flex gap-2'>
              <CustomButton
              children='Print'
              onClick={() => handlePrint()}
              />
              <CustomButton
              children='Submit'
              onClick={() => handleSaveGuest()}
              loading={isLoading}
              />
              </div>
          </div>
        </div>,
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
    console.log(pay)
  return (
    <>
    <div>
      <Steps current={current} items={items} />
      <div style={contentStyle}>
        {steps[current].content}
      </div>

    </div>

    </>
  )
}
