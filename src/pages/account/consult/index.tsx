import Navbar from "@/Components/Navbar/Navbar";
import UserSidebar from "@/Components/UserSidebar";
import { fetcherAuth, updateConsult } from "@/pages/api/authApi";
import { IconButton, Select, Spinner, Table, Tbody, Thead } from "@chakra-ui/react";
import dayjs from "dayjs";
import Link from "next/link";
import { useState } from "react";
import { MdDelete, MdEdit, MdPostAdd, MdSearch, MdSearchOff, MdWarning } from "react-icons/md";
import { toast } from "react-toastify";
import useSWR, { useSWRConfig } from "swr"

export default function Consult() {
    const [keyword, setKeyword] = useState('');
    const [status, setStatus] = useState('');
    const [page, setPage] = useState(1);
    const { mutate: globalMutate } = useSWRConfig()

    const { data, isValidating, mutate }: any = useSWR(`/user/consult?response=api&keyword=${keyword || ''}&status=${status || ''}&page=${page}`, fetcherAuth)

    function toggleStatus(e: any, id: any) {
        let formData = new FormData()
        formData.append('status', e.target.value)
        formData.append('_method', 'PATCH')

        updateConsult(id, formData)
            .then((res: any) => {
                toast.success(res?.message)
                mutate()
                globalMutate('/user/consult?get=count')
            }).catch(err => {
                console.log(err)
            })
    }

    return (<>
        <Navbar />
        <UserSidebar />

        <div className="sm:ml-64 bg-[#f5f5f9] h-[100vh]">
            <div className="container p-8 mx-auto">
                <div className="relative border overflow-x-auto rounded bg-white">
                    <div className="flex px-4 border-b bg-white flex-column sm:flex-row flex-wrap space-y-4 sm:space-y-0 items-center justify-between py-4">
                        <div className="w-[100%]">
                            <div className="flex gap-4">
                                <label htmlFor="table-search" className="sr-only">
                                    Search
                                </label>

                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 rtl:inset-r-0 rtl:right-0 flex items-center ps-3 pointer-events-none">
                                        <MdSearch size={18} />
                                    </div>
                                    <input
                                        type="text"
                                        id="table-search"
                                        onKeyUp={(e: any) => setKeyword(e.target.value)}
                                        className="block p-2 text-[14px] ps-10 text-sm text-gray-900 border rounded w-50 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        placeholder="Search for query"
                                    />
                                </div>

                                <div className="self-start">
                                    <Select fontSize={14} height={'38px'} rounded={6} size={'sm'} onChange={(e) => setStatus(e.target.value)} placeholder="Filter Status">
                                        <option value="unread">Unread</option>
                                        <option value="read">Read</option>
                                    </Select>
                                </div>
                            </div>
                        </div>
                    </div>
                    <Table variant='striped' className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                        <Thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="px-6 py-3">
                                    Name
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Property
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Status
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Phone
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Message
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Created At
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Action
                                </th>
                            </tr>
                        </Thead>
                        <Tbody>
                            {
                                data?.data?.length == 0 && <tr>
                                    <td colSpan={7}>
                                        <div>
                                            <p className="font-[500] flex items-center gap-1 justify-center px-5 py-3 text-[15px]"><MdWarning /> No data Found!</p>
                                        </div>
                                    </td>
                                </tr>
                            }

                            {
                                !data ? <tr><td className="px-5 py-3 text-center" colSpan={7}> <Spinner /> </td></tr> :
                                    <>
                                        {
                                            data?.data?.map((res: any, key: number) => (
                                                <tr key={key} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                                    <td
                                                        scope="row"
                                                        className="px-6 py-3 font-medium"
                                                    >
                                                        {res.name}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <Link target="_blank" href={`/${res?.property?.slugable?.prefix}/${res?.property?.slugable?.key}`} className="text-blue-500">{res?.property?.name}</Link>
                                                    </td>

                                                    <td className="px-6 py-4">
                                                        {['sold', 'rented'].includes(res?.status) ?
                                                            <div className=" flex-start flex">
                                                                <div className="rounded px-1 text-[13px] text-center font-[500] capitalize border-red-500 border-[1px] bg-red-400 text-white">
                                                                    {res?.status?.replace('_', ' ')}
                                                                </div></div> :
                                                            <div className=" flex-start flex">
                                                                <div className="rounded px-2 text-[13px] text-center font-[500] capitalize bg-blue-400 border-blue-500 border-[1px] text-white">
                                                                    {res?.status?.replace('_', ' ')}
                                                                </div></div>}

                                                    </td>

                                                    <td className="px-6 py-4">
                                                        {res?.phone}
                                                    </td>

                                                    <td className="px-6 py-4 text-[13px]">
                                                        {res?.content}
                                                    </td>

                                                    <td className="px-6 py-4">
                                                        {dayjs(res?.created_at).format('MMM DD, YYYY')}
                                                    </td>

                                                    <td className="px-6 py-4">
                                                        <Select w={"100px"} background={"#fff"} onChange={(e) => toggleStatus(e, res.id)} placeholder="Change Status" size={"sm"}>
                                                            <option selected={res?.status == 'read'} value="read">Read</option>
                                                            <option selected={res?.status == 'unread'} value="unread">UnRead</option>
                                                        </Select>
                                                    </td>
                                                </tr>

                                            ))
                                        }
                                    </>
                            }
                        </Tbody>
                    </Table>

                    <nav aria-label="Page navigation example" className="flex">
                        <ul className="inline-flex -space-x-px text-sm  py-4 pr-4 ml-auto">
                            <li>
                                <button disabled={page != data?.last_page} onClick={() => { (page == data?.last_page) ? setPage(page - 1) : '' }} className="flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-500 bg-white border border-e-0 border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">Previous</button>
                            </li>

                            {
                                Array.from(Array(data?.last_page).keys()).map((res: any, key: number) => (
                                    <li key={key}>
                                        <a onClick={() => { setPage(key + 1) }} href="#" className={`${page == (key + 1) ? 'active' : ''} flex  items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white`}>{key + 1}</a>
                                    </li>
                                ))
                            }

                            <li>
                                <button disabled={page == data?.last_page} onClick={() => {
                                    if (page != data?.last_page)
                                        setPage(page + 1)
                                }}
                                    className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">Next</button>
                            </li>
                        </ul>
                    </nav>

                </div>
            </div>
        </div>
    </>)
}