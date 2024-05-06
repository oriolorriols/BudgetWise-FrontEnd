import { Routes, Route, useNavigate, Outlet } from "react-router-dom"

import Users from "../../pages/users/users"
import SideBar  from '../sidebar/sidebar'


const Home = () => {

    return (
      <>
      <div className="flex">
        <SideBar>
        </SideBar>
        <div className="m-8">
            <Outlet></Outlet>
        </div>
      </div>



      </>
    )}
    
export default Home;