// SPDX-License-Identifier: UNLICENSED
pragma solidity =0.6.6;

import "./interfaces/IUniswapV2Factory.sol";         //| it deals with liquidity pool
import "./interfaces/IUniswapV2Pair.sol";           // | get the address of tokens in liquidity pool

import "./interfaces/IUniswapV2Router01.sol";     //   | (version 1)   Responsible for swaps and providing liquidity in Uniswap Protocol
import "./interfaces/IUniswapV2Router02.sol";    //    | (version 2)  

import "./interfaces/IERC20.sol";              //      | transferring tokens
                                              //       | querying the balance of an address
                                             //        | approving third parties to spend tokens on your behalf(allowance)



import "./libraries/UniswapV2Library.sol";  // Return Current reserve of Uniswap V2 pair function 
                                           //  getReserves(address factory,address tokenA,address tokenB)

import "./libraries/SafeERC20.sol";      //   provide safe methods for interacting with ERC20 token(no Vulnerabilies)
import "hardhat/console.sol";


// SafeERC20 -> import -> use Address.sol Library ->  isContract(address account)
// Address
//     ->Returns true if 
//         ->`address` is a contract.
//     ->Retruns False if(unsafe) 
//         -> an EOA
//         -> an address where a contract lived, but was destroyed
//         -> a contract in construction
//         -> an address where a contract will be created


// SafeMath
//     -> prevent overflow & underflow


// _____________________________________Contract________________________________________________________________________________________________________________________________

contract Flash_Loan 
{
    using SafeERC20 for IERC20; 
    uint256 public trade1Coin;
    uint256 public trade2Coin;
    uint256 public trade3Coin;

    address private constant PANCAKE_FACTORY = 0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73;
    address private constant PANCAKE_ROUTER = 0x10ED43C718714eb63d5aA57B78B54704E256024E;

    address private constant WBNB = 0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c;
    address private Coin_1;
    address private Coin_2;
    address private Coin_3;

    function set_addresses(address i, address j, address k) public {
        Coin_1 = i;
        Coin_2 = j;
        Coin_3 = k;
    }

    uint256 private deadline = block.timestamp + 1 days;
    uint256 private constant MAX_INT = 115792089237316195423570985008687907853269984665640564039457584007913129639935;

/*  uint256 private constant MAX_INT = 0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff;
    uint256 private constant MAX_INT = 2**256 - 1;

    There’s a variety of reasons you might want to know the maximum possible integer in solidity. 
    One common use case is to approve a contract to transfer your tokens on your behalf:
    tokenContract.approve(exchangeContract, MAX_INT, { from: me })
    Here I tell the token contract that the exchange contract is allowed to transfer all my tokens. */


    function checkResult(uint _repayAmount, uint _acquiredCoin) pure private returns (bool) { return _acquiredCoin > _repayAmount; }

    function getBalanceOfToken(address _address) public view returns (uint256) { return IERC20(_address).balanceOf(address(this));}

    function resetAllowanceIfNeeded(IERC20 token, address spender) internal 
    {
        uint256 currentAllowance = token.allowance(address(this), spender);
        if (currentAllowance != 0) 
        {
            token.safeApprove(spender, 0);                  // Reset the current allowance to 0
        }
        token.safeApprove(spender, MAX_INT);              // Now set the desired allowance
    }


//  _____________________________________Functions________________________________________________________________________________________________________________________________
//  initateArbitrage   -> pancakeCall (inbuild) ->  placeTrade


    function placeTrade(address _fromToken, address _toToken, uint _amountIn) private returns (uint) 
    {
        address pair = IUniswapV2Factory(PANCAKE_FACTORY).getPair(_fromToken, _toToken);            // find/accessing liquidity pool of Token A and Token B
        require(pair != address(0), "Pool does not exist");

        address[] memory path_array = new address[](2);
        path_array[0] = _fromToken;
        path_array[1] = _toToken;

        // Log allowance and balance checks
        uint256 allowance = IERC20(_fromToken).allowance(address(this), PANCAKE_ROUTER);
        console.log("Allowance for token", _fromToken, ":", allowance);
        require(allowance >= _amountIn, "Insufficient allowance for transfer");

        uint256 balance = IERC20(_fromToken).balanceOf(address(this));
        console.log("Balance for token", _fromToken, ":", balance);
        require(balance >= _amountIn, "Insufficient token balance for trade");

        uint256 amountRequired = IUniswapV2Router01(PANCAKE_ROUTER).getAmountsOut(_amountIn, path_array)[1];
        uint256 amountReceived = IUniswapV2Router01(PANCAKE_ROUTER).swapExactTokensForTokens(
            _amountIn, amountRequired, path_array, address(this), deadline
        )[1];

        require(amountReceived > 0, "Transaction Abort");
        return amountReceived;
    }

    // handle tokens from liquidity pool
    //      call -> pancakecall 
    //                  -> settelmenet (fee for Flash loan,kitna vapas dena hai ,kitna apne pass rakna hai   like operations)
    //                  -> call trade 
    //                          -> trading in Arbitrage

    function initiateArbitrage(address Token_Borrowed, uint amount_of_Borrowed) external 
    {

    //_________________________Approval____________________________________________________________________________________________________________________________________________
        resetAllowanceIfNeeded(IERC20(Coin_1), address(PANCAKE_ROUTER));   
        resetAllowanceIfNeeded(IERC20(Coin_2), address(PANCAKE_ROUTER));
        resetAllowanceIfNeeded(IERC20(Coin_3), address(PANCAKE_ROUTER));

    //_________________________Liquidity Pool_____________________________________________________________________________________________________________________
        address pair = IUniswapV2Factory(PANCAKE_FACTORY).getPair(Token_Borrowed, WBNB);   // find/accessing liquidity pool of BUSD and WBNB   -> Bsc scan website -> Read contract -> call getPair() function 
        require(pair!=address(0),"Pool does not exist");
        require(pair != address(0), "Pool does not exist");


    //________________________transfer Token_Borrowed to address(this)_________________________________________________________________________________________
        address token0 = IUniswapV2Pair(pair).token0();
        address token1 = IUniswapV2Pair(pair).token1();

        // Token0,1 = (BNB,BUSE) ? or (BUSE,BNB) ?
        uint amount0Out = Token_Borrowed == token0 ? amount_of_Borrowed : 0;         //  = 0
        uint amount1Out = Token_Borrowed == token1 ? amount_of_Borrowed : 0;        //   = amount_of_Borrowed

        bytes memory data = abi.encode(Token_Borrowed, amount_of_Borrowed, msg.sender);
        IUniswapV2Pair(pair).swap(amount0Out, amount1Out, address(this), data);       // transfer Coin_1 to our contract (address(this))       
                                                                                     //  use of pair  ->     In IUniswapV2Pair contract(Github)     ->    needed token0,token1 address (get using pair)
                                                                                    //   IUniswapV2Pair -> have swap function  that will call pancakeCall function -> inbuild -> check in contract(Github) 

    }

    function pancakeCall(address _sender, uint256 amount0, uint256 amount1, bytes calldata _data) external 
    {

        //_____________________checking for Security purpose (call my me only)_________________________________________________________________________________________________________________        
        address token0 = IUniswapV2Pair(msg.sender).token0();            // msg.sender = pair = liquidity pool address
        address token1 = IUniswapV2Pair(msg.sender).token1();           //  accessing token1 address

        address pair = IUniswapV2Factory(PANCAKE_FACTORY).getPair(token0, token1);
        require(msg.sender == pair, "Sender needs to match the pair");
        require(_sender == address(this), "Sender should match the contract");

        // function swap( , , address to, bytes calldata data)
        (address Token_Borrowed, uint256 amount_of_Borrowed, address myAddress) = abi.decode(_data, (address, uint256, address));   // Decode data for calculating the repayment 

        uint256 fee = ((amount_of_Borrowed * 3) / 997) + 1;         // Calculate the amount to repay at the endaaa
        uint256 repayAmount = amount_of_Borrowed + fee;
        uint256 loanAmount = amount0 > 0 ? amount0 : amount1;
        
        // Triangular ARBITRAGE
        //             BUSD
        //              /\
        //             /  \
        //            /    \
        //           /      \
        //          /        \
        //         /          \
        //        /____________\
        //      CAKE          CROX

        trade1Coin = placeTrade(Coin_1, Coin_2, loanAmount);
        trade2Coin = placeTrade(Coin_2, Coin_3, trade1Coin);
        trade3Coin = placeTrade(Coin_3, Coin_1, trade2Coin);

        bool profit_Check = checkResult(repayAmount, trade3Coin);
        require(profit_Check, "------------------Arbitrage is not profitable------------------");

        IERC20 otherToken = IERC20(Coin_1);                             // Pay Myself
        otherToken.transfer(myAddress, trade3Coin - repayAmount);

        IERC20(Token_Borrowed).transfer(pair, repayAmount);           // Pay Loan Back
    }
}
