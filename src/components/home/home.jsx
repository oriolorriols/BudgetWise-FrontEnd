import { Outlet } from "react-router-dom"
import SideBar  from '../sidebar/sidebar'


const Home = () => {

    return (
      <>
      <div className="flex">
        <SideBar>
        </SideBar>
        <div className="m-8 w-full h-full">
            <Outlet></Outlet>
        </div>
      </div>



      </>
    )}
    
export default Home;