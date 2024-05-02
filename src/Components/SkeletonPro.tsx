import { Box, Skeleton, SkeletonCircle, SkeletonText } from "@chakra-ui/react";

export default function SkeletonPro({ width = '' }: any) {
    return (
        <Box padding='6' boxShadow='lg' rounded={12} width={width ? width : "23.5%"} bg='white'>
            <Skeleton height='160px' rounded={12} />
            <SkeletonText mt='4' noOfLines={4} spacing='4' skeletonHeight='2' />
        </Box>
    )
}