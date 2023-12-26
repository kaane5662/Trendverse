import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import axios from "axios"


export default function ProfileHeader(){

    const {id} = useParams()
    const navigate = useNavigate()

    type Profile = {
        username: String,
        display_name: String
    }

    type Follow = {
        id: String
    }


    const [Profile, setProfile] = useState<Profile>()
    const [Followers, setFollowers] = useState<Follow[]>()
    const [Following, setFollowing] = useState<Follow[]>()

    const [icon, setIcon] = useState("")
    const [banner, setBanner] = useState("")

    function arrayBufferToBase64(buffer:ArrayBuffer, mimetype:string) {
        const binary = new Uint8Array(buffer);
        const base64 = btoa(String.fromCharCode.apply(null, binary));
        return `data:${mimetype};base64,${base64}`;
    }

    const getProfileData = () =>{
        axios.get(`http://localhost:3000/api/profiles/${id}`).then((response)=>{
            setProfile(response?.data.User)
            if(!response.data.Media || response.data.Media.length < 1) return
            setBanner(arrayBufferToBase64(response.data.Media[0].data.data, response.data.Media[0].mimetype))
            setIcon(arrayBufferToBase64(response.data.Media[1].data.data, response.data.Media[1].mimetype))
        }).catch((error)=>{
            console.log(error)
        })
    }

    const getFollowerData = () =>{
        axios.get(`http://localhost:3000/api/profiles/followers/${id}`).then((response)=>{
            setFollowers(response?.data)
        }).catch((error)=>{
            console.log(error)
        })
    }

    const getFollowingData = ()=>{
        axios.get(`${import.meta.env.VITE_SERVER}/api/profiles/following/${id}`).then((response)=>{
            setFollowing(response?.data)
        }).catch((error)=>{
            console.log(error)
        })
    }

    const followUser = ()=>{
        axios.put(`${import.meta.env.VITE_SERVER}/api/actions/profile/follow/${id}`, {} ,{withCredentials: true}).then((response)=>{
            getFollowerData()
        }).catch((error)=>{
            // if(error.response.status == 401 || error.response.status == 403) navigate("/login")
            console.log(error)
        })
    }

    useEffect(()=>{
        getProfileData()  
        getFollowerData()  
        getFollowingData()
    },[window.location.href])

    return(
        <div className="h-auto w-[100%] font-josefin mb-8">
            <div className="img-container relative">

                <img src={banner} className=" bg-complementary h-[225px] w-[100%] rounded-b-xl object-cover"></img>
                <div className="absolute flex gap-12  -bottom-28 left-8 items-center">

                    <img src ={icon} className="profile-photo w-[150px] h-[150px] bg-secondary rounded-full object-cover"></img>
                    <div className="flex flex-col gap-2 mt-6">
                        <h1 className="text-2xl font-bold text-secondary">{Profile?.display_name}</h1>
                        <h3 className="text-lg text-secondary text-opacity-50 ">@{Profile?.username}</h3>
                    </div>
                    <div className="flex flex-col gap-2 mt-6">
                        <h1 className="text-2xl font-bold text-secondary">Followers</h1>
                        <h3 className="text-lg text-secondary text-opacity-50 ">{Followers?.length}</h3>
                    </div>
                    <div className="flex flex-col gap-2 mt-6">
                        <h1 className="text-2xl font-bold text-secondary">Following</h1>
                        <h3 className="text-lg text-secondary text-opacity-50 ">{Following?.length}</h3>
                    </div>
                    <div className="flex flex-col gap-2 mt-6">
                        <button onClick={followUser} className="rounded-xl w-[150px] h-[45px] bg-complementary text-primary text-xl hover:scale-105 duration-300">Follow</button>
                    </div>

                   

                </div>
                
            </div>
        </div>
    )
}