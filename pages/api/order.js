import { writeClient } from "../../utils/sanityClient";

export default function(req, res){
    const { 
        nameInput, 
        phoneNumber, 
        email, 
        address, 
        productItem, 
        orderNumber
    } = req.body;
    return new Promise((resolve, reject) => {
        if(nameInput && phoneNumber && email && address) {
            const doc = {
                _type: 'instaOrder',
                userName: nameInput,
                userPhoneNumber: phoneNumber,
                userEmail: email,
                userAddress: address,
                productItem: {
                    _type: 'reference',
                    _ref: productItem._id
                },
                productQuantity: Number(orderNumber),
                sumaryPrice: Number(orderNumber * (productItem.isDiscount ? productItem.price * (100 - productItem.discountAmount) / 100 : productItem.price))
            }
            writeClient
                .create(doc)
                .then(() => {
                    res.status(200).json({message: "Thanks for your ordering"})
                    resolve()
                })
                .catch(error => {
                    console.log("sanity error: ", error)
                    res.status(500).json({error: "Something wrong"})
                    resolve()
                })
        } else {
            res.status(400).json({error: "Please fill all the field"})
            resolve()
        }
    
    })
}