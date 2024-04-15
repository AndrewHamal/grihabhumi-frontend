import "@/styles/globals.css";
import { ChakraProvider } from '@chakra-ui/react'
import type { AppProps } from "next/app";
import NextNProgress from 'nextjs-progressbar';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from "react-toastify";
import { SWRConfig } from "swr";

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
    </SWRConfig>
  </ChakraProvider>;
}
