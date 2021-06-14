<template>
  <div class="home">
    <b-container fluid>
      <b-row>
        <b-col cols="2">
          Gesamt:
        </b-col>
        <b-col cols="3">
          <b-input v-model="totalAmount" placeholder="Gesamt"></b-input>
        </b-col>
      </b-row>
      <b-row>
        <b-col cols="2">
          Datum:
        </b-col>
        <b-col cols="3">
          <datepicker v-model="date" :language="de"></datepicker>
        </b-col>
      </b-row>
      <b-row>
        <b-col cols="2">
          Aktueller Anspruch:
        </b-col>
        <b-col cols="3">
          {{ activatedAmount.toFixed(4) }}
        </b-col>
      </b-row>
      <b-row>
        <b-col cols="2">
          Aktueller Burn
        </b-col>
        <b-col cols="3">
          {{ burnAmount.toFixed(5) }}
        </b-col>
      </b-row>
      <b-row>
        <b-col cols="2">
          Gewünschte Ausschüttung:
        </b-col>
        <b-col cols="3">
          <b-input v-model="wantedAmount"></b-input>
        </b-col>
      </b-row>
      <b-row>
        <b-col cols="2">
          Tokens an Wallet:
        </b-col>
        <b-col cols="3">
          {{ (wantedAmount - (wantedAmount * burnAmount)).toFixed(3) }}
        </b-col>
      </b-row>
      <b-row>
        <b-col cols="2">
          Tokens Burned:
        </b-col>
        <b-col cols="3">
          {{ (wantedAmount * burnAmount).toFixed(3) }}
        </b-col>
      </b-row>
      <b-row>
        <b-col cols="2">
          Tokens Übrig:
        </b-col>
        <b-col cols="3">
          {{ (activatedAmount - wantedAmount).toFixed(3) }}
        </b-col>
      </b-row>
    </b-container>
  </div>

</template>

<script>
import Datepicker from 'vuejs-datepicker'
import {en, de} from 'vuejs-datepicker/dist/locale'

export default {
  name: 'DemoApp',
  data() {
    return {
      totalAmount: '',
      date: new Date(),
      startDate: new Date(2021, 3, 15),
      wantedAmount: 0,
      en: en,
      de: de
    }
  },
  components: {
    Datepicker
  },
  computed: {
    activatedAmount: {
      get() {
        return this.getActivatedAmount(this.startDate, this.date) * this.totalAmount;
      }
    },
    burnAmount: {
      get() {

        return this.getBurnAmount(this.startDate, this.date);
      }
    }
  },
  methods: {
    getActivatedAmount(startDate, endDate) {
      let month = 30.5 * 24 * 60 * 60 * 1000;
      let months = Math.floor(Math.abs((endDate - startDate) / month));
      let quarters = Math.floor(months / 3);
      return Math.min((quarters * 0.05), 1)
    },
    getBurnAmount(startDate, endDate) {
      let day = 24 * 60 * 60 * 1000;
      let days = Math.floor(Math.abs((endDate - startDate) / day));
      let burnAmount = 0.8 - (days * (0.8 / (2 * 365)));
      return Math.max(burnAmount, 0);
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
