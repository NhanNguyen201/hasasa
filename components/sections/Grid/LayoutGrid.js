import styles from './LayoutGrid.module.css'
import * as LayoutGridItems from './LayoutGridItemChild'
import capitalizeString from '../../../utils/capitalizeString'
import MissingSection from '../../MissingSection'
import LayoutGridItem from './LayoutGridItem'

function resolveSections(section) {
    // eslint-disable-next-line import/namespace
    const Section = LayoutGridItems[capitalizeString(section._type)]
  
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
                    <LayoutGridComponent {...section} />
                </LayoutGridItem>
            })}
        </div>
    )
}

export default LayoutGrid