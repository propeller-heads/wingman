import './App.css';
import { createPriceCondition } from './privacy/threshold';

import { useEffect, useState } from 'react';
import { ethers } from 'ethers';

function toHexString(byteArray) {
  return Array.from(byteArray, function (byte) {
    return ('0' + (byte & 0xff).toString(16)).slice(-2);
  }).join('');
}

function App() {
  const [nucypher, setNucypher] = useState();
  const [provider, setProvider] = useState();
  const [alice, setAlice] = useState(undefined);
  const [bob, setBob] = useState(undefined);
  const [policy, setPolicy] = useState('');

  const loadNucypher = async () => {
    const nucypherModule = await import('@nucypher/nucypher-ts');
    setNucypher(nucypherModule);
  };

  const loadWeb3Provider = async () => {
    if (!window.ethereum) {
      console.error('You need to connect to the MetaMask extension');
    }
    const provider = new ethers.providers.Web3Provider(window.ethereum, 'any');

    const { chainId } = await provider.getNetwork();
    if (![137, 80001].includes(chainId)) {
      console.error('You need to connect to the Mumbai or Polygon network');
    }

    await provider.send('eth_requestAccounts', []);
    setProvider(provider);

    const condition = createPriceCondition(nucypher, "0x0715A7794a1dc8e42615F059dD6e406A6594651A", 179922000000, "<=", 80001);
    console.log(condition);
  };

  const config = {
    // Public Porter endpoint on Tapir network
    porterUri: 'https://porter-tapir.nucypher.community',
  };

  const makeAlice = () => {
    const secretKey = nucypher.SecretKey.fromBytes(Buffer.from('fake-secret-key-32-bytes-alice-x'));
    const alice = nucypher.Alice.fromSecretKey(
      config,
      secretKey,
      provider
    );
    setAlice(alice);
  };

  const makeBob = () => {
    const secretKey = nucypher.SecretKey.fromBytes(Buffer.from('fake-secret-key-32-bytes-bob-xxx'));
    const bob = nucypher.Bob.fromSecretKey(config, secretKey);
    setBob(bob);
  };

  const makeRemoteBob = (bob) => {
    const { decryptingKey, verifyingKey } = bob;
    return { decryptingKey, verifyingKey };
  };

  const makeCharacters = () => {
    makeAlice();
    makeBob();
    setPolicy('');
  };

  const getRandomLabel = () => `label-${new Date().getTime()}`;

  const runExample = async () => {
    const remoteBob = makeRemoteBob(bob);
    const threshold = 2
    const shares = 3
    const startDate = new Date()
    const endDate = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30) // In 30 days
    const policyParams = {
      bob: remoteBob,
      label: getRandomLabel(),
      threshold,
      shares,
      startDate,
      endDate
    };

    const includeUrsulas = [];
    const excludeUrsulas = [];
    const policy = await alice.grant(
      policyParams,
      includeUrsulas,
      excludeUrsulas
    );

    console.log('Policy created');
    setPolicy(policy);
  };

  useEffect(() => {
    loadNucypher();
    loadWeb3Provider();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        {nucypher ? (
          <div className="stack left">
            <div>
              <div>Create Alice and Bob</div>
              <button onClick={(e) => makeCharacters()}>Go</button>
              <div>
                {alice && (
                  <span>
                    Alice: {`0x${toHexString(alice.verifyingKey.toBytes())}`}
                  </span>
                )}
              </div>
              <div>
                {bob && (
                  <span>
                    Bob: {`0x${toHexString(bob.verifyingKey.toBytes())}`}
                  </span>
                )}
              </div>
            </div>

            {alice && bob && (
              <div>
                <div>Create a policy</div>
                <button onClick={(e) => runExample()}>Go</button>
              </div>
            )}

            {policy && (
              <div>
                <div>
                  Policy id: <div>{toHexString(policy.id.toBytes())}</div>
                </div>
                <div>
                  Policy: <div>{JSON.stringify(policy)}</div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <span>Loading nucypher-ts</span>
        )}
      </header>
    </div>
  );
}

export default App;
