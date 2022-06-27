import { client } from "../../../utils/sanityClient";
const cartQuery =  userId => `
    *[_type == "userCart" && user._ref == '${userId}']{
        _id,
        cart[]{
            productItem-> {
                _id,
                title,
                price,
                productImage,
                isDiscount,
                discountAmount,
                productPageRoute->
            },
            productQuantity,
            _key,
        }
    }
`

export default function(req, res) {
    return new Promise((resolve, reject) => {
        const { _userId } = req.query;
        const query = cartQuery(_userId)
        client.fetch(query)
            .then(data => {
                if(data[0]) {
                    res.status(200).json({
                        cartId: data[0]._id,
                        cart: data[0].cart
                    })
                    resolve()
                } else {
                    res.status(404).json({error: "Cart not found"})
                    resolve()
                }
            })
            .catch(error => {
                console.log("error: ", error)
                res.status(500).json({error: "Something is wrong"})
                resolve()
            })
    })
}