const login = document.getElementById('section-login');
const logout = document.getElementById('logout');
const username = document.getElementById('username');
const email = document.getElementById('email');
const password = document.getElementById('password');
const btnRegister1 = document.getElementById('btnRegister1')
const btnRegister2 = document.getElementById('btnRegister2')
const btnLogin = document.getElementById('btnLogin')
const btnLogout = document.getElementById('btnLogout')
const btnFacebook = document.getElementById('btnFacebook');
const btnGoogle = document.getElementById('btnGoogle');
const register = document.getElementById('register');
const usernameRegister = document.getElementById('username-register');
const emailRegister = document.getElementById('email-register');
const passwordRegister1 = document.getElementById('password-register1');
const passwordRegister2 = document.getElementById('password-register1');
const bd = document.getElementById('bd');
const btnSave = document.getElementById('btnSave');
const post = document.getElementById('post');
const posts = document.getElementById('posts');

window.onload = () => {
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      console.log('Usuario Logueado');
      login.classList.add("hiden");
      logout.classList.remove("hiden");
      username.innerHTML = `Bienvenida ${user.displayName}`;
    } else {
      console.log('Sin usuario');
      login.classList.remove("hiden");
      logout.classList.add("hiden");
    }
  });
}

btnRegister1.addEventListener('click', () => {
  login.classList.add("hiden");
  register.classList.remove("hiden");
})

btnRegister2.addEventListener('click', () => {
  register.classList.add("hiden");
 logout.classList.remove("hiden");
  window.location.assign("content.html");
  firebase.auth().createUserWithEmailAndPassword(emailRegister.value, passwordRegister1.value)
    .then(() => {
      console.log('Usuario Creado');
    })
    .catch(function (error) {
      console.log(error.code, ' : ', error.message);
    });
})

btnLogin.addEventListener('click', () => {
  firebase.auth().signInWithEmailAndPassword(email.value, password.value)
    .then(() => {
      console.log('Verificado')
      login.classList.add("hiden");
      logout.classList.remove("hiden");
    })
    .catch(function (error) {
      console.log('Contraseña Incorrecta')
    });
})

btnLogout.addEventListener('click', () => {
  firebase.auth().signOut().then(function () {
    console.log('Cerró Sesión');
    login.classList.remove("hiden");
    logout.classList.add("hiden");
  }).catch(function (error) {
    console.log('Error al cerrar Sesión');
  });
})

btnFacebook.addEventListener('click', () => {
  login.classList.add("hiden");
  logout.classList.remove("hiden");

  var provider = new firebase.auth.FacebookAuthProvider();
  provider.setCustomParameters({
    'display': 'popup'
  });
  firebase.auth().signInWithPopup(provider)
    .then(function (result) { console.log('Logueado con Fb') })
    .catch(function (error) {
      console.log(error.code);
      console.log(error.message);
      console.log(error.email);
      console.log(error.credential);
    });
  username.innerHTML = "";
  email.innerHTML = "";
})

btnGoogle.addEventListener('click', () => {
  login.classList.add("hiden");
  logout.classList.remove("hiden");
  var provider = new firebase.auth.GoogleAuthProvider();

  //provider.setCustomParameters({
  //  'login_hint': 'user@example.com'
  //});

  firebase.auth().signInWithPopup(provider)
    .then(function (result) { console.log('Login Google') })
    .catch(function (error) {
      console.log(error.code);
      console.log(error.message);
      console.log(error.email);
      console.log(error.credential);
    });

});

/* window.onload = () => {
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      console.log('User is signed in.');
      login.classList.add("hiden");
      bd.classList.remove("hiden");
      posts.classList.remove("hiden");
      logout.classList.remove("hiden");
      username.innerHTML = `Bienvenida ${user.displayName}`;
    } else {
      console.log('No user is signed in.');
      login.classList.remove("hiden");
      logout.classList.add("hiden");
      posts.classList.add("hiden");
      bd.classList.add("hiden")
    }
  });
}

function writeUserData(userId, name, email, imageUrl) {
  firebase.database().ref('users/' + userId).set({
    username: name,
    email: email,
    profile_picture : imageUrl
  });
}

function writeNewPost(uid, body) {
  // A post entry.
  var postData = {
    uid: uid,
    body: body,
  };

  // Get a key for a new Post.
  var newPostKey = firebase.database().ref().child('posts').push().key;

  // Write the new post's data simultaneously in the posts list and the user's post list.
  var updates = {};
  updates['/posts/' + newPostKey] = postData;
  updates['/user-posts/' + uid + '/' + newPostKey] = postData;

  firebase.database().ref().update(updates);
  return newPostKey;
}

btnSave.addEventListener('click', () => {
  var userId = firebase.auth().currentUser.uid;
  const newPost = writeNewPost(userId, post.value );


  var btnUpdate = document.createElement("input");
  btnUpdate.setAttribute("value", "Update");
  btnUpdate.setAttribute("type", "button");
  var btnDelete = document.createElement("input");
  btnDelete.setAttribute("value", "Delete");
  btnDelete.setAttribute("type", "button");
  var contPost = document.createElement('div');
  var textPost = document.createElement('textarea')
  textPost.setAttribute("id", newPost);

  textPost.innerHTML = post.value;

  btnDelete.addEventListener('click', () => {

    firebase.database().ref().child('/user-posts/' + userId + '/' + newPost).remove();
    firebase.database().ref().child('posts/' + newPost).remove();

    while(posts.firstChild) posts.removeChild(posts.firstChild);

    alert('The user is deleted successfully!');
    reload_page();

  });

  btnUpdate.addEventListener('click', () => {
    const newUpdate = document.getElementById(newPost);
    const nuevoPost = {
      body: newUpdate.value,
    };

    var updatesUser = {};
    var updatesPost = {};

    updatesUser['/user-posts/' + userId + '/' + newPost] = nuevoPost;
    updatesPost['/posts/' + newPost ] = nuevoPost;

    firebase.database().ref().update(updatesUser);
    firebase.database().ref().update(updatesPost);
    
  });

  contPost.appendChild(textPost);
  contPost.appendChild(btnUpdate );
  contPost.appendChild(btnDelete);
  posts.appendChild(contPost);
})


//Evento Registrar
btnRegister.addEventListener('click', () => {
  firebase.auth().createUserWithEmailAndPassword(email.value, password.value)
  .then(() => {
    console.log('Usuario Creado');
  })
  .catch(function(error) {
    console.log(error.code ,' : ' , error.message);
  });
})

//Evento Login
btnLogin.addEventListener('click', () => {
  firebase.auth().signInWithEmailAndPassword(email.value, password.value)
  .then (() => {
    console.log('Verificado')
  })
  .catch(function(error) {
    console.log('Contraseña Incorrecta')
  });
})

//Evento Loguear
btnLogout.addEventListener('click', () => {
  firebase.auth().signOut().then(function() {
    console.log('Cerro Sesión');
  }).catch(function(error) {
    console.log('Error al cerrar Sesión');
  });
})

//Logueando con Facebook
btnFacebook.addEventListener('click', () => {
  var provider = new firebase.auth.FacebookAuthProvider();
  provider.setCustomParameters({
    'display' : 'popup'
  });
  firebase.auth().signInWithPopup(provider)
    .then(function(result) { console.log('Logueado con Fb')})
    .catch(function(error) {
      console.log(error.code);
      console.log(error.message);
      console.log(error.email);
      console.log(error.credential);
  });
})

//loguenado con Google
btnGoogle.addEventListener('click',() => {
  var provider = new firebase.auth.GoogleAuthProvider();

  firebase.auth().signInWithPopup(provider)
    .then(function(result) {
      console.log('Login Google');
      var user = result.user;
      writeUserData(user.uid, user.displayName, user.email, user.photoURL);
    })
    .catch(function(error) {
      console.log(error.code);
      console.log(error.message);
      console.log(error.email);
      console.log(error.credential);
  });
});

function reload_page (){
  window.location.reload();
} */