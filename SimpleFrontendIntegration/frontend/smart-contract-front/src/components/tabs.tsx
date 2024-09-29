import { useState, useEffect } from "react";
import { ethers } from "ethers";
import contractABI from "../Notes.json"; // ABI of your smart contract

const CONTRACT_ADDRESS = "0xe7f1725e7734ce288f8367e1bb143e90bb3f0512"; // Deployed contract address

const SmartContractInteraction = () => {
	const [walletAddress, setWalletAddress] = useState<string | null>(null);
	const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null);
	const [currentAccount, setCurrentAccount] = useState(null);
	const [contract, setContract] = useState<ethers.Contract | null>(null);
	const [count, setCount] = useState<number | null>(null);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);

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
				console.error(error);
			}
		} else {
			setErrorMessage("MetaMask is not installed");
		}
	};

	const initializeContract = (provider, account) => {
		console.log("provider", provider);
		const signer = provider.getSigner();
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


	// Call the contract function (e.g., increment count)
	const incrementCount = async () => {
		if (contract) {
			try {
				const tx = await contract.checkOwnNote(); // This sends the transaction
			} catch (error) {
				setErrorMessage("Failed to increment count");
				console.error(error);
			}
		} else {
			setErrorMessage("Contract not initialized");
		}
	};

	// Fetch the count from the contract
	const fetchCount = async () => {
		if (contract) {
			try {
				console.log(contract);
				const count = await contract.checkOwnNote(); // This reads data from the contract
				setCount(count.toNumber());
			} catch (error) {
				setErrorMessage("Failed to fetch count");
				console.error(error);
			}
		}
	};

	return (
		<div>
			<button onClick={connectWallet} className="text-gray-600 font-[family-name:var(--font-geist-mono)] rounded- border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5">
				{walletAddress ? `Connected: ${walletAddress}` : "Connect Wallet"}
			</button>

			{walletAddress && (
				<div>

					<button className="text-gray-600 font-[family-name:var(--font-geist-mono)] rounded- border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
					onClick={incrementCount}>
						Increment Count
					</button>

					<button className="text-gray-600 font-[family-name:var(--font-geist-mono)] rounded- border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
					onClick={fetchCount}>
						Get Count
					</button>

					{count !== null && <p>Current Count: {count}</p>}
				</div>
			)}

			{errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
		</div>
	);
};

export default SmartContractInteraction;


