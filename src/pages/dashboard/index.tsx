import Navbar from "@/Components/Navbar/Navbar";
import UserSidebar from "@/Components/UserSidebar";
import { Spinner, Stat, StatArrow, StatGroup, StatHelpText, StatLabel, StatNumber } from "@chakra-ui/react";
import useSWR from 'swr'
import useSWRInfinite from 'swr/infinite'
import { fetcherAuth } from "../api/authApi";
import dayjs from "dayjs";
import { Fragment } from "react";
import { MdArrowDownward, MdLockClock, MdWarning } from "react-icons/md";
import Link from "next/link";

var relativeTime = require('dayjs/plugin/relativeTime')
dayjs.extend(relativeTime)


export default function Dashboard() {
    const { data: profile } = useSWR('/user', fetcherAuth)

    const getKey = (pageIndex: any) => {
        return `/user/activity?page=${pageIndex + 1}`;
    };
    const { data: activity, size, setSize, isValidating }: any = useSWRInfinite(getKey, fetcherAuth)

    let activities: any[] = [];
    if (activity) {
        activity.map((data: any) => {
            activities = [...activities, ...data?.data];
        });
    }

    return (
        <>
            <Navbar />
            <UserSidebar />

            <div className="sm:ml-64 bg-[#f5f5f9] dashboard">
                <div className="container p-8 mx-auto">
                    <StatGroup className="gap-5">
                        <Stat className="bg-white border py-4 px-5 rounded-[9px]">
                            <StatLabel>Approved Properties</StatLabel>
                            <StatNumber>{profile?.data?.approved || 0}</StatNumber>
                            <StatHelpText marginBottom={0}>
                                <StatArrow type='increase' />
                                Approved by admin
                            </StatHelpText>
                        </Stat>

                        <Stat className="bg-white border py-4 px-5 rounded-[9px]">
                            <StatLabel>Pending approve properties</StatLabel>
                            <StatNumber>{profile?.data?.pending || 0}</StatNumber>
                            <StatHelpText marginBottom={0}>
                                <StatArrow type='increase' />
                                To be seen by admin
                            </StatHelpText>
                        </Stat>

                        <Stat className="bg-white border py-4 px-5 rounded-[9px]">
                            <StatLabel>Rejected properties</StatLabel>
                            <StatNumber>{profile?.data?.rejected || 0}</StatNumber>
                            <StatHelpText marginBottom={0}>
                                <StatArrow type='decrease' />
                                Rejected by admin
                            </StatHelpText>
                        </Stat>

                        <Stat className="bg-white border py-4 px-5 rounded-[9px]">
                            <StatLabel>Total properties</StatLabel>
                            <StatNumber>{profile?.data?.total || 0}</StatNumber>
                            <StatHelpText marginBottom={0}>
                                <StatArrow type='increase' />
                                Total till {dayjs().format('MMM DD, YYYY')}
                            </StatHelpText>
                        </Stat>
                    </StatGroup>


                    <div className="bg-white border rounded-[9px] mt-5 p-5">
                        <h4 className="font-[500] text-[15px] border-b pb-3">Activity Logs</h4>
                        <div className="mt-5">
                            {
                                activities?.map((res: any, key: number) => (
                                    <Fragment key={key}>
                                        <div className="flex items-center gap-1 text-[14px] text-gray-500 mb-4">
                                            <MdLockClock size={18} /> Your property <Link href={res.reference_url} className="text-blue-500">{res.reference_name}</Link> is updated by administrator. {dayjs(res.updated_at).fromNow(true)} ago
                                        </div>
                                    </Fragment>
                                ))
                            }
                            <div>
                                {activities?.length != activity?.[0]?.total && <div onClick={() => { setSize(size + 1) }} className="cursor-pointer text-blue-500 text-[14px] flex gap-1 items-center">{isValidating && <Spinner size={"sm"} />} Load More <MdArrowDownward /></div>}
                            </div>

                            {
                                activities?.length === 0 && <div>
                                    <p className="font-[500] flex items-center gap-1 text-[15px]"><MdWarning /> No data Found!</p>
                                </div>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}