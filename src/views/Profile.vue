<template>
    <div>
      <h2>My Account</h2>
      <v-form ref="profileForm" v-model="isProfileValid">
        <v-text-field
            v-model="user.firstName"
            label="First Name"
            :rules="[v => !!v || 'First Name is required']"
        />
        <v-text-field
            v-model="user.lastName"
            label="Last Name"
            :rules="[v => !!v || 'Last Name is required']"
        />
        <v-text-field
            v-model="user.email"
            label="Email"
            disabled
        />
        <v-text-field
            v-model="user.password"
            type="password"
            label="New Password"
        />
        <v-card-actions>
          <v-btn color="primary" @click="updateProfile">Save</v-btn>
          <v-btn color="red" @click="logout">Logout</v-btn>
        </v-card-actions>
      </v-form>
    </div>
  </template>
  
  <script>
  import API from "@/services/api";
  
  export default {
    name: "Profile",
    data() {
      return {
        user: { 
            firstName: "",
            lastName: "",
            email: "",
            password: "" 
        },
        isProfileValid: false,
      };
    },
    mounted() {
      this.fetchUser();
    },
    methods: {
        async fetchUser() {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No auth token found");
    }

    const res = await API.get("/user/fetch-user", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    this.user = res.data;
  } catch (err) {
    console.error("Error fetching user:", err);
    alert("Failed to fetch user profile");
  }
},


async updateProfile() {
  if (!this.$refs.profileForm.validate()) return;

  try {
    const payload = { ...this.user };

    if (!payload.password || payload.password.trim() === "") {
      delete payload.password;
    }

    await API.put(`/user/update-user`, payload);
    alert("Profile updated successfully");
  } catch (err) {
    console.error(err);
    alert("Failed to update profile");
  }
},
      logout() {
        localStorage.removeItem("token");
        this.$router.push("/login");
      },
    },
  };
  </script>
  