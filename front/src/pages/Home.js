import { useAccount } from 'wagmi'
import Header from '../components/Header'
import Footer from '../components/Footer'
import nftABI from '../utils/nftAbi.json'
import { nftAddress, originURI } from '../constants'
import { useEffect, useState } from 'react'
import Web3 from 'web3'
import { useNavigate } from 'react-router'
import { useUser } from '../context/UserContext'

const Home = () => {
    const account = useAccount()
    const navigate = useNavigate()
    const { user } = useUser()
    const [nfts, setNfts] = useState([])

    useEffect(() => {
        if (user === '' || user === undefined) navigate('/Login')
    }, [user, navigate])

    const fetchContractRead = async () => {
        const web3Provider = new Web3(window.ethereum);
        const tmp = new web3Provider.eth.Contract(nftABI, nftAddress)
        const res = await tmp.methods.walletOfOwner(account.address).call();
        setNfts(res);
    };

    useEffect(() => {
        if (account.address !== undefined && nfts.length === 0) {
            fetchContractRead();
        }
        if (account.address === undefined && nfts.length > 0) {
            setNfts([])
        }
    }, [account.address, nfts, fetchContractRead, setNfts]);

    return (
        <div className="min-h-screen" data-theme="wireframe">
            <Header username={user === undefined ? '' : user} />
            <div className="hero min-h-screen">
                <div className="hero-content text-center flex flex-col">
                    <div className="max-w-md">
                        <h1 className="text-5xl font-bold pb-4">Hello there, {user}</h1>
                        {account.address !== undefined &&
                            <>
                                {nfts.length > 0 &&
                                    <div>
                                        <p>There are {nfts.length} nfts in your wallet</p>
                                        <div className='flex gap-4 pt-12 justify-center'>
                                            {
                                                nfts.map((nft, ind) => (
                                                    <img alt="QR" style={{ width: '256px' }} key={ind} src={`${originURI}${nft}.png`} />
                                                ))
                                            }
                                        </div>
                                    </div>
                                }
                            </>}
                        <p className="py-6 text-xl font-normal leading-normal mt-0 mb-2">
                            You are successfully logged in.
                        </p>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default Home