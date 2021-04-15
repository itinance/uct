# United Crowd Token Contracts

## Installation / Setup

Installation requires a working node-environment including npm.

### Install Prerequisites:

```
npm install
```

or

```
yarn install
```


### Build eveything:


```
npm run build
```

or 

```
yarn run build
```


### Run unit tests:

```
npm run test
```

or 

```
yarn run test
```

## Deployment

### Testnet (Rinkeby)

Deployment:


```
npx hardhat run scripts/deploy.js --network rinkeby
```

Verification:

```

```

```
npx hardhat verify --network rinkeby DEPLOYED_CONTRACT_ADDRESS 0xb66e545739be353c962c89db50e75ce20e289df2
```

## Work with smart contract

### hardhat console

```
npx hardhat console --network rinkeby
```


Mint token:

```
await token.mint('0xC1dAe5cE49FA879b8902F8991D33DE2Bf21605C0', new hardhat.ethers.BigNumber.from('123456789000000000000000'));
```
