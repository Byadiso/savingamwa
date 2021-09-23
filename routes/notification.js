import  express from 'express';
import  bodyParser from 'body-parser';
import session from 'express-session';
import getNotification from '../controllers/notification';
import latestNotification from '../controllers/notification';
const router = express.Router();

router.get('/notification',getNotification);
router.get('/notification/latest',latestNotification);


    
module.exports = router;

