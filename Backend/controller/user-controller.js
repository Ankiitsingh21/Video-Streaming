const UserService = require("../services/user-service");

class UserController {
  async register(req, res) {
    try {
      const result = await UserService.registerAdmin(req.body);
      res.status(201).json({ success: true, ...result });
    } catch (err) {
      // console.log(err);
      res.status(400).json({ success: false, message: err.message });
    }
  }

  async login(req, res) {
    try {
      const result = await UserService.login(req.body);
      res.status(200).json({ success: true, ...result });
    } catch (err) {
      res.status(401).json({ success: false, message: err.message });
    }
  }

  async createUser(req, res) {
    try {
      const user = await UserService.createUser({
        ...req.body,
        organizationId: req.user.organizationId
      });
      res.status(201).json({ success: true, user });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  }

  async getUsers(req, res) {
    const users = await UserService.getUsers(req.user.organizationId);
    res.json({ success: true, users });
  }

  async deleteUser(req, res) {
    await UserService.deleteUser(req.params.id);
    res.json({ success: true });
  }
}

module.exports = new UserController();
