import { OAuth2Client, TokenPayload } from 'google-auth-library';
import { env } from '../config/env';
import { AppError } from '../middlewares/errorHandler';

let client: OAuth2Client | null = null;

const getClient = (): OAuth2Client => {
  if (!env.GOOGLE_CLIENT_ID) {
    throw new AppError('Google sign-in is not configured on the server', 503);
  }
  if (!client) {
    client = new OAuth2Client(env.GOOGLE_CLIENT_ID);
  }
  return client;
};

export const verifyGoogleIdToken = async (idToken: string): Promise<TokenPayload> => {
  const payload = await getClient()
    .verifyIdToken({
      idToken,
      audience: env.GOOGLE_CLIENT_ID,
    })
    .then((ticket) => ticket.getPayload());

  if (!payload?.email || !payload.sub) {
    throw new AppError('Invalid Google token', 401);
  }

  if (!payload.email_verified) {
    throw new AppError('Google email is not verified', 401);
  }

  return payload;
};
