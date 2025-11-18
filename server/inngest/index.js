import { Inngest } from "inngest";
import prisma from "../configs/prisma.js";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "Project-Managementtttt" });

// Inngest Function to save user data to a database
const syncUserCreation = inngest.createFunction(
    { id: 'sync-user-from-clerk' },
    { event: 'user.created' },
    async ({ event }) => {
  const { data } = event;
  try {
    await prisma.user.create({
      data: {
        id: data.id,
        email: data?.email_addresses[0]?.email_address,
        name: data?.first_name + " " + data?.last_name,
        image: data?.image_url,
      }
    });
    console.log("User saved:", data.id);
  } catch (err) {
    console.error("Prisma error:", err);
  }
}

);

// Inngest Function to delete user data from database
const syncUserDeletion = inngest.createFunction(
    { id: 'sync-user-with-clerk' },
    { event: 'user.deleted' },       // ✅ FIXED
    async ({ event }) => {
        const { data } = event;
        await prisma.user.delete({
            where: { id: data.id }
        });
    }
);

// Inngest Function to update user data in database
const syncUserUpdation = inngest.createFunction(
    { id: 'update-user-from-clerk' },
    { event: 'user.updated' },      // ✅ FIXED
    async ({ event }) => {
        const { data } = event;
        await prisma.user.update({
            where: { id: data.id },
            data: {
                id: data.id,
                email: data?.email_addresses[0]?.email_address,
                name: data?.first_name + " " + data?.last_name,
                image: data?.image_url,
            }
        });
    }
);

// Export functions
export const functions = [
    syncUserCreation,
    syncUserDeletion,
    syncUserUpdation
];
