/* eslint-disable @typescript-eslint/no-explicit-any */
import { Avatar, Layout, Menu, MenuProps, theme } from 'antd';
import { MdDashboard,MdOutlineBedroomChild } from "react-icons/md";
import { ImUserTie } from "react-icons/im";
import { GrSchedules } from "react-icons/gr";
import { FaMoneyBillTransfer } from "react-icons/fa6";
import { IoIosLogOut } from "react-icons/io";
import { HiOutlineBuildingOffice2 } from "react-icons/hi2";
import icon from '../assets/icon2.png'
import icon1 from '../assets/icon1.png'
import { useCurrentDateTime } from '../components';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useCallback, useLayoutEffect, useState } from 'react';
import { RouterUrl } from '../routes';

const { Header, Content, Sider } = Layout;

type MenuItem = Required<MenuProps>['items'][number];
    
function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem;
}
const items: MenuItem[] = [
    getItem('Dashboard', '1', <MdDashboard size={20} />,),
    getItem('Guests', '2', <ImUserTie size={20} />),
    getItem('Room', '3', <MdOutlineBedroomChild size={20} />),
    getItem('Reservation', '4', <GrSchedules size={20} />),
    getItem('Department', '5', <HiOutlineBuildingOffice2 size={20} />),
    getItem('Transactions', '6', <FaMoneyBillTransfer size={20} />),
    getItem('Log out', '7', <IoIosLogOut size={20} />),
  ];

export default function Private() {
    const navigate = useNavigate()
    const dateTime = useCurrentDateTime()
    const location = useLocation();
    const pathname = location.pathname
    const [currentPathname, setCurrentPathname] = useState<string>('');

    const {
        token: { colorBgContainer, borderRadiusLG , },
      } = theme.useToken();

      useLayoutEffect(() => {
        setCurrentPathname(pathname);
      }, [pathname]);

      const onSelectMenu = useCallback((item: any) => {
        switch (item?.key) {
          case '1':
            navigate(RouterUrl.Home)
            break;
          case '2':
            navigate(RouterUrl.Client)
            break;
          case '3':
            navigate(RouterUrl.Room)
            break;
          case '4':
            navigate(RouterUrl.Reservation)
            break;
          case '5':
            navigate(RouterUrl.Department)
            break;  
          case '6':
            navigate(RouterUrl.Transaction)
            break; 
          case '7':
            navigate(RouterUrl.Login)
            break; 
          default:
            break;
        }
      }, [navigate]);
  return (
    <Layout style={{background:'white'}} className="h-max min-h-screen">
      <Sider
        breakpoint="lg"
        collapsedWidth="0"
        style={{ background: colorBgContainer}}
        className='border-r-2 border-[#006394]'
        width={250}
      >
        <div className="p-3 text-left flex flex-col items-center justify-center space-y-5">
            <div className='flex items-center h-24'> 
              <div className="w-full flex flex-col items-center justify-center">
                <img className='w-[50px] aspect-square' src={icon} alt="" />
              </div>
                <p className='text-[#006394] text-[30px] font-semibold leading-[34.5px] text-nowrap'>HRIS ~</p>
            </div>
        </div>
        <div className="demo-logo-vertical" />
        <Menu theme="light" mode="inline" defaultSelectedKeys={['4']} items={items} onClick={(item) => onSelectMenu(item)} 
          selectedKeys={[
            currentPathname === RouterUrl.Home
              ? '1'
              : currentPathname === RouterUrl.Client
              ? '2'
              : currentPathname === RouterUrl.Room
              ? '3'
              : currentPathname === RouterUrl.Reservation
              ? '4' 
              : currentPathname === RouterUrl.Department
              ? '5'
              : currentPathname === RouterUrl.Transaction
              ? '6'
              : '0',
          ]}
        />
      </Sider>
      <Layout>
        <Header className='h-24 flex justify-between items-center' style={{ background: colorBgContainer }} >
           <div className='text-[20px]'>
           {dateTime}
           </div>
            <Avatar size={52} src={icon1}  />
        </Header>
        <Content style={{ margin: '24px 16px 0' }}>
          <div
            style={{
              padding: 24,
              minHeight: 550,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            {<Outlet />}
          </div>
        </Content>
      </Layout>
    </Layout>
  )
}
