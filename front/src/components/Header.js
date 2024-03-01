import {
    useConnectModal,
    useAccountModal,
    useChainModal,
} from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi'
import { FaGoogleDrive } from "react-icons/fa";
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';

export default function Header({ username }) {
    const navigate = useNavigate()
    const { setUser } = useUser()
    const { openConnectModal } = useConnectModal();
    const { openAccountModal } = useAccountModal();
    const { openChainModal } = useChainModal();

    const { isConnected } = useAccount();

    const handleLogout = async () => {
        setUser('')
        navigate('/Login')
    }
    return (
        <div className="navbar text-neutral-content bg-gray-800">
            <div className="flex-1 ml-3 text-gray-50">
                <ul className='flex flex-row justify-between gap-6'>
                    <li><Link to="/"><FaGoogleDrive size="2rem" /></Link></li>
                    {username === '' ?
                        <>
                            <li className='self-center'><Link to="/Login">Login</Link></li>
                            <li className='self-center'><Link to="/Register">Register</Link></li></>
                        : <>
                            <li className='self-center'><div className='cursor-pointer' onClick={handleLogout}>Logout</div></li>
                        </>}
                </ul>
            </div>

            <div className="navbar-end">
                {isConnected ?
                    (<><button className="btn btn-sm btn-info ml-3 normal-case" onClick={openAccountModal}>Profile</button><button className="btn btn-sm btn-error ml-3 normal-case " onClick={openChainModal}>Chain</button></>)
                    :
                    (<button className="btn btn-sm btn-error ml-3 normal-case" onClick={openConnectModal}>connect wallet</button>)
                }
            </div>
        </div >
    )
}
