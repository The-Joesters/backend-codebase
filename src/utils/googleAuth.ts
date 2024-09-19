import { OAuth2Client } from 'google-auth-library';
import prisma from '../prisma/prismaClient';
import ApiError from '../middlewares/ApiError';

const oauthClient = new OAuth2Client();

export const verifyGoogleIdToken = async (idToken: string) => {
    const oauthClient = new OAuth2Client();

    try {
        const response = await oauthClient.verifyIdToken({
            idToken,
            audience: [
                process.env.GOOGLE_CLIENT_ID_ANDROID!
            ],
        });
        const payload = response.getPayload();

        if (payload) {
            const { email, name } = payload;

            return await prisma.users.create({
                data: {
                    email: email!,
                    name: name!
                }
            });
        } else {
            return new ApiError('token is invalid', 400);
        }
    } catch (e) {
        return new ApiError('server error', 500);
    }
}