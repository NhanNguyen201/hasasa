import { writeClient, client } from '../../../utils/sanityClient'
import { v4 as uuid4 } from 'uuid';

const cartQuery = userId => `
    *[_type == "userCart" && user._ref == '${userId}']{
        _id,
        cart[]{
            _key,
            _type,
            productItem {
                _ref,
                _type
            },
            productQuantity,
        }
    }
`

export default function(req, res){
    const { userId, productId, quantity = 1 } = req.body;
    return new Promise((resolve, reject) => {
        client.fetch(cartQuery(userId))
            .then(data => {
                if(data[0]) {
                    let cart = data[0].cart || []
                    let idx = cart.findIndex(ele => ele.productItem._ref === productId)
                    if(idx > -1) {
                        cart[idx].productQuantity += quantity
                        writeClient.patch(data[0]._id)
                            .set({cart})
                            .commit()
                            .then(() => {
                                res.status(200).json({message: "Added to cart successfull"})
                                resolve()
                            })
                    }  else {
                        writeClient.patch(data[0]._id)
                            .setIfMissing({cart: []})
                            .insert("before", "cart[0]", [{
                                _key: uuid4(),
                                _type: "cartItem",
                                productItem: {
                                    _ref: productId,
                                    _type: "reference"
                                },
                                productQuantity: quantity
                            }])
                            .commit()
                            .then(() => {
                                res.status(200).json({message: "Added to cart successfull"})
                                resolve()
                            })
                    }
                } else {
                    const doc = {
                        _type: 'userCart',
                        cart: [{
                            _key: uuid4(),
                            _type: "cartItem",
                            productItem: {
                                _ref: productId,
                                _type: "reference"
                            },
                            productQuantity: quantity
                        }],                        
                        user: {
                            _ref: userId,
                            _type: "reference"
                        }
                    }
                    writeClient
                        .create(doc)
                        .then(() => {
                            res.status(200).json({message: "Added to cart successfull"})
                            resolve()
                        })
                }
            })
            .catch(sanityErr => {
                console.log("err: ", sanityErr)
                res.status(500).json({error: "Something is wrong"})
                resolve()
            })
    });
}