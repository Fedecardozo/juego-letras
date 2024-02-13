import { ajaxGet } from "./ajax.js";
import { error, check, final } from "./gifs.js";
import {
  cargarJuego,
  palabraJuego,
  VerificarPalabra,
  clickLetra,
  leerPalabra,
  alertMsj,
  siguienteNivel,
  palabras,
} from "./juego.js";

const $form = document.getElementById("form-login");
const $formRegistrar = document.getElementById("formRegistrar");
const { floatingInputUser, floatingInputPass, floatingInputRepetir } = $formRegistrar;
const { floatingInput, floatingPassword } = $form;

const audioFondo = new Audio("../audio/fondo.mp3");
const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

let palabra = palabraJuego();

const $btnOjo = document.getElementById("basic-addon1");
const $btnRegistrarse = document.getElementById("btnRegistrarse");
const $btnRegistrar = document.getElementById("btnRegistrar");
const $btnCerrar = document.getElementById("btnCerrar");
const $dialog = document.getElementById("dialog");

$btnOjo.addEventListener("click", (e) => {
  const iconOjo = document.getElementById("icon-ojo");
  if (iconOjo.classList.value === "bi bi-eye-fill") {
    iconOjo.classList.value = "bi bi-eye-slash-fill";
    floatingPassword.type = "text";
  } else {
    iconOjo.classList.value = "bi bi-eye-fill";
    floatingPassword.type = "password";
  }
});

$btnRegistrarse.addEventListener("click", () => {
  $dialog.setAttribute("open", true);
  document.getElementById("lblUsuario").style.display = "none";
  document.getElementById("lblPass").style.display = "none";
});

function dialogClose() {
  $dialog.removeAttribute("open");
  document.getElementById("lblUsuario").style.display = "inline";
  document.getElementById("lblPass").style.display = "inline";
}

$btnCerrar.addEventListener("click", () => {
  dialogClose();
  floatingInputUser.value = "";
  floatingInputPass.value = "";
  floatingInputRepetir.value = "";
});

$btnRegistrar.addEventListener("click", (e) => {
  e.preventDefault();

  const user = {
    usuario: floatingInputUser.value,
    password: floatingInputPass.value,
    nivel: 1,
  };

  let flag = false;

  if (usuarios.length) {
    usuarios.forEach((element) => {
      if (element.usuario === floatingInputUser.value) {
        alertMsj("Usuario ya existente!", "Pruebe con otro", error);
        flag = true;
      }
    });
  }

  if (!flag) {
    if (floatingInputPass.value === floatingInputRepetir.value) {
      usuarios.push(user);
      localStorage.setItem("usuarios", JSON.stringify(usuarios));
      alertMsj("Usuario creado con exito", "", check);
      dialogClose();
    } else alertMsj("Las contraseñas no coinciden", "", error);
  }
});

document.getElementById("btnSesion").addEventListener("click", (e) => {
  e.preventDefault();

  const $img = document.getElementById("spinner");
  $img.hidden = false;

  const $fieldset = document.querySelector("fieldset");
  $fieldset.hidden = true;

  setTimeout(() => {
    $fieldset.hidden = false;
    $img.hidden = true;

    let flag = false;
    let nivel = 1;

    if (usuarios.length) {
      usuarios.forEach((element) => {
        if (element.usuario === floatingInput.value && element.password === floatingPassword.value) {
          localStorage.setItem("sesion", JSON.stringify(element));
          palabra = palabraJuego();
          nivel = element.nivel;
          flag = true;
        }
      });
    }

    if (!flag) alertMsj("ERROR!", "Usuario o contraseña incorrecta!", error);
    else if (flag && nivel > palabras.length) {
      alertMsj("Juego completado", "No hay más niveles para jugar", final);
    } else {
      loadJuego();
      audioFondo.play();
    }
  }, 2000);
});

//Sonido
audioFondo.addEventListener("ended", () => {
  audioFondo.play();
});

// INICIO JUEGO

window.addEventListener("click", (e) => {
  const target = e.target;

  if (target.matches("button")) {
    const padre = target.parentNode.id;
    if (padre === "divPalabraCompletar" || padre === "divPalabraDesordenada") {
      const $divCompletar = document.getElementById("divPalabraCompletar");
      const $divDesordenado = document.getElementById("divPalabraDesordenada");
      clickLetra($divDesordenado, $divCompletar, target);

      const formada = leerPalabra($divCompletar);

      setTimeout(() => {
        VerificarPalabra(formada, palabra, usuarios, $divDesordenado, $divCompletar);
        localStorage.setItem("usuarios", JSON.stringify(usuarios));
      }, 500);
    } else {
      const $pause = document.getElementById("dialogPaused");
      const $intentos = document.getElementById("pIntentos");

      if (target.id === "btnAceptar") {
        //Siguiente nivel
        const dialogFin = document.getElementById("dialogFin");
        dialogFin.open = false;
        siguienteNivel();
      } else if (target.id === "btnPausedSalir" || target.id === "btnSalir") {
        location.reload();
      } else if (target.id === "btnPausedContinuar") {
        $pause.open = false;
        $intentos.hidden = false;
        audioFondo.play();
      } else if (target.id === "btnPaused") {
        $intentos.hidden = true;
        audioFondo.pause();
        $pause.open = true;
      }
    }
  }
});

function loadJuego() {
  const url = "../html/juego.html";
  ajaxGet(url, (res) => {
    const parser = new DOMParser();

    // Convertir el HTML en un documento DOM
    const doc = parser.parseFromString(res.responseText, "text/html");

    // Obtener el contenido de la etiqueta <body>
    const contenidoBody = doc.querySelector("body").innerHTML;
    const $body = document.querySelector("body");

    $body.innerHTML = contenidoBody;
    cargarJuego(palabra);
  });
}

// FIN JUEGO
