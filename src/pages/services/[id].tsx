import Footer from "@/Components/Footer/Footer";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, Button, Card, CardBody, CardFooter, Heading, Image, Stack, Text } from "@chakra-ui/react";
import Link from "next/link";
import Navbar from "@/Components/Navbar/Navbar";
import { FaLocationDot, FaMoneyBill } from "react-icons/fa6";
import { MdPhone, MdPhoneForwarded } from "react-icons/md";
import axios from "axios";
import { apiURL, storageUrl } from "@/Constant/helper";
import Head from "next/head";

export default function Service({ services }: any) {
    return (
        <>
            <Head>
                <title>{services?.name}</title>
                <meta property="og:title" content={services?.name} />
                <meta property="og:url" content={`/services/${services?.id}`} />
                <meta property="og:description" content={services?.description} />
                <meta property="og:image" content={storageUrl + JSON.parse(services?.banner)?.[JSON.parse(services?.banner)?.length - 1]} />
            </Head>

            <Navbar />

            <Breadcrumb overflowX={"auto"} className="flex-wrap border-t border-gray-300" spacing='10px' separator={<div className="w-[11px] h-[11px] bg-no-repeat bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNyIgaGVpZ2h0PSIxMSIgdmlld0JveD0iMCAwIDcgMTEiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNMC42NDY0NDcgMC4xNDY0NDdDMC44NDE3MDkgLTAuMDQ4ODE1NSAxLjE1ODI5IC0wLjA0ODgxNTUgMS4zNTM1NSAwLjE0NjQ0N0w2LjM1MzU1IDUuMTQ2NDVDNi41NDg4MiA1LjM0MTcxIDYuNTQ4ODIgNS42NTgyOSA2LjM1MzU1IDUuODUzNTVMMS4zNTM1NSAxMC44NTM2QzEuMTU4MjkgMTEuMDQ4OCAwLjg0MTcwOSAxMS4wNDg4IDAuNjQ2NDQ3IDEwLjg1MzZDMC40NTExODQgMTAuNjU4MyAwLjQ1MTE4NCAxMC4zNDE3IDAuNjQ2NDQ3IDEwLjE0NjRMNS4yOTI4OSA1LjVMMC42NDY0NDcgMC44NTM1NTNDMC40NTExODQgMC42NTgyOTEgMC40NTExODQgMC4zNDE3MDkgMC42NDY0NDcgMC4xNDY0NDdaIiBmaWxsPSIjNjc3RDk1Ii8+Cjwvc3ZnPgo=')]" />}>
                <BreadcrumbItem>
                    <Link className="font-[500] text-[#394e66]" href='/'>
                        Home
                    </Link>
                </BreadcrumbItem>

                <BreadcrumbItem>
                    <Link className="font-[500] text-[#394e66]" href='/services'>
                        Services
                    </Link>
                </BreadcrumbItem>


                <BreadcrumbItem isCurrentPage>
                    <BreadcrumbLink className="font-[500] text-[#394e66]" href='#'>
                        {services?.name}
                    </BreadcrumbLink>
                </BreadcrumbItem>
            </Breadcrumb>

            <div className="relative border-b">
                <img src="/assets/bg.png" className=" h-[200px] w-[100%] object-cover" alt="" />
                <div className="absolute top-0 left-0 right-0 bottom-0 items-center flex justify-center">
                    <div className="text-center">
                        <h5 className="mx-auto justify-center mb-8 font-[600] text-gray-700 text-2xl flex gap-1 items-center">{services?.name}
                        </h5>
                    </div>
                </div>
            </div>

            <div className="bg-gradient pb-11 services-list">
                <div className="container mx-auto pt-11 pb-7">
                    <div className="flex gap-6">
                        <div className="w-[75%]">
                            <div className="bg-white px-7 pt-7 rounded-[9px] pb-11">
                                <div className="flex flex-wrap gap-4 mb-8">
                                    <div className="text-[14px] bg-[#0E578C]/[0.1] px-3 py-[2px] rounded-[9px] flex items-center gap-2">
                                        <FaLocationDot size={13} />
                                        {services?.location}
                                    </div>

                                    <div className="text-[14px] bg-blue-100 px-3 py-[2px] rounded-[9px] flex items-center gap-2">
                                        <FaMoneyBill />
                                        {services?.salary}
                                    </div>

                                    <Link href={`tel:+977${services?.phone}`} className="text-[14px] bg-green-100 px-3 py-[2px] rounded-[9px] flex items-center gap-2">
                                        <MdPhone />
                                        {services?.phone}
                                    </Link>
                                </div>
                                <div dangerouslySetInnerHTML={{ __html: services?.content }}>
                                </div>
                            </div>

                            <div>

                                <div className="bg-white px-7 pt-7 rounded-[9px] pb-11 mt-7">
                                    <h4 className="font-[500] text-[20px] mb-4">Our Service Partner</h4>

                                    <div>
                                        {
                                            services?.lists && JSON.parse(services?.lists)?.map((res: any, key: number) => (
                                                <Card
                                                    key={key}
                                                    className="mb-5"
                                                    direction={{ base: 'column', sm: 'row' }}
                                                    overflow='hidden'
                                                    variant='outline'
                                                >
                                                    <Image
                                                        objectFit='cover'
                                                        height={"210px"}
                                                        width={"200px"}
                                                        src={storageUrl + res?.map((res: any) => ({ [res.key]: res.value }))?.[0]?.img}
                                                        alt={res?.map((res: any) => ({ [res.key]: res.value }))?.[1]?.name}
                                                    />

                                                    <Stack>
                                                        <CardBody>
                                                            <p className="font-[500] text-[18px] text-gray-700">{res?.map((res: any) => ({ [res.key]: res.value }))?.[1]?.name}</p>

                                                            <div className="flex gap-3 flex-wrap">
                                                                <p className="flex gap-1 bg-gray-200 px-1 rounded-[4px] py-[1px] items-center text-[13px] text-gray-500">
                                                                    <FaLocationDot className="mb-[1px] text-blue-500" size={13} />
                                                                    {res?.map((res: any) => ({ [res.key]: res.value }))?.[3]?.location}
                                                                </p>
                                                                <p className="flex gap-1 bg-gray-200 px-1 rounded-[4px] py-[1px] items-center text-[13px] text-gray-500">
                                                                    <FaMoneyBill className="mb-[1px] text-blue-500" />
                                                                    {res?.map((res: any) => ({ [res.key]: res.value }))?.[2]?.price}
                                                                </p>

                                                                <div className="flex gap-1 bg-gray-200 px-1 rounded-[4px] py-[1px] items-center text-[13px] text-gray-500">
                                                                    <Link className="flex gap-1 items-center" href={`tel:+977${res?.map((res: any) => ({ [res.key]: res.value }))?.[5]?.phone}`}>
                                                                        <MdPhoneForwarded className="mb-[1px] text-blue-500" />
                                                                        {res?.map((res: any) => ({ [res.key]: res.value }))?.[5]?.phone}
                                                                    </Link>
                                                                </div>
                                                            </div>

                                                            <p className="font-[400] mt-4 text-[14px] text-gray-600">
                                                                {res?.map((res: any) => ({ [res.key]: res.value }))?.[4]?.descriptoin}
                                                            </p>
                                                        </CardBody>

                                                        <CardFooter>
                                                            <Link className="flex gap-1 items-center" href={`tel:+977${res?.map((res: any) => ({ [res.key]: res.value }))?.[5]?.phone}`}>
                                                                <Button variant='solid' size={"sm"} fontWeight={500} fontSize={13} colorScheme='blue'>
                                                                    <MdPhoneForwarded className="mr-1" /> Call Now
                                                                </Button>
                                                            </Link>
                                                        </CardFooter>
                                                    </Stack>
                                                </Card>
                                            ))
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="w-[25%] mb-11">
                            {
                                JSON.parse(services?.banner)?.map((res: any, key: number) => (
                                    <img key={key} className="rounded mt-5" src={storageUrl + res} alt="" />
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
    const services = await axios.get(apiURL + `services/${params?.id}`);

    return {
        props: {
            services: JSON.parse(JSON.stringify(services?.data)),
        },
    };
}