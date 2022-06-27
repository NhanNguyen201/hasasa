import { useState } from "react";
import { urlFor } from '../../../utils/sanityClient'

import { Row, Col,  User, Text } from "@nextui-org/react";
import Paper from "@mui/material/Paper";
import Button  from "@mui/material/Button";
import dayjs from 'dayjs'
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import { AiOutlineEye } from 'react-icons/ai'
import { BsCartCheck } from 'react-icons/bs'
import { RiCloseLine } from 'react-icons/ri'
import Slide from '@mui/material/Slide';
import MuiAlert from '@mui/material/Alert';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';

import styles from './HistoryCartTable.module.css'
const numberWithCommas = x => x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

const CartRow = ({ row }) => {
    const [isDialogOpen, setDialogOpen]= useState(false)
    return (
        <>
            <Paper elevation={3} className={styles.cartPaper}>
                <Grid container >
                    <Grid item xs={4}>   
                        <Col css={{ height: '100%',d: "flex", justifyContent: "flex-start", alignItems: "center" }}>
                            <Typography  variant="p"><BsCartCheck /> - {row._id}</Typography>
                        </Col>
                    </Grid>
                    <Grid item xs={3}>
                        <Col css={{ height: '100%', d: "flex", justifyContent: "flex-start", alignItems: "center" }}>
                            <Text >{row.price}</Text>
                        </Col>
                    </Grid>
                    <Grid item xs={3}>
                        <Col css={{ height: '100%', d: "flex", justifyContent: "center", alignItems: "center" }}>
                            <Text >{dayjs(row._createdAt).format('hh:mm, DD/MM/YYYY')}</Text>
                        </Col>
                    </Grid>
                    <Grid item xs={2} >
                        <Col css={{ d: "flex", justifyContent: "end", alignItems: "center" }}>
                            <IconButton
                                aria-label="Open"
                                onClick={() => setDialogOpen(true)}
                                
                            >
                                <AiOutlineEye />
                            </IconButton>
                        </Col>  
                    </Grid>
                </Grid>
            </Paper>
            <Dialog
                maxWidth='lg'
                open={isDialogOpen}
                onClose={() => setDialogOpen(false)}
            >
                <DialogTitle> Giỏ hàng của bạn
                    <IconButton
                        aria-label="close"
                        onClick={() => setDialogOpen(false)}
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
                    {row.cart.map((item, idx) => <Paper  key={idx} style={{padding: "10px", margin: "10px 0"}} elevation={3}>
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
                    
                </DialogContent>
            </Dialog>
        </>
    )
}

const HistoryCartTable = ({carts}) => {
    return (
        <div>
            <Grid container  style={{margin: "1rem 0"}} >
                <Grid item xs={4}>   
                    <Text b >Đơn hàng</Text>
                </Grid>
                <Grid item xs={3}>
                    <Text b>Tổng giá</Text>
                </Grid>
                <Grid item xs={3}>
                    <Col css={{ d: "flex", justifyContent: "center", alignItems: "center" }}>
                        <Text b>Ngày</Text>
                    </Col>
                </Grid>
                <Grid item xs={2} >
                    <Col css={{ d: "flex", justifyContent: "end", alignItems: "center" }}>
                        <Text b>Xem</Text>
                    </Col>
                </Grid>
            </Grid>
            {carts.map(item => <CartRow key={item._id} row={item}/> )}
        </div>
    )
}
export default HistoryCartTable