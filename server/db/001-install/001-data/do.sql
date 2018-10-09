SET FOREIGN_KEY_CHECKS=0;
-- --------------------------------------------------------

INSERT INTO `api_tab_menu` (`Description`, `Description_courte`, `id_categorie`, `Lien`) VALUES ('menu.match', 'menu.match', '3', 'match');

UPDATE `api_tab_menu_rangs_droit` a
  INNER JOIN `api_tab_menu` b
    ON b.`Lien` = 'match'
  INNER JOIN `api_tab_rangs` c
    ON c.`id` = a.`id_rang`
       AND c.`indice` in (1,10,20,30)
SET `id_menu` = concat(`id_menu`,b.`id`,';');

INSERT INTO `api_tab_menu` (`Description`, `Description_courte`, `id_categorie`, `Lien`) VALUES ('menu.matchLive', 'menu.matchLive', '98', 'matchLive');

UPDATE `api_tab_menu_rangs_droit` a
  INNER JOIN `api_tab_menu` b
    ON b.`Lien` = 'matchLive'
  INNER JOIN `api_tab_rangs` c
    ON c.`id` = a.`id_rang`
       AND c.`indice` in (1,10,20,30)
SET `id_menu` = concat(`id_menu`,b.`id`,';');

--
-- Structure de la table `tab_matchs`
--

CREATE TABLE IF NOT EXISTS `tab_matchs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `teamA` varchar(250) NOT NULL,
  `teamB` varchar(250) NOT NULL,
  `date` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Structure de la table `tab_match_events`
--

CREATE TABLE IF NOT EXISTS `tab_match_events` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `matchId` int(11) NOT NULL,
  `team` varchar(1) NOT NULL,
  `date` datetime NOT NULL,
  `twoMissing` tinyint(1) NOT NULL,
  `twoSuccess` tinyint(1) NOT NULL,
  `treeMissing` tinyint(1) NOT NULL,
  `treeSuccess` tinyint(1) NOT NULL,
  `oneMissing` tinyint(1) NOT NULL,
  `oneSuccess` tinyint(1) NOT NULL,
  `fault` tinyint(1) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `matchId` (`matchId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

--
-- Contraintes pour les tables exportées
--

--
-- Contraintes pour la table tab_match_events`
--
ALTER TABLE `tab_match_events`
ADD CONSTRAINT `fkEventMatch` FOREIGN KEY (`matchId`) REFERENCES `tab_matchs` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- --------------------------------------------------------
SET FOREIGN_KEY_CHECKS=1;