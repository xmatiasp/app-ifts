import { Injectable } from '@angular/core';
import { signOut } from '@angular/fire/auth';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail, updateProfile } from '@angular/fire/auth';
import { Firestore } from '@angular/fire/firestore';
import { getFirestore, setDoc, doc, getDoc, addDoc, collection, collectionData, query, deleteDoc } from '@angular/fire/firestore';
import { Storage } from '@angular/fire/storage';
import { getStorage, uploadString, ref, getDownloadURL, deleteObject } from 'firebase/storage';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private auth: Auth, private firestore: Firestore, private storage: Storage) { }

  //============== Crear Usuario ==============
  async register({ email, password}) {
    try {
      const user = await createUserWithEmailAndPassword(
        this.auth,
        email,
        password
      );
      return user;
    } catch (e){
      return null;
    }
  }

  //============== Acceder ==============
  async login({ email, password}) {
    try {
      const user = await signInWithEmailAndPassword(
        this.auth,
        email,
        password
      );
      return user;
    } catch (e){
      return null;
    }
  }
  //============== Cerrar Sesion ==============
  logout() {
    return signOut(this.auth);
  }

  //============== Cambiar Contraseña ==============
  async ressetpassword({email}){
    try {
      const user = await sendPasswordResetEmail(
        this.auth,
        email
      );
      return user;
    } catch (e){
      return null;
    }
  }

  //============== Actualizar Perfil ==============
  updateUser(displayName: string){
    return updateProfile(this.auth.currentUser, { displayName })
  }

  //============== Obtener Usuario ==============
  getUsuario(){
    console.log(this.auth);
    return this.auth.currentUser;
  }

  //============== BASE DE DATOS ==============

  setDocument(path: string, data: any){
    return setDoc(doc(getFirestore(), path), data);
  }
  async getDocument(path: string){
    return (await getDoc(doc(getFirestore(), path))).data();
  }
  addDocument(path: string, data: any){
    return addDoc(collection(getFirestore(), path), data);
  }
  getCollectionData(path: string, collectionQuery?: any){
    const ref = collection(getFirestore(), path);
    return collectionData(query(ref, collectionQuery),{idField: 'id'});
  }
  deleteDocument(path: string){
    return deleteDoc(doc(getFirestore(), path));
  }

  //============== ALMACENAMIENTO ==============
  async uploadImage(path: string, dataUrl: string){
    return uploadString(ref(getStorage(), path), dataUrl, 'data_url').then(()=>{
      return getDownloadURL(ref(getStorage(),path));
    });
  }

  getFilePath(url: string){
    return ref(getStorage(), url).fullPath;
  }

  deleteFile(path: string){
    return deleteObject(ref(getStorage(), path));
  }
}
