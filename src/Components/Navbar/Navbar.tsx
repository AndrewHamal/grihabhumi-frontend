import React, { useCallback, useEffect, useState } from "react";
import {
    Box,
    Flex,
    Text,
    Menu,
    MenuButton,
    IconButton,
    MenuList,
    MenuItem,
    Avatar,
    Input,
    useDisclosure,
    useMediaQuery,
    Drawer,
    DrawerOverlay,
    DrawerContent,
    DrawerHeader,
    DrawerBody,
} from "@chakra-ui/react";
import { ChevronDownIcon, CloseIcon, HamburgerIcon } from "@chakra-ui/icons";
import { Image } from "@chakra-ui/react";
import style from "./NavBar.module.css";
import Link from "next/link";
import useSWR from 'swr';
import { usePathname } from "next/navigation";
import { useRouter } from "next/router";
import { GrDocumentText, GrHome, GrList, GrMultiple } from "react-icons/gr";
import SignUp from "../SignUp";
import { fetcherAuth, logout } from "@/pages/api/authApi";
import { getCookie } from "cookies-next";
import { MdApartment, MdAppRegistration, MdChevronRight, MdFormatPaint, MdHome, MdHomeWork, MdHouse, MdList, MdLogin, MdLogout, MdMan4, MdPhoneForwarded, MdPlusOne, MdPostAdd, MdSearch, MdWork } from "react-icons/md";
import Logo from "../Logo";


function Navbar() {
    const { isOpen: isDrawerOpen, onOpen: onDrawerOpen, onClose: onDrawerClose } = useDisclosure()
    const router = useRouter()
    const pathname = usePathname()
    const { query } = useRouter()
    const [keyword, setKeyword] = useState('')
    const [popTab, setPopTab] = useState('login')
    const [colorChange, setColorchange] = useState(false);
    const { isOpen: isSignUpOpen, onOpen: onSignUpOpen, onClose: onSignUpClose } = useDisclosure()
    const [isMobile] = useMediaQuery(`(max-width: 808px)`);
    const cookie = getCookie('token');

    const { data: user } = useSWR(cookie ? '/user' : null, fetcherAuth)

    useEffect(() => {
        if (!['/', ''].includes(pathname)) {
            setColorchange(true)
        }
    }, [pathname]);

    useEffect(() => {
        if (query?.login == 'true') {
            onSignUpOpen()
        }
    }, [query])

    const changeNavbarColor = () => {
        if (window.scrollY >= 40) {
            setColorchange(true);
        } else {
            setColorchange(false);
        }
    };

    useEffect(() => {
        if (typeof window !== 'undefined') {
            if (['/', ''].includes(pathname)) {
                window?.addEventListener("scroll", changeNavbarColor);
            }
        }
    }, [pathname])

    const menu = (ele: any) => (<Menu>
        <MenuButton
            as={IconButton}
            aria-label="Options"
            color={colorChange ? '#555' : '#ffffffcc'}
            icon={ele ? ele : <HamburgerIcon width={5} height={5} />}
            variant="link"
            _active={{ color: colorChange ? '#555' : '#ffffffcc' }}
            minW="fit-content !important"
            className={'active:text-white'}
        />

        <MenuList overflow={'hidden'} padding={0}>
            {isMobile && !user?.data?.email && <>
                <MenuItem className="border-b ">
                    <Link href={''} onClick={() => { onSignUpOpen(); setPopTab('login') }} className="text-[14px] py-1 text-gray-500 font-[500] flex gap-2 items-center">
                        <MdLogin className="mb-[2px]" size={20} />
                        Login
                    </Link>
                </MenuItem>
                <MenuItem className="border-b">
                    <Link onClick={() => { onSignUpOpen(); setPopTab('register') }} href="/" className="text-[14px] py-1 text-gray-500 font-[500] flex gap-2 items-center">
                        <MdAppRegistration className="mb-[2px]" size={20} />
                        Register
                    </Link>
                </MenuItem>
            </>}

            {isMobile && user?.data?.email && <MenuItem onClick={() => router.push('/dashboard')}>
                <div className="flex items-center pr-4 py-1">
                    <Avatar size={'xs'} name={user?.data?.email} p="0" ml="0" />
                    <Text color={'#555'} className="font-[500]" ml={2} fontSize="14px !important" mr="-20px !important">{user?.data?.email}</Text>
                </div>
            </MenuItem>}

            <MenuItem className="border-b">
                <Link href={"/account/properties/create"} className="text-[14px] py-1 text-gray-500 font-[500] flex gap-2 items-center">
                    <MdPostAdd className="mb-[2px]" size={20} />
                    Post Your Property
                </Link>
            </MenuItem>
            <MenuItem className="border-b">
                <Link href="/services" className="text-[14px] py-1 text-gray-500 font-[500] flex gap-2 items-center">
                    <MdHomeWork className="mb-[2px]" size={20} />
                    Find Services
                    <span className="text-[11px]">(Eg: Painter, Maid, Packars & Movers)</span>
                </Link>
            </MenuItem>
            <MenuItem className="border-b">
                <Link href="/search?project=true" className="text-[14px] py-1 text-gray-500 font-[500] flex gap-2 items-center">
                    <MdApartment className="mb-[2px]" size={20} />
                    Find Projects
                </Link>
            </MenuItem>

            <MenuItem className="border-b">
                <Link href="/agencies" className="text-[14px] py-1 text-gray-500 font-[500] flex gap-2 items-center">
                    <MdWork className="mb-[2px]" size={20} />
                    Explore Agencies
                </Link>
            </MenuItem>

            <MenuItem>
                <Link href="/" className="text-[14px] py-1 text-gray-500 font-[500] flex gap-2 items-center">
                    <MdPhoneForwarded className="mb-[2px]" size={20} />
                    Contact Us
                </Link>
            </MenuItem>
        </MenuList>
    </Menu>)


    return (
        <>
            <Drawer placement={'left'} onClose={onDrawerClose} isOpen={isDrawerOpen}>
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerHeader borderBottomWidth='1px' className="flex items-center">
                        Menu
                        <CloseIcon onClick={onDrawerClose} className="ml-auto" w={3} h={3} />
                    </DrawerHeader>
                    <DrawerBody padding={0}>
                        {isMobile && !user?.data?.email && <>
                            <div className="border-b py-3 px-5">
                                <Link href={''} onClick={() => { onSignUpOpen(); setPopTab('login') }} className="text-[14px] py-1 text-gray-500 font-[500] flex gap-2 items-center">
                                    <MdLogin className="mb-[2px]" size={20} />
                                    Login
                                </Link>
                            </div>
                            <div className="border-b py-3 px-5">
                                <Link onClick={() => { onSignUpOpen(); setPopTab('register') }} href="/" className="text-[14px] py-1 text-gray-500 font-[500] flex gap-2 items-center">
                                    <MdAppRegistration className="mb-[2px]" size={20} />
                                    Register
                                </Link>
                            </div>
                        </>}

                        {isMobile && user?.data?.email && <div className="py-3 px-5" onClick={() => router.push('/dashboard')}>
                            <div className="flex items-center pr-4 py-1">
                                <Avatar size={'xs'} name={user?.data?.email} p="0" ml="0" />
                                <Text color={'#555'} className="font-[500]" ml={2} fontSize="14px !important" mr="-20px !important">{user?.data?.email}</Text>
                            </div>
                        </div>}

                        <div className="border-b py-3 px-5">
                            <Link onClick={onDrawerClose} href="/account/properties/create" className="text-[14px] py-1 text-gray-500 font-[500] flex gap-2 items-center">
                                <MdPostAdd className="mb-[2px]" size={20} />
                                Post Your Property
                            </Link>
                        </div>
                        <div className="border-b py-3 px-5">
                            <Link href="/search" className="text-[14px] py-1 text-gray-500 font-[500] flex gap-2 items-center">
                                <MdHomeWork className="mb-[2px]" size={20} />
                                Find Properties
                            </Link>
                        </div>

                        <div className="border-b py-3 px-5">
                            <Link href="/services" className="text-[14px] py-1 text-gray-500 font-[500] flex gap-2 items-center">
                                <MdFormatPaint className="mb-[2px]" size={20} />
                                Find Services
                            </Link>
                        </div>
                        <div className="border-b py-3 px-5">
                            <Link href="/search?project=true" className="text-[14px] py-1 text-gray-500 font-[500] flex gap-2 items-center">
                                <MdApartment className="mb-[2px]" size={20} />
                                Find Projects
                            </Link>
                        </div>

                        <div className="border-b py-3 px-5">
                            <Link href="/agencies" className="text-[14px] py-1 text-gray-500 font-[500] flex gap-2 items-center">
                                <MdWork className="mb-[2px]" size={20} />
                                Explore Agencies
                            </Link>
                        </div>

                        <div className="py-3 px-5">
                            <Link href="/" className="text-[14px] py-1 text-gray-500 font-[500] flex gap-2 items-center">
                                <MdPhoneForwarded className="mb-[2px]" size={20} />
                                Contact Us
                            </Link>
                        </div>
                    </DrawerBody>
                </DrawerContent>
            </Drawer>

            <Flex id="navbar"
                background={colorChange ? "#fff" : ''}
                position={!['/', '', '/dashboard', '/account/settings', '/account/consult', '/account/properties/create', '/account/properties', `/account/properties/edit/${query?.id}`, '/services'].includes(pathname) ? 'relative' : 'fixed'}
                className={style.navBarContainer + (` ${pathname === '/' ? '' : 'is-not-homepage'} `) + (colorChange ? '' : '') + (((!isMobile && pathname?.match('search')) || ['/dashboard', '/account/settings', '/account/consult', '/account/properties', '/account/properties/create', `/account/properties/edit/${query?.id}`].includes(pathname)) ? ' border-b-[1px] border-[#E2E8F0]' : '')}

            >
                <div className={isMobile ? "w-[100%] flex" : "flex"}>
                    <Box className="flex items-center hidden mr-3 hamburger">
                        {isMobile ? <>
                            <div onClick={onDrawerOpen} className="w-[20px] h-[20px]">
                                <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100%" height="100%" viewBox="0 0 50 50">
                                    <path d="M 0 7.5 L 0 12.5 L 50 12.5 L 50 7.5 Z M 0 22.5 L 0 27.5 L 50 27.5 L 50 22.5 Z M 0 37.5 L 0 42.5 L 50 42.5 L 50 37.5 Z"></path>
                                </svg>
                            </div>
                        </> : menu(<div className="w-[20px] h-[20px]">
                            <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100%" height="100%" viewBox="0 0 50 50">
                                <path d="M 0 7.5 L 0 12.5 L 50 12.5 L 50 7.5 Z M 0 22.5 L 0 27.5 L 50 27.5 L 50 22.5 Z M 0 37.5 L 0 42.5 L 50 42.5 L 50 37.5 Z"></path>
                            </svg>
                        </div>)}
                    </Box>
                    <Box>
                        <div className="flex items-center h-[100%]">
                            <Link href="/" className="logo">
                                <Logo
                                    type={(['/services', '/news', '/dashboard', '/account/consult', '/account/settings', '/account/properties', '/account/properties/create', `/projects/${query?.id}`, `/properties/${query?.id}`, `/news/${query?.slug}`, `/agencies`, `/agency/${query?.id}`].includes(decodeURI(pathname)) && isMobile) ? 'icon' : ''}
                                    color={isMobile ? "black" : (colorChange ? "black" : "white")}
                                    className={isMobile ? "h-[43px] w-[150px]" : "w-[155px]"}
                                />
                            </Link>
                        </div>
                    </Box>

                    {isMobile && pathname != '/' &&
                        <form className="flex-grow" onSubmit={(e) => { e.preventDefault(); router.push('/search?keyword=' + keyword) }}>
                            <div className="ml-3 relative flex-grow">
                                <Input
                                    placeholder='Search by Keyword'
                                    fontSize={15}
                                    background={"#fff"}
                                    style={{ borderColor: '#0E578C!important' }}
                                    minW={'100%'}
                                    height={'40px'}
                                    onKeyUp={(e: any) => setKeyword(e.target.value)}
                                />
                                {/* <button type="submit" onClick={() => router.push('/search?keyword=' + keyword)} className="z-[99] top-[50%] translate-y-[-50%] absolute right-[6px] border-[1px] border-blue-300 text-[13px] px-2 py-1 rounded-[6px]">
                                    Done
                                </button> */}
                            </div>
                        </form>
                    }
                </div>

                <Flex id="group-right-nav" gap={4}>

                    <Link href="/search">
                        <Flex id="tabs-1-tab-1" fontWeight={pathname == '/search' ? 500 : 400} color={colorChange ? '#555' : ''} className={style.payRent}>
                            <GrHome /> Properties
                        </Flex>
                    </Link>

                    <Link href="/agencies">
                        <Flex fontWeight={pathname == '/agencies' ? 500 : 400} color={colorChange ? '#555' : ''} className={style.payRent}>
                            <GrMultiple />
                            Agencies
                        </Flex>
                    </Link>

                    <Link href="/news">
                        <Flex fontWeight={pathname == '/news' ? 500 : 400} id="tabs-1-tab-1" color={colorChange ? '#555' : ''} className={style.payRent}>
                            <GrDocumentText /> News
                        </Flex>
                    </Link>

                    <Link href={"/account/properties/create"}>
                        <Flex
                            className={style.payRent}
                            bgColor="#009587"
                            color="white"
                            borderRadius="4px"
                        >
                            {user?.data?.email && <MdPostAdd />}
                            {user?.data?.email ? 'Post property' : 'For Property owners'}
                        </Flex>
                    </Link>

                    {!user?.data?.email ? (
                        <Flex alignItems="center">
                            <button onClick={() => { onSignUpOpen(); setPopTab('register') }}>
                                <Text color={colorChange ? '#555' : ''} borderRightColor={colorChange ? "#777777a8" : ""} className={style.loginSingUp}>Sign Up</Text>
                            </button>
                            <div className={`h-[60%] w-[1px] ${colorChange ? 'bg-[#777777a8]' : 'bg-[#ffffff40]'}`}></div>
                            <Link href="/" onClick={() => { onSignUpOpen(); setPopTab('login') }}>
                                <Text color={colorChange ? '#555' : ''} borderRightColor={colorChange ? "#777777a8" : ""} className={style.loginSingUp}>Log In</Text>
                            </Link>
                            <div className={`h-[60%] w-[1px] ${colorChange ? 'bg-[#777777a8]' : 'bg-[#ffffff40]'}`}></div>
                        </Flex>
                    ) : (
                        <Flex p="0px" alignItems="center" gap={1}>
                            <Box className={style.userDetailBox} p="0px 2px">
                                <Menu >
                                    <MenuButton
                                        as={IconButton}
                                        aria-label="Options"
                                        variant="link"
                                        fontSize="20px !important"
                                        rightIcon={<ChevronDownIcon color={colorChange ? '#555' : '#ffffffcc'} />}
                                    >
                                        <div className="flex items-center pr-4">
                                            <Avatar size={'xs'} name={user?.data?.email} p="0" ml="0" />
                                            <Text color={colorChange ? '#555' : '#ffffffcc'} className="font-[500]" ml={2} fontSize="14px !important" mr="-20px !important">
                                                {(user?.data?.first_name ? (user?.data?.first_name + ' ' + user?.data?.last_name) : (user?.data?.email ? user?.data?.email?.slice(0, 20) : ""))}
                                            </Text>
                                        </div>
                                    </MenuButton>

                                    <MenuList>
                                        <MenuItem>
                                            <Link href="/dashboard">
                                                <div className="flex items-center justify-between gap-1 mb-[1px]"> Profile <MdChevronRight size={16} /></div>
                                            </Link>
                                        </MenuItem>
                                        <MenuItem>
                                            <Link href="/account/properties/create">
                                                <div className="flex items-center justify-between gap-1 mb-[1px]"> Post a property <MdPostAdd size={16} /></div>
                                            </Link>
                                        </MenuItem>
                                        <MenuItem border={0}>
                                            <Link href="" onClick={logout}>
                                                <div className="flex items-center text-red-500 justify-between gap-1 mb-[1px]"> Logout <MdLogout size={16} /></div>
                                            </Link>
                                        </MenuItem>
                                    </MenuList>
                                </Menu>
                            </Box>
                        </Flex>
                    )}
                    <Box className={'flex'}>
                        {menu('')}
                    </Box>
                </Flex>

                {pathname === '/' && <div className="nav-switch-wrapper left-0 right-0 hidden absolute flex justify-center bottom-[-20px]">
                    <div className="flex items-center gap-5 p-[6px] border bg-white nav-switch">
                        <Link href={'/search'}>
                            <div className={!pathname?.match('search') ? "bg-[#0e578ce0] flex py-[4px] px-4 rounded-[30px]" : ''}>
                                <div style={{ backgroundImage: 'url("/assets/home-search.svg")' }} className="prop-search w-[17px] h-[17px] mr-1 my-auto"></div>
                                <Text color={"#fff"} align={"center"} fontWeight={500} fontSize={14}>
                                    Property Search
                                </Text>
                            </div>
                        </Link>

                        <Link href={'/services'}>
                            <div className={pathname?.match('home-serivces') ? " py-2 rounded-[30px] flex" : 'flex pr-4'}>
                                <div style={{ backgroundImage: 'url("/assets/home-search.svg")' }} className="prop-home w-[17px] h-[17px] mr-1 my-auto"></div>
                                <Text align={"center"} fontSize={14} fontWeight={500}>
                                    Home Services
                                </Text>
                            </div>
                        </Link>
                    </div>
                </div>}
            </Flex >

            <SignUp
                isOpen={isSignUpOpen}
                onClose={onSignUpClose}
                popTab={popTab}
            />
        </>
    )
}

export default Navbar;
