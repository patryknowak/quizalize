var React = require('react');

var CQSpinner = require('createQuizApp/components/utils/CQSpinner');
var QuizStore = require('createQuizApp/stores/QuizStore');
var TransactionActions = require('createQuizApp/actions/TransactionActions');

var timeouts = [];
var CQViewQuizDetails = React.createClass({

    propTypes: {
        quizId: React.PropTypes.string.isRequired,
        onClose: React.PropTypes.func.isRequired
    },

    getInitialState: function() {
        return this.getState();
    },

    componentDidMount: function() {
        QuizStore.addChangeListener(this.onChange);
        document.addEventListener('keyup', this.keyUpListener);
    },

    componentWillUnmount: function() {
        QuizStore.removeChangeListener(this.onChange);
        document.removeEventListener('keyup', this.keyUpListener);
        timeouts.forEach( t => clearTimeout(t));
        console.log('component unmounted');
    },

    keyUpListener: function(ev){
        if (ev.keyCode === 27) {
            this.handleClose();
        }
    },

    onChange: function(){
        this.setState(this.getState());
    },

    getState: function(){
        var state = {
            quiz: QuizStore.getQuiz(this.props.quizId)
        };

        return state;
    },

    handleClose: function(){
        if (this.state.closed !== true) {
            this.setState({closed: true});

            timeouts.push(setTimeout(()=>{
                console.log('timeeeouuuutt');
                this.setState({removed: true}, ()=> {
                    this.props.onClose();
                });
            }, 350));
        }
    },

    handleBuy: function(){
        if (this.state.quiz) {
            TransactionActions.buyQuiz(this.state.quiz);
        }
    },

    render: function() {

        var quizInfo;

        if (this.state.quiz){
            quizInfo = (
                <div className="cq-quizdetails__cardinner">
                    <div className="cq-quizdetails__info">
                        <h5>
                            {this.state.quiz.meta.category} / {this.state.quiz.meta.subject}
                        </h5>
                        <h1>{this.state.quiz.meta.name}</h1>
                        <p>
                            {this.state.quiz.meta.description}
                        </p>

                        <button className="cq-quizdetails__button" onClick={this.handleBuy}>
                            Use it - it's free!
                        </button>
                    </div>

                    <div className="cq-quizdetails__questionscroller">
                        <div className="cq-quizdetails__questions">
                            <ul>

                                {this.state.quiz.payload.questions.map( question => {
                                    return (
                                        <li key={question.uuid}>
                                            {question.question}
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    </div>
                </div>
            );
        } else {
            quizInfo = (<CQSpinner/>);
        }

        if (this.state.removed !== true){

            return (
                <div className={this.state.closed ? `cq-quizdetails closed` : `cq-quizdetails`}>
                    <div className="cq-quizdetails__card">
                        <div className="cq-quizdetails__close fa fa-times" onClick={this.handleClose}></div>

                        {quizInfo}
                    </div>
                </div>
            );
        } else {
            return null;
        }
    }

});

module.exports = CQViewQuizDetails;
