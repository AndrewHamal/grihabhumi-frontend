import React, { useState } from 'react'
import { Button, Checkbox, FormControl, FormErrorMessage, Input, InputGroup, InputLeftElement, InputRightElement, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import { MdApartment, MdEmail, MdKey, MdLocationCity, MdMap, MdPerson, MdPhone } from 'react-icons/md';
import { login, register } from '@/pages/api/api';
import { setCookie } from 'cookies-next'
import { toast } from 'react-toastify';

export default function SignUp({ isOpen, onClose, popTab }: any) {
    const [show, setShow] = useState(false)
    const [error, setError]: any = useState(null)
    const handleClick = () => setShow(!show)
    const [checked, setChecked] = useState(false)
    const [submitting, setSubmitting] = useState(false)

    function handleSubmit(e: any) {
        e.preventDefault();
        setSubmitting(true)
        let formData = new FormData(e.target);

        login(formData)
            .then(({ data }) => {
                setSubmitting(false)
                setCookie('token', data?.data?.token)
                onClose()
                toast.success(data?.message)

            }).catch(err => {
                setSubmitting(false)
                setError(err.response?.data?.message)
            })
    }

    function handleSubmitRegister(e: any) {
        e.preventDefault();
        setSubmitting(true)
        let formData = new FormData(e.target);

        register(formData)
            .then(({ data }) => {
                setSubmitting(false)
                setCookie('token', data?.data?.token)
                onClose()
                toast.success(data?.message)
            }).catch(err => {
                setSubmitting(false)
                if (err.response?.data?.errors) {
                    setError(err.response?.data?.errors)
                }
            })
    }

    return (<>
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent className="py-5 px-2">
                <ModalHeader className="text-center">Welcome to Griha bhumi</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Tabs defaultIndex={popTab === 'login' ? 0 : 1}>
                        <TabList>
                            <Tab>Log In</Tab>
                            <Tab>Register</Tab>
                        </TabList>

                        <TabPanels>
                            <TabPanel padding={0}>
                                <div className='py-5'>
                                    <form method='POST' onSubmit={handleSubmit}>
                                        <div>
                                            <label>Email</label>
                                            <InputGroup className='mt-2'>
                                                <InputLeftElement pointerEvents='none'>
                                                    <MdEmail className='text-gray-500' />
                                                </InputLeftElement>
                                                <Input onKeyUp={() => setError(null)} required={true} type='email' name='email' placeholder='Enter email address' />
                                            </InputGroup>
                                        </div>

                                        <div className='my-4'>
                                            <label>Password</label>
                                            <FormControl isInvalid={error || false}>
                                                <InputGroup className='mt-2'>
                                                    <InputLeftElement pointerEvents='none'>
                                                        <MdKey className='text-gray-500' />
                                                    </InputLeftElement>
                                                    <Input onKeyUp={() => setError(null)} required={true} name='password' type={show ? 'text' : 'password'} placeholder='Enter password' />
                                                    <InputRightElement width='4.5rem'>
                                                        <Button h='1.75rem' size='sm' onClick={handleClick}>
                                                            {show ? 'Hide' : 'Show'}
                                                        </Button>
                                                    </InputRightElement>
                                                </InputGroup>

                                                {typeof error !== 'object' && <FormErrorMessage>{error}</FormErrorMessage>}
                                            </FormControl>
                                        </div>

                                        <Button type='submit' colorScheme='blue' className='w-[100%] mt-4' fontWeight={400} fontSize={16} size={"lg"} isLoading={submitting} loadingText={'Signing'}>Sign In</Button>
                                    </form>
                                </div>
                            </TabPanel>

                            <TabPanel padding={0}>
                                <div className='py-5'>
                                    <form method='POST' onSubmit={handleSubmitRegister}>
                                        <div>
                                            <label>Email</label>
                                            <FormControl isInvalid={error?.email || false}>
                                                <InputGroup className='mt-1'>
                                                    <InputLeftElement pointerEvents='none'>
                                                        <MdEmail className='text-gray-500' />
                                                    </InputLeftElement>
                                                    <Input onKeyUp={() => setError(null)} required={true} type='email' name='email' placeholder='Enter email address' />
                                                </InputGroup>
                                                {error?.email && <FormErrorMessage>{error?.email?.join('/n')}</FormErrorMessage>}
                                            </FormControl>
                                        </div>

                                        <div className='my-4'>
                                            <label>Phone number</label>
                                            <FormControl isInvalid={error || false}>
                                                <InputGroup className='mt-1'>
                                                    <InputLeftElement pointerEvents='none'>
                                                        <MdPhone className='text-gray-500' />
                                                    </InputLeftElement>
                                                    <Input onKeyUp={() => setError(null)} required={true} name='phone' type={'text'} placeholder='Phone number' />
                                                </InputGroup>

                                                <FormErrorMessage>{error}</FormErrorMessage>
                                            </FormControl>
                                        </div>

                                        <div className='mb-4'>
                                            <label>Password</label>
                                            <FormControl isInvalid={error?.password || false}>
                                                <InputGroup className='mt-1'>
                                                    <InputLeftElement pointerEvents='none'>
                                                        <MdKey className='text-gray-500' />
                                                    </InputLeftElement>
                                                    <Input onKeyUp={() => setError(null)} required={true} name='password' type={show ? 'text' : 'password'} placeholder='Enter password' />
                                                    <InputRightElement width='4.5rem'>
                                                        <Button h='1.75rem' size='sm' onClick={handleClick}>
                                                            {show ? 'Hide' : 'Show'}
                                                        </Button>
                                                    </InputRightElement>
                                                </InputGroup>
                                                {error?.password && <FormErrorMessage>{error?.password?.join('/n')}</FormErrorMessage>}
                                            </FormControl>
                                        </div>

                                        <div className='py-5'>
                                            <Checkbox value={1} onChange={e => setChecked(e.target.checked)}>
                                                I am a landlord or industry professional
                                            </Checkbox>
                                        </div>

                                        {checked && <>
                                            <div className='flex gap-5'>
                                                <div className='my-4'>
                                                    <label>First Name</label>
                                                    <FormControl isInvalid={error || false}>
                                                        <InputGroup className='mt-1'>
                                                            <InputLeftElement pointerEvents='none'>
                                                                <MdPerson className='text-gray-500' />
                                                            </InputLeftElement>
                                                            <Input onKeyUp={() => setError(null)} required={true} name='first_name' type={'text'} placeholder='First Name' />
                                                        </InputGroup>

                                                        <FormErrorMessage>{error}</FormErrorMessage>
                                                    </FormControl>
                                                </div>

                                                <div className='my-4'>
                                                    <label>Last Name</label>
                                                    <FormControl isInvalid={error || false}>
                                                        <InputGroup className='mt-1'>
                                                            <InputLeftElement pointerEvents='none'>
                                                                <MdPerson className='text-gray-500' />
                                                            </InputLeftElement>
                                                            <Input onKeyUp={() => setError(null)} required={true} name='last_name' type={'text'} placeholder='Last Name' />
                                                        </InputGroup>

                                                        <FormErrorMessage>{error}</FormErrorMessage>
                                                    </FormControl>
                                                </div>
                                            </div>

                                            <div className='mb-4'>
                                                <label>Company Name</label>
                                                <FormControl isInvalid={error || false}>
                                                    <InputGroup className='mt-1'>
                                                        <InputLeftElement pointerEvents='none'>
                                                            <MdApartment className='text-gray-500' />
                                                        </InputLeftElement>
                                                        <Input onKeyUp={() => setError(null)} name='company' type={'text'} placeholder='Company Name' />
                                                    </InputGroup>

                                                    <FormErrorMessage>{error}</FormErrorMessage>
                                                </FormControl>
                                            </div>
                                        </>}

                                        <Button type='submit' colorScheme='blue' className='w-[100%] mt-4' fontWeight={400} fontSize={16} size={"lg"} isLoading={submitting} loadingText={'Loading'}>Register</Button>
                                    </form>
                                </div>

                            </TabPanel>
                        </TabPanels>
                    </Tabs>
                </ModalBody>
            </ModalContent>
        </Modal>
    </>)
}