import { ChangeEvent, ChangeEventHandler, useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import axios from "axios"


export default function SettingProfileHeader(){

    const {id} = useParams()
    const navigate = useNavigate()

    type Profile = {
        username: String,
        display_name: string
    }

    type Media = {
        data: ArrayBuffer
    }



    const [display_name, setDisplayName] = useState("")
    const [icon, setIcon] = useState("")
    const [banner, setBanner] = useState("")


    const [Profile, setProfile] = useState<Profile>()
    const [Media, setMedia] = useState<Media[]>()

    const getProfileData = async () =>{
        axios.get(`${import.meta.env.VITE_SERVER}/api/profiles/edit/profile`, {withCredentials: true}).then(async (response)=>{
            console.log(response.data)
            const data = response.data
            setProfile(response.data.User)
            setDisplayName(response.data.User.display_name)
            setBanner(await arrayBufferToBase64(data.Media[0].data.data, data.Media[0].mimetype))
            setIcon(await arrayBufferToBase64(data.Media[1].data.data, data.Media[1].mimetype))
        }).catch((error)=>{
            console.log(error)
        })
    }

    async function arrayBufferToBase64(buffer:ArrayBuffer, mimetype:string) {
        const binary = new Uint8Array(buffer);
        const base64 = btoa(String.fromCharCode.apply(null, binary));
        return `data:${mimetype};base64,${base64}`;
    }

    const saveNewProfileData = (e:React.FormEvent<HTMLFormElement>)=>{
        e.preventDefault()
        const formData = new FormData(e.currentTarget);
        axios.put(`${import.meta.env.VITE_SERVER}/api/profiles/edit`, formData,{withCredentials: true, 
        headers:{
            'Content-Type': 'multipart/form-data'
        }
        }).then((response)=>{
            console.log(response.data)
            window.location.reload()
        }).catch((error)=>{
            console.log(error)
        })
    }
    
    const updateIcon = (e:ChangeEvent<HTMLInputElement>)=>{
        if(!e.target.files) return
        const reader = new FileReader()
        reader.onload = function (e) {
            setIcon(e.target?.result)
        };
        reader.readAsDataURL(e.target.files[0])
    }
    const updateBanner = (e:ChangeEvent<HTMLInputElement>)=>{
        if(!e.target.files) return
        const reader = new FileReader()
        reader.onload = function (e) {
            setBanner(e.target?.result)
        };
        reader.readAsDataURL(e.target.files[0])
    }

    useEffect(()=>{
        getProfileData()  
        
    },[window.location.href])

    return(
        <div className="h-auto w-[100%] font-josefin mb-8">
            <form onSubmit={saveNewProfileData} className="img-container relative">
                <div className="relative h-[225px] w-[100%] ">
                    <img src={banner} className=" bg-complementary h-[225px] w-[100%] rounded-b-xl object-cover"></img>
                    <input onChange={updateBanner} name="banner" type="file" className=" absolute left-40 bottom-20 "></input>
                </div>
                <div className="absolute flex gap-12  -bottom-28 left-8 items-center">
                    <div className="relative">
                        <img src = {icon} className="profile-photo w-[150px] h-[150px] bg-secondary rounded-full object-cover"></img>
                        <input onChange={updateIcon} name = "icon" type="file" className=" absolute "></input>
                    </div>
                    <div className="flex flex-col gap-2 mt-6">
                        <input name="display_name" onChange={(e)=>setDisplayName(e.target.value)} defaultValue={Profile?.display_name} className="text-2xl font-bold text-secondary border-secondary border-2 border-opacity-10 rounded-lg"></input>
                        <h3 className="text-lg text-secondary text-opacity-50 ">@{Profile?.username}</h3>
                    </div>
                    
                    <div className="flex flex-col gap-2 mt-6">
                        
                        <button type="submit" className="rounded-xl w-[150px] h-[45px] bg-complementary text-primary text-xl hover:scale-105 duration-300">Save</button>
                        
                    </div>

                   

                </div>
                
            </form>
        </div>
    )
}