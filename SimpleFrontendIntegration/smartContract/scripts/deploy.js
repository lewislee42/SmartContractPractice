async function main() {
  const [deployer] = await ethers.getSigners();

  console.log('Deploying contracts with the account:', deployer.address);

  const MyContract = await ethers.getContractFactory('Notes');
  const myContract = await MyContract.deploy();

  console.log('Contract deployed to address:', myContract);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
