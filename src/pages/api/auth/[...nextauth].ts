/* eslint-disable no-param-reassign */
import { NextApiHandler } from 'next';
import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { AuthedUser } from '../authorize';

const options: NextAuthOptions = {
  debug: true,
  providers: [
    CredentialsProvider({
      id: 'credentials',
      name: 'credentials',
      credentials: {
        username: {
          label: 'Username',
          type: 'text',
          placeholder: 'john',
        },
        password: { label: 'Password', type: 'password' },
      },
      authorize: async (credentials) => {
        try {
          if (!credentials) throw new Error('Credentials missing.');

          const res = await fetch(`${process.env.NEXTAUTH_URL}/api/authorize`, {
            method: 'POST',
            body: JSON.stringify({
              username: credentials.username,
              password: credentials.password,
            }),
          });

          const user = (await res.json()) as AuthedUser;
          return user;
        } catch (e) {
          // eslint-disable-next-line no-console
          console.error(e);
          throw new Error('Invalid credentials.');
        }
      },
    }),
  ],
  secret: process.env.NEXT_AUTH_SECRET,
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.username = user.username;
        return token;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub;
        session.user.username = token.username as string;
      }
      return session;
    },
  },
  session: { strategy: 'jwt' },
};

const authHandler: NextApiHandler = (req, res) => NextAuth(req, res, options);

export default authHandler;