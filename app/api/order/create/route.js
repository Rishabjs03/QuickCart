import { getAuth } from "@clerk/nextjs/server";

export async function POST(request) {
  try {
    const { userId } = getAuth(request);
    const { address, items } = await request.json();
    if (!address || items.length === 0) {
    }
  } catch (error) {}
}
