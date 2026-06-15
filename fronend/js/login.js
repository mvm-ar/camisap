async function login(){

const respuesta = await fetch(
"http://localhost:3000/login",
{
method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({

correo:
document.getElementById("correo").value,

clave:
document.getElementById("clave").value

})
});

const data = await respuesta.json();

if(data.token){

localStorage.setItem(
"token",
data.token
);

window.location=
"camisas.html";

}else{

alert(data.mensaje);

}

}