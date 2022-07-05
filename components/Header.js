import React, { useEffect, useState, useRef } from 'react'
// import PropTypes from 'prop-types'
import Link from 'next/link'
import {withRouter} from 'next/router'
import SVG from 'react-inlinesvg'
import styles from './Header.module.css'
import {getPathFromSlug, slugParamToPath} from '../utils/urls'
import { useSelector, useDispatch } from 'react-redux';
import { logoutActions } from '../redux/action'
import { GoTriangleDown } from 'react-icons/go'
import { Popover, Button, Avatar} from '@nextui-org/react'
import Typography from '@mui/material/Typography';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import  MuiButton from '@mui/material/Button';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import { useRouter } from 'next/router'

const Header = props => {
  const {title = 'Missing title', navItems, router, logo} = props 

  const [showNav, setShowNav] = useState(false)
  const [showLogoutPopover, setShowLogoutPopover] = useState(false)
  const { isLogedIn, userData } = useSelector(state => state.user)
  const hideMenu = e => setShowNav(false)
  const handleMenuToggle = e => setShowNav(!showNav)
  const dispatch = useDispatch();
  const searchTerm = useRef("");
  // const router = useRouter()

  const renderLogo = (logo) => {
    if (!logo || !logo.asset) {
      return null
    }

    if (logo.asset.extension === 'svg') {
      return <SVG src={logo.asset.url} className={styles.logo} />
    }

    return <img src={logo.asset.url} alt={logo.title} className={styles.logo} />
  }
  const handleSignOut = () => {    
    dispatch(logoutActions())
  }
  const handleSubmitSearch = e => {
    e.preventDefault()
    router.push(`/search?_q=${encodeURI(searchTerm.current)}`)
  }
  const drawer = (
    <Box sx={{ textAlign: 'center' }}>
      <Typography
            variant="h1"
            sx={{ flexGrow: 1 }}
            className={styles.branding}
        >
        
        <MuiButton variant="text" startIcon={renderLogo(logo)} >
          {title}
        </MuiButton>
      </Typography>
      <Divider />
      <List>
        {navItems.map((item) => {
          const {slug, title, _id} = item
          const isActive = slugParamToPath(router.query.slug) === slug.current && router.route == '/[[...slug]]'
          return (
            <ListItem key={_id} disablePadding>
              <ListItemButton sx={{ textAlign: 'center' }}>
                <Link href={getPathFromSlug(slug.current)}>
                  <a data-is-active={isActive} aria-current={isActive} className={styles.navItemLink}>
                    {title}
                  </a>
                </Link>
              </ListItemButton>
            </ListItem>
          )})}
          <ListItem>
            <ListItemButton>
              {isLogedIn ? (
                  <Popover placement="bottom" isOpen={showLogoutPopover && showNav} onOpenChange={setShowLogoutPopover}>
                    <Popover.Trigger>
                      <button className={styles.logoutBtn}> 
                        <Avatar
                          color="gradient" 
                          textColor="white" 
                          text={userData.bioName[0]}
                          style={{marginRight: 5}}
                          pointer
                        />
                        {userData.bioName} 
                        <GoTriangleDown style={{transform: `scale(1.3) rotate(${showLogoutPopover ? "180deg" : "0deg"})`, marginLeft: 5, transition: '0.5s'}}/>
                      </button>
                    </Popover.Trigger>

                    <Popover.Content css={{padding: "10px"}}> 
                        <Button onPress={() => handleSignOut()} >Log out</Button>
                        <br/>
                        <Button onPress={() => router.push('/cart')}>Go to your cart</Button>
                    </Popover.Content>
                  </Popover>
                ) : <Link href='/login'>
                  <a data-is-active={router.route == '/login'} aria-current={router.route == '/login'} className={styles.navItemLink}>
                    Login
                  </a>
                </Link>}
            </ListItemButton>
          </ListItem>
      </List>
    </Box>
  );
  useEffect(() => {
    router.events.on('routeChangeComplete', hideMenu)
    return () => {
      router.events.off('routeChangeComplete', hideMenu)
    }
  }, [router])
 
  return (
    <AppBar component="nav" position="sticky" sx={{background: "white"}}>
      <Container maxWidth="lg">
      <Toolbar>
         
          <Box 
            className={styles.branding}
            sx={{ flexGrow: 1 }}
          >
            <div style={{display: 'flex', alignItems: 'center'}}>
              <Link href={'/'}>
                <a title={title} className={styles.navItemLink}>{renderLogo(logo)}</a>
              </Link>
                <form onSubmit={e => handleSubmitSearch(e)} className={styles.searchBarForm}>
                  <TextField variant='outlined' label="Search" className={styles.searchBar} onChange={e => searchTerm.current = e.target.value}/>
                </form>
            </div>
          </Box>
          <Box sx={{ display: { xs: 'none', sm: 'flex' } }}>
            <ul className={styles.navItems}>
              {navItems && navItems.map((item) => {
                  const {slug, title, _id} = item
                  const isActive = slugParamToPath(router.query.slug) === slug.current && router.route == '/[[...slug]]'
                  return (
                    <li key={_id} className={styles.navItem}>
                      <Link href={getPathFromSlug(slug.current)}>
                        <a data-is-active={isActive} aria-current={isActive} className={styles.navItemLink}>
                          {title}
                        </a>
                      </Link>
                    </li>
                  )
              })}
              <li className={styles.navItem}>
               {isLogedIn ? (
                <Popover placement="bottom" isOpen={showLogoutPopover && !showNav} onOpenChange={setShowLogoutPopover}>
                  <Popover.Trigger>
                    <button className={styles.logoutBtn}> 
                      <Avatar
                        color="gradient" 
                        textColor="white" 
                        text={userData.bioName[0]}
                        style={{marginRight: 5}}
                        pointer
                      />
                       {userData.bioName} 
                      <GoTriangleDown style={{transform: `scale(1.3) rotate(${showLogoutPopover ? "180deg" : "0deg"})`, marginLeft: 5, transition: '0.5s'}}/>
                    </button>
                  </Popover.Trigger>

                  <Popover.Content css={{padding: "10px"}}> 
                      <Button onPress={() => handleSignOut()} >Log out</Button>
                      <br/>
                      <Button onPress={() => router.push('/cart')}>Go to your cart</Button>
                  </Popover.Content>
                </Popover>
              ) : <Link href='/login'>
                <a data-is-active={router.route == '/login'} aria-current={router.route == '/login'} className={styles.navItemLink}>
                  Login
                </a>
              </Link>}
            </li>
            </ul>
          </Box>
          <IconButton
              aria-label="open drawer"
              edge="end"
              onClick={() => handleMenuToggle()}
              sx={{
                  position: 'absolute',
                  right: 8,
                  display: { sm: 'none' },
                  color: "black"
              }}
            >
              <MenuIcon fontSize='large'/>
            </IconButton>
            <Box component="nav">
              <Drawer
                variant="temporary"
                open={showNav}
                onClose={() => handleMenuToggle()}
                ModalProps={{
                  keepMounted: true, // Better open performance on mobile.
                }}
                sx={{
                  display: { xs: 'block', sm: 'none' },
                  '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 },
                }}
              >
                {drawer}
              </Drawer>
            </Box>
        </Toolbar>
      </Container>
    </AppBar>
  )
}

export default withRouter(Header)