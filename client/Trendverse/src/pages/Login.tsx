import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faG, faF } from "@fortawesome/free-solid-svg-icons";


export default function Login(){
    const navigate = useNavigate()
    const loginUser = (e:any)=>{
        e.preventDefault()
        axios.put(`${import.meta.env.VITE_SERVER}/api/accounts/`, {
            email: e.target.email.value,
            password: e.target.password.value
        }).then((response)=>{
            console.log(response.data)
            document.cookie = `token = ${response.data}`
            navigate("/",{replace:true})
        }).catch((error)=>{
            console.log(error)
            
        })
    }

    const handleGoogleAuth = ()=>{
        axios.get(`${import.meta.env.VITE_SERVER}/api/accounts/google`).then((response)=>{
            console.log(response.data)
            document.cookie = `token = ${response.data}`
            navigate("/", {replace:true})
        }).catch((error)=>{
            console.log(error)
        })
    }


    return(
        <div className="h-screen flex justify-center items-center -z-0 bg-primary  font-josefin">
            {/* <img className="absolute left-0 w-screen z-10 top-0 h-screen object-cover opacity-20" src="https://www.bypeople.com/wp-content/uploads/2018/10/instagram-post-stories-bundle-bypeople-deals.png"></img> */}
            
                {/* <div className="bg-complementary col-span-4 p-24 flex items-center justify-center text-primary flex-col text-center gap-8 rounded-lgmd ">
                    <h1 className="font-bold text-4xl">New Here?</h1>
                    <p className="text-lg">Sign up now to join our growing community and start sharing your story with the world!</p>
                    <Link to = "/signup"><button className="bg-primary text-secondary rounded-full h-[70px] w-[250px] text-xl font-bold hover:scale-105 duration-500">Sign Up</button></Link>
                </div> */}
                <form onSubmit={loginUser} className="p-16 w-[500px] z-20 shadow-md bg-white col-span-6 text-secondary  flex flex-col gap-4  rounded-lg justify-center ">
                    <h1 className="text-5xl font-bold text-center">Login</h1>
                    {/* auth providers */}
                    
                    <label className="text-sm -mb-4" htmlFor="email">Email</label>
                    <input name="email" placeholder="Enter your email" className="w-[100%]  border-2 p-2 focus:outline-none text-secondary border-secondary border-opacity-10 rounded-lg text-md focus:border-b-4 duration-300 active:outline-none" ></input>
                    <label className="text-sm -mb-4" htmlFor="password">Password</label>
                    <input type="password" placeholder="Enter your password" name="password" className="w-[100%]  border-2 p-2 text-secondary border-secondary border-opacity-10 rounded-lg text-md focus:outline-none active:outline-none focus:border-b-4 duration-300"></input>
                    <Link to = "/signup" className = "text-right underline text-sm hover:text-complementary">Forgot Password</Link>
                    <div className="flex justify-center items-center">
                        <button type = "submit" className="bg-complementary w-[300px] h-[65px] text-primary rounded-lg text-xl hover:scale-105 duration-500 ">Login</button>
                    </div>
                    <h3 className="text-center text-sm">Don't have an account. <span className="underline hover:text-complementary hover:cursor-pointer" onClick={()=>navigate("/signup")}>Sign Up</span></h3>
                    <form action={`${import.meta.env.VITE_SERVER}/api/accounts/auth/google`} method="get" className="w-full flex justify-center">
                        
                        <button className="text-lg text-secondary text-opacity-50 bg-primary p-2 rounded-xl"><img src={"Google__G__logo.png"} className="  rounded-md h-8"></img></button>
                    </form>

                </form>
            
        </div>
    )
}