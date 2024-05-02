import { Img } from "@chakra-ui/react";

export default function Logo({ color = '', ...props }: any) {
    return (
        props?.type == 'icon' ?
            <Img className="w-[30px]" src="/assets/fav-logo.svg" /> :
            (
                color == 'white' ? <Img className="w-[170px]" {...props} src="/assets/logo-white.svg" /> : <Img className="w-[170px]" {...props} src="/assets/logo.svg" />
            )
    )
}