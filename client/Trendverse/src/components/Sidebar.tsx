import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faGear, faSearch, faCircleUser, faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { faPlusSquare } from "@fortawesome/free-solid-svg-icons/faPlusSquare";
import { useNavigate } from "react-router-dom";
import {useEffect, useState} from "react"
import Searchbar from "./Searchbar";
import axios from "axios";

export default function Sidebar(){

    const navigate = useNavigate()
    const [searchActive, setSearchActive] = useState(false)

    type UserData = {
        username: String,
        id: Number
    }

    const [User, setUser] = useState<UserData>()

    const getUserData = ()=>{
        axios.get(`${import.meta.env.VITE_SERVER}/api/profiles/`, {withCredentials: true}).then((response)=>{
            setUser(response.data)
        }).catch(error=>{
            console.log(error)
        })
        
    }

    const logout = ()=>{
        axios.delete(`${import.meta.env.VITE_SERVER}/api/accounts`, {withCredentials: true}).then((response)=>{
            navigate("/login",{replace:true})
            window.location.reload()
        }).catch((error)=>{
            console.log(error)
        })
    }
    useEffect(()=>{
        getUserData()
    },[])

    return(
        
        <nav className="h-screen  bg-white p-12 font-josefin text-secondary flex flex-col gap-8 border-r-2 fixed z-50 ">
            {searchActive ? (<Searchbar></Searchbar>):(null)}
            
            
            <h1 className=" text-2xl font-bold">Trendverse</h1>
            <h1 onClick={()=> navigate("/")} className=" text-md text-secondary flex gap-4 items-center hover:bg-complementary hover:text-primary hover:cursor-pointer py-2 rounded-lg " ><FontAwesomeIcon  className=" h-4 cursor-pointer hover:text-primary   rounded-xl" icon={faHome}></FontAwesomeIcon> Home</h1>
        
            
            <h1 onClick={()=>setSearchActive(!searchActive)} className=" text-md text-secondary flex gap-4 items-center hover:bg-complementary hover:text-primary hover:cursor-pointer py-2 rounded-lg"><FontAwesomeIcon  className=" h-4 cursor-pointer hover:text-primary   rounded-xl" icon={faSearch}></FontAwesomeIcon> Search</h1>
        
            
            <h1 onClick={()=> User ? navigate(`/profile/${User?.id}`) : null} className=" text-md text-secondary   flex gap-4 items-center hover:bg-complementary hover:text-primary hover:cursor-pointer py-2 rounded-lg"><FontAwesomeIcon  className=" h-4 cursor-pointer hover:text-primary   rounded-xl" icon={faCircleUser}></FontAwesomeIcon>{User ? User.username : "Profile"}</h1>
            
            
            <h1 onClick={()=> navigate("/settings")} className=" text-md text-secondary    flex gap-4 items-center hover:bg-complementary py-2 rounded-lg cursor-pointer hover:text-primary  "><FontAwesomeIcon  className=" h-4  rounded-xl" icon={faGear}></FontAwesomeIcon> Settings</h1>
            
            
            
            <h1 onClick={logout} className=" text-md text-secondary    flex gap-4 items-center hover:bg-complementary hover:text-primary hover:cursor-pointer py-2 rounded-lg"><FontAwesomeIcon className=" h-4 cursor-pointer hover:text-primary   rounded-xl " icon={faRightFromBracket}></FontAwesomeIcon> Logout</h1>
            
            
            
           
        </nav>
        
    )
}
