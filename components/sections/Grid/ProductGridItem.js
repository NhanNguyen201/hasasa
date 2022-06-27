import { useState } from 'react'
import { useSelector } from 'react-redux';
import Link from 'next/link'
import { FaTruck } from 'react-icons/fa'
import { BsFillCartCheckFill, BsCartPlusFill } from 'react-icons/bs'

import { Popover } from "@nextui-org/react";

import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';


import { urlFor } from '../../../utils/sanityClient'
import { getPathFromSlug } from '../../../utils/urls'

import OrderDialog from "../../CustomComponents/OrderDialog";
import AddToCartDialog from '../../CustomComponents/AddToCartDialog';
import styles from './ProductGridItem.module.css'

const numberWithCommas = x => x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");


const GridItem = ({ gridItem }) => {
    const { isLogedIn } = useSelector(state => state.user)

    const [isBuyModalOpen, setIsBuyModalOpen] = useState(false)
    const [isPopoverOpen, setIsPopoverOpen] = useState(false)
    const [isAddModalOpen, setIsAddModalOpen] = useState(false)

    const handleOpenBuyModal = () => {
        setIsPopoverOpen(false)
        setIsBuyModalOpen(true)
    }
    const handleOpenAddModal = () => {
        setIsPopoverOpen(false)
        setIsAddModalOpen(true)
    }
    return (
        <div className={styles.item} >
            <div className={styles.imageContainer}>
                <img src={urlFor(gridItem.productImage).width(280).url()} className={styles.itemImg}/>
                <div className={styles.addToCart}>
                    <Popover placement='top'  isOpen={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
                        <Popover.Trigger>
                            <Button variant="contained" color="secondary">Mua</Button>
                        </Popover.Trigger>
                        <Popover.Content >
                            <Paper elevation={3} style={{padding: "10px", maxWidth: "240px"}}>
                                <Grid container justifyContent="center" alignItems="center" spacing={2}>
                                    <Grid item xs={12}>
                                        <Button fullWidth variant="outlined"  onClick={() => handleOpenBuyModal()}> <BsFillCartCheckFill /> - Mua Ngay</Button>
                                    </Grid>
                                    {isLogedIn && <Grid item xs={12}>
                                        <Button fullWidth variant="outlined" color="secondary" onClick={() => handleOpenAddModal()}><BsCartPlusFill/> - Thêm vào giỏ hàng</Button>
                                    </Grid>}
                                </Grid>
                            </Paper>
                        </Popover.Content>
                    </Popover>
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
            <OrderDialog
                isOpen={isBuyModalOpen}
                onRequestClose={() => setIsBuyModalOpen(false)}
                productItem={gridItem}
            />
            <AddToCartDialog
                isOpen={isAddModalOpen}
                onRequestClose={() => setIsAddModalOpen(false)}
                productItem={gridItem}
            />
            
        </div>
    )
}

export default GridItem