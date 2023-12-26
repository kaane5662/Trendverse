import axios from "axios"
// console.log(process.env.SERVER_DOMAIN)


export default function Create(){

    const uploadPost = async (e: React.FormEvent<HTMLFormElement>)=>{
        e.preventDefault()
        const formData = new FormData(e.currentTarget);
        console.log(formData)
        axios.post(`http://localhost:3000/api/posts`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data', // Important for sending form data
              // You might need additional headers, such as authentication tokens, etc.
            },
            withCredentials: true
        }).then((response)=>{
            console.log(response)
        }).catch(error=>{
            console.log(error.message)
        })
    }

    return(
        <form onSubmit={uploadPost} className="flex gap-4 flex-col">
            <div className="flex gap-4">

                <img className=" h-16 w-16 object-scale-down bg-complementary rounded-2xl "></img>
                <textarea name = "content" className="p-4 text-2xl w-[100%] h-[250px] rounded-2xl bg-black bg-opacity-0 border-secondary border-2 border-opacity-40" placeholder="Share your Experience!"></textarea>
            </div>
            <div className="flex gap-4 justify-end items-center">
                <input name = "uploads" type="file" multiple = {true} className="bg-primary text-secondary rounded-md "></input>
                <button type="submit" className="bg-complementary text-xl rounded-2xl w-[250px] self-end  h-[45px] text-primary hover:scale-105 duration-300">Post</button>
            </div>
        </form>
    )
}