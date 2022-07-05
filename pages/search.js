
import Layout from '../components/Layout'
import { NextSeo } from 'next-seo'
import { client } from '../utils/sanityClient'
import { ProductGrid } from '../components/sections'
const Search = props => {
    const {
        title = 'Search',
        config = {},
        disallowRobots,
        openGraphImage,
        queryTerm,
        queryResult,
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
    return(
        <Layout config={config}>
            <NextSeo
                title={title}
                titleTemplate={`%s | ${config.title}`}
                description={`Hasasa product search for ${queryTerm}`}
                canonical={config.url && `${config.url}/search`}
                openGraph={{
                    images: openGraphImages,
                }}
                noindex={disallowRobots}
            />
            <ProductGrid 
                productGridArray={queryResult.map(i => i)}
                gridOf={4}
            />
        </Layout>
    )
}
export async function getServerSideProps({query}) {
    
    let { q }= query
    const data = await client.fetch(`*[_type == "product" && title match '${q}*']{
        ...,
        productPageRoute->
    }`)
    console.log("queryTerm", q)
    console.log("data", data)
    return {
        props: {  
            queryTerm: q,
            queryResult: data
        }
    }
    
}
export default Search