<template>
<div class="container">
  <div class="posts">
    <h1 align="center">2020 Prime Minister Election</h1>
    

    <br>
    <div class="row">
      <div class="col-md-6">
        <h3>Sign Up!!</h3>
        <form v-on:submit="registerVoter">
          <b-form-group id="input-group-2" label="Drivers License" label-for="input-2">
            <b-form-input
              id="input-2"
              v-model="registerData.voterId"
              required
              placeholder="Enter Drivers License"
            ></b-form-input>
            </b-form-group>

            <b-form-group id="input-group-2" label="Election Card ID" label-for="input-2">
            <b-form-input
              id="input-2"
              v-model="registerData.registrarId"
              required
              placeholder="Enter Election Card ID"
            ></b-form-input>
            </b-form-group>

          <b-form-group id="input-group-2" label="First name" label-for="input-2">
            <b-form-input
              id="input-2"
              v-model="registerData.firstName"
              required
              placeholder="Enter First name"
            ></b-form-input>
            </b-form-group>

            <b-form-group id="input-group-2" label="Last name" label-for="input-2">
            <b-form-input
              id="input-2"
              v-model="registerData.lastName"
              required
              placeholder="Enter Last name"
            ></b-form-input>
            </b-form-group>

            <b-form-group id="input-group-2" label="Phone number" label-for="input-2">
            <b-form-input
              id="input-2"
              v-model="registerData.pnumber"
              required
              placeholder="Enter Phone number"
            ></b-form-input>
            </b-form-group>

            <b-form-group id="input-group-2" label="email" label-for="input-2">
            <b-form-input
              id="input-2"
              v-model="registerData.email"
              required
              placeholder="Enter Email"
            ></b-form-input>
            </b-form-group>

          <!-- <div class="row">
            <div class="col-md-6">
              <input type="text" v-model="registerData.voterId" placeholder="Enter Drivers License">
              <input type="text" v-model="registerData.registrarId" placeholder="Enter Registrar ID">
            </div>
            <div class="col-md-6">
              <input type="text" v-model="registerData.firstName" placeholder="Enter first name">
              <input type="text" v-model="registerData.lastName" placeholder="Enter last name">
            </div>
          </div> -->
          <b-button type="submit" variant="success" value="Register">Register</b-button>
          <!-- <input type="submit" variant="success" value="Register"> -->
        </form>
      </div>
      <div class="col-md-5">
        <h3>Login</h3>
          <!--span><b>{{ response }}</b></span><br /-->
          <form v-on:submit="validateVoter">
            <b-form-group id="input-group-2" label="Enter VoterId" label-for="input-2">
              <b-form-input
                id="input-2"
                v-model="loginData.voterId"
                required
                placeholder="Enter VoterId"
              ></b-form-input>
            </b-form-group>
            <b-button type="submit" variant="success" value="Login">Login</b-button>
            <!-- <input type="text" v-model="loginData.voterId" placeholder="Enter VoterId">
            <br>

            <input type="submit" value="Login">
            <br>
            <br> -->
            <span v-if="loginReponse">
              <b>{{ loginReponse.data }}</b>
            </span>
            <br>
          </form>
      </div>
    </div>
    <br>
    
    <span v-if="registerReponse">
      <b>{{ registerReponse.data }}</b>
    </span>
    <br>
    <vue-instant-loading-spinner id='loader' ref="Spinner"></vue-instant-loading-spinner>
  </div>
</div>
</template>

<script>
import PostsService from "@/services/apiService";
import VueInstantLoadingSpinner from "vue-instant-loading-spinner/src/components/VueInstantLoadingSpinner.vue";

export default {
  name: "response",
  data() {
    return {
      loginData: {},
      registerData: {},
      registerReponse: {
        data: ""
      },
      loginReponse: {
        data: ""
      }
    };
  },
  components: {
    VueInstantLoadingSpinner
  },
  methods: {
    async registerVoter() {

      await this.runSpinner();
      const apiResponse = await PostsService.registerVoter(
        this.registerData.voterId,
        this.registerData.registrarId,
        this.registerData.firstName,
        this.registerData.lastName,
        this.registerData.pnumber,
        this.registerData.email
      );

      console.log(apiResponse);
      this.registerReponse = apiResponse;
      console.log(apiResponse);
      await this.hideSpinner();
    },

    async validateVoter() {
      await this.runSpinner();
      
      if (!this.loginData.voterId) {
        console.log("!thislogin");
        let response = 'Please enter a VoterId';
        this.loginReponse.data = response;
        await this.hideSpinner();
      } else {
        var actId = this.loginData.voterId.substring(0,2) + this.loginData.voterId.substring(6,8) + this.loginData.voterId.substring(12,16) + this.loginData.voterId.substring(20,27) 
        const apiResponse = await PostsService.validateVoter(
          actId
        );
        console.log("apiResponse");
        console.log(apiResponse.data);

        if (apiResponse.data.error) {
          // console.log(apiResponse);
          console.log(apiResponse.data.error);
          this.loginReponse = apiResponse.data.error;
        } else {
          this.$router.push({name: "CastBallot", params: apiResponse});
        }

        console.log(apiResponse);
        this.loginReponse = apiResponse;
        // this.$router.push('castBallot')
        await this.hideSpinner();
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
