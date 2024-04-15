import React, { Fragment, useEffect, useRef, useState } from "react";
import style from "../Components/Homepage.module.css";
import { GoSearch } from "react-icons/go";
import {
  Box,
  Flex,
  Grid,
  Image,
  Select,
  Text,
  Button,
  Input,
  InputGroup,
  useDisclosure,
  Tooltip,
  IconButton,
  useMediaQuery,
} from "@chakra-ui/react";
import BuyOption from "../Components/BuyOption";
import { ArrowForwardIcon, ChevronLeftIcon, ChevronRightIcon, SearchIcon } from "@chakra-ui/icons";
import SearchModal from "../Components/SearchModal";
import Link from "next/link";
import Navbar from "@/Components/Navbar/Navbar";
import { useRouter } from "next/router";
import Footer from "@/Components/Footer/Footer";
import useSWR from "swr";
import { fetcher } from "./api/api";
import SkeletonCat from "@/Components/SkeletonCat";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import PropertyCard from "@/Components/PropertyCard";
import SkeletonPro from "@/Components/SkeletonPro";
import { storageUrl } from "@/Constant/helper";
import { Controller, useForm } from "react-hook-form";
import PropertyXCard from "@/Components/PropertyXCard";
import { MdArrowForward } from "react-icons/md";
import { isArray } from "lodash";
import Head from "next/head";

function Homepage() {
  const router = useRouter()
  let slickRef1: any = useRef()
  let slickRef2: any = useRef()
  const { query } = useRouter()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { control, handleSubmit, watch, reset } = useForm();
  const [isMobile] = useMediaQuery(`(max-width: 808px)`);

  const { data } = useSWR('/categories?response=api', fetcher)
  const { data: cities } = useSWR('/cities', fetcher)
  const { data: agents } = useSWR('/agents', fetcher)
  const { data: services } = useSWR('/services', fetcher)
  const { data: projects } = useSWR('/projects?type=api', fetcher)
  const { data: homepage } = useSWR('/properties?response=api&from=homepage', fetcher)


  let properties = homepage?.data?.properties;
  let featured = homepage?.data?.featured;
  let sale = homepage?.data?.sale;
  let rent = homepage?.data?.rent;
  let recent = homepage?.data?.recent;

  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 4,
    autoplay: true,
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

  const settings1 = {
    dots: false,
    infinite: false,
    speed: 500,
    autoplay: true,
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

  const renderArrows = () => {
    return (
      <div className="slider-arrow gap-3 flex">
        <IconButton
          icon={<ChevronLeftIcon className="arrow-btn prev" />}
          onClick={() => slickRef1.slickPrev()}
          aria-label={""} />

        <IconButton
          icon={<ChevronRightIcon className="arrow-btn next" />}
          onClick={() => slickRef1.slickNext()}
          aria-label={""} />

      </div>
    );
  };

  const renderArrows2 = () => {
    return (
      <div className="slider-arrow gap-3 flex">
        <IconButton
          icon={<ChevronLeftIcon className="arrow-btn prev" />}
          onClick={() => slickRef2.slickPrev()}
          aria-label={""} />

        <IconButton
          icon={<ChevronRightIcon className="arrow-btn next" />}
          onClick={() => slickRef2.slickNext()}
          aria-label={""} />

      </div>
    );
  };

  function onSubmit(data: any) {
    if (data?.condition)
      data.condition = data.condition.map((res: any) => res?._id) || '';

    if (data?.availability)
      data.availability = data.availability.map((res: any) => res?._id) || ''

    if (data?.category_id)
      data.category_id = data.category_id.map((res: any) => res?._id) || ''

    if (data?.furnishing)
      data.furnishing = data.furnishing.map((res: any) => res?._id) || ''

    if (data?.property_type)
      data.property_type = data?.property_type?.map((res: any) => res?._id) || ''

    onClose();
    router.push({ pathname: '/search', query: data })
  }

  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) return ''

  return (
    <>
      <Head>
        <title>Property in Nepal - Buy/Sale/Rent Properties,Real Estate Nepal</title>
        <meta name="description" content="Buy/Sale/Rent Real Estate Property in Nepal - Certified partner in Real Estate Industry in Nepal, Explore verified Residential and commercial properties within your budget on grihabhumi.com, Search Property in Nepal's from most trusted Real Estate Portal out of Lakhs of properties." />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:site" content="https://grihabhumi.com" />
        <meta property="og:url" content="https://grihabhumi.com" />
        <meta property="og:title" content="Home - grihabhumi" />
        <meta property="og:description" content="Nepal best property listing site. Real estate in nepal." />
        <meta property="og:image" content="/assets/logo.svg" />


      </Head>

      <Navbar />
      {/* mobile hero  */}
      <Box className="mobile-ver hidden relative pt-[60px] pb-11 px-5">
        <div className="text-center">
          <Text color={"#acafbc"} fontWeight={500}>100% Owner Properties | <strong className="">Zero Hustle</strong></Text>
        </div>

        <div className={"flex justify-evenly mt-4 mb-9"}>
          <div className="relative">
            <Controller
              name="type"
              control={control}
              render={({ field: { onChange, value } }) => (
                <Link onClick={() => onChange('Sale')} href="?type=sale">
                  <Box className="text-center" fontWeight={query?.type === "sale" ? 500 : 400} color={query?.type === "sale" ? '#0E578C' : '#00000073'}>
                    Buy
                  </Box>
                  {query?.type === "sale" && <div className="absolute border-[#0E578C] border-[2px] mt-2 left-[-30px] right-[-30px]"></div>}
                </Link>
              )}
            />

          </div>

          <div className="relative">
            <Controller
              name="type"
              control={control}
              render={({ field: { onChange, value } }) => (
                <Link onClick={() => onChange('Rent')} href="?type=rent">
                  <Box className="text-center" fontWeight={query?.type === "rent" ? 500 : 400} color={query?.type === "rent" ? '#0E578C' : '#00000073'}>
                    Rent
                  </Box>
                  {query?.type === "rent" && <div className="absolute border-[#0E578C] border-[2px] mt-2 left-[-30px] right-[-30px]"></div>}
                </Link>)}
            />
          </div>
        </div>

        <div className="my-5">
          <InputGroup size='sm' className="relative h-[50px]">
            <Input onClick={onOpen} placeholder='Search by locality' fontSize={16} height={50} rounded={0} />
            <button className="absolute right-[10px] top-0 bottom-0">
              <SearchIcon fontSize={23} color={"#0E578C"} className="m-auto pb-[5px]" />
            </button>
          </InputGroup>
        </div>

      </Box>

      <SearchModal
        isOpen={isOpen}
        onOpen={onOpen}
        onClose={onClose}
        control={control}
        reset={reset}
        watch={watch}
        handleSubmit={handleSubmit(onSubmit)}
      />

      {/* desktop hero along */}
      <Box className="mt-[-61px]">
        <div className="relative pb-11 desktop-ver">
          <div className="bg-[url('/assets/hero.jpg')] brightness-[0.3] absolute bottom-0 top-0 right-0 left-0 bg-no-repeat bg-cover z-[0]"></div>

          <Box className={style.homepageContainer}>
            <div className="relative">
              <Text className={style.homeTitle}>
                Nepal's Largest Brokerage Property Site
              </Text>
              <Box w="fit-content" m="auto">
                <Flex className={style.nIcon}>
                  <Image src={'/Images/Homepage/nIcon.png'} alt="" />
                  <Text className="text-white ml-1">Buy or Rent with Gorkha Nepal!</Text>
                </Flex>
              </Box>
              <Grid className={style.buyRent}>
                <div>
                  <Controller
                    name="type"
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <Link onClick={() => onChange('Sale')} href={'?type=sale'}>
                        <Box
                          style={
                            query?.type === "sale"
                              ? { borderBottom: "3px solid #0E578C", color: "#0E578C", fontWeight: '600' }
                              : { borderBottom: "0px solid" }
                          }
                        >
                          Buy
                        </Box>
                      </Link>)}
                  />
                </div>

                <div>
                  <Controller
                    name="type"
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <Link onClick={() => onChange('Rent')} href={'?type=rent'}>
                        <Box
                          style={
                            query?.type === "rent"
                              ? { borderBottom: "3px solid #0E578C", color: "#0E578C", fontWeight: '600' }
                              : { borderBottom: "0px solid" }
                          }
                        >
                          Rent
                        </Box>
                      </Link>)}
                  />
                </div>
              </Grid>

              <div className="w-[100%] flex">
                <div className={"flex mx-auto"}>
                  <div>
                    <Controller
                      name="city_id"
                      control={control}
                      render={({ field: { onChange, value } }) => (

                        <Select onChange={onChange}
                          placeholder="Select a city"
                          size="md"
                          height={50}
                          roundedBottom={0}
                          roundedTopEnd={0}
                          w={"180px"}
                          borderRightWidth={0}
                          background="#f9f9fb">
                          {!cities ? <option className="text-[13px] ml-2">Loading...</option> :
                            cities?.data?.map((res: any, key: number) => (
                              <option value={res.id} key={key}>{res.name}</option>
                            ))}
                        </Select>)}
                    />

                  </div>

                  <div className={style.searchInput}>
                    <Controller
                      name="keyword"
                      control={control}
                      render={({ field: { onChange, value } }) => (
                        <Input onKeyUp={(e: any) => onChange(e?.target?.value)} name="keyword" borderRightWidth={0} background={"#f9f9fb"} placeholder="Search for Properties title, location and description" />
                      )}
                    />
                  </div>

                  <div>
                    <Button
                      onClick={handleSubmit(onSubmit)}
                      leftIcon={<GoSearch size={20} />}
                      bgColor="#2977ac"
                      variant="solid"
                      color="white"
                      fontWeight={500}
                      _hover={{
                        bgColor: '#0E578C'
                      }}
                      className={style.searchButton}
                    >
                      Search
                    </Button>
                  </div>
                </div>
              </div>

              <Flex className={style.filterBox + ' filter-box'}>
                <BuyOption
                  control={control}
                  categories={data}
                  watch={watch}
                />
              </Flex>
            </div>
          </Box>

          <div className="relative">
            <Flex
              m="20px auto"
              w="100%"
              justifyContent="center"
              alignItems="center"
              gap={3}
            >
              <Text w="60px" h="1px" bgColor="#ccc"></Text>
              <Text className="text-[#fff]">Are you a Property Owner? </Text>
              <Text w="60px" h="1px" bgColor="#ccc"></Text>
            </Flex>

            <Box w="100%" m="auto">
              <Flex className={style.postYourAd} bgColor="#009587" color="white">
                Post Free property ad
              </Flex>
            </Box>
          </div>
        </div>

        <div className="desktop-ver">
          <Flex
            bgColor="#384d6c"
            h="55px"
            justifyContent="center"
            alignItems="center"
            color="#fff"
            gap={2}
            fontSize="14px"
          >
            <Image src={'../Images/Homepage/savings.png'} alt="savings" />
            <Text>
              Didn't you find the property of your <Text as="b">choice? </Text> Tell us what you need and we will guide you <Text as="b">find the best property. </Text>
            </Text>
            <a
              href="https://www.nabilbank.com/business/loan-eligibility"
              target="_blank" rel="noreferrer"
            >
              <Button
                color="#464646"
                bgColor="#fff"
                fontSize="12px"
                p="4px 8px"
                h="fit-content"
                borderRadius="4px"
              >
                Request Property
              </Button>
            </a>
          </Flex>
        </div>

        <div className="py-7 bg-white categories">
          <div className="md:container mx-auto">
            <Flex className={style.optiosWithIcon}>
              {!data ? <>
                <SkeletonCat />
                <SkeletonCat />
                <SkeletonCat />
                <SkeletonCat />
                <SkeletonCat />
                <SkeletonCat />
              </> : data?.data?.map((res: any, key: number) => (
                <Fragment key={key}>
                  <Tooltip label={`Properties Count ${res?.properties_count}`}>
                    <Link href={`/search?category_id=${res.id}`}>
                      <Image width={'54px'} src={res?.images_full_url} alt={res?.name}></Image>
                      <Text>{res?.name}</Text>
                    </Link>
                  </Tooltip>
                </Fragment>
              ))
              }
            </Flex>
          </div>
        </div>

        <div className="bg-gradient pb-[50px] mt-3">
          <div className="md:container mx-auto">
            <div className="slider-container mx-[-11px]">
              {
                !projects ? <>
                  <div className="flex gap-4 w-[100%] overflow-x-scroll pb-4 px-3 justify-between">
                    {isMobile ?
                      <>
                        <SkeletonPro width="100%" />
                        <SkeletonPro width="100%" />
                      </> : <>
                        <SkeletonPro />
                        <SkeletonPro />
                        <SkeletonPro />
                        <SkeletonPro /></>}
                  </div>
                </>
                  :
                  <Slider
                    ref={(e: any) => slickRef1 = e}
                    {...settings}>

                    {projects?.data?.data?.map((res: any, key: number) => (
                      <Fragment key={key}>
                        <PropertyCard
                          res={res}
                        />
                      </Fragment>
                    ))
                    }
                  </Slider>
              }
            </div>
            {renderArrows()}
          </div >
        </div>


        {/* second property section */}
        <div className="bg-gradient-unique relative overflow-hidden py-[50px]" id="premium-properties">
          <div className="md:container mx-auto">

            <div className="flex gap-4 items-center">
              <div className="flex items-center gap-2">
                <Image width={"18px"} src="/assets/stars.png" alt="" />
                <h4 className="font-[500] text-[19px] text-[#0E578C]/[0.8] ">Premium Properties</h4>
              </div>

              <Link className="ml-auto" href={'/search'}>
                <span className="btn-link ">
                  View all
                  <ArrowForwardIcon />
                </span>
              </Link>
            </div>

            {!homepage ? <>
              <div className="flex w-[100%] px-3 justify-between">
                <SkeletonPro />
                <SkeletonPro />
                <SkeletonPro />
                <SkeletonPro />
              </div>
            </>
              :
              <div className="grid grid-cols-4 gap-6 mt-4">
                {properties?.data?.map((res: any, key: number) => (
                  <Fragment key={key}>
                    <PropertyCard
                      isProperty={true}
                      res={res}
                    />
                  </Fragment>
                ))}
              </div >
            }
          </div>


          <div className="md:container mx-auto mt-[50px]">
            <div className="flex gap-4 items-center">
              <div className="flex items-center gap-2">
                <h4 className="font-[500] text-[19px] text-[#0E578C]/[0.8] ">Featured Properties</h4>
              </div>

              <Link className="ml-auto" href={'/search'}>
                <div className="btn-link ">
                  View all
                  <ArrowForwardIcon />
                </div>
              </Link>
            </div>

            <div className="mt-2 mx-[-11px]">
              {!homepage ? <>
                <div className="flex w-[100%] px-3 justify-between">
                  <SkeletonPro />
                  <SkeletonPro />
                  <SkeletonPro />
                  <SkeletonPro />
                </div>
              </>
                :
                <Slider
                  ref={(e: any) => slickRef2 = e}
                  {...settings1}>
                  {featured?.data?.map((res: any, key: number) => (
                    <Fragment key={key}>
                      <PropertyCard
                        wrapperClass="p-3"
                        isProperty={true}
                        res={res}
                      />
                    </Fragment>
                  ))}
                </Slider >
              }
            </div>
            {renderArrows2()}
          </div >
        </div>

        <div id="services" ></div>

        <Box className={"relative bg-[#111827] overflow-hidden"}>
          <div>
            <svg viewBox="0 0 1024 1024" className="absolute left-1/2 top-1/2  h-[64rem] w-[64rem] -translate-y-1/2 [mask-image:radial-gradient(closest-side,white,transparent)] sm:left-full sm:-ml-80 lg:left-1/2 lg:ml-0 lg:-translate-x-1/2 lg:translate-y-0" aria-hidden="true">
              <circle cx="512" cy="512" r="512" fill="url(#759c1415-0410-454c-8f7c-9a820de03641)" fillOpacity="0.7"></circle>
              <defs>
                <radialGradient id="759c1415-0410-454c-8f7c-9a820de03641">
                  <stop stopColor="#7775D6"></stop>
                  <stop offset="1" stopColor="#E935C1"></stop>
                </radialGradient>
              </defs>
            </svg>
          </div>

          <div className="md:container mx-auto py-11 services-container">
            <h4 className="text-white font-[500] text-[18px] pb-4">More Services you might want!</h4>

            <div className="services">
              <div className="flex flex-wrap gap-6 items-center">
                {
                  services?.data?.map((res: any, key: number) => (
                    <Box key={key} onClick={() => res?.badge != 'Comming Soon' ? window.open(`/services/${res?.slugable?.key}`) : {}}>
                      <div>
                        <Text fontSize={11}>{res.badge}</Text>
                      </div>
                      <Image width={'44px'} src={storageUrl + res.icon} alt="builderProject"></Image>
                      <Text>{res.name}</Text>
                    </Box>
                  ))
                }
              </div>
            </div>
          </div>
        </Box >


        <div className="bg-[#f9f9fb] py-[50px]">
          <div className="md:container mx-auto">
            <div className="flex gap-4 items-center">
              <div className="flex items-center gap-2">
                <h4 className="font-[500] text-[19px] text-[#0E578C]/[0.8] ">Properties For Sale</h4>
              </div>

              <Link className="ml-auto" href={'/search?type=sale'}>
                <span className="btn-link ">
                  View all
                  <ArrowForwardIcon />
                </span>
              </Link>
            </div>

            <div className="mt-5">
              {!homepage ? <>
                <div className="flex w-[100%] px-3 justify-between">
                  <SkeletonPro />
                  <SkeletonPro />
                  <SkeletonPro />
                  <SkeletonPro />
                </div>
              </>
                :
                <div className="grid grid-cols-4 gap-6 flex-wrap">
                  {sale?.data?.map((res: any, key: number) => (
                    <Fragment key={key}>
                      <PropertyCard
                        isProperty={true}
                        res={res}
                        hideType={true}
                      />
                    </Fragment>
                  ))}
                </div >
              }
            </div>
          </div >

          <div className="md:container mx-auto mt-[60px]">
            <div className="flex gap-4 items-center">
              <div className="flex items-center gap-2">
                <h4 className="font-[500] text-[19px] text-[#0E578C]/[0.8]">Properties For Rent</h4>
              </div>

              <Link className="ml-auto" href={'/search?type=rent'}>
                <span className="btn-link ">
                  View all
                  <ArrowForwardIcon />
                </span>
              </Link>
            </div>

            <div className="mt-5">
              {!homepage ? <>
                <div className="flex w-[100%] px-3 justify-between">
                  <SkeletonPro />
                  <SkeletonPro />
                  <SkeletonPro />
                  <SkeletonPro />
                </div>
              </>
                :
                <div className="grid grid-cols-4 gap-6 flex-wrap">
                  {rent?.data?.map((res: any, key: number) => (
                    <Fragment key={key}>
                      <PropertyCard
                        isProperty={true}
                        res={res}
                        hideType={true}
                      />
                    </Fragment>
                  ))}
                </div >
              }
            </div>
          </div >
        </div>


        <div className="agencies">
          <div className="bg-white py-16">
            <div className="mx-auto grid md:container mx-auto gap-x-9 gap-y-9 xl:grid-cols-3">
              <div className="max-w-2xl">
                <h2 className="text-[28px] font-[700] leading-8 tracking-tight text-[#0E578C]">Your Featured <br /> Agencies</h2>
                <p className="mt-6 text-[15px] leading-7 text-md text-gray-500">Your trusted partners for tailored, top-notch agency services. We prioritize reliability, transparency, and efficiency, ensuring exceptional results every time.</p>
              </div>

              <ul role="list" className="grid gap-x-5 grid-cols-3 gap-y-5 col-span-2">

                {!agents ? <></> :
                  agents?.data?.map((res: any, key: number) => (
                    <li key={key}>
                      <Link target="_blank" href={`/agency/${res?.id}`}>
                        <div className="flex transition transition duration-500 ease-in-out items-center gap-x-4 shadow-sm p-3 bg-gray-100 hover:bg-blue-200 rounded-2xl">
                          <Image className="w-16 rounded-2xl" src={storageUrl + res?.avatar?.url} alt="" />
                          <div>
                            <h3 className="text-base font-semibold leading-5 tracking-tight text-gray-900">{res?.company || (res?.first_name + ' ' + res?.last_name)}</h3>
                            <p className="text-sm font-semibold leading-6 text-indigo-600">{res?.properties_count} properties</p>
                          </div>

                          <Link className="ml-auto" href={`/agency/${res?.id}`}>
                            <ChevronRightIcon />
                          </Link>
                        </div>
                      </Link>
                    </li>
                  ))
                }
                <li>
                  <Link className="ml-auto" href={'/agencies'}>
                    <div style={{ height: "calc(100% - 0.25rem)" }} className="min-h-[80px] bg-[url(/assets/hero.jpg)] flex transition transition duration-500 ease-in-out items-center gap-x-4 shadow-sm p-4  text-white hover:bg-blue-400 rounded-2xl">
                      <div>
                        <h3 className="text-base font-semibold leading-5 tracking-tight text-white">View all agencies</h3>
                        <p className="text-sm font-semibold leading-6 text-indigo-600"></p>
                      </div>

                      <Link target="_blank" className="ml-auto" href={'/agencies'} children={<ChevronRightIcon />} />
                    </div>
                  </Link>
                </li>
              </ul>
            </div>

            <div className="">
              <div className="container mx-auto">
                <div className="flex gap-[80px] items-between pt-11 pb-5">
                  <div className="flex flex-grow items-center border border-[#EBEFF4] px-5 py-1 rounded-[20px] overflow-hidden">
                    <div className="bg-blue-100 flex items-center p-3 rounded-[12px]">
                      <Image className={isMobile ? "w-[16px]" : "w-[30px]"} src="/assets/list.png" alt="" />
                    </div>

                    <Box className="w-[100%] items-center flex bg-white h-[100%] pl-5 py-4">
                      <div>
                        <Text className={`${isMobile ? "text-[16px] leading-[15px]" : "text-[20px]"} font-[600]`}>List Your Property</Text>
                        <Text className="text-gray-500 text-[14px] mt-1">Select from thousands of options, without brokerage.</Text>
                      </div>

                      <button className={`ml-auto text-left flex items-center font-[400] gap-2 bg-blue-100 text-[14px] rounded-[6px] ${isMobile ? "px-2 py-2" : "px-4 py-[6px]"} text-blue-400 text-[14px]`}>
                        {!isMobile && <Text color="" p="0" m="0">Explore Now</Text>}
                        <MdArrowForward width={5} height={5} />
                      </button>

                    </Box>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        <div className="bg-[#f9f9fb] pb-6" id="recent">
          <div className="md:container py-11 mx-auto">
            <div className="flex gap-4 items-center">
              <div className="flex items-center gap-2">
                <h4 className="font-[500] text-[19px] text-[#0E578C]/[0.8]">Recent Properties</h4>
              </div>
            </div>

            <div className="mt-5">
              {!homepage ? <>
                <div className="flex w-[100%] px-3 justify-between">
                  <SkeletonPro />
                  <SkeletonPro />
                  <SkeletonPro />
                  <SkeletonPro />
                </div>
              </>
                :
                <div className="grid grid-cols-2 gap-6 flex-wrap">
                  {recent?.data?.map((res: any, key: number) => (
                    <Fragment key={key}>
                      <PropertyXCard
                        isProperty={true}
                        res={res}
                      />
                    </Fragment>
                  ))}
                </div >
              }
            </div>
          </div >
        </div>
      </Box >

      <Footer />
    </>
  );
}

export default Homepage;
