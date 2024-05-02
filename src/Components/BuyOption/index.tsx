import React from 'react'
import { Button, Checkbox, Flex, Menu, MenuButton, MenuItem, MenuList, Radio, RadioGroup, Select, Stack, Text } from "@chakra-ui/react"
import style from "../Homepage.module.css"
import { ChevronDownIcon } from '@chakra-ui/icons'
import { Controller } from 'react-hook-form'

function BuyOption({ control, categories, watch }: any) {

    return (
        <Flex alignItems="center" gap={5}>
            {/* <RadioGroup> */}
            <Stack direction='row' className={style.radioBtnBox}>
                {categories?.data?.map((res: any, key: number) => (
                    <Controller
                        name={`category_id[${key}]`}
                        control={control}
                        render={({ field: { onChange, value } }) => (
                            <Checkbox isChecked={value?._id == res.id ? true : false} key={key} onChange={(e) => value ? onChange() : onChange({ _id: res?.id })} colorScheme='green' value={res.id?.toString()} fontSize="10px !important">{res?.name}</Checkbox>
                        )}
                    />
                ))}
            </Stack>
            {/* </RadioGroup> */}

            {watch('category_id') == 4 && <Flex alignItems="center" gap={5}>
                <Menu closeOnSelect={false} className={style.radioBtnBox}>
                    <MenuButton gap="40px" as={Button} rightIcon={<ChevronDownIcon />} border="1px solid #e2e2e2 !important" borderRadius="0" bgColor="#fcfcfc" fontSize="12px !important" fontWeight="400">
                        House Type
                    </MenuButton>
                    <MenuList className={style.menuItems}>
                        {['Individual', 'Housing', 'Colony'].map((res, key) => (
                            <Controller
                                key={key}
                                name={`house_type[${key}]`}
                                control={control}
                                render={({ field: { onChange, value } }) => (
                                    <MenuItem onChange={() => { (value ? onChange() : onChange(res)) }} value={value}>
                                        <Checkbox colorScheme='green' fontSize="12px !important">
                                            {res}
                                        </Checkbox>
                                    </MenuItem>
                                )}
                            />))}
                    </MenuList>
                </Menu>
            </Flex>}

            {watch('category_id') != 5 &&
                <Menu closeOnSelect={false} className={style.radioBtnBox}>
                    <MenuButton gap="40px" as={Button} rightIcon={<ChevronDownIcon />} border="1px solid #e2e2e2 !important" borderRadius="0" bgColor="#fcfcfc" fontSize="12px !important" fontWeight="400">
                        BHK Type
                    </MenuButton>
                    <MenuList className={style.menuItems}>
                        {['1 BHK', '2 BHK', '3 BHK', '4 BHK', '4+ BHK', 'Duplex', 'Studio', 'Penthouse'].map((res, key) => (
                            <Controller
                                key={key}
                                name={`property_type[${key}]`}
                                control={control}
                                render={({ field: { onChange, value } }) => (
                                    <MenuItem onChange={() => { (value ? onChange() : onChange(res)) }} value={value}>
                                        <Checkbox colorScheme='green' fontSize="12px !important">
                                            {res}
                                        </Checkbox>
                                    </MenuItem>
                                )}
                            />))}
                    </MenuList>
                </Menu>
            }

        </Flex>
    )
}

export default BuyOption
