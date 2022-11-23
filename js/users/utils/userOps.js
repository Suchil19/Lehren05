import {db} from '../firebase/conection.js';

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
    const collection = collection(db, "users");
    addDoc(collection, userToSave);
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



