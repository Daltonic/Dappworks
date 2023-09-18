import { setGlobalState } from '../store'
import abi from '../abis/src/contracts/DappWorks.sol/DappWorks.json'
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
      console.log('Account changed: ', accounts[0]);
      await loadData()
      await isWalletConnected()
      logOutWithCometChat()
    })
    await loadData()

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

const addJobListing = async ({ jobTitle, description, tags, prize }) => {
  if (!ethereum) return alert('Please install Metamask')
  return new Promise(async (resolve, reject) => {
    try {
      const contract = await getEthereumContract()
      tx = await contract.addJobListing(jobTitle, description, tags, {
        value: toWei(prize),
      })
      await tx.wait()

      await getJobs()
      resolve(tx)
    } catch (err) {
      reportError(err)
      reject(err)
    }
  })
}

const updateJob = async ({ id, jobTitle, description, tags }) => {
  if (!ethereum) return alert('Please install Metamask')
  return new Promise(async (resolve, reject) => {
    try {
      const contract = await getEthereumContract()
      tx = await contract.updateJob(id, jobTitle, description, tags)
      await tx.wait()

      await getMyJobs()
      resolve(tx)
    } catch (err) {
      reportError(err)
      reject(err)
    }
  })
}

const deleteJob = async (id) => {
  if (!ethereum) return alert('Please install Metamask')
  return new Promise(async (resolve, reject) => {
    try {
      const contract = await getEthereumContract()
      tx = await contract.deleteJob(id)
      await tx.wait()

      await getMyJobs()
      resolve(tx)
    } catch (err) {
      reportError(err)
      reject(err)
    }
  })
}

const bidForJob = async (id) => {
  if (!ethereum) return alert('Please install Metamask')
  return new Promise(async (resolve, reject) => {
    try {
      const contract = await getEthereumContract()
      tx = await contract.bidForJob(id)
      await tx.wait()

      await getJobs()
      resolve(tx)
    } catch (err) {
      reportError(err)
      reject(err)
    }
  })
}

const acceptBid = async (id, jId, bidder) => {
  if (!ethereum) return alert('Please install Metamask')
  return new Promise(async (resolve, reject) => {
    try {
      const contract = await getEthereumContract()
      tx = await contract.acceptBid(id, jId, bidder)
      await tx.wait()

      await getJob(id)
      resolve(tx)
    } catch (err) {
      reportError(err)
      reject(err)
    }
  })
}

const dispute = async (id) => {
  if (!ethereum) return alert('Please install Metamask')
  return new Promise(async (resolve, reject) => {
    try {
      const contract = await getEthereumContract()
      tx = await contract.dispute(id)
      await tx.wait()

      await getJob(id)
      resolve(tx)
    } catch (err) {
      reportError(err)
      reject(err)
    }
  })
}

const resolved = async (id) => {
  if (!ethereum) return alert('Please install Metamask')
  return new Promise(async (resolve, reject) => {
    try {
      const contract = await getEthereumContract()
      tx = await contract.resolved(id)
      await tx.wait()

      await getJob(id)
      resolve(tx)
    } catch (err) {
      reportError(err)
      reject(err)
    }
  })
}

const revoke = async (jId, id) => {
  if (!ethereum) return alert('Please install Metamask')
  return new Promise(async (resolve, reject) => {
    try {
      const contract = await getEthereumContract()
      tx = await contract.revoke(jId, id)
      await tx.wait()

      await getJob(id)
      resolve(tx)
    } catch (err) {
      reportError(err)
      reject(err)
    }
  })
}

const payout = async (id) => {
  if (!ethereum) return alert('Please install Metamask')
  return new Promise(async (resolve, reject) => {
    try {
      const contract = await getEthereumContract()
      tx = await contract.payout(id)
      await tx.wait()

      await getMyJobs()
      resolve(tx)
    } catch (err) {
      reportError(err)
      reject(err)
    }
  })
}

const bidStatus = async (id) => {
  if (!ethereum) return alert('Please install Metamask')
  try {
    const contract = await getEthereumContract()
    const status = await contract.bidStatus(id)
    setGlobalState('status', status)
  } catch (err) {
    reportError(err)
  }
}

const getBidders = async (id) => {
  if (!ethereum) return alert('Please install Metamask')
  try {
    const contract = await getEthereumContract()
    const bidders = await contract.getBidders(id)
    setGlobalState('bidders', structuredBidder(bidders))
  } catch (err) {
    reportError(err)
  }
}

const getFreelancers = async (id) => {
  if (!ethereum) return alert('Please install Metamask')
  try {
    const contract = await getEthereumContract()
    const freelancers = await contract.getFreelancers(id)
    setGlobalState('freelancers', structuredFreelancers(freelancers))
  } catch (err) {
    reportError(err)
  }
}

const getAcceptedFreelancer = async (id) => {
  if (!ethereum) return alert('Please install Metamask')
  try {
    const contract = await getEthereumContract()
    const freelancer = await contract.getAcceptedFreelancer(id)
    setGlobalState('freelancer', structuredFreelancers([freelancer])[0])
  } catch (err) {
    reportError(err)
  }
}

const getJobs = async () => {
  if (!ethereum) return alert('Please install Metamask')
  try {
    const contract = await getEthereumContract()
    const jobs = await contract.getJobs()
    setGlobalState('jobs', structuredJobs(jobs))
  } catch (err) {
    reportError(err)
  }
}

const getMyJobs = async () => {
  if (!ethereum) return alert('Please install Metamask')
  try {
    const contract = await getEthereumContract()
    const jobs = await contract.getMyJobs()
    setGlobalState('myjobs', structuredJobs(jobs))
  } catch (err) {
    reportError(err)
  }
}
const getMyGigs = async () => {
  if (!ethereum) return alert('Please install Metamask')
  try {
    const contract = await getEthereumContract()
    const jobs = await contract.getAssignedJobs()
    setGlobalState('mygigs', structuredJobs(jobs))
  } catch (err) {
    reportError(err)
  }
}
const getMyBidJobs = async () => {
  if (!ethereum) return alert('Please install Metamask')
  try {
    const contract = await getEthereumContract()
    const jobs = await contract.getJobsForBidder()
    setGlobalState('mybidjobs', structuredJobs(jobs))
  } catch (err) {
    reportError(err)
  }
}

const getJob = async (id) => {
  if (!ethereum) return alert('Please install Metamask')
  try {
    const contract = await getEthereumContract()
    const job = await contract.getJob(id)
    setGlobalState('job', structuredJobs([job])[0])
  } catch (err) {
    reportError(err)
  }
}

const loadData = async () => {
  await getJobs()
  await getMyJobs()
  await getMyGigs()
  await getMyBidJobs()
}

const structuredJobs = (jobs) =>
  jobs
    .map((job) => ({
      id: job.id.toNumber(),
      owner: job.owner.toLowerCase(),
      freelanceer: job.freelanceer.toLowerCase(),
      jobTitle: job.jobTitle,
      description: job.description,
      tags: job.tags.split(','),
      prize: fromWei(job.prize),
      paidOut: job.paidOut,
      timestamp: job.timestamp,
      listed: job.listed,
      disputed: job.disputed,
    }))
    .sort((a, b) => b.timestamp - a.timestamp)

const structuredBidder = (bidders) =>
  bidders.map((bidder) => ({
    id: bidder.id.toNumber(),
    jId: bidder.jId.toNumber(),
    account: bidder.account.toLowerCase(),
  }))

const structuredFreelancers = (freelancers) =>
  freelancers.map((freelancer) => ({
    id: freelancer.id.toNumber(),
    jId: freelancer.jId.toNumber(),
    account: freelancer.account.toLowerCase(),
    bool: freelancer.isAssigned,
  }))

export {
  connectWallet,
  isWalletConnected,
  addJobListing,
  updateJob,
  deleteJob,
  bidForJob,
  acceptBid,
  dispute,
  resolved,
  revoke,
  payout,
  bidStatus,
  getBidders,
  getFreelancers,
  getAcceptedFreelancer,
  getJobs,
  getMyJobs,
  getJob,
  getMyBidJobs,
  getMyGigs,
  loadData,
}
