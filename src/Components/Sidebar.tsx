import { Badge, Box, Popover, PopoverBody, PopoverContent, PopoverTrigger, RangeSlider, RangeSliderFilledTrack, RangeSliderThumb, RangeSliderTrack, Tab, TabList, Tabs, Text } from "@chakra-ui/react";
import React, { useCallback } from "react";
import useSWR from 'swr'
import { fetcher } from "@/pages/api/api";
import { availabilityList, bhkList, furnishingList, houseList } from "@/Constant/helper";
import { ChevronDownIcon } from "@chakra-ui/icons";
import MultiSelect from "./MultiSelect";

export default function Sidebar({ control, watch, handleSubmit, totalFilter }: any) {
    const { data: categories } = useSWR('/categories?response=api', fetcher)
    return (
        <>
            <Popover>
                <PopoverTrigger>
                    <button className="btn-primary text-[13px] h-[35px] relative">
                        {totalFilter > 0 && <Badge className="absolute top-[-6px] left-[-4px] z-[99]" w={"19px"} rounded={50} colorScheme='green'>
                            {totalFilter > 9 ? '9+' : totalFilter}
                        </Badge>}
                        More Filters
                        <ChevronDownIcon w={4} h={4} />
                    </button>
                </PopoverTrigger>

                <PopoverContent width={330}>
                    <PopoverBody width={330} padding={0.4}>
                        <div className="h-[65vh] py-4 px-2 overflow-y-scroll overflow-x-hidden">
                            <div className="px-2">
                                <Text fontSize="14px" fontWeight={"semibold"}>
                                    Looking For
                                </Text>

                                <div className="mt-1">
                                    <MultiSelect
                                        arrayData={categories?.data}
                                        control={control}
                                        name='category_id'
                                        onChange={handleSubmit}
                                    />
                                </div>
                            </div>

                            {![5].includes(watch('category_id')) && <div className="mt-5 px-2">
                                <Text fontSize="14px" fontWeight={"semibold"}>
                                    BHK type
                                </Text>

                                <div className="mt-1">
                                    <MultiSelect
                                        arrayData={bhkList}
                                        control={control}
                                        name='property_type'
                                        onChange={handleSubmit}
                                    />
                                </div>
                            </div>}

                            {![5].includes(watch('category_id')) && <div className="mt-5 px-2">
                                <Text fontSize="14px" fontWeight={"semibold"}>
                                    Furnishing
                                </Text>

                                <div className="mt-1">
                                    <MultiSelect
                                        arrayData={furnishingList}
                                        control={control}
                                        name='furnishing'
                                        onChange={handleSubmit}
                                    />
                                </div>
                            </div>}

                            {watch('category_id') == 4 && <div className="mt-5 px-2">
                                <Text fontSize="14px" fontWeight={"semibold"}>
                                    House Type
                                </Text>

                                <div className="mt-1">
                                    <MultiSelect
                                        arrayData={houseList}
                                        control={control}
                                        name='house_type'
                                        onChange={handleSubmit}
                                    />
                                </div>
                            </div>}

                            <div className="mt-5 px-2">
                                <Text fontSize="14px" fontWeight={"semibold"}>
                                    Availability
                                </Text>

                                <div className="mt-1">
                                    <MultiSelect
                                        arrayData={availabilityList}
                                        control={control}
                                        name='availability'
                                        onChange={handleSubmit}
                                    />
                                </div>
                            </div>

                            {/* <div className="mt-5 pb-5 px-2">
                                <Text fontSize="14px" className="mb-1" fontWeight={"semibold"}>
                                    Price Range
                                </Text>

                                <Controller
                                    control={control}
                                    name="price_range"
                                    render={({ field: { onChange, onBlur, value, ref } }) => (
                                        <div className="px-3">
                                            <div className="relative w-[100%]">
                                                <RangeSlider aria-label={['min', 'max']} value={value || [0, 100000000]} min={0} max={100000000} step={500} onChange={(e) => { onChange(e); debounceFn(e, onChange) }}>
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
                                                    {((watch('price_range')?.[1] == 100000000) || (typeof watch('price_range')?.[1] == 'undefined')) ? 'Max' : (<> Rs. {numDifferentiation(watch('price_range')?.[1])} </>)}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                />
                            </div> */}
                        </div >
                    </PopoverBody>
                </PopoverContent>
            </Popover >

        </>
    )
}