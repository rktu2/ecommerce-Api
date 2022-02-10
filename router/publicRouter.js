const express = require('express');
const router = express.Router();
 const UserController = require('../controllers/UserController') ;
 const CategoryController = require('../controllers/CategoryController');
 const ProductController = require('../controllers/ProductController');
 const OrderController = require('../controllers/OrderController');


 router.get('/get/user' , UserController.getuser);
 router.post('/users/register', UserController.RegisterUser);
 router.get('/get/users', UserController.getUser);
 router.get('/get/users/:id' , UserController.getSingleUser);
 router.post('/login-user' , UserController.loginUser);
 
 router.get('/count/users' , UserController.UserList);
 router.delete('/delete/user/:id' , UserController.removeuser);
 router.post('/create/category' , CategoryController.AddCategory);
 router.get('/get/category' , CategoryController.getcategory);
 router.delete('/delete/category/:id', CategoryController.deletecategory);
 router.put('/update/category/:id' , CategoryController.updatecategory);
 router.get('/get/category/:id' , CategoryController.singlecategory);
 router.post('/create/product' , ProductController.createproduct);
 router.get('/get/product' , ProductController.getproduct);
 router.get('/get/product/:id' , ProductController.singleproduct)
router.put('/update/product/:id' , ProductController.updateproduct);
router.get('/delete/product/:id' , ProductController.deleteproduct);
router.get('/count/product' ,ProductController.countproduct );
router.get('/featured/product/:count' , ProductController.featuredproduct);
router.post('/create/order' , OrderController.createOrder);
router.get('/get/order/:id', OrderController.listoforder);
router.put('/update/status/:id' , OrderController.updatestatus);
router.delete('/order/deleted/:id' , OrderController.orderdeleted);
router.get('/get/totalsales' , OrderController.totalsales);
router.get('/get/userorders' , OrderController.userorders);
module.exports = router;