import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from "../../contexts/authContext";

import {
  ContactsOutlined,
  CalendarOutlined,
  SolutionOutlined,
  LogoutOutlined,
  RiseOutlined,
  UserOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  PieChartOutlined,
  BankOutlined,
  CarryOutOutlined,
  DeploymentUnitOutlined,
} from '@ant-design/icons';
import { Menu, Layout, Button } from 'antd';

const { Sider } = Layout;

import './sidebar.scss';

const items = [
  {
    key: '/',
    icon: <PieChartOutlined />,
    label: 'Dashboard',
  },
  {
    key: '/usuarios',
    icon: <ContactsOutlined />,
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
    icon: <SolutionOutlined />,
    label: 'Viajes',
  },
  {
    key: '/gastos',
    icon: <BankOutlined />,
    label: 'Gastos',
  },
  {
    key: '/solicitudes',
    icon: <CarryOutOutlined />,
    label: 'Solicitudes',
  },
  {
    key: '/empresa',
    icon: <DeploymentUnitOutlined />,
    label: 'Empresa',
  },
  {
    key: '/logout',
    icon: <LogoutOutlined />,
    label: 'Logout',
  },
];

const SideBar = () => {
  const { pathname } = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const { setLogOut, isHR } = useAuth();

  const filteredItems = items.filter(item => {
    if (isHR !== 'HR' && (item.key === '/usuarios')) {
      return false;
    }
    return true;
  });

  return (
    <div className='sidebar h-screen sticky top-0'>
      <Sider trigger={null} collapsible collapsed={collapsed} className={`h-full pt-10 ${collapsed ? '' : 'mr-8'} `}>
        <div className={`${collapsed ? 'nav-logo-collapsed ml-4' : 'nav-logo ml-7'}`} />
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[pathname]}
          items={filteredItems}
          onClick={({ key }) => {
            if (key === '/logout') {
              setLogOut();
              navigate('/login');
            } else {
              navigate(key);
            }
          }}
        />
{/*
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
*/}
      </Sider>
    </div>
  );
};
export default SideBar;