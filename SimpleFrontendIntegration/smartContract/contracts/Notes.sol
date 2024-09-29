// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.27;

import "hardhat/console.sol";

contract Notes {
	mapping (address => string)	public ownerToNotes;
	uint256 public constant MAX_NOTE_LENGTH = 255;

	event NoteWritten(address indexed writer, string note);
	event NoteDeleted(address indexed writer);

	function writeNote(string calldata _text) public {
		require(bytes(_text).length > 0 && bytes(_text).length < MAX_NOTE_LENGTH, "Invalid Note length");
		ownerToNotes[msg.sender] = _text;
		emit NoteWritten(msg.sender, _text);
	}

	function checkNote(address _someOnesAddress) public view returns (string memory) {
		require(bytes(ownerToNotes[_someOnesAddress]).length > 0, "No notes found for the given address");
		return ownerToNotes[_someOnesAddress];
	}

	function deleteOwnNote() public {
		require(bytes(ownerToNotes[msg.sender]).length > 0, "Address does not have a Note");
		delete ownerToNotes[msg.sender];
		emit NoteDeleted(msg.sender);
	}
	
	function checkOwnNote() public view returns (string memory) {
		require(bytes(ownerToNotes[msg.sender]).length > 0, "Address does not have a note written yet");
		return ownerToNotes[msg.sender];
	}
}
