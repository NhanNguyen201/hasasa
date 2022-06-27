import { client } from "../../../utils/sanityClient";

const historyCartQuery =  userId => `
    *[_type == "purchaseCart" && user._ref == '${userId}']{
        _id,
        _createdAt,
        cartStatus,
        price,
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
        const query = historyCartQuery(_userId)
        client.fetch(query)
            .then(data => {
                if(data) {
                    res.status(200).json({
                        carts: data
                    })
                    resolve()
                } else {
                    res.status(404).json({error: "No cart found"})
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