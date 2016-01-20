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
                    "middleWares" : ["support","auth"],
                    "dependencies" : ["dataTables"]
                });

                $.Oda.Router.addRoute("matchLive", {
                    "path" : "partials/matchLive.html",
                    "title" : "match.title",
                    "urls" : ["matchLive"],
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
                        var call = $.Oda.Interface.callRest($.Oda.Context.rest+"api/rest/match/", {callback : function(response){
                            $.Oda.Display.Table.createDataTable({
                                target: 'divMatchs',
                                data: response.data,
                                option: {
                                    "aaSorting": [[0, 'desc']],
                                },
                                attribute: [
                                    {
                                        header: "Id",
                                        value: function(data, type, full, meta, row){
                                            return row.id;
                                        }
                                    },
                                    {
                                        header: "TeamA",
                                        value: function(data, type, full, meta, row){
                                            return row.teamA;
                                        }
                                    },
                                    {
                                        header: "ScoreA",
                                        value: function(data, type, full, meta, row){
                                            return row.scoreA;
                                        }
                                    },
                                    {
                                        header: "TeamB",
                                        value: function(data, type, full, meta, row){
                                            return row.teamB;
                                        }
                                    },
                                    {
                                        header: "ScoreB",
                                        value: function(data, type, full, meta, row){
                                            return row.scoreB;
                                        }
                                    },
                                    {
                                        header: "Date",
                                        value: function(data, type, full, meta, row){
                                            if(type === 'display'){
                                                return $.Oda.Date.getStrDateTimeFrFromUs(row.date);
                                            }else{
                                                return row.date;
                                            }
                                        }
                                    },
                                    {
                                        header: "Action",
                                        value: function(data, type, full, meta, row){
                                            return '<a onclick="$.Oda.Router.navigateTo({route:\'matchLive\',args:{id:'+row.id+'}});" class="btn btn-primary btn-xs">'+ $.Oda.I8n.get('matchLive','select')+'</a>';
                                        }
                                    }
                                ]
                            })
                        }});
                        return this;
                    } catch (er) {
                        $.Oda.Log.error("$.Oda.App.Controller.Match : " + er.message);
                        return null;
                    }
                },
                /**
                 * @returns {$.Oda.App.Controller.Match}
                 */
                formMatch : function () {
                    try {
                        var strHtml = $.Oda.Display.TemplateHtml.create({
                            template : "formMatch"
                            , scope : {
                            }
                        });

                        $.Oda.Display.Popup.open({
                            "name" : "createMatch",
                            "label" : $.Oda.I8n.get('match','createMatch'),
                            "details" : strHtml,
                            "footer" : '<button type="button" oda-label="oda-main.bt-submit" oda-submit="submit" onclick="$.Oda.App.Controller.Match.submitMatch();" class="btn btn-primary disabled" disabled>Submit</button >',
                            "callback" : function(){
                                $.Oda.Scope.Gardian.add({
                                    id : "createMatch",
                                    listElt : ["teamA","teamB"],
                                    function : function(e){
                                        if( ($("#teamA").data("isOk")) && ($("#teamB").data("isOk")) ){
                                            $("#submit").removeClass("disabled");
                                            $("#submit").removeAttr("disabled");
                                        }else{
                                            $("#submit").addClass("disabled");
                                            $("#submit").attr("disabled", true);
                                        }
                                    }
                                });
                            }
                        });
                        return this;
                    } catch (er) {
                        $.Oda.Log.error("$.Oda.App.Controller.Match.formMatch : " + er.message);
                        return null;
                    }
                },
                /**
                 * @returns {$.Oda.App.Controller.Match}
                 */
                submitMatch : function () {
                    try {
                        var call = $.Oda.Interface.callRest($.Oda.Context.rest+"api/rest/match/", {type: 'POST', callback : function(response){
                            $.Oda.Display.Popup.close({name: 'createMatch'});
                            $.Oda.App.Controller.Match.start();
                        }},{
                            teamA: $('#teamA').val(),
                            teamB: $('#teamB').val()
                        });
                        return this;
                    } catch (er) {
                        $.Oda.Log.error("$.Oda.App.Controller.Match.submitMatch : " + er.message);
                        return null;
                    }
                },
            },
            "MatchLive": {
                currentMatchId: 0,
                /**
                 * @returns {$.Oda.App.Controller.MatchLive}
                 */
                start: function () {
                    try {
                        this.currentMatchId = $.Oda.Router.current.args.id;

                        var call = $.Oda.Interface.callRest($.Oda.Context.rest+"api/rest/match/"+this.currentMatchId, {callback : function(response){
                            $('#teamALabel').html(response.data.teamA);
                            $('#teamBLabel').html(response.data.teamB);
                        }});
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
                        var call = $.Oda.Interface.callRest($.Oda.Context.rest+"api/rest/match/"+this.currentMatchId+"/report/recap/", {callback : function(response){
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
                /**
                 * @param {Object} p_params
                 * @param p_params.?
                 * @returns {$.Oda.App.Controller.MatchLive}
                 */
                updateMatch : function (p_params) {
                    try {
                        p_params.matchId = this.currentMatchId;
                        var call = $.Oda.Interface.callRest($.Oda.Context.rest+"api/rest/match/event/", {type: 'POST', callback: function(response){
                            $.Oda.App.Controller.MatchLive.displayMatch();
                        }},p_params);
                        return this;
                    } catch (er) {
                        $.Oda.Log.error("$.Oda.App.Controller.MatchLive.updateMatch : " + er.message);
                        return null;
                    }
                },
            }
        }

    };

    // Initialize
    _init();

})();
