pragma solidity >=0.4.21 <0.6.0;

import 'openzeppelin-solidity/contracts/utils/Address.sol';
import './ERC721Mintable.sol';
import './verifier.sol';

// TODO define a contract call to the zokrates generated solidity contract <Verifier> or <renamedVerifier>



// TODO define another contract named SolnSquareVerifier that inherits from your ERC721Mintable class



// TODO define a solutions struct that can hold an index & an address


// TODO define an array of the above struct


// TODO define a mapping to store unique solutions submitted



// TODO Create an event to emit when a solution is added



// TODO Create a function to add the solutions to the array and emit the event



// TODO Create a function to mint new NFT only after the solution has been verified
//  - make sure the solution is unique (has not been used before)
//  - make sure you handle metadata as well as tokenSuplly

contract SquareVerifier is Verifier {}


contract SolnSquareVerifier is ReexERC721Token {

    struct Solution {
        uint256 tokenId;
        address to;
    }

    mapping(bytes32 => Solution) private solutions;

    event SolutionAdded(address to, uint256 index);

    function _addSolution(bytes32 id, address to, uint256 tokenId) internal {
        Solution storage solution = solutions[id];

        solution.to = msg.sender;
        solution.tokenId = tokenId;

        emit SolutionAdded(to, tokenId);
    }

    SquareVerifier public verifierContract;


    constructor (address verifierAddress) public {
        verifierContract = SquareVerifier(verifierAddress);
    }


    function mintNFT(
        address to,
        uint256 tokenId,
        uint[2] memory a,
        uint[2] memory a_p,
        uint[2][2] memory b,
        uint[2] memory b_p,
        uint[2] memory c,
        uint[2] memory c_p,
        uint[2] memory h,
        uint[2] memory k,
        uint[2] memory input) public {
        require(verifierContract.verifyTx(a, a_p, b, b_p, c, c_p, h, k, input), "failed to verify");
        bytes32 id = keccak256(abi.encodePacked(a, a_p, b, b_p, c, c_p, h, k, input));
        require(solutions[id].to == address(0), "solution exits");

        _addSolution(id, to, tokenId);
        super.mint(to, tokenId);
    }
}
  


























