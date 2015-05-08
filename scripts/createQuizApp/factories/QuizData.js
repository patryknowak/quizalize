
angular.module('createQuizApp').factory('QuizData', ['$http', '$log', function($http, $log){
    var uuid = require('node-uuid');

    //this is to ensure we're not saving a quiz, while it's being saved
    var savingQuiz = false;

    //callbacks for messaging
    var callbacks = {};

    //these are data object we have (that we would lost if screen was refreshed)    
    var userUuid = localStorage.getItem("userId"); 
    var userName = localStorage.getItem("userName"); 
    var currentClass = JSON.parse(localStorage.getItem("currentClass"));    
    var topics = null;
    var rootTopicId = null;

    //these are data object we have that we can get back if we lose
    var classList = JSON.parse(localStorage.getItem("classList"));
    if (!classList) {
        classList = [];
    }
    var quizData = JSON.parse(localStorage.getItem("quizData"));
    if(!quizData){
        quizData = {};
    }
    else {
        if (Array.isArray(quizData)) {
            var quizHash = {};
            for (var i in quizData) {
                quizHash[quizData[i].uuid] = quizData[i];
            }
            quizData = quizHash; 
            localStorage.setItem("quizData",JSON.stringify(quizData));
        }
    }
    //Post Topic
    var postTopic = function(topic){
        if (topics!=null) {
            topics.push(topic);
        }
        return $http.post("/create/" + userUuid + "/topics/", topic);
    };

    var processQuizList = function(result,callback){
        self.categories = [];
        var categories = {};
        for (var i in result.contents) {
            var quiz = result.contents[i];
            var cuuid = "undefined";
            var category = { name: "Other" };
            if (quiz.categoryId!=undefined) {
                cuuid = quiz.categoryId;
                if (result.categories!=undefined) {
                    for (var i in result.categories) {
                        if (result.categories[i].uuid==quiz.categoryId) {
                            category = result.categories[i];
                        }
                    }
                }
            }
            if (categories[cuuid]==undefined) {
                categories[cuuid] = { category: category, quizzes: [], order_index: parseInt(category.index)} ;
            }
            if (category.name=="") {
                category.homework = true;
            }
            if (category.homework) {
                category.name="Quizzes (" + categories[cuuid].quizzes.length + ")";
            }
            categories[cuuid].quizzes.push(quiz);
        }
        for (var i in categories) {
            self.categories.push(categories[i]);
        }
        callback();
    }; 

    var getClassList = function(callback) {
        if (classList=="" || classList==undefined || classList.length==0) {
            $http.get("/users/" + userUuid + "/groups/").success(function(resp){
                $log.debug("Response from server for getting groups", resp);
                classList = resp;
                localStorage.setItem("classList",JSON.stringify(classList));
                callback(resp);                    
            }).error(function(er){
                $log.debug("Error from server when getting groups", er);
            });                
        }     
        else {
            return callback(classList);       
        }        
    }   

    var getClassForName = function(className,callback) {

        getClassList(function(classList) {
            for (var i in classList) {
                if (classList[i].name==className) {
                    callback(classList[i]);
                    return;
                }
            }
            callback();
            //didn't find it            
        })

    }

    var getGroupContents = function(callback) {
        $http.get("/users/" + userUuid + "/groups/contents").success(function(resp){
            $log.debug("Response from server for getting group Contents", resp);                
            self.groupContents = { };
            for (var i in resp) {
                var content = resp[i];
                if (self.groupContents[content.groupCode]==undefined) {
                    self.groupContents[content.groupCode] = { contents: [] };
                }
                self.groupContents[content.groupCode].contents.push(content);
            }
            callback(self.groupContents);                    
        }).error(function(er){
            $log.debug("Error from server when getting groups", er);
        });          
    }

    var setRootTopic = function(topicId) {
        self.rootTopicId = topicId;
    }

    var setUser = function(user) {
        if (user==undefined) {
            userUuid = "";    
            localStorage.clear();
            $("#LoginButton").html("Login");
            $("#assignments").hide();            
            $("#quizzes").hide();                        
        }
        else {
            userUuid = user.uuid;
            userName = user.name;
            localStorage.setItem("userId",userUuid);
            localStorage.setItem("userName",userName);
            $("#LoginButton").html("Logout");
            $("#quizzes").show();
            $("#assignments").show();
        }        
    }

    return{
        //User methods
        unsetUser: function() {
            var result = userUuid!="" && userUuid!=undefined;
            setUser(null);            
            return result;
        },
        getUser: function () {
            return userUuid;
        },
        setUser: function (user) {
            setUser(user);
        },
        registerEmailAddress: function(email) {
            return $http.post("/users/register", {emailAddress: email});
        },        
        //class methods
        getCurrentClass: function() {
            return currentClass;
        },
        getClassList: function(callback) {
            return getClassList(callback);
        },
        addClass: function(name,code,link) {
            var obj = {
                name: name,
                code: code,
                link: link
            }            
            classList.push(obj);
            currentClass = obj; 
            localStorage.setItem("currentClass",JSON.stringify(currentClass));
            return obj;
        },
        setCurrentClass: function(className,callback) {
            getClassForName(className,function(data) {
                currentClass = data;
                localStorage.setItem("currentClass",JSON.stringify(currentClass));
                callback(currentClass);
            })
        },
        getClassForName: function(className,callback) {
            getClassForName(className,callback);
        },
        //group content (list of assigned quizzes)
        getGroupContents: function (callback) {
            if (self.groupContents==undefined) {
                getGroupContents(callback);              
            }
            else {
                callback(self.groupContents);
            }
        },
        //topic methods
        setRootTopic: function(topicId) {
            setRootTopic(topicId);
        },
        getRootTopic: function() {
            return self.rootTopicId;
        },
        getTopics: function( callback){
            if (userUuid!="") {
                if (topics==undefined) {
                    $http.get("/create/" + userUuid + "/topics/").success(function(resp){
                        $log.debug("Response from server for getting topics", resp);
                        self.topics = {};
                        for (var i in resp) {
                            self.topics[resp[i].uuid] = resp[i];
                        }
                        callback(resp);
                    }).error(function(er){
                        $log.debug("Error from server when getting topics`", er);
                    });                
                }
                else {
                    callback(topics);
                }
            }
        },
        getCategories: function() {
            //created when quizzes are processed
            return self.categories;
        },



        //quiz methods
        getQuizzes: function(callback){
            if (userUuid!="") {
                $http.get("/create/" + userUuid + "/quizzes/").success(
                    function(resp){
                        quizData = {};
                        for (var i in resp) {
                            quizData[resp[i].uuid] = resp[i];
                        }                        
                        localStorage.setItem("quizData",JSON.stringify(quizData));
                        callback(quizData);
                    }
                );
            }
        },          
        getPublicQuizzes: function(callback){
            if (userUuid!="") {
                $http.get("/quizzes/" + userUuid + "/public").success(function(resp){
                    $log.debug("Response from server for getting public quizzes", resp);
                    processQuizList(resp,function() {
                        callback(resp);    
                    });                
                }).error(function(er){
                    $log.debug("Error from server when getting public quizzes`", er);
                });                
            }
        },  
        addQuizById: function(quizId, callback){
            quizData[quiz.uuid]={uuid: quizId};
        },
        addQuiz: function(quiz, callback){
            //get UserId (creates on if it doesn't already exist);
            var rootTopicId = quiz.categoryId;
            if (rootTopicId=="-1") {
                //we don't have the root category, so we need to create
                //need to add the category
                rootTopicId = uuid.v4();
                postTopic({ name: quiz.category, parentCategoryId: "-1", uuid: rootTopicId, subContent: false})
                quiz.categoryId = rootTopicId;
            }
            setRootTopic(rootTopicId);
            if (quiz.uuid==undefined) {
                quiz.uuid = uuid.v4();
            }
            quizData[quiz.uuid]=quiz;
            localStorage.setItem("quizData", JSON.stringify(quizData));
            callback(quiz.uuid);
        },              
        getQuiz: function(id, loadFromServer, callback){
            if(typeof quizData[id] != 'undefined'){
                if(typeof quizData[id].questions != 'undefined' || quizData[id].publicAssigned){
                    $log.debug("Questions local or public");
                    callback(quizData[id]);
                } else {
                    if (loadFromServer) {
                        $log.debug("No questions, so fetching from server");
                        $http.get("/create/" + userUuid + "/quizzes/" + quizData[id].uuid).success(function(resp){
                            $log.debug("Response from server for getting a quiz", resp);
                            quizData[id].uuid = resp;
                            localStorage.setItem("quizData", JSON.stringify(quizData));
                            callback(resp);
                        }).error(function(er){
                            $log.debug("Error from server when getting quiz", er);
                        });
                    }
                    else {
                        $log.debug("No questions, not loading from server");
                        callback({uuid: quizData[id].uuid});
                    }
                }
            }            
        },
        saveQuiz: function(id, quiz,topics){
            quizData[id] = quiz;
            $log.debug("Saving Quiz: ", quizData);

            for (var i in topics) {
                if (topics[i].newObject!=undefined && topics[i].newObject) {
                    topics[i].newObject = null;
                    postTopic(topics[i]).success(function(resp){
                        $log.debug("Returning from post topic");
                    });
                }
            }
            if (!savingQuiz) {
                $log.debug("About to post");
                savingQuiz = true;
                $http.post("/create/" + userUuid + "/quizzes/" + quiz.uuid, quiz).success(function(resp){
                    $log.debug("Returning from post");                    
                    savingQuiz = false;
                }).error(function(er){  
                    $log.debug("Returning from post");
                    savingQuiz = false;
                });
            }
        },        
        deleteQuiz: function(id,callback){
            var quiz = quizData[id];
            delete quizData[id];
            localStorage.setItem("quizData", JSON.stringify(quizData));
            $http.post("/create/" + userUuid + "/quizzes/" + quiz.uuid + "/delete", {}).success(function(result){
                callback();
            });                
        },
        publishQuiz: function(quiz, details,callback){
            $log.debug("Publish Quiz", quiz, details);
            $http.post("/create/" + userUuid + "/quizzes/" + quiz.uuid + "/publish", details).success(function(result){
                getGroupContents(function() {
                    callback(null,result);
                });              
            }).error(function(err,message){
                callback(err,message);
            });
        },
        unpublishQuiz: function(quizId, code){
            $log.debug("UnPublish Quiz", quizId, code);
            $http.post("/create/" + userUuid + "/quizzes/" + quizId + "/" + code + "/unpublish",{}).success(function(result){
                $log.debug("Response from unpublishing: ", result);
                var idx = 0;
                var found = false;
                for (;idx<self.groupContents[code].contents.length;idx++) {
                    if (self.groupContents[code].contents[idx].contentId==quizId) {
                        found = true;
                        break;
                    }
                }
                if (found) {
                    self.groupContents[code].contents.splice(idx,1);
                }                
                //remove it from groupContents
            }).error(function(err){
                $log.debug("Error from unpublishing: ", err);
                self.statusText = err;
            });
        },  
        getEncryptedLink: function(id,callback) {
            $http.get("/create/" + userUuid + "/quizzes/" + id + "/encrypt").success(function(result){
                $log.debug("Response from sharing: ", result);                    
                callback(result);
            }).error(function(err){
                $log.debug("Error from sharing: ", err);
            });
        },
        shareQuiz: function(id, emails,link) {
            var tokensSpace = emails.split(" ");
            var tokensColon = emails.split(";");
            var tokensComma = emails.split(",");
            var data = {
                email: userName,
                quiz: quizData[id].name          
            }
            if (tokensSpace.length>1) {
                data['emails'] = tokensSpace;
            }
            else if (tokensColon.length>1) {
                data['emails'] = tokensColon;
            }
            else if (tokensComma.length>1) {
                data['emails'] = tokensComma;
            }
            else {
                data['emails'] = [emails];    
            }            
            if (link!=undefined) {
                data['link'] = link;
            }
            $http.post("/create/" + userUuid + "/quizzes/" + id + "/share",data).success(function(result){
                $log.debug("Response from sharing: ", result);                    
            }).error(function(err){
                $log.debug("Error from sharing: ", err);
            });
        },    
        //message methods
        showMessage : function(title,message,callBack) {
            if (callBack!=null) {
                var uuidGen = uuid.v4();    
                $("#modalUuid").val(uuidGen);
                callbacks[uuidGen]=callBack;
            }
            else {
                $("#modalUuid").val("");
            }
            $("#modalTitle").html(title);
            $("#closeButton").hide();
            $("#modalMessage").html(message);
            $("#closeButton").html("OK");
            $("#messageButton").click();                
        },
        confirmWithUser : function(title,message,callBack) {
            var uuidGen = uuid.v4();
            $("#modalUuid").val(uuidGen);
            callbacks[uuidGen]=callBack;
            $("#modalTitle").html(title);
            $("#closeButton").show();
            $("#modalMessage").html(message);
            $("#closeButton").html("No");
            $("#confirmButton").html("Yes");            
            $("#messageButton").click();                
        },
        confirmed: function(uuid) {
            if (uuid!=undefined && uuid!="" && callbacks[uuid]!=undefined) {
                var x = callbacks[uuid];
                delete callbacks[uuid];
                x();
            }
        }            
    };
}]);
