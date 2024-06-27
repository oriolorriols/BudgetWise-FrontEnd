import { Outlet } from "react-router-dom"
import SideBar  from '../sidebar/sidebar'


const Home = () => {

    return (
      <>
      <div className="flex">
        <SideBar>
        </SideBar>
        <div className="p-8 h-full" style={{ width: 'calc(100vw - 200px)' }}>
            <Outlet></Outlet>
        </div>
      </div>



      </>
    )}
    
export default Home;