import Sidebar from "../components/Sidebar"
import ProfileHeader from "../components/ProfileHeader"
import Notifications from "../components/Notifications"
import ProfilePosts from "../components/ProfilePosts"
import SettingProfileHeader from "../components/SettingProfileHeader"


export default function Settings(){
    return(
        <div className="grid grid-cols-5 h-screen">
            <Sidebar></Sidebar>
            <div className="bg-primary"></div>
            <div className="bg-primary col-span-3">
                <SettingProfileHeader/>
            </div>
            <div className="bg-primary"></div>
            <Notifications></Notifications>
        </div>
    )
}