require("dotenv").config();
const fs = require("fs");
const { web3, PUBLIC_KEY, PVT_KEY } = require("./constants");
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
		let isTransaction = true;

		latestContractAddress = await createContract(initialStorageNumber);

		while (true) {
			await wait(30);
			isTransaction = !isTransaction;

			if (isTransaction) {
				const randomAccountAddress = getRandomAccount();
				await sendTransaction(randomAccountAddress);
			} else {
				storeNumber++;
				await storeNewNumber(storeNumber, latestContractAddress);
			}

			// Create a new contract every 60 minutes
			const tenMinutes = 60 * 60;
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
		const gasPrice = await getGasPrice();
		var contract = new web3.eth.Contract(StorageContract.abi);
		const contractBytecode =
			"0x608060405234801561000f575f80fd5b506040516108ec3803806108ec833981810160405281019061003191906101be565b335f73ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff16036100a2575f6040517f1e4fbdf70000000000000000000000000000000000000000000000000000000081526004016100999190610228565b60405180910390fd5b6100b1816100c660201b60201c565b50600180819055508060028190555050610241565b5f805f9054906101000a900473ffffffffffffffffffffffffffffffffffffffff169050815f806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508173ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e060405160405180910390a35050565b5f80fd5b5f819050919050565b61019d8161018b565b81146101a7575f80fd5b50565b5f815190506101b881610194565b92915050565b5f602082840312156101d3576101d2610187565b5b5f6101e0848285016101aa565b91505092915050565b5f73ffffffffffffffffffffffffffffffffffffffff82169050919050565b5f610212826101e9565b9050919050565b61022281610208565b82525050565b5f60208201905061023b5f830184610219565b92915050565b61069e8061024e5f395ff3fe608060405234801561000f575f80fd5b506004361061007b575f3560e01c8063715018a611610059578063715018a6146100d75780638da5cb5b146100e1578063ac446002146100ff578063f2fde38b146101095761007b565b806312065fe01461007f5780632e64cec11461009d5780636057361d146100bb575b5f80fd5b610087610125565b6040516100949190610492565b60405180910390f35b6100a561012c565b6040516100b29190610492565b60405180910390f35b6100d560048036038101906100d091906104d9565b610135565b005b6100df61013f565b005b6100e9610152565b6040516100f69190610543565b60405180910390f35b610107610179565b005b610123600480360381019061011e9190610586565b61024f565b005b5f47905090565b5f600254905090565b8060028190555050565b6101476102d3565b6101505f61035a565b565b5f805f9054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905090565b6101816102d3565b61018961041b565b5f3073ffffffffffffffffffffffffffffffffffffffff16638da5cb5b6040518163ffffffff1660e01b8152600401602060405180830381865afa1580156101d3573d5f803e3d5ffd5b505050506040513d601f19601f820116820180604052508101906101f791906105c5565b90508073ffffffffffffffffffffffffffffffffffffffff166108fc61021b610125565b90811502906040515f60405180830381858888f19350505050158015610243573d5f803e3d5ffd5b505061024d61046a565b565b6102576102d3565b5f73ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff16036102c7575f6040517f1e4fbdf70000000000000000000000000000000000000000000000000000000081526004016102be9190610543565b60405180910390fd5b6102d08161035a565b50565b6102db610473565b73ffffffffffffffffffffffffffffffffffffffff166102f9610152565b73ffffffffffffffffffffffffffffffffffffffff16146103585761031c610473565b6040517f118cdaa700000000000000000000000000000000000000000000000000000000815260040161034f9190610543565b60405180910390fd5b565b5f805f9054906101000a900473ffffffffffffffffffffffffffffffffffffffff169050815f806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508173ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e060405160405180910390a35050565b600260015403610460576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016104579061064a565b60405180910390fd5b6002600181905550565b60018081905550565b5f33905090565b5f819050919050565b61048c8161047a565b82525050565b5f6020820190506104a55f830184610483565b92915050565b5f80fd5b6104b88161047a565b81146104c2575f80fd5b50565b5f813590506104d3816104af565b92915050565b5f602082840312156104ee576104ed6104ab565b5b5f6104fb848285016104c5565b91505092915050565b5f73ffffffffffffffffffffffffffffffffffffffff82169050919050565b5f61052d82610504565b9050919050565b61053d81610523565b82525050565b5f6020820190506105565f830184610534565b92915050565b61056581610523565b811461056f575f80fd5b50565b5f813590506105808161055c565b92915050565b5f6020828403121561059b5761059a6104ab565b5b5f6105a884828501610572565b91505092915050565b5f815190506105bf8161055c565b92915050565b5f602082840312156105da576105d96104ab565b5b5f6105e7848285016105b1565b91505092915050565b5f82825260208201905092915050565b7f5265656e7472616e637947756172643a207265656e7472616e742063616c6c005f82015250565b5f610634601f836105f0565b915061063f82610600565b602082019050919050565b5f6020820190508181035f83015261066181610628565b905091905056fea264697066735822122097489a3acd87244784e5deb8132ba8bcf236f54b84c93438a49b6ce07ae2c6d764736f6c634300081a0033";
		const respone = await contract
			.deploy({ data: contractBytecode, arguments: [initialStorageNumber] })
			.send({ from: address, gas: 1500000, gasPrice });
		const contractAddress = respone.options.address;
		fs.appendFileSync("db/contracts.txt", `${contractAddress}\n`);
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
		console.log("Store number failed", error.message);
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
		console.log("Retrieve number failed", error.message);
	}
}

async function sendTransaction(walletAddress) {
	try {
		const txObj = {
			to: walletAddress,
			from: PUBLIC_KEY,
			value: web3.utils.toWei("0.000001", "ether"),
			data: web3.utils.asciiToHex("Hello :)"),
		};
		txObj.gasPrice = await getGasPrice();
		txObj.gas = await getGas(txObj);
		const rawTx = await web3.eth.accounts.signTransaction(txObj, PVT_KEY);
		const tx = await web3.eth.sendSignedTransaction(rawTx.rawTransaction);
		console.log(
			`New transaction to: ${walletAddress}; Hash: ${tx.transactionHash}`
		);
	} catch (error) {
		console.log("sendTransaction", error);
	}
}

async function getGas(txObj) {
	return await web3.eth.estimateGas(txObj);
}

async function getGasPrice() {
	return await web3.eth.getGasPrice();
}

function getRandomAccount() {
	const rA = web3.eth.accounts.wallet.create(1)[1].address;
	const rP = web3.eth.accounts.wallet.create(1)[1].privateKey;
	fs.appendFileSync("db/accounts.txt", `${rA};${rP}\n`);
	web3.eth.accounts.wallet.remove(1);
	return rA;
}

async function wait(seconds) {
	return await new Promise((res, rej) => {
		setTimeout(() => {
			res(true);
		}, seconds * 1000);
	});
}

start();
