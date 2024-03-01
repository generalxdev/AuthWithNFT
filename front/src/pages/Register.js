import { useAccount } from 'wagmi'
import Header from '../components/Header'
import Web3 from 'web3'
import { useEffect, useState } from 'react'
import QRCode from "react-qr-code";
import { FadeLoader } from 'react-spinners'
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.min.css';
import axios from 'axios';

import { nftAddress } from '../constants'
import nftABI from '../utils/nftAbi.json'
import { useNavigate } from 'react-router';
import { useUser } from '../context/UserContext';

const Register = () => {
    const account = useAccount()
    const navigate = useNavigate()
    const { user } = useUser()
    const [name, setName] = useState('')
    const [password, setPassword] = useState('')
    const [password2, setPassword2] = useState('')
    const [nfts, setNfts] = useState([]) 
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (user !== '') navigate('/')
    }, [user, navigate])

    const checkWallet = async () => {
        const web3Provider = new Web3(window.ethereum);
        const tmp = new web3Provider.eth.Contract(nftABI, nftAddress)
        const res = await tmp.methods.walletOfOwner(account.address).call();
        return res
    }

    useEffect(() => {
        const fetchData = async () => {
            if (account.address !== undefined && nfts.length === 0) {
                const walletNfts = await checkWallet();
                setNfts(walletNfts);rkw
            }
            if (account.address === undefined && nfts.length > 0) {
                setNfts([]);
            }
        };
        fetchData();
    }, [account.address, nfts, checkWallet])

    const handleSubmit = async () => {
        if (password !== password2) {
            toast.error('Password does not match', { autoClose: 1000 })
            return;
        }
        if (name === '' || password === '') {
            toast.warning('Input error', { autoClose: 1000 })
            return
        }
        if (account.address === undefined) {
            toast.warning('Please connect wallet to mint an nft', { autoClose: 1000 })
            return
        }
        const nftArray = await checkWallet()
        if (nftArray.length === 0) {
            toast.warning('No nfts in your wallet.\nYou need to mint an NFT before register', { autoClose: 1000 })
            return
        }
        setLoading(true)
        const data = {
            'username': name,
            'password': password,
            'nfts': nftArray,
            'wallet': account.address
        }
        const res = await axios.post('http://170.130.55.57:5000/api/register', data)
        console.log(res)
        if (res.data.message === 'success') {
            toast.success('Registered Successfully', { autoClose: 1000 })
            setTimeout(() => {
                navigate('/Login')
            }, 1000)
        } else {
            toast.warning('User has already registered', { autoClose: 1000 })
        }
        setLoading(false)
    }

    const mintNFT = async () => {
        setLoading(true)
        var eth_value = 0.011;
        const web3Provider = new Web3(window.ethereum);
        const tmp = new web3Provider.eth.Contract(nftABI, nftAddress)
        await tmp.methods
            .mint(account.address)
            .send({
                from: account.address,
                value: web3Provider.utils.toWei(eth_value.toString(), "ether"),
                gasPrice: '5000000000'
            })
        await tmp.methods.totalSupply().call()
        const vals = await checkWallet()
        setNfts(vals)
        setLoading(false)
    }

    const handleMint = () => {
        if (account.address === undefined) {
            alert('Connect your wallet to mint')
            return
        }
        mintNFT();
    }

    return (
        <div className="min-h-screen" data-theme="wireframe">
            <ToastContainer />
            <Header username={''} />
            <div className="flex flex-col items-center pt-[5%] gap-2">
                <p className="pb-4 text-2xl">Input username and password to register</p>
                <div style={{ width: '300px', textAlign: '-webkit-center' }}>Name: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<input style={{ border: 'solid 1px' }} minLength="3" name="username" id="username" type="text" placeholder='username' value={name} onChange={(e) => setName(e.target.value)} required></input></div>
                <div style={{ width: '300px', textAlign: '-webkit-center' }}>Password: <input style={{ border: 'solid 1px' }} minLength="5" name="password" id="password" type="password" placeholder='password' value={password} onChange={(e) => setPassword(e.target.value)} required></input></div>
                <div style={{ width: '300px', textAlign: '-webkit-center' }}>Confirm: &nbsp;&nbsp;<input style={{ border: 'solid 1px' }} minLength="5" name="passwordagain" id="passwordagain" type="password" placeholder='retype password' value={password2} onChange={(e) => setPassword2(e.target.value)} required></input></div>
                <button onClick={handleSubmit} className="px-4 py-2 text-white bg-blue-500 rounded-lg">Register</button>
                <button onClick={handleMint} className="px-4 py-2 text-white bg-red-500 rounded-lg">Mint your own NFT</button>
            </div>
            {nfts.length !== 0 &&
                <div className="flex flex-col items-center gap-4 pt-4 text-center">
                    <p className="text-[20px]">QRCodes of NFTs in your wallet<br />You can use one of these to authenticate</p>
                    {
                        nfts.map((item, id) => (
                            <div className="flex gap-8" key={id}>
                                <img alt="QR" style={{ width: '256px' }} src={`https://ipfs.io/ipfs/bafybeidngmtnoiluqfxodyykvs2inaoybktz3r4pt2onnufbqiubpnyv4i/${item}.png`} />
                                <QRCode title="NFT" value={`https://ipfs.io/ipfs/bafybeidngmtnoiluqfxodyykvs2inaoybktz3r4pt2onnufbqiubpnyv4i/${item}.png`} />
                            </div>
                        ))
                    }</div>
            }
            {loading &&
            
                <div className="absolute w-full h-full top-[63px] left-0 z-10" style={{ backgroundColor: 'rgb(192,192,192,0.5)' }}>
                    <div className="flex items-center justify-center h-full">
                        <FadeLoader color="#ff00ff" loading={loading} size={20} />
                    </div>
                </div>
            }
        </div >
    )
}

export default Register
