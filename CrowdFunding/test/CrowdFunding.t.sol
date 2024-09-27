pragma solidity ^0.8.20;

import {Test, console} from "forge-std/Test.sol";
import {CrowdFunding} from "../src/CrowdFunding.sol";

contract CrowdFundingTest is Test {
	CrowdFunding public crowd_funding;

	uint constant INITIAL_BALANCE = 500 ether;
	address USER1 = makeAddr("aiohfeflb");
	address USER2 = makeAddr("sansbfnssdv");
	address USER3 = makeAddr("lkjdbshgjsb");

	function setUp() public {
		crowd_funding = new CrowdFunding();
		vm.deal(USER1, INITIAL_BALANCE);
		vm.deal(USER2, INITIAL_BALANCE);
		vm.deal(USER3, INITIAL_BALANCE);
	}

	function test_createCampaign() public {
		vm.prank(USER1);
		crowd_funding.createCampaign(100 ether);
		vm.stopPrank();
		assertEq(crowd_funding.getCampaignCreatorWalletAddr(0), USER1);
		assertEq(crowd_funding.getCampaignFundingGoal(0), 100 ether);
		assertEq(crowd_funding.getCampaignCurrentFunding(0), 0);
		assertEq(crowd_funding.getAmountOfCampaigns(), 1);
	}

	function test_createCampaignMultiple() public {
		vm.prank(USER1);
		crowd_funding.createCampaign(100 ether);
		vm.prank(USER1);
		crowd_funding.createCampaign(120 ether);
		assertEq(crowd_funding.getCampaignCreatorWalletAddr(0), USER1);
		assertEq(crowd_funding.getCampaignFundingGoal(0), 100 ether);
		assertEq(crowd_funding.getCampaignCurrentFunding(0), 0);
		assertEq(crowd_funding.getCampaignCreatorWalletAddr(1), USER1);
		assertEq(crowd_funding.getCampaignFundingGoal(1), 120 ether);
		assertEq(crowd_funding.getCampaignCurrentFunding(1), 0);
		assertEq(crowd_funding.getAmountOfCampaigns(), 2);
	}

	function test_pledge() public {
		vm.prank(USER1);
		crowd_funding.createCampaign(100 ether);
		vm.stopPrank();

		vm.prank(USER2);
		crowd_funding.pledge{value: 100 ether}(0);
		vm.stopPrank();
		assertEq(crowd_funding.getPledgerPledgedTo(USER2), 0);
		assertEq(crowd_funding.getPledgerPledgedAmount(USER2), 100 ether);
		assertEq(crowd_funding.getCampaignCurrentFunding(0), 100 ether);
	}

	function test_pledgeZeroValue() public {
	    vm.prank(USER1);
		crowd_funding.createCampaign(100 ether);
		vm.stopPrank();

		vm.expectRevert();
		vm.prank(USER2);
		crowd_funding.pledge{value: 0 ether}(0);
	}

	function test_pledgeSameUserCreateAndPledge() public {
		vm.prank(USER1);
		crowd_funding.createCampaign(100 ether);

		vm.expectRevert();
		vm.prank(USER1);
		crowd_funding.pledge{value: 10 ether}(0);
	}

	function test_pledgeNonExistingCampaign() public {
		vm.expectRevert();
		vm.prank(USER1);
		crowd_funding.pledge{value: 100 ether}(0);
	}

	function test_refund() public {
		vm.prank(USER1);
		crowd_funding.createCampaign(100 ether);
		vm.stopPrank();

		vm.prank(USER2);
		crowd_funding.pledge{value: 10 ether}(0);
	
		vm.prank(USER2);
		crowd_funding.refund(0);
		assertEq(crowd_funding.getCampaignCurrentFunding(0), 0);
		assertEq(crowd_funding.getPledgerPledgedTo(USER2), 0);
		assertEq(crowd_funding.getPledgerPledgedAmount(USER2), 0);
		assertEq(USER2.balance, 500 ether);
	}

	function test_refundNonPledger() public {
		vm.prank(USER1);
		crowd_funding.createCampaign(100 ether);

		vm.expectRevert();
		vm.prank(USER2);
		crowd_funding.refund(0);
	}

	function test_refundNonExistingCampaign() public {
		vm.expectRevert();
		vm.prank(USER1);
		crowd_funding.refund(0);
	}

	function test_release() public {
		vm.prank(USER1);
		crowd_funding.createCampaign(100 ether);

		vm.prank(USER2);
		crowd_funding.pledge{value: 100 ether}(0);

		crowd_funding.release(0);
		assertEq(USER1.balance, 600 ether);
	}

	function test_releaseNotReached() public {
		vm.prank(USER1);
		crowd_funding.createCampaign(100 ether);

		vm.expectRevert();
		crowd_funding.release(0);
	}

	function test_releaseNoneExistingCampaign() public {
		vm.expectRevert();
		crowd_funding.release(0);
	}

}
