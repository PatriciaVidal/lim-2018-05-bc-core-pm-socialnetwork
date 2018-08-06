/* 
document.getElementById('email-register').addEventListener('keyup',()=>{
    campo = event.target;
    valido = document.getElementById('validate-email-register');
        
    emailRegex = /[a-z]/;
    //Se muestra un texto a modo de ejemplo, luego va a ser un icono
    if (emailRegex.test(campo.value)) {
        valido.innerText = "";
    } else {
      valido.innerText = "incorrecto";
    }

})  */