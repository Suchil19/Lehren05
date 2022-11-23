import {db} from '../firebase/conection.js';
import {addDoc, deleteDoc, getDoc, collection, onSnapshot, doc} from 'https://www.gstatic.com/firebasejs/9.6.2/firebase-firestore.js';

console.log(fs);
/**
 * @description Funcion que me ayudara a guardar objetos de tipo usuario dentro de la coleccion usuarios
 * @param type {string}
 * @param email {string}
 * */
 export const saveUser = (user) => {
    const userToSave = {
        email: user.email,
        type: user.type
    };
    const usersCollection = collection(db, 'users');
    addDoc(usersCollection, userToSave).then(response => {
        console.log('Usuario registrador');
    }).catch(error => {
        console.log(error);
    });
};

/**
 * @description Funcion que me ayudara a obtener la coleccion de usuarios
 * @param callback {funtion}
 * */
export const getUsers = (callback) => {
    //const tasksCollection = collection(db, 'tasks').orderBy("title", "asc");
    const usersCollection = collection(db, 'users');

    onSnapshot(usersCollection, callback);
};

export const getUserByEmail = (email) => {
    //const tasksCollection = collection(db, 'tasks').orderBy("title", "asc");
    const usersCollection = collection(db, 'users');
    onSnapshot(usersCollection, callback);
    const user = usersCollection.find(user => user.email === email);
    if(user) {
        saveUser(user);
    } else {
        console.error('El usuario no existe se tiene que registrar');
    }
};

/**
 * @description Funcion que me ayudara a eliminar un usuario de la coleccion
 * @param id {string}
 * */
export const deleteUser = (user) => {
    deleteDoc(doc(db, 'users', user.email));
};

export const userAlreadyExists = async (email) => {
    const docRef = doc(db, 'users', email);
    const docSnap = await getDoc(docRef);
    console.log(docSnap, !!docSnap.exists());
    return !!docSnap.exists();
}

