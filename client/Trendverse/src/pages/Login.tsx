import { Link, useNavigate } from "react-router-dom";
import axios from "axios";


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
            navigate("/")
        }).catch((error)=>{
            console.log(error)
            
        })
    }
    return(
        <div className="h-screen px-56 flex justify-center items-center -z-0 bg-complementary  font-josefin">
            <img className="absolute left-0 w-screen z-10 top-0 h-screen object-cover opacity-20" src="https://www.bypeople.com/wp-content/uploads/2018/10/instagram-post-stories-bundle-bypeople-deals.png"></img>
            <div className="grid z-20 grid-cols-10 shadow-2xl ">
                <div className="bg-complementary col-span-4 p-24 flex items-center justify-center text-primary flex-col text-center gap-8 rounded-l-md ">
                    <h1 className="font-bold text-4xl">New Here?</h1>
                    <p className="text-lg">Sign up now to join our growing community and start sharing your story with the world!</p>
                    <Link to = "/signup"><button className="bg-primary text-secondary rounded-full h-[70px] w-[250px] text-xl font-bold hover:scale-105 duration-500">Sign Up</button></Link>
                </div>
                <form onSubmit={loginUser} className="p-20 bg-primary col-span-6 text-secondary  flex flex-col gap-8  rounded-r-md ">
                    <h1 className="text-4xl font-bold">Login</h1>
                    <label className="text-lg -mb-8" htmlFor="email">Email</label>
                    <input name="email" className="w-[100%] h-[50px] border-b-2 focus:outline-none bg-primary text-secondary border-b-complementary rounded-sm text-xl focus:border-b-4 duration-300 active:outline-none" ></input>
                    <label className="text-lg -mb-8" htmlFor="password">Password</label>
                    <input type="password" name="password" className="w-[100%] h-[50px] border-b-2 bg-primary text-secondary border-b-complementary rounded-sm text-xl focus:outline-none active:outline-none focus:border-b-4 duration-300"></input>
                    <Link to = "/signup" className = "  text-right underline text-md text-complementary">Forgot Password</Link>
                    <div className="flex justify-center items-center">
                        <button type = "submit" className="bg-complementary w-[300px] h-[65px] text-primary rounded-full text-xl hover:scale-105 hover:bg-primary border-2 hover:text-complementary hover:text-2xl    border-complementary duration-500">Login</button>
                    </div>


                </form>
            </div>
        </div>
    )
}