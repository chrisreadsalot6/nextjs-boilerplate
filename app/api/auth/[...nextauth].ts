import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { JWT } from 'next-auth/jwt';

export const authOptions = {
	providers: [
		GoogleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID!,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
		}),
	],
	callbacks: {
		async jwt({ token, account }: { token: JWT; account: any }) {
			if (account) {
				console.log('account', account);
				token.accessToken = account.access_token;
			}
			return token;
		},
		async session({ session, token }: { session: any; token: JWT }) {
			console.log('session', session);
			console.log('token', token);
			session.accessToken = token.accessToken;
			return session;
		},
	},
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
