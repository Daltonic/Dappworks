//SPDX-License-Identifier:MIT
pragma solidity >=0.7.0 <0.9.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract DappWorks is Ownable, ReentrancyGuard {
    using Counters for Counters.Counter;

    Counters.Counter private _jobCounter;

    struct JobStruct {
        uint id;
        address owner;
        string jobTitle;
        string description;
        string tags;
        uint prize;
        bool paidOut;
        uint timestamp;
        bool listed;
        bool disputed;
    }

    struct FreelancerStruct {
        uint id;
        uint jId;
        address account;
        bool isAssigned;
    }

    struct BidStruct {
        uint id;
        uint jId;
        address account;
    }

    uint public platformCharge = 5;

    mapping(uint => JobStruct) jobListings;
    mapping(uint => FreelancerStruct[]) freelancers;
    mapping(uint => BidStruct[]) jobBidders;

    mapping(uint => bool) jobListingExists;
    mapping(uint => mapping(address => bool)) public hasPlacedBid;


    modifier onlyJobOwner(uint id) {
        require(jobListings[id].owner == msg.sender, "Unauthorized entity");
        _;
    }

    function addJobListing(
        string memory jobTitle,
        string memory description,
        string memory tags
    ) public payable {
        require(bytes(jobTitle).length > 0, "Please provide a job title");
        require(bytes(description).length > 0, "Please provide a description");
        require(bytes(tags).length > 0, "Please provide tags");
        require(msg.value > 0 ether, "Insufficient funds");

        // Increment the counter before using the current value
        _jobCounter.increment();
        uint jobId = _jobCounter.current();

        JobStruct memory jobListing;

        jobListing.id = jobId;
        jobListing.owner = msg.sender;
        jobListing.jobTitle = jobTitle;
        jobListing.description = description;
        jobListing.tags = tags;
        jobListing.prize = msg.value;
        jobListing.listed = true;
        jobListing.timestamp = currentTime();

        jobListings[jobId] = jobListing;
        jobListingExists[jobId] = true;
    }

    function deleteJob(uint id) public {
        require(jobListingExists[id], "This job listing doesn't exist");
        require(jobListings[id].listed, "This job has been taken");
        require(!jobListings[id].paidOut, "This job has been paid out");

        jobListingExists[id] = false;

        payTo(jobListings[id].owner, jobListings[id].prize);
    }

    function updateJob(
        uint id,
        string memory jobTitle,
        string memory description,
        string memory tags
    ) public {
        require(jobListingExists[id], "This job listing doesn't exist");
        require(jobListings[id].listed, "This job has been taken");
        require(!jobListings[id].paidOut, "This job has been paid out");


        jobListings[id].jobTitle = jobTitle;
        jobListings[id].description = description;
        jobListings[id].tags = tags;
    }

    function bidForJob(uint id) public {
        require(jobListingExists[id], "This job listing doesn't exist");
        require(jobListings[id].owner != msg.sender, "Forbidden action!");
        require(!jobListings[id].paidOut, "This job has been paid out");
        require(jobListings[id].listed, "This job have been taken");
        require(!hasPlacedBid[id][msg.sender], "You have placed a bid already");

        BidStruct memory bid;
        bid.id = jobBidders[id].length + 1;
        bid.jId  = id;
        bid.account = msg.sender;
        hasPlacedBid[id][msg.sender] = true;

        jobBidders[id].push(bid);
    }

    function acceptBid(uint id, uint jId, address bidder) public onlyJobOwner(jId){
        require(jobListingExists[jId], "This job listing doesn't exist");
        require(jobListings[jId].listed, "This job have been taken");
        require(!jobListings[jId].paidOut, "This job has been paid out");
        require(hasPlacedBid[jId][bidder], "UnIdentified bidder");


        FreelancerStruct memory freelancer;

        freelancer.id = freelancers[jId].length;
        freelancer.jId = jId;
        freelancer.account = bidder;
        freelancer.isAssigned = true;

        freelancers[jId].push(freelancer);

        for(uint i = 0; i < jobBidders[jId].length; i++) {
            if(jobBidders[jId][i].id != id) {
                hasPlacedBid[jId][jobBidders[jId][i].account] = false;
            }
        }

        jobListings[jId].listed = false;
    }

    function bidStatus(uint id) public view returns (bool) {
        return hasPlacedBid[id][msg.sender];
    }

    function dispute(uint id) public onlyJobOwner(id) {
        require(jobListingExists[id], "This job listing doesn't exist");
        require(!jobListings[id].disputed, "This job already disputed");
        require(!jobListings[id].paidOut, "This job has been paid out");


        jobListings[id].disputed = true;
    }

    function revoke(uint jId, uint id) public onlyOwner {
        require(jobListingExists[jId], "This job listing doesn't exist");
        require(jobListings[jId].disputed, "This job must be on dispute");
        require(!jobListings[jId].paidOut, "This job has been paid out");

        // Use two separate indexes to access the FreelancerStruct
        FreelancerStruct storage freelancer = freelancers[jId][id];

        freelancer.isAssigned = false;
        payTo(jobListings[jId].owner, jobListings[jId].prize);
        
        jobListings[jId].listed = true;
    }

    function resolved(uint id) public onlyOwner {
        require(jobListingExists[id], "This job listing doesn't exist");
        require(jobListings[id].disputed, "This job must be on dispute");
        require(!jobListings[id].paidOut, "This job has been paid out");

        jobListings[id].disputed = false;
    }

    function payout(uint id) public nonReentrant onlyJobOwner(id) {
        require(jobListingExists[id], "This job listing doesn't exist");
        require(!jobListings[id].disputed, "This job must not be on dispute");
        require(!jobListings[id].paidOut, "This job has been paid out");

        uint reward = jobListings[id].prize;
        uint tax = reward * platformCharge / 100;

        for (uint i = 1; i < freelancers[id].length; i++) {
            if (freelancers[id][i].isAssigned == true) {
                payTo(freelancers[id][i].account, reward - tax);
            }
        }

        payTo(owner(), tax);
        jobListings[id].paidOut = true;
    }

    function getBidders(uint id) public view returns (BidStruct[] memory Bidders) {
        require(jobListingExists[id], "This job listing doesn't exist");
        return jobBidders[id];
    }

    function getFreelancers(uint id) public view returns (FreelancerStruct[] memory) {
        return freelancers[id];
    }

    function getAcceptedFreelancer(uint id) public view returns (FreelancerStruct memory) {
        require(jobListingExists[id], "This job listing doesn't exist");

        for (uint i = 0; i < freelancers[id].length; i++) {
            if (freelancers[id][i].isAssigned) {
                return freelancers[id][i];
            }
        }

        // If no freelancer is assigned, return an empty struct or handle it as needed.
        FreelancerStruct memory emptyFreelancer;
        return emptyFreelancer;
    }

    function getJobs() public view returns (JobStruct[] memory ActiveJobs) {
        uint available;
        uint currentIndex = 0;

        for (uint256 i = 1; i <= _jobCounter.current(); i++) {
            if (jobListingExists[i] && jobListings[i].listed && !jobListings[i].paidOut) {
                available++;
            }
        }

        ActiveJobs = new JobStruct[](available);

        for (uint256 i = 1; i <= _jobCounter.current(); i++) {
            if (jobListingExists[i] && jobListings[i].listed && !jobListings[i].paidOut) {
                ActiveJobs[currentIndex++] = jobListings[i];
            }
        }
    }

    function getMyJobs() public view returns (JobStruct[] memory MyJobs) {
        uint available;
        uint currentIndex = 0;

        for (uint256 i = 1; i <= _jobCounter.current(); i++) {
            if (jobListingExists[i] && jobListings[i].owner == msg.sender) {
                available++;
            }
        }

        MyJobs = new JobStruct[](available);

        for (uint256 i = 1; i <= _jobCounter.current(); i++) {
            if (jobListingExists[i] && jobListings[i].owner == msg.sender) {
                MyJobs[currentIndex++] = jobListings[i];
            }
        }
    }

    function getJob(uint id) public view returns (JobStruct memory) {
        return jobListings[id];
    }

    // private function

    function currentTime() internal view returns (uint256) {
        return (block.timestamp * 1000) + 1000;
    }

    function payTo(address to, uint256 amount) internal {
        (bool success, ) = payable(to).call{value: amount}("");
        require(success);
    }

}