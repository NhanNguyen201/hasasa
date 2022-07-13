import { useEffect, useState } from 'react'; 

import Typography from '@mui/material/Typography';
import styles from './CardSection.module.css'
import { urlFor, client } from '../../utils/sanityClient';
import Link from 'next/link';

const CardSection = ({cardTitle, cardContent, cardImage, route }) => {
    const [pageRoute, setPageRoute] = useState({})
    useEffect(() => {
        client.fetch(`*[_type == "route" && _id == "${route._ref}"]`)
            .then(data => {
                if(data[0]) {
                    setPageRoute(data[0])
                }
            })
    }, [route])
    return(
        <div className={styles.root}>
            <div className={styles.card}>
                <img 
                    src={urlFor(cardImage).width(600).crop('focalpoint').url()}
                    alt="card image"
                    className={styles.image}
                />
                <div
                    className={styles.cardContent}
                >
                    <Typography gutterBottom variant="h5" component="div" >
                        {Object.keys(pageRoute).length > 0 ? <Link href={`/${pageRoute.slug.current}`}><a style={{color: 'black'}}>{cardTitle}</a></Link> : cardTitle}
                    </Typography>
                    <Typography variant="body2" >{cardContent}</Typography>
                </div>
            </div>
        </div>
    )
}

export default CardSection