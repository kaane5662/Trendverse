import axios from "axios"
// console.log(process.env.SERVER_DOMAIN)


export default function Create(){

    const uploadPost = async (e: React.FormEvent<HTMLFormElement>)=>{
        e.preventDefault()
        const formData = new FormData(e.currentTarget);
        console.log(formData)
        axios.post(`${import.meta.env.VITE_SERVER}/api/posts`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data', // Important for sending form data
              // You might need additional headers, such as authentication tokens, etc.
            },
            withCredentials: true
        }).then((response)=>{
            console.log(response)
            window.location.reload()
        }).catch(error=>{
            
            console.log(error.message)
        })
    }

    return(
        <form onSubmit={uploadPost} className="flex gap-4 bg-white p-8 rounded-xl flex-col">
            <div className="flex gap-4">
                <img className=" h-12 w-12 object-cover bg-complementary rounded-full "></img>
                <textarea name = "content" className="p-4 text-xl w-[100%] min-h-[100px]  bg-black bg-opacity-0  border-b-2 " placeholder="Share your Experience!"></textarea>
            </div>
            <div className="flex justify-end items-center">
                <input name = "uploads" type="file" multiple = {true} className=" file:bg-primary file:text-secondary file:border-none file:rounded-md file:p-1 text-secondary rounded-md w-fit file:w-fit "></input>
                <button type="submit" className="bg-complementary text-lg rounded-md self-end p-2 px-8 text-primary hover:scale-105 duration-300 font-bold">Post</button>
            </div>
        </form>
    )
}