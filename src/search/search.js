const photoUserProfile = document.getElementById('photo-user-profile');
const photoUserPost = document.getElementById('photo-user-post');


window.onload = () => {
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            getUserForId(user.uid, (userDatabase) => {
                //console.log(userDatabase);
                userNameProfile.innerHTML = userDatabase.fullName;
                userNamePost.innerHTML = userDatabase.fullName;
                photoUserProfile.style.backgroundImage = "url('" + userDatabase.profilePicture + "')";
                photoUserPost.style.backgroundImage = "url('" + userDatabase.profilePicture + "')";

                getPost((snap) => {
                    snap.forEach(element => {
                        //console.log(element.val());
                        console.log(element.val());

                      /*   if (user.uid === element.val().uid) {
                            myPosts(element.key, element.val().body, element.val().mode, userDatabase.fullName, userDatabase.profilePicture);
                        } else if (element.val().mode === 'public') {
                            console.log('Post Publico');
                            otherPost(element.key, element.val().body, element.val().mode);
                        }else{
                            console.log('post Privado');
                        } */

                        



                    });
                });

            })
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
        goToLogin()
    }).catch(function (error) {
        console.log('Error al cerrar Sesión');
    });
})

//contador de click
const contador = document.getElementById('contar');

const sumando = document.getElementById('contador');

let contandoAlDarleClick = 0;
contador.addEventListener('click', () => {
    sumando.innerHTML = contandoAlDarleClick += 1;
})