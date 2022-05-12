import { useState } from 'react'
import styles from './ProductGridItem.module.css'
import { urlFor } from '../../../utils/sanityClient'
import { FaTruck } from 'react-icons/fa'
import Link from 'next/link'
import { getPathFromSlug } from '../../../utils/urls'
import OrderModal from "./OrderModal";
const numberWithCommas = x => x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");


const GridItem = ({ gridItem }) => {
    const [isModalOpen, setModalOpen] = useState(false)
    return (
        <div className={styles.item} >
            <div className={styles.imageContainer}>
                <img src={urlFor(gridItem.productImage).width(280).url()} className={styles.itemImg}/>
                <div className={styles.addToCart}>
                    <button className={styles.addButton} onClick={() => setModalOpen(true)}>Mua</button>
                    {gridItem.isFreeship && <span className={styles.isFreeShip}><FaTruck style={{transform: "translateY(25%)"}}/> - Miễn phí</span>}
                </div>
            </div>
            <div className={styles.itemFooter}>
                <div className={styles.itemTitle}>
                    {gridItem.productPageRoute  ? 
                        <Link href={getPathFromSlug(gridItem.productPageRoute.slug?.current)} passHref>
                            <a style={{color: "black", textDecoration: "none"}}>{gridItem.title}</a>
                        </Link> 
                    : gridItem.title}
                </div>
                <div className={styles.itemPrices}>
                    <span className={styles.itemCurrentPrice}>{gridItem.isDiscount ? numberWithCommas(gridItem.price * (100 - gridItem.discountAmount) / 100) : numberWithCommas(gridItem.price)} đ</span>
                    {gridItem.isDiscount && <span className={styles.discountPrice}>{numberWithCommas(gridItem.price)} đ</span>}
                </div>
            </div>
            {gridItem.isDiscount && (
                <div className={styles.isDiscountedBanner}>
                    <span className={styles.discountAmount}>Giảm {gridItem.discountAmount}%</span>
                </div>
            )}
            <OrderModal
                isOpen={isModalOpen}
                onRequestClose={() => setModalOpen(false)}
                productItem={gridItem}
            />
            
        </div>
    )
}

export default GridItem