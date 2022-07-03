import { useState } from 'react';
import { useSelector } from 'react-redux';

import { Popover } from "@nextui-org/react";
import Button from '@mui/material/Button';
import LoadingButton from '@mui/lab/LoadingButton';

import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import styles from './BuyButtonSection.module.css'
import { BsFillCartCheckFill, BsCartPlusFill } from 'react-icons/bs'

import OrderDialog from '../CustomComponents/OrderDialog';
import AddToCartDialog from '../CustomComponents/AddToCartDialog';

const BuyButtonSection = ({align, variant, productRef, buttonText, isInLayoutGrid}) => {
    const { isLogedIn } = useSelector(state => state.user)
    const [product, setProduct] = useState({})
    const [isLoading, setIsLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")
    const [isPopoverOpen, setIsPopoverOpen] = useState(false)
    const [isBuyModalOpen, setIsBuyModalOpen] = useState(false)
    const [isAddModalOpen, setIsAddModalOpen] = useState(false)
    const handleOpenPopover = async() => {
        setErrorMessage("")
        setIsPopoverOpen(true)
        if(Object.keys(product).length == 0) {
            setIsLoading(true)
            try {
                const res = await (await fetch(`/api/product/get?_productId=${productRef._ref}`)).json()
                setProduct(res.product)
                setIsLoading(false)
            } catch (error) {
                setErrorMessage("Somethine is wrong")
            }
        } 
    }    
    const handleOpenBuyModal = () => {
        setIsPopoverOpen(false)
        setIsBuyModalOpen(true)
    }
    const handleOpenAddModal = () => {
        setIsPopoverOpen(false)
        setIsAddModalOpen(true)
    }

    if(!productRef) {
        return null
    }

    return (
        <div className={styles.root} style={{justifyContent: align || 'flex-start', padding: isInLayoutGrid ? '0' : '0 1rem'}}>
            
            <Popover placement='top'  isOpen={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
                <Popover.Trigger>
                    <Button variant={variant || 'contained'} onClick={() => handleOpenPopover()}>{buttonText}</Button>
                </Popover.Trigger>
                <Popover.Content>
                    <Paper elevation={3} style={{padding: "10px", maxWidth: "240px"}}>
                        <Grid container justifyContent="center" alignItems="center" spacing={2}>
                            <Grid item xs={12}>
                                <LoadingButton 
                                    fullWidth 
                                    loading={isLoading} 
                                    variant="outlined"  
                                    onClick={() => handleOpenBuyModal()} 
                                    startIcon={<BsFillCartCheckFill />}
                                    loadingPosition="start"
                                >
                                    - Mua Ngay
                                </LoadingButton>
                            </Grid>
                            {isLogedIn && <Grid item xs={12}>
                                <LoadingButton 
                                    fullWidth 
                                    loading={isLoading} 
                                    variant="outlined" 
                                    color="secondary" 
                                    onClick={() => handleOpenAddModal()} 
                                    startIcon={<BsCartPlusFill/>}
                                    loadingPosition="start"

                                > 
                                    - Thêm vào giỏ hàng
                                </LoadingButton>
                            </Grid>}
                        </Grid>
                    </Paper>
                </Popover.Content>
            </Popover>

            {Object.keys(product).length !== 0 && (
                <OrderDialog
                    isOpen={isBuyModalOpen}
                    onRequestClose={() => setIsBuyModalOpen(false)}
                    productItem={product}
                />
            )}
            
            {Object.keys(product).length !== 0 && (
                <AddToCartDialog
                    isOpen={isAddModalOpen}
                    onRequestClose={() => setIsAddModalOpen(false)}
                    productItem={product}
                />
            )}
        </div>
    )
}   

export default BuyButtonSection

