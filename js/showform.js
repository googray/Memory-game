export function showForm() {
  const closeForm = document.getElementsByClassName("close")[0];
  form.style.display = "block";
  closeForm.onclick = function () {
    form.style.display = "none";
  };
  window.onclick = function (e) {
    if (e.target == form) {
      form.style.display = "none";
    }
  };
}
