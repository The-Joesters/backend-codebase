import request from 'supertest';
import { app } from '../app'; // Ensure this is the correct path to your Express app
import prisma from '../prisma/prismaClient';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';


jest.setTimeout(10000); // Increase timeout to 10 seconds for all tests

beforeEach(async () => {
    // Clear the users table
    await prisma.article_ratings.deleteMany({});
    await prisma.article_reading_progress.deleteMany({});
    await prisma.book_progress.deleteMany({});
    await prisma.book_ratings.deleteMany({});
    await prisma.book_section_progress.deleteMany({});
    await prisma.bookmarked_books.deleteMany({});
    await prisma.inventory.deleteMany({});
    await prisma.subscriptions.deleteMany({});
    await prisma.subscriptions.deleteMany({});
    await prisma.user_badges.deleteMany({});
    await prisma.user_preferred_categories.deleteMany({});
    await prisma.bookmarked_articles.deleteMany({});
    await prisma.users.deleteMany({});
});

describe('signUp', () => {

    it('should create a new user and return a JWT token', async () => {
        const newUser = {  name: 'Test User', email: 'test@example.com', password: 'password123!', confirmPassword: 'password123!' };

        const response = await request(app)
            .post('/api/users/signup')
            .send({
                name: 'Test User',
                email: 'test@example.com',
                password: 'password123!',
                confirmPassword: 'password123!'
            });

        const user = await prisma.users.findUnique({ where: { email: response.body.newUser.email } });

        expect(response.status).toBe(201);
        expect(response.body.newUser.name).toEqual(newUser.name);
        expect(response.body.newUser.email).toEqual(newUser.email);
        expect(response.body.token).toBeDefined();
        expect(user).toBeTruthy();
        expect(user!.password).toBeTruthy();
        expect(await bcrypt.compare(newUser.password, user!.password!)).toEqual(true);
    });

    //NAME VALIDATION
    it('should handle missing Username', async () => {
        const response = await request(app)
            .post('/api/users/signup')
            .send({
                email: 'test@example.com',
                password: 'password123!',
                confirmPassword: 'password123!'
            });

        expect(response.status).toBe(400);
        expect(response.body.errors[0].msg).toBe('Username is required');
    });

    it('should handle short Username', async () => {
        const response = await request(app)
            .post('/api/users/signup')
            .send({
                name: 'T',
                email: 'test@example.com',
                password: 'password123!',
                confirmPassword: 'password123!'
            });

        expect(response.status).toBe(400);
        expect(response.body.errors[0].msg).toBe('name length must be between 2 and 50 characters');
    });

    it('should handle long Username', async () => {
        const response = await request(app)
            .post('/api/users/signup')
            .send({
                name: 'ThisIsAVeryLongUsernameThatExceedsTheMaximumAllowedLengthAndCausesAnError',
                email: 'test@example.com',
                password: 'password123!',
                confirmPassword: 'password123!'
            });

        expect(response.status).toBe(400);
        expect(response.body.errors[0].msg).toBe('name length must be between 2 and 50 characters');
    });

    //EMAIL VALIDATION
    it('should handle missing email', async () => {
        const response = await request(app)
            .post('/api/users/signup')
            .send({
                name: 'Test User',
                password: 'password123!',
                confirmPassword: 'password123!'
            })

        expect(response.status).toBe(400);
        expect(response.body.errors[0].msg).toBe('email is required');
    });

    it('should handle invalid email', async () => {
        const response = await request(app)
            .post('/api/users/signup')
            .send({
                name: 'Test User',
                email: 'invalid-email',
                password: 'password123!',
                confirmPassword: 'password123!'
            });

        expect(response.status).toBe(400);
        expect(response.body.errors[0].msg).toBe('invalid email');
    });

    it('should handle user already exists', async () => {
        const response1 = await request(app)
            .post('/api/users/signup')
            .send({
                name: 'Test User',
                email: 'test@example.com',
                password: 'password123!',
                confirmPassword: 'password123!'
            });

        const response2 = await request(app)
            .post('/api/users/signup')
            .send({
                name: 'Test User',
                email: 'test@example.com',
                password: 'password123!',
                confirmPassword: 'password123!'
            });

        expect(response2.status).toBe(400);
        expect(response2.body.errors[0].msg).toBe('User already exists');
    });

    //PASSWORD VAILDATION
    it('should check if the password is missing', async () => {
        const response = await request(app)
            .post('/api/users/signup')
            .send({
                name: 'Test User',
                email: 'test@example.com',
                confirmPassword: 'password123!'
            });
        expect(response.status).toBe(400);
        expect(response.body.errors[0].msg).toBe('password is required');
    })

    it('should check password length', async () => {
        const response = await request(app)
            .post('/api/users/signup')
            .send({
                name: 'Test User',
                email: 'test@example.com',
                password: 'pas',
                confirmPassword: 'pas'
            });

        expect(response.status).toBe(400);
        expect(response.body.errors[0].msg).toBe('Password must be at least 6 characters long');
    })

    it('should check if password has no digits', async () => {
        const response = await request(app)
            .post('/api/users/signup')
            .send({
                name: 'Test User',
                email: 'test@example.com',
                password: 'password',
                confirmPassword: 'password'
            });

        expect(response.status).toBe(400);
        expect(response.body.errors[0].msg).toBe('Password must contain at least one digit');
    })

    it('should check if password has no special characters', async () => {
        const response = await request(app)
            .post('/api/users/signup')
            .send({
                name: 'Test User',
                email: 'test@example.com',
                password: 'password123',
                confirmPassword: 'password123'
            });

        expect(response.status).toBe(400);
        expect(response.body.errors[0].msg).toBe('Password must contain at least one special character');
    });

    //CONFIRM PASSWORD VALIDATION
    it('should check if the confirmPassword is missing', async () => {
        const response = await request(app)
            .post('/api/users/signup')
            .send({
                name: 'Test User',
                email: 'test@example.com',
                password: 'password123!'
            });
        expect(response.status).toBe(400);
        expect(response.body.errors[0].msg).toBe('please confirm your password');
    })

    it('should check if confimPassword matches password', async () => {
        const response = await request(app)
            .post('/api/users/signup')
            .send({
                name: 'Test User',
                email: 'test@example.com',
                password: 'password123!',
                confirmPassword: 'differentpassword'
            });
            expect(response.status).toBe(400);
            expect(response.body.errors[0].msg).toBe('passwords don\'t match');
    })
});

describe('logIn', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    

    it('should authenticate the user and return an access and refresh token', async () => {
        const existingUser = {
            name: 'Test User',
            email: 'test@example.com',
            password: 'password123!',
            confirmPassword: 'password123!'
        };
        const response1 = await request(app)
            .post('/api/users/signup')
            .send({
                name: 'Test User',
                email: 'test@example.com',
                password: 'password123!',
                confirmPassword: 'password123!'
            });

        const response2 = await request(app)
            .post('/api/users/login')
            .send({
                email: 'test@example.com',
                password: "password123!"
            });
        const user = await prisma.users.findUnique({ where: { email: response1.body.newUser.email } });

        expect(response2.status).toBe(201);
        expect(response2.body.accessToken).toBeTruthy();
        expect(response2.body.refreshToken).toBeTruthy();
        expect(prisma.users.findUnique({ where: { email: 'test@example.com' } })).toBeTruthy();
        expect(await bcrypt.compare(existingUser.password, user!.password!)).toEqual(true);
    });

    //Email VALIDATION
    it('should check if email doesn\'t exist ', async () => {
        const existingUser = { name: 'Test User', email: 'test@example.com', password: 'hashedPassword' };

        const response1 = await request(app)
        .post('/api/users/signup')
        .send({
            name: 'Test User',
            email: 'test@example.com',
            password: 'password123!',
            confirmPassword: 'password123!'
        });
        const response = await request(app)
            .post('/api/users/login')
            .send({
                email: 'nonexistent@example.com',
                password: 'password123!'
            });

        expect(response.status).toBe(401);
        expect(response.body.message).toBe('Invalid email or password');
    })

    it('should check if email is missing', async () => {
        const response = await request(app)
            .post('/api/users/login')
            .send({
                password: "password123!"
            });
        expect(response.status).toBe(400);
        expect(response.body.errors[0].msg).toBe('email is missing');
    })

    it('should handle invalid email', async () => {
        const response = await request(app)
            .post('/api/users/login')
            .send({
                email: 'invalid-email',
                password: 'password123!',
            });

        expect(response.status).toBe(400);
        expect(response.body.errors[0].msg).toBe('invalid email');
    });

    //PASSWORD VALIDATION
    it('should check if the password is missing', async () => {
        const response = await request(app)
            .post('/api/users/login')
            .send({
                email: 'test@example.com',
            });
        expect(response.status).toBe(400);
        expect(response.body.errors[0].msg).toBe('password is missing');
    })

    it('should check password length', async () => {
        const response = await request(app)
            .post('/api/users/login')
            .send({
                email: 'test@example.com',
                password: 'pas',
            });
        
        expect(response.status).toBe(400);
        expect(response.body.errors[0].msg).toBe('Password must be at least 6 characters long');
    })
});


describe('forgotPassword', () => {

    it('should check if email does exist', async () => {
        const response1 = await request(app)
        .post('/api/users/signup')
        .send({
            name: 'Test User',
            email: 'test@example.com',
            password: 'password123!',
            confirmPassword: 'password123!'
        });
        const response2 = await request(app)
            .post('/api/users/forgot-password')
            .send({
                email: 'test@example.com'
            })
        expect(response2.statusCode).toBe(200);
        expect(response2.body.message).toBe('Reset code sent successfully');
    })

    it('should handle if email dosn\'t exist', async () => {
        const response1 = await request(app)
            .post('/api/users/signup')
            .send({
                name: 'Test User',
                email: 'test@example.com',
                password: 'password123!',
                confirmPassword: 'password123!'
            })
        const response2 = await request(app)
            .post('/api/users/forgot-password')
            .send({
                email: 'nonexistent@example.com'
            });
        expect(response2.statusCode).toBe(404);
        expect(response2.body.message).toBe('User not found');
    })
})

describe('resetCode', () => {
    it('should check if the reset code is sent successfully', async () => {
        const resetCode = '1234';
        const response1 = await request(app)
            .post('/api/users/signup')
            .send({
                name: 'Test User',
                email: 'test@example.com',
                password: 'password123!',
                confirmPassword: 'password123!',
            });
            const response2 = await request(app)
            .post('/api/users/forgot-password')
            .send({
                email: 'test@example.com'
            })
        const response3 = await request(app)
            .post('/api/users/reset-code')
            .send({
                email: 'test@example.com',
                resetCode: resetCode
            })
        expect(response2.statusCode).toBe(200);
        expect(response2.body.message).toBe('Reset code sent successfully');
    })
})
