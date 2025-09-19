import connect from "../config/connect";   // file kết nối MySQL của bạn
import { userRepository } from "../repositories/UserRepositories";

const test = async () => {
  const userRepo = new userRepository(connect);

  console.log("=== Test findAll ===");
  const users = await userRepo.findAll();
  console.log(users);

  console.log("=== Test findByID ===");
  const user = await userRepo.findByID("8a8455fd-8bfd-11f0-a1b9-d8bbc17822af"); 
  console.log(user);

  console.log("=== Test createUser ===");
  const newUser = await userRepo.createUser({
    full_name: "Phong Test",
    email: "phong@example.com",
    password_hash: "123456",
    phone: "0123456789",
    roles: "customer"
  });
  console.log(newUser);

  console.log("=== Test update ===");
  const updatedUser = await userRepo.update(newUser.id_user, {
    full_name: "Phong Updated"
  });
  console.log(updatedUser);

  console.log("=== Test delete ===");
  const deleted = await userRepo.delete(newUser.id_user);
  console.log("Deleted:", deleted);

  process.exit(0);
};

test().catch((err) => {
  console.error(err);
  process.exit(1);
});