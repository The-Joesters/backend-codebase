import { Router } from 'express';

const rRoute: Router = Router()

rRoute.post('/verifyCode');
rRoute.put('/resetCode');

export default rRoute;