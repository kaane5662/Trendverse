import { useEffect, useState } from "react"
import axios from "axios"
import ProfileHeader from "../components/ProfileHeader"
import Sidebar from "../components/Sidebar"
import Notifications from "../components/Notifications"
import ProfilePosts from "../components/ProfilePosts"


export default function Profile(){

    useEffect(()=>{
        console.log(window.location.href)
    },[window.location.href])
    return(
        <div className="grid grid-cols-5 h-screen">
            <Sidebar></Sidebar>
            <div className="bg-primary"></div>
            <div className="bg-primary col-span-3">
                <ProfileHeader/>
                <ProfilePosts/>
            </div>
            <div className="bg-primary"></div>
            <Notifications></Notifications>
        </div>
    )
}