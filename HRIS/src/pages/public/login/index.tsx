/* eslint-disable @typescript-eslint/no-explicit-any */
import { Form, Input } from 'antd'
import { CustomButton } from '../../../components'
import icon from '../../../assets/icon1.png'
import { useNavigate } from 'react-router-dom'
import { RouterUrl } from '../../../routes'

export const Login = () => {
  const navigate = useNavigate()

  const onFinish = (values:any) =>{
    console.log(values) 
    navigate(RouterUrl.Home)
  }
  return (
    <div className='flex h-screen w-full justify-center items-center bg-gray-200'>
        <div className='w-[1200px] flex bg-white rounded-md h-[600px] shadow-[0px_0px_0px_1px_rgba(0,0,0,0.06),0px_1px_1px_-0.5px_rgba(0,0,0,0.06),0px_3px_3px_-1.5px_rgba(0,0,0,0.06),_0px_6px_6px_-3px_rgba(0,0,0,0.06),0px_12px_12px_-6px_rgba(0,0,0,0.06),0px_24px_24px_-12px_rgba(0,0,0,0.06)]'>
            <div className='w-1/2 h-full flex flex-col justify-center items-center'>
                <div className='w-[80%]'>
                    <h2 className='text-[#006394] text-[48px] font-semibold leading-[55.2px] font-arial'>Welcome !</h2>
                    <p className='text-[#696969] font-normal text-[20px] leading-[23px]'>Please log in first</p>
                </div>
                <Form onFinish={onFinish} layout='vertical' className="p-8">
                    <Form.Item name='email' label={<span className='text-[20px] text-arial leading-[23px]'>Email</span>}>
                        <Input className='w-[470px] h-[50px]'  />
                    </Form.Item>
                    <Form.Item name='password' className='mb-12' label={<span className='text-[20px] text-arial leading-[23px]'>Password</span>}>
                        <Input.Password className='w-[470px] h-[50px]'  />
                    </Form.Item>
                    <Form.Item className='w-full flex justify-end items-end'>
                        <CustomButton
                        children='Log in'
                        classes='bg-gradient-to-r from-blue-600 to-blue-300 h-[40px] rounded-full w-[150px] text-white text-[20px] font-arial leading-[28.2px] font-extrabold'
                        />
                    </Form.Item>
                </Form>
            </div>
            <div className='flex justify-center items-center ml-4'>
            <div className='w-1 bg-[#006394] h-[80%]' />
            </div>
            <div className='w-1/2 flex justify-center items-center'>
                <div className='flex flex-col justify-center items-center gap-8'>
                    <img className='w-[200px] aspect-square' src={icon} alt="" />
                    <p className='text-[#006394] text-[32px] font-semibold leading-[36.8px] w-[354px] text-center'>Hotel Reservation Information System</p>
                </div>
            </div>
        </div>
    </div>
  )
}
