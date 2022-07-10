import { useState, useEffect } from 'react'

import { client } from '../../../../utils/sanityClient'
import LargeProductGrid from '../ProductGrid'

function ProductGrid(props) {
    const { productGridArray, gridOf } = props
    const [products, setProducts] = useState([])

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
        <LargeProductGrid 
            productGridArray={products}
            gridOf={gridOf}
        />
    )
}

// ProductGrid.propTypes = {
//   heading: PropTypes.string,
//   backgroundImage: PropTypes.object,
//   tagline: PropTypes.array,
// }

export default ProductGrid