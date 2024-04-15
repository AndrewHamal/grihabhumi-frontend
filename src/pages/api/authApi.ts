import { deleteCookie } from "cookies-next";
import axiosInstance from "../../@core/services/axiosInstance";

export function user() {
    return axiosInstance.get('/user')
}

export function userUpdate(formData: any) {
    return axiosInstance.post('/user', formData)
}

export function userAvatar(formData: any) {
    return axiosInstance.post('/user/update-avatar', formData)
}

export function userPassword(formData: any) {
    return axiosInstance.post('/user/update-password', formData)
}

export function updateConsult(id: any, formData: any) {
    return axiosInstance.post(`/user/consult/${id}`, formData)
}

export function deleteProperty(id: any) {
    return axiosInstance.delete(`/user/properties/${id}`)
}

export function postUpload(formData: any) {
    return axiosInstance.post('/user/image/upload', formData)
}

export function postProperty(id = '', formData: any) {
    if (id) {
        return axiosInstance.post(`/user/property/${id}`, formData)
    }

    return axiosInstance.post('/user/property', formData)

}

export function logout() {
    deleteCookie('token');
    axiosInstance.post('/logout')
}

export function fetcherAuth(url: string) {
    return axiosInstance.get(url);
}
