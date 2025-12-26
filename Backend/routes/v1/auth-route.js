const express = require("express");
const router = express.Router();

const UserController = require('../../controller/user-controller');
const auth = require("../../middleware/auth");
const rbac = require("../../middleware/rbac");


router.post("/register", UserController.register); 
router.post("/login", UserController.login);


router.post(
  "/users",
  auth,
  rbac("admin"),
  UserController.createUser
);

router.get(
  "/users",
  auth,
  rbac("admin"),
  UserController.getUsers
);

router.delete(
  "/users/:id",
  auth,
  rbac("admin"),
  UserController.deleteUser
);

module.exports = router;
