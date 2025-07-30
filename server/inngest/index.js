import { Inngest } from "inngest";
import User from "../models/User.js";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "movie-ticket-booking" });

// Inngest Function to save user data to a database
const syncUsercreation = inngest.createFunction(
  { id: 'sync-user-from-clerk' },
  { event: 'clerk/user.created' },
  async ({ event }) => {
    try {
      const { id, first_name, last_name, email_addresses, image_url } = event.data;
      const userData = {
        _id: id,
        email: email_addresses && email_addresses.length > 0 ? email_addresses[0].email_address : "",
        name: `${first_name} ${last_name}`,
        image: image_url
      };
      await User.create(userData);
      return { status: "success", userId: id };
    } catch (error) {
      console.error("Error syncing user from Clerk:", error);
      return { status: "error", message: error.message };
    }
  }
);

const syncUserDeletion = inngest.createFunction(
  { id: 'delete-user-with-clerk' },
  { event: 'clerk/user.deleted' },
  async ({ event }) => {
    try {
      const { id } = event.data;
      await User.findByIdAndDelete(id);
      return { status: "success", userId: id };
    } catch (error) {
      console.error("Error deleting user from Clerk:", error);
      return { status: "error", message: error.message };
    }
  }
);

// Inngest Function to update user data in database
const syncUserUpdation = inngest.createFunction(
  { id: 'update-user-from-clerk' },
  { event: 'clerk/user.updated' },
  async ({ event }) => {
    try {
      const { id, first_name, last_name, email_addresses, image_url } = event.data;
      const userData = {
        _id: id,
        email: email_addresses && email_addresses.length > 0 ? email_addresses[0].email_address : "",
        name: `${first_name} ${last_name}`,
        image: image_url
      };
      await User.findByIdAndUpdate(id, userData, { new: true, upsert: true });
      return { status: "success", userId: id };
    } catch (error) {
      console.error("Error updating user from Clerk:", error);
      return { status: "error", message: error.message };
    }
  }
);
    


// Create an empty array where we'll export future Inngest functions
export const functions = [syncUsercreation,syncUserDeletion,syncUserUpdation];