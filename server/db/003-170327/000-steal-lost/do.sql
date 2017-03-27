SET FOREIGN_KEY_CHECKS=0;
-- --------------------------------------------------------
ALTER TABLE `@prefix@tab_match_events` ADD `lost` TINYINT(1) NOT NULL AFTER `fault`, ADD `steal` TINYINT(1) NOT NULL AFTER `lost`;
-- --------------------------------------------------------
SET FOREIGN_KEY_CHECKS=1;