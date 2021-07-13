<template>
  <div class="home">
    <b-container fluid>
      <b-row>
        <b-col cols="4" offset="2">
          <b-form-radio-group style="margin: 0 2rem 2rem 0;" v-model="selectedOption" :options="options"></b-form-radio-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col cols="3">Start Date:</b-col>
        <b-col cols="2">
          <b-input v-model="tempStartDate"></b-input>
        </b-col>
        <b-col cols="1">
          <b-btn @click="setStart">Set</b-btn>
        </b-col>
      </b-row>
      <b-row>
        <b-col cols="3">Contract:</b-col>
        <b-col cols="4">
          <b-input v-model="contractAddress" size="42"></b-input>
        </b-col>
        <b-col cols="1">
          <b-btn @click="connectContract">Connect</b-btn>
        </b-col>
      </b-row>
      <b-row>
        <b-col cols="3">
          Gesamt:
        </b-col>
        <b-col cols="3">
          <b-input v-model="totalAmount" placeholder="Gesamt"></b-input>
        </b-col>
      </b-row>
      <b-row>
        <b-col cols="3">
          Datum:
        </b-col>
        <b-col cols="5">
          <b-calendar v-model="dateString"></b-calendar>
          <b-time v-model="timeString" show-seconds></b-time>
        </b-col>
      </b-row>
      <b-row>
        <b-col cols="3">
          Aktueller Anspruch:
        </b-col>
        <b-col cols="3">
          {{ (activatedAmount * totalAmount).toFixed(4) }}
        </b-col>
      </b-row>
      <b-row>
        <b-col cols="3">
          Aktueller Burn
        </b-col>
        <b-col cols="3">
          {{ burnAmount.toFixed(5) }}
        </b-col>
      </b-row>
      <b-row>
        <b-col cols="3">
          Gewünschte Ausschüttung:
        </b-col>
        <b-col cols="3">
          <b-input v-model="wantedAmount"></b-input>
        </b-col>
      </b-row>
      <b-row>
        <b-col cols="3">
          Tokens an Wallet:
        </b-col>
        <b-col cols="3">
          {{ (wantedAmount * (1 - burnAmount)).toFixed(3) }}
        </b-col>
      </b-row>
      <b-row>
        <b-col cols="3">
          Tokens Burned:
        </b-col>
        <b-col cols="3">
          {{ (wantedAmount * burnAmount).toFixed(3) }}
        </b-col>
      </b-row>
      <b-row>
        <b-col cols="3">
          Tokens Übrig:
        </b-col>
        <b-col cols="3">
          {{ ((activatedAmount * totalAmount) - wantedAmount).toFixed(3) }}
        </b-col>
      </b-row>
    </b-container>
  </div>

</template>

<script>
import {ethers} from 'ethers'

export default {
  name: 'DemoApp',
  data() {
    return {
      totalAmount: '',
      dateString: new Date().toISOString().split('T')[0],
      timeString: '00:00:00',
      startDate: new Date(2021, 3, 15),
      tempStartDate: new Date(2021, 3, 15).getTime() / 1000,
      wantedAmount: 0,
      provider: null,
      options: [
        {text: 'Javascript', value: 'javascript'},
        {text: 'Testnet', value: 'testnet'}
      ],
      selectedOption: 'javascript',
      contractAddress: '0x41F5095C0c06784F620e82881a48942Cf1259FB6',
      contract: null
    }
  },
  components: {
  },
  computed: {
    date: {
      get () {
        return new Date(this.dateString + 'T' + this.timeString)
      }
    }
  },
  asyncComputed:{
    activatedAmount: {
      async get() {
        let toReturn = 0;
        console.log('Calculating Amount')
        if(this.selectedOption === 'javascript'){
          return this.calcActivatedAmount(this.startDate, this.date);
        } else if (this.selectedOption === 'testnet'){
          let activated = Number(await this.contract.calcActivatedPercent(this.convertDate(this.startDate), this.convertDate(this.date)));
          toReturn = activated * (10 ** -18);
        }
        return Number(toReturn);
      },
      default: 0
    },
    burnAmount: {
      async get () {
        let toReturn = 0;
        console.log('Calculating Burn')
        if(this.selectedOption === 'javascript'){
          return this.calcBurnAmount(this.startDate, this.date);
        } else if (this.selectedOption === 'testnet'){
          let burn = Number(await this.contract.calcBurnPercent(this.convertDate(this.startDate), this.convertDate(this.date)));
          toReturn = burn * (10 ** -18);
        }
        return Number(toReturn);
      },
      default: 0.8
    }
  },
  methods: {
    calcActivatedAmount(startDate, endDate) {
      let month = 30.5 * 24 * 60 * 60 * 1000;
      let months = Math.floor(Math.abs((endDate - startDate) / month));
      let quarters = Math.floor(months / 3);
      return Math.min((quarters * 0.05), 1)
    },
    calcBurnAmount(startDate, endDate) {
      let day = 24 * 60 * 60 * 1000;
      let days = Math.floor(Math.abs((endDate - startDate) / day));
      let burnAmount = 0.8 - (days * (0.8 / (2 * 365)));
      return Math.max(burnAmount, 0);
    },
    convertDate(date){
      return Math.floor(date.getTime() / 1000);
    },
    connectContract(){
      this.provider = new ethers.providers.EtherscanProvider('rinkeby', process.env.ETHERSCAN_API_KEY);
      let conAbi = [
          "function calcActivatedPercent(uint256 startDate, uint256 endDate) public pure returns (uint256)",
          "function calcBurnPercent(uint256 startDate, uint256 endDate) public pure returns (uint256)"
      ]
      this.contract = new ethers.Contract(this.contractAddress, conAbi, this.provider);
    },
    setStart(){
      this.startDate = new Date(Number(this.tempStartDate * 1000))
    }
  },
  mounted: function() {
    this.connectContract()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
