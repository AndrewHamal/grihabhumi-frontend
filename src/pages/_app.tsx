import "@/styles/globals.css";
import { ChakraProvider } from '@chakra-ui/react'
import type { AppProps } from "next/app";
import NextNProgress from 'nextjs-progressbar';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from "react-toastify";
import { SWRConfig } from "swr";
import { FloatingWhatsApp } from 'react-floating-whatsapp'

export default function App({ Component, pageProps }: AppProps) {
  return <ChakraProvider>
    <SWRConfig
      value={{
        revalidateIfStale: false,
        revalidateOnFocus: false,
        revalidateOnReconnect: false
      }}
    >
      <NextNProgress height={2} />
      <ToastContainer />
      <Component {...pageProps} />

      <FloatingWhatsApp
        phoneNumber={"9862998038"}
        accountName={"Griha bhumi"}
        allowClickAway={true}
        chatMessage={`Hello there! 🤝 \nHow can we help you?`}
        avatar={'https://fu057peo.a2hosted.com/storage/logo/logo-white.png'}
      />

    </SWRConfig>


  </ChakraProvider>;
}
