import axios from "axios"

export const useAuth = () => {
    const loginAuth = async() => {
        try {
            const res= await axios.get('http://localhost:3000/test', {  })
            console.log(res)
        } catch (error) {
            console.log(error)
        }
    }
    return { loginAuth }
}