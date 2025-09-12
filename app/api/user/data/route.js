import connectDb from "@/config/db";
import User from "@/models/User";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const { userId } = getAuth(request);
    await connectDb();
    if (!userId) {
      return NextResponse.json({
        success: false,
        message: "User not authenticated",
      });
    }
    const userData = await User.findById(userId);
    return NextResponse.json({ success: true, userData });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: error.message,
    });
  }
}
