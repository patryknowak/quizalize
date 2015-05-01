angular.module('createQuizApp').controller('PublishedController', ['QuizData', '$log', '$routeParams', '$location', function(QuizData, $log, $routeParams,$location){

    var self = this;
    self.emailAddress = localStorage.getItem("emailAddress");
    self.published = false;
    self.userVerified = localStorage.getItem("userVerified")=="true";

    self.id = parseInt($routeParams.id);
    //self.action = $routeParams.action;
    if(isNaN(self.id)) $location.path("/");

    self.publish = function(){
        $log.debug("Publish with email address:", self.emailAddress, "Quiz:", self.quiz);
        self.statusText = "";

        if(self.userVerified || self.classCode || self.emailAddress){
            if(self.emailAddress && self.emailAddress.length > 0){
              localStorage.setItem("emailAddress",self.emailAddress);
              $("#LoginButton").html("Logout");
              $("#LoginButton").show();
            }
           self.publishing = true;

            var details = { emailAddress: self.emailAddress, access: -1 };
            if(self.classCode) details.code = self.classCode;
            $log.debug("Publishing with details", details, "Quiz", self.quiz);

            QuizData.publishQuiz(self.quiz, details).success(function(result){
                $log.debug("Response from publishing: ", result);
                if (result.status==200) {
                    self.classCode = result.code;
                    self.fullLink = result.link;
                    localStorage.setItem("link",self.fullLink);
                    QuizData.saveClassCode(self.classCode);
                    self.published=true;
                }
                else {
                    self.statusText = "Error when publishing: " + result.message + ". Please Try again";
                }
                self.publishing = false;
            }).error(function(err){
                $log.debug("Error from publishing: ", err);
                self.statusText = err;
            });

        }else{
            self.statusText = "Please provide an email address"
        }
    };

    QuizData.getQuiz(self.id, false, function(qz){
        self.quiz = qz;

        self.classCode = QuizData.getClassCode();


        if(self.classCode || self.userVerified){
            //if (self.action=="p") {
                self.publish();
            // }
            // else {
            //     self.published = true;
            //     self.classCode = localStorage.getItem("classCode");
            //     self.fullLink = localStorage.getItem("link");
            // }
        }
        else {
            $location.path("/preview/"+self.id);
        }

        $log.debug(self);
    });
}]);
