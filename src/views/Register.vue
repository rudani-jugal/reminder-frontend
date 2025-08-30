<template>
  <v-container class="d-flex justify-center align-center fill-height">
    <v-card elevation="6" class="pa-6" max-width="1000">
      <v-form ref="registerForm" v-model="isRegisterFormValid" @submit.prevent="registerUser">
        <v-card-title class="text-h6 justify-center">
          Create an Account
        </v-card-title>
          <v-card-text>
            <v-text-field
              v-model="firstName"
              label="First Name"
              outlined
              dense
              required
              :rules="[
                v => !!v || 'First name is required',
                v => /^[A-Za-z]+$/.test(v) || 'Only alphabets allowed'
              ]"
            />
            <v-text-field
              v-model="lastName"
              label="Last Name"
              outlined
              dense
              required
              :rules="[
                v => !!v || 'Last name is required',
                v => /^[A-Za-z]+$/.test(v) || 'Only alphabets allowed'
              ]"
            />
            <v-text-field
              v-model="email"
              label="Email"
              type="email"
              outlined
              dense
              required
              :rules="[
                v => !!v || 'Email is required',
                v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || 'Enter a valid email'
              ]"
            />

            <v-text-field
              v-model="password"
              label="Password"
              type="password"
              outlined
              dense
              required
              :rules="[
                v => !!v || 'Password is required',
                v => v.length >= 5 || 'Password must be at least 5 characters'
              ]"
            />
            <div v-if="error" class="red--text text-center mt-2">
            {{ error }}
          </div>
          </v-card-text>


        <v-card-actions class="d-flex flex-column">
          <v-btn color="primary" type="submit" block>Register</v-btn>
          <v-btn text color="secondary" block @click="$router.push('/login')">
            Already have an account? Login
          </v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-container>
</template>

<script>
import API from "@/services/api";

export default {
  name: "RegisterView",
  data() {
    return {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      error: "",
      isRegisterFormValid: false,
    };
  },
  methods: {
    async registerUser() {
      const form = this.$refs.registerForm;
      if (!form.validate()) {
        return;
      }
      try {
        await API.post("/auth/signup", {
          firstName: this.firstName,
          lastName: this.lastName,
          email: this.email,
          password: this.password
        });
        alert("Registration successful! Please login.");
        this.$router.push("/login");
      } catch (err) {
        this.error =
          err.response?.data?.msg || "Registration failed";
      }
    }
  }
};
</script>
