import { useState, forwardRef, useEffect } from 'react'
import { urlFor } from '../../../utils/sanityClient'
import { Image } from "@nextui-org/react";

import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Grid from '@mui/material/Grid';

import Snackbar from '@mui/material/Snackbar';
import Slide from '@mui/material/Slide';
import MuiAlert from '@mui/material/Alert';

import IconButton from '@mui/material/IconButton';
import { RiCloseLine } from 'react-icons/ri'
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button'
import styles from './OrderModal.module.css'


const numberWithCommas = x => x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

const SlideTransition = (props) => {
    return <Slide {...props} direction="up" />;
}

const Alert = forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const OrderModal = ({isOpen, onRequestClose, productItem}) => {
    if(!productItem) return null;
    const [nameInput, setNameInput] = useState('')
    const [phoneNumber, setPhoneNumber] = useState('')
    const [email, setEmail] = useState('')
    const [address, setAddress] = useState('')
    const [orderNumber, setOrderNumber] = useState(1)
    const [errorOrdering, setErrorOrdering] = useState({})
    const [buttonLoading, setButtonLoading] = useState(false)
    const [orderMessage, setOrderMessage] = useState("")
    const [isSnackBarBuyingOpen, setIsSnackBarBuyingOpen] = useState(false)
    
    const handleSuccessOrdering = msg => {
        setOrderMessage(msg)
        setIsSnackBarBuyingOpen(true)
    }

    const handleSubmit = async() => {
        // e.preventDefault()
        console.log("submit: ")
        setButtonLoading(true)
        setErrorOrdering({})
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                nameInput, 
                phoneNumber,
                email,
                address,
                productItem,
                orderNumber
            })
        }
        const res = await(await fetch('/api/order', options)).json()
        setButtonLoading(false)
        if(res.error){
            setErrorOrdering(res.error)
        } else if(res.message){
            handleSuccessOrdering(res.message)
        }
        setTimeout(() => {
            onRequestClose()
            setErrorOrdering({})
        }, 3000)
        
    }
    return (
        <>
            <Snackbar 
                open={isSnackBarBuyingOpen} 
                autoHideDuration={6000} 
                onClose={() => setIsSnackBarBuyingOpen(false)}
                TransitionComponent={SlideTransition}
            >
                <Alert onClose={() => setIsSnackBarBuyingOpen(false)} severity="success" sx={{ width: '100%' }}>
                    {orderMessage}
                </Alert>
            </Snackbar>
            <Dialog
                maxWidth='xs'
                open={isOpen}
                onClose={onRequestClose}
            >
                <DialogTitle>Đơn hàng nhanh
                    <IconButton
                        aria-label="close"
                        onClick={onRequestClose}
                        sx={{
                            position: 'absolute',
                            right: 8,
                            top: 8,
                        }}
                    >
                        <RiCloseLine />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                
                    <Image 
                        showSkeleton
                        maxDelay={10000}
                        src={urlFor(productItem.productImage).width(500).height(150).url() || ""}
                        height={150}
                        objectFit
                        alt="Product Image"
                    />

                    <div className={styles.title}>{productItem.title}</div>
                    {productItem.isDiscount ? (
                        <div className={styles.fontSizeBase}>
                            Giá gốc : <span className={styles.lineThroughText}>{numberWithCommas(productItem.price)}đ</span> &#8594; <span className={styles.redText}>{numberWithCommas(productItem.price * (100 - productItem.discountAmount) / 100)}đ</span>
                        </div>
                    ) : (
                        <div className={styles.fontSizeBase}>
                            <span className={styles.redText}>{numberWithCommas(productItem.price)}đ</span>
                        </div>
                    )}
                    <div className={styles.noteText}>Vui lòng nhập thông tin. Chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất</div>
                    
                    <TextField 
                        style={{marginTop: 10}} 
                        label="Tên" 
                        variant="outlined" 
                        onChange={e => setNameInput(e.target.value)} 
                        value={nameInput} fullWidth
                        error={!!errorOrdering?.nameInput}
                        helperText={errorOrdering?.nameInput ?? errorOrdering?.nameInput}
                    />
                    
                    <TextField 
                        style={{marginTop: 10}} 
                        label="Sđt" 
                        variant="outlined" 
                        onChange={e => setPhoneNumber(e.target.value)} 
                        value={phoneNumber} 
                        fullWidth
                        error={!!errorOrdering?.phoneNumber}
                        helperText={errorOrdering?.phoneNumber ?? errorOrdering?.phoneNumber}
                    />
                    
                    <TextField 
                        style={{marginTop: 10}} 
                        label="Email" 
                        variant="outlined" 
                        onChange={e => setEmail(e.target.value)} 
                        value={email} 
                        fullWidth
                        error={!!errorOrdering?.email}
                        helperText={errorOrdering?.email ?? errorOrdering?.email}
                    />
                    
                    <TextField 
                        style={{marginTop: 10}} 
                        label="Địa chỉ" 
                        variant="outlined" 
                        onChange={e => setAddress(e.target.value)} 
                        value={address} fullWidth
                        error={!!errorOrdering?.address}
                        helperText={errorOrdering?.address ?? errorOrdering?.address}
                    />

                    <Grid
                        container 
                        spacing={2}
                        style={{marginTop: 10}}
                    >
                        <Grid item xs={6}>
                            <FormControl fullWidth >
                                <InputLabel id="addNumber-select-label">Số lượng</InputLabel>
                                <Select
                                    labelId="addNumber-select-label"
                                    id="addNumber-select"
                                    value={orderNumber}
                                    label="Order number"
                                    onChange={e => setOrderNumber(e.target.value)}
                                >
                                    {new Array(9).fill().map((_, idx) =>  <MenuItem value={idx + 1} key={idx}>{idx + 1}</MenuItem>)}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={6}>
                            <TextField  
                                InputProps={{
                                    readOnly: true,
                                }}
                                fullWidth 
                                label="Price" 
                                variant="outlined" 
                                value={`${numberWithCommas(productItem.price * orderNumber * (100 - (productItem.discountAmount || 0)) / 100)} đ` }
                            />
                        </Grid>
                    </Grid> 
                    
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => handleSubmit()} variant="contained" disabled={buttonLoading}>Đặt hàng ngay</Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default OrderModal