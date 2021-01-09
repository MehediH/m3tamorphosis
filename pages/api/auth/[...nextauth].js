import NextAuth from "next-auth";
import Providers from "next-auth/providers";

const options = {
  providers: [
    Providers.Spotify({
      clientId: process.env.SPOTIFY_ID,
      clientSecret: process.env.SPOTIFY_SECRET,
      scope: [
        'streaming',
        'user-read-email',
        'user-read-private',
        'user-library-read',
        'user-library-modify',
        'user-read-playback-state',
        'user-modify-playback-state',
      ]
    }),
  ],

  session: {
    maxAge: 30 * 24 * 60 * 60,
  },

  jwt: true,

  callbacks: {
    session: async (session, user) => {
      if(session && user){
        session.user = user;
      }

      return Promise.resolve(session);
    },

    jwt: async (token, user, account, profile, isNewUser) => {
      if(account){
        token.accessToken = account.accessToken;
        token.refreshToken = account.refreshToken;
        token.profile = profile;
      }

      return Promise.resolve(token);
    },
  },
};

export default (req, res) => NextAuth(req, res, options);