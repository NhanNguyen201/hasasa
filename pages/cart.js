import { NextSeo } from 'next-seo'
import { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import { useRouter } from 'next/router'
import { useSelector } from 'react-redux'
import styles from '../styles/Cart.module.css'

import CartTable from '../components/CustomComponents/CartTable'
import HistoryCartTable from '../components/CustomComponents/HistoryCartTable'

import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
function TabPanel(props) {
    const { children, value, index, ...other } = props;
  
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && (
            <div>
                {children}
            </div>
        )}
      </div>
    );
}

function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
}

const Cart = props => {
    const {
        title = 'Cart',
        config = {},
        disallowRobots,
        openGraphImage
    } = props
    const router = useRouter()
    const [userCart, setUserCart] = useState({})
    const [historyCart, setHistoryCart]= useState([])
    const [tabValue, setTabValue] = useState(0)
    const { isLogedIn, userData } = useSelector(state => state.user)
    
    const openGraphImages = openGraphImage
        ? [
            {
              url: urlFor(openGraphImage).width(800).height(600).url(),
              width: 800,
              height: 600,
              alt: title,
            },
            {
              // Facebook recommended size
              url: urlFor(openGraphImage).width(1200).height(630).url(),
              width: 1200,
              height: 630,
              alt: title,
            },
            {
              // Square 1:1
              url: urlFor(openGraphImage).width(600).height(600).url(),
              width: 600,
              height: 600,
              alt: title,
            },
          ]
    : []
    useEffect(() => {
        const user = localStorage.getItem('hasasaUserData') && JSON.parse(localStorage.getItem('hasasaUserData')) 
        if(!user) {
            router.push('/')
        }
    }, [router])
    useEffect(async () => {
        if(isLogedIn) {
            const cartRes = await(await fetch(`/api/cart/get?_userId=${userData._id}`)).json()
            const historyCartsRes = await(await fetch(`/api/cart/historyCart?_userId=${userData._id}`)).json() 
            console.log("history carts: ", historyCartsRes.carts)
            setUserCart(cartRes)
            setHistoryCart(historyCartsRes.carts)
        } else {
            setUserCart({})
            setHistoryCart([])
        }
    }, [isLogedIn])

    
    return(
        <Layout config={config}>
            <NextSeo
                title={title}
                titleTemplate={`%s | ${config.title}`}
                description={"User cart page"}
                canonical={config.url && `${config.url}/cart`}
                openGraph={{
                    images: openGraphImages,
                }}
                noindex={disallowRobots}
            />
            <section className={styles.root}>
                {isLogedIn ? (
                    <>
                        <Box>
                            <AppBar position="static" style={{background: "black"}}>
                                <Tabs
                                    value={tabValue}
                                    onChange={(e, newValue) => setTabValue(newValue)}
                                    textColor="inherit"
                                    indicatorColor="secondary"
                                    aria-label="secondary tabs example"
                                >
                                    <Tab label="Giỏ hàng" {...a11yProps(0)} />
                                    <Tab label="Lịch sử" {...a11yProps(1)} />
                                </Tabs>
                            </AppBar>
                        </Box>
                        <TabPanel value={tabValue} index={0}>
                            {isLogedIn && (
                                userCart.cart?.length > 0 ? <CartTable cart={userCart}/> : <p>Giỏ hàng của bạn đang rỗng</p>
                            )}
                        </TabPanel>
                        <TabPanel value={tabValue} index={1}>
                            {isLogedIn && (
                                historyCart && <HistoryCartTable carts={historyCart}/> 
                            )}
                        </TabPanel>
                    </>
                ): (
                    <div style={{padding: "1rem 2rem", background: "black", color: "white"}}>
                        Please login to view our cart
                    </div> 
                )}
                
            </section>
        </Layout>
    )
}

export default Cart