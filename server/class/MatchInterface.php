<?php
namespace Nba;

use Exception;
use Oda\OdaLibBd;
use Oda\OdaRestInterface;
use Oda\SimpleObject\OdaPrepareReqSql;
use \stdClass;

/**
 * Project class
 *
 * Tool
 *
 * @author  Fabrice Rosito <rosito.fabrice@gmail.com>
 * @version 0.150221
 */
class MatchInterface extends OdaRestInterface {
    /**
     */
    function getAll() {
        try {
            $params = new OdaPrepareReqSql();
            $params->sql = "SELECT a.`id`, a.`teamA`, a.`teamB`, a.`date`
                FROM `tab_matchs` a
                WHERE 1=1
                ORDER BY a.`id` DESC
                LIMIT :odaOffset, :odaLimit
            ;";
            $params->bindsValue = [
                "odaOffset" => $this->odaOffset,
                "odaLimit" => $this->odaLimit
            ];
            $params->typeSQL = OdaLibBd::SQL_GET_ALL;
            $retour = $this->BD_ENGINE->reqODASQL($params);

            $this->addDataObject($retour->data->data);
        } catch (Exception $ex) {
            $this->object_retour->strErreur = $ex.'';
            $this->object_retour->statut = self::STATE_ERROR;
            die();
        }
    }

    /**
     * @param $id
     */
    function get($id) {
        try {
            $params = new OdaPrepareReqSql();
            $params->sql = "SELECT a.`id`, a.`teamA`, a.`teamB`, a.`date`
                FROM `tab_matchs` a
                WHERE 1=1
                AND a.`id` = :id
            ;";
            $params->bindsValue = [
                "id" => $id
            ];
            $params->typeSQL = OdaLibBd::SQL_GET_ONE;
            $retour = $this->BD_ENGINE->reqODASQL($params);

            $this->addDataObject($retour->data);
        } catch (Exception $ex) {
            $this->object_retour->strErreur = $ex.'';
            $this->object_retour->statut = self::STATE_ERROR;
            die();
        }
    }

    /**
     */
    function create() {
        try {
            $params = new OdaPrepareReqSql();
            $params->sql = "INSERT INTO `tab_matchs` (
                    `teamA` ,
                    `teamB`,
                    `date`
                )
                VALUES (
                    :teamA, :teamB, NOW()
                )
            ;";
            $params->bindsValue = [
                "teamA" => $this->inputs["teamA"],
                "teamB" => $this->inputs["teamB"]
            ];
            $params->typeSQL = OdaLibBd::SQL_INSERT_ONE;
            $retour = $this->BD_ENGINE->reqODASQL($params);

            $params = new stdClass();
            $params->value = $retour->data;
            $this->addDataStr($params);
        } catch (Exception $ex) {
            $this->object_retour->strErreur = $ex.'';
            $this->object_retour->statut = self::STATE_ERROR;
            die();
        }
    }

    /**
     */
    function createEvent() {
        try {
            $params = new OdaPrepareReqSql();
            $params->sql = "INSERT INTO `tab_match_events` (
                    `matchId` ,
                    `team`,
                    `date`,
                    `twoMissing`,
                    `twoSuccess`,
                    `treeMissing`,
                    `treeSuccess`,
                    `oneMissing`,
                    `oneSuccess`,
                    `fault`
                )
                VALUES (
                    :matchId, :team, NOW(), :twoMissing, :twoSuccess, :treeMissing, :treeSuccess, :oneMissing, :oneSuccess, :fault
                )
            ;";
            $params->bindsValue = [
                "matchId" => $this->inputs["matchId"],
                "team" => $this->inputs["team"],
                "twoMissing" => $this->inputs["twoMissing"],
                "twoSuccess" => $this->inputs["twoSuccess"],
                "treeMissing" => $this->inputs["treeMissing"],
                "treeSuccess" => $this->inputs["treeSuccess"],
                "oneMissing" => $this->inputs["oneMissing"],
                "oneSuccess" => $this->inputs["oneSuccess"],
                "fault" => $this->inputs["fault"]
            ];
            $params->typeSQL = OdaLibBd::SQL_INSERT_ONE;
            $retour = $this->BD_ENGINE->reqODASQL($params);

            $params = new stdClass();
            $params->value = $retour->data;
            $this->addDataStr($params);
        } catch (Exception $ex) {
            $this->object_retour->strErreur = $ex.'';
            $this->object_retour->statut = self::STATE_ERROR;
            die();
        }
    }

    /**
     * @param $matchId
     */
    function getRecapForMatch($matchId) {
        try {
            $sql = "SELECT SUM(a.`twoMissing`) as 'countTwoMissing',
                SUM(a.`twoSuccess`) as 'countTwoSuccess',
                SUM(a.`treeMissing`) as 'countTreeMissing',
                SUM(a.`treeSuccess`) as 'countTreeSuccess',
                SUM(a.`oneMissing`) as 'countOneMissing',
                SUM(a.`oneSuccess`) as 'countOneSuccess',
                SUM(a.`fault`) as 'countFault',
                (SUM(a.`twoSuccess`)*2 + SUM(a.`treeSuccess`)*3 + SUM(a.`oneSuccess`)) as 'score'
                FROM `tab_match_events` a
                WHERE 1=1
                AND a.`matchId` = :matchId
                AND a.`team` = :team
            ;";

            $params = new OdaPrepareReqSql();
            $params->sql = $sql;
            $params->bindsValue = [
                "team" => 'a',
                "matchId" => $matchId
            ];
            $params->typeSQL = OdaLibBd::SQL_GET_ONE;
            $retour = $this->BD_ENGINE->reqODASQL($params);

            $params = new stdClass();
            $params->label = 'teamA';
            $params->value = $retour->data;
            $this->addDataObject($params);

            $params = new OdaPrepareReqSql();
            $params->sql = $sql;
            $params->bindsValue = [
                "team" => 'b',
                "matchId" => $matchId
            ];
            $params->typeSQL = OdaLibBd::SQL_GET_ONE;
            $retour = $this->BD_ENGINE->reqODASQL($params);

            $params = new stdClass();
            $params->label = 'teamB';
            $params->value = $retour->data;
            $this->addDataObject($params);
        } catch (Exception $ex) {
            $this->object_retour->strErreur = $ex.'';
            $this->object_retour->statut = self::STATE_ERROR;
            die();
        }
    }
}