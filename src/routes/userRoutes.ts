import express from 'express';
import { getAll, getOne, createOne, updateOne, deleteOne } from '../utils/crudUtils';
import { signUp } from '../controllers/userController';
import { createUserValidator } from '../utils/vaildation/userValidation';

const router = express.Router();

router.get('/users', getAll('users',()=>{
    console.log("this is working ");
    return true;
}));
router.get('/users/:id', getOne('users'));
router.post('/users/signup',createUserValidator,signUp);
router.put('/users/:id', updateOne('users'));
router.delete('/users/:id', deleteOne('users'));

export default router;