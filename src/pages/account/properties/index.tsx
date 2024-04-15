import Navbar from "@/Components/Navbar/Navbar";
import UserSidebar from "@/Components/UserSidebar";
import { deleteProperty, fetcherAuth } from "@/pages/api/authApi";
import { Button, ButtonGroup, IconButton, Popover, PopoverArrow, PopoverBody, PopoverCloseButton, PopoverContent, PopoverFooter, PopoverHeader, PopoverTrigger, Select, Spinner, Table, Tbody, Td, Thead, Tr, useDisclosure, useMediaQuery } from "@chakra-ui/react";
import dayjs from "dayjs";
import Link from "next/link";
import { useState } from "react";
import { MdDelete, MdEdit, MdPostAdd, MdSearch, MdWarning } from "react-icons/md";
import ReactPaginate from "react-paginate";
import { toast } from "react-toastify";
import useSWR from "swr"

export function Toggle({ id, mutate }: any) {
    const { isOpen, onToggle, onClose } = useDisclosure()
    const [deleting, setDeleting] = useState(false)

    function deleteProp() {
        setDeleting(true)
        deleteProperty(id)
            .then((res: any) => {
                mutate()
                onClose()
                setDeleting(false)
                toast.success(res?.message)
            }).catch(err => {
                setDeleting(false)
            })
    }

    return (
        <Popover
            returnFocusOnClose={false}
            isOpen={isOpen}
            onClose={onClose}
            placement='right'
            closeOnBlur={false}
        >
            <PopoverTrigger>
                <IconButton
                    size={'sm'}
                    className="ml-2"
                    colorScheme="red"
                    icon={<MdDelete />}
                    onClick={onToggle}
                    aria-label={"Edit"}
                />
            </PopoverTrigger>

            <PopoverContent>
                <PopoverHeader fontWeight='semibold'>Confirmation</PopoverHeader>
                <PopoverArrow />
                <PopoverCloseButton />
                <PopoverBody>
                    Are you sure you want to continue with your action?
                </PopoverBody>
                <PopoverFooter display='flex' justifyContent='flex-end'>
                    <ButtonGroup size='sm'>
                        <Button variant='outline' onClick={onToggle}>Cancel</Button>
                        <Button colorScheme='red' isLoading={deleting} loadingText="Deleting" onClick={deleteProp}>Confirm</Button>
                    </ButtonGroup>
                </PopoverFooter>
            </PopoverContent>
        </Popover>

    )
}

export default function UserProperties() {
    const [isMobile] = useMediaQuery(`(max-width: 808px)`);
    const [keyword, setKeyword] = useState('');
    const [status, setStatus] = useState('');
    const [page, setPage] = useState(1);

    const { data, mutate }: any = useSWR(`/user/properties?response=api&keyword=${keyword || ''}&status=${status || ''}&page=${page}`, fetcherAuth)

    return (<>
        <Navbar />
        <UserSidebar />

        <div className="sm:ml-64 bg-[#f5f5f9] h-[100vh] dashboard">
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
                                        placeholder="Search for property"
                                    />
                                </div>

                                <div className="self-start">
                                    <Select fontSize={14} height={'38px'} rounded={6} size={'sm'} onChange={(e) => setStatus(e.target.value)} placeholder="Filter Status">
                                        <option value="selling">Selling</option>
                                        <option value="sold">Sold</option>
                                        <option value="renting">Renting</option>
                                        <option value="rented">Rented</option>
                                        <option value="building">Building</option>
                                    </Select>
                                </div>

                                <Link className="ml-auto" href={'/account/properties/create'}>
                                    <button className="btn-primary text-[14px]">
                                        <span className=" flex items-center gap-1 px-1">
                                            <MdPostAdd size={17} /> Create
                                        </span>
                                    </button>
                                </Link>
                            </div>
                        </div>
                    </div>
                    <Table variant='striped' className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                        <Thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="px-6 py-3">
                                    Image
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Name
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Created At
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Status
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Moderator Status
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Views
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Action
                                </th>
                            </tr>
                        </Thead>
                        <Tbody>
                            {
                                (data && data?.data?.length == 0) && <tr>
                                    <td colSpan={7}>
                                        <div>
                                            <p className="font-[500] flex items-center gap-1 justify-center px-5 py-3 text-[15px]"><MdWarning /> No data Found!</p>
                                        </div>
                                    </td>
                                </tr>
                            }
                            {
                                !data ? <tr><td colSpan={7} className="px-5 py-3 text-center"> <Spinner /> </td></tr> :
                                    <>
                                        {
                                            data?.data?.map((res: any, key: number) => (
                                                <Tr key={key} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                                    <td className="px-4 py-4">
                                                        <img className="w-[60px] rounded" src={res.images_full_url} />
                                                    </td>
                                                    <td
                                                        scope="row"
                                                        className="px-6 py-3 font-medium"
                                                    >
                                                        <Link className="text-blue-500" target="_blank" href={`/${res?.slugable?.prefix}/${res?.slugable?.key}`}>{res.name}</Link>
                                                    </td>
                                                    <td className="px-6 py-4 text-nowrap">
                                                        {dayjs(res?.created_at).format('MMM DD, YYYY')}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        {['sold', 'rented'].includes(res?.status) ?
                                                            <div className="flex-start flex">
                                                                <div className="rounded text-nowrap px-1 text-[12px] text-center font-[500] capitalize border-red-500 border-[1px] bg-red-400 text-white">
                                                                    {res?.status?.replace('_', ' ')}
                                                                </div></div> :
                                                            <div className=" flex-start flex">
                                                                <div className="rounded text-nowrap px-2 text-[12px] text-center font-[500] capitalize bg-blue-400 border-blue-500 border-[1px] text-white">
                                                                    {res?.status?.replace('_', ' ')}
                                                                </div></div>}

                                                    </td>

                                                    <td className="px-6 py-4">
                                                        {['rejected'].includes(res?.moderation_status) ?
                                                            <div className="flex"><div className="rounded px-1 text-[12px] text-center font-[500] capitalize border-red-500 border-[1px] bg-red-400 text-white">
                                                                {res?.moderation_status}
                                                            </div></div> :
                                                            ['pending'].includes(res?.moderation_status) ?
                                                                <div className="flex">
                                                                    <div className="rounded px-1 text-[12px] text-center font-[500] capitalize bg-yellow-400 border-yellow-500 border-[1px] text-white">
                                                                        {res?.moderation_status}
                                                                    </div>
                                                                </div>
                                                                : <div className="flex">
                                                                    <div className="rounded px-1 text-[12px] text-center font-[500] capitalize bg-green-400 border-green-500 border-[1px] text-white">
                                                                        {res?.moderation_status}
                                                                    </div>
                                                                </div>
                                                        }

                                                    </td>
                                                    <td className="px-6 font-[500]">
                                                        {res?.views}
                                                    </td>

                                                    <Td className="px-6">
                                                        <div className="flex items-center">
                                                            <Link href={`/account/properties/edit/${res?.id}`}>
                                                                <IconButton
                                                                    size={'sm'}
                                                                    colorScheme="blue"
                                                                    icon={<MdEdit />}
                                                                    aria-label={"Edit"}
                                                                />
                                                            </Link>


                                                            <Toggle id={res?.id} mutate={mutate} />
                                                        </div>
                                                    </Td>
                                                </Tr>

                                            ))
                                        }
                                    </>
                            }
                        </Tbody>
                    </Table>

                    {data?.data?.length > 0 && <div className="flex px-3"><ReactPaginate
                        breakLabel="..."
                        nextLabel="Next >"
                        initialPage={page - 1}
                        activeLinkClassName="active"
                        onPageChange={(e: any) => setPage(e.selected + 1)}
                        pageRangeDisplayed={5}
                        pageCount={data?.last_page}
                        previousLabel="< Previous"
                        className="flex ml-auto py-3"
                        previousClassName={"h-9 border border-e-0 border-gray-300 overflow-hidden rounded-s-lg"}
                        nextClassName={"h-9 border border-s-0 border-gray-300 overflow-hidden rounded-e-lg"}
                        nextLinkClassName="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white rounded-e-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                        previousLinkClassName="flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-500 bg-white hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                        pageLinkClassName={`flex items-center justify-center px-3 h-9 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white`}
                        renderOnZeroPageCount={null}
                    /></div>}

                </div>
            </div>
        </div>
    </>)
}