import { Box, Flex, Image, Text } from '@chakra-ui/react';
import React from 'react';
import style from "../Homepage.module.css"

const ReviewCard = ({ data }: any) => {
    return (
        <Box p="20px" bgColor="#f3f3f3" h="236px">
            <Flex>
                <Box className={style.userAvatarBox}>
                    <Image alt={data.headLine} src={data.avatarUrl} />
                </Box>
                <Box verticalAlign="middle" display="inline-block" overflow="hidden">
                    <Text color="#000" fontSize="14px">{data.name}</Text>
                    <Box>
                        <Image alt="" src="/Images/Homepage/star.png" className={style.ratting_star} />
                        <Image alt="" src="/Images/Homepage/star.png" className={style.ratting_star} />
                        <Image alt="" src="/Images/Homepage/star.png" className={style.ratting_star} />
                        <Image alt="" src="/Images/Homepage/star.png" className={style.ratting_star} />
                        <Image alt="" src="/Images/Homepage/star.png" className={style.ratting_star} />
                    </Box>
                </Box>
            </Flex>

            <Box className={style.descriptionBox} color="black">
                <Text fontWeight="600" fontSize="16px">{data.headLine}</Text>
                <Text fontSize="14px">"{data.description}"</Text>
            </Box>
        </Box>
    );
};

export default ReviewCard;