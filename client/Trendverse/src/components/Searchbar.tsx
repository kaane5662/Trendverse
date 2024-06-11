import { faSearch } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useNavigate } from "react-router-dom"
export default function Searchbar(){
    const navigate = useNavigate()

    const search = (e: React.FormEvent) =>{
        e.preventDefault()
        navigate(`/search?filter=latest&tag=${e.target.tag.value || 1}`)
    }

    return(
        <form onSubmit={search} className="flex absolute mx-[100%] m-auto top-7 gap-2 items-center shadow-lg border-2 border-secondary border-opacity-25 rounded-2xl px-4 bg-white z-20 ">
            <h1 className="text-complementary text-xl">#</h1>
            <input name = "tag" className="text-complementary w-[350px] h-[45px] focus:ring-transparent outline-none text-xl bg-white" placeholder="Tag"></input>
            <FontAwesomeIcon className="h-5 text-secondary text-opacity-30 hover:scale-105 duration-300 hover:cursor-pointer" icon={faSearch}></FontAwesomeIcon>
        </form>
    )
}