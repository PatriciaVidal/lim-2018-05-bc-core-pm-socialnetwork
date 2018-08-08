const userNameProfile = document.getElementById('user-name-profile');
const userNamePost = document.getElementById('user-name-post');
const logout = document.getElementById('logout');
const btnToPost = document.getElementById('btnSave');
const postState = document.getElementById('post-state');

const bd = document.getElementById("bd");
const post = document.getElementById('post');
const posts = document.getElementById('posts');


goToHome = () => {
  window.location.assign("home/home.html");
}

goToLogin = () => {
  window.location.assign("../index.html");
};

updateOrCreateUser = (user) => {
  firebase.database().ref('users/' + user.uid).set(
    {
      //Valores que se van a crear en la BD
      fullname: user.displayName,
      email: user.email,
      profile_picture: user.photoURL
    },

    (error) => {
      if (error) {
        console.log(error);
        console.log("error al guardar data");
      } else {
        console.log("data guardada");
        goToHome();
      }
    }
  );
}

writeNewPost = (uid, body) => {

  var postData = {
    uid: uid, //  ESTO ES EL ID DE USUARIO
    body: body, // ESTO ES EL CONTENIDO DEL TEXTAREA
  };

  //8. Get a key for a new Post.
  // AQUI CREAMOS UN NUEVO KEY PARA CADA POSTS DENTRO DE POSTS(esto en database)
  var newPostKey = firebase.database().ref().child('posts').push().key;

  //9. Write the new post's data simultaneously in the posts list and the user's post list.
  //updates : objeto vacio
  var updates = {};
  //instancia creadas.
  //postData: valor del text area
  //posts: se crea por cada usuario un post.
  //newPostKey: cada vez que se crea un post se crea un key.
  updates['/posts/' + newPostKey] = postData;
  updates['/user-posts/' + uid + '/' + newPostKey] = postData;

  firebase.database().ref().update(updates);
  return newPostKey;
}