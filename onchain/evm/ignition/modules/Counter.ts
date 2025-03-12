import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import Counter from '../../artifacts/contracts/Counter.sol/Counter.json' with {type: 'json'};
import {hashMessage} from 'viem'


function futureID(contractName: string, bytecode: string) {

  return `${contractName}_${hashMessage(bytecode)}`;
}

export default buildModule("CounterModule", (m) => {
  const proxyAdminOwner = m.getAccount(0);

  // we deploy a new contract implementation if bytecode change 
  //  TODO: support calldata + ipfs hash ignoring
  const counter = m.contract("Counter", [], {id: futureID('Counter',Counter.bytecode)});

  // we deploy the proxy if not already deployed
  //  TODO: upgrade if already deployed
  const proxy = m.contract("TransparentUpgradeableProxy", [
    counter,
    proxyAdminOwner,
    "0x",
  ]);

  const proxyAdminAddress = m.readEventArgument(
    proxy,
    "AdminChanged",
    "newAdmin"
  );
  const proxyAdmin = m.contractAt("ProxyAdmin", proxyAdminAddress);


  

  const actualCounter = m.contractAt("Counter", proxy);

  return {
    counter: actualCounter,
    proxyAsAdmin: proxyAdmin,
    implentation: counter,
  };
});
