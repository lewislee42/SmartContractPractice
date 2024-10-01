'use client'
import Image from "next/image";
import { useEffect, useState } from "react";
import SmartContractInteraction from "@/components/tabs";

export default function Home() {


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
		<div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)] static">
			<main className="flex flex-col gap-8 row-start-2 items-center static">
				<div className="flex flex-col gap-8 row-start-2 items-center bg-stone-100 rounded-lg p-8 drop-shadow-md min-h-[50vh] min-w-[60vh] static">
					<SmartContractInteraction />
				</div>
			</main>
			<footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
				<a
					className="flex items-center gap-2 hover:underline hover:underline-offset-4"
					href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
					target="_blank"
					rel="noopener noreferrer"
				>
					<Image
						aria-hidden
						src="https://nextjs.org/icons/file.svg"
						alt="File icon"
						width={16}
						height={16}
					/>
					Learn
				</a>
				<a
					className="flex items-center gap-2 hover:underline hover:underline-offset-4"
					href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
					target="_blank"
					rel="noopener noreferrer"
				>
					<Image
						aria-hidden
						src="https://nextjs.org/icons/window.svg"
						alt="Window icon"
						width={16}
						height={16}
					/>
					Examples
				</a>
				<a
					className="flex items-center gap-2 hover:underline hover:underline-offset-4"
					href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
					target="_blank"
					rel="noopener noreferrer"
				>
					<Image
						aria-hidden
						src="https://nextjs.org/icons/globe.svg"
						alt="Globe icon"
						width={16}
						height={16}
					/>
					Go to nextjs.org →
				</a>
			</footer>
		</div>
	);
}
