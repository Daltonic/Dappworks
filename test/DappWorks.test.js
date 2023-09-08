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
    ;[deployer, client1, client2, freelancer1, freelancer2] = await ethers.getSigners()

    contract = await Contract.deploy();
    await contract.deployed()
  })

  beforeEach(async ()=> {
    await contract.connect(client1).addJobListing(jobTitle, description, tags, {
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
        await contract.connect(freelancer1).bidForJob(id);

        result = await contract.getBidders(id)
        expect(result).to.have.lengthOf(1)
      })

      it('should confirm accepting job bid', async ()=> {
        await contract.connect(freelancer1).bidForJob(id);

        await contract.connect(client1).acceptBid(0, id, freelancer1.address)
        result = await contract.connect(client1).getFreelancers(id);
        expect(result).to.have.lengthOf(1)
      })

      it("should confirm disputing a job", async () => {
        await contract.connect(client1).dispute(id);

        result = await contract.getJob(id);
        expect(result.disputed).to.be.true;
      });

       it("should confirm revoking a disputed job", async () => {
         // Place a bid by a freelancer
         await contract.connect(freelancer1).bidForJob(id);

         // Accept the bid by the client
         await contract.connect(client1).acceptBid(0, id, freelancer1.address);

         // Dispute the job
         await contract.connect(client1).dispute(id);

         // Revoke the job after it's been disputed
         await contract.connect(deployer).revoke(id, 0); // Index starts from 0

         result = await contract.getJob(id);
         expect(result.listed).to.be.true;
         // Ensure that the assigned freelancer's isAssigned is set to false
         const freelancers = await contract.getFreelancers(id);
          for (let i = 0; i < freelancers.length; i++) {
            if (result[i].id == 0) {
              expect(freelancers[id].isAssigned).to.be.false;
            }
          }
       });

       it("should confirm resolving a disputed job", async () => {
         await contract.connect(client1).dispute(id); // Dispute the job first
         await contract.connect(deployer).resolved(id);

         result = await contract.getJob(id);
         expect(result.disputed).to.be.false;
       });

       it("should confirm payout of a job", async () => {
         await contract.connect(freelancer1).bidForJob(id);
         await contract.connect(client1).acceptBid(0, id, freelancer1.address);
         await contract.connect(client1).payout(id);

         result = await contract.getJob(id);
         expect(result.paidOut).to.be.true;
       });
  })

})

