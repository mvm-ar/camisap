const torso = document.getElementById("torso");
const mangas = document.getElementById("mangas");
const cuello = document.getElementById("cuello");

torso.addEventListener("input", () => {

    document
        .getElementById("torsoSvg")
        .setAttribute(
            "fill",
            torso.value
        );

});

mangas.addEventListener(
    "input",
    () => {

        document
            .getElementById(
                "mangaIzquierdaSvg"
            )
            .setAttribute(
                "fill",
                mangas.value
            );

        document
            .getElementById(
                "mangaDerechaSvg"
            )
            .setAttribute(
                "fill",
                mangas.value
            );

    }
);

cuello.addEventListener("input", () => {

    document
        .getElementById("cuelloSvg")
        .setAttribute(
            "fill",
            cuello.value
        );

});

console.log("Cargando diseños...");
cargarDiseños();


async function guardarCamiseta() {

    const token =
        localStorage.getItem("token");

    if (!token) {

        alert(
            "Debes iniciar sesión"
        );

        return;
    }

    const nombre =
        document.getElementById(
            "nombreDiseno"
        ).value;

    const descripcion =
        document.getElementById(
            "descripcion"
        ).value;

    const respuesta =
        await fetch(
            "http://localhost:3000/camisetas",
            {

                method: "POST",

                headers: {

                    "Content-Type":
                        "application/json",

                    "Authorization":
                        "Bearer " + token

                },

                body: JSON.stringify({

                    nombre,

                    descripcion,

                    torso:
                        torso.value,

                    mangaIzquierda: 
                        mangas.value,
                    
                    mangaDerecha: 
                        mangas.value,

                    cuello:
                        cuello.value

                })

            }
        );

    const data =
        await respuesta.json();

    console.log(data);

    alert(
        "Diseño guardado correctamente"
    );

}
async function cargarDiseños() {

    const respuesta =
        await fetch(
            "http://localhost:3000/camisetas"
        );

    const diseños =
        await respuesta.json();

    const lista =
        document.getElementById(
            "listaDiseños"
        );

    const token =
        localStorage.getItem("token");

    const usuario =
        obtenerPayloadJWT(token);

    lista.innerHTML = "";

    diseños.forEach(c => {

        let botones = "";

        if (
            c.creadorId === usuario.id
        ) {

            botones = `

<div class="botones-card">

    <button
    onclick="editarDiseño('${c._id}')">
    Editar
    </button>

    <button
    onclick="eliminarDiseño('${c._id}')">
    Eliminar
    </button>

</div>

`;

        }

        lista.innerHTML += `

<div class="card-diseño">

<h3>
${c.nombre}
</h3>

<p>
${c.descripcion}
</p>

<p>
Creado por:
${c.creador}
</p>

<svg
width="230"
height="250"
viewBox="0 0 320 350">

<path
d="
M55 95
L120 60
L120 150
L35 160
Z"

fill="${c.mangaIzquierda}"
></path>

<path
d="
M200 60
L265 95
L285 160
L200 150
Z"

fill="${c.mangaDerecha}"
></path>

<!-- torso -->

<path
d="
M120 60
L200 60
L220 290
L100 290
Z"

fill="${c.torso}"
></path>

<!-- cuello -->

<ellipse

cx="160"

cy="75"

rx="28"

ry="16"

fill="${c.cuello}"

></ellipse>

</svg>

${botones}

</div>

`;

    });
}
async function eliminarDiseño(id) {

    const token =
        localStorage.getItem(
            "token"
        );

    const respuesta =
        await fetch(

            "http://localhost:3000/camisetas/" + id,

            {
                method: "DELETE",

                headers: {
                    Authorization:
                        "Bearer " + token
                }
            }

        );

    const data =
        await respuesta.json();

    alert(
        data.mensaje
    );

    cargarDiseños();

}

function editarDiseño(id) {

    localStorage.setItem(
        "camisetaEditar",
        id
    );

    window.location =
        "editar.html";

}
function obtenerPayloadJWT(token) {

    const base64 =
        token.split(".")[1];

    return JSON.parse(
        atob(base64)
    );

}