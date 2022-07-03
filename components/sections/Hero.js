import React from 'react'
import PropTypes from 'prop-types'
import styles from './Hero.module.css'
import { urlFor } from '../../utils/sanityClient'
import SimpleBlockContent from '../SimpleBlockContent'


function Hero(props) {
  const {heading, backgroundImage, tagline} = props

  const style = backgroundImage
    ? {
        backgroundImage: `url("${urlFor(backgroundImage).width(2000).auto('format').url()}")`,
      }
    : {}

  return (
    <div className={styles.root} style={style}>
      <div className={styles.contentContainer}>
        <div className={styles.content}>
          <h1 className={styles.title}>{heading}</h1>
          <div className={styles.tagline}>{tagline && <SimpleBlockContent blocks={tagline} />}</div>
        </div>
      </div>
    </div>
  )
}

Hero.propTypes = {
  heading: PropTypes.string,
  backgroundImage: PropTypes.object,
  tagline: PropTypes.array,
}

export default Hero