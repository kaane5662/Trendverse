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

    useEffect(()=>{
        getUserData()
    },[])

    return(
        
        <nav className="h-screen fixed -left-2 w-fit bg-primary p-12 font-josefin text-secondary flex flex-col gap-16  border-r-2 border-r-primary border-opacity-50">
            {searchActive ? (<Searchbar></Searchbar>):(null)}
            
            <div className="flex gap-8 hover:scale-105 duration-300 hover:cursor-pointer" onClick={()=> navigate("/") }>
                <FontAwesomeIcon className=" h-6" icon={faHome}></FontAwesomeIcon>
                <h1 className="font-bold text-lg">Home</h1>
            </div>
            <div className="flex gap-8 hover:scale-105 duration-300 cursor-pointer" onClick={()=>setSearchActive(!searchActive)}>
                <FontAwesomeIcon className=" h-6" icon={faSearch}></FontAwesomeIcon>
                <h1 className="font-bold text-lg">Search</h1>
            </div>
            <div className="flex gap-8 hover:scale-105 duration-300 cursor-pointer">
                <FontAwesomeIcon className=" h-6" icon={faCircleUser}></FontAwesomeIcon>
                <h1 onClick={()=> User ? navigate(`/profile/${User?.id}`) : null} className="font-bold text-lg">{User ? User.username : "Profile"}</h1>
            </div>
            <div className="flex gap-8 hover:scale-105 duration-300 cursor-pointer">
            <FontAwesomeIcon className=" h-6" icon={faGear}></FontAwesomeIcon>
                <h1 onClick={()=> navigate("/settings")} className="font-bold text-lg">Settings</h1>
            </div>
            <div className="flex gap-8">
            <FontAwesomeIcon className=" h-6" icon={faRightFromBracket}></FontAwesomeIcon>
                <h1 className="font-bold text-lg">Logout</h1>
            </div>
            
            
           
        </nav>
        
    )
}
