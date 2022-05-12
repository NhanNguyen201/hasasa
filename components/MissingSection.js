
import { FaHammer } from 'react-icons/fa'
import styles from './MissingSection.module.css'
const MissingSection = () => {
    return(
        <div 
            className={styles.root}
        >
            <FaHammer className={styles.icon}/><span>Sorry, this section has some issues</span>
        </div>
    )
}
export default MissingSection;
