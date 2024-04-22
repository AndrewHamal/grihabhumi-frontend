import "@/styles/globals.css";
import { ChakraProvider } from '@chakra-ui/react'
import type { AppProps } from "next/app";
import NextNProgress from 'nextjs-progressbar';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from "react-toastify";
import { SWRConfig } from "swr";
import Script from "next/script";
import { Suspense } from "react";

export default function App({ Component, pageProps }: AppProps) {
  return <ChakraProvider>
    <Script async src="https://www.googletagmanager.com/gtag/js?id=G-KH5XTD4XWQ" />
    <Script id="gtm" strategy="afterInteractive">
      {`window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());

        gtag('config', 'G-KH5XTD4XWQ');
      `}
    </Script>

    <SWRConfig
      value={{
        revalidateIfStale: false,
        revalidateOnFocus: false,
        revalidateOnReconnect: false
      }}
    >
      <Suspense fallback="Loading...">
        <NextNProgress height={2} />
        <ToastContainer />
        <Component {...pageProps} />
      </Suspense>
    </SWRConfig>
  </ChakraProvider>;
}
