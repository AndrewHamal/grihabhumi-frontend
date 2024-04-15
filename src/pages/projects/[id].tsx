import Navbar from "@/Components/Navbar/Navbar";
import numDifferentiation, { apiURL, storageUrl } from "@/Constant/helper";
import useSWR from 'swr'
import { fetcher } from "../api/api";
import { useParams, usePathname } from "next/navigation";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import { Fragment, useEffect, useRef, useState } from "react";
import ImageGallery from "react-image-gallery";
import { MdApartment, MdBathroom, MdBed, MdBedroomBaby, MdBedtime, MdBuild, MdBungalow, MdCalendarMonth, MdCalendarToday, MdCalendarViewMonth, MdCategory, MdCellTower, MdCheckBox, MdEmail, MdHome, MdHouse, MdKey, MdPanoramaFishEye, MdPhone, MdRealEstateAgent, MdRemoveRedEye, MdRoofing, MdSquare, MdSquareFoot } from "react-icons/md";
import { FaLocationDot } from "react-icons/fa6";
import dayjs from "dayjs";
import { Avatar, Breadcrumb, BreadcrumbItem, BreadcrumbLink, Tab, TabIndicator, TabList, Table, TableContainer, Tabs, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
import PropertyCard from "@/Components/PropertyCard";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Link from "next/link";
import Footer from "@/Components/Footer/Footer";
import Consult from "@/Components/Consult";
import Head from "next/head";
import axios from "axios";

export default function Property({ prop }: any) {
    const params = useParams()
    let slickRef: any = useRef()
    const settings = {
        dots: true,
        infinite: false,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 4,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 3,
                }
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2,
                }
            },
            {
                breakpoint: 575,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                }
            }
        ]
    };

    const [isClient, setIsClient] = useState(false)

    useEffect(() => {
        setIsClient(true)
    }, [])

    if (!isClient) return ''

    return (
        <div className="pb-11 property-page">
            <Head>
                <title>{prop?.name}</title>
                <meta property="og:title" content={prop?.name} />
                <meta property="og:type" content="video.movie" />
                <meta property="og:url" content={`/properties/${prop?.slugable?.key}`} />
                <meta property="og:description" content={prop?.description} />
                <meta property="og:image" content={storageUrl + Object.values(prop?.images || {})?.[0]} />
            </Head>

            <Navbar />
            <Breadcrumb className="border-t border-gray-300" spacing='10px' separator={<div className="w-[11px] h-[11px] bg-no-repeat bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNyIgaGVpZ2h0PSIxMSIgdmlld0JveD0iMCAwIDcgMTEiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNMC42NDY0NDcgMC4xNDY0NDdDMC44NDE3MDkgLTAuMDQ4ODE1NSAxLjE1ODI5IC0wLjA0ODgxNTUgMS4zNTM1NSAwLjE0NjQ0N0w2LjM1MzU1IDUuMTQ2NDVDNi41NDg4MiA1LjM0MTcxIDYuNTQ4ODIgNS42NTgyOSA2LjM1MzU1IDUuODUzNTVMMS4zNTM1NSAxMC44NTM2QzEuMTU4MjkgMTEuMDQ4OCAwLjg0MTcwOSAxMS4wNDg4IDAuNjQ2NDQ3IDEwLjg1MzZDMC40NTExODQgMTAuNjU4MyAwLjQ1MTE4NCAxMC4zNDE3IDAuNjQ2NDQ3IDEwLjE0NjRMNS4yOTI4OSA1LjVMMC42NDY0NDcgMC44NTM1NTNDMC40NTExODQgMC42NTgyOTEgMC40NTExODQgMC4zNDE3MDkgMC42NDY0NDcgMC4xNDY0NDdaIiBmaWxsPSIjNjc3RDk1Ii8+Cjwvc3ZnPgo=')]" />}>
                <BreadcrumbItem>
                    <Link className="font-[500] text-[#394e66]" href='/'>
                        Home
                    </Link>
                </BreadcrumbItem>

                <BreadcrumbItem>
                    <Link className="font-[500] text-[#394e66]" href='/search'>
                        Projects
                    </Link>
                </BreadcrumbItem>

                <BreadcrumbItem isCurrentPage>
                    <BreadcrumbLink className="font-[500]" href=''>{prop?.name}</BreadcrumbLink>
                </BreadcrumbItem>
            </Breadcrumb>

            <ImageGallery
                thumbnailPosition={'right'}
                showFullscreenButton={false}
                slideOnThumbnailOver={false}
                showPlayButton={false}
                items={Object.values(prop?.images || {})?.map(res => ({ originalClass: 'property-image', original: (storageUrl + res), thumbnail: (storageUrl + res) }))}
            />
            <div id="overview"></div>

            <div className="bg-[#f7f7f7] sticky top-0 z-[99]">
                <div className="md:container mx-auto">
                    <Tabs position="relative" overflowX={'scroll'} overflowY={'hidden'} variant="unstyled">
                        <TabList>
                            <Link href={'#overview'}>
                                <Tab fontSize={13} _active={{ color: "red" }} className="text-[10px]">Overview</Tab>
                            </Link>
                            <Link href={'#description'}>
                                <Tab fontSize={13} >Description</Tab>
                            </Link>
                            <Link href={'#includes'}>
                                <Tab fontSize={13} w={150}>Property Includes</Tab>
                            </Link>
                            {prop?.facilities?.length > 0 && <Link href={'#nearby'}>
                                <Tab fontSize={13} w={150} >Nearby Facilities </Tab>
                            </Link>}
                            {prop?.property?.length > 0 && <Link href={'#price'}>
                                <Tab w={140} fontSize={13} > Units & Price </Tab>
                            </Link>}
                            {prop?.plan_image != '' && <Link href={'#master_plan'}>
                                <Tab fontSize={13} w={140}> Master Plan </Tab>
                            </Link>}
                            {JSON.parse(prop?.payment_structure)?.length > 0 && <Link href={'#payment'}>
                                <Tab fontSize={13} w={170}> Payment Structure </Tab>
                            </Link>}
                            <Link href={'#maps'}>
                                <Tab fontSize={13} >Maps</Tab>
                            </Link>
                        </TabList>
                        <TabIndicator
                            mt="-1.5px"
                            height="2px"
                            bg="blue.500"
                            borderRadius="1px"
                        />
                    </Tabs>
                </div>
            </div>


            <div className="md:container mx-auto mt-6 property-container">
                <div className="flex gap-[70px]">
                    <div className="w-[72%]">
                        <div className="">
                            <div className="grid grid-cols-4 border-b pb-6 gap-11">
                                <div className="py-[2px] text-left rounded-[12px] text-[13px]">
                                    <p className="capitalize font-[500] text-gray-600">Area Covered</p>
                                    <p className="text-[17px] font-[500] text-gray-700">{prop?.ropani || 0}-{prop?.aana || 0}-{prop?.paisa || 0}-{prop?.daam || 0} </p>
                                    <p className="text-[10px]">Ropani-Aana-Paisa-Daam</p>
                                </div>

                                <div className="py-[2px] text-left rounded-[12px] text-[13px]">
                                    <p className="capitalize font-[500] text-gray-600">Total Units</p>
                                    <p className="text-[17px] font-[500] text-gray-700">{prop?.property.length} </p>
                                </div>

                                <div className="py-[2px] text-left rounded-[12px] text-[13px]">
                                    <p className="capitalize font-[500] text-gray-600">Available Units</p>
                                    <p className="text-[17px] font-[500] text-gray-700">{prop?.property.filter((res: any) => !['sold', 'rented', 'not_available'].includes(res.status)).length} </p>
                                </div>

                                <div className="py-[2px] text-left rounded-[12px] text-[13px]">
                                    <p className="capitalize font-[500] text-gray-600">Project Status</p>
                                    <p className="text-[17px] font-[500] text-gray-700 capitalize">{prop?.status} </p>
                                </div>

                            </div>
                            {/* 
                            {
                                prop?.categories?.length > 0 && prop?.categories?.map((res: any, key: number) => (
                                    <Fragment key={key}>
                                        <div className="bg-teal-300 px-3 py-[2px] rounded-[12px] text-[13px]">
                                            <p className="capitalize">{res?.name}</p>
                                        </div>
                                    </Fragment>
                                ))
                            } */}



                            {/* <div className="ml-auto">
                                <p className="text-gray-500 text-[14px]">Posted On: <span className="font-[500]"> {dayjs(prop?.created_at).format('MMM DD, YYYY')}</span></p>
                            </div> */}
                            {/* <div>
                                <p className="text-red-500 text-[14px]">Expired On: <span className="font-[500]">  {prop?.never_expired ? 'Never Expires' : dayjs(prop?.expire_date).format('MMM DD, YYYY')} </span></p>
                            </div> */}
                        </div>

                        <div className="flex justify-between items-center pt-5">
                            <h2 className="text-3xl font-[600] text-[#171717]">{prop?.name}</h2>
                            <p className="text-[18px] text-blue-500 font-[500] w-[290px] text-right">{!prop?.price_from ? 'Price on call' : `Rs. ${numDifferentiation(prop?.price_from)} - ${numDifferentiation(prop?.price_to)}`} </p>
                        </div>

                        <div className="flex items-center mt-1 gap-1">
                            <FaLocationDot className="text-blue-500" size={14} />
                            <p className="text-gray-500">{prop?.location}</p>
                        </div>

                        <div className="mt-4 grid grid-cols-4 gap-4">
                            {prop?.date_sell && <div className='flex border rounded-[6px] p-4 items-center py-4 gap-3'>
                                <div>
                                    <MdCalendarToday color='#0E578C' className='text-[#464646]' size={33} />
                                </div>

                                <div>
                                    <p className='text-[14px] font-[600] text-[#464646] leading-4'>{dayjs(prop?.date_sell).format('MMM DD, YYYY')}</p>
                                    <p className='text-[13px] text-gray-500 capitalize leading-4'>Booking Opens at</p>
                                </div>
                            </div>}

                            {prop?.date_finish && <div className='flex border rounded-[6px] p-4 items-center py-4 gap-3'>
                                <div>
                                    <MdCalendarViewMonth color='#0E578C' className='text-[#464646]' size={33} />
                                </div>

                                <div>
                                    <p className='text-[14px] font-[600] text-[#464646] leading-4'>{dayjs(prop?.date_finish).format('MMM DD, YYYY')}</p>
                                    <p className='text-[13px] text-gray-500 capitalize leading-4'>Handover Date</p>
                                </div>
                            </div>}

                            {prop?.number_block && <div className='flex border rounded-[6px] p-4 items-center py-4 gap-3'>
                                <div>
                                    <MdSquare color='#0E578C' className='text-[#464646]' size={33} />
                                </div>

                                <div>
                                    <p className='text-[14px] font-[600] text-[#464646] leading-4'>{prop?.number_block}</p>
                                    <p className='text-[13px] text-gray-500 capitalize leading-4'>No. of Block</p>
                                </div>
                            </div>}

                            {prop?.number_floor && <div className='flex items-center border rounded-[6px] px-4 py-4 gap-3'>
                                <div>
                                    <MdRoofing color='#0E578C' className='text-[#464646]' size={33} />
                                </div>

                                <div>
                                    <p className='text-[14px] font-[600] text-[#464646] leading-4'>{prop?.number_floor}</p>
                                    <p className='text-[13px] text-gray-500 capitalize leading-4'>No. of Floor</p>
                                </div>
                            </div>}

                            {prop?.number_flat && <div className='flex border rounded-[6px] px-4 items-center py-4 gap-3'>
                                <div>
                                    <MdApartment color='#0E578C' className='text-[#464646]' size={33} />
                                </div>

                                <div>
                                    <p className='text-[14px] font-[600] text-[#464646] leading-4'>{prop?.number_flat}</p>
                                    <p className='text-[13px] text-gray-500 capitalize leading-4'>No. of Flat</p>
                                </div>
                            </div>}

                            {prop?.square && <div className='flex border rounded-[6px] px-4 items-center py-4 gap-3'>
                                <div>
                                    <MdSquareFoot color='#0E578C' className='text-[#464646]' size={33} />
                                </div>

                                <div>
                                    <p className='text-[14px] font-[600] text-[#464646] leading-4'>{prop?.square} {prop?.area_type}</p>
                                    <p className='text-[13px] text-gray-500 capitalize leading-4'>Area</p>
                                </div>
                            </div>}

                            {prop?.house_type && <div className='flex border rounded-[6px] px-4 items-center py-4 gap-3'>
                                <div>
                                    <MdBuild color='#0E578C' className='text-[#464646]' size={30} />
                                </div>

                                <div>
                                    <p className='text-[14px] font-[600] text-[#464646] leading-4'>{prop?.house_type}</p>
                                    <p className='text-[13px] text-gray-500 capitalize leading-4'>Property Type</p>
                                </div>
                            </div>}

                            {prop?.furnishing && <div className='flex border rounded-[6px] px-4 items-center py-4 gap-3'>
                                <div>
                                    <MdBedroomBaby color='#0E578C' className='text-[#464646]' size={33} />
                                </div>

                                <div>
                                    <p className='text-[14px] font-[600] text-[#464646] leading-4'>{prop?.furnishing} Furnished</p>
                                    <p className='text-[13px] text-gray-500 capitalize leading-4'>Furnishing</p>
                                </div>
                            </div>}

                            {prop?.property_type && <div className='border rounded-[6px] px-4 flex items-center py-4 gap-3'>
                                <div>
                                    <MdApartment color='#0E578C' className='text-[#464646]' size={33} />
                                </div>

                                <div>
                                    <p className='text-[14px] font-[600] text-[#464646] leading-4'>{prop?.property_type}</p>
                                    <p className='text-[13px] text-gray-500 capitalize leading-4'>BHK</p>
                                </div>
                            </div>}

                            {prop?.availability && <div className='border rounded-[6px] px-4 flex items-center py-4 gap-3'>
                                <div>
                                    <MdKey color='#0E578C' className='text-[#464646]' size={33} />
                                </div>

                                <div>
                                    <p className='text-[14px] font-[600] text-[#464646] leading-4'>{prop?.availability}</p>
                                    <p className='text-[13px] text-gray-500 capitalize leading-4'>Possession</p>
                                </div>
                            </div>}


                        </div>

                        {/* description  */}
                        <div id="description"></div>

                        <div className="mt-11 border py-6 px-7 rounded-[12px] desc" >
                            <h4 className="font-[500] text-[18px] text-gray-700">Description</h4>
                            <p className="text-gray-500 mt-2" dangerouslySetInnerHTML={{ __html: prop?.content }} />


                            {/* includes  */}
                            {prop?.features?.length > 0 &&
                                <>
                                    <div id="includes"></div>
                                    <h4 className="font-[500] text-[18px] text-gray-700 mt-11">Property Includes</h4>

                                    <div className="grid grid-cols-5 gap-3 mt-2">
                                        {
                                            prop?.features?.map((res: any, key: number) => (
                                                <Fragment key={key}>
                                                    <div className="bg-gray-100 py-4 rounded px-3 text-center">
                                                        {res?.icon ? <i className={res?.icon} /> : <MdCheckBox size={20} className="mx-auto text-green-600 mb-1" />}
                                                        <p className="text-[14px] text-gray-700">{res.name}</p>
                                                    </div>
                                                </Fragment>
                                            ))
                                        }
                                    </div>
                                </>}

                            {/* nearby  */}

                            {prop?.facilities?.length > 0 &&
                                <>
                                    <div id="nearby"></div>

                                    <h4 className="font-[500] text-[18px] text-gray-700 mt-11">Nearby Facilities</h4>

                                    <div className="grid grid-cols-5 gap-3 mt-2">
                                        {
                                            prop?.facilities?.map((res: any, key: number) => (
                                                <Fragment key={key}>
                                                    <div className="bg-gray-100 py-5 rounded px-3 text-center">
                                                        {res?.icon ? <i className={res?.icon + ' text-[22px] text-primary mb-1'} /> : <MdCheckBox size={20} className="mx-auto text-green-600 mb-1" />}
                                                        <p className="text-[14px] font-[500] text-gray-700 py-1">{res.name}</p>
                                                        <p className="text-[12px] text-gray-500 leading-[12px] italic"> {res?.pivot?.distance} away</p>
                                                    </div>
                                                </Fragment>
                                            ))
                                        }
                                    </div>
                                </>}

                            {/* projects */}

                            {prop?.property?.length > 0 &&
                                <>
                                    <div id="price"></div>

                                    <h4 className="font-[500] text-[18px] text-gray-700 mt-11">Listed Units & Price List</h4>

                                    <TableContainer className="mt-2">
                                        <Table variant='striped' colorScheme="gray">
                                            <Thead>
                                                <Tr>
                                                    <Th>Plot</Th>
                                                    <Th>Area Covered</Th>
                                                    <Th>Floor Area</Th>
                                                    <Th>Furnishing</Th>
                                                    <Th>Price</Th>
                                                    <Th className="text-center">Project Status</Th>
                                                </Tr>
                                            </Thead>
                                            <Tbody>
                                                {
                                                    prop?.property?.map((res: any, key: number) => (
                                                        <Tr>
                                                            <Td className="text-[14px]">{++key}</Td>
                                                            <Td className="text-[14px]">{res?.ropani || 0}-{res?.aana || 0}-{res?.paisa || 0}-{res?.daam || 0}</Td>
                                                            <Td className="text-[14px]">{res?.square} {res?.area_type}</Td>
                                                            <Td className="text-[14px]">{res?.furnishing || 'None'}</Td>
                                                            <Td className="text-[14px] font-[500] text-blue-500">{res?.price ? numDifferentiation(res?.price) : 'Price on Call'}</Td>
                                                            <Td className="text-[14px]">
                                                                {['sold', 'not_available', 'rented'].includes(res?.status) ? <>
                                                                    <button className="bg-red-500 py-[6px] px-[10px] text-white capitalize w-[100px] rounded text-[12px]">{res?.status}</button>
                                                                </> :
                                                                    <Link href={`/${res?.slugable?.prefix}/${res?.slugable?.key}`}>
                                                                        <button className="btn-primary text-[12px] w-[100px]">View Property</button>
                                                                    </Link>
                                                                }
                                                            </Td>
                                                        </Tr>))
                                                }
                                            </Tbody>
                                        </Table>
                                    </TableContainer>
                                </>}

                            {/* master plan  */}
                            {prop?.plan_image != null &&
                                <>
                                    <div id="master_plan"></div>

                                    <h4 className="font-[500] text-[18px] text-gray-700 mt-11">Master Plan</h4>

                                    <div className="mt-2">
                                        <img width={"100%"} className="rounded" src={storageUrl + prop?.plan_image} alt="" />
                                    </div>
                                </>}

                            {/* payment structure  */}

                            {JSON.parse(prop?.payment_structure)?.length > 0 &&
                                <>
                                    <div id="payment"></div>

                                    <h4 className="font-[500] text-[18px] text-gray-700 mt-11">Payment Structure</h4>
                                    <div className="mt-2">
                                        <TableContainer className="mt-2">
                                            <Table variant='striped' colorScheme="gray">
                                                <Thead>
                                                    <Tr>
                                                        <Th>SN</Th>
                                                        <Th>Payment Type</Th>
                                                        <Th>Percentage/Price</Th>
                                                    </Tr>
                                                </Thead>
                                                <Tbody>
                                                    {
                                                        JSON.parse(prop?.payment_structure)?.map((res: any, key: number) => (
                                                            <Fragment key={key}>
                                                                <Tr>
                                                                    <Td className="text-[14px]">{++key}</Td>
                                                                    <Td className="text-[14px]">{res?.[0]?.value}</Td>
                                                                    <Td className="text-[14px]">{res?.[1]?.value}</Td>
                                                                </Tr>
                                                            </Fragment>
                                                        ))
                                                    }

                                                </Tbody>
                                            </Table>
                                        </TableContainer>
                                    </div>
                                </>}

                            {/* maps  */}
                            {prop?.latitude != '' && <>
                                <div id="maps"></div>
                                <h4 className="font-[500] text-[18px] text-gray-700 mt-11 mb-3">Map Location</h4>

                                <iframe
                                    src={`//maps.google.com/maps?q=${prop?.latitude},${prop?.longitude}&z=15&output=embed`}
                                    width={"100%"}
                                    className="rounded"
                                    height={"500px"}
                                >
                                </iframe>
                            </>}
                        </div>
                    </div>

                    {/* author profile  */}
                    <div className="w-[28%] sticky top-[60px] self-baseline">
                        <div className="border-[1px] border-gray-300 p-4 text-center rounded-[12px]">
                            <div className="flex items-center gap-2">
                                <div>
                                    <Avatar
                                        size='md'
                                        name={prop?.investor?.name}
                                        src={storageUrl + prop?.investor?.image}
                                    />
                                </div>
                                <div className="text-left">
                                    <p className="text-gray-1100 text-[16px] font-[600]">{prop?.investor?.name}</p>
                                    {prop?.investor?.location && <p className="text-gray-1100 text-[16px] font-[600]"> <FaLocationDot className="mb-[1px] text-blue-500 w-[15px]" size={10} /> {prop?.investor?.location}</p>}
                                    <p className="text-blue-500 text-[14px] underline">{prop?.investor?.projects_count} projects</p>
                                </div>
                            </div>

                            <div>
                                {prop?.investor?.phone && <a href={`tel:${prop?.investor?.phone}`}>
                                    <button className="btn-primary mt-4 text-[15px] h-[48px] w-[100%] flex items-center justify-between gap-2">
                                        <div className="flex items-center gap-2 pl-3">
                                            <MdPhone size={17} />
                                            {prop?.investor?.phone}
                                        </div>

                                        <ChevronRightIcon w={6} h={6} />
                                    </button>
                                </a>}

                                {prop?.author?.email && <><div className="my-4 flex items-center gap-3">
                                    <hr className="w-[100%] border-gray-400" />
                                    <p className="text-gray-600 text-[14px]">OR</p>
                                    <hr className="w-[100%] border-gray-400" />
                                </div>
                                    <a href={`mailto:${prop?.author?.email}`}>
                                        <button className="bg-gray-300 text-[15px] rounded text-primary w-[100%] h-[48px] flex justify-center items-center">
                                            <div className="flex items-center gap-2">
                                                <MdEmail size={17} />
                                                {prop?.author?.email}
                                            </div>
                                        </button>
                                    </a></>}
                            </div>

                        </div>

                        <Consult
                            prop={prop}
                            type="project"
                        />

                    </div>

                </div>

                {prop?.related_properties.length > 0 && <div className="mt-11 pb-11">
                    <h4 className="font-[500] text-[20px] text-gray-600">Related Projects </h4>

                    {prop?.related_properties.length > 4 ?
                        <div className="mx-[-11px] mt-4">
                            <Slider
                                ref={(e: any) => slickRef = e}
                                {...settings}>
                                {prop?.related_properties?.map((res: any, key: number) => (
                                    <Fragment key={key}>
                                        <PropertyCard
                                            isProperty={false}
                                            res={res}
                                            className="border bg-white"
                                        />
                                    </Fragment>
                                ))}
                            </Slider>
                        </div > :
                        <div className="grid grid-cols-4 mx-[-11px]">
                            {prop?.related_properties?.map((res: any, key: number) => (
                                <Fragment key={key}>
                                    <PropertyCard
                                        isProperty={false}
                                        res={res}
                                        className="border bg-white"
                                    />
                                </Fragment>
                            ))}
                        </div>
                    }
                </div>}
            </div>
            <Footer />
        </div>
    )
}

export async function getServerSideProps({ req, res, params }: any) {
    const project: any = await axios.get(apiURL + `projects/${params?.id}?type=api`)

    return {
        props: {
            prop: project?.data
        }
    }
}