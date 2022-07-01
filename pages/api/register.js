import { client } from '../../utils/sanityClient'
const userDataQuery =  user  => `
    *[_type == "user" && (userName == '${user.username}' || email == '${user.username}' || phoneNumber == '${user.username}')]{
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
        client.fetch(query)
            .then(data => {
                if(data[0]) {
                    const user = data[0]
                    const { password } = req.body
                    if(password === user.password) {
                        delete user.password
                        res.status(200).json({user})
                        resolve()
                    } else {
                        res.status(401).json({error: "Wrong Credential"})      
                        resolve()
                    }
                }else {
                    res.status(404).json({error: "No user found"})
                    resolve()
                } 
            })
            .catch(sanityErr => {
                console.log("error: ", sanityErr)
                res.status(500).json({error: "Something is wrong"})
                resolve()

            })
    })
}