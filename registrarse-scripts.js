const form = document.querySelector("#form");

const onSubmit = (e) => {
  e.preventDefault();

  const formData = new FormData(form);
  const data = Object.fromEntries(formData);

  if (!data.password.match(/^(?=.*[A-Z])(?=.*[0-9])(?=.*[a-z]).{6,}$/)) {
    alert(
      "La contraseña debe incluir al menos 6 caracteres alfanuméricos. Al menos una minuscula, una mayuscula y un digito."
    );
    return;
  }

  if (data.password != data.repassword) {
    alert("Las contraseñas no coinciden");
    return;
  }

  alert("Te has registrado correctamente");
  location.href = "./index.html";
};

form.addEventListener("submit", onSubmit);
