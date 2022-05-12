import Modal from "react-modal";
import { useState } from 'react'
import { client, urlFor, writeClient } from '../../../utils/sanityClient'
import styles from './OrderModal.module.css'
const changeDefaultStyle = () => {
    const customeContentStyle = {
        width: 450,
        transform: "translateX(-50%)",
        left: '50%'
    }
    const customeOverlayStyle = {
        backgroundColor: 'rgba(63, 63, 63, 0.9)',
        zIndex: 2
    }
    Object.entries(customeContentStyle).forEach(([key, value]) => {
        Modal.defaultStyles.content[key] = value
    });
    Object.entries(customeOverlayStyle).forEach(([key, value]) => {
        Modal.defaultStyles.overlay[key] = value
    });
}

const numberWithCommas = x => x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");


const OrderModal = ({isOpen, onRequestClose, productItem}) => {
    Modal.setAppElement('#root')
    changeDefaultStyle()
    const [nameInput, setNameInput] = useState('')
    const [phoneNumber, setPhoneNumber] = useState('')
    const [email, setEmail] = useState('')
    const [address, setAddress] = useState('')
    const [orderNumber, setOrderNumber] = useState(1)
    const [message, setMessage] = useState('')
    const handleSubmit = e => {
        e.preventDefault()
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
                    setMessage(<>
                        Thanks for buying
                    </>)
                })
        }
    }
    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            contentLabel="Buy Modal"
        >
            <img src={urlFor(productItem.productImage).width(400).height(200).url()} className={styles.image}/>
            <div className={styles.title}>{productItem.title}</div>
            {productItem.isDiscount ? (
                <div className={styles.fontSizeBase}>
                    Giá gốc : <span className={styles.lineThroughText}>{numberWithCommas(productItem.price)}đ</span> &#8594; <span className={styles.redText}>{numberWithCommas(productItem.price * (100 - productItem.discountAmount) / 100)}đ</span>
                </div>
            ) : (
                <div className={styles.fontSizeBase}>
                    <span className={styles.redText}>{numberWithCommas(productItem.price)}đ</span>
                </div>
            )}
            <div className={styles.noteText}>Vui lòng nhập thông tin. Chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất</div>
            <form onSubmit={handleSubmit}> 
                <div className={styles["mt-10"]}>
                    <label>
                        <span className={styles.textInputLabel}>Tên của bạn : </span>
                        <br/>
                        <input
                            name="customerName"
                            type="text"
                            value={nameInput}
                            onChange={e => setNameInput(e.target.value)}
                            className={styles.textInput}
                            required

                        />
                    </label>
                </div>
                <div className={styles["mt-10"]}>
                    <label >
                        <span className={styles.textInputLabel}>SĐT :</span>
                        <br/>
                        <input
                            name="customerPhoneNumber"
                            type="tel"
                            value={phoneNumber}
                            onChange={e => setPhoneNumber(e.target.value)}
                            className={styles.textInput}
                            required
                        />
                    </label>
                </div>
                <div className={styles["mt-10"]}>
                    <label >
                        <span className={styles.textInputLabel}>Email :</span>
                        <br/>
                        <input
                            name="customerMail"
                            type="text"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            className={styles.textInput}
                            required

                        />
                    </label>
                </div>
                
                <div className={styles["mt-10"]}>
                    <label >
                        <span className={styles.textInputLabel}>Địa chỉ: </span>
                        <br/>
                        <input
                            name="customerAddress"
                            type="text"
                            value={address}
                            onChange={e => setAddress(e.target.value)}
                            className={styles.textInput}
                            required

                        />
                    </label>
                </div>
                <div className={styles["mt-10"]}>
                    <span className={styles.textInputLabel}>Số lượng :</span>
                    <br/>
                    <select value={orderNumber} onChange={e => setOrderNumber(e.target.value)} className={styles.select}>
                        {[...Array(9)].map((x, i) =>
                            <option value={i+1} key={i}>{i + 1}</option>
                        )}
                    </select>
                </div>
                {message && <div className={styles.successOrderMsg}>
                    {message}    
                </div>}
                <div className={styles.submitBtnContainer}>
                    <button type="submit" className={styles.submitBtn}>Đặt hàng ngay</button>
                </div>
            </form>
        </Modal>
    )
}

export default OrderModal