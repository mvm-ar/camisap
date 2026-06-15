const id = localStorage.getItem("camisetaEditar");

cargarDiseño();

async function cargarDiseño() {

    const respuesta =
    await fetch("http://localhost:3000/camisetas");

    const diseños =
    await respuesta.json();

    const diseño =
    diseños.find(c => c._id === id);

    if (!diseño) {
        alert("Diseño no encontrado");
        return;
    }

    document.getElementById("nombreDiseno").value =
    diseño.nombre;

    document.getElementById("descripcion").value =
    diseño.descripcion;

    document.getElementById("torso").value =
    diseño.torso;

    document.getElementById("mangaIzquierda").value =
    diseño.mangaIzquierda;

    document.getElementById("mangaDerecha").value =
    diseño.mangaDerecha;

    document.getElementById("cuello").value =
    diseño.cuello;

}

async function guardarCambios() {

    const token =
    localStorage.getItem("token");

    const respuesta =
    await fetch(
        "http://localhost:3000/camisetas/" + id,
        {
            method: "PUT",

            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            },

            body: JSON.stringify({

                nombre:
                document.getElementById("nombreDiseno").value,

                descripcion:
                document.getElementById("descripcion").value,

                torso:
                document.getElementById("torso").value,

                mangaIzquierda:
                document.getElementById("mangaIzquierda").value,

                mangaDerecha:
                document.getElementById("mangaDerecha").value,

                cuello:
                document.getElementById("cuello").value

            })
        }
    );

    const data =
    await respuesta.json();

    alert("Diseño actualizado");

    window.location =
    "camisas.html";

}