const { equal } = require('assert')
const { expect } = require('chai')

const toWei = (num) => ethers.utils.parseEther(num.toString())

describe('Contracts', () => {
  let contract, result

  let id = 1
  let jobTitle = 'Content creator',
      description = 'I need someone with a good professional writing skill, who understands writing dynamics',
      tags = 'Professional, writer, Time management, Dynamics',
      price = 0.3

  let Newtags = "Professional, writer, Time management, Resilience"

  beforeEach(async () => {
    const Contract = await ethers.getContractFactory('DappWorks')
    ;[deployer, client1, client2, client3, freelancer1, freelancer2, freelancer3] = await ethers.getSigners()

    contract = await Contract.deploy();
    await contract.deployed()
  })

  beforeEach(async ()=> {
    await contract.addJobListing(jobTitle, description, tags,  {
      value: toWei(price),
    });
  })

  describe('Job Creation', ()=> {
      it('should confirm fetching job listings', async ()=> {
         result = await contract.getJobs()
         expect(result).to.have.lengthOf(1)
      })
      
      it('should confirm fetching a single job listing', async ()=> {
        result = await contract.getJob(id);
        expect(result.id).to.be.equal(1);
      })

      it('should confirm updating of job', async ()=> {
         result = await contract.getJob(1)
         expect(result.tags).to.be.equal(tags)

         await contract.updateJob(id, jobTitle, description, Newtags)

        result = await contract.getJob(1);
        expect(result.tags).to.be.equal(Newtags);
      })

      it('should confirm job deletion', async ()=> {
        result = await contract.getJobs();
        expect(result).to.be.have.lengthOf(1);

        await contract.deleteJob(id)

        result = await contract.getJobs();
        expect(result).to.be.have.lengthOf(0);
      })

      it('should confirm bidding for job', async ()=> {
        
      })
  })

})
