import { Inngest } from "inngest";
import connectDb from "./db";
import User from "@/models/User";
import Order from "@/models/Order";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "quickcart-next" });

// inngest function to save user to database
export const saveUser = inngest.createFunction(
  { id: "save-user" },
  { event: "clerk/user.created" },
  async ({ event }) => {
    const { id, first_name, last_name, email_addresses, image_url } =
      event.data;
    const userData = {
      _id: id,
      email: email_addresses[0].email_address,
      name: `${first_name} ${last_name}`,
      imageUrl: image_url,
    };
    await connectDb();
    await User.create(userData);
  }
);

// inngest function to update user in database
export const updateUser = inngest.createFunction(
  { id: "update-user" },
  { event: "clerk/user.updated" },
  async ({ event }) => {
    const { id, first_name, last_name, email_addresses, image_url } =
      event.data;
    const userData = {
      name: `${first_name} ${last_name}`,
      email: email_addresses[0].email_address,
      imageUrl: image_url,
    };
    await connectDb();
    await User.findByIdAndUpdate(id, userData);
  }
);
// inngest function to delete user from database
export const deleteUser = inngest.createFunction(
  { id: "delete-user" },
  { event: "clerk/user.deleted" },
  async ({ event }) => {
    const { id } = event.data;
    await connectDb();
    await User.findByIdAndDelete(id);
  }
);
// inngest function to create user order
export const createUserOrder = inngest.createFunction(
  {
    id: "create-user-order",
    batchEvents: {
      maxSize: 5,
      timeout: "5s",
    },
  },
  { event: "order/created" },
  async ({ events }) => {
    // 🔹 Log the raw incoming batch
    console.log("🔹 Received events:", JSON.stringify(events, null, 2));

    // 🔹 Transform directly
    const orders = events.map((evt) => ({
      userId: evt.data.userId,
      items: evt.data.items,
      amount: evt.data.amount,
      address: evt.data.address,
      date: evt.data.date,
    }));

    console.log("🔹 Orders to insert:", orders);

    await connectDb();
    await Order.insertMany(orders);

    return { success: true, processed: orders.length };
  }
);
