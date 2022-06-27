// import BaseApp from 'next/app'
import { NextUIProvider } from "@nextui-org/react"

import { Provider } from 'react-redux'
import { client } from '../utils/sanityClient'
import { useStore } from '../redux/store'
import theme from '../utils/nextUITheme'
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import muiTheme from "../utils/muiTheme"

import '../styles/shared.module.css'
import '../styles/layout.css'
import '../styles/custom-properties.css'

const siteConfigQuery = `
  *[_type == "site-config"] {
    ...,
    logo {asset->{extension, url}},
    mainNavigation[] -> {
      ...,
      "title": page->title
    },
    footerNavigation[] -> {
      ...,
      "title": page->title
    }
  }[0]
  `


const MyApp = ({ Component, pageProps }) => {
  const store = useStore(pageProps.initialReduxState)

  return (
      <NextUIProvider theme={theme}>
        <MuiThemeProvider theme={muiTheme}>
          <Provider store={store}>
            <Component {...pageProps} />
          </Provider>
        </MuiThemeProvider>
      </NextUIProvider>
  ) 
}

MyApp.getInitialProps = async({Component, ctx}) => {
  let pageProps ={};

  if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx)
    }

    // Add site config from sanity
    return client.fetch(siteConfigQuery).then((config) => {
      if (!config) {
        return {pageProps}
      }
      if (config && pageProps) {
        pageProps.config = config
      }

      return {pageProps}
    })
}

export default MyApp