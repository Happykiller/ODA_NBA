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
            $params->sql = "SELECT a.`id`, a.`teamA`, a.`colorA`, a.`teamB`, a.`colorB`, a.`date`,
                (SELECT IFNULL((SUM(b.`twoSuccess`)*2 + SUM(b.`treeSuccess`)*3 + SUM(b.`oneSuccess`)),0)
                FROM `tab_match_events` b
                WHERE 1=1
                AND b.`matchId` = a.`id`
                AND b.`team` = 'a') as 'scoreA',
                (SELECT IFNULL((SUM(c.`twoSuccess`)*2 + SUM(c.`treeSuccess`)*3 + SUM(c.`oneSuccess`)),0)
                FROM `tab_match_events` c
                WHERE 1=1
                AND c.`matchId` = a.`id`
                AND c.`team` = 'b') as 'scoreB'
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
            $params->sql = "SELECT a.`id`, a.`teamA`, a.`colorA`, a.`teamB`, a.`colorB`, a.`date`
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
                    `teamA`,
                    `colorA`,
                    `teamB`,
                    `colorB`,
                    `date`
                )
                VALUES (
                    :teamA, :colorA, :teamB, :colorB, NOW()
                )
            ;";
            $params->bindsValue = [
                "teamA" => $this->inputs["teamA"],
                "colorA" => $this->inputs["colorA"],
                "teamB" => $this->inputs["teamB"],
                "colorB" => $this->inputs["colorB"]
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
    function undoEvent($matchId) {
        try {
            $params = new OdaPrepareReqSql();
            $params->sql = "DELETE FROM `tab_match_events`
              WHERE matchId = :matchId
              ORDER BY id DESC
              LIMIT 1
            ;";
            $params->bindsValue = [
                "matchId" => $matchId
            ];
            $params->typeSQL = OdaLibBd::SQL_SCRIPT;
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
            $sql = "SELECT IFNULL(SUM(a.`twoMissing`),0) as 'countTwoMissing',
                IFNULL(SUM(a.`twoSuccess`),0) as 'countTwoSuccess',
                IFNULL(SUM(a.`treeMissing`),0) as 'countTreeMissing',
                IFNULL(SUM(a.`treeSuccess`),0) as 'countTreeSuccess',
                IFNULL(SUM(a.`oneMissing`),0) as 'countOneMissing',
                IFNULL(SUM(a.`oneSuccess`),0) as 'countOneSuccess',
                IFNULL(SUM(a.`fault`),0) as 'countFault',
                IFNULL((SUM(a.`twoSuccess`)*2 + SUM(a.`treeSuccess`)*3 + SUM(a.`oneSuccess`)),0) as 'score'
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