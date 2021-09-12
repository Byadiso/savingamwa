import express from 'express';
import userCtrl, { userById, read, update,remove, listUsers,userPhoto, purchaseHistory,listMoneysByUser } from '../controllers/user';
import { requireSignin, isAuth, isAdmin } from '../controllers/auth';
const router = express.Router();



router.get('/v1/user/:userId', requireSignin ,isAuth, read);
router.put('/v1/user/:userId', requireSignin ,isAuth, update);
router.delete('/v1/user/:userId', requireSignin ,isAuth,isAdmin, remove);

// get all users 
router.get('/v1/users/', requireSignin , listUsers);

router.get('/v1/orders/by/user/:userId', requireSignin, isAuth, purchaseHistory);
router.get('/v1/moneys/by/user/:userId', requireSignin, isAuth, listMoneysByUser);

// photo
router.get("/v1/user/photo/:userId", userPhoto);

router.param('userId', userById);




module.exports = router;