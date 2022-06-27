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