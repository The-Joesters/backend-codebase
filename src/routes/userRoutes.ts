import express from 'express';
import { getAll, getOne, createOne, updateOne, deleteOne } from '../utils/crudUtils';
import { login, signUp } from '../controllers/userController';
import { createUserValidator } from '../utils/vaildation/userValidation';
import { authenticateRefreshToken } from '../controllers/refreshToken';

const router = express.Router();

router.get('/users', getAll('users',()=>{
    console.log("this is working ");
    return true;
}));
router.get('/users/:id', getOne('users'));
router.post('/users/signup', createUserValidator, signUp);
router.post('/users/login', login);
router.post('/users/refresh-token', authenticateRefreshToken);
router.put('/users/:id', updateOne('users'));
router.delete('/users/:id', deleteOne('users'));

export default router;