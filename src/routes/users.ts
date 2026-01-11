import { Router } from 'express';
import * as ctrl from '../controllers/userController';
import { authMiddleware } from '../middleware/auth';
import { validateRegister, validateLogin, validateUserUpdate } from '../middleware/validation';

const router = Router();

router.post('/auth/register', validateRegister, ctrl.register);
router.post('/auth/login', validateLogin, ctrl.login);
router.post('/auth/logout', ctrl.logout);
router.post('/auth/refresh', ctrl.refresh);

router.get('/users', ctrl.listUsers);
router.get('/users/:id', ctrl.getUser);
router.put('/users/:id', authMiddleware, validateUserUpdate, ctrl.updateUser);
router.delete('/users/:id', authMiddleware, ctrl.deleteUser);

export { router as usersRouter };
