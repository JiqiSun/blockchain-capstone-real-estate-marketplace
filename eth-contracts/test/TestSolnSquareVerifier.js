// Test if a new solution can be added for contract - SolnSquareVerifier

// Test if an ERC721 token can be minted for contract - SolnSquareVerifier

var SquareVerifier = artifacts.require('SquareVerifier');
var SolnSquareVerifier = artifacts.require('SolnSquareVerifier');
const _proof = require('../../zokrates/code/square/proof');

contract('TestSolnSquareVerifier', accounts =>{
    const account_one = accounts[0];
    const account_two = accounts[1];
    const account_three = accounts[2];

    describe('Verify SolnSquare', function(){
        beforeEach(async function(){
            const squareVerifier = await SquareVerifier.new({from:account_one});
            this.contract = await SolnSquareVerifier.new(squareVerifier.address,{from:account_one});
            await this.contract.mintNFT(account_two, 0, _proof.proof.A, _proof.proof.A_p, _proof.proof.B, _proof.proof.B_p, _proof.proof.C, _proof.proof.C_p, _proof.proof.H, _proof.proof.K, _proof.input, {from: account_one});
        });

        it('a new solution can be added for contract', async function () {
            let result = await this.contract.totalSupply.call({from: account_one});
            assert.equal(result.toNumber(),1, "ERC721 token did not mint!") 
        });

        it('an ERC721 token can be minted for contract', async function () {
            await this.contract.transferFrom(account_two, account_three, 0, {from: account_two});
            let result = await this.contract.ownerOf.call(0, {from:account_one});
            assert.equal(result, account_three, "ERC721 token did not mint!"); 
        });
    })

})


