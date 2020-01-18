<template>
  <div class="posts">
    <div class="row">
      <div class="col-md-6">
        <div class="row">
          <label for="one">{{ input.name }}</label>
        </div>
        <div class="row">
          <label for="one">{{ input.voterIDlabel }}</label>
        </div>
        <div class="row">
          <label for="one">{{ input.email }}</label>
        </div>
        <div class="row">
          <label for="one">{{ input.aadhar }}</label>
        </div>
        <div class="row">
          <label for="one">{{ input.phone }}</label>
        </div>
      </div>
      <div class="col-md-6">
        <img :src="getImgUrl()" width="250" height="250">
      </div>
    </div>
    <hr />
    <h1>Cast Ballot</h1>
    <table class="table">
    <tbody>
      <tr>
        <td>
          <input type="radio" id="one" value="BJP" v-model="picked" />
        </td>
        <td>
          <label for="one">Narendra Modi (BJP)</label>
        </td>
        <td>
          <img src="https://imagesevotingapp.s3-ap-southeast-1.amazonaws.com/bjp.png" width="150" height="150">
        </td>
      </tr>
      <tr>
        <td>
          <input type="radio" id="two" value="BSP" v-model="picked" />
        </td>
        <td>
          <label for="two">Mayawati (BSP)</label>
        </td>
        <td>
          <img src="https://imagesevotingapp.s3-ap-southeast-1.amazonaws.com/bsp.png" width="150" height="150">
        </td>
      </tr>
      <tr>
        <td>
          <input type="radio" id="three" value="INC" v-model="picked" />
        </td>
        <td>
          <label for="three">Rahul Gandhi (INC)</label>
        </td>
        <td>
          <img src="https://imagesevotingapp.s3-ap-southeast-1.amazonaws.com/inc.png" width="150" height="150">
        </td>
      </tr>
      <tr>
        <td>
          <input type="radio" id="four" value="NCP" v-model="picked" />
        </td>
        <td>
          <label for="four">Sharad Pawar (NCP)</label>
        </td>
        <td>
          <img src="https://imagesevotingapp.s3-ap-southeast-1.amazonaws.com/ncp.png" width="150" height="150">
        </td>
      </tr>
      <tr>
        <td>
          <input type="radio" id="five" value="NPP" v-model="picked" />
        </td>
        <td>
          <label for="five">Conrad Sangme (NPP)</label>
        </td>
        <td>
          <img src="https://imagesevotingapp.s3-ap-southeast-1.amazonaws.com/npp.png" width="150" height="150">
        </td>
      </tr>
    </tbody>
    </table>
    <span v-if="picked">
      Picked:
      <b>{{ picked }}</b>
    </span>
    <br />
    <br />
    <!--span><b>{{ response }}</b></span><br /-->
    <form v-on:submit="castBallot">
      <!-- <input type="text" value="2sww593dc034wb2twdk91r" v-model="input.electionId"  >
      <br>-->
      <input type="text" v-model="input.voterId" placeholder="Enter VoterId" disabled/>
      <br />
      <input type="submit" value="Cast Vote" />
      <br />
    </form>

    <br />
    <span v-if="response">
      <b>{{ response }}</b>
    </span>
    <br />
    <vue-instant-loading-spinner id="loader" ref="Spinner"></vue-instant-loading-spinner>
  </div>
</template>

<script>
import PostsService from "@/services/apiService";
import VueInstantLoadingSpinner from "vue-instant-loading-spinner/src/components/VueInstantLoadingSpinner.vue";

export default {
  name: "response",
  data() {
    return {
      input: {},
      picked: null,
      sendToPicked: null,
      response: null
    };
  },
  components: {
    VueInstantLoadingSpinner
  },
  created: function() {
    console.log("id printing");
    console.log(this.$route.params.data);
    var userInfo = this.$route.params.data;
    this.input.name = "Name: " + userInfo.firstName + " " + userInfo.lastName
    this.input.voterIDlabel = "Voter ID: " + userInfo.voterId  
    this.input.voterId = userInfo.voterId 
    this.input.img = userInfo.img
    var regData = JSON.parse(localStorage.getItem("registerData"))
    this.input.email = "Email: " + regData.email
    this.input.aadhar = "Aadhar No: " + regData.registrarId
    this.input.phone = "Phone number: " + regData.pnumber

  },
  methods: {
    getImgUrl() {
      return this.input.img.length > 0 ? this.input.img : "https://imagesevotingapp.s3-ap-southeast-1.amazonaws.com/IMG-20190209-WA0007_1549737127299.jpg"
    },
    async castBallot() {
      await this.runSpinner();

      const electionRes = await PostsService.queryWithQueryString("election");

      let electionId = electionRes.data[0].Key;

      console.log("picked: ");
      console.log(this.picked);

      switch(this.picked){
        case('BJP'): this.sendToPicked = 'Democrat'; break;
        case('BSP'): this.sendToPicked = 'Green'; break;
        case('INC'): this.sendToPicked = 'Independent'; break;
        case('NCP'): this.sendToPicked = 'Libertarian'; break;
        case('NPP'): this.sendToPicked = 'Republican'; break;

      }


      console.log("voterId: ");
      console.log(this.input.voterId);
      this.response = null;

      //error checking for making sure to vote for a valid party
      if (this.picked === null) {
        console.log("this.picked === null");

        let response = "You have to pick a party to vote for!";
        this.response = response;
        await this.hideSpinner();
      } else if (this.input.voterId === undefined) {
        console.log("this.voterId === undefined");

        let response = "You have to enter your voterId to cast a vote!";
        this.response = response;
        await this.hideSpinner();
      } else {
        const apiResponse = await PostsService.castBallot(
          electionId,
          this.input.voterId,
          this.sendToPicked
        );

        console.log("apiResponse: &&&&&&&&&&&&&&&&&&&&&&&");
        console.log(apiResponse);

        if (apiResponse.data.error) {
          this.response = apiResponse.data.error;
          await this.hideSpinner();
        } else if (apiResponse.data.message) {
          this.response = `Could not find voter with voterId ${this.input.voterId}
            in the state. Make sure you are entering a valid voterId`;
          await this.hideSpinner();
        } else {
          let response = `Successfully recorded vote for ${this.picked} party 
            for voter with voterId ${apiResponse.data.voterId}. Thanks for 
            doing your part and voting!`;

          this.response = response;

          console.log("cast ballot");
          console.log(this.input);
          await this.hideSpinner();
        }
      }
    },
    async runSpinner() {
      this.$refs.Spinner.show();
    },
    async hideSpinner() {
      this.$refs.Spinner.hide();
    }
  }
};
</script>
