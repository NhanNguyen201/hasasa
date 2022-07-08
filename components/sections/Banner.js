import SimpleBlockContent from '../SimpleBlockContent'
import styles from './Banner.module.css'

const Banner = (props) => {
    const { text, backgroundColor, textColor, isInLayoutGrid } = props
    
    if(!text) {
        return null
    }
    return (
        <div className={styles.root}>
            <div className={styles.textContainer} style={{backgroundColor: backgroundColor?.hex || 'black', color: textColor?.hex || 'white'}}>
                {text && <SimpleBlockContent blocks={text} />}
            </div>
        </div>
    )
}

export default Banner