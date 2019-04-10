const HDWalletProvider = require("truffle-hdwallet-provider")
const web3 = require('web3')
const MNEMONIC = process.env.MNEMONIC
const INFURA_KEY = process.env.INFURA_KEY
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS
const OWNER_ADDRESS = process.env.OWNER_ADDRESS
const NETWORK = process.env.NETWORK
const NUM_PROPERTIES = 10

const contract = require('../eth-contracts/build/contracts/SolnSquareVerifier')
const ABI = contract.abi

const proofs = [
    require('../zokrates/code/proof/proof'),
    require('../zokrates/code/proof/proof_2'),
    require('../zokrates/code/proof/proof_3'),
    require('../zokrates/code/proof/proof_4'),
    require('../zokrates/code/proof/proof_5'),
    require('../zokrates/code/proof/proof_6'),
    require('../zokrates/code/proof/proof_7'),
    require('../zokrates/code/proof/proof_8'),
    require('../zokrates/code/proof/proof_9')
]

async function main() {
    const provider = new HDWalletProvider(MNEMONIC, `https://${NETWORK}.infura.io/${INFURA_KEY}`)
    const web3Instance = new web3(
        provider
    )

    const contract = new web3Instance.eth.Contract(ABI, CONTRACT_ADDRESS, { gasLimit: "1000000" });
    
    for (var i = 0; i < NUM_PROPERTIES; i++) {
       const result = await contract.methods.mintNFT(
           OWNER_ADDRESS, i,
           proofs[i].proof.A, proofs[i].proof.A_p, proofs[i].proof.B, 
           proofs[i].proof.B_p, proofs[i].proof.C, proofs[i].proof.C_p, 
           proofs[i].proof.H, proofs[i].proof.K, proofs[i].input).send({ from: OWNER_ADDRESS, gas: 3000000 }
       )
       console.log("Minted property. Transaction: " + result.transactionHash) 
    }
}