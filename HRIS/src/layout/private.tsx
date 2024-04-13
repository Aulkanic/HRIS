import { Avatar, Layout, Menu, MenuProps, theme } from 'antd';
import { MdDashboard,MdOutlineBedroomChild } from "react-icons/md";
import { ImUserTie } from "react-icons/im";
import { GrSchedules } from "react-icons/gr";
import { IoMdSettings,IoIosLogOut } from "react-icons/io";
import icon from '../assets/icon2.png'
import icon1 from '../assets/icon1.png'
import { useCurrentDateTime } from '../components';
import { Outlet } from 'react-router-dom';

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
    getItem('Client', '2', <ImUserTie size={20} />),
    getItem('Room', '3', <MdOutlineBedroomChild size={20} />),
    getItem('Reservation', '4', <GrSchedules size={20} />),
    getItem('Setting', '5', <IoMdSettings size={20} />),
    getItem('Log out', '6', <IoIosLogOut size={20} />),
  ];

export default function Private() {
    const dateTime = useCurrentDateTime()
    const {
        token: { colorBgContainer, borderRadiusLG , },
      } = theme.useToken();
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
        <Menu theme="light" mode="inline" defaultSelectedKeys={['4']} items={items} />
      </Sider>
      <Layout>
        <Header className='h-24 flex justify-between items-center' style={{ background: colorBgContainer }} >
           <div>
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
