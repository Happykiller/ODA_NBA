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
                    "middleWares":["support","auth"],
                    "dependencies" : ["dataTables"]
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
                        var call = $.Oda.Interface.callRest($.Oda.Context.rest+"api/rest/match/", {callback : function(response){
                            $.Oda.Display.Table.createDataTable({
                                target: 'divMatchs',
                                data: response.data,
                                option: {
                                    "aaSorting": [[0, 'desc']],
                                },
                                attribute: [
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
                                        header: "TeamA",
                                        align: 'right',
                                        value: function(data, type, full, meta, row){
                                            var strHtml = row.teamA;
                                            if(parseInt(row.scoreA) > parseInt(row.scoreB)){
                                                strHtml = '<div style="font-weight: bold">'+row.teamA+'</div>';
                                            }
                                            return strHtml;
                                        }
                                    },
                                    {
                                        header: "ScoreA",
                                        align: 'right',
                                        value: function(data, type, full, meta, row){
                                            var strHtml = row.scoreA;
                                            if(parseInt(row.scoreA) > parseInt(row.scoreB)){
                                                strHtml = '<div style="font-weight: bold">'+row.scoreA+'</div>';
                                            }
                                            return strHtml;
                                        }
                                    },
                                    {
                                        header: "ScoreB",
                                        value: function(data, type, full, meta, row){
                                            var strHtml = row.scoreB;
                                            if(parseInt(row.scoreB) > parseInt(row.scoreA)){
                                                strHtml = '<div style="font-weight: bold">'+row.scoreB+'</div>';
                                            }
                                            return strHtml;
                                        }
                                    },
                                    {
                                        header: "TeamB",
                                        value: function(data, type, full, meta, row){
                                            var strHtml = row.teamB;
                                            if(parseInt(row.scoreB) > parseInt(row.scoreA)){
                                                strHtml = '<div style="font-weight: bold">'+row.teamB+'</div>';
                                            }
                                            return strHtml;
                                        }
                                    }
                                ]
                            })
                        }});
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
                                            var strHtml = '<a onclick="$.Oda.Router.navigateTo({route:\'matchLive\',args:{id:'+row.id+'}});" class="btn btn-primary btn-xs"><span class="glyphicon glyphicon-eye-open"></span></a>';
                                            strHtml += ' <a onclick="$.Oda.App.Controller.Match.seeStats({id: '+row.id+', date: \''+row.date+'\', teamA: \''+row.teamA+'\', teamB: \''+row.teamB+'\'});" class="btn btn-primary btn-xs"><span class="glyphicon glyphicon-stats"></span></a>';
                                            return strHtml;
                                        }
                                    }
                                ]
                            });
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
                /**
                 * @param {Object} p_params
                 * @param p_params.id
                 * @param p_params.date
                 * @param p_params.teamA
                 * @param p_params.teamB
                 * @returns {$.Oda.App.Controller.Match}
                 */
                seeStats : function (p_params) {
                    try {
                        var strHtml = $.Oda.Display.TemplateHtml.create({
                            template : "templateStats"
                            , scope : {
                                teamA: p_params.teamA,
                                teamB: p_params.teamB
                            }
                        });

                        $.Oda.Display.Popup.open({
                            "name" : "modalStats",
                            "label" : 'N°'+p_params.id+' '+p_params.teamA+' VS '+p_params.teamB+' ('+$.Oda.Date.getStrDateTimeFrFromUs(p_params.date)+')',
                            "details" : strHtml,
                            "callback" : function(){
                                var call = $.Oda.Interface.callRest($.Oda.Context.rest+"api/rest/match/"+p_params.id+"/report/recap/", {callback : function(response){
                                    var teamAOneSuccess = parseInt(response.data.teamA.countOneSuccess);
                                    var teamAOneMissing = parseInt(response.data.teamA.countOneMissing);
                                    var teamAPerc1 = $.Oda.Tooling.arrondir(teamAOneSuccess / (teamAOneSuccess + teamAOneMissing) * 100,2);
                                    $('#teamAPerc1').html(teamAPerc1 + '%');
                                    $('#teamARecap1').html(teamAOneSuccess+'/'+(teamAOneSuccess + teamAOneMissing));
                                    $('#teamAPt1').html(teamAOneSuccess);

                                    var teamBOneSuccess = parseInt(response.data.teamB.countOneSuccess);
                                    var teamBOneMissing = parseInt(response.data.teamB.countOneMissing);
                                    var teamBPerc1 = $.Oda.Tooling.arrondir(teamBOneSuccess / (teamBOneSuccess + teamBOneMissing) * 100,2);
                                    $('#teamBPerc1').html(teamBPerc1 + '%');
                                    $('#teamBRecap1').html(teamBOneSuccess+'/'+(teamBOneSuccess + teamBOneMissing));
                                    $('#teamBPt1').html(teamBOneSuccess);

                                    if(teamAPerc1 > teamBPerc1){
                                        $('#teamAPerc1').addClass('statWinner');
                                        $('#teamBPerc1').addClass('statLooser');
                                    }else if(teamAPerc1 < teamBPerc1){
                                        $('#teamBPerc1').addClass('statWinner');
                                        $('#teamAPerc1').addClass('statLooser');
                                    }
                                    if(teamAOneSuccess > teamBOneSuccess){
                                        $('#teamAPt1').addClass('statWinner');
                                        $('#teamBPt1').addClass('statLooser');
                                    }else if(teamAOneSuccess < teamBOneSuccess){
                                        $('#teamBPt1').addClass('statWinner');
                                        $('#teamAPt1').addClass('statLooser');
                                    }

                                    var teamATwoSuccess = parseInt(response.data.teamA.countTwoSuccess);
                                    var teamATwoMissing = parseInt(response.data.teamA.countTwoMissing);
                                    var teamAPerc2 = $.Oda.Tooling.arrondir(teamATwoSuccess / (teamATwoSuccess + teamATwoMissing) * 100,2);
                                    $('#teamAPerc2').html(teamAPerc2 + '%');
                                    $('#teamARecap2').html(teamATwoSuccess+'/'+(teamATwoSuccess + teamATwoMissing));
                                    $('#teamAPt2').html(teamATwoSuccess*2);

                                    var teamBTwoSuccess = parseInt(response.data.teamB.countTwoSuccess);
                                    var teamBTwoMissing = parseInt(response.data.teamB.countTwoMissing);
                                    var teamBPerc2 = $.Oda.Tooling.arrondir(teamBTwoSuccess / (teamBTwoSuccess + teamBTwoMissing) * 100,2);
                                    $('#teamBPerc2').html(teamBPerc2 + '%');
                                    $('#teamBRecap2').html(teamBTwoSuccess+'/'+(teamBTwoSuccess + teamBTwoMissing));
                                    $('#teamBPt2').html(teamBTwoSuccess*2);

                                    if(teamAPerc2 > teamBPerc2){
                                        $('#teamAPerc2').addClass('statWinner');
                                        $('#teamBPerc2').addClass('statLooser');
                                    }else if(teamAPerc2 < teamBPerc2){
                                        $('#teamBPerc2').addClass('statWinner');
                                        $('#teamAPerc2').addClass('statLooser');
                                    }
                                    if(teamATwoSuccess > teamBTwoSuccess){
                                        $('#teamAPt2').addClass('statWinner');
                                        $('#teamBPt2').addClass('statLooser');
                                    }else if(teamATwoSuccess < teamBTwoSuccess){
                                        $('#teamBPt2').addClass('statWinner');
                                        $('#teamAPt2').addClass('statLooser');
                                    }

                                    var teamATreeSuccess = parseInt(response.data.teamA.countTreeSuccess);
                                    var teamATreeMissing = parseInt(response.data.teamA.countTreeMissing);
                                    var teamAPerc3 = $.Oda.Tooling.arrondir(teamATreeSuccess / (teamATreeSuccess + teamATreeMissing) * 100,2);
                                    $('#teamAPerc3').html(teamAPerc3 + '%');
                                    $('#teamARecap3').html(teamATreeSuccess+'/'+(teamATreeSuccess + teamATreeMissing));
                                    $('#teamAPt3').html(teamATreeSuccess*3);

                                    var teamBTreeSuccess = parseInt(response.data.teamB.countTreeSuccess);
                                    var teamBTreeMissing = parseInt(response.data.teamB.countTreeMissing);
                                    var teamBPerc3 = $.Oda.Tooling.arrondir(teamBTreeSuccess / (teamBTreeSuccess + teamBTreeMissing) * 100,2);
                                    $('#teamBPerc3').html(teamBPerc3 + '%');
                                    $('#teamBRecap3').html(teamBTreeSuccess+'/'+(teamBTreeSuccess + teamBTreeMissing));
                                    $('#teamBPt3').html(teamBTreeSuccess*3);

                                    if(teamAPerc3 > teamBPerc3){
                                        $('#teamAPerc3').addClass('statWinner');
                                        $('#teamBPerc3').addClass('statLooser');
                                    }else if(teamAPerc3 < teamBPerc3){
                                        $('#teamBPerc3').addClass('statWinner');
                                        $('#teamAPerc3').addClass('statLooser');
                                    }
                                    if(teamATreeSuccess > teamBTreeSuccess){
                                        $('#teamAPt3').addClass('statWinner');
                                        $('#teamBPt3').addClass('statLooser');
                                    }else if(teamATreeSuccess < teamBTreeSuccess){
                                        $('#teamBPt3').addClass('statWinner');
                                        $('#teamAPt3').addClass('statLooser');
                                    }

                                    var teamAFault = parseInt(response.data.teamA.countFault);
                                    var teamBFault = parseInt(response.data.teamB.countFault);
                                    var teamAPercFault = $.Oda.Tooling.arrondir(teamAFault / (teamAFault + teamBFault) * 100,2);
                                    var teamBPercFault = $.Oda.Tooling.arrondir(teamBFault / (teamAFault + teamBFault) * 100,2);
                                    $('#teamAPercFault').html(teamAPercFault + '%');
                                    $('#teamARecapFault').html(teamAFault+'/'+(teamAFault + teamBFault));
                                    $('#teamAFault').html(teamAFault);
                                    $('#teamBPercFault').html(teamBPercFault + '%');
                                    $('#teamBRecapFault').html(teamBFault+'/'+(teamAFault + teamBFault));
                                    $('#teamBFault').html(teamBFault);

                                    if(teamAFault > teamBFault){
                                        $('#teamBPercFault').addClass('statWinner');
                                        $('#teamAPercFault').addClass('statLooser');
                                        $('#teamBFault').addClass('statWinner');
                                        $('#teamAFault').addClass('statLooser');
                                    }else if(teamAFault < teamBFault){
                                        $('#teamAPercFault').addClass('statWinner');
                                        $('#teamBPercFault').addClass('statLooser');
                                        $('#teamAFault').addClass('statWinner');
                                        $('#teamBFault').addClass('statLooser');
                                    }

                                    var teamATotalSuccess = teamAOneSuccess + teamATwoSuccess + teamATreeSuccess;
                                    var teamATotalMissing = teamAOneMissing + teamATwoMissing + teamATreeMissing;
                                    var teamBTotalSuccess = teamBOneSuccess + teamBTwoSuccess + teamBTreeSuccess;
                                    var teamBTotalMissing = teamBOneMissing + teamBTwoMissing + teamBTreeMissing;
                                    var teamAPercTotal = $.Oda.Tooling.arrondir(teamATotalSuccess / (teamATotalSuccess + teamATotalMissing) * 100,2);
                                    var teamBPercTotal = $.Oda.Tooling.arrondir(teamBTotalSuccess / (teamBTotalSuccess + teamBTotalMissing) * 100,2);
                                    var teamATotal = teamAOneSuccess + teamATwoSuccess*2 + teamATreeSuccess*3;
                                    var teamBTotal = teamBOneSuccess + teamBTwoSuccess*2 + teamBTreeSuccess*3;
                                    $('#teamAPercTotal').html(teamAPercTotal + '%');
                                    $('#teamARecapTotal').html(teamATotalSuccess+'/'+(teamATotalSuccess + teamATotalMissing));
                                    $('#teamATotal').html(teamAOneSuccess + teamATwoSuccess*2 + teamATreeSuccess*3);
                                    $('#teamBPercTotal').html(teamBPercTotal + '%');
                                    $('#teamBRecapTotal').html(teamBTotalSuccess+'/'+(teamBTotalSuccess + teamBTotalMissing));
                                    $('#teamBTotal').html(teamBTotal);

                                    if(teamATotal > teamBTotal){
                                        $('#teamATotal').addClass('statWinner');
                                        $('#teamBTotal').addClass('statLooser');
                                    }else if(teamATotal < teamBTotal){
                                        $('#teamBTotal').addClass('statWinner');
                                        $('#teamATotal').addClass('statLooser');
                                    }
                                    if(teamAPercTotal > teamBPercTotal){
                                        $('#teamAPercTotal').addClass('statWinner');
                                        $('#teamBPercTotal').addClass('statLooser');
                                    }else if(teamAPercTotal < teamBPercTotal){
                                        $('#teamBPercTotal').addClass('statWinner');
                                        $('#teamAPercTotal').addClass('statLooser');
                                    }
                                }});
                            }
                        });
                        return this;
                    } catch (er) {
                        $.Oda.Log.error("$.Oda.App.Controller.Match.seeStats : " + er.message);
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
                /**
                 * @returns {$.Oda.App.Controller.MatchLive}
                 */
                undo : function () {
                    try {
                        var call = $.Oda.Interface.callRest($.Oda.Context.rest+"api/rest/match/"+this.currentMatchId+"/event/", {type: 'DELETE', callback: function(response){
                            $.Oda.App.Controller.MatchLive.displayMatch();
                        }});
                        return this;
                    } catch (er) {
                        $.Oda.Log.error("$.Oda.App.Controller.MatchLive.undo : " + er.message);
                        return null;
                    }
                },
            }
        }

    };

    // Initialize
    _init();

})();
