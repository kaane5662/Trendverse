import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

export default function SignUp(){

    // const createAccount = (e: React.FormEvent)=>{
    //     e.preventDefault()
    //     axios.post()
    // }
    const navigate = useNavigate()

    const createAccount = (e: any)=>{
        e.preventDefault()
        // console.log(e.target.username.value)
        axios.post(`${import.meta.env.VITE_SERVER}/api/accounts`,{
            username: e.target.username.value,
            email: e.target.email.value,
            password: e.target.password.value,
            confirmpassword: e.target.confirmpassword.value
        }).then((response)=>{
            console.log(response.data)
            document.cookie = `token = ${response.data}`
            navigate("/")
        }).catch((error)=>{
            console.log(error)
        })
    }


    return(
        <div className=" bg-complementary min-h-screen max-h-screen text-secondary font-josefin flex p-8 justify-center">
            <form onSubmit={createAccount} className="shadow-2xl z-10 grid grid-cols-2 gap-10 p-16 w-[55%] bg-primary rounded-md ">
                <div className=" col-span-2 flex flex-col gap-3">
                    <h1 className=" text-5xl text-center font-bold">Sign Up</h1>
                    <h3 className=" text-md text-opacity-50 text-secondary text-center ">Join the vibrant community of Trendverse and connect with 
                    friends, share your life's moments, and discover new experiences.</h3>
                    <form action={`${import.meta.env.VITE_SERVER}/api/accounts/auth/google`} method="get" className="flex justify-center hover:scale-105 hover:cursor-pointer duration-300 items-center gap-6 p-2 border-opacity-20 border-2 border-secondary rounded-md w-[50%] self-center  ">
                        <img src={"Google__G__logo.png"} className="  rounded-md h-8"></img>
                        <button className="text-lg text-secondary text-opacity-50">Continue with Google</button>
                    </form>
                </div>
                
                
                <div className=" col-span-1 flex flex-col gap-4">
                    <label htmlFor="username" className="text-md -mb-4">Username</label>
                    <input placeholder="Enter your username" name="username" className="w-[100%] text-lg h-[50px] border-b-2 border-b-complementary  rounded-sm focus:outline-none bg-primary focus:border-b-4 duration-300"></input>
                </div>
            
                <div className=" col-span-1 flex flex-col gap-4">
                    <label htmlFor="email" className="text-md -mb-4">Email</label>
                    <input placeholder="Enter your email" name="email" className="focus:border-b-4 duration-300 w-[100%] text-lg h-[50px] border-b-2 border-b-complementary  rounded-sm focus:outline-none bg-primary"></input>
                </div>

                <div className=" col-span-1 flex-col flex gap-4">
                    <label htmlFor="password" className="text-md -mb-4">Password</label>
                    <input placeholder="Enter your password" name = "password" className="focus:border-b-4 duration-300 w-[100%]  text-lg h-[50px] border-b-2 border-b-complementary rounded-sm focus:outline-none bg-primary" type="password"></input>
                </div>

                <div className=" col-span-1 flex flex-col gap-4">
                    <label htmlFor="confirmPassowrd" className="text-md -mb-4">Confirm Password</label>
                    <input placeholder="Retype your password" name="confirmpassword" className="focus:border-b-4 duration-300 w-[100%] text-lg h-[50px] border-b-2 border-b-complementary rounded-sm focus:outline-none bg-primary" type="password"></input>
                </div>
            
                <div className="col-span-2 flex gap-4 flex-col items-center justify-center">

                    <h3 className="col-span-2">Already a user? <Link className=" text-secondary  underline hover:text-complementary" to={"/login"}>Sign In</Link></h3>
                    <button type="submit" className="col-span-2 rounded-md bg-complementary w-[300px] h-[60px] self-center flex justify-center items-center text-primary text-xl hover:scale-105 duration-500">Sign Up</button>
                </div>
            </form>
            <img className=" w-screen absolute top-0 col-span-3 bg-complementary h-screen w-auto object-cover opacity-20    " src="https://www.bypeople.com/wp-content/uploads/2018/10/instagram-post-stories-bundle-bypeople-deals.png"></img>
        </div>
    )
}