import Create from "../components/Create";
import EngagedFollowerPosts from "../components/EngagedFollowerPosts";
import Main from "../components/Main";
import Notifications from "../components/Notifications";
import ReccomendedPosts from "../components/ReccomendedPosts";
import Sidebar from "../components/Sidebar";

export default function Dashboard(){
    return(
        <div className=" grid grid-cols-5 h-screen text-primary">
            
            <Sidebar></Sidebar> 
            <div className="bg-primary"></div>
            <div className=" bg-primary text-secondary col-span-3 flex flex-col font-josefin gap-16 p-12">
                <h1 className="text-4xl font-bold">Home</h1>
                <Create/>
                <EngagedFollowerPosts></EngagedFollowerPosts>
                <ReccomendedPosts></ReccomendedPosts>
            </div>
            <div className="bg-primary"></div>
            <Notifications/>
        </div>
    )
}