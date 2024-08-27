pragma solidity ^0.8.20;

contract CrowdFunding {

	event NewCampaign(address wallet_addr, uint funding_goal, uint id);

	struct Campaign {
		address payable walletAddr;
		uint256 currentFunding;
		uint256 fundingGoal;
	}

	struct Pledger {
		uint256 pledgedAmount;
		uint256 campaignId;
	}
	
	Campaign[] public campaigns;
	mapping(address => Pledger) public pledgers;
	

	function createCampaign(uint256 _fundingGoal) public {
		require(_fundingGoal > 0, "Campaign cannot have 0 as a goal.");
		campaigns.push(Campaign(payable(msg.sender), 0, _fundingGoal));
		emit NewCampaign(msg.sender, _fundingGoal, campaigns.length - 1);
	}

	function pledge(uint256 id) public payable {
		require(id < campaigns.length, "Invalid id provided.");
		require(msg.value > 0, "Pledges cannot be Zero.");
		require(payable(msg.sender) != campaigns[id].walletAddr, "You're the user that created this campaign, why are you trying to pledge to yourself?");
		require(campaigns[id].currentFunding < campaigns[id].fundingGoal, "Goal has already been reached.");
		pledgers[msg.sender] = Pledger(msg.value, id);
		campaigns[id].currentFunding += msg.value;
	}

	function refund(uint256 id) public {
		require(id < campaigns.length, "Invalid id provided.");
		require(campaigns[id].currentFunding < campaigns[id].fundingGoal, "Goal has already been reached.");
		require(id == pledgers[msg.sender].campaignId, "Pledger did not pledge in given campaign id.");
		uint256 amount = pledgers[msg.sender].pledgedAmount;
		require(amount > 0, "Pledger did not pledge anything.");
		payable(msg.sender).transfer(amount);
		campaigns[id].currentFunding -= amount;
		delete pledgers[msg.sender];
	}

	function release(uint256 id) public {
		require(campaigns[id].fundingGoal <= campaigns[id].currentFunding, "Funding Goal not reached yet.");
		campaigns[id].walletAddr.transfer(campaigns[id].currentFunding);
	}

	function getCampaignCreatorWalletAddr(uint256 id) public view returns(address) {
		require(id < campaigns.length, "Invalid id provided.");
		return campaigns[id].walletAddr;
	}

	function getCampaignCurrentFunding(uint256 id) public view returns(uint256) {
		require(id < campaigns.length, "Invalid id provided.");
		return campaigns[id].currentFunding;
	}

	function getCampaignFundingGoal(uint256 id) public view returns(uint256) {
		require(id < campaigns.length, "Invalid id provided.");
		return campaigns[id].fundingGoal;
	}

	function getAmountOfCampaigns() public view returns(uint256) {
		return campaigns.length;
	}

	function getPledgerPledgedTo(address _walletId) public view returns(uint256) {
		return pledgers[_walletId].campaignId;
	}

	function getPledgerPledgedAmount(address _walletId) public view returns(uint256) {
		return pledgers[_walletId].pledgedAmount;
	}
}
