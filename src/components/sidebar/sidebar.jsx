import { useState } from 'react';
import {useNavigate} from 'react-router-dom'

import {
  DesktopOutlined,
  CalendarOutlined,
  ContainerOutlined,
  LogoutOutlined,
  RiseOutlined,
  UserOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  PieChartOutlined,
} from '@ant-design/icons';
import {  Menu, Layout, Button } from 'antd';
const { Sider } = Layout;

import './sidebar.scss'


const items = [
  {
    key: '/',
    icon: <PieChartOutlined />,
    label: 'Dashboard',
  },
  {
    key: '/users',
    icon: <DesktopOutlined />,
    label: 'Lista de empleados',
  },
  {
    key: '/calendario',
    icon: <CalendarOutlined />,
    label: 'Calendario',
  },
  {
    key: '/objetivos',
    icon: <RiseOutlined />,
    label: 'Objetivos',
  },
  {
    key: '/perfil',
    icon: <UserOutlined />,
    label: 'Perfil',
  },
  {
    key: '/ausencias',
    icon: <ContainerOutlined />,
    label: 'Ausencias',
  },
  {
    key: '/expenses',
    icon: <ContainerOutlined />,
    label: 'Gastos',
  },
  {
    key: '/requests',
    icon: <ContainerOutlined />,
    label: 'Solicitudes',
  },
  {
    key: '/logout',
    icon: <LogoutOutlined />,
    label: 'Logout',
  },
];

const SideBar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate()

  return (
  <div className='sidebar h-screen sticky top-0'>
    <Sider trigger={null} collapsible collapsed={collapsed} className={`h-full pt-10 ${collapsed ? '' : 'mr-8'} `}>
      <div className={`${collapsed ? 'nav-logo-collapsed ml-4' : 'nav-logo ml-7'}`}/>

        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={['1']}
          items={items}
          onClick={({key}) => {
            if (key === '/logout') {
            localStorage.removeItem('access_token')
            navigate('/login')}
            else navigate(key)}}
        />

      <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined style={{color: 'rgba(255, 255, 255, 0.65)'}}/> : <MenuFoldOutlined style={{color: 'rgba(255, 255, 255, 0.65)'}}/>}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: '16px',
              width: 64,
              height: 64,
            }}
          />
      </Sider>
    </div>
  );
};
export default SideBar;