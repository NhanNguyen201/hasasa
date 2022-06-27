import { writeClient } from "../../../utils/sanityClient"
import { v4 as uuid4 } from 'uuid';

const numberWithCommas = x => x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

export default function(req, res) {
    return new Promise((resolve, reject) => {
        const { cart, userId } = req.body
        const { _cartId } = req.query;
        const doc = {
            _type: 'purchaseCart',
            user: {
                _type: 'reference',
                _ref: userId
            },
            cart: cart.map(item => ({
                _key: uuid4(),
                _type: 'cartItem',
                productItem: {
                    _ref: item.productItem._id,
                    _type: 'reference'
                },
                productQuantity: item.productQuantity
            })),
            cartStatus: 'pending',
            price: numberWithCommas(cart.reduce((arr, cur) => arr + cur.productItem.price * cur.productQuantity * (100 - cur.productItem.discountAmount || 0) / 100, 0))
        }
       
        writeClient.create(doc)
            .then(() => {
                writeClient.patch(_cartId)
                .set({cart: []})
                .commit()
            })
            .then(() => {
                res.status(200).json({message: "Cảm ơn đã mua hàng"})
                resolve()
            })
            .catch(error => {
                console.log("error: ", error)
                res.status(500).json({error: "Something is wrong"})
                resolve()
            })
    })
}