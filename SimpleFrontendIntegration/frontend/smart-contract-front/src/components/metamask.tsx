import { useEffect, useState } from "react";

export default function Metamask() {
	const [walletAddress, setWalletAddress] = useState("");
	const [isConnected, setIsConnected] = useState(false);

	// Function to connect MetaMask wallet
	const connectWallet = async () => {
		if (typeof window.ethereum !== "undefined") {
			try {
				// Request account access from MetaMask
				const accounts = await window.ethereum.request({
					method: "eth_requestAccounts",
				});

				// Set the first account as the connected wallet address
				setWalletAddress(accounts[0]);
				setIsConnected(true);
			} catch (error) {
				console.error("User denied account access or something went wrong");
			}
		} else {
			alert("Please install MetaMask!");
		}
	};

	// Detect MetaMask account change
	useEffect(() => {
		if (window.ethereum) {
			window.ethereum.on("accountsChanged", (accounts) => {
				if (accounts.length > 0) {
					setWalletAddress(accounts[0]);
				} else {
					setWalletAddress("");
					setIsConnected(false);
				}
			});

			window.ethereum.on("chainChanged", () => {
				window.location.reload();
			});
		}
	}, []);	
	return (
		<div>
			{isConnected ? (
				<div className="">
					<button className="text-gray-600 font-[family-name:var(--font-geist-mono)] rounded- border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5" onClick={() => setIsConnected(false)}>Disconnect</button>
				</div>
			) : (
					<div className="">
						<button className="text-gray-600 font-[family-name:var(--font-geist-mono)] rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5" onClick={connectWallet}>Connect Wallet</button>
					</div>
				)}	
		</div>
	);
}
