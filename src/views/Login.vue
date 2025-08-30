<template>
    <v-container class="d-flex justify-center align-center fill-height">
      <v-card elevation="6" class="pa-6" max-width="400">
        <v-form ref="loginForm" v-model="isLoginFormValid" @submit.prevent="login">
        <v-card-title class="text-h5 justify-center">Login</v-card-title>
  
        <v-card-text>
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
          <v-btn color="primary" class="mb-2" block @click="login">
            Login
          </v-btn>
          <v-btn text color="secondary" block @click="goToSignup">
            Don’t have an account? Sign up
          </v-btn>
        </v-card-actions>
      </v-form>
      </v-card>
    </v-container>
  </template>
  
  <script>
  import API from "@/services/api";
  
export default {
  data() {
    return {
      email: "",
      password: "",
      error: "",
      isLoginFormValid: false,
    };
  },
  methods: {
    async login() {
      const form = this.$refs.loginForm;
      if (!form.validate()) {
        return;
      }
      try {
        const res = await API.post("/auth/login", {
          email: this.email,
          password: this.password
        });

        localStorage.setItem("token", res.data.token);

        if (this.$route.path !== "/reminders") {
          this.$router.push("/reminders");
        }
      } catch (err) {
        this.error =
          err.response?.data?.msg || "Incorrect username or password";
      }
    },

    goToSignup() {
      if (this.$route.path !== "/register") {
        this.$router.push("/register");
      }
    },

    goToLogin() {
      if (this.$route.path !== "/login") {
        this.$router.push("/login");
      }
    }
  }
};

  </script>
  