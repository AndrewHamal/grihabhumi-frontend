import { Box, SkeletonCircle, SkeletonText } from "@chakra-ui/react";

export default function SkeletonCat() {
    return (
        <Box height={"115px"} bg='white'>
            <SkeletonCircle size='10' />
            <SkeletonText mt='9' noOfLines={1} spacing='4' skeletonHeight='3' />
        </Box>
    )
}