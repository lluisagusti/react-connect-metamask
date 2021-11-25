import React, { useState, useEffect } from "react";
import Web3 from "web3";
import MetaMaskOnboarding from "metamask-onboarding";

function App() {
  const [{ metaMaskPresent, metaMaskConnected }, setMetaMaskObject] = useState({
    metaMaskPresent: false,
    metaMaskConnected: false,
  });
  const [publicKey, setPublicKey] = useState(null);
  const web3 = new Web3(Web3.givenProvider);

  const connectMetaMask = async () => {
    let accounts;
    try {
      await web3?.givenProvider?.request({ method: "eth_requestAccounts" });
      setMetaMaskObject({ metaMaskConnected: true, metaMaskPresent });
      accounts = await web3.eth.getAccounts();
      setPublicKey(() => accounts[0]);
      console.log("accounts[0] --> ", accounts[0]);
    } catch (error) {
      console.error("metmask error", error);
    }
  };

  useEffect(() => {
    const isMetaMaskPresent = () => {
      return web3?.givenProvider?.isMetaMask ? true : false;
    };

    setMetaMaskObject(() =>
      isMetaMaskPresent()
        ? { metaMaskPresent: true, metaMaskConnected }
        : { metaMaskPresent: false, metaMaskConnected }
    );
  }, [web3?.givenProvider?.isMetaMask, metaMaskConnected]);

  return (
    <div className="App">
      <h2>Blockchain Address Retriever</h2>
      {!metaMaskPresent && (
        <button
          onClick={() => {
            const onboarding = new MetaMaskOnboarding();
            onboarding.startOnboarding();
          }}
        >
          Install MetaMask Wallet
        </button>
      )}
      {metaMaskPresent && !metaMaskConnected && (
        <button
          onClick={() => {
            connectMetaMask();
          }}
        >
          Connect MetaMask Wallet
        </button>
      )}
      {publicKey && publicKey !== null && (
        <h3>Account's address: {publicKey}</h3>
      )}
    </div>
  );
}

export default App;
