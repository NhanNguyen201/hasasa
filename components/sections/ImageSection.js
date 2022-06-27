import React from 'react'
import PropTypes from 'prop-types'
import styles from './ImageSection.module.css'
import { urlFor} from '../../utils/sanityClient'
import SimpleBlockContent from '../SimpleBlockContent'
import Cta from '../Cta'

function ImageSection(props) {
  const {heading, label, text, image, cta} = props

  if (!image) {
    return null
  }

  return (
    <div className={styles.root}>
      <figure className={styles.content}>
        <img
          src={urlFor(image).auto('format').width(2000).url()}
          className={styles.image}
          alt={heading}
          style={{paddingTop: (heading || label || text || cta) ? "6rem" : "0"}}
        />
        <figcaption>
          {(heading || label || text || cta) && <div className={styles.caption}>
            <div className={styles.captionBox}>
              {label && <div className={styles.label}>{label}</div>}
              {heading && <h2 className={styles.title}>{heading}</h2>}
              {text && <SimpleBlockContent blocks={text} />}
              {cta && cta.route && <Cta {...cta} />}
            </div>
          </div>}
        </figcaption>
      </figure>
    </div>
  )
}

ImageSection.propTypes = {
  heading: PropTypes.string,
  label: PropTypes.string,
  text: PropTypes.array,
  image: PropTypes.shape({
    asset: PropTypes.shape({
      _ref: PropTypes.string,
    }),
  }),
  backgroundImage: PropTypes.string,
  tagline: PropTypes.string,
  cta: PropTypes.object,
}

export default ImageSection