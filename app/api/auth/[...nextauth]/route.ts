import NextAuth, { Account, Session } from "next-auth";
import { JWT } from "next-auth/jwt";
import SpotifyProvider from "next-auth/providers/spotify"

export const authOptions = {
    providers: [
        SpotifyProvider({
            clientId: process.env.SPOTIFY_CLIENT_ID!,
            clientSecret: process.env.SPOTIFY_CLIENT_SECRET!,
            authorization: { params: { scope: "user-top-read" } }
        })
    ],
    callbacks: {
        async jwt({ token, account }: { token: JWT, account: Account | null }) {
            if (account) {
                token.accessToken = account.access_token;
            }

            return token;
        },
        async session({ session, token }: { session: Session, token: JWT }) {
            session.accessToken = token.accessToken;
            return session;
        }
    }
}

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST }