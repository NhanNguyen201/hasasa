
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
    const tidyAscent =(s) => {
        var r=s.toLowerCase();
        r = r.replace(new RegExp("\\s", 'g'),"");
        r = r.replace(new RegExp("[àáâãäå]", 'g'),"a");
        r = r.replace(new RegExp("æ", 'g'),"ae");
        r = r.replace(new RegExp("ç", 'g'),"c");
        r = r.replace(new RegExp("[èéêë]", 'g'),"e");
        r = r.replace(new RegExp("[ìíîï]", 'g'),"i");
        r = r.replace(new RegExp("ñ", 'g'),"n");                            
        r = r.replace(new RegExp("[òóôõö]", 'g'),"o");
        r = r.replace(new RegExp("œ", 'g'),"oe");
        r = r.replace(new RegExp("[ùúûü]", 'g'),"u");
        r = r.replace(new RegExp("[ýÿ]", 'g'),"y");
        r = r.replace(new RegExp("\\W", 'g'),"");
        return r;
    };
    const posibleKeyWords = str => {
        let words = [];
        words = words.concat(str.split(" "))
        words = words.concat(strSplit.map(w => tidyAscent(w)))        
        words = words.concat(str)

        let reducedWords = words.reduce((acc, cur) => {
            if(!acc.find((word) => word == cur)) {

              return acc.concat(cur)
            } else return acc
       }, [])

        let mapedWords = reducedWords.map(w => `'${w}*'`)
        return mapedWords
    }
    let productsquery  = `*[_type == "product" && title match [${posibleKeyWords(decodedWord)}]]{
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