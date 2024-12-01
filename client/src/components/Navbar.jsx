import React from 'react';
import UploadCSV from "./UploadCSV";

const Navbar = ({ accounts, selectedAccount, onSelectAccount, isOpen, onToggle, onUpload }) => {
  return (
    <div className={`fixed left-0 top-0 h-full bg-base-100 shadow-lg transition-all duration-300 ${isOpen ? 'w-56' : 'w-16'} z-10`}>  
      <button onClick={onToggle} className="btn btn-sm btn-circle btn-accent text-white absolute top-4 right-4">  
        {isOpen ? '←' : '→'}  
      </button>  
      <nav className="mt-16 p-2">  
        <ul className="menu menu-compact gap-2">  
          {isOpen && (  
            <>  
              {accounts.length > 0 && (
                <>
                  <li>
                    <button 
                      className={`btn btn-sm w-full justify-start ${selectedAccount === 'All' ? 'btn-accent text-white' : 'btn-outline'}`} 
                      onClick={() => onSelectAccount('All')}
                    >  
                      All Accounts  
                    </button>
                  </li>  
                  {accounts.map(account => (
                    <li key={account}>
                      <button 
                        className={`btn btn-sm w-full justify-start ${selectedAccount === account ? 'btn-accent text-white' : 'btn-outline'}`} 
                        onClick={() => onSelectAccount(account)}
                      >
                        <span className="truncate">{account}</span>
                      </button>
                    </li>
                  ))}
                  <div className="my-4">
                    <div className="w-4/5 mx-auto border-t border-base-300"></div>
                  </div>
                </>
              )}
              <li>
                <UploadCSV onUpload={onUpload} />
              </li>
            </>  
          )}
        </ul>
      </nav>
    </div>
  );
};

export default Navbar;