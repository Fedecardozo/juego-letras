import { fetchGet } from "./fetch.js";
import { ajaxGet } from "./ajax.js";
import { cargarJuego, palabraJuego, VerificarPalabra, clickLetra, leerPalabra } from "./juego.js";

const $form = document.getElementById("form-login");
const $formRegistrar = document.getElementById("formRegistrar");
const { floatingInputUser, floatingInputPass, floatingInputRepetir } = $formRegistrar;
const audioFondo = new Audio("../audio/fondo.mp3");
const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
// const usuarios = [{ usuario: "fede", password: "1234" }];
const { floatingInput, floatingPassword } = $form;

// console.log(usuarios);

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
        alert("No se puede crear. Ese usuario ya existe");
        flag = true;
      }
    });
  }

  if (!flag) {
    if (floatingInputPass.value === floatingInputRepetir.value) {
      usuarios.push(user);
      localStorage.setItem("usuarios", JSON.stringify(usuarios));
      alert("Usuario creado con exito");
      dialogClose();
    } else alert("Las contraseñas no coinciden");
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
    let fecha = false;
    if (usuarios.length) {
      usuarios.forEach((element) => {
        if (element.usuario === floatingInput.value && element.password === floatingPassword.value) {
          localStorage.setItem("sesion", JSON.stringify(element));
          palabra = palabraJuego();
          flag = true;
          fecha = element.fecha || false;
        }
      });
    }

    if (!flag) {
      alert("Usuario o contraseña incorrecta!");
    } else if (flag) {
      if (!fecha || calcularDias(fecha)) {
        loadJuego();
        audioFondo.play();
      } else {
        alert("Ya juego su nivel del dia");
      }
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
  //OBTENER SELECCION
  if (
    target.matches("button") &&
    (target.parentNode.id === "divPalabraCompletar" || target.parentNode.id === "divPalabraDesordenada")
  ) {
    const $divCompletar = document.getElementById("divPalabraCompletar");
    const $divDesordenado = document.getElementById("divPalabraDesordenada");
    clickLetra($divDesordenado, $divCompletar, e);

    const formada = leerPalabra($divCompletar);

    setTimeout(() => {
      if (VerificarPalabra(formada, palabra, usuarios, $divDesordenado, $divCompletar)) {
        localStorage.setItem("usuarios", JSON.stringify(usuarios));
      }
    }, 500);
  } else if (target.matches("button") && target.id === "btnAceptar") {
    location.reload();
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

function calcularDias(fecha) {
  // Calcula la diferencia en milisegundos
  const diferenciaMilisegundos = new Date() - fecha;

  // Convierte la diferencia a días
  const diferenciaDias = diferenciaMilisegundos / (1000 * 60 * 60 * 24);

  // Verifica si han pasado más de un día
  return diferenciaDias > 1;
}

// FIN JUEGO
