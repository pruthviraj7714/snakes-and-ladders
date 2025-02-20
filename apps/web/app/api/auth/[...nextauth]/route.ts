import NextAuth from "next-auth";
import { authOptions } from "../../../../lib/auth";

const router = NextAuth(authOptions);

export { router as GET, router as POST};