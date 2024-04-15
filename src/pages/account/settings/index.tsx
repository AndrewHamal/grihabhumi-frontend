import useSWR from 'swr'
import Navbar from "@/Components/Navbar/Navbar";
import UserSidebar from "@/Components/UserSidebar";
import { fetcherAuth, postUpload, userAvatar, userPassword, userUpdate } from "@/pages/api/authApi";
import { Button, Spinner } from "@chakra-ui/react";
import { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { MdUploadFile } from "react-icons/md";
import { storageUrl } from '@/Constant/helper';
import { toast } from 'react-toastify';

export default function Settings() {

    const { data: profile } = useSWR('/user', fetcherAuth)
    const [uploading, setUploading] = useState(false)
    const [submitting, setSubmitting] = useState(false)
    const [image, setImage] = useState()

    const onDrop = useCallback((acceptedFiles: any) => {
        let formData = new FormData()
        setUploading(true)
        formData.append(`avatar`, acceptedFiles[0])
        formData.append('_method', 'PATCH')

        userAvatar(formData)
            .then(res => {
                setImage(res.data?.avatar)
                setUploading(false)
            }).catch(err => {
                setUploading(false)
            })

    }, [])

    useEffect(() => {
        if (profile) {
            setImage(profile?.data?.avatar?.url)
        }
    }, [profile])

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, multiple: false, accept: { 'image/png': ['.png'], 'image/jpeg': ['.jpg', '.jpeg'] } })


    function profileUpdate(e: any) {
        e.preventDefault()
        let formData = new FormData(e.target)
        formData.append('_method', 'PATCH')

        setSubmitting(true)
        userUpdate(formData)
            .then((res: any) => {
                toast.success(res?.message)
                setSubmitting(false)
            }).catch(err => {
                setSubmitting(false)
            })
    }

    function submitPassword(e: any) {
        e.preventDefault()
        let formData = new FormData(e.target)
        formData.append('_method', 'PATCH')

        setSubmitting(true)
        userPassword(formData)
            .then((res: any) => {
                toast.success(res?.message)
                setSubmitting(false)
            }).catch(err => {
                setSubmitting(false)
            })
    }

    return (
        <>
            <Navbar />
            <UserSidebar />

            <div className="sm:ml-64 bg-[#f5f5f9] overflow-y-scroll">
                <div className="container p-8 mx-auto">
                    <div className='flex flex-wrap w-[100%] gap-5'>
                        <div className='bg-white flex-grow border rounded-[9px] p-5'>
                            <h5 className="mb-3 border-b pb-3 text-[15px] font-[500]">Profile Information</h5>
                            <div className="cursor-pointer object-cover mb-5 relative w-[140px] h-[140px] border border-dashed p-5 rounded bg-white text-center flex items-center justify-center" {...getRootProps()}>
                                {image && <img src={storageUrl + image} className='h-[100%] bg-[#000] rounded cover absolute top-0 bottom-0 right-0 left-0' alt="" />}
                                {
                                    uploading && <div className='absolute'> <Spinner className="mt-3" /></div>
                                }

                                <div>
                                    <input {...getInputProps()} />
                                    <MdUploadFile className="mr-2" size={30} color="gray" />
                                    <p className='text-[14px]'>Upload</p>
                                </div>

                                {image && <div className='flex items-center gap-1 absolute z-[99] btn-primary bottom-[3px] text-[11px] left-[3px]'>
                                    <MdUploadFile /> Upload
                                </div>}

                            </div>


                            <form
                                id="setting-form"
                                method="POST"
                                onSubmit={profileUpdate}
                            >
                                {/* Name */}
                                <div className="form-group mb-3">
                                    <label htmlFor="first_name">First name</label>
                                    <input
                                        type="text"
                                        className="form-control is-valid"
                                        name="first_name"
                                        id="first_name"
                                        required={true}
                                        defaultValue={profile?.data?.first_name}
                                        aria-required="true"
                                        aria-invalid="false"
                                        aria-describedby="first_name-error"
                                    />
                                    <span
                                        id="first_name-error"
                                        className="invalid-feedback"
                                        style={{ display: "inline" }}
                                    />
                                </div>
                                {/* Name */}
                                <div className="form-group mb-3">
                                    <label htmlFor="last_name">Last name</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="last_name"
                                        id="last_name"
                                        required={true}
                                        defaultValue={profile?.data?.last_name}
                                        aria-required="true"
                                    />
                                </div>
                                <div className="form-group mb-3">
                                    <label htmlFor="company">Company Name</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="company"
                                        id="company"
                                        required
                                        defaultValue={profile?.data?.company}
                                        aria-required="true"
                                    />
                                </div>
                                {/* Phone */}
                                <div className="form-group mb-3">
                                    <label htmlFor="phone">Phone</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="phone"
                                        id="phone"
                                        defaultValue={profile?.data?.phone}
                                        aria-required="true"
                                    />
                                </div>
                                {/*Short description*/}
                                <div className="form-group mb-3">
                                    <label htmlFor="description">Short description</label>
                                    <textarea
                                        className="form-control"
                                        name="description"
                                        id="description"
                                        rows={3}
                                        defaultValue={profile?.data?.description}
                                        maxLength={300}
                                        placeholder="Tell something about yourself..."
                                    />
                                </div>
                                {/* Email */}
                                <div className="form-group mb-3">
                                    <label htmlFor="email">Email</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        name="email"
                                        id="email"
                                        disabled
                                        placeholder="plugins/real-estate::dashboard.email_placeholder"
                                        required
                                        defaultValue={profile?.data?.email}
                                        aria-required="true"
                                    />
                                </div>

                                {/* Gender */}
                                <div className="form-group mb-3">
                                    <label htmlFor="gender">Gender</label>
                                    <select className="form-control w-[100%]" defaultValue={profile?.data?.gender} name="gender" id="gender">
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>

                                <Button isLoading={submitting} loadingText="submitting" colorScheme='blue' fontWeight={400} fontSize={14} type="submit" className="btn text-[14px] btn-primary mt-6">
                                    Update Profile
                                </Button>
                            </form>
                        </div>
                        <div>
                            <div className='bg-white border rounded-[9px] p-5'>
                                <h5 className="mb-3 border-b pb-3 text-[15px] font-[500]">Password Security</h5>

                                <form
                                    method="POST"
                                    id="setting-form"
                                    onSubmit={submitPassword}
                                >
                                    <input type="hidden" name="_method" defaultValue="PATCH" />
                                    <div className="form-group mb-3">
                                        <label htmlFor="password">New password</label>
                                        <input
                                            type="password"
                                            required
                                            className="form-control"
                                            name="password"
                                            id="password"
                                        />
                                    </div>
                                    <div className="form-group mb-3">
                                        <label htmlFor="password_confirmation">Confirmation password</label>
                                        <input
                                            type="password"
                                            required
                                            className="form-control"
                                            name="password_confirmation"
                                            id="password_confirmation"
                                        />
                                    </div>
                                    <Button fontSize={14} isLoading={submitting} loadingText="submitting" colorScheme='blue' fontWeight={400} type="submit" className="btn btn-primary mt-3">
                                        Update password
                                    </Button>
                                </form>

                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}