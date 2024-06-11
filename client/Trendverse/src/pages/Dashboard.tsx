import { useEffect, useState } from "react";
import Create from "../components/Create";
import EngagedFollowerPosts from "../components/EngagedFollowerPosts";
import Notifications from "../components/Notifications";
import ReccomendedPosts from "../components/ReccomendedPosts";
import Sidebar from "../components/Sidebar";
import ExplorePosts from "../components/ExplorePosts";

export default function Dashboard(){
    const Filters = ["For You", "Following", "Explore"]
    const [filterer, setFilterer] = useState("For You")
            

    return(
        
            
        <main className="bg-primary font-josefin min-h-screen">
            <div className="rounded-xl flex justify-center p-4 items-center gap-32 bg-white fixed w-full h-fit z-10 border-b-2 ">

            {
                Filters.map((filter, index)=>{
                    return filterer == filter ?  (
                        <div className="border-b-2 border-complementary py-2 px-6">
                            <h1 className="text-md font-bold hover:" key = {index}>{filter.charAt(0).toUpperCase() + filter.slice(1)}</h1>
                        </div>
                    ):(
                        <div onClick={()=>setFilterer(filter) } className="border-b-2 hover:border-complementary duration-300 py-2 px-6 hover:font-bold hover:cursor-pointer">
                            <h1 className="text-md" key = {index}>{filter.charAt(0).toUpperCase() + filter.slice(1)}</h1> 
                        </div>
                        
                    )
                })
            }
            </div>
            <div className="flex flex-col gap-8 p-96 py-24 py-0">

                <Create/>
                {
                    (filterer == "For You"  && <ReccomendedPosts></ReccomendedPosts>)
                }{
                    (filterer == "Following"  && <EngagedFollowerPosts></EngagedFollowerPosts>)
                }
                {
                    (filterer == "Explore"  && <ExplorePosts></ExplorePosts>)
                }
            </div>
        </main>  
            
        

            
            
            
     
            
        
    )
}