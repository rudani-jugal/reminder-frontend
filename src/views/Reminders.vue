<template>
    <div>
        <v-container>
            <h2 class="mb-4">My Reminders</h2>
            <v-btn color="primary" class="mb-4" @click="openDialog()">New Reminder</v-btn>
  
            <v-data-table
              :headers="headers"
              :items="reminders"
              :items-per-page="5"
              class="elevation-1"
            >
            <template v-slot:[`item.remindAt`]="{ item }">
                {{ isoToLocal(item.remindAt).replace("T", " ") }}
            </template>

            <template slot="item.actions" slot-scope="{ item }">
                <v-icon small class="mr-2" @click="openDialog(item)">mdi-pencil</v-icon>
                <v-icon small color="red" @click="deleteReminder(item._id)">mdi-delete</v-icon>
            </template>

            </v-data-table>
        </v-container>
  
  <v-dialog v-model="dialog" max-width="500px">
  <v-card>
    <v-form ref="reminderForm" v-model="isReminderFormValid">
      <v-card-title>
        <span class="headline">{{ editedItem._id ? 'Edit Reminder' : 'New Reminder' }}</span>
      </v-card-title>

      <v-card-text>
        <v-text-field
          v-model="editedItem.title"
          label="Title"
          required
          :rules="[ v => !!v || 'Title is required']">
        </v-text-field>

        <v-text-field
          v-model="editedItem.description"
          label="Description"
          required
          :rules="[ v => !!v || 'Description is required']">
        </v-text-field>

        <v-text-field
          v-model="editedItem.remindAt"
          label="Date & Time"
          type="datetime-local"
          :min="minDateTime"
          :rules="[ v => !!v || 'Date & Time is required']">
        </v-text-field>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text @click="closeDialog">Cancel</v-btn>
        <v-btn color="primary" @click="submitForm">Save</v-btn>
      </v-card-actions>
    </v-form>
  </v-card>
</v-dialog>

</div>
</template>
  
  <script>
  import API from "@/services/api";
  
  export default {
    name: "Reminders",
    data() {
      return {
        dialog: false,
        reminders: [],
        editedItem: {
          _id: null,
          title: "",
          description: "",
          remindAt: ""
        },
        isReminderFormValid: false,
        headers: [
          { text: "Title", value: "title" },
          { text: "Description", value: "description" },
          { text: "Date & Time", value: "remindAt" },
          { text: "Actions", value: "actions", sortable: false }
        ],
      };
    },
    computed: {
    minDateTime() {
      const now = new Date();
      return now.toISOString().slice(0, 16);
        }
    },
    mounted() {
      this.fetchReminders();
    },
    methods: {
        isoToLocal(isoString) {
      if (!isoString) return "";
      const date = new Date(isoString);

      const offset = date.getTimezoneOffset();
      const localDate = new Date(date.getTime() - offset * 60000);

      return localDate.toISOString().slice(0, 16); // yyyy-MM-ddTHH:mm
    },
    localToIso(localString) {
      if (!localString) return null;
      return new Date(localString).toISOString();
    },
      async fetchReminders() {
        try {
          const res = await API.get("/reminders/fetch-reminders");
          this.reminders = res.data;
        } catch (err) {
          console.error(err);
          alert("Failed to fetch reminders");
        }
      },
    openDialog(item = null) {
      if (item) {
        this.editedItem = { 
          ...item,
          remindAt: this.isoToLocal(item.remindAt)
        };
      } else {
        this.editedItem = { _id: null, title: "", description: "", remindAt: "" };
      }

      this.dialog = true;

      this.$nextTick(() => {
        if (this.$refs.reminderForm) {
          this.$refs.reminderForm.resetValidation();
        }
      });
    },

      closeDialog() {
        this.dialog = false;
        this.$nextTick(() => {
          if (this.$refs.reminderForm) {
            this.$refs.reminderForm.reset();
            this.$refs.reminderForm.resetValidation();
          }
        });
      },
      submitForm() {
        const form = this.$refs.reminderForm;

        if (form.validate()) {
          this.saveReminder();
        } else {
          console.info("Validation failed");
        }
      },
      async saveReminder() {
        try {
          const payload = {
            ...this.editedItem,
            remindAt: this.localToIso(this.editedItem.remindAt)
          };
            
        if (this.editedItem._id) {
          await API.put(`/reminders/update-reminders`, payload);
        } else {
          await API.post('/reminders/create-reminders', payload);
        }

        this.fetchReminders();
        this.closeDialog();
      
      } catch (error) {
        console.error('Error saving reminder:', error);
        alert('Failed to save reminder');
      }
  },
      async deleteReminder(_id) {
        if (confirm("Are you sure you want to delete this reminder?")) {
          try {
            await API.delete(`/reminders/delete-reminders/${_id}`);
            this.fetchReminders();
          } catch (err) {
            console.error(err);
            alert("Failed to delete reminder");
          }
        }
      },
      logout() {
        localStorage.removeItem("token");
        this.$router.push("/login");
      }
    }
  };
  </script>
  