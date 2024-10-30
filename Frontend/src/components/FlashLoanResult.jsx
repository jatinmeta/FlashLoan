import React from 'react';
import './FlashLoanResult.css';

const FlashLoanResult = ({ Profit_j }) => 
{
  return (
    <div className="flash-loan-result">
      { Profit_j > 0 
        ? (<p className="profit">Flash loan is profitable! Profit: {Profit_j}</p>) 
        : (<p className="not-profitable">Flash loan was not profitable. The triangular arbitrage strategy did not yield a profit this time. Please try different token combinations or amounts for better results.</p>)
      }
    </div>
  );
};
export default FlashLoanResult;
