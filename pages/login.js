import { NextSeo } from 'next-seo'
import { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import { useRouter } from 'next/router'
import styles from '../styles/Login.module.css'
import { useDispatch } from 'react-redux'
import { loginAction } from '../redux/action'
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
        try {
            const res = await (await fetch('/api/login', options)).json()
            dispatch(loginAction(res.user))
            // console.log("user: ", res.user)
            router.push('/')
        }catch(err) {
            setLoginError(err.error)
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
                    <form onSubmit={handleLogin}>
                        <div className={styles["mt-10"]}>
                            <label >
                                <span className={styles.textInputLabel}>Username or Phone Number: </span>
                            </label>
                            <input
                                name="username"
                                type="text"
                                value={username}
                                onChange={e => setUsername(e.target.value)}
                                className={styles.textInput}
                                required

                            />
                        </div>
                        <div className={styles["mt-10"]}>
                            <label >
                                <span className={styles.textInputLabel}>Password: </span>
                            </label>
                            <input
                                name="password"
                                type="password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                className={styles.textInput}
                                required
                            />
                        </div>
                        {loginError && <div>
                            <i>{loginError}</i>    
                        </div>}
                        <div className={styles.loginBtnContainer}>
                            <button type="submit" className={styles.loginBtn}>Submit</button>
                        </div>
                    </form>
                </div>
            </section>
        </Layout>
    )
}

export default Login