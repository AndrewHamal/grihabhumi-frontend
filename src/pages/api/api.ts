import { apiURL } from "@/Constant/helper";
import axios from "axios";

axios.defaults.baseURL = apiURL;

export function fetcher(url: string) {
    return axios.get(url);
}

export function login(formData: any) {
    return axios.post('/login', formData)
}

export function register(formData: any) {
    return axios.post('/register', formData)
}

export function postConsult(formData: any) {
    return axios.post('/consult', formData)
}