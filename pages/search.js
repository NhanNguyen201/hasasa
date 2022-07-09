
import Layout from '../components/Layout'
import { NextSeo } from 'next-seo'
import { client } from '../utils/sanityClient'
import { ProductGrid } from '../components/sections'
import styles from '../styles/Search.module.css'
import  Typography  from '@mui/material/Typography'
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
            {queryResult.length > 0 ? (
                <>
                    <div className={styles.banner}>
                        <Typography variant='subtitle1'>
                            Kết quả tìm kiếm cho : { queryTerm }
                        </Typography>
                    </div>
                    <ProductGrid 
                        productGridArray={queryResult}
                        gridOf={4}
                    />
                </>
            ): (
                <div className={styles.banner}>
                    <Typography variant='subtitle1'>
                        Không tìm thấy kết quả cho : { queryTerm }
                    </Typography>
                </div>
            )}
        </Layout>
    )
}
export async function getServerSideProps({query}) {

    let { _q }= query
    let decodedWord = decodeURI(_q)
    const tidyAscent =(str) => {
        str = str.toLowerCase();
        return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    };
    const posibleKeyWords = str => {
        let words = [];
        words = words.concat(str.split(" ").map(w => tidyAscent(w)))        

        let reducedWords = words.reduce((acc, cur) => {
            if(!acc.find((word) => word == cur)) {

              return acc.concat(cur)
            } else return acc
       }, [])

        let mapedWords = reducedWords.map(w => `"${w}*"`)
        return mapedWords
    }
    let productsquery  = `*[_type == "product" && searchSlug.current match [${posibleKeyWords(decodedWord)}]]{
        ...,
        productPageRoute->
    }`

    const data = await client.fetch(productsquery)

    return {
        props: {  
            queryTerm: _q || "",
            queryResult: data.map(i => i)
        }
    }
    
}
export default Search