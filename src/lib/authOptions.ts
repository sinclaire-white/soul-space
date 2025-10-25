import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "./dbConnect";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // checking if email and password are provided
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        // connect to the database
        const { client, collection } = await dbConnect("users");

        try {
          // find the user by email
          const user = await collection.findOne({ email: credentials.email });

          if (!user) {
            throw new Error("No user found with the provided email");
          }

          // compare the provided password with the hashed password
          const isValidPassword = await bcrypt.compare(
            credentials.password, 
            user.hashedPassword
          );

          if (!isValidPassword) {
            throw new Error("Invalid password");
          }

          // return user object without hashedPassword
          return {
            id: user._id.toString(),
            name: user.name,
            username: user.username,
            email: user.email,
            role: user.role || "user",
          };
        } finally {
          // close the database connection
          await client.close();
        }
      }
    })
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt" as const,
  },
};
