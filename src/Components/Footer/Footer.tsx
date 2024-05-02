import React from 'react'
import { Box, useMediaQuery } from "@chakra-ui/react"
import FooterOptions from './FooterOptions'
import "./Footer.module.css"
function Footer() {
    const [isMobile] = useMediaQuery(`(max-width: 808px)`);
    return (
        <Box className={`border-t ${isMobile ? 'pt-2' : 'pt-11'}`}>
            <img src="/assets/landscape.jpg" width={"100%"} className='landscape-footer cover absolute bottom-0 z-[-1] opacity-[0.2] left-0 right-0' alt="" />
            <FooterOptions />
        </Box>
    )
}

export default Footer