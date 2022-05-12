import PropTypes from 'prop-types'
import styles from './Figure.module.css'
import {  urlFor} from '../utils/sanityClient'


function Figure(props) {
    const { node } = props
    if(!node) {
        return null
    }
    const {alt, caption, asset} = node
    if (!asset) {
        return null
    }
    return (
        <figure className={styles.content}>
            <img
                src={urlFor(asset).auto('format').width(1000).url()}
                className={styles.image}
                alt={alt}
            />
            {caption && (
                <figcaption>
                    <div className={styles.caption}>
                        <div className={styles.captionBox}>
                            <p>{caption}</p>
                        </div>
                    </div>
                </figcaption>
            )}
        </figure>
    )
}

Figure.propTypes = {
  node: PropTypes.shape({
    alt: PropTypes.string,
    caption: PropTypes.string,
    asset: PropTypes.shape({
      _ref: PropTypes.string,
    }),
  }),
}
export default Figure