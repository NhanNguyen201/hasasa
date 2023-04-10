import { Row, Col, Tooltip, User, Text, Grid } from "@nextui-org/react";
import { useSelector } from 'react-redux';

import { urlFor } from "../../../utils/sanityClient";
import { useState, useEffect, forwardRef } from "react";
import Divider from '@mui/material/Divider';

import Snackbar from '@mui/material/Snackbar';
import Slide from '@mui/material/Slide';
import MuiAlert from '@mui/material/Alert';
import Button from '@mui/material/Button'
import CartPurchaseDialog from "../CartPurchaseDialog";
const numberWithCommas = x => x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

const SlideTransition = (props) => {
    return <Slide {...props} direction="up" />;
}

const Alert = forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const CartRow = ({ row, rowActions }) => {
    return (
        <Grid.Container  gap={2} >
            <Grid xs={4}>   
                <User 
                    squared 
                    src={urlFor(row.productItem.productImage).width(40).height(40)} 
                    size="lg" 
                    name={row.productItem.title} css={{ p: 0 }}
                />
            </Grid>
            <Grid xs={3}>
                <Col css={{ d: "flex", justifyContent: "start", alignItems: "center" }}>
                    <Text>
                        {numberWithCommas(row.productItem.price * (100 - row.productItem.discountAmount) / 100)} đ {row.productItem.isDiscount && `( Giảm ${row.productItem.discountAmount} %)`}
                    </Text>
                </Col>
            </Grid>
            <Grid xs={3}>
                <Row justify="center" align="center" gap={0.5}>
                    <Col css={{ d: "flex" }}>
                        <Button variant="contained" style={{background: "black"}} size="large" onClick={() => rowActions.decrease(row._key)}>-</Button>
                    </Col>
                    <Col css={{ d: "flex", justifyContent: "center" }}>
                        <Tooltip content="Số lượng sản phẩm">
                            {row.productQuantity}
                        </Tooltip>
                    </Col>
                    <Col css={{ d: "flex" }}>
                        <Button variant="contained" style={{background: "black"}} size="large" onClick={() => rowActions.increase(row._key)}>+</Button>
                    </Col>
                    <Col css={{ d: "flex" }}>
                        <Button variant="contained" style={{background: "black"}} size="large" onClick={() => rowActions.deleteItem(row._key)}>Xóa</Button>
                    </Col>
                </Row>
            </Grid>
            <Grid xs={2}>
                <Col css={{ d: "flex", justifyContent: "end", alignItems: "center" }}>
                    <Text >
                        {numberWithCommas(row.productItem.price * row.productQuantity * (100 - row.productItem.discountAmount) / 100)} đ
                    </Text>
                </Col>
            </Grid>
        </Grid.Container>
    )
}

const CartTable = ({ cart }) => {
    const { userData } = useSelector(state => state.user)

    const [internalCart, setInternalCart] = useState([])
    const [cartId, setCartId] = useState("")
    const [error, setError]= useState("")
    const [saveMessage, setSaveMessage] = useState("")
    const [saveSnackBarOpen, setSaveSnackBarOpen] = useState(false)
    const [purchaseMessage, setPurchaseMessage] = useState("")
    const [purchaseSnackBarOpen, setPurchaseSnackBarOpen] = useState(false)

    const [paymentDialogOpen, setPaymentDialogOpen] = useState(false)

    useEffect(() => {
        setInternalCart(cart.cart)
        setCartId(cart.cartId)
    }, [cart])

    const rowActions = {
        deleteItem: (key) => {
            setInternalCart(prev => internalCart.filter(cart => cart._key !== key))
        },
        increase: (key) => {
            let idx = internalCart.findIndex(item => item._key == key)
            if(idx > -1) {
                let newCart = [...internalCart]
                newCart[idx].productQuantity++
                setInternalCart(prev => newCart)
            }
        },
        decrease: (key) => {
            let idx = internalCart.findIndex(item => item._key == key)
            if(idx > -1) {
                if(internalCart[idx].productQuantity > 1){
                    let newCart = [...internalCart]
                    newCart[idx].productQuantity -= 1
                    setInternalCart(prev => newCart)
                } else {
                    setInternalCart(prev => internalCart.filter(cart => cart._key !== key))
                }
            }
        }
    }
    const handleSave = async() => {
        const options = {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                newCart: internalCart
            }),
        }
        const res = await (await fetch(`/api/cart/save?_cartId=${cartId}`, options)).json()
        if(res.error) {
            setError(res.error)

        } else if(res.message){
            setSaveMessage(res.message)
            setSaveSnackBarOpen(true)
        }
        
    }
    const handlePurchase = async() => {
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId: userData._id, 
                cart: internalCart
            })
        }
        
        const res = await(await fetch(`/api/cart/purchase?_cartId=${cartId}`, options)).json()
        if(res.error){
            setError(res.error)
        } else if(res.message) {
            setPurchaseMessage(res.message)
            setPurchaseSnackBarOpen(true)
            setPaymentDialogOpen(false)

            setInternalCart([])
        }
        

    }

   
    return (
        <div>
            <Grid.Container  style={{margin: "1rem 0"}} gap={0.5}>
                <Grid xs={4}>   
                    <Text b >Sản phẩm</Text>
                </Grid>
                <Grid xs={3}>
                    <Text b>Giá</Text>
                </Grid>
                <Grid xs={3}>
                    <Col css={{ d: "flex", justifyContent: "center", alignItems: "center" }}>
                        <Text b>Số lượng</Text>
                    </Col>
                </Grid>
                <Grid xs={2} >
                    <Col css={{ d: "flex", justifyContent: "end", alignItems: "center" }}>
                        <Text b>Tổng giá</Text>
                    </Col>  
                </Grid>
            </Grid.Container>
            
            {internalCart.map(row => <CartRow row={row} key={row._key} rowActions={rowActions}/>)}
            <Divider/>
            <Grid.Container  gap={2} >
                <Grid xs={10}>
                    <Row justify="flex-end" align="center">
                        {internalCart.length > 0 && (
                            <>
                                <Button variant="contained" style={{marginRight: "1rem"}} onClick={() => setPaymentDialogOpen(true)}>Thanh toán</Button>
                                <Button variant="contained" color="secondary" onClick={() => handleSave()}>Lưu</Button>
                            </>
                        )}
                    </Row>
                </Grid>
                <Grid xs={2}>
                    <Col css={{ d: "flex", justifyContent: "end", alignItems: "center" }}>
                        <Text >
                            {numberWithCommas(internalCart.reduce((arr, cur) => arr + cur.productItem.price * cur.productQuantity * (100 - cur.productItem.discountAmount || 0) / 100, 0))} đ
                        </Text>
                    </Col>
                </Grid>
            </Grid.Container>
            <CartPurchaseDialog 
                isOpen={paymentDialogOpen}
                cart={internalCart}
                onRequestClose={() => setPaymentDialogOpen(false)} 
                onHandlePurchase={() => handlePurchase()}
            /> 
            <Snackbar 
                open={saveSnackBarOpen} 
                autoHideDuration={3000} 
                onClose={() => setSaveSnackBarOpen(false)}
                TransitionComponent={SlideTransition}
            >
                <Alert onClose={() => setSaveSnackBarOpen(false)} severity="success" sx={{ width: '100%' }}>
                    {saveMessage}
                </Alert>
            </Snackbar>
            <Snackbar 
                open={purchaseSnackBarOpen} 
                autoHideDuration={3000} 
                onClose={() => setPurchaseSnackBarOpen(false)}
                TransitionComponent={SlideTransition}
            >
                <Alert onClose={() => setPurchaseSnackBarOpen(false)} severity="success" sx={{ width: '100%' }}>
                    {purchaseMessage}
                </Alert>
            </Snackbar>

        </div>
    )
}

export default CartTable