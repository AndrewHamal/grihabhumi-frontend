import Navbar from "@/Components/Navbar/Navbar";
import numDifferentiation, { apiURL, storageUrl } from "@/Constant/helper";
import useSWR from 'swr'
import { fetcher, postConsult } from "../api/api";
import { useParams, usePathname } from "next/navigation";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import { Fragment, useMemo, useRef, useState } from "react";
import ImageGallery from "react-image-gallery";
import { MdApartment, MdAttachMoney, MdBathroom, MdBed, MdBedroomBaby, MdBedtime, MdBuild, MdBungalow, MdCalendarMonth, MdCalendarToday, MdCategory, MdCellTower, MdCheckBox, MdEmail, MdHome, MdHouse, MdKey, MdListAlt, MdMoneyOff, MdPanoramaFishEye, MdPhone, MdRealEstateAgent, MdRemoveRedEye, MdSquareFoot } from "react-icons/md";
import { FaLocationDot } from "react-icons/fa6";
import dayjs from "dayjs";
import { Avatar, Breadcrumb, BreadcrumbItem, BreadcrumbLink, Button, Input, Tab, TabIndicator, TabList, Tabs, Textarea } from "@chakra-ui/react";
import { BsEye } from "react-icons/bs";
import PropertyCard from "@/Components/PropertyCard";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Link from "next/link";
import Footer from "@/Components/Footer/Footer";
import axios from "axios";
import Head from "next/head";
import FsLightbox from "fslightbox-react";
import Consult from "@/Components/Consult";

export default function Property({ prop }: any) {
    const [toggle, setToggle] = useState(false)
    const settings = {
        dots: true,
        infinite: false,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 4,
        arrows: false,
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

    const imgEle = useMemo(() => {
        let ele: any = []
        Object.values(prop?.images || {})?.map(res => (
            ele.push(<img src={storageUrl + res} />)
        ))

        return ele
    }, [])

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

            <Breadcrumb overflowX={"auto"} className="flex-wrap border-t border-gray-300" spacing='10px' separator={<div className="w-[11px] h-[11px] bg-no-repeat bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNyIgaGVpZ2h0PSIxMSIgdmlld0JveD0iMCAwIDcgMTEiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNMC42NDY0NDcgMC4xNDY0NDdDMC44NDE3MDkgLTAuMDQ4ODE1NSAxLjE1ODI5IC0wLjA0ODgxNTUgMS4zNTM1NSAwLjE0NjQ0N0w2LjM1MzU1IDUuMTQ2NDVDNi41NDg4MiA1LjM0MTcxIDYuNTQ4ODIgNS42NTgyOSA2LjM1MzU1IDUuODUzNTVMMS4zNTM1NSAxMC44NTM2QzEuMTU4MjkgMTEuMDQ4OCAwLjg0MTcwOSAxMS4wNDg4IDAuNjQ2NDQ3IDEwLjg1MzZDMC40NTExODQgMTAuNjU4MyAwLjQ1MTE4NCAxMC4zNDE3IDAuNjQ2NDQ3IDEwLjE0NjRMNS4yOTI4OSA1LjVMMC42NDY0NDcgMC44NTM1NTNDMC40NTExODQgMC42NTgyOTEgMC40NTExODQgMC4zNDE3MDkgMC42NDY0NDcgMC4xNDY0NDdaIiBmaWxsPSIjNjc3RDk1Ii8+Cjwvc3ZnPgo=')]" />}>
                <BreadcrumbItem>
                    <Link className="font-[500] text-[#394e66]" href='/'>
                        Home
                    </Link>
                </BreadcrumbItem>

                <BreadcrumbItem>
                    <Link className="font-[500] text-[#394e66]" href='/search'>
                        Properties
                    </Link>
                </BreadcrumbItem>

                <BreadcrumbItem isCurrentPage>
                    <BreadcrumbLink className="font-[500]">{prop?.name}</BreadcrumbLink>
                </BreadcrumbItem>
            </Breadcrumb>

            <ImageGallery
                thumbnailPosition={'right'}
                showFullscreenButton={false}
                slideOnThumbnailOver={false}
                onClick={() => setToggle(!toggle)}
                showPlayButton={false}
                items={Object.values(prop?.images || {})?.map(res => ({ originalClass: 'property-image', original: (storageUrl + res), thumbnail: (storageUrl + res) }))}
            />

            <FsLightbox
                type="image"
                toggler={toggle}
                sources={imgEle}
                customToolbarButtons={[
                    {
                        viewBox: "0 0 16 16",
                        d: "M0 14h16v2h-16v-2z M8 13l5-5h-3v-8h-4v8h-3z",
                        width: "16px",
                        height: "16px",
                        title: "Download",
                        onClick: function (instance) {
                            var URL = instance.props.sources[instance.stageIndexes.current];
                            var a = document.createElement("a");
                            a.href = URL;
                            a.setAttribute("download", "");
                            document.body.appendChild(a);
                            a.click();
                            document.body.removeChild(a);
                        }
                    }
                ]}
            />

            <div className="bg-[#f7f7f7] sticky top-0 z-[99]">
                <div className="md:container mx-auto">
                    <Tabs position="relative" variant="unstyled" overflowX="auto">
                        <TabList>
                            <Link href={'#overview'}>
                                <Tab fontSize={13} _active={{ color: "red" }} className="text-[10px]">Overview</Tab>
                            </Link>
                            <Link href={'#description'}>
                                <Tab fontSize={13} >Description</Tab>
                            </Link>
                            <Link href={'#includes'}>
                                <Tab fontSize={13} >Amenities</Tab>
                            </Link>
                            <Link href={'#nearby'}>
                                <Tab fontSize={13} >Nearby</Tab>
                            </Link>
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

            <div id="overview"></div>

            <div className="md:container mx-auto my-11 property-container">
                <div className="flex gap-[70px]">
                    <div className="w-[72%]">
                        <div className="flex flex-wrap mb-4 gap-3 items-center">
                            <div className="bg-[#0E578C]/[0.2] px-3 py-[2px] rounded-[12px] text-[13px]">
                                <p className="capitalize"># {prop?.type}</p>
                            </div>

                            {
                                prop?.categories?.length > 0 && prop?.categories?.map((res: any, key: number) => (
                                    <Fragment key={key}>
                                        <div className="bg-teal-300 px-3 py-[2px] rounded-[12px] text-[13px]">
                                            <p className="capitalize">{res?.name}</p>
                                        </div>
                                    </Fragment>
                                ))
                            }

                            <div className="bg-blue-200 flex items-center gap-1 px-3 py-[2px] rounded-[12px] text-[13px]">
                                <BsEye />
                                <p>Views: <span className="font-[500] text-dark">{prop?.views}</span></p>
                            </div>

                            <div>
                                <p className="text-gray-500 text-[14px]">Posted On: <span className="font-[500]"> {dayjs(prop?.created_at).format('MMM DD, YYYY')}</span></p>
                            </div>
                            {/* <div>
                                <p className="text-red-500 text-[14px]">Expired On: <span className="font-[500]">  {prop?.never_expired ? 'Never Expires' : dayjs(prop?.expire_date).format('MMM DD, YYYY')} </span></p>
                            </div> */}
                        </div>

                        <div className="flex justify-between items-center">
                            <h2 className="text-3xl font-[600] text-[#171717]">{prop?.name}</h2>
                            <p className="text-[18px] text-blue-500 font-[500] w-[200px] text-right">Rs. {numDifferentiation(prop?.price)}</p>
                        </div>

                        <div className="flex items-center mt-1 gap-1">
                            <FaLocationDot className="text-blue-500" size={14} />
                            <p className="text-gray-500">{prop?.location}</p>
                        </div>

                        <div className="mt-4 grid grid-cols-4 gap-4">

                            {prop?.condition && <div className='flex border rounded-[6px] px-4 items-center py-4 gap-3'>
                                <div>
                                    <MdListAlt color='#0E578C' className='text-[#464646]' size={30} />
                                </div>

                                <div>
                                    <p className='text-[14px] font-[600] text-[#464646] leading-4'>{prop?.condition}</p>
                                    <p className='text-[13px] text-gray-500 capitalize leading-4'>Condition</p>
                                </div>
                            </div>}

                            {prop?.negotiable && <div className='flex border rounded-[6px] px-4 items-center py-4 gap-3'>
                                <div>
                                    <MdAttachMoney color='#0E578C' className='text-[#464646]' size={30} />
                                </div>

                                <div>
                                    <p className='text-[14px] font-[600] text-[#464646] leading-4'>{prop?.negotiable}</p>
                                    <p className='text-[13px] text-gray-500 capitalize leading-4'>Negotiable</p>
                                </div>
                            </div>}

                            <div className='flex border rounded-[6px] p-4 items-center py-4 gap-3'>
                                <div>
                                    <MdBed color='#0E578C' className='text-[#464646]' size={33} />
                                </div>

                                <div>
                                    <p className='text-[14px] font-[600] text-[#464646] leading-4'>{prop?.number_bedroom}</p>
                                    <p className='text-[13px] text-gray-500 capitalize leading-4'>No. of Bedroom</p>
                                </div>
                            </div>

                            <div className='flex items-center border rounded-[6px] px-4 py-4 gap-3'>
                                <div>
                                    <MdBathroom color='#0E578C' className='text-[#464646]' size={33} />
                                </div>

                                <div>
                                    <p className='text-[14px] font-[600] text-[#464646] leading-4'>{prop?.number_bathroom}</p>
                                    <p className='text-[13px] text-gray-500 capitalize leading-4'>No. of Bathroom</p>
                                </div>
                            </div>

                            {prop?.number_floor && <div className='flex border rounded-[6px] px-4 items-center py-4 gap-3'>
                                <div>
                                    <MdHome color='#0E578C' className='text-[#464646]' size={33} />
                                </div>

                                <div>
                                    <p className='text-[14px] font-[600] text-[#464646] leading-4'>{prop?.number_floor}</p>
                                    <p className='text-[13px] text-gray-500 capitalize leading-4'>No. of Floor</p>
                                </div>
                            </div>}

                            {prop?.square && <div className='flex border rounded-[6px] px-4 items-center py-4 gap-3'>
                                <div>
                                    <MdSquareFoot color='#0E578C' className='text-[#464646]' size={33} />
                                </div>

                                <div>
                                    <p className='text-[14px] font-[600] text-[#464646] leading-4'>{prop?.square} {prop?.area_type}</p>
                                    <p className='text-[13px] text-gray-500 capitalize leading-4'>Build-up Area</p>
                                </div>
                            </div>}

                            {(prop?.ropani || prop?.aana || prop?.paisa || prop?.daam) && <div className='flex border rounded-[6px] px-4 items-center py-4 gap-3'>
                                <div>
                                    <MdSquareFoot color='#0E578C' className='text-[#464646]' size={33} />
                                </div>

                                <div className="relative w-[100%]">
                                    <p className='text-[6px] top-[-10px] w-[100%]'>Ropani-Aana-Paisa-Daam</p>
                                    <p className='text-[14px] font-[600] text-[#464646] leading-4'>{prop?.ropani || 0}-{prop?.aana || 0}-{prop?.paisa || 0}-{prop?.daam || 0}</p>
                                    <p className='text-[13px] text-gray-500 capitalize leading-4'>Total Area</p>
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
                            <div className="text-gray-500 mt-2" dangerouslySetInnerHTML={{ __html: prop?.content }} />


                            {/* includes  */}
                            <div id="includes"></div>
                            {prop?.features?.length > 0 && <h4 className="font-[500] text-[18px] text-gray-700 mt-9">Property Includes</h4>}

                            <div className="grid grid-cols-5 gap-3 mt-2">
                                {
                                    prop?.features?.map((res: any, key: number) => (
                                        <Fragment key={key}>
                                            <div className="bg-gray-200 py-4 rounded px-3 text-center">
                                                {res?.icon ? <i className={res?.icon} /> : <MdCheckBox size={20} className="mx-auto text-green-600 mb-1" />}
                                                <p className="text-[14px] text-gray-700">{res.name}</p>
                                            </div>
                                        </Fragment>
                                    ))
                                }
                            </div>

                            {/* nearby  */}
                            <div id="nearby"></div>

                            {prop?.facilities?.length > 0 && <h4 className="font-[500] text-[18px] text-gray-700 mt-9">Nearby Facilities</h4>}

                            <div className="grid grid-cols-5 gap-3 mt-2">
                                {
                                    prop?.facilities?.map((res: any, key: number) => (
                                        <Fragment key={key}>
                                            <div className="bg-gray-200 py-5 rounded px-3 text-center">
                                                {res?.icon ? <i className={res?.icon + ' text-[22px] text-primary mb-1'} /> : <MdCheckBox size={20} className="mx-auto text-green-600 mb-1" />}
                                                <p className="text-[14px] font-[500] text-gray-700 py-1">{res.name}</p>
                                                <p className="text-[12px] text-gray-500 leading-[12px] italic"> {res?.pivot?.distance} Km away</p>
                                            </div>
                                        </Fragment>
                                    ))
                                }
                            </div>

                            {/* maps  */}
                            {prop?.latitude && prop?.longitude && <><div id="maps"></div>
                                <h4 className="font-[500] text-[18px] text-gray-700 mt-9 mb-3">Map Location</h4>

                                <iframe
                                    src={`//maps.google.com/maps?q=${prop?.latitude},${prop?.longitude}&z=15&output=embed`}
                                    width={"100%"}
                                    className="rounded"
                                    height={"500px"}
                                >
                                </iframe></>}
                        </div>
                    </div>

                    {/* author profile  */}
                    <div className="w-[28%] sticky top-[60px] self-baseline">
                        <div className="border-[1px] py-5 px-6 text-center rounded-[12px]">
                            <div className="flex gap-2 items-center">
                                <Avatar
                                    size='lg'
                                    name={prop?.author?.company}
                                    src={storageUrl + prop?.author?.avatar?.url}
                                />

                                <div className="text-left">
                                    <p className="text-gray-1100 text-[16px] font-[500]">{prop?.author?.company || prop?.author?.email}</p>
                                    <p className="text-blue-500 text-[14px] underline">{prop?.author?.property_count} properties</p>
                                </div>
                            </div>

                            <div className="mt-4">
                                <a href={`tel:${prop?.author?.phone}`}>
                                    <button className="btn-primary text-[14px] h-[42px] w-[100%] flex items-center justify-between gap-2">
                                        <div className="flex items-center gap-2 pl-3">
                                            <MdPhone size={17} />
                                            {prop?.author?.phone}
                                        </div>

                                        <ChevronRightIcon w={6} h={6} />
                                    </button>
                                </a>

                                <div className="my-1 flex items-center gap-3">
                                    <hr className="w-[100%] border-gray-400" />
                                    <p className="text-gray-600 text-[13px]">OR</p>
                                    <hr className="w-[100%] border-gray-400" />
                                </div>
                                <a href={`mailto:${prop?.author?.email}`}>
                                    <button className="bg-gray-300 text-[14px] rounded text-primary w-[100%] h-[42px] flex justify-center items-center">
                                        <div className="flex items-center gap-2">
                                            <MdEmail size={17} />
                                            {prop?.author?.email}
                                        </div>
                                    </button>
                                </a>
                            </div>

                        </div>

                        <Consult prop={prop} />
                    </div>

                </div>


                {prop?.related_properties.length > 0 && <div className="mt-[90px]">
                    <h4 className="font-[500] text-[20px] text-gray-600">Related Properties</h4>

                    {prop?.related_properties?.length > 4 ?
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
    const property: any = await axios.get(apiURL + `properties/${params?.id}?response=api`)

    return {
        props: {
            prop: property?.data
        }
    }
}