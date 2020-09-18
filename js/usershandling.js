function registrar() {
  var email = document.getElementById("emailSignUp").value;
  var password = document.getElementById("passwordSignUp").value;

  
  firebase.auth().createUserWithEmailAndPassword(email, password).catch(function (error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    // ...
    console.log(errorCode, " ", errorMessage);
    
  });

}

function signIn() {
  var email = document.getElementById("emailSignIn").value;
  var password = document.getElementById("passwordSignIn").value;

  
  firebase.auth().signInWithEmailAndPassword(email, password).catch(function (error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;

    console.log(errorCode, " ", errorMessage);
    
  });
  
    console.log("Se autenticó correctamente");
  
}