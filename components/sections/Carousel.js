import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';
import { urlFor } from "../../utils/sanityClient";
import styles from './Carousel.module.css'
const CarouselBanner = props => {
    const { images, height } = props;
    return (
        <div className={styles.root}>
            <Carousel 
                autoFocus={true}
                showThumbs={false}
                emulateTouch={true}
                autoPlay={true}
                interval={2000}
                showStatus={false}
                infiniteLoop={true}
            >
                {images.map((img) => (
                    <div key={img._key}>
                        <img src={urlFor(img).width(2000).height(height).url()} />
                    </div>
                ))}
            </Carousel>

        </div>
    )
}

export default CarouselBanner