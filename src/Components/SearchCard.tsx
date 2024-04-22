import Carousel from 'react-elastic-carousel'
import { Text } from "@chakra-ui/react";
import numDifferentiation, { storageUrl } from '@/Constant/helper';
import { FaLocationDot } from 'react-icons/fa6';
import { MdApartment, MdAreaChart, MdAttachMoney, MdBuild, MdChair, MdHouse, MdKey, MdList, MdListAlt, MdMoney, MdOutlineBathtub, MdOutlineKingBed, MdOutlineSquareFoot, MdPhone, MdRealEstateAgent, MdSquare, MdSquareFoot, MdTimeline } from 'react-icons/md';
import { BsArrowRight } from 'react-icons/bs';
import { IoMdEye } from 'react-icons/io';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function SearchCard({ res }: any) {
    // {numDifferentiation(res?.price)}
    const { query } = useRouter()

    return (
        <div className="rounded border mb-4 shadow-req" style={{ backgroundColor: 'white' }}>
            <div>
                <div id="carousel" className='search-card'>
                    <div className='relative data-card-image'>
                        <div className="z-[2] relative">
                            <div className="absolute bg-blue-500 text-white text-[13px] top-[8px] px-3 py-[4px] rounded-r-[8px]">
                                <Text>
                                    <span className="font-[600]">{query?.project === 'true' ? (res?.price_from ? ('Rs. ' + numDifferentiation(res?.price_from) + ' - ' + numDifferentiation(res?.price_to)) : 'Price On Call') : ('Rs.' + numDifferentiation(res?.price))}  </span>   <span className="text-[9px] font-[500] uppercase">{res?.type == 'rent' ? ('/ ' + res.period) : ''}</span>
                                </Text>
                            </div>
                        </div>

                        <div className='flex'>
                            <div className='w-[60%] relative'>
                                <Carousel initialActiveIndex={0}>
                                    {Object.values(res?.images)?.map((res: any, key: number) => (
                                        <div className="w-[100%]" key={key}>
                                            <img src={storageUrl + res} alt="" style={{ objectFit: 'contain', background: '#000', height: '13rem', width: '100%' }} />
                                        </div>

                                    ))}
                                </Carousel>
                            </div>

                            <div className='w-[40%] mbl-right'>
                                <div className='grid grid-cols-2'>
                                    <div className='flex items-center border-r pl-3 gap-3 border-b-[1px] h-[3.25rem] '>
                                        <div>
                                            <MdRealEstateAgent color='#0E578C' className='text-[#464646]' size={23} />
                                        </div>

                                        <div>
                                            <p className='text-[11px] text-gray-500 capitalize leading-4'>{query?.project === 'true' ? 'Sell' : (res?.type || 'None')}</p>
                                            <p className='text-[12px] font-[500] text-[#464646] leading-4'>Property For</p>
                                        </div>
                                    </div>
                                    <div className='flex items-center pl-3 gap-3 border-b-[1px] h-[3.25rem]'>
                                        <div>
                                            <MdChair color='#0E578C' className='text-[#464646]' size={23} />
                                        </div>

                                        <div>
                                            <p className='text-[11px] text-gray-500 leading-4'>{query?.project === 'true' ? '-' : ((res?.furnishing || 'None') + 'furnished')}</p>
                                            <p className='text-[12px] font-[500] text-[#464646] leading-4'>Furnishing</p>
                                        </div>
                                    </div>

                                    <div className='flex items-center pl-3 border-r gap-3 border-b-[1px] h-[3.25rem]'>
                                        <div>
                                            <MdApartment color='#0E578C' className='text-[#464646]' size={23} />
                                        </div>

                                        <div>
                                            <p className='text-[11px] text-gray-500 leading-4'>{(res?.property_type || 'None')}</p>
                                            <p className='text-[12px] font-[500] text-[#464646] leading-4'>BHK Count</p>
                                        </div>
                                    </div>

                                    <div className='flex items-center pl-3  gap-3 border-b-[1px] h-[3.25rem]'>
                                        <div>
                                            <MdKey color='#0E578C' className='text-[#464646]' size={23} />
                                        </div>

                                        <div>
                                            <p className='text-[11px] text-gray-500 leading-4'>{(res?.availability || 'None')}</p>
                                            <p className='text-[12px] font-[500] text-[#464646] leading-4'>Availability</p>
                                        </div>
                                    </div>

                                    <div className='flex items-center pl-3 border-r  gap-3 border-b-[1px] h-[3.25rem]'>
                                        <div>
                                            <MdListAlt color='#0E578C' className='text-[#464646]' size={23} />
                                        </div>

                                        <div>
                                            <p className='text-[11px] text-gray-500 leading-4'>{query?.project === 'true' ? 'Brand New' : (res?.condition)}</p>
                                            <p className='text-[12px] font-[500] text-[#464646] leading-4'>Condition</p>
                                        </div>
                                    </div>
                                    <div className='flex items-center pl-3  gap-3 border-b-[1px] h-[3.25rem]'>
                                        <div>
                                            <MdAttachMoney color='#0E578C' className='text-[#464646]' size={23} />
                                        </div>

                                        <div>
                                            <p className='text-[11px] text-gray-500 leading-4'>{query?.project === 'true' ? 'Yes' : (res?.negotiable)}</p>
                                            <p className='text-[12px] font-[500] text-[#464646] leading-4'>Negotiable</p>
                                        </div>
                                    </div>

                                    <div className='flex items-center pl-3 border-r  gap-3 border-b-[1px] h-[3.25rem]'>
                                        <div>
                                            <MdSquare color='#0E578C' className='text-[#464646]' size={23} />
                                        </div>

                                        <div>
                                            <div className='leading-[9px]'>
                                                <p className='text-[11px] text-gray-500'>{res?.ropani || 0}-{res?.aana || 0}-{res?.paisa || 0}-{res?.daam || 0}</p>
                                                {/* <p className='text-[6px]'>Ropani-Aana-Paisa-Daam</p> */}
                                            </div>
                                            <p className='text-[12px] font-[500] text-[#464646] leading-4'>Total Area</p>
                                        </div>
                                    </div>
                                    <div className='flex items-center pl-3  gap-3 border-b-[1px] h-[3.25rem]'>
                                        <div>
                                            <MdSquareFoot color='#0E578C' className='text-[#464646]' size={23} />
                                        </div>

                                        <div>
                                            <p className='text-[11px] text-gray-500 leading-4'>{query?.project === 'true' ? '-' : (res?.square) + ' ' + (res?.area_type)}</p>
                                            <p className='text-[12px] font-[500] text-[#464646] leading-4'>Build-up Area</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>


                        <div className="px-3 flex">
                            <div>
                                <Text fontSize={15} className="text-[#464646] text-[16px] leading-5 font-[600] my-auto" lineHeight={"12px"}>
                                    {res?.name}
                                </Text>

                                <div className="flex items-center gap-1 mt-1">
                                    <FaLocationDot className="mb-[1px] text-blue-500" size={10} />
                                    <Text noOfLines={1} className="text-[#4B5564] text-[13px] text-blue-500 font-[400]">{res?.location}, {res?.city?.name}</Text>
                                </div>
                            </div>
                            <div className="my-auto ml-auto flex gap-2">
                                {res?.author?.phone && <Link href={`tel:+977${res?.author?.phone}`}>
                                    <button className="btn bg-[#009587] h-[100%] px-2 rounded-[6px] flex items-center gap-1 font-[500] text-[13px]">
                                        <MdPhone />
                                        Call
                                    </button>
                                </Link>}

                                <Link href={`/${res?.slugable?.prefix}/${res?.slugable?.key}`}>
                                    <button className="btn btn-primary flex items-center gap-2 font-[500] text-[13px]">
                                        Detail
                                        <BsArrowRight />
                                    </button>
                                </Link>
                            </div>

                        </div>
                        <hr className="mt-2" />

                        <div className="flex px-3 h-[35px] items-center">
                            <div className='flex justify-between w-[100%]'>
                                {
                                    query?.project === 'true' ?
                                        <div className="flex gap-4">
                                            <div className="flex items-center gap-1" title="bedroom">
                                                <MdSquare size={19} className="mb-[1px] mt-[1px]" />
                                                <p className='text-[12px]'>Blocks:</p>
                                                <p className="text-[13px]">{res?.number_block}</p>
                                            </div>

                                            <div className="flex items-center gap-1" title="bathroom">
                                                <MdApartment className="mb-[1px]" />
                                                <p className='text-[12px]'>Flats:</p>
                                                <p className="text-[13px]">{res?.number_flat}</p>
                                            </div>

                                            <div className="flex items-center gap-1" title="bathroom">
                                                <MdHouse className="mb-[1px]" />
                                                <p className='text-[12px]'>Floors:</p>
                                                <p className="text-[13px]">{res?.number_floor}</p>
                                            </div>
                                        </div>
                                        : <div className="flex gap-4">
                                            <div className="flex items-center gap-1" title="bedroom">
                                                <MdOutlineKingBed size={19} className="mb-[1px] mt-[1px]" />
                                                <p className='text-[12px]'>Bedroom:</p>
                                                <p className="text-[13px]">{res?.number_bedroom}</p>
                                            </div>

                                            <div className="flex items-center gap-1" title="bathroom">
                                                <MdOutlineBathtub className="mb-[1px]" />
                                                <p className='text-[12px]'>Bathroom:</p>
                                                <p className="text-[13px]">{res?.number_bathroom}</p>
                                            </div>
                                        </div>

                                }

                                <div className="flex gap-1 flex-grow">
                                    <div className="ml-auto my-auto">
                                        <IoMdEye opacity={0.8} />
                                    </div>
                                    <Text className="my-auto font-[400] text-gray-500" fontSize={10} lineHeight={"12px"}> {res?.views} views</Text>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div >
    )
}