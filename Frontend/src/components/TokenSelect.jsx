import React from 'react';
import './TokenSelect.css';

let TokenSelect = ({ label, Token_List_j, Set_Token_j }) => 
{
  return(
    <div className="token-select">
      <label>{label}</label>
      <select onChange={(e) => Set_Token_j(e.target.value)} className="token-dropdown">
        
        <option value =" ">Select Token  </option>

        {Token_List_j.map ((token) =>  (
                                          <option key={token.value} value={token.value}>
                                            {token.label}
                                          </option>
                                       )
                          )
        }
      </select>
    </div>
  );
};

export default TokenSelect;
