const User = require("../models/user");

class UserRepository {
  create(data) {
    return User.create(data);
  }

  findByEmail(email) {
    return User.findOne({ email });
  }

  findById(id) {
    return User.findById(id);
  }

  findByOrganization(organizationId) {
    return User.find({ organizationId });
  }

  deleteById(id) {
    return User.findByIdAndDelete(id);
  }

  updateById(id, data) {
    return User.findByIdAndUpdate(id, data, { new: true });
  }
}

module.exports = new UserRepository();
