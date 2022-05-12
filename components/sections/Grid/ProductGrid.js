import PropTypes from 'prop-types'
import Mansonry from 'react-masonry-css'
import styles from './ProductGrid.module.css'
import GridItem from './ProductGridItem'


function ProductGrid(props) {
    const { productGridArray, gridOf } = props
    const breakPointsObj = {
        default: gridOf,
        1200 : gridOf >= 3 ? 3 : gridOf, //3
        1000 : gridOf >= 2 ? 2 : gridOf, //2
        700: 1
    }
    return (
        <Mansonry breakpointCols={breakPointsObj} className={styles.root}>
            {productGridArray.map((gridItem, idx) => <GridItem gridItem={gridItem} key={idx}/>)}
        </Mansonry>
    )
}

// ProductGrid.propTypes = {
//   heading: PropTypes.string,
//   backgroundImage: PropTypes.object,
//   tagline: PropTypes.array,
//   ctas: PropTypes.arrayOf(PropTypes.object),
// }

export default ProductGrid