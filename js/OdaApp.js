/* global er */
//# sourceURL=OdaApp.js
// Library of tools for the exemple
/**
 * @author FRO
 * @date 15/05/08
 */

(function() {
    'use strict';

    var
        /* version */
        VERSION = '0.1'
    ;
    
    ////////////////////////// PRIVATE METHODS ////////////////////////
    /**
     * @name _init
     * @desc Initialize
     */
    function _init() {
        $.Oda.Event.addListener({name : "oda-fully-loaded", callback : function(e){
            $.Oda.App.startApp();
        }});
    }

    ////////////////////////// PUBLIC METHODS /////////////////////////
    $.Oda.App = {
        /* Version number */
        version: VERSION,
        
        /**
         * @returns {$.Oda.App}
         */
        startApp: function () {
            try {
                $.Oda.Router.addRoute("home", {
                    "path" : "partials/home.html",
                    "title" : "oda-main.home-title",
                    "urls" : ["","home"],
                    "middleWares":["support","auth"]
                });

                $.Oda.Router.addRoute("match", {
                    "path" : "partials/match.html",
                    "title" : "match.title",
                    "urls" : ["match"],
                    "middleWares" : ["support","auth"]
                });

                $.Oda.Router.startRooter();

                return this;
            } catch (er) {
                $.Oda.Log.error("$.Oda.App.startApp : " + er.message);
                return null;
            }
        },

        "Controller" : {
            "Home": {
                /**
                 * @returns {$.Oda.App.Controller.Home}
                 */
                start: function () {
                    try {
                        return this;
                    } catch (er) {
                        $.Oda.Log.error("$.Oda.App.Controller.Home.start : " + er.message);
                        return null;
                    }
                }
            },
            "Match": {
                /**
                 * @returns {$.Oda.App.Controller.Match}
                 */
                start: function () {
                    try {
                        return this;
                    } catch (er) {
                        $.Oda.Log.error("$.Oda.App.Controller.Home.Match : " + er.message);
                        return null;
                    }
                },
            },
            "MatchLive": {
                /**
                 * @returns {$.Oda.App.Controller.MatchLive}
                 */
                start: function () {
                    try {
                        this.displayMatch();
                        return this;
                    } catch (er) {
                        $.Oda.Log.error("$.Oda.App.Controller.Home.MatchLive : " + er.message);
                        return null;
                    }
                },
                /**
                 * @returns {$.Oda.App.Controller.MatchLive}
                 */
                displayMatch : function () {
                    try {
                        var call = $.Oda.Interface.callRest($.Oda.Context.rest+"api/rest/match/1", {functionRetour : function(response){
                            $('#teamALabel').html(response.data.teamA);
                            $('#teamBLabel').html(response.data.teamB);
                        }});
                        var call = $.Oda.Interface.callRest($.Oda.Context.rest+"api/rest/match/1/report/recap/", {functionRetour : function(response){
                            $('#teamAScore').html(response.data.teamA.score);
                            $('#teamATwoMissing').html(response.data.teamA.countTwoMissing);
                            $('#teamATwoSuccess').html(response.data.teamA.countTwoSuccess);
                            $('#teamATreeMissing').html(response.data.teamA.countTreeMissing);
                            $('#teamATreeSuccess').html(response.data.teamA.countTreeSuccess);
                            $('#teamAOneMissing').html(response.data.teamA.countOneMissing);
                            $('#teamAOneSuccess').html(response.data.teamA.countOneSuccess);
                            $('#teamAFault').html(response.data.teamA.countFault);
                            $('#teamBScore').html(response.data.teamB.score);
                            $('#teamBTwoMissing').html(response.data.teamB.countTwoMissing);
                            $('#teamBTwoSuccess').html(response.data.teamB.countTwoSuccess);
                            $('#teamBTreeMissing').html(response.data.teamB.countTreeMissing);
                            $('#teamBTreeSuccess').html(response.data.teamB.countTreeSuccess);
                            $('#teamBOneMissing').html(response.data.teamB.countOneMissing);
                            $('#teamBOneSuccess').html(response.data.teamB.countOneSuccess);
                            $('#teamBFault').html(response.data.teamB.countFault);
                        }});
                        return this;
                    } catch (er) {
                        $.Oda.Log.error("$.Oda.App.Controller.MatchLive.displayMatch : " + er.message);
                        return null;
                    }
                },
                /**
                 * @returns {$.Oda.App.Controller.MatchLive}
                 */
                resize : function () {
                    try {
                        var bt = $('#resize');
                        if(bt.hasClass('glyphicon-resize-small')){
                            bt.removeClass("glyphicon-resize-small");
                            bt.addClass("glyphicon-resize-full");
                            $('#containerTeamA').css("margin-top","0px");
                            $("#title").show();
                            $("#menu-tabs").show();
                            $("nav").show();
                        }else{
                            bt.removeClass("glyphicon-resize-full");
                            bt.addClass("glyphicon-resize-small");
                            $('#containerTeamA').css("margin-top","10px");
                            $("#title").hide();
                            $("#menu-tabs").hide();
                            $("nav").hide();
                        }
                        return this;
                    } catch (er) {
                        $.Oda.Log.error("$.Oda.App.Controller.MatchLive.resize : " + er.message);
                        return null;
                    }
                },
            }
        }

    };

    // Initialize
    _init();

})();
