import { storageUrl } from "@/Constant/helper";
import { Avatar, Image, Text } from "@chakra-ui/react";
import Link from "next/link";
import { MdEmail, MdHome, MdPhone } from "react-icons/md";

export default function AgencyCard({ res, className, isProperty = false, wrapperClass = '', hideType = false, isAgentPage = false }: any) {
    return (
        <Link href={`/agency/${res?.id}`}>
            <div className={`${!isProperty ? 'p-3' : ''} property-card ${wrapperClass ? wrapperClass : ''}`}>
                <div className={`relative bg-white h-[100%] ${isProperty ? 'shadow-sm' : ''}  h-[100%] rounded-[12px] overflow-hidden ` + (className ? className : '')}>
                    <div className="relative overflow-hidden">
                        {res?.avatar?.url ? <Image alt={res.company} src={storageUrl + res?.avatar?.url} fit={"cover"} background={"#000"} width={"100%"} height={"200px"} objectFit={"contain"} /> :
                            <Avatar roundedBottom={0} roundedTop={12} w="100%" h={"180px"} name={res?.first_name + ' ' + res?.last_name} />}
                        <div className="flex gap-2 absolute bottom-0 mx-3 mb-3">
                            <div className="bg-blue-500 text-white text-[13px] px-2 py-[1px] rounded-[10px] agency-p">
                                #{res.company}
                            </div>
                        </div>

                    </div>

                    <div className={`px-5 pb-5 pt-4 h-[155px] grid`}>

                        <div>
                            <div className="mt-[2px] w-[100%]">
                                <Text noOfLines={2} className="text-[#464646] text-[16px] leading-5 font-[600]">{res?.first_name} {res?.last_name}</Text>
                            </div>

                            {/* <div className="flex items-center gap-1 mt-1">
                                <FaLocationDot className="mb-[1px] text-blue-500 w-[15px]" size={10} />
                                <Text noOfLines={1} className="text-[#4B5564] text-[13px] text-blue-500 font-[400]">{res.location}</Text>
                            </div> */}

                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 w-[100%] mt-3">
                                <div>
                                    <a className="leading-[15px] text-blue-500 text-[13px] flex gap-1 items-center" href={`tel:${res?.phone}`}><MdPhone /> {res?.phone}</a>
                                </div>
                                <div>
                                    <a className="leading-[15px] text-blue-500 text-[13px] flex gap-1 items-center" href={`tel:${res?.phone}`}><MdEmail /> {res?.email}</a>
                                </div>
                            </div>
                        </div>
                        <div className="pt-1 mt-auto gap-3 items-center">
                            <div className="pt-3 flex gap-3 items-center border-t-[1px] border-[#e2e2e2]">
                                <div className="flex gap-1 items-center">
                                    <MdHome className="text-blue-500 mb-[2px]" />
                                    <p className="text-blue-500 leading-[17px] text-[12px] font-[500]">{res?.property_count} Properties</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    )
}