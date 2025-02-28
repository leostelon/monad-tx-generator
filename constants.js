const { default: Web3 } = require("web3");

const PVT_KEY = process.env.PVT_KEY;
const PUBLIC_KEY = process.env.PUBLIC_KEY;
const MONAD_RPC_URL = process.env.MONAD_RPC_URL;

const web3 = new Web3(MONAD_RPC_URL);
web3.eth.accounts.wallet.add(PVT_KEY)

module.exports = {
	PVT_KEY,
	PUBLIC_KEY,
	MONAD_RPC_URL,
	web3,
};

