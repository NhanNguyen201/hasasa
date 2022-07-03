import { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import Mansonry from 'react-masonry-css'
import styles from './GridProductGrid.module.css'
import GridItem from '../ProductGridItem'
import { client } from '../../../../utils/sanityClient'


function ProductGrid(props) {
    const { productGridArray, gridOf } = props
    const [products, setProducts] = useState([])

    const breakPointsObj = {
        default: gridOf,
        1200 : gridOf >= 2 ? 2 : gridOf, 
        1000 : 1
    }
    useEffect(() => {
        const productids = productGridArray.map(each => `'${each._ref}'`)
        client.fetch(`*[_type == "product" && _id in [${productids}]]{
            ...,
            productPageRoute->
        }`)
        .then(response => {
            setProducts(response)
        })
    }, [productGridArray])
    return (
        <Mansonry breakpointCols={breakPointsObj} className={styles.root} >
            {products.map((gridItem, idx) => <GridItem gridItem={gridItem} key={idx}/>)}
        </Mansonry>
    )
}

// ProductGrid.propTypes = {
//   heading: PropTypes.string,
//   backgroundImage: PropTypes.object,
//   tagline: PropTypes.array,
// }

export default ProductGrid