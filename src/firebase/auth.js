import app from "./config";

import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut
} from "firebase/auth";

const auth = getAuth(app);

export async function cadastrar(email, senha) {
  return await createUserWithEmailAndPassword(auth, email, senha);
}

export async function login(email, senha) {
  return await signInWithEmailAndPassword(auth, email, senha);
}

export async function logout() {
  return await signOut(auth);
}

export default auth;