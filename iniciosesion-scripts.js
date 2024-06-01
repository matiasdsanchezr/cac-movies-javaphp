const form = document.querySelector("#form");

const onSubmit = (e) => {
  e.preventDefault();
  alert("Has introducion datos validos. Redirigiendo");
  location.href = "./index.html";
};

form.addEventListener("submit", onSubmit);
