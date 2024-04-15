import numDifferentiation, { storageUrl } from "@/Constant/helper";
import { Image, Text } from "@chakra-ui/react";
import dayjs from "dayjs";
import Link from "next/link";
import { useRouter } from "next/router";
import { Fragment } from "react";
import { FaLocationDot } from "react-icons/fa6";
import { MdCameraAlt, MdOutlineBathtub, MdOutlineKingBed, MdOutlineSquareFoot } from "react-icons/md";

export default function PropertyCard({ isMobile = false, res, className, isProperty = false, wrapperClass = '', hideType = false, isAgentPage = false, isHf = false }: any) {
    const { query } = useRouter()

    return (
        <Link href={`/${res?.slugable?.prefix}/${res?.slugable?.key}`}>
            <div className={`${!isProperty ? 'p-3' : ''} property-card ${wrapperClass ? wrapperClass : ''}`}>
                <div className={`relative bg-white h-[100%] ${isProperty ? 'shadow-sm' : ''}  h-[100%] rounded-[12px] overflow-hidden ` + (className ? className : '')}>
                    <div className="relative overflow-hidden">
                        {isMobile && <div className="absolute z-[2] top-2 left-2 flex items-center text-white gap-1">
                            <MdCameraAlt />
                            <p className="text-[13px] my-auto">
                                {Object.values(res?.images || {})?.length}
                            </p>
                        </div>}
                        <Image src={res?.images_full_url} fit={"cover"} width={"100%"} height={"200px"} objectFit={"cover"} />

                        <div className="flex gap-2 absolute bottom-0 mx-3 mb-3">
                            {isProperty && <div className="bg-blue-500 text-white text-[13px] px-2 py-[1px] rounded-[10px]">
                                {
                                    (query.project == 'true') ?
                                        <>
                                            <span className="font-[600]">{res?.price_from ? ('Rs. ' + numDifferentiation(res?.price_from) + ' - ' + numDifferentiation(res?.price_to)) : 'Price on call'} </span>
                                            <span className="text-[9px] font-[500] uppercase">{res?.type == 'rent' ? ('/ ' + res.period) : ''}</span>
                                        </>
                                        :
                                        <>
                                            <span className="font-[600]">Rs. {numDifferentiation(res?.price)}</span>
                                            <span className="text-[9px] font-[500] uppercase">{res?.type == 'rent' ? ('/ ' + res.period) : ''}</span>
                                        </>
                                }

                            </div>}
                            {(isProperty && !hideType && res?.type) && <div className="capitalize bg-teal-500 text-white text-[13px] px-2 py-[1px] rounded-[10px]">
                                {res?.type}
                            </div>}
                        </div>
                    </div>

                    <div className={`px-5 pb-5 pt-4 ${isHf ? '' : (isAgentPage ? 'h-[184px]' : isProperty ? 'h-[220px]' : 'h-[220px]')} grid`}>

                        <div className={`${isHf ? 'mb-2' : ''}`}>
                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 w-[100%]">
                                {<p className="text-[11px] font-[400]">{dayjs(res?.created_at).format('MMM DD, YYYY')}</p>}
                                {
                                    res?.categories?.map((res: any, key: number) => (
                                        <Fragment key={key}>
                                            <div className="bg-[#0E578C]/[0.1] px-2 py-[1px] rounded-[9px]">
                                                <p className="text-[#4b5563] text-[11px] font-[500]">{res?.name}</p>
                                            </div>
                                        </Fragment>
                                    ))
                                }

                            </div>

                            <div className="mt-[2px] w-[100%]">
                                <Text noOfLines={2} className="text-[#464646] text-[16px] leading-5 font-[600]">{res?.name}</Text>
                            </div>

                            <div className="flex items-center gap-1 mt-1">
                                <FaLocationDot className="mb-[1px] text-blue-500 w-[15px]" size={10} />
                                <Text noOfLines={1} className="text-[#4B5564] text-[13px] text-blue-500 font-[400]">{res.location}</Text>
                            </div>

                            {!isProperty && <div className="mb-auto mt-2  w-[100%]">
                                <Text className="text-[13px] text-gray-500" noOfLines={2}>{res?.description}</Text>
                            </div>}
                        </div>

                        <div className="pt-1 mt-auto gap-3 items-center">
                            {isProperty && (query.project != 'true') && <div className="mb-[5px] mt-auto flex gap-3 w-[100%]">
                                <div className="flex items-center gap-1" title="bedroom">
                                    <MdOutlineKingBed size={19} className="mb-[1px] mt-[1px]" />
                                    <p className="text-[13px]">{res?.number_bedroom}</p>
                                </div>

                                <div className="flex items-center gap-1" title="bathroom">
                                    <MdOutlineBathtub className="mb-[1px]" />
                                    <p className="text-[13px]">{res?.number_bathroom}</p>
                                </div>
                                {/* type */}
                                <div className="flex items-center gap-1" title="area">
                                    <MdOutlineSquareFoot className="mb-[1px]" />
                                    <p className="text-[13px]">{res?.square} {res?.area_type}</p>
                                </div>
                            </div>}

                            {!isAgentPage && <div className="pt-3 flex gap-3 items-center border-t-[1px] border-[#e2e2e2]">
                                {res?.author?.avatar?.url && <Image src={storageUrl + res?.author?.avatar?.url} alt="" objectFit={"contain"} className="rounded-full w-[38px] h-[38px] object-contain" />}
                                <div className="avz awo">
                                    <Text noOfLines={1} className="leading-[17px] font-[600]">
                                        <span className="text-[#464646] text-[14px]">{res?.investor?.name || (res?.author?.first_name + ' ' + res?.author?.last_name)}</span>
                                    </Text>
                                    <p className="text-blue-500 leading-[17px] underline text-[12px] font-[500]">{res?.investor?.projects_count || res?.author?.property_count} Properties</p>
                                </div>
                            </div>}
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    )
}