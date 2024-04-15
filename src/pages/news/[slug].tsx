import Footer from "@/Components/Footer/Footer";
import Navbar from "@/Components/Navbar/Navbar";
import useSWRInfinite from "swr/infinite";
import useSWR from "swr";
import { fetcher } from "../api/api";
import { Breadcrumb, BreadcrumbItem, Button, Card, CardBody, CardFooter, Heading, Image, Input, InputGroup, InputLeftElement, Spinner, Stack, Text } from "@chakra-ui/react";
import Link from "next/link";
import { MdSearch } from "react-icons/md";
import { GoArrowRight, GoCalendar, GoChevronDown, GoChevronRight, GoEye } from "react-icons/go";
import { Fragment } from "react";
import dayjs from "dayjs";
import numDifferentiation, { apiURL } from "@/Constant/helper";
import axios from "axios";


export default function News({ news }: any) {
    const { data: categories } = useSWR('/v1/categories', fetcher)
    const { data: recentPost } = useSWR(`/v1/posts?type=recent&id=${news?.id}`, fetcher)
    let data = news.data;

    function handleSearch(e: any) {
        // setKeyword(e.target.value)
        // setPage(1)
    }

    function extractVideoIdFromUrl(url: any) {
        var regExp = /[?&]v=([^&]+)/;
        var match = url?.match(regExp);
        if (match && match.length > 1) {
            return match[1];
        } else {
            console.error("No video ID found in URL");
            return null;
        }
    }

    function extractYouTubeVideoId(text: any) {
        var regExp = /\[youtube-video\](.*?)\[\/youtube-video\]/;
        var match = text.match(regExp);
        if (match && match.length > 1) {
            return match[1];
        } else {
            console.error("No YouTube video ID found");
            return null;
        }
    }

    let content = data?.content.replace(`[youtube-video]${extractYouTubeVideoId(data?.content)}[/youtube-video]`, `<iframe src="https://www.youtube.com/embed/${extractVideoIdFromUrl(extractYouTubeVideoId(data?.content))}" class="w-[100%] h-[400px] mb-4" allowfullscreen="" frameborder="0"></iframe>`)

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
                    <Link className="font-[500] text-[#394e66]" href='/news'>
                        News
                    </Link>

                </BreadcrumbItem>

                <BreadcrumbItem isCurrentPage>
                    <Link className="font-[500] text-[#394e66]" href=''>
                        {data?.name}
                    </Link>
                </BreadcrumbItem>
            </Breadcrumb>


            <div className="relative border-b">
                <img src="/assets/bg.png" className=" h-[200px] w-[100%] object-cover" alt="" />
                <div className="absolute top-0 bottom-0 items-center w-[100%] flex ">
                    <div className="text-center flex flex-wrap w-[100%]">
                        <h5 className="mx-auto justify-center mb-4 w-[100%] font-[600] text-gray-700 text-2xl flex gap-1 items-center">
                            {data?.name}
                        </h5>
                    </div>
                </div>
            </div>

            <div className="bg-gradient @container">
                <div className="@7xl:container mx-auto py-20 px-4">
                    <div className="grid @5xl:flex gap-10">
                        <div className="@5xl:w-[75%] news">
                            <div className="flex gap-4 mb-3 items-center">
                                <p className="bg-[#0E578C]/[0.3] px-3 py-[2px] rounded-[12px] text-[14px] flex gap-1 items-center text-gray-700">
                                    <GoCalendar />
                                    {dayjs(data.created_at).format('MMM, D YYYY hh:mm:ss')}
                                </p>

                                <p className="bg-[#0E578C]/[0.3] px-3 py-[2px] rounded-[12px] text-[14px] flex gap-1 items-center text-gray-700">
                                    <GoEye />
                                    {numDifferentiation(data.views)}
                                </p>
                            </div>
                            {/* <iframe src="https://www.youtube.com/embed/SlPhMPnQ58k" class="page_speed_1426326087" allowfullscreen="" frameborder="0"></iframe> */}

                            <div dangerouslySetInnerHTML={{ __html: content }}></div>

                        </div>

                        <div className="@5xl:w-[25%] @5xl:order-[unset] order-1">
                            <div className="bg-white px-5 py-4 shadow-md rounded-[12px]">
                                <h3 className="font-[500] text-[18px] text-gray-700 mb-3">Categories</h3>

                                {
                                    categories?.data?.data?.map((res: any, key: number) => (
                                        <Fragment key={key}>
                                            <div className="mb-3">
                                                <Link href={'/news/?category_id=' + res.id}>
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

                            <div className="bg-white px-5 py-4 shadow-md rounded-[12px] mt-7">
                                <h3 className="font-[500] text-[18px] text-gray-700 mb-3">Recent News</h3>

                                {
                                    recentPost?.data?.data?.map((res: any, key: number) => (
                                        <Fragment key={key}>
                                            <div className="mb-3">
                                                <Link href={`/news/${res.slug}`}>
                                                    <span className="flex gap-3 items-center text-gray-700 text-[14px] font-[500]">
                                                        <span className="text-white flex items-center juetify-center" >
                                                            <img className="min-w-[50px] w-[50px] rounded-[6px]" src={res.image} />
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
        </>
    )
}

export async function getServerSideProps({ req, res, params }: any) {
    console.log(params.slug)
    const news: any = await axios.get(apiURL + `v1/posts/${params?.slug}`)

    return {
        props: {
            news: JSON.parse(JSON.stringify(news?.data))
        }
    }
}