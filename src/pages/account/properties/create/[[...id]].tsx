import Navbar from "@/Components/Navbar/Navbar";
import UserSidebar from "@/Components/UserSidebar";
import { fetcher } from "@/pages/api/api";
import { Button, Checkbox, IconButton, Input, Select, Spinner, Textarea } from "@chakra-ui/react";
import dynamic from "next/dynamic";
import { Fragment, useEffect, useState } from "react";
import useSWR from 'swr'
import 'react-quill/dist/quill.snow.css'; // Import Quill styles
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { MdCheckCircle, MdClose, MdSave, MdUploadFile } from "react-icons/md";
import React, { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { postProperty, postUpload } from "@/pages/api/authApi";
import { useRouter } from "next/router";
import axios from "axios";
import { apiURL, storageUrl } from "@/Constant/helper";
import { toast } from "react-toastify";

const QuillEditor = dynamic(() => import('react-quill'), { ssr: false });


export default function PropertyCreate({ id: queryId, features, categories }: any) {
    const router: any = useRouter()
    const [id, setId] = useState(queryId ? queryId : '')
    const { data: cities } = useSWR('/cities', fetcher)
    const { data: facilities } = useSWR('/facilities', fetcher)
    const [images, setImages]: any = useState([])
    const [uploading, setUploading] = useState(false)
    const [submitting, setSubmitting] = useState(false);

    const { control, handleSubmit, watch, formState: { errors }, reset, setError } = useForm<any>({
        defaultValues: {
            facilities: [{ id: '', distance: '' }],
            features: [],
            categories: [],
        },
    })

    const { fields, append, remove } = useFieldArray({
        control,
        name: "facilities"
    });

    const { fields: featuresFields, append: featuresAppend, remove: featuresRemove } = useFieldArray({
        control,
        name: "features"
    });

    const { fields: categoriesFields, append: categoriesAppend, remove: categoriesRemove } = useFieldArray({
        control,
        name: "categories"
    });

    const onDrop = useCallback((acceptedFiles: any) => {
        let formData = new FormData()
        setUploading(true)
        acceptedFiles.map((res: any, key: number) => {
            formData.append(`file[${key}]`, res)
        })

        postUpload(formData)
            .then(res => {
                setImages((prev: any) => {
                    return [...prev, ...res.data.map((res: any) => res.url)]
                })
                setUploading(false)
            }).catch(err => {
                setUploading(false)
            })

    }, [])
    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })


    const quillModules = {
        toolbar: [
            [{ header: [1, 2, 3, false] }],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [{ list: 'ordered' }, { list: 'bullet' }],
            ['link', 'image'],
            [{ align: [] }],
            [{ color: [] }],
            ['code-block'],
            ['clean'],
        ],
    };


    const quillFormats = [
        'header',
        'bold',
        'italic',
        'underline',
        'strike',
        'blockquote',
        'list',
        'bullet',
        'link',
        'image',
        'align',
        'color',
        'code-block',
    ];


    function submit(data: any, type = '') {

        data.features = data.features.filter((res: any) => typeof res != 'undefined')
        data.categories = data.categories.filter((res: any) => typeof res != 'undefined')

        let formData = new FormData()
        Object.entries(data).map((res: any) => {
            if (res?.[1] != '' && typeof res?.[1] != 'undefined') {

                if (res?.[0] == 'features') {
                    data.features.map((res: any, key: number) => {
                        formData.append(`features[${key}]`, res?.pivot?.feature_id);
                    })

                } else if (res?.[0] == 'facilities') {
                    data.facilities.map((res: any, key: number) => {
                        if (res.id != '' && res.distance != '') {
                            formData.append(`facilities[${key}][id]`, res.id);
                            formData.append(`facilities[${key}][distance]`, res.distance);
                        }
                    })
                } else if (res?.[0] == 'categories') {
                    data.categories.map((res: any, key: number) => {
                        formData.append(`categories[${key}]`, res?.pivot?.category_id);
                    })
                } else if (res?.[0] == 'video') {
                    if (data.video.url)
                        formData.append(`video[url]`, data.video.url);
                }
                else {
                    formData.append(res?.[0], res?.[1])
                }
            }
        })

        formData.append('moderation_status', 'pending')
        formData.append('never_expired', '0')

        if (images?.length > 0)
            images.map((res: any, key: number) => {
                formData.append(`images[${key}]`, res)
            })

        if (id) {
            formData.append('_method', 'PATCH')
        }
        setSubmitting(true)
        postProperty(id, formData)
            .then((res: any) => {
                toast.success(res?.message)
                setSubmitting(false)
                if (type == 'submit')
                    router.push('/user/properties')
                else {
                    setId(res.data.id)
                }

            }).catch(err => {
                setSubmitting(false)
                if (err?.data?.errors?.longitude)
                    setError('longitude', { type: 'custom', message: err?.data?.errors?.longitude?.join('/n') })

                if (err?.data?.errors?.latitude)
                    setError('latitude', { type: 'custom', message: err?.data?.errors?.latitude?.join('/n') })
                console.log(err)
            })
    }

    function onSubmitEdit(data: any) {
        submit(data, 'submitEdit')
    }

    function onSubmit(data: any) {
        submit(data, 'submit')
    }

    return (
        <>
            <Navbar />
            <UserSidebar />

            <div className="sm:ml-64 bg-[#f5f5f9] edit create">
                <div className="container p-8 mx-auto">
                    <div className="relative overflow-x-auto rounded grid grid-cols-3 gap-6">
                        <div className="col-span-2 overflow-hidden">
                            <div className="bg-gray-50 border rounded px-5 py-4">
                                <h5 className="mb-3 border-b pb-3 text-[15px] font-[500]">Basic Information</h5>

                                <div className="mb-4">
                                    <label className="text-[14px]">Title <span className="text-red-500">*</span></label>
                                    <Controller
                                        name="name"
                                        control={control}
                                        rules={{
                                            required: 'Title is required!'
                                        }}
                                        render={({ field: { onChange, value } }) => (
                                            <Input type="name" onKeyUp={(e: any) => onChange(e.target.value)} defaultValue={value} fontSize={14} background={"#fff"} className="mt-1" placeholder="Title" />
                                        )}
                                    />

                                    {errors?.name && <p className="text-red-500 text-[13px] mt-1">{errors?.name?.message?.toString()}</p>}
                                </div>

                                <div className="mb-4">
                                    <label className="text-[14px]">Type <span className="text-red-500">*</span></label>
                                    <div className="mt-1"></div>
                                    <Controller
                                        name="type"
                                        control={control}
                                        rules={{
                                            required: 'Type is required!'
                                        }}
                                        render={({ field: { onChange, value } }) => (
                                            <Select value={value} onChange={(e) => onChange(e.target.value)} placeholder="Select Type" name="type" fontSize={14} background={"#fff"}>
                                                <option value="sale">Sale</option>
                                                <option value="rent">Rent</option>
                                            </Select>
                                        )}
                                    />

                                    {errors?.type && <p className="text-red-500 text-[13px] mt-1">{errors?.type?.message?.toString()}</p>}
                                </div>

                                <div className="mb-4">
                                    <label className="text-[14px]">Condition <span className="text-red-500">*</span></label>
                                    <div className="mt-1"></div>
                                    <Controller
                                        name="condition"
                                        control={control}
                                        rules={{
                                            required: 'Condition is required!'
                                        }}
                                        render={({ field: { onChange, value } }) => (
                                            <Select value={value} onChange={(e) => onChange(e.target.value)} placeholder="Select Condition" fontSize={14} background={"#fff"}>
                                                <option value="Brand New">Brand New</option>
                                                <option value="Like New">Like New</option>
                                                <option value="Used">Used</option>
                                            </Select>
                                        )}
                                    />

                                    {errors?.condition && <p className="text-red-500 text-[13px] mt-1">{errors?.condition?.message?.toString()}</p>}
                                </div>

                                <div className="mb-4">
                                    <label className="text-[14px]">Description</label>
                                    <Controller
                                        name="description"
                                        control={control}
                                        render={({ field: { onChange, value } }) => (
                                            <Textarea defaultValue={value} onKeyUp={(e: any) => onChange(e.target.value)} name="description" fontSize={14} background={"#fff"} className="mt-1" placeholder="Short description" />
                                        )}
                                    />
                                </div>

                                <div className="mb-4">
                                    <label className="text-[14px]">Content  <span className="text-red-500">*</span></label>
                                    <Controller
                                        name="content"
                                        control={control}
                                        rules={{
                                            required: 'Content is required!'
                                        }}
                                        render={({ field: { onChange, value } }) => (
                                            <QuillEditor
                                                value={value}
                                                onChange={(e) => onChange(e)}
                                                modules={quillModules}
                                                formats={quillFormats}
                                                className="w-full mt-1 h-[100%] rounded overflow-hidden border-0 bg-white"
                                            />)}
                                    />

                                    {errors?.content && <p className="text-red-500 text-[13px] mt-1">{errors?.content?.message?.toString()}</p>}
                                </div>
                            </div>

                            <div className="bg-gray-50 border rounded px-5 py-4 mt-6">
                                <h5 className="mb-3 border-b pb-3 font-[500] text-[15px]">Location Info</h5>
                                <div className="flex w-[100%] gap-5">
                                    <div className="mb-4 flex-grow">
                                        <label className="text-[14px]">Property Location  <span className="text-red-500">*</span></label>
                                        <Controller
                                            name="location"
                                            control={control}
                                            rules={{
                                                required: 'Location is required!'
                                            }}
                                            render={({ field: { onChange, value } }) => (
                                                <Input type="name" defaultValue={value} onKeyUp={(e: any) => onChange(e.target.value)} fontSize={14} background={"#fff"} className="mt-1" placeholder="Property Location (max:300 characters)" />
                                            )}
                                        />

                                        {errors?.location && <p className="text-red-500 text-[13px] mt-1">{errors?.location?.message?.toString()}</p>}
                                    </div>

                                    <div className="mb-4 flex-grow">
                                        <label className="text-[14px]">City  <span className="text-red-500">*</span></label>
                                        <div className="mt-1"></div>
                                        <Controller
                                            name="city_id"
                                            control={control}
                                            rules={{
                                                required: 'City is required!'
                                            }}
                                            render={({ field: { onChange, value } }) => (
                                                <Select onChange={(e) => onChange(e.target.value)} placeholder="Select Type" name="type" fontSize={14} background={"#fff"}>
                                                    {cities?.data?.map((res: any, key: number) => (
                                                        <option selected={value == res.id} value={res.id} key={key}>{res.name}</option>
                                                    ))}
                                                </Select>)}
                                        />

                                        {errors?.city_id && <p className="text-red-500 text-[13px] mt-1">{errors?.city_id?.message?.toString()}</p>}
                                    </div>
                                </div>

                                <div className="flex w-[100%] gap-5">
                                    <div className="mb-4 flex-grow">
                                        <label className="text-[14px]">Latitude</label>
                                        <Controller
                                            name="latitude"
                                            control={control}
                                            render={({ field: { onChange, value } }) => (
                                                <Input type="name" defaultValue={value} onKeyUp={(e: any) => onChange(e.target.value)} fontSize={14} background={"#fff"} className="mt-1" placeholder="Ex: 1.02933" />
                                            )}
                                        />
                                        {errors?.latiture && <p className="text-red-500 text-[12px] pt-1">{errors?.latiture?.message?.toString()}</p>}
                                    </div>

                                    <div className="mb-4 flex-grow">
                                        <label className="text-[14px]">Longitude</label>
                                        <Controller
                                            name="longitude"
                                            control={control}
                                            render={({ field: { onChange, value } }) => (
                                                <Input type="name" defaultValue={value} onKeyUp={(e: any) => onChange(e.target.value)} fontSize={14} background={"#fff"} className="mt-1" placeholder="Ex: 1.02933" />
                                            )}
                                        />
                                        {errors?.longitude && <p className="text-red-500 text-[12px] pt-1">{errors?.longitude?.message?.toString()}</p>}
                                    </div>
                                </div>


                            </div>

                            <div className="bg-gray-50 border rounded px-5 py-4 mt-6">
                                <h5 className="mb-3 border-b pb-3 font-[500] text-[15px]">Property Details</h5>
                                <div>
                                    <div className="flex w-[100%] gap-5">
                                        <div className="mb-4 flex-grow">
                                            <label className="text-[14px]">Number of bedrooms</label>
                                            <Controller
                                                name="number_bedroom"
                                                control={control}
                                                render={({ field: { onChange, value } }) => (
                                                    <Input type="name" defaultValue={value} onKeyUp={(e: any) => onChange(e.target.value)} fontSize={14} background={"#fff"} className="mt-1" placeholder="Number bedrooms" />
                                                )}
                                            />
                                        </div>

                                        <div className="mb-4 flex-grow">
                                            <label className="text-[14px]">Number of bathrooms</label>
                                            <Controller
                                                name="number_bathroom"
                                                control={control}
                                                render={({ field: { onChange, value } }) => (
                                                    <Input type="name" defaultValue={value} onKeyUp={(e: any) => onChange(e.target.value)} fontSize={14} background={"#fff"} className="mt-1" placeholder="Number bathrooms" />
                                                )}
                                            />
                                        </div>

                                        <div className="mb-4 flex-grow">
                                            <label className="text-[14px]">Number of floors</label>
                                            <Controller
                                                name="number_floor"
                                                control={control}
                                                render={({ field: { onChange, value } }) => (
                                                    <Input type="name" defaultValue={value} onKeyUp={(e: any) => onChange(e.target.value)} fontSize={14} background={"#fff"} className="mt-1" placeholder="Number floors" />
                                                )}
                                            />
                                        </div>
                                    </div>

                                    <div className="flex w-[100%] gap-5">
                                        <div className="mb-4 flex-grow">
                                            <label className="text-[14px]">Build-up Area  <span className="text-red-500">*</span></label>
                                            <Controller
                                                name="square"
                                                rules={{
                                                    required: 'Area is required!'
                                                }}
                                                control={control}
                                                render={({ field: { onChange, value } }) => (
                                                    <Input type="number" defaultValue={value} onKeyUp={(e: any) => onChange(e.target.value)} fontSize={14} background={"#fff"} className="mt-1" placeholder="Build up area" />
                                                )}
                                            />

                                            {errors?.square && <p className="text-red-500 text-[13px] mt-1">{errors?.square?.message?.toString()}</p>}
                                        </div>

                                        <div className="mb-4 flex-grow">
                                            <label className="text-[14px]">Build-up Area Type  <span className="text-red-500">*</span></label>
                                            <div className="pt-1"></div>
                                            <Controller
                                                name="area_type"
                                                control={control}
                                                rules={{
                                                    required: 'Area type is required!'
                                                }}
                                                render={({ field: { onChange, value } }) => (
                                                    <Select onChange={(e) => onChange(e.target.value)} placeholder="Select Type" fontSize={14} background={"#fff"}>
                                                        {[
                                                            'Sq. Feet',
                                                            'Sq. Meter',
                                                            'Ropani',
                                                            'Aana',
                                                            'Paisa',
                                                            'Daam',
                                                            'Bigha',
                                                            'Kattha',
                                                            'Dhur',
                                                        ].map((res, key) => (
                                                            <option selected={value == res} value={res} key={key}>{res}</option>
                                                        ))}
                                                    </Select>
                                                )}
                                            />

                                            {errors?.area_type && <p className="text-red-500 text-[13px] mt-1">{errors?.area_type?.message?.toString()}</p>}
                                        </div>
                                    </div>

                                    <div className="flex w-[100%] gap-5">
                                        <div className="mb-4 flex-grow">
                                            <label className="text-[14px]">Ropani</label>
                                            <Controller
                                                name="ropani"
                                                control={control}
                                                render={({ field: { onChange, value } }) => (
                                                    <Input type="number" defaultValue={value} onKeyUp={(e: any) => onChange(e.target.value)} fontSize={14} background={"#fff"} className="mt-1" placeholder="Number bedrooms" />
                                                )}
                                            />
                                        </div>

                                        <div className="mb-4 flex-grow">
                                            <label className="text-[14px]">Aana</label>
                                            <Controller
                                                name="aana"
                                                control={control}
                                                render={({ field: { onChange, value } }) => (
                                                    <Input type="number" defaultValue={value} onKeyUp={(e: any) => onChange(e.target.value)} fontSize={14} background={"#fff"} className="mt-1" placeholder="Number bathrooms" />
                                                )}
                                            />
                                        </div>

                                        <div className="mb-4 flex-grow">
                                            <label className="text-[14px]">Paisa</label>
                                            <Controller
                                                name="paisa"
                                                control={control}
                                                render={({ field: { onChange, value } }) => (
                                                    <Input type="number" defaultValue={value} onKeyUp={(e: any) => onChange(e.target.value)} fontSize={14} background={"#fff"} className="mt-1" placeholder="Number floors" />
                                                )}
                                            />
                                        </div>

                                        <div className="mb-4 flex-grow">
                                            <label className="text-[14px]">Daam</label>
                                            <Controller
                                                name="daam"
                                                control={control}
                                                render={({ field: { onChange, value } }) => (
                                                    <Input type="number" defaultValue={value} onKeyUp={(e: any) => onChange(e.target.value)} fontSize={14} background={"#fff"} className="mt-1" placeholder="Number floors" />
                                                )}
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-5">
                                        <div className="mb-4 flex-grow">
                                            <label className="text-[14px]">House Type</label>
                                            <div className="pt-1"></div>
                                            <Controller
                                                name="house_type"
                                                control={control}
                                                render={({ field: { onChange, value } }) => (
                                                    <Select onChange={(e) => onChange(e.target.value)} placeholder="Select Type" fontSize={14} background={"#fff"}>
                                                        {[
                                                            'Individual',
                                                            'Housing',
                                                            'Colony',
                                                        ].map((res, key) => (
                                                            <option selected={value == res} value={res} key={key}>{res}</option>
                                                        ))}
                                                    </Select>
                                                )}
                                            />
                                        </div>

                                        <div className="mb-4 flex-grow">
                                            <label className="text-[14px]">Property availability</label>
                                            <div className="pt-1"></div>
                                            <Controller
                                                name="availability"
                                                control={control}
                                                render={({ field: { onChange, value } }) => (
                                                    <Select onChange={(e) => onChange(e.target.value)} placeholder="Select Type" fontSize={14} background={"#fff"}>
                                                        {[
                                                            'Immediately',
                                                            'Within 15 Days',
                                                            'Within 30 Days',
                                                            'After 30 Days',
                                                        ].map((res, key) => (
                                                            <option selected={value == res} value={res} key={key}>{res}</option>
                                                        ))}
                                                    </Select>
                                                )}
                                            />
                                        </div>


                                    </div>

                                    <div className="grid grid-cols-2 gap-5">
                                        <div className="mb-4 flex-grow">
                                            <label className="text-[14px]">Property type (bhk)</label>
                                            <div className="pt-1"></div>
                                            <Controller
                                                name="property_type"
                                                control={control}
                                                render={({ field: { onChange, value } }) => (
                                                    <Select onChange={(e) => onChange(e.target.value)} placeholder="Select bhk/type" fontSize={14} background={"#fff"}>
                                                        {[
                                                            '1 BHK',
                                                            '2 BHK',
                                                            'Duplex',
                                                            '3 BHK',
                                                            '4 BHK',
                                                            '4+ BHK',
                                                            'Studio',
                                                            'Penthouse'
                                                        ].map((res, key) => (
                                                            <option selected={value == res} value={res} key={key}>{res}</option>
                                                        ))}
                                                    </Select>
                                                )}
                                            />
                                        </div>

                                        <div className="mb-4 flex-grow">
                                            <label className="text-[14px]">Furnishing</label>
                                            <div className="pt-1"></div>
                                            <Controller
                                                name="furnishing"
                                                control={control}
                                                render={({ field: { onChange, value } }) => (
                                                    <Select onChange={(e) => onChange(e.target.value)} placeholder="Select Type" fontSize={14} background={"#fff"}>
                                                        {[
                                                            'Full',
                                                            'Semi',
                                                            'None',
                                                        ].map((res, key) => (
                                                            <option selected={value == res} value={res} key={key}>{res}</option>
                                                        ))}
                                                    </Select>
                                                )}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gray-50 border rounded px-5 py-4 mt-6">
                                <h5 className="mb-3 border-b pb-3 font-[500] text-[15px]">Distance key between facilities</h5>
                                <div>
                                    {fields.map((res: any, keys) => (
                                        <div className="flex gap-5 mb-2 items-center" key={res.id}>
                                            <Controller
                                                name={`facilities.${keys}.id`}
                                                control={control}
                                                render={({ field: { onChange, value } }) => (
                                                    <Select defaultValue={value} onChange={(e) => onChange(e.target.value)} fontSize={14} background={"#fff"} placeholder="Select Facility">
                                                        {
                                                            facilities?.data?.map((resp: any, key: number) => (
                                                                <option value={resp?.id} key={key}>{resp?.name}</option>
                                                            ))
                                                        }
                                                    </Select>
                                                )}
                                            />

                                            <Controller
                                                name={`facilities.${keys}.distance`}
                                                control={control}
                                                render={({ field: { onChange, value } }) => (
                                                    <>
                                                        <Input type="number" defaultValue={value} onKeyUp={(e: any) => onChange(e.target.value)} placeholder="Distance (Km)" fontSize={14} background={"#fff"} />
                                                    </>

                                                )}
                                            />

                                            <IconButton
                                                size={"sm"}
                                                colorScheme={'red'}
                                                icon={<MdClose />}
                                                aria-label="Close"
                                                onClick={() => remove(keys)}
                                            />
                                        </div>
                                    ))}

                                    <button onClick={() => append({ id: '', distance: '' })} className="btn-primary text-[14px] mt-3">Add more</button>
                                </div>
                            </div>

                            <div className="bg-gray-50 border rounded px-5 py-4 mt-6 text-[15px]">
                                <h5 className="mb-3 border-b pb-3 font-[500]">Features</h5>
                                <div>
                                    {
                                        features?.map((res: any, key: number) => (
                                            <Fragment key={key}>
                                                <Controller
                                                    name={`features.${key}`}
                                                    control={control}
                                                    render={() => (
                                                        <Checkbox
                                                            isChecked={featuresFields?.map((resp: any) => parseInt(resp?.pivot?.feature_id)).includes(parseInt(res.id)) ? true : false}
                                                            onChange={(e) => {
                                                                let exists = featuresFields?.filter((resp: any) => resp?.pivot?.feature_id == res.id)?.length;

                                                                if (exists) {
                                                                    featuresRemove(featuresFields?.map((resp: any) => parseInt(resp?.pivot?.feature_id)).indexOf(parseInt(res.id)))
                                                                } else {
                                                                    featuresAppend({ ...res, pivot: { feature_id: res.id } })
                                                                }
                                                            }} className="mr-3 mb-2">
                                                            <span className="text-[14px]">{res.name}</span>
                                                        </Checkbox>)}
                                                />
                                            </Fragment>
                                        ))
                                    }
                                </div>
                            </div>

                            <div className="bg-gray-50 border rounded  px-5 py-4 mt-6">
                                <h5 className="mb-3 border-b pb-3 font-[500] text-[15px]">Price & Youtube video link</h5>
                                <div className="grid grid-cols-3 gap-4">
                                    <div>
                                        <label className="text-[14px]">Property Price</label>
                                        <div className="pb-1"></div>
                                        <Controller
                                            name={`price`}
                                            control={control}
                                            render={({ field: { onChange, value } }) => (
                                                <Input fontSize={14} type="number" defaultValue={value} onKeyDown={(e: any) => onChange(e.target.value)} bg={"#fff"} placeholder="Price" />
                                            )}
                                        />
                                    </div>

                                    <div>
                                        <label className="text-[14px]">Negotiable</label>
                                        <div className="pb-1"></div>
                                        <Controller
                                            name={`negotiable`}
                                            control={control}
                                            render={({ field: { onChange, value } }) => (
                                                <Select fontSize={14} defaultValue={value} onChange={(e) => onChange(e.target.value)}>
                                                    {['Yes', 'Fixed Price'].map((res: any, key: number) => (
                                                        <option value={res} key={key}>{res}</option>
                                                    ))}
                                                </Select>
                                            )}
                                        />
                                    </div>

                                    {watch('type') == 'rent' && <div>
                                        <label className="text-[14px]">Period</label>
                                        <div className="pb-1"></div>
                                        <Controller
                                            name={`period`}
                                            control={control}
                                            render={({ field: { onChange, value } }) => (
                                                <Select className="capitalize" fontSize={14} defaultValue={'month'} onChange={(e) => onChange(e.target.value)}>
                                                    {['day', 'month', 'year'].map((res: any, key: number) => (
                                                        <option value={res} key={key}>{res}</option>
                                                    ))}
                                                </Select>
                                            )}
                                        />
                                    </div>}
                                </div>

                                <div className="mt-3">
                                    <label className="text-[14px]">Youtube Video Link</label>
                                    <div className="pb-1"></div>
                                    <Controller
                                        name={`video[url]`}
                                        control={control}
                                        render={({ field: { onChange, value } }) => (
                                            <Input defaultValue={value} onKeyDown={(e: any) => onChange(e.target.value)} bg={"#fff"} fontSize={14} placeholder="https://www.youtube.com/watch?v=PKFnaH0nBAU" />
                                        )}
                                    />
                                </div>
                            </div>

                            <div className="bg-gray-50 border rounded px-5 py-4 mt-6">
                                <h5 className="mb-3 border-b pb-3 font-[500] text-[15px]">Property Images</h5>
                                <div className="pt-1">
                                    <div className="cursor-pointer border border-dashed p-5 rounded bg-white text-center flex items-center justify-center" {...getRootProps()}>
                                        <input {...getInputProps()} />
                                        <MdUploadFile className="mr-3" size={30} color="gray" />
                                        {
                                            isDragActive ?
                                                <p>Drop the files here ...</p> :
                                                <p>Drag 'n' drop some files here, or click to select files</p>
                                        }
                                    </div>

                                    {
                                        uploading && <Spinner className="mt-3" />
                                    }

                                    <div className="flex gap-5 mt-4 flex-wrap">
                                        {
                                            images?.map((res: any, key: number) => (
                                                <Fragment key={key}>
                                                    <div className="relative">
                                                        <div className="absolute right-[3px] top-[3px]">
                                                            <IconButton onClick={() => {
                                                                setImages((prev: any) => {
                                                                    return prev.filter((resp: any) => resp !== res)
                                                                })
                                                            }} icon={<MdClose />} colorScheme="red" aria-label={""} size={"xs"} />
                                                        </div>

                                                        <img className="shadow-sm rounded overflow-hidden w-[90px]" src={storageUrl + res} alt="" />
                                                    </div>
                                                </Fragment>
                                            ))
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="sticky top-0 self-baseline save-section">
                            <div className="bg-gray-50 border rounded px-5 py-4 publish">
                                <h5 className="mb-3 border-b pb-3 text-[15px] font-[500] ">Publish</h5>

                                <div className="flex gap-3">
                                    <Button onClick={handleSubmit(onSubmit)} size={"sm"} fontWeight={400} isLoading={submitting} loadingText={'Submitting'} disabled={submitting || uploading} colorScheme={"blue"} className="flex items-center text-[13px] gap-1 btn-primary"> <MdSave /> Save</Button>
                                    <Button onClick={handleSubmit(onSubmitEdit)} fontWeight={400} isLoading={submitting} disabled={submitting || uploading} loadingText={'Submitting'} size={'sm'} colorScheme={"green"} className="flex items-center text-[13px] gap-1 bg-green-500 p-1 px-2 rounded-[6px] text-white"> <MdCheckCircle color="#fff" /> Save & Edit</Button>
                                </div>

                            </div>

                            <div className="bg-gray-50 border rounded px-5 py-4 mt-4">
                                <h5 className="mb-3 border-b pb-3 text-[15px] font-[500] ">Status  <span className="text-red-500">*</span></h5>

                                <div className="pt-1">
                                    <Controller
                                        name="status"
                                        control={control}
                                        rules={{
                                            required: 'Status is required!'
                                        }}
                                        render={({ field: { onChange, value } }) => (
                                            <Select onChange={(e) => onChange(e.target.value)} placeholder="Select Status" fontSize={14} background={"#fff"}>
                                                {['not_available', 'pre_sale', 'selling', 'sold', 'renting', 'rented', 'building'].map((res: any, key: number) => (
                                                    <option selected={value == res} value={res} key={key} className="capitalize">{res.replace('_', ' ')}</option>
                                                ))}
                                            </Select>)}
                                    />

                                    {errors?.status && <p className="text-red-500 text-[13px] mt-1">{errors?.status?.message?.toString()}</p>}
                                </div>
                            </div>

                            <div className="bg-gray-50 border rounded px-5 py-4 mt-4">
                                <h5 className="mb-3 border-b pb-3 text-[15px] font-[500] ">Category</h5>

                                <div className="flex gap-3">
                                    <div>
                                        {
                                            categories?.map((res: any, key: number) => (
                                                <Fragment key={key}>
                                                    <Controller
                                                        name={`categories[${key}]`}
                                                        control={control}
                                                        render={() => (
                                                            <Checkbox
                                                                isChecked={categoriesFields?.map((resp: any) => parseInt(resp?.pivot?.category_id)).includes(parseInt(res.id)) ? true : false}
                                                                onChange={(e) => {
                                                                    let exists = categoriesFields?.filter((resp: any) => resp?.pivot?.category_id == res.id)?.length;

                                                                    if (exists) {
                                                                        categoriesRemove(categoriesFields?.map((resp: any) => parseInt(resp?.pivot?.category_id)).indexOf(parseInt(res.id)))
                                                                    } else {
                                                                        categoriesAppend({ ...res, pivot: { category_id: res.id } })
                                                                    }
                                                                }} className="w-[100%] mb-2">
                                                                <span className="text-[14px]">{res.name}</span>
                                                            </Checkbox>

                                                        )}
                                                    />
                                                </Fragment>
                                            ))
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div >

        </>
    )
}

export async function getServerSideProps({ req, res, params }: any) {
    let token = req.cookies.token;

    const features = await axios.get(apiURL + `features`);
    const categories = await axios.get(apiURL + `categories?response=api`);

    if (token) {
        let id = params?.id?.[0]

        if (id) {
            const property = await axios.get(apiURL + `properties/${id}?response=api`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            return {
                props: {
                    id: id,
                    property: property?.data,
                    features: features?.data,
                    categories: categories?.data
                },
            };
        }
    }

    return {
        props: {
            features: features?.data,
            categories: categories?.data
        },
    };
}