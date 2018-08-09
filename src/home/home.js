const selectMode = document.getElementById('select-mode');
const contador = document.getElementById('contar');
const sumando = document.getElementById('contador');
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
                photoUserProfile.style.background = "url('" + userDatabase.profilePicture + "')";
                photoUserPost.style.background = "url('" + userDatabase.profilePicture + "')";
            })

            getPost((snapshot) => {
                snapshot.forEach(element => {
                    console.log(element);
                });
            });





            newPostObject.uid = firebase.auth().currentUser.uid;
        } else {
            console.log('Sin usuario');
            goToLogin();
        }
    });
}

let count = 0;
let contandoAlDarleClick = 0;
contador.addEventListener('click', () => {
    count = contandoAlDarleClick += 1;
    sumando.innerHTML = count;
    postObject.countLike = count;
});


btnToPost.addEventListener('click', () => {
    newPostObject.mode = selectMode.value;
    newPostObject.body = post.value;

    if (newPostObject.body.length === 0) {
        alert("Creo que no haz escrito algun texto para publicar");
        return;
    }

    newPost = writeNewPost(newPostObject.uid, newPostObject.body, newPostObject.mode);

    myPosts = (newPost) => {
        const nameUsers = document.createElement('p');
        nameUsers.setAttribute('id', userNamePost);

        const photoUser = document.createElement('img');
        photoUser.setAttribute('src', '../../image/user.jpg');

        const btnUpdate = document.createElement("input");
        btnUpdate.setAttribute("value", "Editar");
        btnUpdate.setAttribute("type", "button");

        const btnDelete = document.createElement("input");
        btnDelete.setAttribute("value", "Eliminar");
        btnDelete.setAttribute("type", "button");

        const btnLike = document.createElement('input');
        btnLike.setAttribute("value", "Me gusta");
        btnLike.setAttribute("type", "button");

        const contPost = document.createElement('div');
        contPost.setAttribute('class', 'friend-post');

        const textPost = document.createElement('textarea');
        textPost.setAttribute('class', 'textarea-post');
        textPost.setAttribute("id", newPost);
    }

    otherPost = (newPost) => {

        const nameUsers = document.createElement('p');
        nameUsers.setAttribute('id', userNamePost);

        const photoUser = document.createElement('img');
        photoUser.setAttribute('src', '../../image/user.jpg');

        const btnLike = document.createElement('input');
        btnLike.setAttribute("value", "Me gusta");
        btnLike.setAttribute("type", "button");

        const contPost = document.createElement('div');
        contPost.setAttribute('class', 'friend-post');

        const textPost = document.createElement('textarea');
        textPost.setAttribute('class', 'textarea-post');
        textPost.setAttribute("id", newPost);
    }

    const nameUsers = document.createElement('p');
    nameUsers.setAttribute('id', userNamePost);

    const photoUser = document.createElement('img');
    photoUser.setAttribute('src', '../../image/user.jpg');

    var btnUpdate = document.createElement("input");
    btnUpdate.setAttribute("value", "Editar");
    btnUpdate.setAttribute("type", "button");

    var btnDelete = document.createElement("input");
    btnDelete.setAttribute("value", "Eliminar");
    btnDelete.setAttribute("type", "button");

    const btnLike = document.createElement('input');
    btnLike.setAttribute("value", "Me gusta");
    btnLike.setAttribute("type", "button");

    var contPost = document.createElement('div');
    contPost.setAttribute('class', 'friend-post');

    var textPost = document.createElement('textarea');
    textPost.setAttribute('class', 'textarea-post');
    textPost.setAttribute("id", newPost);


    textPost.innerHTML = post.value;
    //Boton eliminar
    btnDelete.addEventListener('click', () => {

        firebase.database().ref().child('/user-posts/' + newPostObject.uid + '/' + newPost).remove();
        firebase.database().ref().child('posts/' + newPost).remove();

        while (posts.firstChild) posts.removeChild(posts.firstChild);

        alert('The user is deleted successfully!');
        reload_page();

    });
    //boton actualizar
    btnUpdate.addEventListener('click', () => {

        btnUpdate.setAttribute('value', 'Guardar');
        btnUpdate.setAttribute('id', 'bntSave');
        post.autofocus;

        const btnSave = document.getElementById('btnSave');
        btnSave.addEventListener('click', () => {
            const newUpdate = document.getElementById(newPost);
            const nuevoPost = {
                body: newUpdate.value,
                mode: selectMode.value,
                uid: newPostObject.uid

            };

            var updatesUser = {};
            var updatesPost = {};

            updatesUser['/user-posts/' + newPostObject.uid + '/' + newPost] = nuevoPost;
            updatesPost['/posts/' + newPost] = nuevoPost;

            firebase.database().ref().update(updatesUser);
            firebase.database().ref().update(updatesPost);

            btnSave.setAttribute('value', 'editar');
            btnSave.setAttribute('id', 'btnUpdate');
        })

    });

    contPost.appendChild(nameUsers);
    contPost.appendChild(photoUser);
    contPost.appendChild(textPost);
    contPost.appendChild(btnUpdate);
    contPost.appendChild(btnDelete);
    contPost.appendChild(btnLike);
    posts.appendChild(contPost);

    post.value = "";
});

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