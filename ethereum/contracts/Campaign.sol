// // --------------------------------------------------------
// // VERSION 0.4.17

// pragma solidity ^0.4.17;

// contract CampaignFactory {
//     address[] public deployedCampaigns;
    
//     function createCampaign(uint256 minimum) public {
//         address newCampaign = new Campaign(minimum, msg.sender);
//         deployedCampaigns.push(newCampaign);
//     }
    
//     function getDeployedCampaigns() public view returns (address[]) {
//         return deployedCampaigns;
//     }
// }

// contract Campaign {
//     struct Request {
//         string description;
//         uint value;
//         address recipient;
//         bool complete;
//         uint256 approvalCount;
//         mapping(address => bool) approvals;
//     }
    
//     Request[] public requests;
//     address public manager;
//     uint256 public minimumContribution;
//     mapping(address => bool) public approvers;
//     uint public approversCount;
    
//     modifier restricted() {
//         require(msg.sender == manager);
//         _;
//     }
    
//     function Campaign(uint256 minimum, address creator) public {
//         manager = creator;
//         minimumContribution = minimum;
//     }
    
//     function contribute() public payable {
//         require(msg.value > minimumContribution);
//         approvers[msg.sender] = true;
//         approversCount++;
//     }
    
//     function createRequest(string description, uint value, address recipient) public restricted {
//         Request memory newRequest = Request({
//             description: description,
//             value: value,
//             recipient: recipient,
//             complete: false,
//             approvalCount: 0
//         });
        
//         requests.push(newRequest);
//     }
    
//     function approveRequest(uint16 index) public {
//         Request storage request = requests[index];
        
//         require(approvers[msg.sender]);
//         require(!request.approvals[msg.sender]);
        
//         request.approvals[msg.sender] = true;
//         request.approvalCount++;
//     }
    
//     function finalizeRequest(uint256 index) public restricted {
//         Request storage request = requests[index];
//         require(request.approvalCount > (approversCount / 2));
//         require(!request.complete);
        
//         request.recipient.transfer(request.value);
//         request.complete = true;
//     }
// }

// --------------------------------------------------------
// VERSION 0.8.7

// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.7;

contract CampaignFactory {
    address[] public deployedCampaigns;
    
    function createCampaign(uint256 minimum) public {
        Campaign newCampaign = new Campaign(minimum, msg.sender);
        deployedCampaigns.push(address(newCampaign));
    }
    
    function getDeployedCampaigns() public view returns (address[] memory) {
        return deployedCampaigns;
    }
}

contract Campaign {
    struct Request {
        string description;
        uint value;
        address recipient;
        bool complete;
        uint256 approvalCount;
        mapping(address => bool) approvals;
    }
    
    Request[] public requests;
    address public manager;
    uint256 public minimumContribution;
    mapping(address => bool) public approvers;
    uint public approversCount;
    
    modifier restricted() {
        require(msg.sender == manager);
        _;
    }
    
    constructor(uint256 minimum, address creator) {
        manager = creator;
        minimumContribution = minimum;
    }
    
    function contribute() public payable {
        require(msg.value > minimumContribution);
        approvers[msg.sender] = true;
        approversCount++;
    }
    
    function createRequest(string memory description, uint value, address recipient) public restricted {
        Request storage newRequest = requests.push();
        newRequest.description = description;
        newRequest.value = value;
        newRequest.recipient = recipient;

    }
    
    function approveRequest(uint16 index) public {
        Request storage request = requests[index];
        
        require(approvers[msg.sender]);
        require(!request.approvals[msg.sender]);
        
        request.approvals[msg.sender] = true;
        request.approvalCount++;
    }
    
    function finalizeRequest(uint256 index) public restricted {
        Request storage request = requests[index];
        require(request.approvalCount > (approversCount / 2));
        require(!request.complete);
        
        payable(request.recipient).transfer(request.value);
        request.complete = true;
    }
}