/* @flow */
import React from 'react';
import { router } from './../../../config';
import { urlParams } from './../../../utils';
import {
    CQPageTemplate,
    CQLoginForm,
    CQLink,
    CQZzishLogin
} from './../../../components';
import { UserActions, AnalyticsActions } from './../../../actions';


var CQLogin = React.createClass({

    getInitialState: function() {
        let isZzishRedirect = urlParams().token ? true : false;
        let isNew = urlParams().n ? true : false;
        if (isNew) {
            AnalyticsActions.triggerPixels();
        }
        return { isZzishRedirect };
    },


    handleChange: function(property:string, event:Object) {

        var newState = {};
        newState[property] = event.target.value;
        this.setState(newState);
    },

    handleLogin: function(data:Object){

        UserActions.login(data)
            .then(function(){
                router.setRoute('/quiz/user');
            })
            .catch(function(err){
                if (err == "Error: Failed Dependency") {
                    swal('Zzish Login Error', 'It looks like you might be using your Zzish details to log into Quizalize. Click below to use Zzish instead');
                }
                else {
                    swal('Login Error', 'Invalid Details during login');
                }
            });
    },


    render: function() {

        if (this.state.isZzishRedirect){
            return (
                <CQPageTemplate className="cq-login">
                    <CQZzishLogin/>
                </CQPageTemplate>
            );
        }

        return (
            <CQPageTemplate className="cq-login">

                <div className="cq-login__inner">
                    <h2 id="title" className="cq-login__header">
                        Quizalize Login
                    </h2>
                    <CQLoginForm onSubmit={this.handleLogin}>

                        <div className="cq-login__register">
                            Don't have an account?{` `} <br/>
                            <CQLink href={`/quiz/register${window.location.search}`}>

                                Sign Up


                            </CQLink>
                        </div>
                        <div className="cq-login__forgotten">
                            Forgotten Password?{` `} <br/>
                            <CQLink href="/quiz/recover">Reset</CQLink>
                        </div>

                    </CQLoginForm>

                </div>

                <CQZzishLogin/>

            </CQPageTemplate>
        );
    }

});

module.exports = CQLogin;
