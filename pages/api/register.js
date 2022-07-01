import { client, writeClient } from '../../utils/sanityClient'
const userDataQuery =  user  => `
    *[_type == "user" && ( email == '${user.email}' || phoneNumber == '${user.phoneNumber}')]{
            _id,
            userName, 
            bioName,
            email,
            address,
            phoneNumber,
            password,
        }
    `

const registerValidater = userData => {
    let errors = {}
    const mailReg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if(String(userData.bioName).length == 0) errors.bioName = "Name field is empty"
    if(String(userData.email).length == 0){
        errors.email = "Email field is empty"
    } else {
        if(!mailReg.test(String(userData.email))) errors.email = "Your email isn't valid"
    }
    if(String(userData.address).length == 0) errors.address = "Address field is empty"
    if(String(userData.phoneNumber).length == 0) errors.phoneNumber = "Phone number field is empty"
    if(String(userData.password).length == 0) errors.password = "Password field is empty"
    return {
        valid: Object.keys(errors).length == 0,
        errors
    }
}
export default function (req, res){
    const query = userDataQuery(req.body);
    return new Promise((resolve, reject) => {
       try {
            const { valid, errors: inputErrors } = registerValidater(req.body)
            if( !valid ) {
                res.status(400).json({error: inputErrors})
                resolve()
            } else {
                client.fetch(query)
                .then(data => {
                    if(data[0]) {
                        res.status(400).json({error: {general: "User is existed"}})
                        resolve()
                    } else {
                        const doc = {
                            _type: 'user',
                            userName: String(req.body.email).split('@')[0],
                            bioName: String(req.body.bioName),
                            password: String(req.body.password),
                            email: String(req.body.email),
                            address: String(req.body.address),
                            phoneNumber: String(req.body.phoneNumber),
                            status: false
                        }
                        writeClient.create(doc)
                            .then(newdoc => {
                                delete newdoc.password
                                res.status(200).json({
                                    user: newdoc
                                })
                                resolve()
                            })
                    }
                })
            }

       } catch (error) {
            res.status(500).json({error: {general: "Something is wrong"}})
            resolve()
       }
    })
}