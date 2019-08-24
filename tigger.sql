DELIMITER $$
CREATE TRIGGER adult
    BEFORE INSERT ON age FOR EACH ROW
    BEGIN
        IF NEW.age<18
        THEN
            SIGNAL SQLSTATE '45000'
                SET MESSAGE_TEXT = 'must be adult';
        END IF;
    END;
$$
DELIMITER ;