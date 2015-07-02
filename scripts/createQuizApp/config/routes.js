/* @flow */
var React               = require('react');
// var settings        = require('utils/settings');

var CQPublic            = require('./../components/pages/CQPublic');
var CQProfile           = require('./../components/pages/CQProfile');
var CQNotFound          = require('./../components/pages/CQNotFound');
var CQLogin             = require('./../components/pages/CQLogin');
var CQRegister          = require('./../components/pages/CQRegister');
var CQRecoverPassword   = require('./../components/pages/CQRecoverPassword');
var CQRestorePassword   = require('./../components/pages/CQRestorePassword');
var CQRedirect          = require('./../components/pages/CQRedirect');
var CQQuizzes           = require('./../components/pages/CQQuizzes');
var CQCreate            = require('./../components/pages/CQCreate');
var CQReview            = require('./../components/pages/CQReview');
var CQEdit              = require('./../components/pages/CQEdit');
var CQAssignments       = require('./../components/pages/CQAssignments');
var CQPublished         = require('./../components/pages/CQPublished');
var CQPublishedInfo     = require('./../components/pages/CQPublishedInfo');
var CQSettings          = require('./../components/pages/CQSettings');
var CQApp               = require('./../components/pages/CQApp');
var CQYourApps          = require('./../components/pages/CQYourApps');

var pages = {
    pathParams: {
        quizId: /([\w\-]+)/,
        appId: /([\w\-]+)/,
        authorId: /([\w\-]+)/,
        questionIndex: /([\w\-]+)/,
        classCode: /([\w\-]+)/,
        redirectURL: /([\w\-]+)/,
        code: /([\w\-]+)/
    },
    mainPage: {
        path: '/quiz',
        needsLogin: undefined,
        renderer: function(){
            React.render(
                React.createElement(CQProfile, null),
                document.getElementById('reactApp')
            );
        }
    },

    mainPageWithSlash: {
        path: '/quiz/',
        needsLogin: undefined,
        renderer: function(){
            React.render(
                React.createElement(CQProfile, null),
                document.getElementById('reactApp')
            );
        }
    },

    ownProfilePage: {
        path: '/quiz/user',
        needsLogin: true,
        renderer: function(props: Object){
            React.render(
                React.createElement(CQProfile, props),
                document.getElementById('reactApp')
            );
        }
    },

    profilePage: {
        path: '/quiz/user/:profileId',
        pathRegEx: /\/quiz\/user\/([\w\-]+)/,
        needsLogin: undefined,
        renderer: function(props: Object){
            React.render(
                React.createElement(CQProfile, props),
                document.getElementById('reactApp')
            );
        }
    },

    sharedQuizPage: {
        path: '/quiz/user/:profileId/:quizCode',
        pathRegEx: /\/quiz\/\/user\/([\w\-]+)\/([\w\-]+)/,
        needsLogin: undefined,
        renderer: function(props: Object){
            React.render(
                React.createElement(CQProfile, props),
                document.getElementById('reactApp')
            );
        }
    },

    settingsPage: {
        path: '/quiz/settings',
        needsLogin: true,
        renderer: function(){
            React.render(
                React.createElement(CQSettings, null),
                document.getElementById('reactApp')
            );
        }
    },

    publicPage: {
        path: '/quiz/public',
        needsLogin: undefined,
        renderer: function(){
            React.render(
                React.createElement(CQPublic, null),
                document.getElementById('reactApp')
            );
        }
    },
    loginPage: {
        path: '/quiz/login',
        needsLogin: false,
        renderer: function(){
            React.render(
                React.createElement(CQLogin, null),
                document.getElementById('reactApp')
            );
        }
    },
    registerPage: {
        path: '/quiz/register',
        needsLogin: false,
        renderer: function(){
            React.render(
                React.createElement(CQRegister, null),
                document.getElementById('reactApp')
            );
        }
    },

    registerAndCreatePage: {
        path: '/quiz/register/create',
        needsLogin: false,
        renderer: function(){
            React.render(
                React.createElement(CQRegister, null),
                document.getElementById('reactApp')
            );
        }
    },
    recoverPassword: {
        path: '/quiz/recover',
        needsLogin: false,
        renderer: function(){
            React.render(
                React.createElement(CQRecoverPassword, null),
                document.getElementById('reactApp')
            );
        }
    },
    restorePassword: {
        path: '/quiz/reset/:code',
        pathRegEx: /\/quiz\/reset\/([\w\-]+)/,
        needsLogin: false,
        renderer: function(props: Object){
            React.render(
                React.createElement(CQRestorePassword, props),
                document.getElementById('reactApp')
            );
        }
    },

    yourApps: {
        path: '/quiz/apps',
        needsLogin: true,
        renderer: function(){
            React.render(
                React.createElement(CQYourApps, null),
                document.getElementById('reactApp')
            );
        }
    },

    yourAppsCreate: {
        path: '/quiz/apps/new',
        needsLogin: true,
        renderer: function(){
            var newApp = true;
            React.render(
                React.createElement(CQYourApps, {newApp}),
                document.getElementById('reactApp')
            );
        }
    },

    yourAppsEdit: {
        path: '/quiz/apps/:appId',
        pathRegEx: /\/quiz\/apps\/([\w\-]+)/,
        needsLogin: true,
        renderer: function(props: Object){
            React.render(
                React.createElement(CQYourApps, props),
                document.getElementById('reactApp')
            );
        }
    },

    quizzes: {
        path: '/quiz/quizzes',
        needsLogin: true,
        renderer: function(){
            React.render(
                React.createElement(CQQuizzes, null),
                document.getElementById('reactApp')
            );
        }
    },
    redirect: {
        path: '/quiz/playh/:redirectURL',
        pathRegEx: /\/quiz\/playh\/([\w\-]+)/,
        needsLogin: true,
        renderer: function(props: Object){
            React.render(
                React.createElement(CQRedirect, props),
                document.getElementById('reactApp')
            );
        }
    },

    create: {
        path: '/quiz/create',
        needsLogin: true,
        renderer: function(){
            React.render(
                React.createElement(CQCreate, null),
                document.getElementById('reactApp')
            );
        }
    },
    createApp: {
        path: '/quiz/quizzes/app',
        needsLogin: true,
        renderer: function(){
            React.render(
                React.createElement(CQQuizzes, {appMode: true}),
                document.getElementById('reactApp')
            );
        }
    },

    editQuiz: {
        path: '/quiz/edit/:quizId',
        pathRegEx: /\/quiz\/edit\/([\w\-]+)/,
        needsLogin: true,
        renderer: function(props: Object){
            React.render(
                React.createElement(CQCreate, props),
                document.getElementById('reactApp')
            );
        }
    },

    reviewQuiz: {
        path: '/quiz/review/:quizId',
        pathRegEx: /\/quiz\/review\/([\w\-]+)/,
        needsLogin: true,
        renderer: function(props: Object){
            React.render(
                React.createElement(CQReview, props),
                document.getElementById('reactApp')
            );
        }
    },


    edit: {
        path: '/quiz/create/:quizId',
        pathRegEx: /\/quiz\/create\/([\w\-]+)/,
        needsLogin: true,
        renderer: function(props: Object){
            React.render(
                React.createElement(CQEdit, props),
                document.getElementById('reactApp')
            );
        }
    },

    editQuestion: {
        path: '/quiz/create/:quizId/:questionIndex',
        pathRegEx: /\/quiz\/create\/([\w\-]+)\/([\w\-]+)/,
        needsLogin: true,
        renderer: function(props: Object){
            React.render(
                React.createElement(CQEdit, props),
                document.getElementById('reactApp')
            );
        }
    },

    assignments: {
        path: '/quiz/assignments',
        needsLogin: true,
        renderer: function(){
            React.render(
                React.createElement(CQAssignments, null),
                document.getElementById('reactApp')
            );
        }
    },

    published: {
        path: '/quiz/published/:quizId',
        pathRegEx: /\/quiz\/published\/([\w\-]+)/,
        needsLogin: true,
        renderer: function(props: Object){
            React.render(
                React.createElement(CQPublished, props),
                document.getElementById('reactApp')
            );
        }
    },

    publishedAssign: {
        path: '/quiz/published/:quizId/assign',
        pathRegEx: /\/quiz\/published\/([\w\-]+)\/assign/,
        needsLogin: true,
        renderer: function(props: Object){
            props.assign = true;
            React.render(
                React.createElement(CQPublished, props),
                document.getElementById('reactApp')
            );
        }
    },

    publishedPricing: {
        path: '/quiz/published/:quizId/publish',
        pathRegEx: /\/quiz\/published\/([\w\-]+)\/assign/,
        needsLogin: true,
        renderer: function(props: Object){
            props.publish = true;
            React.render(
                React.createElement(CQPublished, props),
                document.getElementById('reactApp')
            );
        }
    },


    publishedInfo: {
        path: '/quiz/published/:quizId/:classCode/info',
        pathRegEx: /\/quiz\/published\/([\w\-]+)\/([\w\-]+)\/info/,
        needsLogin: true,
        renderer: function(props: Object){
            React.render(
                React.createElement(CQPublishedInfo, props),
                document.getElementById('reactApp')
            );
        }
    },

    app: {
        path: '/quiz/app/:appId',
        pathRegEx: /\/quiz\/app\/([\w\-]+)/,
        needsLogin: undefined,
        renderer: function(props: Object){
            React.render(
                React.createElement(CQApp, props),
                document.getElementById('reactApp')
            );
        }
    },

    pageNotFound: {
        path: '',
        needsLogin: false,
        renderer: function() {
            React.render(
                React.createElement(CQNotFound, null),
                document.getElementById('reactApp')
            );
        }
    }
};

module.exports = pages;
