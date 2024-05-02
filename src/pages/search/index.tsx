import Navbar from "@/Components/Navbar/Navbar";
import { Avatar, Badge, Box, Button, Drawer, DrawerBody, DrawerContent, DrawerHeader, DrawerOverlay, IconButton, Image, Input, Menu, MenuButton, MenuDivider, MenuItem, MenuList, RangeSlider, RangeSliderFilledTrack, RangeSliderThumb, RangeSliderTrack, Select, Skeleton, SkeletonCircle, SkeletonText, Spinner, Tab, TabList, Tabs, Text, useDisclosure, useMediaQuery } from "@chakra-ui/react";
import React, { Fragment, useCallback, useEffect, useState } from "react"
import { Controller, useForm, useWatch } from "react-hook-form";
import { fetcher } from "../api/api";
import useSWR from 'swr'
import useSWRInfinite from 'swr/infinite'
import Sidebar from "@/Components/Sidebar";
import SearchCard from "@/Components/SearchCard";
import { useRouter } from "next/router";
import { BsExclamationCircle } from "react-icons/bs";
import dynamic from "next/dynamic";
const Map = dynamic(() => import("@/Components/Map"), { ssr: false })
import { ChevronDownIcon, CloseIcon, HamburgerIcon, SearchIcon } from "@chakra-ui/icons";
import { debounce, isArray } from "lodash";
import Link from "next/link";
import SearchModal from "@/Components/SearchModal";
import numDifferentiation, { conditionList, paramValue } from "@/Constant/helper";
import { MdApartment, MdAppRegistration, MdDashboardCustomize, MdFormatPaint, MdHomeWork, MdListAlt, MdLogin, MdMap, MdPhoneForwarded, MdPostAdd, MdWork } from "react-icons/md";
import PropertyCard from "@/Components/PropertyCard";
import SignUp from "@/Components/SignUp";
import { fetcherAuth } from "../api/authApi";
import { getCookie } from "cookies-next";
import MultiMenuSelect from "@/Components/MultiMenuSelect";
import { toast } from "react-toastify";
import Logo from "@/Components/Logo";

function Search() {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [searchParams, setSearchParams] = useState('');
    const [tab, setTab] = useState('')
    const route: any = useRouter();
    const { data: cities } = useSWR('/cities', fetcher)

    const [isClient, setIsClient] = useState(false)
    const { control, handleSubmit, watch, reset }: any = useForm();
    const { isOpen: isSignUpOpen, onOpen: onSignUpOpen, onClose: onSignUpClose } = useDisclosure()
    const { isOpen: isDrawerOpen, onOpen: onDrawerOpen, onClose: onDrawerClose } = useDisclosure()
    const [popTab, setPopTab] = useState('login')
    const cookie = getCookie('token');

    const getKey = (pageIndex: any, previousPageData: any) => {
        if (previousPageData && previousPageData?.data?.last_page == pageIndex) return null;
        return `/properties?response=api&page=${pageIndex + 1}&${searchParams}`;
    };

    const { data, isValidating, size, setSize } = useSWRInfinite(getKey, fetcher)

    let properties: any[] = [];
    if (data) {
        data.map((data: any) => {
            properties = [...properties, ...data?.data?.data];
        });
    }

    const onscroll = (e: any) => {
        const scrollHeight = e.target.documentElement.scrollHeight;
        const currentHeight =
            e.target.documentElement.scrollTop + window.innerHeight;

        if (currentHeight + 1 >= scrollHeight) {
            if (properties?.length != data?.[0]?.data?.total)
                setSize(size + 1)
        }
    };


    useEffect(() => {
        if (typeof window != 'undefined')
            window.addEventListener("scroll", onscroll);

        return () => window.removeEventListener("scroll", onscroll);
    }, [data, properties, size, setSize])


    const { data: user, error } = useSWR(cookie ? '/user' : null, fetcherAuth)

    const [isMobile] = useMediaQuery(`(max-width: 808px)`);
    const [isSmMobile] = useMediaQuery(`(max-width: 467px)`);

    const debounceFn = useCallback(debounce(handleDebounceFn, 500), []);

    const loader = (
        <div className="rounded p-4 mb-11 bg-white">
            <Box className=" gap-4 flex">
                <Skeleton width={"40%"} rounded={6} height={130} size='10' />
                <div className="flex-grow">
                    <SkeletonText noOfLines={4} spacing='2' skeletonHeight='3' />
                </div>
            </Box>
            <SkeletonText mt="4" noOfLines={2} spacing='2' skeletonHeight='3' />
        </ div>
    )

    const mapUrl = (data: any) => {
        if (data?.min_price)
            data.min_price = (data?.price_range?.[0] === 0 ? '' : data?.price_range?.[0]) || (data?.min_price === 0 ? '' : data?.min_price);

        if (data?.max_price)
            data.max_price = (data?.price_range?.[1] == '100000000' ? '' : data?.price_range?.[1]) || data?.max_price;

        if (data?.property_type)
            data.property_type = isArray(data.property_type) ? data.property_type?.filter((res: any) => typeof res != 'undefined' && res != '') : data.property_type

        if (data?.furnishing)
            data.furnishing = isArray(data.furnishing) ? data.furnishing?.filter((res: any) => typeof res != 'undefined' && res != '') : data.furnishing

        if (data?.condition)
            data.condition = isArray(data.condition) ? data.condition?.filter((res: any) => typeof res != 'undefined' && res != '') : data.condition

        if (data?.property_type)
            data.property_type = isArray(data.property_type) ? data.property_type?.filter((res: any) => typeof res != 'undefined' && res != '') : data.property_type

        if (data?.availability)
            data.availability = isArray(data.availability) ? data.availability?.filter((res: any) => typeof res != 'undefined' && res != '') : data.availability

        if (data?.house_type)
            data.house_type = isArray(data.house_type) ? data.house_type?.filter((res: any) => typeof res != 'undefined' && res != '') : data.house_type

        if (data?.city_id)
            data.city_id = isArray(data.city_id) ? data.city_id?.filter((res: any) => typeof res != 'undefined' && res != '') : data.city_id

        if (data?.category_id)
            data.category_id = isArray(data.category_id) ? data.category_id?.filter((res: any) => typeof res != 'undefined' && res != '') : data.category_id

        if (data?.price_range)
            delete data.price_range;

        const parts = Object?.entries(data)?.map((param: any) => {
            if (typeof param[1] != 'undefined' && param[1] != 'undefined' && param[1] != '')
                return (
                    encodeURIComponent(param[0]) + '=' +
                    encodeURIComponent(param[1])
                );
        });

        const url = parts.join('&');
        return url;
    }

    function onSubmit(data: any) {
        console.log(data)
        if (parseInt(data?.min_price) > parseInt(data?.max_price)) {
            toast.error('Max Price should be greater than Min Price')
            return;
        }

        let searchData = {}
        Object.entries(data).map((res: any) => {
            if (res[1] != 'undefined' && typeof res[1] != 'undefined' && res[1] != '') {
                let key = res[0]
                let getMultiArray = (['category_id', 'property_type', 'furnishing', 'house_type', 'availability', 'city_id', 'condition'].includes(key) && isArray(res[1])) ? res[1]?.map((res: any) => (res?._id || res)) : res[1]
                searchData = { ...searchData, [key]: (getMultiArray) }
            }
        })
        onClose();
        console.log('das', searchData)
        route.push({ pathname: '/search', query: searchData })
    }

    useEffect(() => {
        let queryParam: any = route.query;
        if (Object.keys(queryParam)?.length > 0) {
            reset({
                ...queryParam,
                category_id: paramValue(queryParam?.category_id),
                property_type: paramValue(queryParam?.property_type),
                furnishing: paramValue(queryParam?.furnishing),
                house_type: paramValue(queryParam?.house_type),
                availability: paramValue(queryParam?.availability),
                condition: paramValue(queryParam?.condition),
                city_id: paramValue(queryParam?.city_id)
            })
        } else {
            reset({
                max_price: '',
                min_price: '',
                keyword: '',
            })
        }

        if (route.query) {
            setSearchParams(mapUrl(queryParam))
        }

    }, [route.query])

    function handleDebounceFn(e: any, onChange: any) {
        onChange(e.target.value)
        handleSubmit(onSubmit)()
    }

    const cityCount = isArray(watch('city_id')) ? watch('city_id')?.filter((res: any) => typeof res?._id != 'undefined' && res?._id != '') : 0
    const conditionCount = isArray(watch('condition')) ? watch('condition')?.filter((res: any) => typeof res?._id != 'undefined' && res?._id != '') : 0
    const city_id = useWatch({ control, name: 'city_id' }) || watch('city_id') || []

    const condition = useWatch({ control, name: 'condition' }) || []

    const category_id = useWatch({ control, name: "category_id" })?.filter((res: any) => typeof res?._id != 'undefined' && res?._id != '')?.length || 0
    const house_type = useWatch({ control, name: "house_type" })?.filter((res: any) => typeof res?._id != 'undefined' && res?._id != '')?.length || 0
    const bhk = useWatch({ control, name: "property_type" })?.filter((res: any) => typeof res?._id != 'undefined' && res?._id != '').length || 0
    const availability = useWatch({ control, name: "availability" })?.filter((res: any) => typeof res?._id != 'undefined' && res?._id != '').length || 0
    const furnishing = useWatch({ control, name: "furnishing" })?.filter((res: any) => typeof res?._id != 'undefined' && res?._id != '').length || 0

    let totalFilter =
        parseInt(category_id) +
        parseInt(house_type) +
        parseInt(bhk) +
        parseInt(availability) +
        parseInt(furnishing) +
        (isMobile ? ((watch('min_price') ? 1 : 0) +
            (watch('max_price') ? 1 : 0)) : 0)

    useEffect(() => {
        if (isMobile) setTab('1')
    }, [isMobile])

    useEffect(() => {
        setIsClient(true)
    }, [])

    if (!isClient) return ''

    return (
        <div className="search-screen">
            {!isMobile && <Navbar />}
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

                        {isMobile && user?.data?.email && <div className="py-3 px-5" onClick={() => route.push('/dashboard')}>
                            <div className="flex items-center pr-4 py-1">
                                <Avatar size={'xs'} name={user?.data?.email} p="0" ml="0" />
                                <Text color={'#555'} className="font-[500]" ml={2} fontSize="14px !important" mr="-20px !important">{user?.data?.email}</Text>
                            </div>
                        </div>}

                        <div className="border-b py-3 px-5">
                            <Link href="/account/properties/create" className="text-[14px] py-1 text-gray-500 font-[500] flex gap-2 items-center">
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

            <>
                <div className={`${isMobile ? 'fixed top-0 left-0 right-0' : 'top-[61px] sticky'} z-[9] bg-white border-b`}>
                    <div className="search">
                        <div className="flex items-center py-[8px] gap-2 overflow-x-scroll no-scrollbar desktop-filter px-2">
                            {isMobile && <Link className="my-auto ml-1 mr-2" href={"/"}>
                                <Logo type='icon' />
                            </Link>}

                            <div className={`relative ${isMobile ? 'w-[100%]' : 'mr-2'}`}>
                                <Controller
                                    name="keyword"
                                    control={control}
                                    render={({ field: { onChange, value } }) => (
                                        <Input
                                            onKeyUp={(e) => debounceFn(e, onChange)}
                                            placeholder='Search by Keyword'
                                            fontSize={15}
                                            defaultValue={value}
                                            minW={isMobile ? '100%' : '250px'}
                                            height={!isMobile ? "42px" : '40px'}
                                        />
                                    )}
                                />

                                <button className="absolute right-[10px] top-[50%] translate-y-[-50%] bottom-0">
                                    <SearchIcon color={"#54545a"} width={"17px"} height={"17px"} className="m-auto pb-[2px]" />
                                </button>
                            </div>

                            {isMobile && <div className="ml-1">
                                <SignUp
                                    isOpen={isSignUpOpen}
                                    onClose={onSignUpClose}
                                    popTab={popTab}
                                />

                                <HamburgerIcon onClick={onDrawerOpen} width={5} height={5} />

                            </div>}

                            {!isMobile && <>
                                <div>
                                    <Controller
                                        name="type"
                                        control={control}
                                        render={({ field: { onChange, value } }) => (
                                            <Select value={value} iconSize={"14px"} placeholder="Sale/Rent" onChange={(e) => { onChange(e); handleSubmit(onSubmit)() }} fontSize={14} color={"gray"}>
                                                <option value={''} >Any</option>
                                                <option value={'sale'}>For Sale</option>
                                                <option value={'rent'}>For Rent</option>
                                            </Select>)}
                                    />

                                </div>

                                <div>
                                    <Menu closeOnSelect={false}>
                                        <MenuButton as={Button} size={"sm"} rightIcon={<ChevronDownIcon />} border="1px solid #e2e2e2 !important" borderRadius="0" bgColor="#fff" fontWeight="400">
                                            Location {cityCount?.length > 0 && <span className="text-green-500 font-[500]">[{cityCount?.length}]</span>}
                                        </MenuButton>


                                        <MenuList rounded={0} className={'rounded-0'}>
                                            {!cities ? <div className="text-[16px] ml-2">Loading...</div> :
                                                <MultiMenuSelect
                                                    control={control}
                                                    name="city_id"
                                                    arrayData={cities?.data}
                                                />}

                                            <MenuItem closeOnSelect w={"100%"} className="mt-3">
                                                <div className="w-[100%]">
                                                    <button onClick={handleSubmit(onSubmit)} className="btn-primary w-[100%] font-[500] text-[13px]"> Apply</button>
                                                </div>
                                            </MenuItem>
                                        </MenuList>
                                    </Menu>

                                </div>

                                <div>
                                    <Menu closeOnSelect={false}>
                                        <MenuButton px={3} size={'sm'} as={Button} rightIcon={<ChevronDownIcon />} border="1px solid #e2e2e2 !important" borderRadius="0" bgColor="#fcfcfc" fontWeight="400">
                                            Condition {conditionCount?.length > 0 && <span className="text-green-500 font-[500]">[{conditionCount?.length}]</span>}
                                        </MenuButton>
                                        <MenuList rounded={0} className={'rounded-0'}>
                                            <MultiMenuSelect
                                                control={control}
                                                name="condition"
                                                arrayData={conditionList}
                                            />
                                            <MenuItem closeOnSelect w={"100%"} className="mt-3">
                                                <div className="w-[100%]">
                                                    <button onClick={handleSubmit(onSubmit)} className="btn-primary w-[100%] font-[500] text-[13px]"> Apply</button>
                                                </div>
                                            </MenuItem>
                                        </MenuList>
                                    </Menu>


                                </div>

                                <div>
                                    <Menu closeOnSelect={false}>
                                        <MenuButton
                                            as={Button}
                                            bgColor="#fcfcfc"
                                            border="1px solid #e2e2e2 !important"
                                            rightIcon={<ChevronDownIcon />}
                                        >
                                            {(watch('min_price') || watch('max_price')) ? <span className="font-[500] text-blue-500">Rs. {((watch('min_price') ? numDifferentiation(watch('min_price')) : 'Min') + '-' + (watch('max_price') ? numDifferentiation(watch('max_price')) : 'Max'))}</span> :
                                                <span>Price Range</span>}
                                        </MenuButton>
                                        <MenuList bg={'blue.50'}>
                                            <MenuItem bg={'blue.50'} _active={{ bg: '' }} _focus={{ bg: '' }} _hover={{ bg: '' }} onClick={e => e.stopPropagation()} blur={false}>
                                                <label htmlFor="" className="text-[12px] font-[500] leading-[15px]">Min Price</label>
                                                <Controller
                                                    name="min_price"
                                                    control={control}
                                                    render={({ field: { onChange, value } }) => (
                                                        <Input
                                                            type="number"
                                                            onKeyUp={(e: any) => onChange(e.target.value === 0 ? '' : e.target.value)}
                                                            onClick={e => e.stopPropagation()}
                                                            placeholder='Min Price (Rs.)'
                                                            fontSize={14}
                                                            defaultValue={value}
                                                            background={'#fff'}
                                                            className="px-11"
                                                        />
                                                    )}
                                                />
                                            </MenuItem>

                                            <MenuItem bg={'blue.50'} _active={{ bg: '' }} _focus={{ bg: '' }} _hover={{ bg: '' }} onClick={e => e.stopPropagation()} blur={false}>
                                                <label htmlFor="" className="text-[12px] font-[500] leading-[15px]">Max Price</label>
                                                <Controller
                                                    name="max_price"
                                                    control={control}
                                                    render={({ field: { onChange, value } }) => (
                                                        <Input
                                                            type="number"
                                                            onKeyUp={(e: any) => onChange(e.target.value === 0 ? '' : e.target.value)}
                                                            onClick={e => e.stopPropagation()}
                                                            placeholder='Max Price (Rs.)'
                                                            fontSize={14}
                                                            defaultValue={value}
                                                            className="px-11"
                                                            background={'#fff'}
                                                        />
                                                    )}
                                                />
                                            </MenuItem>

                                            <MenuItem closeOnSelect={true} bg={'blue.50'} _active={{ bg: '' }} _focus={{ bg: '' }} _hover={{ bg: '' }} onClick={e => e.stopPropagation()} blur={false}>
                                                <button onClick={handleSubmit(onSubmit)} className="btn-primary w-[100%] font-[500] text-[13px]"> Apply</button>
                                            </MenuItem>
                                        </MenuList>
                                    </Menu>
                                </div>

                                <div>
                                    <Menu closeOnSelect={false}>
                                        <MenuButton
                                            as={Button}
                                            bgColor="#fcfcfc"
                                            border="1px solid #e2e2e2 !important"
                                            rightIcon={<ChevronDownIcon />}
                                        >
                                            {watch('bedroom') ? <span className="font-[500] text-blue-500">{watch('bedroom')} bed</span> :
                                                <span>Beds</span>}
                                            {watch('bathroom') ? <span className="font-[500] text-blue-500"> & {watch('bathroom')} bath</span> :
                                                <span> & Baths</span>}
                                        </MenuButton>
                                        <MenuList bg={'blue.50'}>
                                            <MenuItem bg={'blue.50'} _active={{ bg: '' }} _focus={{ bg: '' }} _hover={{ bg: '' }} onClick={e => e.stopPropagation()} blur={false}>
                                                <label htmlFor="" className="text-[12px] font-[500] leading-[15px] mr-2">Bedroom</label>
                                                <Controller
                                                    name="bedroom"
                                                    control={control}
                                                    render={({ field: { onChange, value } }) => (
                                                        <Select value={value} onChange={(e) => onChange(e.target.value)} background={"#fff"} fontSize={13} onClick={e => e.stopPropagation()} placeholder="Any">
                                                            {[1, 2, 3, 4, 5, 6, 7].map((res: any, key: number) => (
                                                                <option value={res} key={key}>{res}</option>
                                                            ))}
                                                        </Select>
                                                    )}
                                                />
                                            </MenuItem>

                                            <MenuItem bg={'blue.50'} _active={{ bg: '' }} _focus={{ bg: '' }} _hover={{ bg: '' }} onClick={e => e.stopPropagation()} blur={false}>
                                                <label htmlFor="" className="text-[12px] font-[500] leading-[15px] mr-2">Bathroom</label>
                                                <Controller
                                                    name="bathroom"
                                                    control={control}
                                                    render={({ field: { onChange, value } }) => (
                                                        <Select value={value} onChange={(e) => onChange(e.target.value)} background={"#fff"} fontSize={13} onClick={e => e.stopPropagation()} placeholder="Any">
                                                            {[1, 2, 3, 4, 5, 6, 7].map((res: any, key: number) => (
                                                                <option value={res} key={key}>{res}</option>
                                                            ))}
                                                        </Select>
                                                    )}
                                                />
                                            </MenuItem>

                                            <MenuItem closeOnSelect={true} bg={'blue.50'} _active={{ bg: '' }} _focus={{ bg: '' }} _hover={{ bg: '' }} onClick={e => e.stopPropagation()} blur={false}>
                                                <button onClick={handleSubmit(onSubmit)} className="btn-primary w-[100%] font-[500] text-[13px]"> Apply</button>
                                            </MenuItem>
                                        </MenuList>
                                    </Menu>
                                </div>

                                <Sidebar
                                    watch={watch}
                                    control={control}
                                    totalFilter={totalFilter}
                                    handleSubmit={handleSubmit(onSubmit)}
                                />
                            </>}
                        </div>

                        {isMobile && <div className="flex gap-2 px-2 pb-1  mobile-filter-bar">
                            <div className="mr-1">
                                <button onClick={onOpen} className="relative">
                                    {totalFilter > 0 && <Badge className="absolute top-[-6px] left-[-4px]" rounded={50} colorScheme='green'>
                                        {totalFilter > 9 ? '9+' : totalFilter}
                                    </Badge>}
                                    <MdDashboardCustomize size={30} />
                                </button>
                            </div>

                            <div className="flex gap-2 overflow-x-scroll no-scrollbar">

                                <div className="flex-grow">
                                    <Controller
                                        name="type"
                                        control={control}
                                        render={({ field: { onChange, value } }) => (
                                            <Select paddingRight={0} iconSize={'12px'} size={'sm'} value={value} placeholder="Sale/Rent" onChange={(e) => { onChange(e); handleSubmit(onSubmit)() }}>
                                                <option value={''} >Any</option>
                                                <option value={'sale'}>For Sale</option>
                                                <option value={'rent'}>For Rent</option>
                                            </Select>)}
                                    />

                                </div>

                                <div className="flex-grow">
                                    <Menu closeOnSelect={false}>
                                        <MenuButton as={Button} size={"sm"} rightIcon={<ChevronDownIcon />} border="1px solid #e2e2e2 !important" borderRadius="0" bgColor="#fff" fontWeight="400">
                                            Location {cityCount?.length > 0 && <span className="text-green-500 font-[500]">[{cityCount?.length}]</span>}
                                        </MenuButton>


                                        <MenuList rounded={0} className={'rounded-0'}>
                                            {!cities ? <div className="text-[16px] ml-2">Loading...</div> :
                                                <MultiMenuSelect
                                                    control={control}
                                                    name="city_id"
                                                    arrayData={cities?.data}
                                                />}

                                            <MenuItem closeOnSelect w={"100%"}>
                                                <div className="w-[100%] mt-3">
                                                    <button onClick={handleSubmit(onSubmit)} className="btn-primary w-[100%] font-[500] text-[13px]"> Apply</button>
                                                </div>
                                            </MenuItem>
                                        </MenuList>
                                    </Menu>
                                </div>

                                <div className="flex-grow">
                                    <Menu closeOnSelect={false}>
                                        <MenuButton px={3} size={'sm'} as={Button} rightIcon={<ChevronDownIcon />} border="1px solid #e2e2e2 !important" borderRadius="0" bgColor="#fcfcfc" fontWeight="400">
                                            Condition {conditionCount?.length > 0 && <span className="text-green-500 font-[500]">[{conditionCount?.length}]</span>}
                                        </MenuButton>
                                        <MenuList rounded={0} className={'rounded-0'}>
                                            <MultiMenuSelect
                                                control={control}
                                                name="condition"
                                                arrayData={conditionList}
                                            />
                                            <MenuItem closeOnSelect w={"100%"}>
                                                <div className="w-[100%] mt-3">
                                                    <button onClick={handleSubmit(onSubmit)} className="btn-primary w-[100%] font-[500] text-[13px]"> Apply</button>
                                                </div>
                                            </MenuItem>
                                        </MenuList>
                                    </Menu>

                                </div>

                                <div className="flex-grow">
                                    <Menu closeOnSelect={false}>
                                        <MenuButton px={3} size={'sm'} rightIcon={<ChevronDownIcon />} as={Button} border="1px solid #e2e2e2 !important" borderRadius="0" bgColor="#fcfcfc" fontWeight="400">
                                            <div className="flex gap-1 items-center">
                                                {watch('bedroom') ? <span className="font-[500] text-blue-500">{watch('bedroom')} bed</span> :
                                                    <span>Beds</span>}
                                                {watch('bathroom') ? <span className="font-[500] text-blue-500"> & {watch('bathroom')} bath</span> :
                                                    <span> & Baths</span>}
                                            </div>
                                        </MenuButton>

                                        <MenuList rounded={0} bg={'blue.50'}>
                                            <MenuItem bg={'blue.50'} _active={{ bg: '' }} _focus={{ bg: '' }} _hover={{ bg: '' }} onClick={e => e.stopPropagation()} blur={false}>
                                                <label htmlFor="" className="text-[12px] font-[500] leading-[15px] mr-2">Bedroom</label>
                                                <Controller
                                                    name="bedroom"
                                                    control={control}
                                                    render={({ field: { onChange, value } }) => (
                                                        <Select value={value} onChange={(e) => onChange(e.target.value)} background={"#fff"} fontSize={13} onClick={e => e.stopPropagation()} placeholder="Any">
                                                            {[1, 2, 3, 4, 5, 6, 7].map((res: any, key: number) => (
                                                                <option value={res} key={key}>{res}</option>
                                                            ))}
                                                        </Select>
                                                    )}
                                                />
                                            </MenuItem>

                                            <MenuItem bg={'blue.50'} _active={{ bg: '' }} _focus={{ bg: '' }} _hover={{ bg: '' }} onClick={e => e.stopPropagation()} blur={false}>
                                                <label htmlFor="" className="text-[12px] font-[500] leading-[15px] mr-2">Bathroom</label>
                                                <Controller
                                                    name="bathroom"
                                                    control={control}
                                                    render={({ field: { onChange, value } }) => (
                                                        <Select value={value} onChange={(e) => onChange(e.target.value)} background={"#fff"} fontSize={13} onClick={e => e.stopPropagation()} placeholder="Any">
                                                            {[1, 2, 3, 4, 5, 6, 7].map((res: any, key: number) => (
                                                                <option value={res} key={key}>{res}</option>
                                                            ))}
                                                        </Select>
                                                    )}
                                                />
                                            </MenuItem>

                                            <MenuItem closeOnSelect={true} bg={'blue.50'} _active={{ bg: '' }} _focus={{ bg: '' }} _hover={{ bg: '' }} onClick={e => e.stopPropagation()} blur={false}>
                                                <button onClick={handleSubmit(onSubmit)} className="btn-primary w-[100%] font-[500] text-[13px]"> Apply</button>
                                            </MenuItem>
                                        </MenuList>
                                    </Menu>
                                </div>
                            </div>
                        </div>}
                    </div>

                    <SearchModal
                        isOpen={isOpen}
                        onOpen={onOpen}
                        onClose={onClose}
                        control={control}
                        handleSubmit={handleSubmit(onSubmit)}
                        reset={reset}
                        watch={watch}
                    />

                    {(!data || isValidating) && <div className={`h-[20px] transition ease-in-out delay-350 text-[12px] pb-1 text-center flex items-center gap-2 justify-center`}>
                        <Spinner size={'xs'} /> Fetching...
                    </div>}
                </div>
            </>

            <div className={`${isMobile ? "pt-[97px]" : ""} bg-[#f8fafd] search-page`}>
                <div className={`${!isMobile ? 'flex' : ''} relative w-[100%] bg-white z-[0]`}>
                    {(!isMobile || tab == '' || tab == '2') &&
                        <div className={!isMobile ? "w-[49%]" : ''}>
                            <div className={isMobile ? "" : "fixed w-[49%] top-[116px] bottom-0"}>
                                {<Map properties={properties || []} height={typeof window != 'undefined' ? (window.innerHeight) : 900} center={[(properties?.[0]?.latitude || 27.7172), (properties?.[0]?.longitude || 85.3240)]} zoom={12}>
                                    {({ TileLayer }: any) => (
                                        <>
                                            <TileLayer
                                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                                attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
                                            />
                                        </>
                                    )}
                                </Map>}
                            </div>
                        </div>}

                    {(tab == '' || tab == '1') &&
                        <div className={!isMobile ? "w-[51%]" : ""}>
                            <div className={`search-result py-[15px] px-4 h-[100%]`}>
                                <div className="flex justify-between mb-2 items-center">
                                    <p className="100% font-[500]">{data?.[0]?.data?.total} results</p>

                                    <div className="min-w-[100px]">
                                        <Controller
                                            name="sort_by"
                                            control={control}
                                            render={({ field: { onChange, value } }) => (
                                                <Select
                                                    value={value}
                                                    onChange={(value) => { onChange(value); handleSubmit(onSubmit)() }}
                                                    size={"sm"}
                                                    background={"#fff"}
                                                    fontSize={13}
                                                    rounded={5}
                                                >
                                                    <option value="">Sort by</option> <option value="">Default</option> <option value="date_asc">Oldest</option> <option value="date_desc">Newest</option> <option value="price_asc">Price: low to high</option> <option value="price_desc">Price: high to low</option> <option value="name_asc">Name: A-Z</option> <option value="name_desc">Name: Z-A</option></Select>
                                            )}
                                        />

                                    </div>
                                </div>

                                <>
                                    {properties?.map((res: any, key: number) => (
                                        <Fragment key={key}>
                                            {
                                                isSmMobile ?
                                                    <PropertyCard
                                                        isMobile={true}
                                                        className="mb-5 shadow-md shadow-[#000]/[0.2] rounded-[9px]"
                                                        isProperty={true}
                                                        isHf={true}
                                                        res={res}
                                                    /> :
                                                    <SearchCard
                                                        res={res}
                                                    />
                                            }

                                        </Fragment>
                                    ))}

                                    {data && properties?.length === 0 && <div className="bg-white p-4 flex items-center gap-3 rounded-[12px] border">
                                        <BsExclamationCircle />
                                        No Properties Found
                                    </div>}

                                    {/* {
                                        (!data) && <div className="absolute left-0 right-0"> {loader} </div>
                                    } */}
                                </>
                            </div>
                        </div>}
                </div>
            </div>

            {
                isMobile && <div className="fixed z-[9999] bottom-[20px] left-[50%] translate-x-[-50%]">
                    <button onClick={() => setTab((tab == '' || tab == '1') ? '2' : '1')} className="shadow-lg btn-primary flex items-center gap-1">
                        {(tab == '' || tab == '1') ? <> <MdMap /> Map </> : <> <MdListAlt /> List </>}
                    </button>
                </div>
            }
        </div >
    )
}

export default Search;