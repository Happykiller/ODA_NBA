SET FOREIGN_KEY_CHECKS=0;
-- --------------------------------------------------------

INSERT INTO `@prefix@api_tab_menu` (`Description`, `Description_courte`, `id_categorie`, `Lien`) VALUES ('match.title', 'match.title', '3', 'match');

UPDATE `@prefix@api_tab_menu_rangs_droit` a
  INNER JOIN `@prefix@api_tab_menu` b
    ON b.`Lien` = 'match'
  INNER JOIN `@prefix@api_tab_rangs` c
    ON c.`id` = a.`id_rang`
       AND c.`indice` in (1,10,20,30)
SET `id_menu` = concat(`id_menu`,b.`id`,';');

--
-- Structure de la table `@prefix@tab_matchs`
--

CREATE TABLE IF NOT EXISTS `@prefix@tab_matchs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `teamA` varchar(250) NOT NULL,
  `teamB` varchar(250) NOT NULL,
  `date` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Structure de la table `@prefix@tab_match_events`
--

CREATE TABLE IF NOT EXISTS `@prefix@tab_match_events` (
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
-- Contraintes pour la table `@prefix@tab_match_events`
--
ALTER TABLE `@prefix@tab_match_events`
ADD CONSTRAINT `fkEventMatch` FOREIGN KEY (`matchId`) REFERENCES `@prefix@tab_matchs` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- --------------------------------------------------------
SET FOREIGN_KEY_CHECKS=1;