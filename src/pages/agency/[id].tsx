import Footer from "@/Components/Footer/Footer"
import Navbar from "@/Components/Navbar/Navbar"
import { apiURL, storageUrl } from "@/Constant/helper"
import { Avatar, Breadcrumb, BreadcrumbItem, BreadcrumbLink, Tooltip } from "@chakra-ui/react"
import axios from "axios"
import dayjs from "dayjs"
import Link from "next/link"
import useSWR from "swr"
import { MdArrowForward, MdCalendarMonth, MdEmail, MdPhone, MdWarning } from "react-icons/md"
import { fetcher } from "../api/api"
import { useRouter } from "next/router"
import { Fragment, useState } from "react"
import PropertyCard from "@/Components/PropertyCard"

export default function Agency({ data }: any) {
    const { query } = useRouter()
    const [page, setPage] = useState(1)

    const { data: agencies } = useSWR(query?.id ? `/agencies/${query?.id}?type=property&page=${page}` : null, fetcher)

    return (
        <>
            <Navbar />
            <Breadcrumb overflowX={"auto"} className="flex-wrap border-t border-gray-300" spacing='10px' separator={<div className="w-[11px] h-[11px] bg-no-repeat bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNyIgaGVpZ2h0PSIxMSIgdmlld0JveD0iMCAwIDcgMTEiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNMC42NDY0NDcgMC4xNDY0NDdDMC44NDE3MDkgLTAuMDQ4ODE1NSAxLjE1ODI5IC0wLjA0ODgxNTUgMS4zNTM1NSAwLjE0NjQ0N0w2LjM1MzU1IDUuMTQ2NDVDNi41NDg4MiA1LjM0MTcxIDYuNTQ4ODIgNS42NTgyOSA2LjM1MzU1IDUuODUzNTVMMS4zNTM1NSAxMC44NTM2QzEuMTU4MjkgMTEuMDQ4OCAwLjg0MTcwOSAxMS4wNDg4IDAuNjQ2NDQ3IDEwLjg1MzZDMC40NTExODQgMTAuNjU4MyAwLjQ1MTE4NCAxMC4zNDE3IDAuNjQ2NDQ3IDEwLjE0NjRMNS4yOTI4OSA1LjVMMC42NDY0NDcgMC44NTM1NTNDMC40NTExODQgMC42NTgyOTEgMC40NTExODQgMC4zNDE3MDkgMC42NDY0NDcgMC4xNDY0NDdaIiBmaWxsPSIjNjc3RDk1Ii8+Cjwvc3ZnPgo=')]" />}>
                <BreadcrumbItem>
                    <Link className="font-[500] text-[#394e66]" href='/'>
                        Home
                    </Link>
                </BreadcrumbItem>

                <BreadcrumbItem>
                    <Link className="font-[500] text-[#394e66]" href='/agencies'>
                        agencies
                    </Link>
                </BreadcrumbItem>

                <BreadcrumbItem isCurrentPage>
                    <BreadcrumbLink className="font-[500]">{data?.company}</BreadcrumbLink>
                </BreadcrumbItem>
            </Breadcrumb>

            <div className="bg-gradient border-t">
                <div className="container px-4 mx-auto py-11 ">
                    <div className="flex items-center gap-3">
                        <Avatar src={storageUrl + data?.avatar?.url} size={"xl"} objectFit={"contain"} name={data?.first_name + ' ' + data?.last_name} />

                        <div>
                            <p className="font-[500] mb-1 text-xl">{data?.first_name} {data?.last_name}</p>
                            <div>
                                <a className="text-blue-500 text-[13px] flex gap-1 items-center" href={`tel:${data?.phone}`}><MdPhone /> {data?.phone}</a>
                            </div>
                            <div>
                                <a className="text-blue-500 text-[13px] flex gap-1 items-center" href={`tel:${data?.phone}`}><MdEmail /> {data?.email}</a>
                            </div>
                        </div>


                    </div>
                    <hr className="my-6" />

                    <div>
                        <div className="flex flex-wrap gap-3 mb-4">
                            <Tooltip label="Company">
                                <div className="bg-[#0E578C]/[0.2] px-3 py-[2px] rounded-[12px] text-[13px]">
                                    <p className="capitalize">#{data?.company}</p>
                                </div>
                            </Tooltip>

                            <Tooltip label="Joined On">
                                <div className="bg-[#0E578C]/[0.2] px-3 py-[2px] rounded-[12px] text-[13px]">
                                    <p className="capitalize gap-1 flex items-center"><MdCalendarMonth /> {dayjs(data?.created_at)?.format('MMM DD, YYYY')}</p>
                                </div>
                            </Tooltip>

                            <Tooltip label="Property Count">
                                <div className="bg-[#0E578C]/[0.2] px-3 py-[2px] rounded-[12px] text-[13px]">
                                    <p className="capitalize gap-1 flex items-center">Properties: {data?.property_count}</p>
                                </div>
                            </Tooltip>
                        </div>

                        {data?.description}
                    </div>

                    <div className="mt-11">
                        <h5 className="mb-5 font-[500] text-[#696cff] text-[16px] flex gap-1 items-center">Properties From this agent
                            <MdArrowForward />
                        </h5>
                        <div className="grid grid-cols-4 gap-5">
                            {
                                agencies?.data?.data?.map((res: any, key: number) => (
                                    <Fragment key={key}>
                                        <PropertyCard
                                            isAgentPage={true}
                                            isProperty={true}
                                            res={res}
                                        />
                                    </Fragment>
                                ))
                            }
                        </div>

                        {
                            agencies?.data?.data?.length == 0 && <p className="font-[500] bg-white px-5 rounded-[8px] flex items-center gap-1 py-3 text-[15px]"><MdWarning /> No Properties Found!</p>
                        }

                        {agencies?.data?.last_page > 1 && <nav aria-label="Page navigation example" className="flex">
                            <ul className="inline-flex -space-x-px text-sm overflow-x-scroll py-4 pr-4">
                                <li>
                                    <button disabled={page != agencies?.data?.last_page} onClick={() => { (page == agencies?.data?.last_page) ? setPage(page - 1) : '' }} className="flex items-center justify-center px-3 h-9 ms-0 leading-tight text-gray-500 bg-white border border-e-0 border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">Previous</button>
                                </li>

                                {
                                    Array.from(Array(agencies?.data?.last_page).keys()).map((res: any, key: number) => (
                                        <li key={key}>
                                            <a onClick={() => { setPage(key + 1) }} href="#" className={`${page == (key + 1) ? 'active' : ''} flex  items-center justify-center px-3 h-9 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white`}>{key + 1}</a>
                                        </li>
                                    ))
                                }

                                <li>
                                    <button disabled={page == agencies?.data?.last_page} onClick={() => {
                                        if (page != agencies?.data?.last_page)
                                            setPage(page + 1)
                                    }}
                                        className="flex items-center justify-center px-3 h-9 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">Next</button>
                                </li>
                            </ul>
                        </nav>}
                    </div>

                </div>
            </div>
            <Footer />
        </>
    )
}


export async function getServerSideProps({ req, res, params }: any) {
    const agencies: any = await axios.get(apiURL + `agencies/${params?.id}`)

    return {
        props: {
            data: JSON.parse(JSON.stringify(agencies?.data))
        }
    }
}