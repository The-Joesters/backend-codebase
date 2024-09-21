import { OAuth2Client } from 'google-auth-library';
import prisma from '../prisma/prismaClient';
import ApiError from '../middlewares/ApiError';

const oauthClient = new OAuth2Client();

interface GooglePayload {
    email: string;
    name: string;
}

const verifyGoogleIdToken = async (idToken: string): Promise<GooglePayload> => {
    const response = await oauthClient.verifyIdToken({
        idToken,
        audience: [process.env.GOOGLE_CLIENT_ID_ANDROID!],
    });

    const payload = response.getPayload();
    if (!payload) {
        throw new ApiError('Token is invalid', 400);
    }

    const { email, name } = payload;
    if (!email || !name) {
        throw new ApiError('Token payload is missing required fields', 400);
    }

    return { email, name };
};

const findOrCreateUser = async (email: string, name: string) => {
    let user = await prisma.users.findUnique({ where: { email } });

    if (!user) {
        user = await prisma.users.create({
            data: {
                email,
                name,
            },
        });
    }

    return user;
};

export const handleGoogleAuth = async (idToken: string) => {
    try {
        const { email, name } = await verifyGoogleIdToken(idToken);
        const user = await findOrCreateUser(email, name);
        return user.id;
    } catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }
        throw new ApiError('Server error', 500);
    }
};