import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import FlashLoanABI from '../ABI_Address/FlashLoan.json';
import contractAddress from '../ABI_Address/contract-address.json';
import ERC20ABI from '../ERC20ABI.json';
import TokenSelect from './TokenSelect';
import FlashLoanResult from './FlashLoanResult';
import './FlashLoanForm.css'

let FlashLoanForm = () => 
{
    let [Token1, Set_Token1]                     = useState('');
    let [Token2, Set_Token2]                     = useState('');
    let [Token3, Set_Token3]                     = useState('');
    let [Profit_i, setProfit]                    = useState(null);
    let [Loading, Set_Loading]                   = useState(false);
    let [Error_i, Set_Error]                     = useState('');
    let [Signer_i, Set_Signer]                   = useState(null);
    let [Amount_To_Fund_i, Set_Amount_To_Fund]   = useState('');
    let [MetaMask_Account, Set_MetaMask_Account] = useState('');
    let [Contract_Funded, Set_Contract_Funded]   = useState(false);
    
/* Meempool Available

    BUSD CROX CAKE
    BUSD BTCB CAKE
    BUSD BTCB DOGE
    BUSD ETH DOGE
    BUSD ETH BTCB
    BUSD ADA BTCB

*/
    let Token_List = 
    [
        { label: 'BUSD', value: '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56' },
        { label: 'CROX', value: '0x2c094F5A7D1146BB93850f629501eB749f6Ed491' },
        { label: 'CAKE', value: '0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82' },
        { label: 'BTCB', value: '0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c' },
        { label: 'ETH',  value: '0x2170Ed0880ac9A755fd29B2688956BD959F933F8' },
        { label: 'DOGE', value: '0xbA2aE424d960c26247Dd6c32edC70B295c744C43' },
        { label: 'ADA',  value: '0x3EE2200Efb3400fAbB9AacF31297cBdD1d435D47' },
    ];


    let WBNB = "0x3EE2200Efb3400fAbB9AacF31297cBdD1d435D47";

    let Approve_Token_Transfer = async () =>    // Approve the Flash Loan contract to spend the tokens
    {
        let Token_Contract_instance = new ethers.Contract(WBNB, ERC20ABI, Signer_i);
        let tx = await Token_Contract_instance.approve(contractAddress.FlashLoan, ethers.utils.parseUnits("0.0001", 18));  // 1 Token1  (Fixed)
        await tx.wait();
        let allowance = await Token_Contract_instance.allowance(MetaMask_Account,contractAddress.FlashLoan);
        console.log("Allowance after approval:", ethers.utils.formatEther(allowance));
        console.log("Approval successful");
    };


    let Fund_FlashLoan_Contract = async () => 
    {
        try 
        {    
            await Approve_Token_Transfer(); 
                                                     
            let Token_Contract_instance = new ethers.Contract(WBNB, ERC20ABI, Signer_i);
            console.log("Funding from connected account:", await Signer_i.getAddress());
            
            let tx = await Token_Contract_instance.transfer(contractAddress.FlashLoan, ethers.utils.parseUnits("0.0001", 18), {
              gasLimit: ethers.utils.hexlify(100000)
          });
          await tx.wait();
            console.log(`Successfully funded Flash Loan contract with 0.001 Token1`);
        } 
        catch(error) 
        {
          console.error("Funding error details:", error);

        }
    };


    let handleConnect = async () => 
    {
        if (window.ethereum) 
        {
            let Provider_ = new ethers.providers.Web3Provider(window.ethereum);
            let chainId = await Provider_.getNetwork().then(net => net.chainId);
            let Forked_BSC_chain_id = 31337; 

            if (chainId !== Forked_BSC_chain_id) 
            {
                try 
                {
                    await window.ethereum.request(
                    {
                        method: 'wallet_switchEthereumChain',
                        params: [{ chainId: ethers.utils.hexValue(Forked_BSC_chain_id) }],
                    });
                } 
                catch (error) 
                {
                    console.error("Error switching to BSC Forked network:", error);
                }
            }
            let signer_ = Provider_.getSigner();
            Set_Signer(signer_);
            let Accounts_ = await window.ethereum.request({ method: 'eth_requestAccounts' });
            Set_MetaMask_Account(Accounts_[0]);
            console.log("Connected MetaMask account:", Accounts_[0]);

        } 
        else 
        {
            alert('Please install MetaMask!');
        }
    };

    let handleSubmit = async (e) => 
    {
      e.preventDefault();
      Set_Loading(true);
      Set_Error('');
      try 
      {
          let Provider_ = new ethers.providers.Web3Provider(window.ethereum);
          if (!Signer_i) { Set_Error('Please connect your MetaMask account first.');Set_Loading(false); return; }

          let Contract_instance = new ethers.Contract(contractAddress.FlashLoan, FlashLoanABI.abi, Signer_i);
          let MetaMask_Account_Balance = await Provider_.getBalance(WBNB);

          console.log("Provider=", Provider_);
          console.log("Contract_instance=", Contract_instance);
          console.log("Connected account balance:", ethers.utils.formatEther(MetaMask_Account_Balance));


          if (MetaMask_Account_Balance.eq(0)) 
          {
              Set_Error('Insufficient Balance : You must have at least 0.0001 WBNB (approx. 5 INR) to execute the flash loan');
              Set_Loading(false);
              return;
          }


          
          
          if(contractTokenBalance.eq(0))
          {
            console.log("Funding of Flash Loan start")
            await Fund_FlashLoan_Contract(); 
          }
        
          let contractTokenBalance = await Contract_instance.getBalanceOfToken(WBNB);
          console.log("Contract Token Balance:", ethers.utils.formatEther(contractTokenBalance));

          if (contractTokenBalance.eq(0)) 
          {
              Set_Error('Contract is not funded.');
              Set_Loading(false);
              return;
          } 
          if (contractTokenBalance.gt(0)) 
          {
              Set_Contract_Funded(true);
          }

          let tx = await Contract_instance.set_addresses(Token1, Token2, Token3);
          await tx.wait();
          console.log("Tokens set: ","\n Token1 =", Token1,"\n Token2 =", Token2,"\n Token3 =", Token3);

          let flashLoanResult = await Contract_instance.initiateArbitrage(Token1, ethers.utils.parseUnits('200', 18));
          console.log("Flash Loan Result:", flashLoanResult);
          setProfit(flashLoanResult);
          Set_Error('');

        } 
        catch (error) 
        {
            Set_Error('Flash loan not profitable. Try different tokens.');
            console.log("Error =",error);
        }
        Set_Loading(false);
    };

    return(
        <div className="class_arrow">
                        <div className="class_connect_account" >
                        <button onClick={handleConnect} required>Connect MetaMask</button>
                        {MetaMask_Account && (<p>Connected Account: {MetaMask_Account}</p>)}
                  </div>
            <form onSubmit={handleSubmit}>
                
                    <div className="glowing-arrow arrow1"></div>
                    <div className="glowing-arrow arrow2"></div>
                    <div className='class_1'>Triangular Arbitrage</div>
                    <div className="glowing-arrow arrow3"></div>
                    
                    {/* Token Inputs with respective classes for positioning */}
                    <div className="token-input token1-input">
                        <TokenSelect label="Token 1 " Token_List_j={Token_List} Set_Token_j={Set_Token1} />
                    </div>
                    <div className="token-input token2-input">
                        <TokenSelect label="Token 2 " Token_List_j={Token_List} Set_Token_j={Set_Token2} />
                    </div>
                    <div className="token-input token3-input">
                        <TokenSelect label="Token 3 " Token_List_j={Token_List} Set_Token_j={Set_Token3} />
                    </div>


                    <div className="amount-fund">
                    <label htmlFor="amountToFund">Borrow Amount </label>
                    <input type="number" id="amountToFund" value={Amount_To_Fund_i} placeholder= "Enter Amount " required onChange={(e) => Set_Amount_To_Fund(e.target.value)} />
                    {/* <span className="info-message">You must have at least 0.0001 WBNB (approx. 5 INR) to execute the flash loan.</span> */}
                    <button type="submit" disabled={Loading} style={{marginTop: '10px'}} > {Loading ? 'Executing Flash Loan...' : 'Execute Flash Loan'} </button>
                </div>
            </form>
            
            <div className='class_0'>
                {Contract_Funded && <p style={{ color: 'green', marginBottom: '0px' }}>Contract is funded with 1 WBNB Token and ready.</p>}
                {Error_i && <p style={{ color: 'red', marginTop: '4px' }}>{Error_i}</p>}
                {Profit_i !== null && <FlashLoanResult Profit_j={Profit_i} />}
                </div>
        </div>
    );
  };

export default FlashLoanForm;










