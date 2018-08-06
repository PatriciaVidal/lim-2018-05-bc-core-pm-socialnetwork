const login = document.getElementById('login');
const sectionLogin = document.getElementById('section-login');
const logout = document.getElementById('logout');
const username = document.getElementById('username');
const email = document.getElementById('email');
const password = document.getElementById('password');
const btnRegister = document.getElementById('btnRegister');
const btnLogin = document.getElementById('btnLogin');
const btnLogout = document.getElementById('btnLogout');
const btnFacebook = document.getElementById('btnFacebook');
const btnGoogle = document.getElementById('btnGoogle');
const register = document.getElementById('register');
const sectionRegister = document.getElementById('section-register');
const nameRegister = document.getElementById('name-register');
const lastName = document.getElementById('lastname-register');
const emailRegister = document.getElementById('email-register');
const passwordRegister1 = document.getElementById('password-register1');
const passwordRegister2 = document.getElementById('password-register2');
const registerTerminos = document.getElementById('register-terminos');
const registerUser = document.getElementById('btn-register-user');
const bd = document.getElementById('bd');
const btnSave = document.getElementById('btnSave');
const post = document.getElementById('post');
const posts = document.getElementById('posts');

// Verificar si tenemos nuestro usuario logueado
window.onload = () => {
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      console.log('Usuario Logueado');
      logout.classList.remove("hiden");
      window.location.assign("home/home.html");
      username.innerHTML = `Bienvenid@ ${user.displayName}`;
      console.log(user.uid);
    } else {
      console.log('Sin usuario');
      login.classList.remove("hiden");
      logout.classList.add("hiden");
    }
  });
}

btnRegister.addEventListener('click', () => {
  login.classList.add("hiden");
  register.classList.remove("hiden");
})

// Evento que registra a un nuevo usuario
registerUser.addEventListener('click', () => {

  firebase.auth().createUserWithEmailAndPassword(emailRegister.value, passwordRegister1.value)
    .then(() => {
      var user = firebase.auth().currentUser; //accede al usuario que se registro

      console.log(user);
      logout.classList.remove("hiden");
      //console.log(data);
      window.location.assign("home/home.html");

    })
    .catch(function (error) {
      console.log(error.code, ' : ', error.message);
      login.classList.add("hiden");
      register.classList.remove("hiden");
    });
})

// Evento que permite entrar a la red social usando correo y contraseña
btnLogin.addEventListener('click', () => {
  firebase.auth().signInWithEmailAndPassword(email.value, password.value)
    .then(() => {
      console.log('Verificado')

      logout.classList.remove("hiden");
      window.location.assign("home/home.html");
    })
    .catch(function (error) {
      console.log('Contraseña Incorrecta')
    });
})

// evento que permite cerrar sesion
btnLogout.addEventListener('click', () => {
  firebase.auth().signOut().then(function () {
    console.log('Cerró Sesión');

    logout.classList.add("hiden");
    window.location.assign("home/home.html");
  }).catch(function (error) {
    console.log('Error al cerrar Sesión');
  });
})

// evento que permite iniciar sesion con una cuenta de Facebook
btnFacebook.addEventListener('click', () => {

  logout.classList.remove("hiden");
  window.location.assign("home/home.html");
  var provider = new firebase.auth.FacebookAuthProvider();
  provider.setCustomParameters({
    'display': 'popup'
  });
  firebase.auth().signInWithPopup(provider)
    .then(function (result) {
      console.log('Logueado con Fb')
      //window.location.assign("home/home.html");
    })
    .catch(function (error) {
      console.log(error.code);
      console.log(error.message);
      console.log(error.email);
      console.log(error.credential);
    });
  username.innerHTML = "";
  email.innerHTML = "";
})

// evento que permite iniciar sesion con una cuenta de google
btnGoogle.addEventListener('click', () => {

  logout.classList.remove("hiden");
  window.location.assign("home/home.html");
  var provider = new firebase.auth.GoogleAuthProvider();

  firebase.auth().signInWithPopup(provider)
    .then(function (result) {
      console.log('Login Google');
      //window.location.assign("home/home.html");
    })
    .catch(function (error) {
      console.log(error.code);
      console.log(error.message);
      console.log(error.email);
      console.log(error.credential);
    });

});








function writeUserData(userId, name, email, imageUrl) {
  console.log('mostrar ')
  firebase.database().ref('users/' + userId).set({
    name: name,
    email: email,
    profile_picture: imageUrl
  });
}


//Función escribir nuevo Post
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

//Boton Guardar
btnSave.addEventListener('click', () => {
  var userId = firebase.auth().currentUser.uid;
  const newPost = writeNewPost(userId, post.value);

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
  //Boton eliminar
  btnDelete.addEventListener('click', () => {

    firebase.database().ref().child('/user-posts/' + userId + '/' + newPost).remove();
    firebase.database().ref().child('posts/' + newPost).remove();

    while (posts.firstChild) posts.removeChild(posts.firstChild);

    alert('The user is deleted successfully!');
    reload_page();

  });
  //boton actualizar
  btnUpdate.addEventListener('click', () => {
    const newUpdate = document.getElementById(newPost);
    const nuevoPost = {
      body: newUpdate.value,
    };

    var updatesUser = {};
    var updatesPost = {};

    updatesUser['/user-posts/' + userId + '/' + newPost] = nuevoPost;
    updatesPost['/posts/' + newPost] = nuevoPost;

    firebase.database().ref().update(updatesUser);
    firebase.database().ref().update(updatesPost);

  });

  contPost.appendChild(textPost);
  contPost.appendChild(btnUpdate);
  contPost.appendChild(btnDelete);
  posts.appendChild(contPost);
})

//LOGIN validación correo 
document.getElementById('email').addEventListener('input',() => {
  campo = event.target;
  valido = document.getElementById('emailOK');
      
  emailRegex = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i;

  if (emailRegex.test(campo.value)) {
    valido.innerText = "Válido";
  } else {
    valido.innerText = "Por favor escribe correctamente tu correo";
  }
});


//REGISTER validación correo 
document.getElementById('email-register').addEventListener('input',() => {
  campo = event.target;
  valido = document.getElementById('emailOK2');
      
  emailRegex = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i;

  if (emailRegex.test(campo.value)) {
    valido.innerText = "Válido";
  } else {
    valido.innerText = "Por favor escribe correctamente tu correo";
  }
});


//LOGIN validación contraseña
document.getElementById('password').addEventListener('input', () => {
  campo = event.target;
  valido = document.getElementById('passwordOK');
      
  emailRegex = /(?!^[0-9]*$)(?!^[a-zA-Z]*$)^([a-zA-Z0-9]{8,10})$/i;

  if (emailRegex.test(campo.value)) {
    valido.innerText = "Contraseña segura";
  } else {
    valido.innerText = "Mínimo 8 caracteres entre números y letras";
  }
});

//REGISTER validación contraseña
document.getElementById('password-register1').addEventListener('input', () => {
  campo = event.target;
  valido = document.getElementById('passwordOK2');
      
  emailRegex = /(?!^[0-9]*$)(?!^[a-zA-Z]*$)^([a-zA-Z0-9]{8,10})$/i;

  if (emailRegex.test(campo.value)) {
    valido.innerText = "Contraseña segura";
  } else {
    valido.innerText = "Mínimo 8 caracteres entre números y letras";
  }
});

//Checkbox 
//if(document.getElementById("myCheck").checked === true){
  const checkbox = document.getElementById('register-terminos');
  checkbox.addEventListener("change", validaCheckbox, false);
    valido = document.getElementById("checkboxOK");
  function validaCheckbox(){
    const checked = checkbox.checked;
    if(checked){
      valido.innerText ='checkbox está seleccionado'; 
    }
  }


