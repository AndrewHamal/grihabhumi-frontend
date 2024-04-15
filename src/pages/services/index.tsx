import Footer from "@/Components/Footer/Footer";
import Navbar from "@/Components/Navbar/Navbar";
import { apiURL, storageUrl } from "@/Constant/helper";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, Button, Card, Input, CardBody, CardFooter, Image, InputGroup, InputLeftElement, Stack, Text } from "@chakra-ui/react";
import axios from "axios";
import Link from "next/link";
import { useCallback, useMemo, useState } from "react";
import { BsExclamationCircle } from "react-icons/bs";
import { FaLocationDot, FaMoneyBill } from "react-icons/fa6";
import { MdPhoneForwarded, MdSearch } from "react-icons/md";

export default function Services({ services: lists, servicesList }: any) {
    const [keyword, setKeyword] = useState('')

    const services = useMemo(() => {
        let listFilter = lists?.mergedArray

        if (keyword) {
            var re = new RegExp(keyword, "gi");
            listFilter = listFilter.filter((res: any) => res.services.match(re) || res.name.match(re) || res.descriptoin.match(re) || res.location.match(re))
        }

        return listFilter
    }, [keyword])


    function handleSearch(e: any) {
        setKeyword(e.target.value)
    }

    return (
        <>
            <Navbar />

            <div className="bg-gradient services-list">
                <Breadcrumb overflowX={"auto"} className="flex-wrap border-t border-gray-300" spacing='10px' separator={<div className="w-[11px] h-[11px] bg-no-repeat bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNyIgaGVpZ2h0PSIxMSIgdmlld0JveD0iMCAwIDcgMTEiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNMC42NDY0NDcgMC4xNDY0NDdDMC44NDE3MDkgLTAuMDQ4ODE1NSAxLjE1ODI5IC0wLjA0ODgxNTUgMS4zNTM1NSAwLjE0NjQ0N0w2LjM1MzU1IDUuMTQ2NDVDNi41NDg4MiA1LjM0MTcxIDYuNTQ4ODIgNS42NTgyOSA2LjM1MzU1IDUuODUzNTVMMS4zNTM1NSAxMC44NTM2QzEuMTU4MjkgMTEuMDQ4OCAwLjg0MTcwOSAxMS4wNDg4IDAuNjQ2NDQ3IDEwLjg1MzZDMC40NTExODQgMTAuNjU4MyAwLjQ1MTE4NCAxMC4zNDE3IDAuNjQ2NDQ3IDEwLjE0NjRMNS4yOTI4OSA1LjVMMC42NDY0NDcgMC44NTM1NTNDMC40NTExODQgMC42NTgyOTEgMC40NTExODQgMC4zNDE3MDkgMC42NDY0NDcgMC4xNDY0NDdaIiBmaWxsPSIjNjc3RDk1Ii8+Cjwvc3ZnPgo=')]" />}>
                    <BreadcrumbItem>
                        <Link className="font-[500] text-[#394e66]" href='/'>
                            Home
                        </Link>
                    </BreadcrumbItem>

                    <BreadcrumbItem isCurrentPage>
                        <Link className="font-[500] text-[#394e66]" href='/#services'>
                            Services
                        </Link>
                    </BreadcrumbItem>
                </Breadcrumb>


                <div className="relative border-b">
                    <img src="/assets/bg.png" className=" h-[200px] w-[100%] object-cover" alt="" />
                    <div className="absolute top-0 bottom-0 items-center w-[100%] flex ">
                        <div className="text-center flex flex-wrap w-[100%]">
                            <h5 className="mx-auto justify-center mb-4 w-[100%] font-[600] text-gray-700 text-2xl flex gap-1 items-center">
                                Services
                            </h5>

                            <InputGroup w={"30%"} className='mt-2 mx-auto border rounded'>
                                <InputLeftElement pointerEvents='none'>
                                    <MdSearch size={23} className='text-gray-400 mt-[6px]' />
                                </InputLeftElement>
                                <Input onKeyUp={handleSearch} className="px-4" height={"45px"} border={0} _placeholder={{ color: "#d1d5db" }} type='email' size={'md'} background={"#fff"} name='email' placeholder='Search By Keyword, location' />
                            </InputGroup>
                        </div>
                    </div>
                </div>


                <div className="container mx-auto pt-11">
                    <div className="flex flex-wrap gap-6">
                        <div className="flex-grow mb-11">
                            <div>
                                {
                                    services?.map((res: any, key: number) => (
                                        <Card
                                            key={key}
                                            className="mb-5 shadow-req"
                                            rounded={7}
                                            direction={{ base: 'column', sm: 'row' }}
                                            overflow='hidden'
                                            variant='outline'
                                        >
                                            <Image
                                                objectFit='cover'
                                                height={"230px"}
                                                width={"290px"}
                                                src={storageUrl + res?.img}
                                                alt={res?.name}
                                            />

                                            <Stack>
                                                <CardBody>
                                                    <div className="flex mb-1">
                                                        <div className="text-[12px] bg-blue-400 text-white px-2 rounded-[10px]">
                                                            {res?.services}
                                                        </div>
                                                    </div>
                                                    <p className="font-[500] text-[18px] text-gray-700">{res?.name}</p>

                                                    <div className="flex gap-x-3 gap-y-2 mt-1 flex-wrap">
                                                        <p className="flex gap-1 bg-gray-200 px-[5px] rounded-[4px] py-[1px] items-center text-[13px] text-gray-500">
                                                            <FaLocationDot className="mb-[1px] text-blue-500" size={13} />
                                                            {res?.location}
                                                        </p>
                                                        <p className="flex gap-1 bg-gray-200 px-[5px] rounded-[4px] py-[1px] items-center text-[13px] text-gray-500">
                                                            <FaMoneyBill className="mb-[1px] text-blue-500" />
                                                            {res?.price}
                                                        </p>

                                                        <div className="flex gap-1 bg-gray-200 px-[5px] rounded-[4px] py-[1px] items-center text-[13px] text-gray-500">
                                                            <Link className="flex gap-1 items-center" href={`tel:+977${res?.phone}`}>
                                                                <MdPhoneForwarded className="mb-[1px] text-blue-500" />
                                                                {res?.phone}
                                                            </Link>
                                                        </div>
                                                    </div>

                                                    <p className="font-[400] mt-4 text-[14px] text-gray-600">
                                                        {res?.descriptoin}
                                                    </p>
                                                </CardBody>

                                                <CardFooter>
                                                    <Link className="flex gap-1 items-center" href={`tel:+977${res?.phone}`}>
                                                        <Button variant='solid' size={"sm"} fontWeight={500} fontSize={13} colorScheme='blue'>
                                                            <MdPhoneForwarded className="mr-1" /> Call Now
                                                        </Button>
                                                    </Link>
                                                </CardFooter>
                                            </Stack>
                                        </Card>
                                    ))
                                }

                                {
                                    services?.length === 0 &&
                                    <div className="bg-white p-4 flex items-center gap-3 rounded-[12px] border">
                                        <BsExclamationCircle />
                                        No Services Found
                                    </div>
                                }
                            </div>
                        </div>

                        <div className="w-[30%] pb-11">
                            {
                                lists && lists?.mergedBanner?.map((res: any, key: number) => (
                                    <Image alt="Nepal's Top Services" rounded={6} marginBottom={5} key={key} src={storageUrl + res} />
                                ))
                            }
                        </div>

                    </div>
                </div>
            </div>
            <Footer />
        </>
    )
}


export async function getServerSideProps({ req, res, params }: any) {
    const services = await axios.get(apiURL + `services?type=list`);
    const servicesList = await axios.get(apiURL + `services`);

    return {
        props: {
            services: JSON.parse(JSON.stringify(services?.data)),
            servicesList: JSON.parse(JSON.stringify(servicesList?.data))
        },
    };
}