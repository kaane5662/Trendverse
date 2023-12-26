import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

export default function SignUp(){

    // const createAccount = (e: React.FormEvent)=>{
    //     e.preventDefault()
    //     axios.post()
    // }
    const navigate = useNavigate()

    const createAccount = (e: React.FormEvent)=>{
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
        <div className=" bg-complementary min-h-screen text-secondary font-josefin flex p-12 justify-center">
            <form onSubmit={createAccount} className=" grid grid-cols-2 gap-8 p-16 w-[50%] bg-primary rounded-2xl ">
                <div className=" col-span-2 flex flex-col gap-4">
                    <h1 className=" text-4xl font-bold">Sign Up</h1>
                    <h3 className=" text-md text-opacity-50 text-secondary  ">Join the vibrant community of Trendverse and connect with 
                    friends, share your life's moments, and discover new experiences.</h3>
                </div>
                
                
                <div className=" col-span-1 flex flex-col gap-4">
                    <label htmlFor="username" className="text-sm -mb-4">Username</label>
                    <input name="username" className="w-[100%] text-xl h-[50px] border-b-2 border-b-complementary  rounded-sm focus:outline-none bg-primary focus:border-b-4 duration-300"></input>
                </div>
            
                <div className=" col-span-1 flex flex-col gap-4">
                    <label htmlFor="email" className="text-sm -mb-4">Email</label>
                    <input name="email" className="focus:border-b-4 duration-300 w-[100%] text-xl h-[50px] border-b-2 border-b-complementary  rounded-sm focus:outline-none bg-primary"></input>
                </div>

                <div className=" col-span-1 flex-col flex gap-4">
                    <label htmlFor="password" className="text-sm -mb-4">Password</label>
                    <input name = "password" className="focus:border-b-4 duration-300 w-[100%]  text-xl h-[50px] border-b-2 border-b-complementary rounded-sm focus:outline-none bg-primary" type="password"></input>
                </div>

                <div className=" col-span-1 flex flex-col gap-4">
                    <label htmlFor="confirmPassowrd" className="text-sm -mb-4">Confirm Password</label>
                    <input name="confirmpassword" className="focus:border-b-4 duration-300 w-[100%] text-xl h-[50px] border-b-2 border-b-complementary rounded-sm focus:outline-none bg-primary" type="password"></input>
                </div>
            
                <div className="col-span-2 flex gap-4 flex-col items-center justify-center">

                    <h3 className="col-span-2">Already a member? <Link className=" text-complementary  underline" to={"/login"}>Sign In</Link></h3>
                    <button type="submit" className="col-span-2 rounded-full bg-complementary w-[300px] h-[60px] self-center flex justify-center items-center text-primary font-bold text-lg hover:scale-105 duration-500">Sign Up</button>
                </div>
            </form>
            {/* <img className=" col-span-3 bg-complementary h-screen w-auto object-cover opacity-    " src="https://www.bypeople.com/wp-content/uploads/2018/10/instagram-post-stories-bundle-bypeople-deals.png"></img> */}
        </div>
    )
}