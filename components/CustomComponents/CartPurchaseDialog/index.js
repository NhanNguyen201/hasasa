
import { urlFor } from '../../../utils/sanityClient'
import Button  from "@mui/material/Button";

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { User } from "@nextui-org/react";


import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper'

import IconButton from '@mui/material/IconButton';
import { RiCloseLine } from 'react-icons/ri'
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';


const numberWithCommas = x => x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

const CartPurchaseDialog = ({cart = [], isOpen, onRequestClose, onHandlePurchase}) => {
    return (
        <>
            <Dialog
                maxWidth='lg'
                open={isOpen}
                onClose={onRequestClose}
            >
                <DialogTitle>Thanh toán giỏ hàng
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
                    {cart.map((item, idx) => <Paper  key={idx} style={{padding: "10px", margin: "10px 0"}} elevation={3}>
                        <User 
                            squared 
                            src={urlFor(item.productItem.productImage).width(40).height(40)} 
                            size="lg" 
                            name={item.productItem.title} css={{ p: 0 }}
                            style={{marginBottom: "20px", marginTop: "10px"}}
                        />
                        <Grid
                            container 
                            spacing={2}
                            style={{marginBottom: "10px"}}

                        >
                            <Grid item xs={6}>
                                <TextField  
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                    label="Số lượng" 
                                    variant="outlined" 
                                    value={item.productQuantity}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField  
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                    label="Giá" 
                                    variant="outlined" 
                                    value={`${numberWithCommas(item.productItem.price * item.productQuantity * (100 - (item.productItem.discountAmount || 0)) / 100)} đ`}
                                />
                            </Grid>
                        </Grid>   
                    </Paper>)}
                    <Divider/>
                    <Grid container >
                        <Grid item xs={6} style={{padding: '10px'}}>
                            <Typography variant='h6'>Tổng giá : </Typography>
                        </Grid>
                        <Grid item xs={6} style={{padding: '10px'}}>
                            <TextField  
                                fullWidth
                                InputProps={{
                                    readOnly: true,
                                }}
                                label="Giá" 
                                variant="outlined" 
                                value={`${numberWithCommas(cart.reduce((arr, cur) => arr + cur.productItem.price * cur.productQuantity * (100 - cur.productItem.discountAmount || 0) / 100, 0))} đ`}
                            />       
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <div >
                        <Button variant='contained' style={{background: "black"}} onClick={onHandlePurchase}>Thanh toán giỏ hàng</Button>
                    </div>
                </DialogActions>
            </Dialog>
           
        </>
    )
}

export default CartPurchaseDialog