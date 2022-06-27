import { writeClient } from "../../../utils/sanityClient"
import { v4 as uuid4 } from 'uuid';


export default function(req, res) {
    return new Promise((resolve, reject) => {
        const { newCart } = req.body
        const { _cartId } = req.query;
       
        const updatedCart = newCart.map(item => ({
            _key: uuid4(),
            _type: 'cartItem',
            productItem: {
                _ref: item.productItem._id,
                _type: 'reference'
            },
            productQuantity: item.productQuantity
        }))
        writeClient.patch(_cartId)
            .setIfMissing({cart: []})            
            .set({cart: updatedCart})
            .commit()
            .then(() => {
                res.status(200).json({message: "Giỏ hàng đã được lưu"})
                resolve()
            })
            .catch(error => {
                console.log("error: ", error)
                res.status(500).json({error: "Something is wrong"})
                resolve()
            })
    })
}