var gfModal = new bootstrap.Modal(document.getElementById('gfsday'), {})


if(localStorage.getItem("saw-gf") == null){
  if(prompt("Guess the pin :D. (in numbers)") == '021419'){
    localStorage.setItem("saw-gf", true);
  }
}
