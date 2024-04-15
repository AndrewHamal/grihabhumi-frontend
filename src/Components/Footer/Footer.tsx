import React from 'react'
import { Box, useMediaQuery } from "@chakra-ui/react"
import FooterOptions from './FooterOptions'
import "./Footer.module.css"
import Image from 'next/image';
function Footer() {
    const [isMobile] = useMediaQuery(`(max-width: 808px)`);
    return (
        <Box className={`border-t ${isMobile ? 'pt-2' : 'pt-11'}`}>
            <Image src="/assets/landscape.jpg" sizes="100vw" width={0} height={0} className='cover absolute bottom-0 z-[-1] w-[100%] opacity-[0.2] left-0 right-0' alt="" />
            <FooterOptions />
        </Box>
    )
}

export default Footer