var React = require('react');
var assign = require('object-assign');
var router = require('createQuizApp/flux/config/router');

var CQPageTemplate = require('createQuizApp/flux/components/CQPageTemplate');

var CQQuestionList = require('./CQQuestionList');
var CQLink = require('createQuizApp/flux/components/utils/CQLink');

var QuizStore = require('createQuizApp/flux/stores/QuizStore');
var QuizActions = require('createQuizApp/flux/actions/QuizActions');

require('./CQEditStyles');

var CQEdit = React.createClass({

    propTypes: {
        quizId: React.PropTypes.string.isRequired
    },


    getInitialState: function() {

        return {
            mode: 'Create'
        };
    },

    _getQuiz: function(props){
        props = props || this.props;
        var quiz = QuizStore.getQuiz(props.quizId);
        console.log("QUIAAA", quiz, props.quizId);
        // if (quiz === undefined){
        //
        // }

        return quiz;
    },

    componentDidMount: function() {
        QuizActions.loadQuiz(this.props.quizId);
        // QuizActions.loadQuizzes();
        QuizStore.addChangeListener(this.onChange);
        this.onChange();

        $(document).on('mouseenter', '[data-toggle="popover"]', function(){
            $(this).popover('show');
        });

        $(document).on('mouseleave', '[data-toggle="popover"]', function(){
            $(this).popover('hide');
        });

    },

    componentWillUnmount: function() {
        QuizStore.removeChangeListener(this.onChange);
        $(document).off('mouseenter');
        $(document).off('mouseleave');
    },

    componentWillReceiveProps: function(nextProps) {
        this.onChange(nextProps);
    },

    onChange: function(props){
        props = props || this.props;

        var newState = {
            quiz: this._getQuiz(props)
        };

        if (newState.quiz){
            newState.quiz.questions = newState.quiz.questions || [];
            if (props.questionIndex) {
                newState.questionIndex = parseInt(props.questionIndex, 10);
            } else {
                newState.questionIndex = newState.quiz.questions.length;
                // newState.questionIndex = this.state.questionIndex;
            }

            // Check if the questionIndex is in range
            if (newState.questionIndex > newState.quiz.questions.length){
                console.warn('Index out of range', newState.quiz.questions);
                setTimeout(function(){
                    router.setRoute(`/quiz/create/${newState.quiz.uuid}`);
                }, 550);
            }
        }
        this.setState(newState);
    },

    handleQuestion: function(question){
        console.log('saving quiestion?????', question);
        var updatedQuiz = assign({}, this.state.quiz);

        var index = this.state.questionIndex;

        if (index === undefined) {
            index = this.state.quiz.questions.length;
        }


        updatedQuiz.questions[index] = question;
        this.setState({quiz: updatedQuiz});
    },

    handleSave: function(newQuestion){
        console.log('saving?', newQuestion);
        var quiz = this.state.quiz;
        quiz.questions[this.state.questionIndex] = newQuestion;
        var questionIndex = quiz.questions.length;

        this.setState({quiz, questionIndex}, ()=>{
            QuizActions.newQuiz(this.state.quiz);
            router.setRoute(`/quiz/create/${quiz.uuid}`);

        });
    },

    render: function() {


        if (this.state.quiz){


            return (
                <CQPageTemplate className="container">
                    <div className="container">
                        <div className="row">
                            <div className="col-xs-12">
                                <div className="well">
                                    <h3>{this.state.mode}
                                        <span style={{color: 'red'}}>Question {this.state.currentQuestion} </span>for {this.state.quiz.name}
                                            <CQLink href={`/quiz/edit/${this.state.quiz.uuid}`}>
                                                <button ng-click="create.editQuiz();" style={{margin: '8px'}} className="btn btn-sm btn-info">
                                                    <span className="glyphicon glyphicon-cog"> </span>
                                                </button>
                                            </CQLink>
                                        </h3>
                                        <p className="small">
                                            Speed Tip: We found clicking is a pain - just hit enter to step through quickly
                                        </p>



                                    </div>

                                    <div className="row">
                                        <div className="col-xs-12">
                                            <div className="row">
                                                <div className="col-sm-7">
                                                    <h2 ng-show="create.quiz.questions.length&gt;1">Your questions</h2><br/>
                                                </div>
                                                <div ol-style="margin-top:21px" className="col-sm-2">
                                                    <a href={`/app#/preview/${this.state.quiz.uuid}`} ng-show="create.quiz.questions.length&gt;0" target="zzishgame" className="btn btn-block btn-info">
                                                        Preview
                                                    </a>

                                                    </div>
                                                <div ol-style="margin-top:21px" className="col-sm-3">
                                                    <CQLink href={`/quiz/published/${this.state.quiz.uuid}`}>

                                                        <button click="create.finished()" ng-show="create.quiz.questions.length&gt;0" className="btn btn-block btn-primary">
                                                            I'm Finished, let's play!
                                                        </button>
                                                    </CQLink>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <CQQuestionList
                                        quiz={this.state.quiz}
                                        questionIndex={this.state.questionIndex}
                                        handleQuestion={this.handleQuestion}
                                        handleSave={this.handleSave}/>
                                </div>
                            </div>
                        </div>
                    </CQPageTemplate>
                );
            } else {
                // add a loading animation
                return (<div>Loading</div>);
            }
        }

    });

    module.exports = CQEdit;
