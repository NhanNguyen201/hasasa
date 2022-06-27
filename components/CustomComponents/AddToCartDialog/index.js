import { useState, forwardRef } from 'react'
import { useSelector } from 'react-redux';

import { urlFor } from '../../../utils/sanityClient'
import { Button, Image } from "@nextui-org/react";

import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

import Snackbar from '@mui/material/Snackbar';
import Slide from '@mui/material/Slide';
import MuiAlert from '@mui/material/Alert';
import Grid from '@mui/material/Grid';

import IconButton from '@mui/material/IconButton';
import { RiCloseLine } from 'react-icons/ri'
import TextField from '@mui/material/TextField';
import styles from './AddToCartDialog.module.css';

const SlideTransition = (props) => {
    return <Slide {...props} direction="up" />;
}

const Alert = forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const numberWithCommas = x => x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

const AddToCartDialog = ({isOpen, onRequestClose, productItem}) => {
    const { userData } = useSelector(state => state.user)
    const [errorMessage, setErrorMessage] = useState('')

    const [addNumber, setAddNumber] = useState(1)
    
    const [isSnackBarAddOpen, setIsSnackBarAddOpen] = useState(false)
    const [addMessage, setAddMessage] = useState("")
    
    const handleSuccessAdding = msg =>  {
        setAddMessage(msg)
        setIsSnackBarAddOpen(true)
    }
    const handleAddToCart = async() => {
        const options = {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId: userData._id, 
                productId: productItem._id,
                quantity: addNumber
            })
        }
        const res = await (await fetch('/api/cart/add', options)).json()
        if(res.message) {
            handleSuccessAdding(res.message)
            onRequestClose()
        } else if(res.error) {
            setErrorMessage(res.error)
        }
    }

    return(
        <>
            <Dialog
                maxWidth='xs'
                open={isOpen}
                onClose={onRequestClose}
            >
                <DialogTitle>Thêm vào giỏ hàng
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
                        src={urlFor(productItem.productImage).width(500).height(200).url()}
                        height={200}
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
                    
                    <Grid
                        container 
                        spacing={2}
                        className={styles.mt10}
                    >
                        <Grid item xs={6}>
                            <FormControl fullWidth >
                                <InputLabel id="addNumber-select-label">Số lượng</InputLabel>
                                <Select
                                    labelId="addNumber-select-label"
                                    id="addNumber-select"
                                    value={addNumber}
                                    label="add number"
                                    onChange={e => setAddNumber(e.target.value)}
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
                                label="Price" 
                                variant="outlined" 
                                value={`${numberWithCommas(productItem.price * addNumber * (100 - (productItem.discountAmount || 0)) / 100)} đ`}
                            />
                        </Grid>
                    </Grid>        
                    {errorMessage && <div className={styles.errorOrderMsg}>
                        {errorMessage}    
                    </div>}
                </DialogContent>
                <DialogActions>
                    <div className={styles.submitBtnContainer}>
                        <Button onPress={() => handleAddToCart()}>Thêm vào giỏ</Button>
                    </div>
                </DialogActions>
            </Dialog>
            <Snackbar 
                open={isSnackBarAddOpen} 
                autoHideDuration={6000} 
                onClose={() => setIsSnackBarAddOpen(false)}
                TransitionComponent={SlideTransition}
            >
                <Alert onClose={() => setIsSnackBarAddOpen(false)} severity="success" sx={{ width: '100%' }}>
                    {addMessage}
                </Alert>
            </Snackbar>
        </>
    )
}

export default AddToCartDialog