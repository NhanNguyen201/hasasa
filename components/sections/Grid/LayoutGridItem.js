import styles from './LayoutGridItem.module.css'

const LayoutGridItem = ({itemSize, children}) => {
    return(
        <div className={`${styles[`col-${itemSize}`]} ${styles[`md-w100`]}`}>
            {children}
        </div>
    )
}
export default LayoutGridItem