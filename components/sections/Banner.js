import styles from './Banner.module.css'

const Banner = (props) => {
    const { text, backgroundColor, textColor } = props
    return (
        <div className={styles.root} style={{backgroundColor: backgroundColor.hex || 'white'}}>
            <span className={styles.text} style={{color: textColor.hex || 'black'}}>{text}</span>
        </div>
    )
}

export default Banner