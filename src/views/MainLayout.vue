<template>
    <v-app>
      <v-navigation-drawer app permanent>
        <v-list dense>
          <v-list-item to="/reminders" router>
            <v-list-item-title>My Reminders</v-list-item-title>
          </v-list-item>
          <v-list-item to="/profile" router>
            <v-list-item-title>My Account</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-navigation-drawer>
  
      <v-main>
        <v-container>
          <router-view />
        </v-container>
      </v-main>
    </v-app>
  </template>
  
  <script>
  export default {
    name: "MainLayout",
  };
  </script>
  