import { setGlobalState } from '../store'
import abi from '../abis/src/contracts/PlayToEarn.sol/PlayToEarn.json'
import address from '../abis/contractAddress.json'
import { ethers } from 'ethers'
import { logOutWithCometChat } from './chat'

const { ethereum } = window
const ContractAddress = address.address
const ContractAbi = abi.abi
let tx

const toWei = (num) => ethers.utils.parseEther(num.toString())
const fromWei = (num) => ethers.utils.formatEther(num)

const getEthereumContract = async () => {
  const accounts = await ethereum.request({ method: 'eth_accounts' })
  const provider = accounts[0]
    ? new ethers.providers.Web3Provider(ethereum)
    : new ethers.providers.JsonRpcProvider(process.env.REACT_APP_RPC_URL)
  const wallet = accounts[0] ? null : ethers.Wallet.createRandom()
  const signer = provider.getSigner(accounts[0] ? undefined : wallet.address)

  const contract = new ethers.Contract(ContractAddress, ContractAbi, signer)
  return contract
}

const isWalletConnected = async () => {
  try {
    if (!ethereum) {
      reportError('Please install Metamask')
      return Promise.reject(new Error('Metamask not installed'))
    }
    const accounts = await ethereum.request({ method: 'eth_accounts' })

    if (accounts.length) {
      setGlobalState('connectedAccount', accounts[0])
    } else {
      console.log('No accounts found.')
    }

    window.ethereum.on('chainChanged', (chainId) => {
      window.location.reload()
    })

    window.ethereum.on('accountsChanged', async () => {
      setGlobalState('connectedAccount', accounts[0])
      await loadData()
      await isWalletConnected()
      await logOutWithCometChat()
    })

    if (accounts.length) {
      setGlobalState('connectedAccount', accounts[0])
    } else {
      setGlobalState('connectedAccount', '')
      console.log('No accounts found')
    }
  } catch (error) {
    reportError(error)
  }
}

const connectWallet = async () => {
  try {
    if (!ethereum) return alert('Please install Metamask')
    const accounts = await ethereum.request({ method: 'eth_requestAccounts' })
    setGlobalState('connectedAccount', accounts[0])
  } catch (error) {
    reportError(error)
  }
}

const createJob = async ({
  jobTitle,
  description,
  tags,
  prize
})=> {
  if (!ethereum) return alert("Please install Metamask")
  return new Promise( async (resolve, reject)=> {
      try {
        const contract = await getEthereumContract()
        tx = contract.addJobListing(jobTitle, description, tags, {
          value: toWei(prize),
        })
        await tx.wait()
        resolve(tx)
      } catch (err) {
        reportError(err)
        reject(err)
      }
   })

}

const structuredJobs = (jobs) =>
  jobs
    .map((job) => ({
      id: job.id.toNumber(),
      owner: job.owner.toLowerCase(),
      jobTitle: job.jobTitle,
      description: job.description,
      tags: job.tags,
      prize: fromWei(job.prize),
      paidOut: job.paidOut,
      timestamp: job.timestamp,
      listed: job.listed,
      disputed: job.disputed
    }))
    .sort((a, b) => b.timestamp - a.timestamp);


const structuredBidder = (bidders) => 
  bidders.map((bidder) => ({
    jId: bidder.jId.toNumber(),
    bidder: bidder.bidder.toLowerCase()
  }))


export { connectWallet, isWalletConnected, createJob };
