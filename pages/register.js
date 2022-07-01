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
const Register = (props)=> {
    const {
        title = 'Register',
        config = {},
        disallowRobots,
        openGraphImage
    } = props
    const router = useRouter()
    const dispatch = useDispatch();

    const [bioName, setBioName] = useState("")
    const [email, setEmail]= useState("")
    const [address, setAddress]= useState("")
    const [phoneNumber, setPhoneNumber] = useState("")
    const [password, setPassword] = useState("")

    const [registerError, setRegisterError] = useState({})

    const handleRegister = async e => {
        setRegisterError({})
        e.preventDefault()
        const options = {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                bioName,
                email,
                address,
                phoneNumber,
                password
            }),
        }
        try {
            const res = await (await fetch('/api/register', options)).json()
            dispatch(loginAction(res.user))
            router.push('/')
        }catch(err) {
            setRegisterError(err.error)
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
                description={"Hasasa register page"}
                canonical={config.url && `${config.url}/register`}
                openGraph={{
                    images: openGraphImages,
                }}
                noindex={disallowRobots}
            />
            <section className={styles.root}>
                <div className={styles.formContainer}>
                    <Typography variant='h4' align='center' style={{marginBottom: 40}}>Hasasa Register Form</Typography>
                    <form onSubmit={handleRegister}>
                        <div style={{marginTop: 20}}>
                            <TextField
                                required
                                label="Your name: "
                                value={bioName}
                                fullWidth
                                onChange={e => setBioName(e.target.value)}
                                variant="standard"
                            />
                        </div>
                        <div style={{marginTop: 20}}>
                            <TextField
                                required
                                label="Email: "
                                value={email}
                                fullWidth
                                onChange={e => setEmail(e.target.value)}
                                variant="standard"
                                error={registerError?.email}
                                helperText={registerError?.email ?? registerError?.email}
                            />
                        </div>
                        <div style={{marginTop: 20}}>
                            <TextField
                                required
                                label="Your phone number: "
                                value={phoneNumber}
                                fullWidth
                                onChange={e => setPhoneNumber(e.target.value)}
                                variant="standard"
                                error={registerError?.phoneNumber}
                                helperText={registerError?.phoneNumber ?? registerError?.phoneNumber}
                            />
                        </div>
                        <div style={{marginTop: 20}}>
                            <TextField
                                required
                                label="Your address: "
                                value={address}
                                fullWidth
                                onChange={e => setAddress(e.target.value)}
                                variant="standard"
                                error={registerError?.address}
                                helperText={registerError?.address ?? registerError?.address}
                            />
                        </div>
                        <div style={{marginTop: 20}}>
                            <TextField
                                required
                                label="Your password: "
                                type="password"
                                value={password}
                                fullWidth
                                onChange={e => setPassword(e.target.value)}
                                variant="standard"
                                error={registerError?.password}
                                helperText={registerError?.password ?? registerError?.password}

                            />
                        </div>
                        <div style={{marginTop: 10}}>
                            <Typography variant='p'>If you already have an account, you can go to <Link href={'/login'}><a>Login</a></Link></Typography>
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

export default Register