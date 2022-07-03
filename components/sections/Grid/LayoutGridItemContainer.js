import * as layoutItems from './LayoutGridItemChild'
import capitalizeString from '../../../utils/capitalizeString'; 
import MissingSection from '../../MissingSection';

const LayoutGridItemContainer = (props) => {
    function resolveSections(section) {
        // eslint-disable-next-line import/namespace
        const Section = layoutItems[capitalizeString(section._type)]
      
        if (Section) {
          return Section
        }
        console.error('Cant find section', section) // eslint-disable-line no-console
    
        return null
    }
    return <>
        {props.containerArray.map(containerItem => {
            const ContainerItemComponent = resolveSections(containerItem)
            if (!ContainerItemComponent) {
                return <MissingSection />
            }
            let section = containerItem
            return <ContainerItemComponent {...section} key={section._key} isInLayoutGrid={true}/>
        })}
    </>
        
}
export default LayoutGridItemContainer;