var ERC721MintableComplete = artifacts.require('ReexERC721Token');

contract('TestERC721Mintable', accounts => {

    const account_one = accounts[0];
    const account_two = accounts[1];
    const account_three = accounts[2];
    const account_four = accounts[3];

    describe('match erc721 spec', function () {
        beforeEach(async function () { 
            this.contract = await ERC721MintableComplete.new({from: account_one});

            // TODO: mint multiple tokens
            await this.contract.mint(account_two, 0, {from: account_one});
            await this.contract.mint(account_three, 1, {from: account_one});
        })

        it('should return total supply', async function () { 
            let result = await this.contract.totalSupply.call({from: account_one});
            assert.equal(result.toNumber(), 2, "Total supply is not correct!");        
        })

        it('should get token balance', async function () { 
          let result = await this.contract.balanceOf.call(account_two, {from: account_one});
          assert.equal(result.toNumber(),1, "Wrong token balance!");  
        })


        // token uri should be complete i.e: https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/1
        it('should return token uri', async function () { 
            let result = await this.contract.tokenURI.call(1,{from:account_one})
            assert.equal(result, "https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/1", "Token UIR not match!")    
        })

        it('should transfer token from one owner to another', async function () { 
            await this.contract.transferFrom(account_two, account_three, 0, {from: account_two});
            let result = await this.contract.ownerOf.call(0, {from:account_one});
            assert.equal(result, account_three, "Cannot transfer token from one owner to another!");   
        })
    });

    describe('have ownership properties', function () {
        beforeEach(async function () { 
            this.contract = await ERC721MintableComplete.new({from: account_one});
        })

        it('should fail when minting when address is not contract owner', async function () { 
            let revert = false;
            try{
                await this.contract.mint(account_two, 0, {from: account_four});
            } catch(e){
                revert = true;
            }
            assert.equal(revert, true, "Did not fail when minting when address is not contract owner!");
        })

        it('should return contract owner', async function () { 
            let result = await this.contract.getOwner.call({from:account_two});
            assert.equal(result, account_one, `contract owner should be ${account_one}`)    
        })

    });
})