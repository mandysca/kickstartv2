// SPDX-License-Identifier: MIT

pragma solidity ^0.8.7;

// Contract creation factory

contract CampaignFactory {
    // Address of deployed contracts
    address [] public deployedCampaigns;

    function createCampaign(uint minimum, string memory title, string memory description) public {
        // Create a new campaign
        address newCampaign = address(new Campaign(minimum, msg.sender, title, description));
        // Add it to the campaigns array
        deployedCampaigns.push(newCampaign);
    }

    // get the address of deployed contracts
    function getDeployedCampaigns() public  view returns (address[] memory) {
        return deployedCampaigns;
    }

}


// Campaign contract
contract Campaign {

    // Contract manager
    address public manager;

    // Least amount of capital contribution
    uint public minimumContribution;

    // Campaign title
    string campaignTitle;

    // Campaign description
    string campaignDescription;


    // Contributors - can approve a request
    // address[] public approvers;

    // Alternate implementtion
    mapping (address => bool) public approvers;
    // Keep count of approvers
    uint public approversCount = 0;

    // Spending request - created by manager
    struct Request {
        string description;
        uint value;
        address payable recipient;
        bool complete;
        // Count of number of approvals
        uint approvalCount;
        // Mapping of who has approved
        mapping (address => bool) approvals;
    }

    // Array of requests
    // Request[] public requests;

    uint numRequests = 0;
    mapping (uint => Request) public requestsmap;

    // Modifier for a function, runs this condition
    modifier restricted_person() {
        require(msg.sender == manager);

        // modifiers end with a "_"
        _;
    }


    // Initiate the contract
    constructor(uint minimum, address creator, string memory title, string memory description) {
        // Set manager as the person who initiates the contract
        manager = creator;
        // Set minumum contribution
        minimumContribution = minimum;
        // Set title
        campaignTitle = title;
        // Set description
        campaignDescription = description;
    }

    // Allow participants to contribute
    function contribute() public payable {
        // make sure the value is more than minimum contribution
        require (msg.value > minimumContribution);
        // approvers.push(msg.sender); - Old format
        approvers[msg.sender] = true;

        // increment approvers count
        approversCount++;
    }

    // Manager creates a spending request
    function createRequest(string memory description, uint value, address recipient) public restricted_person {
        // Get a struct from mapping
        Request storage r = requestsmap[numRequests];
        numRequests++;
        r.description = description;
        r.value = value;
        r.recipient = payable(recipient);
        r.complete = false;
        r.approvalCount= 0;

    }

    // Submit an approval for a request
    function approveRequest(uint index) public {
        // Pass by reference 'storage' so its pointing to the value at same location
        Request storage request = requestsmap[index];
        // Require the person has contributed to the campaign
        require(approvers[msg.sender]);
        // require the person has only voted once
        require(!request.approvals[msg.sender]);
        // increment approval count
        request.approvalCount++;
        // Designate that sender has voted
        request.approvals[msg.sender] = true;

    }

    function finalizeRequest(uint index) public restricted_person {
        // Pass by reference 'storage' so its pointing to the value at same location
        Request storage request = requestsmap[index];

        // Request has not been already finalized
        require(!request.complete);

        // Require a quorum
        require (request.approvalCount >(approversCount/2)) ;

        // Transfer money
        request.recipient.transfer(request.value);

        // Finalize the request
        request.complete = true;

    }

    // Return summary of campaign's attributes
     function getSummary() public view returns (
         uint, uint, uint, uint, address, string memory, string memory
       ) {
         return (
           minimumContribution,
           address(this).balance,
           numRequests,
           approversCount,
           manager,
           campaignTitle,
           campaignDescription
         );
     }

     // Return the count of request lenght arrays
     function getRequestsCount() public view returns (uint) {
         return numRequests;
     }

}
