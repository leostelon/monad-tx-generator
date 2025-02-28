require("dotenv").config();
const { web3 } = require("./constants");
const StorageContract = require("./contracts/Storage.json");

const address = web3.eth.accounts.wallet[0].address;
const defaulContractAddress = "0x13859e8fbD2c6DAe7B9BA9c4609537F0137d87c1";
let latestContractAddress = defaulContractAddress;

async function start() {
	try {
		console.log("::::Transaction Started::::\n");
		console.log("MY ADDRESS:", address);

		let initialStorageNumber = Math.ceil(Math.random() * 10);
		let storeNumber = initialStorageNumber + 1;
		latestContractAddress = await createContract(initialStorageNumber);

		while (true) {
			await wait(1);
			storeNumber++;

			await storeNewNumber(storeNumber, latestContractAddress);

			// Create a new contract every ten minutes
			const tenMinutes = 60 * 10;
			if (storeNumber - initialStorageNumber >= tenMinutes) {
				initialStorageNumber = Math.ceil(Math.random() * 10);
				storeNumber = initialStorageNumber + 1;
				latestContractAddress = await createContract(initialStorageNumber);
			}
		}
	} catch (error) {
		console.log(error);
	}
}

async function createContract(initialStorageNumber) {
	try {
		const gasPrice = await web3.eth.getGasPrice();
		var contract = new web3.eth.Contract(StorageContract.abi);
		const contractBytecode =
			"0x6080604052348015600e575f80fd5b506040516101e13803806101e18339818101604052810190602e9190606b565b805f81905550506091565b5f80fd5b5f819050919050565b604d81603d565b81146056575f80fd5b50565b5f815190506065816046565b92915050565b5f60208284031215607d57607c6039565b5b5f6088848285016059565b91505092915050565b6101438061009e5f395ff3fe608060405234801561000f575f80fd5b5060043610610034575f3560e01c80632e64cec1146100385780636057361d14610056575b5f80fd5b610040610072565b60405161004d919061009b565b60405180910390f35b610070600480360381019061006b91906100e2565b61007a565b005b5f8054905090565b805f8190555050565b5f819050919050565b61009581610083565b82525050565b5f6020820190506100ae5f83018461008c565b92915050565b5f80fd5b6100c181610083565b81146100cb575f80fd5b50565b5f813590506100dc816100b8565b92915050565b5f602082840312156100f7576100f66100b4565b5b5f610104848285016100ce565b9150509291505056fea26469706673582212200177b3cbfba52c6ae691c9af2ffe78034b45bbf960934ec0868566aaa14f7a9964736f6c634300081a0033";
		const respone = await contract
			.deploy({ data: contractBytecode, arguments: [initialStorageNumber] })
			.send({ from: address, gas: 1500000, gasPrice });
		const contractAddress = respone.options.address;
		console.log(
			`New contract: ${contractAddress}; Initial Storage: ${initialStorageNumber}`
		);
		return contractAddress;
	} catch (error) {
		console.log("Contract creation failed", error.message);
	}
}

async function storeNewNumber(newNumber, contractAddress) {
	try {
		let finalContractAddress = contractAddress;
		if (!finalContractAddress) {
			finalContractAddress = defaulContractAddress;
		}

		const contract = new web3.eth.Contract(
			StorageContract.abi,
			finalContractAddress
		);

		const gasPrice = await web3.eth.getGasPrice();
		const gas = await contract.methods.store(newNumber).estimateGas();

		const respone = await contract.methods
			.store(newNumber)
			.send({ from: address, gas: 1500000, gas, gasPrice });

		const number = await retrieveNumber(finalContractAddress);
		console.log(
			`Stored: ${number} at ${finalContractAddress}; Hash: ${respone.transactionHash}`
		);
	} catch (error) {
		console.log("Contract creation failed", error.message);
	}
}

async function retrieveNumber(contractAddress) {
	try {
		const contract = new web3.eth.Contract(
			StorageContract.abi,
			contractAddress
		);

		const respone = await contract.methods.retrieve().call({ from: address });
		return respone;
	} catch (error) {
		console.log("Contract creation failed", error.message);
	}
}

async function wait(seconds) {
	return await new Promise((res, rej) => {
		setTimeout(() => {
			res(true);
		}, seconds * 1000);
	});
}

start();
