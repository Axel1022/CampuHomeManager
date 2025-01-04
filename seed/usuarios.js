import { bcrypt } from "bcrypt";
const usuarios = [
  {
    nombre: "Alexander Campusano",
    email: "campusanogaryp14@gmail.com",
    password: bcrypt.hashSync("campusanogaryp14@gmail.com", 10),
    token: null,
    confirmado: true,
  },
];

export default usuarios;
