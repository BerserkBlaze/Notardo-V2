/* Creación de usuarios */
function signUp() {
  var email = document.getElementById("emailSignUp").value;
  var password = document.getElementById("passwordSignUp").value;

  firebase.auth().createUserWithEmailAndPassword(email, password)
  .then(function (){
    console.log("Se creó la cuente correctamente");
  })
  .catch(function (error) {
    var errorCode = error.code;
    var errorMessage = error.message;
    console.log(errorCode, " ", errorMessage);
  });

}

/* Inicio de sesión de los usuarios */
function signIn() {
  var email = document.getElementById("emailSignIn").value;
  var password = document.getElementById("passwordSignIn").value;

  firebase.auth().signInWithEmailAndPassword(email, password)
    .then(function () {
      console.log("Se autenticó correctamente");
    })
    .catch(function (error) {
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log(errorCode, " ", errorMessage);
    });
}