/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from 'react'
import { AddTransaction, AllDepartmentServices, AllReservations, AllTransaction, CheckoutTransaction, UpdateReservation, UpdateTransaction } from '../../../config/services/request'
import { saveDepartmentServices, saveReservationList, saveTransactionList, selector } from '../../../zustand/store/store.provider'
import useStore from '../../../zustand/store/store'
import { Checkbox, Col, Divider, Form, InputNumber, Modal, Radio, Row, Select, Tag, notification } from 'antd'
import { CustomTable } from '../../../components/table/customTable'
import { CustomButton } from '../../../components'
import { Guest, Transaction } from '../../../types'
import { useNavigate } from 'react-router-dom'
import { RouterUrl } from '../../../routes'
import { currencyFormat } from '../../../config/utils/util'
import cashPaymentIcon from '../../../assets/icon3.png'
import cashPaymentIconActive from '../../../assets/icon31.png'
import creditCardIcon from '../../../assets/icon4.png'
import creditCardIconActive from '../../../assets/icon41.png'
import debitCardIcon from '../../../assets/icon5.png'
import debitCardIconActive from '../../../assets/icon51.png'
import clsx from 'clsx'
import { CheckboxChangeEvent } from 'antd/es/checkbox'
import { useReactToPrint } from 'react-to-print'


const paymentMethod = [
  {label:'Cash Payment',icon1:cashPaymentIcon,icon2:cashPaymentIconActive},
  {label:'Credit Card',icon1:creditCardIcon,icon2:creditCardIconActive},
  {label:'Debit Card',icon1:debitCardIcon,icon2:debitCardIconActive},
]

interface ServiceSelection {
  department: string;
  service: string;
  price: number;
  quantity:number;
}

export const TransactionPage = () => {
  const admin = useStore(selector('admin'))
  const componentRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate()
  const [isOpen,setIsOpen] = useState(false)
  const [isOpen1,setIsOpen1] = useState(false)
  const [isLoading,setIsLoading] = useState(false)
  const [filter,setFilter] = useState('Pending')
  const [discount, setDiscount] = useState(0);
  const [selectedServices, setSelectedServices] = useState<ServiceSelection[]>([]);
  const [dataSource, setDataSource] =  useState({
    total:0,
    roomId:null as any,
    guestsId:null,
    reservationId: null
  })
  const [transactId,setTransactId] = useState(null)
  const [amountToPay,setAmountToPay] = useState(0)
  const [transactData,setTransactData] = useState<Transaction | null>(null)
  const [isCheck,setIsCheck] = useState(false)
  const [pay,setPay] = useState('Cash Payment')
  const [isPrintAttempt, setIsPrintAttempt] = useState(false);
  const [serviceQuantities, setServiceQuantities] = useState<{ [key: string]: number }>({});


  async function Fetch(){
    const res = await AllTransaction.GET()
    const res1 = await AllReservations.GET()
    const res2 = await AllDepartmentServices.GET()
    saveDepartmentServices(res2.data.data)
    saveReservationList(res1.data.data)
    saveTransactionList(res.data.data)
  }
  useEffect(() =>{
    Fetch();
  },[])

  const handleQuantityChange = (value: number | null, serviceName: string) => {
    const updatedQuantities = { ...serviceQuantities };
    updatedQuantities[serviceName] = value || 0;
    setSelectedServices((prevSelected) =>
      prevSelected.map((service) =>
        service.service === serviceName
          ? { ...service, quantity: updatedQuantities[serviceName] }
          : service
      )
    );
    setServiceQuantities(updatedQuantities);
  };
  
  const onChangeTab = (key: any) => {
    console.log(key)
    setFilter(key);
  };
    const handleChange = (
      e: CheckboxChangeEvent,
      serviceName: string,
      departmentName: string,
      price:number,
    ) => {
      const isChecked = e.target.checked;
      const updatedQuantities = { ...serviceQuantities };
      if (isChecked) {
        setSelectedServices((prevSelected) => [
          ...prevSelected,
          { department: departmentName, service: serviceName, price: price,quantity: updatedQuantities[serviceName] ?? 0 }, // Replace 200 with the actual price
        ]);
      } else {
        setSelectedServices((prevSelected) =>
          prevSelected.filter(
            (service) =>
              !(service.department === departmentName && service.service === serviceName)
          )
        );
      }
  };

  const handleDaysChange = (value:any) =>{
    const updatedReservations = transactData?.guests.reservations.map((reservation: any, index: number) => {
      if (index === 0) { // Assuming you want to update the first reservation
        return {
          ...reservation,
          noOfDays: value
        };
      }
      return reservation;
    });
  
    const total = Number(transactData?.guests?.reservations[0].room.rate) * Number(value);
  
    setTransactData((prev: any) => ({
      ...prev,
      guests: {
        ...prev.guests,
        reservations: updatedReservations
      },
      amountToPay: total
    }));
  };
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: 'Receipt',
    onBeforeGetContent: () => setIsPrintAttempt(true),
    onAfterPrint: () => {
      if (isPrintAttempt) {
        notification.success({
          message: 'Printed Successfully',
        });
        setIsPrintAttempt(false);
      }
    },
  });

  const handleDiscountChange = (value: number | null) => {
    if (value !== null) {
      setDiscount(value);
    }
  };
  const calculateDiscountedAmount = (total: number, percentage: number) => {
    return total - (total * percentage) / 100;
  };
  const handleModalOpen = (data:any) =>{
    console.log(data)
    data.total = data.room.rate * data.noOfDays
    setDataSource({
      total:data.total,
      roomId:data.room.id,
      guestsId:data.guestsId,
      reservationId: data.id
    })
    setIsOpen(true)
  }
  const handleModalServiceOpen = (data:any) =>{
    console.log(data)
    setTransactId(data.id)
    setAmountToPay(data.amountToPay)
    setIsOpen1(true)
  }
  const handleClose = () =>{
    setIsOpen(false)
    setDataSource({
      total:0,
      roomId:null as any,
      guestsId:null,
      reservationId:null
    })
  }
  const handleCloseService = () =>{
    setIsOpen1(false)
    setTransactId(null)
  }

  const calculateTotalForEachDepartment = () => {
    let totalPrice = 0;

    // Iterate through the array of selected services
    selectedServices.forEach(service => {
      // Add the price of the service to the total price
      totalPrice += (service.price * service.quantity);
    });
  
    // Now totalPrice contains the total price for all selected services
    console.log(totalPrice);
    return totalPrice;
  };

  const handleCancelReservation = async(data:any) =>{
    setIsLoading(true)
    const formData = new FormData();
    formData.append('reservationId',data.id)
    formData.append('status','Cancelled')
    const res = await UpdateReservation.PUT(formData)
    if(res.data.data){
      notification.success({
        message: "Cancel Reservation",
        description:"reservation was cancelled successfully"
      })
      Fetch()
      setIsLoading(false)
    }else{
      notification.error({
        message: "Error",
        description: res.data.message??"Something went wrong while cancelling the reservation."
      })
      setIsLoading(false)
    }
  }

  const handleCheckoutOpen = (data:any) =>{
    setIsCheck(true)
    data.chargesFromDepartments = JSON.parse(data.chargesFromDepartments)
    setTransactData(data)
  }
  const columns = (filter !== 'Pending' && filter !== 'Cancelled') ? [
    {key:0,title:'Guest Name',dataIndex:'guests',
      render:(data:any) =>(
        <p>{`${data?.firstName} ${data?.lastName}`}</p>
      )
    },
    {key:1,title:'Room Type',dataIndex:'guests',      
    render:(data:Guest) =>{
      return(
      <p>{data?.reservations[0]?.room?.type}</p>
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
    {key:5,title:'Amount To Pay',dataIndex:'amountToPay',
    render:(data:any) =>(
      <p>{currencyFormat(data)}</p>
    )
    },
    {key:5,title:'Balance',
    render:(data:any) =>(
      <p>{currencyFormat(data.balance)}</p>
    )
    },
    {key:6,title:'Action',
    render:(data:any) =>
      data.guests?.reservations[0]?.status === 'Check-In' ? (
      <div className='flex gap-2'>
        <CustomButton
          children={'Avail service'}
          onClick={() => handleModalServiceOpen(data)}
        />
        <CustomButton
          children={'Check-Out now!'}
          onClick={() => handleCheckoutOpen(data)}
        />
      </div>
    ) : <p>{data.guests?.reservations[0]?.status}</p>
    },

  ] : [
    {key:0,title:'Guest Name',dataIndex:'guests',
    render:(data:any) =>(
      <p>{`${data?.firstName} ${data?.lastName}`}</p>
    )
  },
  {key:1,title:'Room Type',dataIndex:'room',      
  render:(data:any) =>{
    return(
    <p>{data?.type}</p>
  )}},
  {key:2,title:'No. of Days',dataIndex:'noOfDays',      
  render:(data:any) =>{
    return(
    <p>{data}</p>
  )}},
  {key:3,title:'No. of Pax',dataIndex:'noOfPax',      
  render:(data:any) =>{
    return(
    <p>{data}</p>
  )}},
  {key:4,title:'Status',dataIndex:'status',      
  render:(data:any) =>{
    return(
    <Tag color={data === 'Pending' ? 'gold' : data === 'Check-In' ? 'success' : 'error'}>{data}</Tag>
  )}},
  {key:5,title:'Balance',
  render:() =>(
    <p>{currencyFormat(0)}</p>
  )
  },
  {key:6,title:'Action',
  render:(data:any) =>(
    data.status === 'Cancelled' ? null : (<div className='w-full flex gap-2'>
      <CustomButton
        children={'Pay now'}
        onClick={()=>handleModalOpen(data)}
      />
      <CustomButton
        children={'Cancel'}
        onClick={() => handleCancelReservation(data)}
      />
    </div>)
  )
  },
  ]

  const onFinish = async(values:any) =>{
try {
      setIsLoading(true)
      const payload = {
        guestsId: dataSource.guestsId,
        reservationId: dataSource.reservationId,
        status:'Check-In',
        paymentMethod: pay,
        total: calculateDiscountedAmount(dataSource?.total, discount),
        amountReceived: values.paymentStatus === 'Fully paid' ? calculateDiscountedAmount(dataSource?.total, discount) : calculateDiscountedAmount(dataSource?.total, discount)/2,
        discount:discount,
        balance: values.paymentStatus === 'Fully paid' ? 0 : calculateDiscountedAmount(dataSource?.total, discount)/2,
        paymentStatus: values.paymentStatus
      }
      const formData = new FormData();
      if (payload.guestsId !== null) {
        formData.append('guestsId', payload.guestsId);
      }
      if (payload.reservationId !== null) {
        formData.append('reservationId', payload.reservationId);
      }
      formData.append('status', payload.status);
      formData.append('paymentMethod', payload.paymentMethod);
      formData.append('total', payload.total.toString());
      formData.append('amountReceived', payload.amountReceived.toString());
      formData.append('discount', payload.discount.toString());
      formData.append('balance', payload.balance.toString());
      formData.append('paymentStatus', payload.paymentStatus);
      const res = await AddTransaction.POST(formData)
      if(res.data.data){
        notification.success({
          message: "Paying",
          description:"Payment was made"
        })
        Fetch()
        setIsLoading(false)
        setIsOpen(false)
        setDataSource({
          total:0,
          roomId:null as any,
          guestsId:null,
          reservationId:null
        })
      }else{
        notification.error({
          message: "Error",
          description: res.data.message??"Something went wrong while adding the transaction."
        })
        setIsLoading(false)
      }
} catch (error:any) {
  notification.error({
    message: "Error",
    description: error?.message??'Something went wrong.'
  })
  setIsLoading(false)
}
  }

  const renderModalContent = () =>(
    <Form onFinish={onFinish}>
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
      <Form.Item className='mt-4' label='Payment Status' name='paymentStatus'>
        <Radio.Group>
          <Radio value={'Fully paid'}>Fully paid</Radio>
          <Radio value={'Half paid'}>Half paid</Radio>
        </Radio.Group>     
      </Form.Item>
      <Form.Item name='discount' className='w-full mb-2' label='Discount'>
          <InputNumber onChange={handleDiscountChange} min={0} className="w-full" />
      </Form.Item>
      <div>
        Total amount to pay:{' '}{currencyFormat(calculateDiscountedAmount(dataSource?.total, discount))}
      </div>    
      <div className='mt-4 flex gap-4 justify-end items-end'>
        <CustomButton
          children='Cancel'
          onClick={handleClose}
        />
        <CustomButton
          children='Submit'
          loading={isLoading}
          htmlType='submit'
        />
      </div>
    </Form>
  )
  const renderServiceContent = () =>(
    <Form className='space-y-4'>
       {admin.department.list?.map((data:any,idx:number) =>{
        const services = admin.department.services?.filter((det:any) => det.departmentId === data.id && det.status)
        return(
        <div key={idx}>
          <h1 className='font-semibold text-[24px]'>{data.name}</h1>
          <Checkbox.Group >
            <Row>
            {services?.map((val:any,idy:number) =>
            (
              <Col span={16} key={idy}>
                <Row gutter={[8, 0]} align="middle">
                  <Col>
                    <Checkbox
                      className='text-nowrap text-[20px]'
                      onChange={(e) => handleChange(e, val.name, data.name, val.price)}
                      value={val.name}
                    >
                      {`${val.name} (${currencyFormat(val.price)})`}
                    </Checkbox>
                  </Col>
                  <Col>
                  {selectedServices.some(service => service.department === data.name && service.service === val.name) && // Check if the service is selected
                    <Form.Item name={`quantity-${val.id}`} label='Qty:'>
                      <InputNumber size='small' min={0} max={10} 
                      onChange={(value) => handleQuantityChange(value, val.name)}
                      />
                    </Form.Item>
                  }
                  </Col>
                </Row>
              </Col>
              )
            )}
            </Row>
          </Checkbox.Group>
        </div>
       )})}
       <div className='w-full flex gap-4 justify-end items-end my-4'>
        <CustomButton
          children='Avail Service selected'
          onClick={() => handleAvailingService()}
          loading={isLoading}
        />
       </div>
    </Form>
  )

  const handleAvailingService = async() =>{
    if(selectedServices.length === 0){
      notification.error({
        message:'Please select at least one service'
      })
      return;
    }
    if(!transactId){
      notification.error({
        message:'No transaction Id provided'
      })
      return;
    }
    setIsLoading(true)
    const payload = {
      transactionId: transactId,
      chargesFromDepartments:selectedServices,
      serviceCharge: calculateTotalForEachDepartment(),
      amountToPay: amountToPay
    }
    const formData = new FormData()
    formData.append('id',payload.transactionId)
    formData.append('chargesFromDepartments',JSON.stringify(payload.chargesFromDepartments))
    formData.append('serviceCharge',payload.serviceCharge.toString())
    formData.append('amountToPay',payload.amountToPay.toString())
    const res = await UpdateTransaction.PUT(formData)
    if(res.data.data){
      notification.success({
        message: "Availing Service",
        description:"service added successfully"
      })
      Fetch()
      setIsLoading(false)
      setIsOpen1(false)
      setTransactId(null)
      setSelectedServices([]);
      setServiceQuantities({})
      setAmountToPay(0)
    }else{
      notification.error({
        message: "Error",
        description: res.data.message??"Something went wrong while adding the transaction."
      })
      setIsLoading(false)
    }
  }

  const handleCheckOut = async() =>{
    try {
          if(!transactData?.id && !transactData?.guests?.reservations[0]?.id){
            notification.error({
              message: 'Error',
              description:'No id being processed'
            })
          }
          setIsCheck(false)
          setIsLoading(true)
          const formData = new FormData()
          formData.append('transactionId',transactData?.id?.toString() || '')
          formData.append('reservationId',transactData?.guests?.reservations[0].id?.toString() || '')
          formData.append('noOfDays',transactData?.guests?.reservations[0].noOfDays.toString() || '')
          formData.append('roomId',transactData?.guests?.reservations[0].room.id.toString() || '')
          formData.append('amountToPay',transactData?.amountToPay.toString() || '')
          formData.append('discount',transactData?.discount.toString() || '')
          const res = await CheckoutTransaction.POST(formData)
          if(res.data.data){
            notification.success({
              message: "Check-Out",
              description:"check out successfully"
            })
            Fetch()
            setIsLoading(false)
          }else{
            notification.error({
              message: "Error",
              description: res.data.message??"Something went wrong while adding the transaction."
            })
            setIsLoading(false)
          }
    } catch (error:any) {
      notification.error({
        message: error.message || 'Something went wrong'
      })
    }
  }
  const renderCheckoutContent = () =>(
    <Form>
      <div className='flex flex-col justify-center items-center mb-8 '>
          <div ref={componentRef} className='w-[70%] flex flex-col gap-4 bg-white text-black p-4'>
            <div className='flex justify-between items-center'>
              <strong>Guest Name</strong>
              <p>{transactData?.guests?.firstName} {transactData?.guests?.middleInitial || ''} {transactData?.guests?.lastName}</p>
            </div>
            <div className='flex justify-between items-center'>
              <strong>Room Type</strong>
              <p>{transactData?.guests?.reservations[0]?.room.type} {currencyFormat(transactData?.guests?.reservations[0]?.room.rate || 0)}</p>
            </div>
            <div className='flex justify-between items-center'>
              <strong>Number of Days</strong>
              <InputNumber onChange={(value) => handleDaysChange(value)} className='w-16 text-[18px] -mr-11' min={0} variant='borderless' value={transactData?.guests?.reservations[0]?.noOfDays} />
            </div>
            <div className='flex justify-between items-center'>
              <strong>Number of Pax</strong>
              <p>{transactData?.guests?.reservations[0]?.noOfPax}</p>
            </div>
            <div className='flex justify-between items-center'>
              <strong>Arrival Date</strong>
              <p>{new Date(transactData?.guests?.reservations[0]?.arrival || '').toLocaleDateString()}</p>
            </div>
            <div className='flex justify-between items-center'>
              <strong>Departure Date</strong>
              <p>{new Date(transactData?.guests?.reservations[0]?.departure || '').toLocaleDateString()}</p>
            </div>
            <div className='flex justify-between items-center'>
              <strong>Payment Method</strong>
              <p>{transactData?.modeOfPayment}(Fully Paid)</p>
            </div>
            <div className='flex flex-col'>    
            <strong className='mb-2'>Services Availed</strong>
              {transactData?.chargesFromDepartments?.map((val:any) =>(
                <div className='flex justify-between items-center'>
                  <p className='text-[16px]'>{val.service}({val.quantity})</p>
                  <p className='text-[14px]'>{currencyFormat(val.price)}</p>
                </div>
              ))}
                <div className='flex justify-between items-center'>
                  <p className='text-[16px]'>Total Charges</p>
                  <p className='text-[14px]'>{currencyFormat(transactData?.serviceCharge || 0)}</p>
                </div>
            </div>
            <div className='flex justify-between items-center'>
              <strong>Amount to Received</strong>
              <p>{currencyFormat(transactData?.amountReceived || 0)}</p>
            </div>
            <div className='flex justify-between items-center'>
              <strong>Balance</strong>
              <p>{currencyFormat(transactData?.balance || 0)}</p>
            </div>
            <Form.Item className='m-0'>
              <div className='flex justify-between items-center'>
              <strong>Discount</strong>
              <InputNumber onChange={(value) => setTransactData((prev:any) =>({...prev,discount:value}))} value={transactData?.discount} className='w-16 text-[18px] -mr-11' min={0} variant='borderless' />
              </div>
            </Form.Item>
            <Divider className='m-1' />
            <div className='flex justify-between items-center'>
              <strong className='text-[20px]'>Total</strong>
              <p className='text-[20px]'>{currencyFormat(calculateDiscountedAmount(((transactData?.amountToPay || 0) + (transactData?.serviceCharge || 0)),(transactData?.discount || 0)))}</p>
            </div>
           
          </div>
          <div className='w-full flex justify-between items-center mt-4'>
              <CustomButton
              children='Cancel'
        
              />
              <div className='flex gap-2'>
              <CustomButton
              children='Print'
              onClick={() => handlePrint()}
              />
              <CustomButton
              children='Checkout'
              onClick={() => handleCheckOut()}
              loading={isLoading}
              />
              </div>
          </div>
        </div>
    </Form>
  )
  console.log(transactData)
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
      <div className='mb-4'>
        <Select
            style={{ width: 200 }}
            onChange={onChangeTab}
            value={filter}
        >
            <Select.Option value="Pending">Pending</Select.Option>
            <Select.Option value="Check-In">Check-In</Select.Option>
            <Select.Option value="Check-Out">Check-Out</Select.Option>
            <Select.Option value="Cancelled">Cancelled</Select.Option>
        </Select>
        </div>
        <CustomTable
         columns={columns}
         loading={isLoading}
         datasource={(filter === 'Pending' || filter === 'Cancelled') ? admin.reservation.filter((data:any) => data.status === filter) : admin.transaction.filter((data:any) => data.guests?.reservations[0]?.status === filter)}
        />
      </div>
      <Modal footer={null} title='Pay Now!' open={isOpen} onCancel={handleClose}>
        {renderModalContent()}
      </Modal>
      <Modal footer={null} title={<p>Avail Services!</p>} open={isOpen1} onCancel={handleCloseService}>
        {renderServiceContent()}
      </Modal>
      <Modal width={800} footer={null} title={<p>Checkout Now!</p>} open={isCheck} onCancel={() => setIsCheck(false)}>
        {renderCheckoutContent()}
      </Modal>
    </div>
  )
}
