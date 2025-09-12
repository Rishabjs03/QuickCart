import { serve } from "inngest/next";
import { inngest } from "@/config/inngest";
import { deleteUser, saveUser, updateUser } from "@/config/inngest";

// Create an API that serves zero functions
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [saveUser, updateUser, deleteUser],
});
