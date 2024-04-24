/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react'
import { DatePicker, Form, Input, InputNumber, Select, Steps, theme } from 'antd';
import { currencyFormat } from '../../../config/utils/util';
import { CustomButton } from '../../../components';
import cashPaymentIcon from '../../../assets/icon3.png'
import cashPaymentIconActive from '../../../assets/icon31.png'
import creditCardIcon from '../../../assets/icon4.png'
import creditCardIconActive from '../../../assets/icon41.png'
import debitCardIcon from '../../../assets/icon5.png'
import debitCardIconActive from '../../../assets/icon51.png'
import giftCardIcon from '../../../assets/icon6.png'
import giftCardIconActive from '../../../assets/icon61.png'
import voucherIcon from '../../../assets/icon7.png'
import voucherIconActive from '../../../assets/icon71.png'
import clsx from 'clsx';
import { saveGuestFormInfo, selector } from '../../../zustand/store/store.provider';
import useStore from '../../../zustand/store/store';

const paymentMethod = [
  {label:'Cash Payment',icon1:cashPaymentIcon,icon2:cashPaymentIconActive},
  {label:'Credit Card',icon1:creditCardIcon,icon2:creditCardIconActive},
  {label:'Debit Card',icon1:debitCardIcon,icon2:debitCardIconActive},
  {label:'Gift Card',icon1:giftCardIcon,icon2:giftCardIconActive},
  {label:'Voucher',icon1:voucherIcon,icon2:voucherIconActive},
]

export const AddGuestForm = () => {
    const [form] = Form.useForm();
    const admin = useStore(selector('admin'))
    const [pay,setPay] = useState('Cash Payment')
    const { token } = theme.useToken();
    const [current, setCurrent] = useState(0);

    const saveFirstPart = (values:any) =>{
      console.log('Success:', values);
      saveGuestFormInfo(values)
      setCurrent(current + 1);
    }
    const saveSecondPart = (values:any) =>{
      console.log('Success:', values);
      saveGuestFormInfo(values)
    }

    const steps = [
      {
        title: 'Personal Information',
        content: <div className='p-4'>
            <p className='mb-4'>Please input personal data of the guest here.</p>
            <Form form={form} layout='vertical' onFinish={saveFirstPart}>
                <div className='flex w-full gap-4 flex-nowrap'>
                <Form.Item name='surname' className='flex-1' label='Surname'>
                    <Input  />
                </Form.Item>
                <Form.Item name='firstname' className='flex-1' label='Given name'>
                    <Input  />
                </Form.Item>
                <Form.Item name='middleinitial' className='flex-1' label='Middle initial'>
                    <Input   />
                </Form.Item>
                <Form.Item name='contactNum' className='w-64' label='Contact/Telephone #'>
                <Input className="bg-white rounded-lg" addonBefore={<p className="bg-white">+63</p>}  />
                </Form.Item>
                </div>
                <div className='flex w-full gap-4 flex-nowrap'>
                <Form.Item name='houseNum' className='flex-1' label='House #'>
                    <Input  />
                </Form.Item>
                <Form.Item name='street' className='flex-1' label='Street'>
                    <Input  />
                </Form.Item>
                <Form.Item name='barangay' className='flex-1' label='Barangay'>
                    <Input  />
                </Form.Item>
                </div>
                <div className='flex w-full gap-4 flex-nowrap'>
                <Form.Item name='city' className='flex-1' label='City'>
                    <Input  />
                </Form.Item>
                <Form.Item name='province' className='flex-1' label='Province'>
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
        content: <Form onFinish={saveSecondPart} className='flex flex-col justify-top items-center py-8' layout='vertical'>
                <div className='w-[80%] flex gap-8'>
                <div className='w-[50%]'>
                <Form.Item name='roomType' className='w-full mb-2' label='Room Type'>
                <Select className="backdrop-shadow">
                  <Select.Option value={`Presidential`}>
                    <div className='flex justify-between'><p>Presidential</p><span>{currencyFormat(8000)}</span></div>
                  </Select.Option>
                  <Select.Option value={`Family Suit`}>
                    <div className='flex justify-between'><p>Family Suit</p><span>{currencyFormat(5500)}</span></div>
                  </Select.Option>
                  <Select.Option value={`Superior`}>
                    <div className='flex justify-between'><p>Superior</p><span>{currencyFormat(4100)}</span></div>
                  </Select.Option>
                  <Select.Option value={`Deluxe`}>
                    <div className='flex justify-between'><p>Deluxe</p><span>{currencyFormat(3500)}</span></div>
                  </Select.Option>
                  <Select.Option value={`Standard`}>
                    <div className='flex justify-between'><p>Standard</p><span>{currencyFormat(2000)}</span></div>
                  </Select.Option>
                  <Select.Option value={`Single Room`}>
                    <div className='flex justify-between'><p>Single Room</p><span>{currencyFormat(1200)}</span></div>
                  </Select.Option>
                </Select>
                </Form.Item>
                <Form.Item name='noOfDays' className='w-full mb-2' label='Number of Days'>
                    <InputNumber className='w-full'  />
                </Form.Item>
                <Form.Item name='noOfPax' className='w-full mb-2' label='Number of Pax'>
                    <InputNumber className='w-full'  />
                </Form.Item>
                <Form.Item name='arrival' className='w-full mb-2' label='Arrival'>
                    <DatePicker className="w-full" />
                </Form.Item>     
                <Form.Item name='departure' className='w-full mb-2' label='Departure'>
                    <DatePicker className="w-full" />
                </Form.Item>    
                <Form.Item name='discount' className='w-full mb-2' label='Discount'>
                    <InputNumber className="w-full" />
                </Form.Item>    
                </div>
                  <div className='w-[40%]'>
                    <p className='mb-4'>Choose payment method</p>
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
        title: 'Mode of Payment',
        content: <div>
                <div>
                    <p>Choose payment method</p>
                    <div>
                        
                    </div>
                </div>
                <div>
    
                </div>
            </div>,
      },
      {
        title: 'Check out',
        content: 'Last-content',
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
    console.log(admin)
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
