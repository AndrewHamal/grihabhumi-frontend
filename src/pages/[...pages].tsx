import Footer from "@/Components/Footer/Footer";
import Navbar from "@/Components/Navbar/Navbar";
import { apiURL } from "@/Constant/helper";
import { Breadcrumb, BreadcrumbItem } from "@chakra-ui/react";
import axios from "axios";
import Link from "next/link";

export default function Pages({ data }: any) {
    console.log(data)

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

                <BreadcrumbItem isCurrentPage>
                    <Link className="font-[500] text-[#394e66]" href='/#services'>
                        {data.name}
                    </Link>
                </BreadcrumbItem>
            </Breadcrumb>


            <div className="relative border-b">
                <img src="/assets/bg.png" className=" h-[200px] w-[100%] object-cover" alt="" />

                <div className="absolute top-0 bottom-0 items-center w-[100%] flex ">
                    <div className="text-center flex flex-wrap w-[100%]">
                        <h5 className="mx-auto justify-center mb-4 w-[100%] font-[600] text-gray-700 text-2xl flex gap-1 items-center">
                            {data.name}
                        </h5>
                    </div>
                </div>
            </div>


            <div className="container mx-auto py-20">
                <div dangerouslySetInnerHTML={{ __html: content }}></div>
            </div>



            <Footer />
        </>
    )
}

export async function getServerSideProps({ req, res, params }: any) {
    let page = params?.pages?.[0];
    const pageData = await axios.get(apiURL + 'page/' + page);

    return {
        props: {
            data: pageData.data
        },
    };
}