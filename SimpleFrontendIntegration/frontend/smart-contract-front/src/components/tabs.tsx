import { useState, useEffect } from "react";
import { ethers } from "ethers";
import contractABI from "../Notes.json"; // ABI of your smart contract
import ErrorPopup from "./error";

const CONTRACT_ADDRESS = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"; // Deployed contract address

const SmartContractInteraction = () => {
	const [walletAddress, setWalletAddress] = useState<string | null>(null);
	const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null);
	const [contract, setContract] = useState<ethers.Contract | null>(null);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const [errorFlag, setErrorFlag] = useState(false);
	const [activeTab, setActiveTab] = useState('tab1');
	const [currentNote, setCurrentNote] = useState<string | null>(null);
	const [noteValue, setNoteValue] = useState<string | null>("");
	const [addressValue, setAddressValue] = useState<string | null>("");

	const handleTabClick = (tab) => {
		setActiveTab(tab);
	};

	const triggerError = () => {
    setErrorFlag(true);
    setTimeout(() => {
      setErrorFlag(false); // Hide the error after it's shown
    }, 5000); // Error will disappear after 5 seconds
  };

	// Connect to MetaMask and set up provider and contract
	const connectWallet = async () => {
		if (typeof window.ethereum !== "undefined") {
			try {

				// Set up provider
				const { ethereum } = window;
				if (!ethereum) {
					return toast({
						status: "error",
						position: "top-right",
						title: "Error",
						description: "No ethereum wallet found",
					});
				}
				const provider = new ethers.BrowserProvider(ethereum);
				setProvider(provider);

				const accounts: string[] = await provider.send("eth_requestAccounts", []); 

				setWalletAddress(accounts[0]);
				initializeContract(provider, accounts[0]);
			} catch (error) {
				setErrorMessage("Failed to connect wallet");
				triggerError();
				console.error(error);
			}
		} else {
			setErrorMessage("MetaMask is not installed");
		}
	};

	const initializeContract = async (provider, account) => {
		// console.log("provider", provider);
		const signer = await provider.getSigner();
		const contractInstance = new ethers.Contract(CONTRACT_ADDRESS, contractABI.abi, signer);
		setContract(contractInstance);
	};

	useEffect(() => {
		if (window.ethereum) {
			window.ethereum.on('accountsChanged', (accounts) => {
				setWalletAddress(accounts[0]);
				initializeContract(provider, accounts[0]);
			});
		}

		return () => {
			if (window.ethereum) {
				window.ethereum.removeListener('accountsChanged', (accounts) => {
					setWalletAddress(accounts[0]);
					initializeContract(provider, accounts[0]);
				});
			}
		};
	}, []);

	const buttonSettingWalletAddress = () => {
		setWalletAddress(null);
	}


	// Call the contract function (e.g., increment count
	const writeNote = async (e: React.FormEvent) => {
		e.preventDefault();
		if (noteValue.length === 0 || noteValue.length > 255) {
			setErrorMessage("Notes cannot be 0 or bigger then 255 characters");
			triggerError();
			return;
		}
		if (contract) {
			try {
				console.log("Writing Note:", noteValue)
				const tx = await contract.writeNote(noteValue); // This sends the transaction
			} catch (error) {
				setErrorMessage("Failed to increment count");
				triggerError();
				console.error(error);
			}
		} else {
			setErrorMessage("Contract not initialized");
			triggerError();
		}
	};

	// Fetch the note with the provided address from the contract
	const fetchNote = async (e: React.FormEvent) => {
		e.preventDefault();
		if (addressValue === "") {
			setErrorMessage("No address given");
			triggerError();
			return;
		}
		if (contract) {
			try {
				console.log("Fetching Note at Address:", addressValue);
				const note = await contract.checkNote(addressValue); // This reads data from the contract
				setCurrentNote(note);
			} catch (error) {
				setErrorMessage("Failed to fetch count");
				triggerError();
				console.error(error);
			}
		}
	};

	// Fetch the current users note
	const fetchOwnNote = async () => {
		if (contract) {
			try {
				console.log("Getting own Notes called");
				const note = await contract.checkOwnNote(); // This reads data from the contract
				setCurrentNote(note);
			} catch (error) {
				setErrorMessage("You have not written a note yet");
				triggerError();
				console.error(error);
			}
		}
	};

	const handleNoteTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		setNoteValue(e.target.value);
	};

	const handleAddressTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		setAddressValue(e.target.value);
	};


	return (
		<div className="w-full static">
			<div>
				<div className="gap-1 grid grid-cols-3 pb-2 max-w-[50%]">
					<button
						onClick={() => handleTabClick('tab1')}
						className={`text-gray-600 font-[family-name:var(--font-geist-mono)] rounded-md border border-solid transition-colors flex items-center justify-center text-background text-sm h-10 py-2 px-4 ${activeTab === 'tab1' ? 'border-b-2 border-gray-400 bg-stone-100' : 'bg-neutral-200 hover:bg-[#d0d0d0]'}`}
					>
						Metamask
					</button>
					<button
						onClick={() => handleTabClick('tab2')}
						className={`text-gray-600 font-[family-name:var(--font-geist-mono)] rounded-md border border-solid transition-colors flex items-center justify-center text-background text-sm h-10 py-2 px-4 ${activeTab === 'tab2' ? 'border-b-2 border-gray-400 bg-stone-100' : 'bg-neutral-200 hover:bg-[#d0d0d0]'}`}
					>
						Write Note
					</button>
					<button
						onClick={() => handleTabClick('tab3')}
						className={`text-gray-600 font-[family-name:var(--font-geist-mono)] rounded-md border border-solid transition-colors flex items-center justify-center text-background text-sm h-10 py-2 px-4 ${activeTab === 'tab3' ? 'border-b-2 border-gray-400 bg-stone-100' : 'bg-neutral-200 hover:bg-[#d0d0d0]'}`}
					>
						Find Note
					</button>
				</div>
				<div className="py-2 border-t-2 border-solid border-gray-400">
					{activeTab === 'tab1' &&
						<div>
							{walletAddress ? (
								<div>
									<div className="text-gray-600 font-[family-name:var(--font-geist-mono)] text-sm px-2 py-2 pb-4">
										Connected: {walletAddress}
									</div>
									<button onClick={buttonSettingWalletAddress} className="text-gray-600 font-[family-name:var(--font-geist-mono)] rounded-md border border-solid border-transparent transition-colors flex items-center justify-center bg-neutral-200 text-background hover:bg-[#d0d0d0] dark:hover:bg-[#ccc] text-sm h-10 py-2 px-4">
										Disconnect
									</button>
								</div>	
							) : (
									<div>
										<button onClick={connectWallet} className="text-gray-600 font-[family-name:var(--font-geist-mono)] rounded-md border border-solid border-transparent transition-colors flex items-center justify-center bg-neutral-200 text-background hover:bg-[#d0d0d0] dark:hover:bg-[#ccc] text-sm h-10 py-2 px-4">
											Connect Wallet
										</button>	
									</div>
								)}	
						</div>
					}
					{activeTab === 'tab2' && walletAddress &&
						<div>
							<form onSubmit={writeNote} className="flex grid gap-2 flex-col ">
								<textarea value={noteValue} onChange={handleNoteTextChange} rows={8} placeholder="Enter text here..." className="text-gray-600 font-[family-name:var(--font-geist-mono)] text-sm bg-stone-100 w-full px-1 py-1 border border-gray-300" />
								<button className="text-gray-600 font-[family-name:var(--font-geist-mono)] rounded-md border border-solid transition-colors flex items-center justify-center bg-neutral-200 text-background gap-2 hover:bg-[#d0d0d0]  text-sm h-10 px-4 "
									type="submit">
									Write Note
								</button>
							</form>
						</div>
					}
					{activeTab === 'tab3' && walletAddress &&
						<div className="grid-rows-2 grid gap-2">
							<form onSubmit={fetchNote} className="flex gap-2">
								<button className="text-gray-600 font-[family-name:var(--font-geist-mono)] rounded-md border border-solid border-transparent transition-colors flex items-center justify-center bg-neutral-200 text-background gap-2 hover:bg-[#d0d0d0] text-sm h-10 px-4 w-[30%]"
									type="submit">
									Find Note
								</button>	
								<input type="text" value={addressValue} onChange={handleAddressTextChange} placeholder="Enter address here..." className="text-gray-600 font-[family-name:var(--font-geist-mono)] text-sm bg-stone-100 w-full px-1 py-1 border border-gray-300" />
							</form>
							<button className="text-gray-600 font-[family-name:var(--font-geist-mono)] rounded-md border border-solid border-transparent transition-colors flex items-center justify-center bg-neutral-200 text-background gap-2 hover:bg-[#d0d0d0] text-sm h-10 px-4"
									onClick={fetchOwnNote}>
									Find your own note
							</button>
							<div className="text-gray-600 font-[family-name:var(--font-geist-mono)]">
								{currentNote ? currentNote : "No notes found yet"}
							</div>
						</div>
					}
				</div>
			</div>
			<div className="absolute bottom-0 left-0">

				{errorFlag && <ErrorPopup message={errorMessage} />}
			</div>
		</div>
	);
};

export default SmartContractInteraction;


