import useSWR from 'swr';
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/router";
import { MdDashboard, MdMail, MdPostAdd, MdSettings } from "react-icons/md";
import { fetcherAuth } from '@/pages/api/authApi';
import { useMediaQuery } from '@chakra-ui/react';

export default function UserSidebar() {
    const { query } = useRouter()
    const pathname = usePathname()
    const [isMobile] = useMediaQuery(`(max-width: 808px)`);

    const { data }: any = useSWR(`/user/consult?get=count`, fetcherAuth)
    const menu = () => (<div className="h-full pt-8 px-3 py-4 overflow-y-auto">
        <ul className="space-y-2 font-medium">
            <li>
                <Link
                    href="/dashboard"
                    className={`${pathname == '/dashboard' ? 'bg-blue-200 active' : ''} flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group`}
                >
                    <MdDashboard />
                    <span className="ms-3">Dashboard</span>
                </Link>
            </li>
            <li>
                <Link
                    href="/account/properties"
                    className={`${['/account/properties', '/account/properties/create', `/account/properties/edit/${query?.id}`].includes(pathname) ? 'bg-blue-200 active' : ''} flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group`}
                >
                    <MdPostAdd />
                    <span className="ms-3">Properties</span>
                </Link>
            </li>

            <li>
                <Link
                    href="/account/consult"
                    className={`${['/account/consult'].includes(pathname) ? 'bg-blue-200 active' : ''} flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group`}
                >
                    <MdMail />
                    <span className="ms-3">Consult</span>
                    {data > 0 && <span className='ml-2 bg-blue-500 text-white w-[20px] h-[20px] flex items-center justify-center text-[12px] rounded-full'>{data}</span>}
                </Link>
            </li>

            <li>
                <Link
                    href="/account/settings"
                    className={`${pathname == '/account/settings' ? 'bg-blue-200 active' : ''} flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group`}
                >
                    <MdSettings />
                    <span className="ms-3">Setting</span>
                </Link>
            </li>
        </ul>
    </div>)


    return (
        <div className={isMobile ? 'sticky top-[65px] z-[99] bg-white' : ''}>
            {isMobile && <div className='border-t mobile-dashboard'>
                {menu()}
            </div>}

            {!isMobile && <aside
                id="sidebar-multi-level-sidebar"
                className="fixed pt-[50px] top-0 left-0 z-99 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0"
                aria-label="Sidebar"
            >
                {menu()}
            </aside>}
        </div>)

}
