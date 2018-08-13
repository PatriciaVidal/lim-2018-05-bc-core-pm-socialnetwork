const selectMode = document.getElementById('select-mode');
const photoUserProfile = document.getElementById('photo-user-profile');
const photoUserPost = document.getElementById('photo-user-post');

const bodyUserPost = document.getElementById('textarea-post-init');

let uid;

let userFromDatabase;

window.onload = () => {
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      uid = user.uid;
      getUserForId(user.uid, (userDatabase) => {
        userFromDatabase = userDatabase;
        userNameProfile.innerHTML = userDatabase.fullName;
        userNamePost.innerHTML = userDatabase.fullName;
        photoUserProfile.style.backgroundImage = "url('" + userDatabase.profilePicture + "')";
        photoUserPost.style.backgroundImage = "url('" + userDatabase.profilePicture + "')";
      });

      let postRef = firebase.database().ref("posts");
      postRef.on('child_added', (snapshot) => {
        let post = snapshot.val();
        if (user.uid === post.uid) {
          myPosts(snapshot.key, post);
        }
      });

      postRef.on('child_changed', (snapshot) => {
        let post = snapshot.val();
        const bodyPostView = document.getElementById('textarea-' + snapshot.key);
        if (bodyPostView != null && uid !== post.uid) {
          bodyPostView.innerHTML = post.body;
        }
      });

      postRef.on('child_removed', (snapshot) => {
        const postView = document.getElementById(snapshot.key);
        if (postView != null) {
          postView.remove();
        }
      });


    } else {
      goToLogin();
    }
  });
}



myPosts = (postKey, post) => {

  const nameUsers = document.createElement('p');
  nameUsers.setAttribute('id', 'userNamePost');
  nameUsers.innerHTML = post.fullName;

  const photoUser = document.createElement('input');
  photoUser.setAttribute('type', 'button');
  photoUser.setAttribute('id', 'photo-user-post');
  photoUser.setAttribute('class', 'user-face');
  photoUser.style.backgroundImage = "url('" + post.photoURL + "')";

  const btnUpdate = document.createElement("input");
  btnUpdate.setAttribute("value", "Editar");
  btnUpdate.setAttribute("type", "button");

  const btnDelete = document.createElement("input");
  btnDelete.setAttribute("value", "Eliminar");
  btnDelete.setAttribute("type", "button");

  const btnLike = document.createElement('button');
  btnLike.style.border = 'none';
  btnLike.innerHTML = `<button value="Me gusta" id="contar" class="button-like"><img id="imgLike" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAALASURBVGhD7Zi7bhNBFIZNgcSl4ioKEC0NHUiIAlHxBJZQZhyMKNKSlAgegFewkuysY88YI6GEgHgGJKCgSqiAUIKEQdyCAHN+c4LQcsbZtbMXS/tJv7LZPZd/Z2cv40pJSUnJZGCVPRBod80oez9Ubt0o9ylU9nOo7Uuj3QP6e93U7x7jcC+Iofw5yn2IXNT4U8utk5bRA704fHy61e5eo+1NavIh1K4/XPYbxc3bKXuY0/+yWO0eoZgFqrX5f15Eyr0f9KybPZw+Gi3dOk4j9ExsMkR0Rd6Gqn2By1SM7lwc7BNit9FTeOAyyRiY13ZDKBpPyn1valeHsC3GxJLdSHwSmDajjHxUNA1+QNKxJKL77gk8sb3toRG7JRXKVcrdYHvDma92D8a7YbOW7cEb2/SDx5hcIH8Z1b7KNv3QpVqWkguie2zTD90wL4TEQgje2KYfugIfpeRCiLyxTT8U9FVMLoDokfyFbfoZ6+WVvl6xTT8UtBpJKozoc2SFbfqhKTQnJRdBdAKzbNPPgmqfpJP4KRXIVeQp9jcRLpVYJEfFmj5bBPrOWbrjf0mFchGNfnPanWF78aCXRigWy0FYJLGt+GDpV4SPOnhYqi0dZVvJCGv2ilQ0Y9XYzmhQARMpmJ2UXWQbo9OYWd1HN/RzsUGKQk/0ZhvjgecvzcU3UqM0hF4jL+Z9BKp9GqsiqeHOyvbQi9vuLEGtcz7dJ5PtGd06x+3SASeRzpXIwPwWgze1cu9kI8mFH71Qk8tng5myp2jUxl470Bv/NWpx2WwJLndOkIm1qKkEWkMNLpcPzenmIRrFx4K5oUIOcrlMvtC3yn568TySjEpCLHI4vRg0Zhq743zBIgaxnFYs+pX+Lnqi3JaMQziGGA4vLmR09t8FEbaxjw9PBoHqKDK+CWGbd08Woe5cgvjfkpKSkiiVym9E/7T2Q9wMrAAAAABJRU5ErkJggg==">
    <label id="contador">0</label></button>`;

  const contPost = document.createElement('div');
  contPost.setAttribute('class', 'bd');
  contPost.setAttribute('id', postKey);

  const textPost = document.createElement('textarea');
  textPost.setAttribute('class', 'textarea-post');
  textPost.setAttribute("id", 'text-area-' + postKey);
  textPost.setAttribute("disabled", 'true');
  textPost.innerHTML = post.body;

/*   const contador = document.getElementById('contar');
  const sumando = document.getElementById('contador');
  let count = 0;
  let contandoAlDarleClick = 0; */
/*   btnLike.addEventListener('click', () => {
    count = contandoAlDarleClick += 1;
    sumando.innerHTML = count;
    postObject.countLike = count;
  }); */

  btnDelete.addEventListener('click', () => {

    let respDelete = confirm('¿Desea eliminar este post?');

    if (respDelete == true) {
      firebase.database().ref().child('/user-posts/' + uid + '/' + postKey).remove();
      firebase.database().ref().child('posts/' + postKey).remove();
    }

  });

  btnUpdate.addEventListener('click', () => {
    const body = document.getElementById('text-area-' + postKey);
    if (btnUpdate.value === 'Editar') {
      body.disabled = false;
      btnUpdate.value = 'Guardar';
    } else {
      const changeChange = {
        body: body.value,
        mode: post.mode,
        uid: post.uid,
        photoURL: post.photoURL,
        fullName: post.fullName
      };

      var updatesUser = {};
      var updatesPost = {};

      updatesUser['/user-posts/' + post.uid + '/' + postKey] = changeChange;
      updatesPost['/posts/' + postKey] = changeChange;

      firebase.database().ref().update(updatesUser);
      firebase.database().ref().update(updatesPost);
      body.disabled = true;
      btnUpdate.value = 'Editar';
    }

  });
  contPost.appendChild(nameUsers);
  contPost.appendChild(photoUser);
  contPost.appendChild(textPost);
  contPost.appendChild(btnLike);
  contPost.appendChild(btnUpdate);
  contPost.appendChild(btnDelete);
  posts.appendChild(contPost);
}


btnToPost.addEventListener('click', () => {;
  if (bodyUserPost.value.length === 0) {
    alert("Creo que no haz escrito algun texto para publicar");
    return;
  }
  createNewPost(uid, bodyUserPost.value, selectMode.value, userFromDatabase);
  bodyUserPost.value = "";
});

btnLogout.addEventListener('click', () => {
  firebase.auth().signOut().then(function () {
    goToLogin();
  }).catch(function (error) {
    console.log('Error al cerrar Sesión');
  });
})
