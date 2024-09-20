import express from 'express';
import { getAll, getOne, createOne, updateOne, deleteOne } from '../utils/crudUtils';
import { forgotPassword, login, signUp, verifyResetCode } from '../controllers/userController';
import { createUserValidator, loginValidator } from '../utils/vaildation/userValidation';
import { authenticateRefreshToken } from '../controllers/refreshToken';
import { verify } from 'crypto';
import { checkAuth } from '../middlewares/checkAuth';

const router = express.Router();

router.get('/users', getAll('users',()=>{
    console.log("this is working ");
    return true;
}));
router.get('/users/:id', checkAuth ,getOne('users'));
router.post('/users/signup', createUserValidator, signUp);
router.post('/users/login', loginValidator, login);
router.post('/users/refresh-token', authenticateRefreshToken);
router.post('/users/forgot-password', forgotPassword);
router.post('/users/reset-code', verifyResetCode);
router.put('/users/:id', updateOne('users'));
router.delete('/users/:id', deleteOne('users'));

export default router;