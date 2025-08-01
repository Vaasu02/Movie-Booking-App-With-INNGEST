import { clerkClient } from "@clerk/express";

export const protectAdmin = async (req, res, next) => {
  try {
    const { userId } = req.auth();
    
    if (!userId) {
      return res.status(401).json({ success: false, message: "Not authenticated" });
    }
    
    const user = await clerkClient.users.getUser(userId);
    if (!user || user.privateMetadata.role !== 'admin') {
      return res.status(403).json({ success: false, message: "Not authorized as admin" });
    }
    
    req.user = user;
    next();
  } catch (error) {
    console.error("Authentication error:", error);
    return res.status(401).json({ success: false, message: "Authentication failed" });
  }
}