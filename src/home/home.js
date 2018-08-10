const selectMode = document.getElementById('select-mode');

const photoUserProfile = document.getElementById('photo-user-profile');
const photoUserPost = document.getElementById('photo-user-post');

let newPostObject = {};


window.onload = () => {

    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            newPostObject.uid = firebase.auth().currentUser.uid;

            getUserForId(user.uid, (userDatabase) => {
                console.log(userDatabase);
                userNameProfile.innerHTML = userDatabase.fullName;
                userNamePost.innerHTML = userDatabase.fullName;
                photoUserProfile.style.backgroundImage = "url('" + userDatabase.profilePicture + "')";
                photoUserPost.style.backgroundImage = "url('" + userDatabase.profilePicture + "')";

                getPost((snap) => {
                    snap.forEach(element => {
                        console.log(element.val());
                        //console.log(element.val().mode);

                        if (user.uid === element.val().uid) {
                            myPosts(element.key, element.val().body, element.val().mode, userDatabase.fullName, userDatabase.profilePicture);
                        } else if (element.val().mode === 'public') {
                            console.log('Post Publico');
                            otherPost(element.key, element.val().body, element.val().mode);
                        } else {
                            console.log('post Privado');
                        }
                    });
                });
            })

            newPostObject.uid = firebase.auth().currentUser.uid;
        } else {
            console.log('Sin usuario');
            goToLogin();
        }
    });
}


/* const contador = document.getElementById('contar');
const sumando = document.getElementById('contador');
let count = 0;
let contandoAlDarleClick = 0;
contador.addEventListener('click', () => {
    count = contandoAlDarleClick += 1;
    sumando.innerHTML = count;
    postObject.countLike = count;
}); */


myPosts = (newPostKey, postBody, postMode, userFullName, userPhoto) => {

    const nameUsers = document.createElement('p');
    nameUsers.setAttribute('id', 'user-name-post');
    nameUsers.innerHTML = userFullName;

    const photoUser = document.createElement('input');
    photoUser.setAttribute('type', 'button');
    photoUser.setAttribute('id', 'photo-user-post');
    photoUser.setAttribute('class', 'user-face');
    photoUser.style.backgroundImage = "url('" + userPhoto + "')";

    const btnUpdate = document.createElement("input");
    btnUpdate.setAttribute("value", "Editar");
    btnUpdate.setAttribute("type", "button");

    const btnDelete = document.createElement("input");
    btnDelete.setAttribute("value", "Eliminar");
    btnDelete.setAttribute("type", "button");

    const contentPost = document.createElement('div');
    contentPost.setAttribute('class', 'friend-post');

    const textPostSaved = document.createElement('textarea');
    textPostSaved.setAttribute('class', 'textarea-post');
    textPostSaved.setAttribute("id", newPostKey);

    textPostSaved.innerHTML = postBody;

    //Boton eliminar
    btnDelete.addEventListener('click', () => {

        firebase.database().ref().child('/user-posts/' + newPostObject.uid + '/' + newPostKey).remove();
        firebase.database().ref().child('posts/' + newPostKey).remove();
        while (posts.firstChild) posts.removeChild(posts.firstChild);
        alert('Post eliminado!');
        reload_page();
    });

    //boton actualizar
    btnUpdate.addEventListener('click', () => {

        btnUpdate.setAttribute('value', 'Editado');


        const newUpdate = document.getElementById(newPostKey);

        const nuevoPost = {
            body: newUpdate.value,
            mode: selectMode.value,
            uid: newPostObject.uid
        };

        var updatesUser = {};
        var updatesPost = {};

        updatesUser['/user-posts/' + newPostObject.uid + '/' + newPostKey] = nuevoPost;
        updatesPost['/posts/' + newPostKey] = nuevoPost;

        firebase.database().ref().update(updatesUser);
        firebase.database().ref().update(updatesPost);
    });

    contentPost.appendChild(nameUsers);
    contentPost.appendChild(photoUser);
    contentPost.appendChild(textPostSaved);
    contentPost.appendChild(btnUpdate);
    contentPost.appendChild(btnDelete);

    posts.appendChild(contentPost);
}

otherPost = (newPostKey, postBody, postMode) => {

    const nameUsers = document.createElement('p');
    nameUsers.setAttribute('id', 'user-name-post');

    const photoUser = document.createElement('input');
    photoUser.setAttribute('type', 'button');
    photoUser.setAttribute('id', 'photo-user-post');
    photoUser.setAttribute('class', 'user-face');

    const btnLike = document.createElement('button');
    btnLike.style.border = 'none';
    btnLike.innerHTML = `<button value="Me gusta" id="contar" class="button-like"><img id="imgLike" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAALASURBVGhD7Zi7bhNBFIZNgcSl4ioKEC0NHUiIAlHxBJZQZhyMKNKSlAgegFewkuysY88YI6GEgHgGJKCgSqiAUIKEQdyCAHN+c4LQcsbZtbMXS/tJv7LZPZd/Z2cv40pJSUnJZGCVPRBod80oez9Ubt0o9ylU9nOo7Uuj3QP6e93U7x7jcC+Iofw5yn2IXNT4U8utk5bRA704fHy61e5eo+1NavIh1K4/XPYbxc3bKXuY0/+yWO0eoZgFqrX5f15Eyr0f9KybPZw+Gi3dOk4j9ExsMkR0Rd6Gqn2By1SM7lwc7BNit9FTeOAyyRiY13ZDKBpPyn1valeHsC3GxJLdSHwSmDajjHxUNA1+QNKxJKL77gk8sb3toRG7JRXKVcrdYHvDma92D8a7YbOW7cEb2/SDx5hcIH8Z1b7KNv3QpVqWkguie2zTD90wL4TEQgje2KYfugIfpeRCiLyxTT8U9FVMLoDokfyFbfoZ6+WVvl6xTT8UtBpJKozoc2SFbfqhKTQnJRdBdAKzbNPPgmqfpJP4KRXIVeQp9jcRLpVYJEfFmj5bBPrOWbrjf0mFchGNfnPanWF78aCXRigWy0FYJLGt+GDpV4SPOnhYqi0dZVvJCGv2ilQ0Y9XYzmhQARMpmJ2UXWQbo9OYWd1HN/RzsUGKQk/0ZhvjgecvzcU3UqM0hF4jL+Z9BKp9GqsiqeHOyvbQi9vuLEGtcz7dJ5PtGd06x+3SASeRzpXIwPwWgze1cu9kI8mFH71Qk8tng5myp2jUxl470Bv/NWpx2WwJLndOkIm1qKkEWkMNLpcPzenmIRrFx4K5oUIOcrlMvtC3yn568TySjEpCLHI4vRg0Zhq743zBIgaxnFYs+pX+Lnqi3JaMQziGGA4vLmR09t8FEbaxjw9PBoHqKDK+CWGbd08Woe5cgvjfkpKSkiiVym9E/7T2Q9wMrAAAAABJRU5ErkJggg==">
    <label id="contador">0</label></button>`;

    const contentPost = document.createElement('div');
    contentPost.setAttribute('class', 'friend-post');

    const textPostSaved = document.createElement('textarea');
    textPostSaved.setAttribute('class', 'textarea-post');
    textPostSaved.setAttribute("id", newPostKey);

    textPostSaved.innerHTML = postBody;

    contentPost.appendChild(nameUsers);
    contentPost.appendChild(photoUser);
    contentPost.appendChild(textPostSaved);
    contentPost.appendChild(btnLike);

    posts.appendChild(contentPost);

}

btnToPost.addEventListener('click', () => {
    newPostObject.mode = selectMode.value;
    newPostObject.body = textareaPostInicial.value;

    if (newPostObject.body.length === 0) {
        alert("Creo que no haz escrito algun texto para publicar");
        return;
    }

    newPostKey = writeNewPost(newPostObject.uid, newPostObject.body, newPostObject.mode);

    

});

createElements = (newPostKey) => {
    const nameUsers = document.createElement('p');
    nameUsers.setAttribute('placeholder', 'user-name-post');

    const photoUser = document.createElement('img');
    photoUser.setAttribute('src', '../../image/user.jpg');

    var btnUpdate = document.createElement("input");
    btnUpdate.setAttribute("value", "Editar");
    btnUpdate.setAttribute("type", "button");

    var btnDelete = document.createElement("input");
    btnDelete.setAttribute("value", "Eliminar");
    btnDelete.setAttribute("type", "button");

    var contentPost = document.createElement('div');
    contentPost.setAttribute('class', 'friend-post');

    var textareaNewPost = document.createElement('textarea');
    textareaNewPost.setAttribute('class', 'textarea-post');
    textareaNewPost.setAttribute("id", newPostKey);


    textareaNewPost.innerHTML = textareaPostInicial.value;

    //Boton eliminar
    btnDelete.addEventListener('click', () => {

        firebase.database().ref().child('/user-posts/' + newPostObject.uid + '/' + newPostKey).remove();
        firebase.database().ref().child('posts/' + newPostKey).remove();
        while (posts.firstChild) posts.removeChild(posts.firstChild);
        alert('Post eliminado!');
        reload_page();
    });

    //boton actualizar
    btnUpdate.addEventListener('click', () => {

        btnUpdate.setAttribute('value', 'Editado');
        textareaNewPost.autofocus;

        const newUpdate = document.getElementById(newPostKey);

        const nuevoPost = {
            body: newUpdate.value,
            mode: selectMode.value,
            uid: newPostObject.uid
        };

        var updatesUser = {};
        var updatesPost = {};

        updatesUser['/user-posts/' + newPostObject.uid + '/' + newPostKey] = nuevoPost;
        updatesPost['/posts/' + newPostKey] = nuevoPost;

        firebase.database().ref().update(updatesUser);
        firebase.database().ref().update(updatesPost);
    });

    contentPost.appendChild(nameUsers);
    contentPost.appendChild(photoUser);
    contentPost.appendChild(textareaNewPost);
    contentPost.appendChild(btnUpdate);
    contentPost.appendChild(btnDelete);

    posts.appendChild(contentPost);

    textareaPostInicial.value = "";
}

// evento que permite cerrar sesion
btnLogout.addEventListener('click', () => {
    firebase.auth().signOut().then(function () {
        console.log('Cerró Sesión');
        logout.classList.add("hiden");
        goToLogin();
    }).catch(function (error) {
        console.log('Error al cerrar Sesión');
    });
})