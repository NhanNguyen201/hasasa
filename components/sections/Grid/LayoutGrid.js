import styles from './LayoutGrid.module.css'
import * as LayoutGridItemChilds from './LayoutGridItemChild'
import capitalizeString from '../../../utils/capitalizeString'
import MissingSection from '../../MissingSection'


const LayoutGridItem = ({itemSize, children}) => {
    return(
        <div className={`${styles[`col-${itemSize}`]} ${styles[`md-w100`]} ${styles.item}`}>
            {children}
        </div>
    )
}

function resolveSections(section) {
    // eslint-disable-next-line import/namespace
    const Section = LayoutGridItemChilds[capitalizeString(section._type)]
  
    if (Section) {
        return Section
    }
    console.error('Cant find section', section) // eslint-disable-line no-console

    return null
}

const LayoutGrid = ({layoutGridArray}) => {
    return (
        <div className={styles.root}>
            {layoutGridArray.map(gridItem => {
                const LayoutGridComponent = resolveSections(gridItem.itemType[0])
                if (!LayoutGridComponent) {
                    return <MissingSection />
                }
                let section = gridItem.itemType[0]
                return <LayoutGridItem itemSize={gridItem.itemSize} key={gridItem._key} >
                    <LayoutGridComponent {...section} isInLayoutGrid={true}/>
                </LayoutGridItem>
            })}
        </div>
    )
}

export default LayoutGrid