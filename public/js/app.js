var firebaseK = ''
document.addEventListener("DOMContentLoaded", function(event) 
{ 
    var firebaseK = document.getElementById('fbkey').innerHTML
    firebase.initializeApp({apiKey: firebaseK}); 
});
(function () {
    var name = ''
    // Initialize Firebase
    // Initialize Angular module
    var app = angular.module('fbapp', ['firebase']);

    app.controller("fbcntrl", ["$scope", "$firebaseAuth","$http",function($scope, $firebaseAuth,$http) 
    {   
        $scope.authObj = $firebaseAuth();
        // GET USER NAME
        function getUserName(uid) 
        {
          //$scope.diary.dDate = new Date();
            $http.get('/api/users/'+uid).then(function onSuccess(response) {
                console.log(response.data)
                $scope.welcomname = response.data[0].userName
                $scope.nameP = response.data[0].userName
                $scope.emailP = response.data[0].email
                name = response.data[0].userName
              }).catch(function onError(response) {
                // Handle error
                console.log(response)
              });
        }
        //AUTHSTATECHANGE REALTIME LISTENER
        $scope.authObj.$onAuthStateChanged(function(firebaseUser) {
            if (firebaseUser) {
                $scope.welcomemail = firebaseUser.email;
                console.log("Welcome " + firebaseUser.email)
                console.log("onauth Signed in as:", firebaseUser.uid);
                getUserName(firebaseUser.uid);
                getDiaries(firebaseUser.uid)
            } else {
                window.location.href = 'login.html'
              console.log("onauth Signed out");
            }
          });
        //SIGN OUT FUNCTION
        $scope.signout = function() 
        {
            $scope.authObj.$signOut();
        };
        //WRITE DIARY FUNCTION
        $scope.addDiary = function (diary) 
        {
            if(diary === undefined || diary.title === undefined || diary.dDate === undefined || diary.body === undefined)
            {
              console.log(diary)
              alert("All fields required")
            }
            else
            {
              const iD =  $scope.authObj.$getAuth().uid
              const uid = {userid:iD}
              Object.assign(diary, uid)
              console.log(diary) 
              //
                $http.post('/api/diary/'+iD,diary).then(function onSuccess(response) {
                  // Handle success
                  $scope.diary = {};
                  getDiaries(iD)
                  writehide()
                }).catch(function onError(response) {
                  // Handle error
                  console.log(response)
                }); 
              // 
            }   
        }
        //GET DIARY OF A USER
        function getDiaries(iD) 
        {
          $http.get('/api/diary/'+iD).then(function onSuccess(response) {
            console.log(response.data)
            $scope.diaries = response.data
          }).catch(function onError(response) {
            // Handle error
            console.log(response)
          });
        }
        $scope.showall = function() 
        {
          $scope.diaries = ''
          $scope.diarysearchdate = ''
          getDiaries($scope.authObj.$getAuth().uid) 
        }
        //FIND DIARY BY DATE
        $scope.findbydate = function (diarysearchdate) 
        {
          console.log(diarysearchdate)
          const iD =  $scope.authObj.$getAuth().uid
          if(diarysearchdate === undefined)
            alert('Select Date')
          else
          {
            var data = {uid:iD,date:diarysearchdate}
            console.log(data)
            $http.get('/api/date/'+iD+'/'+diarysearchdate).then(function onSuccess(response) 
            {
              $scope.diaries = response.data
              console.log(response.data)
            }).catch(function onError(response) {
                // Handle error
                console.log(response)
            });
          }
        }
        // GET INDIVIDUAL DIARY TO EDIT
        $scope.editDiary = function (diaryid,diary) 
        {
            const iD =  $scope.authObj.$getAuth().uid
            $http.get('/api/diary/'+iD +'/'+diaryid).then(function onSuccess(response) {
              document.getElementById("btn-add").disabled = true;
              document.getElementById("btn-edit").disabled = false;
              viewhide()
              $scope.diary = response.data[0]
              console.log(diary)
              var d = Date.parse(response.data[0].dDate);
              var dd = new Date(d)
              //var ddate = dd.getFullYear() +'-'+ ('0' + (dd.getMonth()+1)).slice(-2) +'-' +('0' + dd.getDate()).slice(-2)
              //console.log(ddate)
              //document.getElementById('ddate').value = ddate
              $scope.diary.dDate = dd
            }).catch(function onError(response) {
              // Handle error
              console.log(response)
            }); 
        } 
        //UPDATE A PARTICULAR DIARY
        $scope.updateDiary = function (diary) 
        {
          const iD =  $scope.authObj.$getAuth().uid
          const ts = {created: Date.now()}
          Object.assign(diary, ts)
          console.log(diary)
          if(diary === undefined || diary.title === undefined || diary.dDate === undefined || diary.body === undefined)
            {
              console.log(diary)
              alert("All fields required")
            }
          else
            {
              $http.put('/api/diary/'+iD +'/'+diary._id,diary).then(function onSuccess(response) {
                // Handle success
                console.log(response)
                alert('Diary Updated')
                $scope.diary = {};
                document.getElementById("btn-add").disabled = false;
              document.getElementById("btn-edit").disabled = true;
                getDiaries(iD)
                writehide()
            }).catch(function onError(response) {
                // Handle error
                console.log(response)
            });
            }
        }
        //DELETE A PARTICULAR DIARY
        $scope.deleteDiary = function(diaryid) {
          var del = confirm("Are sure you want to delete Diary ?");
          if (del === true) 
          {
              const iD =  $scope.authObj.$getAuth().uid
              console.log(diaryid)
              $http.delete('/api/diary/'+iD +'/'+diaryid).then(function onSuccess(response) {
                  // Handle success
                  console.log(response)
                  alert('Diary deleted')
                  getDiaries(iD);
              }).catch(function onError(response) {
                  // Handle error
                  console.log(response)
              });
          } 
          else 
              alert("Diary is Safe")
        };
        // update profile
        $scope.editprofile = function(nameP,emailP) 
        {
          var uid=$scope.authObj.$getAuth().uid  
          data = {uid:uid,userName: nameP,email:emailP}
          $http.put('/api/users/'+uid,data).then(function onSuccess(response) {
                // Handle success
                console.log(response)
                alert('Profile Updated')
                getUserName(uid)
            }).catch(function onError(response) {
                // Handle error
                console.log(response)
            });
        }
    }
]);
window.writehide= writehide
window.viewhide= viewhide
window.showprofile = showprofile
function writehide() 
{
  document.getElementById("viewdiv").style.display = "block";
  document.title = name + "'s Diary"
  document.getElementById("writediv").style.display = "none";
  document.getElementById("profilediv").style.display = "none";
}
function viewhide() 
{
  document.getElementById("writediv").style.display = "block";
  document.title = "Welcome " + name
  document.getElementById("viewdiv").style.display = "none";
  document.getElementById("profilediv").style.display = "none";
}
function showprofile() 
{
  document.getElementById("writediv").style.display = "none";
  document.title = "Edit Profile"
  document.getElementById("viewdiv").style.display = "none";
  document.getElementById("profilediv").style.display = "block";
}
}());