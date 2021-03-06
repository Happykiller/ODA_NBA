<?php

namespace Nba;

require '../header.php';
require "../vendor/autoload.php";
require '../config/config.php';

use 
    stdClass,
    Slim\Slim,
    Oda\OdaLibBd,
    cebe\markdown\GithubMarkdown,
    Oda\OdaRestInterface,
    Oda\SimpleObject\OdaPrepareInterface,
    Oda\SimpleObject\OdaPrepareReqSql
;

$slim = new Slim();
//--------------------------------------------------------------------------

$slim->notFound(function () use ($slim) {
    $params = new OdaPrepareInterface($slim);
    $INTERFACE = new OdaRestInterface($params);
    $INTERFACE->dieInError('not found');
});

$slim->get('/', function () {
    $markdown = file_get_contents('./doc.markdown', true);
    $parser = new GithubMarkdown();
    echo $parser->parse($markdown);
});

//--------------------------------------------------------------------------
// MATCH

$slim->get('/match/', function () use ($slim) {
    $params = new OdaPrepareInterface($slim);
    $INTERFACE = new MatchInterface($params);
    $INTERFACE->getAll();
});

$slim->get('/match/:id', function ($id) use ($slim) {
    $params = new OdaPrepareInterface($slim);
    $INTERFACE = new MatchInterface($params);
    $INTERFACE->get($id);
});

$slim->post('/match/', function () use ($slim) {
    $params = new OdaPrepareInterface($slim);
    $params->arrayInput = array("teamA", "colorA", "teamB", "colorB");
    $params->modePublic = false;
    $INTERFACE = new MatchInterface($params);
    $INTERFACE->create();
});

$slim->get('/match/:id/report/recap/', function ($id) use ($slim) {
    $params = new OdaPrepareInterface($slim);
    $INTERFACE = new MatchInterface($params);
    $INTERFACE->getRecapForMatch($id);
});

$slim->post('/match/event/', function () use ($slim) {
    $params = new OdaPrepareInterface($slim);
    $params->arrayInput = array("matchId","team");
    $params->arrayInputOpt = array("twoMissing"=>0,"twoSuccess"=>0,"treeMissing"=>0,"treeSuccess"=>0,"oneMissing"=>0,"oneSuccess"=>0,"fault"=>0,"lost"=>0,"steal"=>0);
    $params->modePublic = false;
    $INTERFACE = new MatchInterface($params);
    $INTERFACE->createEvent();
});

$slim->delete('/match/:id/event/', function ($id) use ($slim) {
    $params = new OdaPrepareInterface($slim);
    $params->modePublic = false;
    $INTERFACE = new MatchInterface($params);
    $INTERFACE->undoEvent($id);
});

//--------------------------------------------------------------------------
$slim->run();