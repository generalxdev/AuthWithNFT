import { useEffect, useState } from "react"
import { useAccount } from 'wagmi'
import { FadeLoader } from "react-spinners";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.min.css';
import Header from '../components/Header'
import axios from "axios";
import { useNavigate } from "react-router";
import { useUser } from "../context/UserContext";

const Login = () => {
    const account = useAccount()
    const { user, setUser } = useUser()
    const [name, setName] = useState('')
    const [password, setPassword] = useState('')
    const [qrcode, setQRcode] = useState(null)
    const [file, setFile] = useState(null)
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        if (user != '') navigate('/')
    }, [user])
    const handleSubmit = async () => {
        if (account.address == undefined) {
            toast.warning('Please connect your wallet', { autoClose: 1000 })
            console.log('------------')
            return
        }
        if (qrcode === null) {
            toast.warning("Please upload your NFT's QRCode to authenticate", { autoClose: 1000 })
            return
        }
        if (name == '' || password == '') {
            toast.warning("Input correct Username and Password", { autoClose: 1000 })
            return
        }
        setLoading(true)
        const data = new FormData()
        data.append('username', name)
        data.append('password', password)
        data.append('wallet', account.address)
        data.append('qrcode', file)

        const res = await axios.post('http://170.130.55.57:5000/api/login', data)
        console.log(res)
        if (res.data.message == 'Success') {
            toast.success('Login Success', { autoClose: 1000 })
            setLoading(false);
            setTimeout(() => {
                setUser(name)
            }, 1000)
        } else {
            toast.warning(res.data.message, { autoClose: 1000 })
        }
        setLoading(false)
    }

    const handleFile = (e) => {
        setFile(e.target.files[0])
        if (e.target.files.length > 0) setQRcode(URL.createObjectURL(e.target.files[0]))
    }
    return (
        <div className="min-h-screen relative" data-theme="wireframe">
            <ToastContainer />
            <Header username={''} />
            <div className="flex flex-col items-center pt-[5%] gap-2">
                <p className="text-2xl pb-4">Input username and password to Login</p>
                <div style={{ width: '300px', textAlign: '-webkit-center' }}>Name: <input style={{ border: 'solid 1px' }} minLength="3" name="username" id="username" type="text" placeholder='username' value={name} onChange={(e) => setName(e.target.value)} required></input></div>
                <div style={{ width: '280px' }}>Password: <input style={{ border: 'solid 1px' }} minLength="5" name="password" id="password" type="password" placeholder='password' value={password} onChange={(e) => setPassword(e.target.value)} required></input></div>
                <div style={{ width: '280px', textAlignLast: 'center' }}>
                    <h2>Select QR Code to authenticate:</h2>
                    <input type="file" style={{ width: '100%' }} onChange={handleFile} />
                    {(file != undefined && file.type == 'image/png') && <img src={qrcode} style={{ margin: '0px' }} />}
                </div>
                <button onClick={handleSubmit} className="bg-blue-500 text-white px-4 py-2 rounded-lg">Login</button>
            </div>
            {loading &&
                <div className="absolute w-full h-full top-[63px] left-0 z-10" style={{ backgroundColor: 'rgb(192,192,192,0.5)' }}>
                    <div className="flex h-full justify-center items-center">
                        <FadeLoader color="#ff00ff" loading={loading} size={20} />
                    </div>
                </div>
            }
        </div >
    )
}

export default Login