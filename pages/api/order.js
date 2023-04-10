import { writeClient } from "../../utils/sanityClient";

const orderValidater = userData => {
    let errors = {}
    const mailReg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if(String(userData.nameInput).length == 0) errors.nameInput = "Name field is empty"
    if(String(userData.phoneNumber).length == 0) errors.phoneNumber = "Phone number field is empty"
    if(String(userData.email).length == 0){
        errors.email = "Email field is empty"
    } else {
        if(!mailReg.test(String(userData.email))) errors.email = "Your email isn't valid"
    }
    if(String(userData.address).length == 0) errors.address = "Address field is empty"
    return {
        valid: Object.keys(errors).length == 0,
        errors
    }
}

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
        const {valid, errors: orderError} = orderValidater(req.body)
        if(valid) {
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
                    res.status(500).json({error: {general: "Something wrong"}})
                    resolve()
                })
        } else {
            res.status(400).json({error: orderError})
            resolve()
        }
    
    })
}