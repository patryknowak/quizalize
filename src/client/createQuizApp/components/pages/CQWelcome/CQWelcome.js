import React from 'react';
import CQPageTemplate from './../../../components/CQPageTemplate';
import AnalyticsActions from './../../../actions/AnalyticsActions';
import MeStore from './../../../stores/MeStore';
import CQLink from './../../../components/utils/CQLink';
import CQWelcomeVideo from './CQWelcomeVideo';
import CQWelcomeQuiz from './CQWelcomeQuiz';

// assets
import cta1 from './../../../../assets/welcome_cta1.svg';
import cta2 from './../../../../assets/welcome_cta2.svg';
import cta3 from './../../../../assets/welcome_cta3.svg';
// import cta4 from './../../../../assets/welcome_cta4.svg';
import cta5 from './../../../../assets/welcome_cta5.svg';
import cta7 from './../../../../assets/welcome_cta7.svg';
import ctaNew from './../../../../assets/welcome_button_new.png';


class CQWelcome extends React.Component {

    constructor(props: Object){
        super(props);
        this.state = {
            user: MeStore.state,
            isVideoOpen: false,
            isQuizOpen: false
        };
        this.handleWatchVideo = this.handleWatchVideo.bind(this);
        this.handlePlayDemo = this.handlePlayDemo.bind(this);
        this.handleDismiss = this.handleDismiss.bind(this);
        this.onChange = this.onChange.bind(this);
        // this.handleBrowseMarketplace = this.handleBrowseMarketplace.bind(this);
    }

    componentDidMount() {
        MeStore.addChangeListener(this.onChange);
    }

    componentWillUnmount() {
        MeStore.removeChangeListener(this.onChange);
    }

    onChange(){
        console.log('FUCK ME, this should update');
        this.setState({user: MeStore.state});
    }

    handlePlayDemo(){
        AnalyticsActions.sendEvent('welcome_screen', 'play_demo');
        AnalyticsActions.sendIntercomEvent('welcome_play_demo');
        window.sessionStorage.setItem('mode', 'demo');
        // window.open('/app#/play/public/3af911c5-755f-445e-9483-0fbb8d6d9194');
        this.setState({isQuizOpen: true});

        // window.open(`/app#/preview/${quiz.meta.profileId}/${quiz.uuid}`, 'preview');
    }

    handleWatchVideo(){
        AnalyticsActions.sendEvent('welcome_screen', 'watch_video');
        AnalyticsActions.sendIntercomEvent('welcome_watch_video');
        this.setState({isVideoOpen: true});
    }

    handleReadGuide(){
        AnalyticsActions.sendEvent('welcome_screen', 'read_guide');
        AnalyticsActions.sendIntercomEvent('welcome_read_guide');
        window.open('https://s3-eu-west-1.amazonaws.com/quizalize/Quizalize+Teacher+Guide.pdf');

    }

    handlePreviewDashboard(){
        AnalyticsActions.sendEvent('welcome_screen', 'preview_dashboard');
        AnalyticsActions.sendIntercomEvent('welcome_preview_dashboard');
    }

    handleCreateQuiz(){
        AnalyticsActions.sendEvent('welcome_screen', 'create_quiz');
        AnalyticsActions.sendIntercomEvent('welcome_create_quiz');
    }

    handleBrowseMarketplace(){
        AnalyticsActions.sendEvent('welcome_screen', 'browse_marketplace');
        AnalyticsActions.sendIntercomEvent('welcome_browse_marketplace');
    }

    handleDismiss(){
        this.setState({isVideoOpen: false, isQuizOpen: false});
    }

    // <li className="cq-welcome__actions__action__4" onClick={this.handlePreviewDashboard}>
    //     <div className="cq-welcome__actions__image">
    //         <img src={cta4} alt="Preview a dashboard"/>
    //     </div>
    //     Preview a dashboard
    // </li>
    render () {
        let name = this.state.user.name ? ` ${this.state.user.name}` : '';
        let video = this.state.isVideoOpen ? <CQWelcomeVideo onDismiss={this.handleDismiss}/> : undefined;
        let quiz = this.state.isQuizOpen ? <CQWelcomeQuiz onDismiss={this.handleDismiss}/> : undefined;
        let welcomeMessage, subTitle;
        if (MeStore.isPremium()){
            welcomeMessage = 'You have a Quizalize Unlimited Account';
            subTitle = (<p className="cq-welcome__header__sub">Unlimited private quizzes, unlimited classes, and progress tracking</p>);
        } else {
            welcomeMessage = 'You have a Quizalize Basic Account';
        }
        return (
            <CQPageTemplate className="cq-welcome__page">
                {video}{quiz}
                <div className="cq-welcome">
                    <img src="/cquiz/img/logo 2.png" className="cq-welcome__brand"/>
                    <h1 className="cq-welcome__header">
                        Welcome{name}! {` ${welcomeMessage}`}
                    </h1>
                    {subTitle}

                    <div className="cq-welcome__star">
                        <div className="cq-welcome__star__content">
                            <b>We’re <br/>growing fast!</b>
                            <div>
                                1800+ schools <br/>
                                72 countries<br/>
                                after just<br/>
                                one month<br/>
                            </div>
                        </div>
                    </div>

                    <ul className="cq-welcome__actions">
                        <li className="cq-welcome__actions__action__2" onClick={this.handleWatchVideo}>
                            <div className="cq-welcome__actions__image">
                                <img src={cta2} alt="Watch the video"/>
                            </div>
                            Watch the video
                        </li>
                        <li className="cq-welcome__actions__action__3" onClick={this.handleReadGuide}>
                            <div className="cq-welcome__actions__image">
                                <img src={cta3} alt="Printable guide"/>
                            </div>
                            Printable guide
                        </li>
                        <li className="cq-welcome__actions__action__1" onClick={this.handlePlayDemo}>
                            <div className="cq-welcome__actions__image">
                                <img src={cta1} alt="Play"/>
                            </div>
                            Play a demo quiz
                        </li>

                    </ul>

                    <div className="cq-welcome__box1__border">
                        <div className="cq-welcome__box1 clearfix">
                            <h1 className="cq-welcome__box1__header">
                                Create an instant classroom quiz
                            </h1>
                            <div className="cq-welcome__box1__text">
                                Play in class or as homework
                                <div className="cq-welcome__box1__text__alt">
                                    Just type in your questions and it’s ready to go
                                </div>
                            </div>


                            <CQLink href='/quiz/create' className="cq-welcome__box1__button" onClick={this.handleCreateQuiz}>
                                <img src={cta5} alt="Create a quiz"/>
                                Create a quiz
                            </CQLink>

                        </div>
                    </div>

                    <div className="cq-welcome__box2__border">
                        <div className="cq-welcome__box2 clearfix">
                            <div className="cq-welcome__box2__header">
                                …or grab one made by another teacher
                            </div>

                            <div className="cq-welcome__box2__text">
                                See if a great quiz on your topic already exists <br/>
                                Edit the questions to suit your class
                                <div className="cq-welcome__box2__text__alt">
                                    or make a new one, and help hundreds of other teachers by sharing it here!
                                </div>

                            </div>
                            <CQLink href='/quiz/marketplace' className="cq-welcome__box2__button" onClick={this.handleBrowseMarketplace}>
                                <img src={cta7} alt="Create a quiz"/>
                                <img src={ctaNew} alt="" className="cq-welcome__box2__button__new"/>
                                Browse marketplace
                            </CQLink>
                        </div>
                    </div>
                    </div>
            </CQPageTemplate>
        );
    }
}

export default CQWelcome;
