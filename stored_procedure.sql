DELIMITER $$

DROP PROCEDURE IF EXISTS `register` $$
CREATE PROCEDURE `register`()
BEGIN

  SELECT *
    FROM register;

END $$

DROP PROCEDURE IF EXISTS `profiles` $$
CREATE PROCEDURE `profiles`()
BEGIN

  SELECT *
    FROM profiles;

END $$

DROP PROCEDURE IF EXISTS `comments` $$
CREATE PROCEDURE `comments`()
BEGIN

  SELECT *
    FROM comments;

END $$

DROP PROCEDURE IF EXISTS `feedback` $$
CREATE PROCEDURE `feedback`()
BEGIN

  SELECT *
    FROM feedback;

END $$

DROP PROCEDURE IF EXISTS `friends` $$
CREATE PROCEDURE `friends`()
BEGIN

  SELECT *
    FROM friends;

END $$

DROP PROCEDURE IF EXISTS `todo` $$
CREATE PROCEDURE `todo`()
BEGIN

  SELECT *
    FROM todo;

END $$

DROP PROCEDURE IF EXISTS `uploads` $$
CREATE PROCEDURE `uploads`()
BEGIN

  SELECT *
    FROM uploads;

END $$


DELIMITER ;