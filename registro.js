import {saveUser, userAlreadyExists, getAllUsers, getUser} from './js/users/utils/userOps.js';
import {User} from './js/users/utils/User.js';

const loggedOutLinks = document.querySelectorAll('.logged-out');
const loggedInLinks = document.querySelectorAll('.logged-in');

const loginCheck = user =>{
  if (user){
    loggedInLinks.forEach(link => link.style.display = 'block');
    loggedOutLinks.forEach(link => link.style.display = 'none');
  } else {
    loggedInLinks.forEach(link => link.style.display = 'none');
    loggedOutLinks.forEach(link => link.style.display = 'block');
  }
}

// Sign Up Event
const signupForm = document.querySelector('#signup-form');
signupForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const email = document.querySelector('#signup-email').value;
    const password = document.querySelector('#signup-password').value;

    auth.createUserWithEmailAndPassword(email, password)
        .then(userCredential => {
            //Clear the form
            signupForm.reset();

            //Close the modal
            $('#signupModal').modal('hide');
            console.log('sing up');
            //sendUserInformation(user);
            console.log(userCredential);
            setTimeout(() => {
                window.location='index.html';
            }, 5000);

        })
});

// Sign In Event
const signinForm = document.querySelector('#login-form');
signinForm.addEventListener('submit', e => {
    e.preventDefault();
    const email = document.querySelector('#login-email').value;
    const password = document.querySelector('#login-password').value;
    auth.
        signInWithEmailAndPassword(email, password)
        .then(userCredential => {
            //Clear the form
            signupForm.reset();

            //Close the modal
            $('#signinModal').modal('hide')
            console.log('sing in');
            console.log(userCredential);
            //lo agregue yoppp
            setTimeout(() => {
                window.location='index.html';
            }, 5000);
        })
});

// Logout

const logout = document.querySelector('#logout');

logout.addEventListener('click', e => {
    e.preventDefault();
    auth.signOut().then(()=>{
        console.log('sign out')
    })
})

// Google login
const googleButton = document.querySelector('#googleLogin')
googleButton.addEventListener('click', e => {
  const provider = new firebase.auth.GoogleAuthProvider();
  auth.signInWithPopup(provider)
  .then(result => {
    console.log('google sign in');
    const user = result.user;
    let exists = false;
    //saveIfUserDontExists(user);
    getAllUsers().then(result => {
        exists = result;
    });
    if(exists) {
        console.warn('User already exists');
    } else {
        getUser(user.email).then(r => console.log(r));
        sendUserInformation(user);
    }
    signupForm.reset();
    $('#signinModal').modal('hide');
    // setTimeout(() => {
    //   window.location='index.html';
    // }, 10000);
  })
  .catch(err => {
    console.log(err)
  })
})

//Facebook Login
//const facebookButton = document.querySelector('#facebookLogin')
//facebookButton.addEventListener('click', e =>{
  //e.preventDefault();
  //const provider = new firebase.auth.FacebookAuthProvider();
  //auth.signInWithPopup(provider)
  //.then(result => {
    //console.log(result);
    //console.log('facebook sign in')
  //})
  //.catch(err => {
    //console.log(err)
  //})
//})


// Posts
// 22 de MARZO 2021 COMENTE LA li Es decir la lista para que no aparezcan los anuncios solo en la seccion de avisos
const postList = document.querySelector('.posts');
const setupPosts = data => {
    if (data.length) {
      let html = '';
      data.forEach(doc => {
        const post = doc.data()
        const li = `
        <!--li class="list-group-item list-group-item-action">
        <h4><i class="fas fa-comment-medical"></i>&nbsp;${post.titulo}</h4>
        <p>${post.descripcion}</p>
        <a href="tel:5583743064"><button type="button" class="btn btn-info">Agenda tu cita ahora</button></a>
        <br>
        <br>
        <h6><i class="far fa-clock"></i>&nbsp;${post.fecha}</h6>
        </li-->
      <br>
      `;
        html += li;
      });
      postList.innerHTML = html;
    } else {
      postList.innerHTML = '<!--p class="text-center"> Registrate en tu tel??fono m??vil para ver las ??ltimas noticias. </p-->';
    }
  }


//Eventos
// listar los datos para los usuarios que estes autenticados

auth.onAuthStateChanged(user => {
  if (user) {
    fs.collection('posts')
      .get()
      .then((snapshot) => {
        setupPosts(snapshot.docs)
        loginCheck(user);
        })
    } else {
      setupPosts([])
      loginCheck(user);
    }
})


// Onclick
function noticias() {
  document.location.href = "./index.html"
}



///// Nuevo script

function observador(){
  firebase.auth().onAuthStateChanged(function(user){
    if (user){
    console.log('existe usuario activo')
    contenido.innerHTML = `
        <div class="container mt-5">
            <div class="alert alert-info" role="alert">
                Confirma tu correo y refresca esta pagina
            </div>
        </div>
    `;
    aparece(user);
    var displayName = user.displayName;
    var email = user.email;

   // console.log('*******');
   // console.log(user.emailVerified)
   // console.log('*******');

    var emailVerified = user.emailVerified;
    var photoURL = user.photoURL;
    var isAnonymous = user.isAnonymous;
    var uid = user.uid;
    var providerData = user.providerData;

  } else {
    console.log('no existe usuario activo')
    contenido.innerHTML = `
        <!--div class="container mt-5">
        <div class="alert alert-warning" role="alert">
          Registrate con tu email y una contrase??a. La contrase??a debera tener
          un minimo de 6 caracteres
        </div>
        </div-->
    `;
  }
  });
}
observador();


function aparece(user){
  var user = user;
  var contenido = document.getElementById('contenido');
  if(user.emailVerified){

  contenido.innerHTML = `
      <div>
          <br>
          <p>Bienvenido.</p>
          <h4 class="alert-heading">${user.email}</h4>
      </div>
  `;
}
  
}

function sendUserInformation(user) {
    //const buttonId = 0;
    const userTypes = {
        'gmail.com': 'Alumno',
        'ipn.mx': 'Profesor'
    };

    const allowDomains = ['ipn.mx', 'gmail.com'];

    const {email} = user;
    const domain = email.split('@')[1];
    const type = allowDomains.includes(domain) ? userTypes[domain] : 'Administrador';
    const userDB = new User(type, email);
    saveUser(userDB);
  // try {
  //   const variable = getAllUsers();
  //   console.log(variable);
  // } catch(e) {console.log(e);}
}

function saveIfUserDontExists(user) {
    const {email} = user;
    const exists = userAlreadyExists(email);
    if(exists) {
        console.warn(`User ${email} already exists`);
    } else {
        sendUserInformation(user);
    }

    try {
      const variable = getAllUsers();
      console.log(variable);
    } catch(e) {console.log(e);}
}
