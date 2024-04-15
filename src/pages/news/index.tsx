import Footer from "@/Components/Footer/Footer";
import Navbar from "@/Components/Navbar/Navbar";
import useSWRInfinite from "swr/infinite";
import useSWR from "swr";
import { fetcher } from "../api/api";
import { Breadcrumb, BreadcrumbItem, Button, Card, CardBody, CardFooter, Heading, Image, Input, InputGroup, InputLeftElement, Spinner, Stack, Text } from "@chakra-ui/react";
import Link from "next/link";
import { MdSearch } from "react-icons/md";
import { GoArrowRight, GoCalendar, GoChevronDown, GoChevronRight, GoEye } from "react-icons/go";
import { Fragment, useState } from "react";
import dayjs from "dayjs";
import numDifferentiation from "@/Constant/helper";
import { useRouter } from "next/router";
import { debounce, isEmpty } from "lodash";
import { BsExclamationCircle } from "react-icons/bs";


export default function index() {
    const { query } = useRouter();
    const [keyword, setKeyword] = useState('');

    const getKey = (pageIndex: any, previousPageData: any) => {
        if (previousPageData && previousPageData?.data?.last_page == pageIndex) return null;
        return `/v1/posts?q=${keyword}&page=${pageIndex + 1}&type=${!isEmpty(query?.category_id) ? 'category' : ''}&id=${query?.category_id}`;
    };

    const { data, isValidating, size, setSize } = useSWRInfinite(getKey, fetcher)
    const { data: categories } = useSWR('/v1/categories', fetcher)


    let news: any[] = [];

    function handleSearch(e: any) {
        setKeyword(e.target.value)
    }

    if (data) {
        data.map((data: any) => {
            news = [...news, ...data?.data?.data];
        });
    }

    return (
        <div className="news-page">
            <Navbar />
            <Breadcrumb overflowX={"auto"} className="flex-wrap border-t border-gray-300" spacing='10px' separator={<div className="w-[11px] h-[11px] bg-no-repeat bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNyIgaGVpZ2h0PSIxMSIgdmlld0JveD0iMCAwIDcgMTEiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNMC42NDY0NDcgMC4xNDY0NDdDMC44NDE3MDkgLTAuMDQ4ODE1NSAxLjE1ODI5IC0wLjA0ODgxNTUgMS4zNTM1NSAwLjE0NjQ0N0w2LjM1MzU1IDUuMTQ2NDVDNi41NDg4MiA1LjM0MTcxIDYuNTQ4ODIgNS42NTgyOSA2LjM1MzU1IDUuODUzNTVMMS4zNTM1NSAxMC44NTM2QzEuMTU4MjkgMTEuMDQ4OCAwLjg0MTcwOSAxMS4wNDg4IDAuNjQ2NDQ3IDEwLjg1MzZDMC40NTExODQgMTAuNjU4MyAwLjQ1MTE4NCAxMC4zNDE3IDAuNjQ2NDQ3IDEwLjE0NjRMNS4yOTI4OSA1LjVMMC42NDY0NDcgMC44NTM1NTNDMC40NTExODQgMC42NTgyOTEgMC40NTExODQgMC4zNDE3MDkgMC42NDY0NDcgMC4xNDY0NDdaIiBmaWxsPSIjNjc3RDk1Ii8+Cjwvc3ZnPgo=')]" />}>
                <BreadcrumbItem>
                    <Link className="font-[500] text-[#394e66]" href='/'>
                        Home
                    </Link>
                </BreadcrumbItem>

                <BreadcrumbItem isCurrentPage>
                    <Link className="font-[500] text-[#394e66]" href='/news'>
                        News
                    </Link>
                </BreadcrumbItem>
                {
                    !isEmpty(query?.category_id) &&
                    <BreadcrumbItem isCurrentPage>
                        <Link className="font-[500] text-[#394e66]" href=''>
                            {categories?.data?.data?.find((res: any) => res?.id == query?.category_id)?.name}
                        </Link>
                    </BreadcrumbItem>
                }
            </Breadcrumb>


            <div className="relative border-b">
                <img src="/assets/bg.png" className=" h-[200px] w-[100%] object-cover" alt="" />
                <div className="absolute top-0 bottom-0 items-center w-[100%] flex ">
                    <div className="text-center flex flex-wrap w-[100%]">
                        <h5 className="mx-auto justify-center mb-4 w-[100%] font-[600] text-gray-700 text-2xl flex gap-1 items-center">
                            Latest from News
                        </h5>

                        <InputGroup w={"30%"} className='mt-2 mx-auto border rounded'>
                            <InputLeftElement pointerEvents='none'>
                                <MdSearch size={23} className='text-gray-400 mt-[6px]' />
                            </InputLeftElement>
                            <Input onKeyUp={debounce(handleSearch, 500)} className="px-4" height={"45px"} border={0} _placeholder={{ color: "#d1d5db" }} type='email' size={'md'} background={"#fff"} name='email' placeholder='Search By Keyword' />
                        </InputGroup>
                    </div>
                </div>
            </div>

            <div className="bg-gradient @container px-4">
                <div className="@7xl:container mx-auto py-20">
                    <div className="grid @3xl:flex gap-10">
                        <div className="@3xl:w-[75%] @3xl:order-[unset] order-2">
                            {!data && <Spinner />}

                            {data && news?.length === 0 && <div className="bg-white p-4 flex items-center gap-3 rounded-[12px] border">
                                <BsExclamationCircle />
                                No news Found
                            </div>}

                            {
                                news?.map((res: any, key: number) => (
                                    <Card
                                        key={key}
                                        marginBottom={10}
                                        direction={{ base: 'column', sm: 'row' }}
                                        overflow='hidden'
                                        variant={"outline"}
                                    >
                                        <Image
                                            objectFit='cover'
                                            maxW={{ base: '100%', sm: '250px' }}
                                            src={res.image}
                                            alt={res.name}
                                        />

                                        <Stack>
                                            <CardBody>
                                                <div className="flex flex-wrap gap-3 mb-3">
                                                    {
                                                        res.categories?.map((category: any, key: number) => (
                                                            <div key={key} className="bg-[#3b82f6]/[0.8] px-3 py-[2px] rounded-[12px] text-[13px]">
                                                                <p className="capitalize text-white">{category?.name}</p>
                                                            </div>
                                                        ))
                                                    }
                                                </div>

                                                <div className="flex gap-10 mb-3 items-center">
                                                    <p className="flex gap-1 items-center text-[14px] text-gray-500">
                                                        <GoCalendar />
                                                        {dayjs(res.created_at).format('MMM, D YYYY hh:mm:ss')}
                                                    </p>

                                                    <p className="flex gap-1 items-center text-[14px] text-gray-500">
                                                        <GoEye />
                                                        {numDifferentiation(res.views)}
                                                    </p>
                                                </div>

                                                <Heading size='md' fontWeight={600} className="text-gray-700" fontFamily={'poppins'}>{res.name}</Heading>

                                                <Text py='2' className="text-gray-500">
                                                    {res.description}
                                                </Text>
                                            </CardBody>

                                            <CardFooter>
                                                <Link href={`/news/${res.slug}`} className="text-[#3b82f6] border-[#3b82f6] border-[1px] text-[15px] px-3 py-1 rounded-[6px]">
                                                    <span className="flex items-center gap-1">
                                                        Learn More <GoArrowRight />
                                                    </span>
                                                </Link>
                                            </CardFooter>
                                        </Stack>
                                    </Card>
                                ))
                            }

                            {data?.[0]?.data?.meta?.last_page > 1 && (data?.[0]?.data?.meta?.total != news?.length) && <div className="text-center">
                                <button disabled={isValidating} onClick={() => setSize(size + 1)} className="mx-auto text-[#3b82f6] border-[#3b82f6] border-[1px] text-[14px] px-3 py-1 rounded-[6px]">

                                    <span className="flex items-center gap-1">
                                        {isValidating && <Spinner size={'sm'} />}
                                        Load More <GoChevronDown />
                                    </span>
                                </button>
                            </div>}

                        </div>

                        <div className="@3xl:w-[25%]  @3xl:order-[unset] order-1">
                            <div className="bg-white px-5 py-4 shadow-md rounded-[12px]">
                                <h3 className="font-[500] text-[18px] text-gray-700 mb-3">Categories</h3>

                                {
                                    categories?.data?.data?.map((res: any, key: number) => (
                                        <Fragment key={key}>
                                            <div className="mb-3">
                                                <Link href={'/news?category_id=' + res.id}>
                                                    <span className="flex gap-3 items-center text-gray-500 font-[400]">
                                                        <span className="bg-[#3b82f6] rounded-full text-white w-[18px] px-[3px] py-[1px] h-[18px] flex items-center juetify-center" >
                                                            <GoChevronRight color="#fff" />
                                                        </span> {res.name}
                                                    </span>
                                                </Link>
                                            </div>
                                        </Fragment>
                                    ))
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div >

            <Footer />
        </div>
    )
}