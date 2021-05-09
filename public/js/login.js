(function () {
    // Initialize Angular module
    var app = angular.module('loginapp', ['firebase']);

    app.controller("logincntrl", ["$scope", "$firebaseAuth","$http",function($scope, $firebaseAuth,$http) 
    {   
        $scope.authObj = $firebaseAuth();
        //AUTHSTATECHANGE REALTIME LISTENER
        $scope.authObj.$onAuthStateChanged(function(firebaseUser) {
            if (firebaseUser) {
              setTimeout(()=>{window.location.href='index.html'}, 1500);
              console.log("onauth Signed in as:", firebaseUser.uid);
            } else {
              //  window.location.href = 'login.html'
              console.log("onauth Signed out");
            }
          });
        //SIGN IN THROUGH EMAIL PASSWORD
        $scope.signin = function(email,password) 
        {
            $scope.authObj.$signInWithEmailAndPassword(email,password).then(function(firebaseUser) 
            {
                console.log("Signed in as:", firebaseUser.uid);
                }).catch(function(error) {    
                    alert(error.message)
                    //if(error.code === 'auth/user-not-found')
                    //createuser(email,password,name)
                console.error("Authentication failed:", error);
            });
        };
        //SIGNIN THROUGH GOOGLE
        $scope.signinggl = function () 
        {
            var provider = new firebase.auth.GoogleAuthProvider();
            provider.addScope("https://www.googleapis.com/auth/plus.login");
            provider.setCustomParameters({
              login_hint: "user@example.com"
            });
            $scope.authObj.$signInWithPopup(provider).then(function(result) {
                console.log("Signed in as:", result.user.uid);
                setUserdata(result.user.uid,result.user.email,result.user.displayName)
              }).catch(function(error) {
                console.error("Authentication failed:", error);
              }); 
        }
        //SIGNUP THROUGH EMAIL PASSWORD
        $scope.signup = function (email,password,name) 
        {
            $scope.authObj.$createUserWithEmailAndPassword(email,password)
            .then(function(firebaseUser) {
                setUserdata(firebaseUser.uid,email,name)
                console.log("User " + firebaseUser.uid + " created successfully!");
            }).catch(function(error) {
                console.error("Error: ", error);
            });
        }
        $scope.resetPass = function ()
        {
          //GET EMAIL ID
          var eMailVal = prompt("Enter Email Id");
          if (eMailVal === "") 
            alert('Email cannot be empty')
          else if (eMailVal) 
          {
            //SEND PASSWORD RESET EMAIL
            $scope.authObj.$sendPasswordResetEmail(eMailVal).then(function() {
              alert("Password reset email sent successfully! Check Mail");
            }).catch(function(error) {
              console.error("Error: ", error);
            });
          } 
        }
        function setUserdata(uid,email,name) 
        {
                var obj = { userid:uid,userName: name, email:email}
                console.log(obj)
                // ADD USER DATA TO MONGODB
                $http.post('/api/users/'+uid,obj).then(function onSuccess(response) {
                  // Handle success
                  console.log(response)
                }).catch(function onError(response) {
                  // Handle error
                  console.log(response)
                }); 
                // 
        }
    } 
]);
    // Initialize Firebase
    firebase.initializeApp({apiKey: "AIzaSyCvPluRUa7kZ3TaofLz8J7X430uyv7yNJQ",
     authDomain: "diarywebappawp.firebaseapp.com",
    });
}());