import { client } from "../../../utils/sanityClient";

export default function(req, res){
    const { _productId } = req.query;
    return new Promise((resolve, reject) => {
        client.fetch(`*[_type == "product" && _id == '${_productId}']`)
        .then(data => {
            if(data[0]) {
                res.status(200).json({product: data[0]});
                resolve()    
            } else {
                res.status(404).json({error: "product not found"})
                resolve()
            }
        })
        .catch(error => {
            console.log(error)
            res.status(500).json({error: "Something is wrong"});
            resolve();
        });
    });
}