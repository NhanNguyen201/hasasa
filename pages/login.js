import { NextSeo } from 'next-seo'
import { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import { useRouter } from 'next/router'
import styles from '../styles/Login.module.css'
import { useDispatch } from 'react-redux'
import { loginAction } from '../redux/action'
import  Typography  from '@mui/material/Typography'
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button'
import Link from 'next/link'

const Login = (props)=> {
    const {
        title = 'Login',
        config = {},
        disallowRobots,
        openGraphImage
    } = props
    const router = useRouter()
    const dispatch = useDispatch();

    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [loginError, setLoginError] = useState("")
    const handleLogin = async e => {
        setLoginError("")
        e.preventDefault()
        const options = {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({username, password}),
        }
        const res = await (await fetch('/api/login', options)).json()
        if(res.error){
            setLoginError(res.error)
        } else if(res.user){
            dispatch(loginAction(res.user))
            // console.log("user: ", res.user)
            router.push('/')
        }
    }

    useEffect(() => {
        const user = localStorage.getItem('hasasaUserData') && JSON.parse(localStorage.getItem('hasasaUserData')) 
        if(user) {
            router.push('/')
        }
    }, [router])

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
    return (
        <Layout config={config}>
            <NextSeo
                title={title}
                titleTemplate={`%s | ${config.title}`}
                description={"Hasasa login page"}
                canonical={config.url && `${config.url}/login`}
                openGraph={{
                    images: openGraphImages,
                }}
                noindex={disallowRobots}
            />
            <section className={styles.root}>
                <div className={styles.formContainer}>
                    <Typography variant='h4' align='center' style={{marginBottom: 30}}>Hasasa Login Form</Typography>
                    <form onSubmit={handleLogin}>
                        <div style={{marginTop: 10}}>
                            <TextField
                                required
                                label="Email: "
                                value={username}
                                fullWidth
                                onChange={e => setUsername(e.target.value)}
                                variant="standard"
                            />
                        </div>
                        <div style={{marginTop: 10}}>
                            <TextField
                                required
                                label="Your password: "
                                type="password"
                                value={password}
                                fullWidth
                                onChange={e => setPassword(e.target.value)}
                                variant="standard"

                            />
                        </div>
                        {loginError && <div>
                            <i>{loginError}</i>    
                        </div>}
                        <div style={{marginTop: 10}}>
                            <Typography variant='p'>If you want to register, you can go to <Link href={'/register'}><a>Register</a></Link></Typography>
                        </div>
                        <div className={styles.loginBtnContainer}>
                            <Button type="submit" className={styles.loginBtn} color='primary' variant='contained'>Submit</Button>
                        </div>
                    </form>
                </div>
            </section>
        </Layout>
    )
}

export default Login