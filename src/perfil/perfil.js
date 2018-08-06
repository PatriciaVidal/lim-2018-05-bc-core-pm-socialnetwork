const userNameProfile = document.getElementById('user-name-profile');
const userNamePost = document.getElementById('user-name-post');
const logout = document.getElementById('logout');
const btnSave = document.getElementById('btnSave');


// Verificar si tenemos nuestro usuario logueado
window.onload = () => {
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            console.log('Usuario Logueado');
            logout.classList.remove("hiden");
            userNameProfile.innerHTML = `${user.displayName}`;
            userNamePost.innerHTML = `${user.displayName}`;
            console.log(user.uid);
        } else {
            console.log('Sin usuario');
            goToLogin();
        }
    });
}

// evento que permite cerrar sesion
btnLogout.addEventListener('click', () => {
    firebase.auth().signOut().then(function () {
        console.log('Cerró Sesión');
       goToLogin();
        
    }).catch(function (error) {
        console.log('Error al cerrar Sesión');
    });
})



//6. 
//Para ejecutar operaciones de escritura básicas, puedes usar set()
// para guardar datos en una referencia que especifiques y reemplazar 
// los datos existentes en esa ruta de acceso. Por ejemplo, una aplicación 
// social de blogs puede agregar un usuario con set() de la siguiente manera:
function writeUserData(userId, name, email, imageUrl) {
    firebase.database().ref('users/' + userId).set({
      //Valores que se van a crear en la BD
      username: name, 
      email: email,
      profile_picture : imageUrl,
      github: name,
    });
}
// 7. Función para escribir post
//uid: captura uid del usuario
//body : para publicar posts
function writeNewPost(uid, body) {
    // A post entry.
    var postData = {
      uid: uid,
      body: body,
    };
   
    //8. Get a key for a new Post.
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
//10. 
btnSave.addEventListener('click', () => {
    //verificar q usuario esta logeado y guardar en userId
    var userId = firebase.auth().currentUser.uid;
    //llamando a funcion writeNewPost y guarda en variable.
    const newPost = writeNewPost(userId, post.value );
  
    var sectionDiv = document.createElement('div');

    //creando boton actulizar.
    var btnUpdate = document.createElement("input");
    //seteando atributos al botón
    btnUpdate.setAttribute("value", "Update");
    btnUpdate.setAttribute("type", "button");
    //creando boton eliminar
    var btnDelete = document.createElement("input");
    //seteando atributos al botón
    btnDelete.setAttribute("value", "Delete");
    btnDelete.setAttribute("type", "button");
    var contPost = document.createElement('div');
    var textPost = document.createElement('textarea');
    textPost.setAttribute("id", newPost);

    textPost.innerHTML = post.value; // aqui usamos etiqueta POST
    

    //11. evento borrar.
    btnDelete.addEventListener('click', () => {
  
      firebase.database().ref().child('/user-posts/' + userId + '/' + newPost).remove();
      firebase.database().ref().child('posts/' + newPost).remove();
  
        /* aqui usamos la etiqueta POSTS */

      while(posts.firstChild) posts.removeChild(posts.firstChild);
  
      alert('The user is deleted successfully!');
      reload_page();
  
    });
    //12.Evento actualizar
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
    /* aqui usamos la etiqueta POSTS */
  })