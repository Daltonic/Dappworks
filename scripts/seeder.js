const { ethers } = require('hardhat')
const { faker } = require('@faker-js/faker')
const fs = require('fs')

const toWei = (num) => ethers.utils.parseEther(num.toString())

async function main() {
  const Contract = await ethers.getContractFactory('DappWorks')
  const contract = await Contract.deploy()
  await contract.deployed()

  const [deployer] = await ethers.getSigners()
  const iterations = 7

  let tx, result

  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[array[i], array[j]] = [array[j], array[i]]
    }
    return array
  }

  const getParams = () => {
    return {
      jobTitle: faker.lorem.sentence({ min: 4, max: 10 }),
      description: faker.lorem.paragraphs(4),
      tags: faker.lorem.words(4).split(' '),
      prize:
        faker.number.float({
          min: 0.1 * 100,
          max: 3.5 * 100,
          precision: 0.01,
        }) / 100,
    }
  }

  const createJob = async (params) => {
    tx = await contract.functions.addJobListing(
      params.jobTitle,
      params.description,
      params.tags.join(','),
      { value: toWei(params.prize) }
    )
    await tx.wait()
  }

  for (let i = 0; i < iterations; i++) {
    await createJob(getParams())
  }

  result = await contract.getJobs()
  console.log(result)

  // Seeding ends here...

  const address = JSON.stringify({ address: contract.address }, null, 4)
  fs.writeFile('./src/abis/contractAddress.json', address, 'utf8', (err) => {
    if (err) {
      console.error(err)
      return
    }
    console.log('Deployed contract address', contract.address)
  })
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
