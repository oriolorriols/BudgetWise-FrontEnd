import React, { useState } from 'react';
import {useNavigate} from 'react-router-dom'

import {
  AppstoreOutlined,
  ContainerOutlined,
  DesktopOutlined,
  MailOutlined,
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
    icon: <ContainerOutlined />,
    label: 'Calendario',
  },
  {
    key: '/objetivos',
    icon: <ContainerOutlined />,
    label: 'Objetivos',
  },
  {
    key: '/perfil',
    icon: <ContainerOutlined />,
    label: 'Perfil',
  }
];


const SideBar = (sidebar) => {
    const [collapsed, setCollapsed] = useState(false);
    const navigate = useNavigate()

  return (
    <div className={`${collapsed ? 'pr-1' : 'pr-10'} sidebar h-screen mr-5 pl-2`}>
        <div className={`${collapsed ? 'nav-logo-collapsed' : 'nav-logo'} mx-5 mt-10 mb-3 justify-center`}/>

        <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="demo-logo-vertical" />
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={['1']}
          items={items}
          onClick={({key})=> {
            navigate(key)
          }}
        />
      </Sider>
      <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: '16px',
              width: 64,
              height: 64,
            }}
          />
    </div>
  );
};
export default SideBar;