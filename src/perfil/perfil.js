// Verificar si tenemos nuestro usuario logueado
window.onload = () => {
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            console.log('Usuario Logueado');
            logout.classList.remove("hiden");
            userNameProfile.innerHTML = `${user.displayName}`;
            userNamePost.innerHTML = `${user.displayName}`;
            console.log(user.uid);

            //Llamando a Data Firebase///////////////////
            const ubicacionObject = firebase.database().ref('user-posts').child(user.uid);
            ubicacionObject.on('child_added', snap => {
                console.log(snap.val().body);
            });
            console.log("ubicacion  " + ubicacionObject)
            /////////////////777//////////

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

//contador de click
const contador = document.getElementById('contar');
console.log(contador);

const sumando = document.getElementById('contador');

let contandoAlDarleClick = 0;
contador.addEventListener('click', () => {
    sumando.innerHTML = contandoAlDarleClick += 1;
})
