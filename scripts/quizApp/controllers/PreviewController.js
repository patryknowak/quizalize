angular.module('quizApp').controller('PreviewController', ['QuizData', '$log', '$location','$rootScope', '$routeParams', '$scope',function(QuizData, $log, $location,$rootScope,$routeParams,$scope){
    var self = this;

    self.id = $routeParams.id;

    QuizData.previewQuiz(self.id,function(quiz) {
        sessionStorage.setItem("mode","preview");
        self.currentQuiz = quiz;
    })

    self.start = function(){
        var url = "/quiz/private/" + self.id + "/" + QuizData.selectQuestionType(0) + "/0";
        $location.path(url);
    };

    self.return = function() {
        window.close();
    }

    self.cancel = function() {
        window.close();
    };
}]);
