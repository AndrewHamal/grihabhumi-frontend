import Footer from "@/Components/Footer/Footer"
import Navbar from "@/Components/Navbar/Navbar"
import { apiURL, storageUrl } from "@/Constant/helper"
import { Avatar, Breadcrumb, BreadcrumbItem, BreadcrumbLink, Input, InputGroup, InputLeftElement, Select, Tooltip } from "@chakra-ui/react"
import Link from "next/link"
import useSWR from "swr"
import { MdSearch, MdSearchOff } from "react-icons/md"
import { fetcher } from "../api/api"
import { Fragment, useState } from "react"
import AgencyCard from "@/Components/AgencyCard"
import { debounce } from "lodash"
import SkeletonPro from "@/Components/SkeletonPro"

export default function Agencies() {
    const [page, setPage] = useState(1)
    const [keyword, setKeyword] = useState('')

    const { data, isValidating } = useSWR(`/agencies?page=${page}&keyword=${keyword}`, fetcher)

    function handleSearch(e: any) {
        setKeyword(e.target.value)
        setPage(1)
    }
    return (
        <>
            <Navbar />
            <div className="services-list">
                <Breadcrumb overflowX={"auto"} className="flex-wrap border-t border-gray-300" spacing='10px' separator={<div className="w-[11px] h-[11px] bg-no-repeat bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNyIgaGVpZ2h0PSIxMSIgdmlld0JveD0iMCAwIDcgMTEiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNMC42NDY0NDcgMC4xNDY0NDdDMC44NDE3MDkgLTAuMDQ4ODE1NSAxLjE1ODI5IC0wLjA0ODgxNTUgMS4zNTM1NSAwLjE0NjQ0N0w2LjM1MzU1IDUuMTQ2NDVDNi41NDg4MiA1LjM0MTcxIDYuNTQ4ODIgNS42NTgyOSA2LjM1MzU1IDUuODUzNTVMMS4zNTM1NSAxMC44NTM2QzEuMTU4MjkgMTEuMDQ4OCAwLjg0MTcwOSAxMS4wNDg4IDAuNjQ2NDQ3IDEwLjg1MzZDMC40NTExODQgMTAuNjU4MyAwLjQ1MTE4NCAxMC4zNDE3IDAuNjQ2NDQ3IDEwLjE0NjRMNS4yOTI4OSA1LjVMMC42NDY0NDcgMC44NTM1NTNDMC40NTExODQgMC42NTgyOTEgMC40NTExODQgMC4zNDE3MDkgMC42NDY0NDcgMC4xNDY0NDdaIiBmaWxsPSIjNjc3RDk1Ii8+Cjwvc3ZnPgo=')]" />}>
                    <BreadcrumbItem>
                        <Link className="font-[500] text-[#394e66]" href='/'>
                            Home
                        </Link>
                    </BreadcrumbItem>

                    <BreadcrumbItem isCurrentPage>
                        <Link className="font-[500] text-[#394e66]" href='/agencies'>
                            agencies
                        </Link>
                    </BreadcrumbItem>
                </Breadcrumb>

                <div className="relative border-b">
                    <img src="/assets/bg.png" className=" h-[250px] w-[100%] object-cover" alt="" />
                    <div className="absolute top-0 left-0 right-0 bottom-0 items-center flex justify-center">
                        <div className="w-[100%]">
                            <h5 className="mx-auto justify-center mb-8 font-[600] text-gray-700 text-[22px] flex gap-1 items-center">List of agencies & agents
                            </h5>

                            <InputGroup w={"30%"} className='mt-2 mx-auto border rounded'>
                                <InputLeftElement pointerEvents='none'>
                                    <MdSearch size={23} className='text-gray-400 mt-[6px]' />
                                </InputLeftElement>
                                <Input onKeyUp={debounce(handleSearch, 500)} className="px-4" height={"45px"} border={0} _placeholder={{ color: "#d1d5db" }} type='email' size={'md'} background={"#fff"} name='email' placeholder='Search By Name' />
                            </InputGroup>
                        </div>
                    </div>
                </div>

                <div className="bg-gradient">
                    <div className="container mx-auto py-11 px-4">
                        <div>
                            <div className="grid grid-cols-4 gap-5">
                                {
                                    isValidating ? <>
                                        <SkeletonPro width="100%" />
                                        <SkeletonPro width="100%" />
                                        <SkeletonPro width="100%" />
                                        <SkeletonPro width="100%" />
                                    </> : data?.data?.data?.map((res: any, key: number) => (
                                        <Fragment key={key}>
                                            <AgencyCard
                                                isAgentPage={true}
                                                isProperty={true}
                                                res={res}
                                            />
                                        </Fragment>
                                    ))
                                }
                                {
                                    (data && data?.data?.data?.length === 0) &&
                                    <>
                                        <div className="bg-white rounded-[9px] px-5 py-7 text-center">
                                            <div className="flex justify-center mb-2">
                                                <MdSearchOff size={40} color="gray" />
                                            </div>
                                            <p className="font-[600] text-[15px]"> No agents or agencies Found</p>
                                            <p className="font-[400] text-[14px] text-gray-500">Try searching with other keywords.</p>
                                        </div>
                                    </>
                                }
                            </div>

                            {data?.data?.last_page > 1 && <nav aria-label="Page navigation example" className="flex">
                                <ul className="inline-flex -space-x-px text-sm overflow-x-scroll py-4 pr-4">
                                    <li>
                                        <button disabled={page != data?.data?.last_page} onClick={() => { (page == data?.data?.last_page) ? setPage(page - 1) : '' }} className="flex items-center justify-center px-3 h-9 ms-0 leading-tight text-gray-500 bg-white border border-e-0 border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">Previous</button>
                                    </li>

                                    {
                                        Array.from(Array(data?.data?.last_page).keys()).map((res: any, key: number) => (
                                            <li key={key}>
                                                <a onClick={() => { setPage(key + 1) }} href="#" className={`${page == (key + 1) ? 'active' : ''} flex  items-center justify-center px-3 h-9 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white`}>{key + 1}</a>
                                            </li>
                                        ))
                                    }

                                    <li>
                                        <button disabled={page == data?.data?.last_page} onClick={() => {
                                            if (page != data?.data?.last_page)
                                                setPage(page + 1)
                                        }}
                                            className="flex items-center justify-center px-3 h-9 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">Next</button>
                                    </li>
                                </ul>
                            </nav>}
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    )
}