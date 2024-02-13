import { fiesta, ganador, regalo } from "./gifs.js";
// INICIO JUEGO
export const palabras = [
  "SOL",
  "GATO",
  "FLOR",
  "ARBOL",
  "CASA",
  "SILLA",
  "PIANO",
  "OSCURO",
  "AMISTAD",
  "CRUCERO",
  "COLORES",
  "TRABAJO",
  "GUITARRA",
  "ELEFANTE",
  "VEHICULO",
];

export function alertMsj(titulo, msj, img) {
  Swal.fire({
    title: titulo,
    text: msj,
    imageUrl: img,
    imageWidth: 100,
    imageHeight: 100,
    confirmButtonText: "Aceptar",
  });
}

export function cargarJuego(palabra) {
  const usuario = JSON.parse(localStorage.getItem("sesion"));

  if (usuario.nivel === palabras.length) {
    //Como esta en el ultimo nivel ocultado el boton de continuar
    document.getElementById("btnAceptar").hidden = true;
  }

  let nivel = usuario.nivel - 1;
  const $h1 = document.querySelector("h1");
  $h1.textContent =
    "Hola " +
    usuario.usuario +
    "! Te encuentras en el nivel " +
    usuario.nivel +
    " y tienes " +
    nivel * 1000 +
    " puntos";

  const intentos = usuario.intentos || 0;
  cambiarIntentos(intentos);

  const $divCompletar = document.getElementById("divPalabraCompletar");
  const $divDesordenado = document.getElementById("divPalabraDesordenada");

  let palabraDesordenada = desordenar(palabra);

  //Si esta igual que la palabra original volver a desordenar
  while (palabraDesordenada === palabra) {
    palabraDesordenada = desordenar(palabra);
  }

  //Botones de la palabra desordenada
  crearBtnsLetras(palabraDesordenada, $divDesordenado, false);

  crearBtnsLetras(palabra, $divCompletar, true);
}

export function palabraJuego() {
  const usuario = JSON.parse(localStorage.getItem("sesion"));

  return palabras[usuario ? usuario.nivel - 1 : 0];
}

export function leerPalabra($divCompletar) {
  const lenDiv = $divCompletar.childNodes;
  let palabra = "";
  lenDiv.forEach((e) => {
    palabra += e.textContent;
  });
  return palabra;
}

export function clickLetra($divDesordenado, $divCompletar, target) {
  if (target.dataset.div === "des") {
    const lenDiv = $divCompletar.childNodes;

    for (let i = 0; i < lenDiv.length; i++) {
      if (lenDiv[i].textContent === "") {
        lenDiv[i].textContent = target.textContent;
        target.textContent = "";
        lenDiv[i].setAttribute("data-des", target.dataset.posicion);
        break;
      }
    }
  } else if (target.dataset.div === "com" && target.textContent != "") {
    const lenDiv = $divDesordenado.childNodes;
    lenDiv[target.dataset.des].textContent = target.textContent;
    target.textContent = "";
  }
}

export function VerificarPalabra(formada, palabra, usuarios, $divDesordenado, $divCompletar) {
  if (formada.length == palabra.length) {
    const usuario = JSON.parse(localStorage.getItem("sesion"));
    let indice = usuarios.findIndex((user) => user.usuario === usuario.usuario);

    if (palabra === formada) {
      //Sonido victoria
      new Audio("../audio/victoria.mp3").play();

      usuario.fecha = new Date();
      usuario.intentos = 0;

      activarDesactivarBotones(true);

      if (usuario.nivel === 10) {
        cambiarDialogFin(regalo, "Te ganaste un 20% de descuento en productos seleccionados en nuestra tienda");
      } else if (usuario.nivel === palabras.length - 1) {
        cambiarDialogFin(regalo, "Te ganaste una orden de compra por $20.000!");
      } else if (usuario.nivel === palabras.length) {
        cambiarDialogFin(ganador, "Superaste todos los niveles!");
      } else {
        cambiarDialogFin(fiesta, "Nivel completado!");
      }

      usuario.nivel++;
    } else {
      //Audio cuando pierde
      new Audio("../audio/derrota.mp3").play();

      //Intentos para el usuario
      const $p = document.getElementById("pIntentos");
      let intentos = isNaN($p.dataset.intentos) ? 0 : parseInt($p.dataset.intentos);
      intentos++;
      usuario.intentos = intentos;

      //Intentos en dom <p>
      cambiarIntentos(intentos);

      activarDesactivarBotones(true);

      //Reiniciar juego despues de 2 segundos
      setTimeout(() => {
        reinciarJuego($divDesordenado, $divCompletar);
      }, 2000);

      // Muestro modal por 2 segundos
      mostrarModal("dialogError", 2000);
    }

    usuarios[indice] = usuario;
    localStorage.setItem("sesion", JSON.stringify(usuario));
  }
}

function reinciarJuego($divDesordenado, $divCompletar) {
  const lenDiv = $divDesordenado.childNodes;
  const div = $divCompletar.childNodes;

  for (let i = 0; i < lenDiv.length; i++) {
    setTimeout(() => {
      const index = div[i].dataset.des;
      lenDiv[index].textContent = div[i].textContent;
      setTimeout(() => {
        div[i].textContent = "";
        activarDesactivarBotones(false);
      }, 1000);
    }, 900);
  }
}

function activarDesactivarBotones(boolean) {
  const botones = document.querySelectorAll(".btnLetra");

  botones.forEach(function (boton) {
    boton.disabled = boolean;
  });
}

export function siguienteNivel() {
  //Saco los hijos de los botones de las letras
  removerHijos("divPalabraCompletar");
  removerHijos("divPalabraDesordenada");

  //Cargo el juego
  cargarJuego(palabraJuego());

  //Cambio los intentos de la <p>
  cambiarIntentos(0);
}

function removerHijos(idContenedor) {
  const $contenedor = document.getElementById(idContenedor);
  while ($contenedor.firstChild) {
    $contenedor.removeChild($contenedor.firstChild);
  }
}

function cambiarIntentos(intentos) {
  const $p = document.getElementById("pIntentos");
  $p.textContent = "Intentos: " + intentos;
  $p.setAttribute("data-intentos", intentos);
  // $p.hidden = hidden;
}

function desordenar(palabra) {
  // Convertir la palabra en un array de caracteres
  let letras = palabra.split("");

  // Barajar las letras del array
  for (let i = letras.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    let temp = letras[i];
    letras[i] = letras[j];
    letras[j] = temp;
  }

  // Unir las letras nuevamente en una palabra desordenada
  let palabraDesordenada = letras.join("");

  return palabraDesordenada;
}

function crearBtnsLetras(palabra, $div, vacio) {
  const fragment = document.createDocumentFragment();
  for (let i = 0; i < palabra.length; i++) {
    const btn = document.createElement("button");
    btn.textContent = vacio ? "" : palabra[i];
    btn.classList.add("btnLetra");
    btn.setAttribute("data-posicion", i);
    btn.setAttribute("data-div", "des");
    fragment.appendChild(btn);
  }

  $div.appendChild(fragment);
}

function cambiarDialogFin(path, text) {
  const dialogFin = document.getElementById("dialogFin");
  dialogFin.setAttribute("open", true);
  const h3 = document.getElementById("h3Dialog");
  const img = document.getElementById("imgDialog");
  img.setAttribute("src", path);
  h3.textContent = text;

  return dialogFin;
}

function mostrarModal(idModal, time) {
  const $modal = document.getElementById(idModal);
  $modal.open = true;
  setTimeout(() => {
    $modal.open = false;
  }, time);
}

// FIN JUEGO
