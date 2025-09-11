import axios from "axios";

const api = axios.create({
    baseURL: "https://689f096e3fed484cf878d12a.mockapi.io/api/v1",
    timeout:10000
});

api.interceptors.request.use(async(config)=>{
    // config.headers.Authorization = `Bearer ${await localStorage.getItem('token')}`
    return config
})

api.interceptors.response.use(async(config)=>{
    return config
})

export default api