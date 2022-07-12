import groq from 'groq'
import {NextSeo} from 'next-seo'
import PropTypes from 'prop-types'
import { useEffect } from 'react'
import { urlFor, client } from '../utils/sanityClient'
import Layout from '../components/Layout'
import RenderSections from '../components/RenderSections'
import { getSlugVariations, slugParamToPath } from '../utils/urls'
import { loginAction } from '../redux/action'
import { useSelector, useDispatch } from 'react-redux';

const pageFragment = groq`
  ...,
  content[] {
    ...,
    productGridArray[]-> {
      ...,
      productPageRoute->
    },
}`

export const getServerSideProps = async ({params}) => {
  const slug = slugParamToPath(params?.slug)

  let data

  if (slug == "/") {
    data = await client
      .fetch(
        groq`
        *[_type == "site-config"][0]{
          frontpage -> {
            ${pageFragment}
          }
        }
      `
      )
      .then((res) => {
        return res?.frontpage ? {...res.frontpage, slug} : undefined
      })
  } else {
    // Regular route
    data = await client
      .fetch(
        // Get the route document with one of the possible slugs for the given requested path
        groq`*[_type == "route" && slug.current in $possibleSlugs][0]{
          page-> {
            ${pageFragment}
          }
        }`,
        {possibleSlugs: getSlugVariations(slug)}
      )
      .then((res) => {
        return (res?.page ? {...res.page, slug} : undefined)
      })
  }

  if (!data?._type === 'page') {
    return {
      notFound: true,
    }
  }

  return {
    props: data || {},
  }
}


const LandingPage = (props) => {
  const {
    title = 'Missing title',
    description,
    disallowRobots,
    openGraphImage,
    content = [],
    config = {},
    slug,
  } = props

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
  const { isLogedIn } = useSelector(state => state.user)
  const dispatch = useDispatch();
  
  useEffect(() => {
    if(!isLogedIn) {
      const user = localStorage.getItem('hasasaUserData') && JSON.parse(localStorage.getItem('hasasaUserData')) 
      if(user && Object.keys(user).length > 0) {
        dispatch(loginAction(user))
      }
    } 
  }, [slug])
  return (
    <Layout config={config}>
      <NextSeo
        title={title}
        titleTemplate={`%s | ${config.title}`}
        description={description}
        canonical={config.url && `${config.url}/${slug}`}
        openGraph={{
          images: openGraphImages,

        }}
        noindex={disallowRobots}
      />
      {content && <RenderSections sections={content} />}
    </Layout>
  )
}

LandingPage.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  slug: PropTypes.string,
  disallowRobots: PropTypes.bool,
  openGraphImage: PropTypes.any,
  content: PropTypes.any,
  config: PropTypes.any,
}

export default LandingPage