async function registrar(){

const respuesta = await fetch(
"http://localhost:3000/usuarios",
{
method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({

nombre:
document.getElementById("nombre").value,

correo:
document.getElementById("correo").value,

clave:
document.getElementById("clave").value

})
});

const data = await respuesta.json();

alert(data.mensaje || "Usuario creado");
}