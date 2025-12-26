const UserRepository = require("../repository/user-repository");
const Organization = require("../models/organization");

class UserService {
  async registerAdmin({ name, email, password, organizationName }) {
    const exists = await UserRepository.findByEmail(email);
    if (exists) throw new Error("User already exists");

    const organization = await Organization.create({ name: organizationName });

    const user = await UserRepository.create({
      name,
      email,
      passwordHash: password,
      role: "admin",
      organizationId: organization._id
    });
    
    // console.log(user)
    organization.createdBy = user._id;
    await organization.save();

    return {
      user,
      token: user.genJWT()
    };
  }

  async login({ email, password }) {
    const user = await UserRepository.findByEmail(email);
    if (!user) throw new Error("Invalid credentials");

    const match = await user.comparePassword(password);
    if (!match) throw new Error("Invalid credentials");

    return {
      user,
      token: user.genJWT()
    };
  }

  async createUser({ name, email, password, role, organizationId }) {
    const exists = await UserRepository.findByEmail(email);
    if (exists) throw new Error("User already exists");

    return UserRepository.create({
      name,
      email,
      passwordHash: password,
      role,
      organizationId
    });
  }

  getUsers(organizationId) {
    return UserRepository.findByOrganization(organizationId);
  }

  deleteUser(userId) {
    return UserRepository.deleteById(userId);
  }
}

module.exports = new UserService();
