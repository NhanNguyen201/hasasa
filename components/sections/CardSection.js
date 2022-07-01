import { useEffect, useState } from 'react'; 
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import styles from './CardSection.module.css'
import { urlFor, client } from '../../utils/sanityClient';
import Link from 'next/link';

const CardSection = ({ cardTitle, cardContent, cardImage, route }) => {
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
             <Card sx={{ maxWidth: 345 }} className={styles.card}>
                <CardMedia
                    component="img"
                    height="200"
                    image={urlFor(cardImage).height(200).fit("crop").crop('focalpoint').url()}
                    alt="green iguana"
                />
                <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                        {Object.keys(pageRoute).length > 0 ? <Link href={`/${pageRoute.slug.current}`}><a style={{color: 'black'}}>{cardTitle}</a></Link> : cardTitle}
                    </Typography>
                    <Typography variant="body2">{cardContent}</Typography>
                </CardContent>

            </Card>
        </div>
    )
}

export default CardSection