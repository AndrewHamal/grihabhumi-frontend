import React, { useEffect } from "react";
import {
    Box,
    Image,
    Select,
    Text,
    Button,
    Input,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
} from "@chakra-ui/react";
import { Controller, useFieldArray, useWatch } from "react-hook-form";
import { ChevronLeftIcon } from "@chakra-ui/icons";
import style from "../Homepage.module.css";
import Link from "next/link";
import { fetcher } from "@/pages/api/api";
import useSWR from 'swr'
import numDifferentiation, { availabilityList, bhkList, conditionList, furnishingList, houseList } from "@/Constant/helper";
import { usePathname } from "next/navigation";
import MultiSelect from "../MultiSelect";

export default function SearchModal({ isOpen, onClose, handleSubmit, control, watch = () => { } }: any) {
    const finalRef = React.useRef(null)
    const { data: cities } = useSWR('/cities', fetcher)
    const { data: categories } = useSWR('/categories?response=api', fetcher)
    const pathname = usePathname()
    let category_id = useWatch({ control, name: 'category_id' }) || watch('category_id')

    return (
        <Modal finalFocusRef={finalRef} isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent className="h-[100vh] z-[999]" margin={0} rounded={0}>

                <ModalHeader className="flex items-center gap-4 shadow" padding={3}>
                    <ChevronLeftIcon fontSize={24} onClick={onClose} />

                    <Link href="/">
                        <Image src={'/Images/navbar/logo.png'} width={"60px"} alt="Dan Abramov" className={style.logo} />
                    </Link>
                </ModalHeader>

                <ModalBody padding={4} overflowY={"scroll"}>
                    {!pathname.match('/search') && <>
                        <Controller
                            control={control}
                            name="type"
                            render={({ field: { onChange, onBlur, value, ref } }) => (
                                <div className={"flex justify-around mb-9"}>
                                    <div className="relative cursor-pointer flex-grow" onClick={() => { onChange('Sale') }}>
                                        <Box className="text-center" fontWeight={value == "Sale" ? '600' : '400'} color={value == "Sale" ? '#0E578C' : ''}>
                                            Buy
                                        </Box>
                                        {value === "Sale" && <div className="absolute border-[#0E578C] border-[1.5px] mt-[11px] left-[25px] right-[25px]"></div>}
                                    </div>

                                    <div className="relative cursor-pointer flex-grow" onClick={() => { onChange('Rent') }}>
                                        <Box className="text-center" fontWeight={value == "Rent" ? '600' : '400'} color={value == "Rent" ? '#0E578C' : "#00000073"}>
                                            Rent
                                        </Box>
                                        {value === "Rent" && <div className="absolute border-[#0E578C] border-[1.5px] mt-[11px] left-[25px] right-[25px]"></div>}
                                    </div>
                                </div>)}
                        />

                        <div>
                            <Controller
                                name="city_id"
                                control={control}
                                render={({ field: { onChange, value } }) => (
                                    !cities ? <div className="text-[13px] ml-2">Loading...</div> :
                                        <Select onChange={(e) => { onChange(e) }} fontSize={16} size={"lg"} rounded={0}>
                                            <option value="">Select City</option>
                                            {cities?.data?.map((res: any, key: number) => (
                                                <option selected={value == res.id} value={res.id} key={key}>{res.name}</option>
                                            ))}
                                        </Select>)}
                            />
                        </div>

                        <div className={'w-[100%] mt-4'}>
                            <Controller
                                control={control}
                                name="keyword"
                                render={({ field: { onChange, onBlur, value, ref } }) => (
                                    <Input size="md"
                                        height={50}
                                        onBlur={onBlur}
                                        defaultValue={value}
                                        rounded={0}
                                        w={"100%"}
                                        onKeyUp={(e: any) => onChange(e.target.value)}
                                        placeholder="Search by keyword" />
                                )}
                            />
                        </div>


                        <div className="mt-5">
                            <Text fontSize="14px" fontWeight={"semibold"}>
                                Condition
                            </Text>

                            <div className="mt-1">
                                <MultiSelect
                                    arrayData={conditionList}
                                    control={control}
                                    name='condition'
                                />
                            </div>
                        </div>

                    </>}

                    <div className="mt-5">
                        <Text fontSize="16px" fontWeight={"semibold"}>
                            Looking For
                        </Text>

                        <div className="mt-1">
                            <MultiSelect
                                arrayData={categories?.data}
                                control={control}
                                name='category_id'
                            />
                        </div>
                    </div>

                    <div className="mt-5">
                        <Text fontSize="14px" fontWeight={"semibold"}>
                            BHK type
                        </Text>

                        <div className="mt-1">
                            <MultiSelect
                                arrayData={bhkList}
                                control={control}
                                name='property_type'
                            />
                        </div>
                    </div>

                    <div className="mt-5">
                        <Text fontSize="14px" fontWeight={"semibold"}>
                            Furnishing
                        </Text>

                        <div className="mt-1">

                            <MultiSelect
                                arrayData={furnishingList}
                                control={control}
                                name='furnishing'
                            />
                        </div>
                    </div>

                    {!category_id?.map((res: any) => res._id).includes('5') && <div className="mt-5">
                        <Text fontSize="14px" fontWeight={"semibold"}>
                            House Type
                        </Text>

                        <div className="mt-1">
                            <MultiSelect
                                arrayData={houseList}
                                control={control}
                                name='house_type'
                            />
                        </div>
                    </div>}

                    <div className="mt-5">
                        <Text fontSize="14px" fontWeight={"semibold"}>
                            Availability
                        </Text>

                        <div className="mt-1">
                            <MultiSelect
                                arrayData={availabilityList}
                                control={control}
                                name='availability'
                            />
                        </div>
                    </div>

                    <div className="mt-5 pb-5">
                        <Text fontSize="14px" className="mb-1" fontWeight={"semibold"}>
                            Price Range (Rs. {watch('min_price') && watch('max_price') && (numDifferentiation(watch('min_price') || 0) + ' - ' + numDifferentiation(watch('max_price') || 0))})
                        </Text>

                        <div className="flex gap-3">
                            <Controller
                                control={control}
                                name="min_price"
                                render={({ field: { onChange, value, onBlur } }) => (
                                    <Input size="sm"
                                        height={'40px'}
                                        onBlur={onBlur}
                                        defaultValue={value}
                                        rounded={0}
                                        w={"100%"}
                                        type="number"
                                        onKeyUp={(e: any) => onChange(e.target.value)}
                                        placeholder="Min Price" />
                                )}
                            />

                            <Controller
                                control={control}
                                name="max_price"
                                render={({ field: { onChange, value, onBlur } }) => (
                                    <Input size="sm"
                                        height={'40px'}
                                        onBlur={onBlur}
                                        defaultValue={value}
                                        rounded={0}
                                        type="number"
                                        w={"100%"}
                                        onKeyUp={(e: any) => onChange(e.target.value)}
                                        placeholder="Min Price" />
                                )}
                            />
                        </div>
                        {/* <Controller
                            control={control}
                            name="price_range"
                            render={({ field: { onChange, value } }) => (
                                <div className="px-3">

                                    <div className="relative w-[100%]">
                                        <RangeSlider aria-label={['min', 'max']} value={value || [0, 800000000]} min={0} max={800000000} step={1000} onChange={(e) => { onChange(e); }}>
                                            <RangeSliderTrack bg='blue.100'>
                                                <RangeSliderFilledTrack bg='#0E578C' />
                                            </RangeSliderTrack>

                                            <RangeSliderThumb boxSize={6} index={0}>
                                                <Box color='#0E578C' />
                                            </RangeSliderThumb>

                                            <RangeSliderThumb boxSize={6} index={1}>
                                                <Box color='#0E578C' />
                                            </RangeSliderThumb>
                                        </RangeSlider>


                                        <div className="left-[-10px] text-[12px] absolute">
                                            Rs. {numDifferentiation(watch('price_range')?.[0] || 0)}
                                        </div>

                                        <div className="right-[-10px] text-[12px] absolute">
                                            {((watch('price_range')?.[1] == 800000000) || (typeof watch('price_range')?.[1] == 'undefined')) ? 'Max' : (<> Rs. {numDifferentiation(watch('price_range')?.[1])} </>)}
                                        </div>
                                    </div>
                                </div>
                            )}
                        /> */}
                    </div>
                </ModalBody>

                <ModalFooter padding={4}>
                    <Button onClick={handleSubmit} bg='#0E578C' width={"100%"} rounded={0} height={"50px"} color={"#fff"}>
                        SEARCH
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal >

    )
}