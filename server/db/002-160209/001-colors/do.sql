SET FOREIGN_KEY_CHECKS=0;
-- --------------------------------------------------------

ALTER TABLE `@prefix@tab_matchs` ADD `colorA` VARCHAR(50) NOT NULL AFTER `teamA`;
ALTER TABLE `@prefix@tab_matchs` ADD `colorB` VARCHAR(50) NOT NULL AFTER `teamB`;

-- --------------------------------------------------------
SET FOREIGN_KEY_CHECKS=1;