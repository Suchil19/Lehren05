import {db} from '../firebase/conection.js';
import {addDoc, deleteDoc, getDoc, collection, onSnapshot, doc, getDocs} from 'https://www.gstatic.com/firebasejs/9.6.2/firebase-firestore.js';

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
export const getUser = async (email) => {
  const docRef = doc(db, "users", email);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    console.log("Document data:", docSnap.data());
  } else {
    // doc.data() will be undefined in this case
    console.log("No such document!");
  }
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
 * @param email {string}
 * */
export const deleteUser = (email) => {
    deleteDoc(doc(db, 'users', email));
};

export const userAlreadyExists = (email) => {
    const docRef = doc(db, 'users', email);
    const docSnap = getDoc(docRef);
    console.log(docSnap, !!docSnap.exists());
    return !!docSnap.exists();

}

export const getAllUsers = async (email) => {
    let userExists = false;
    const querySnapshot = await getDocs(collection(db, 'users'));
    querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        if(doc.data().email === email) {
            userExists = true;
        }
    });
    return userExists;
};

