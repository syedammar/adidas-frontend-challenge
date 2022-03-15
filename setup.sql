CREATE TABLE IF NOT EXISTS `users` ( 
                `id` int(11) NOT NULL AUTO_INCREMENT,
                `name` varchar(50) NOT NULL, 
                `email` varchar(100) NOT NULL,
                `password` varchar(255) NOT NULL, 
                PRIMARY KEY (`id`)
                ) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `selected_players` (
                    `id` int(11) NOT NULL AUTO_INCREMENT,
                    `userId` varchar(11) NOT NULL,
                    `teamId` varchar(11) NOT NULL,
                    `teamName` varchar(100) NOT NULL,
                    `playerId` varchar(11) NOT NULL, 
                    `name` varchar(50) NOT NULL, 
                    `nationality` varchar(30) NOT NULL, 
                    `position` varchar(30) NOT NULL, 
                    PRIMARY KEY (id)
                    ) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `teams` (
                    `id` int(11) NOT NULL AUTO_INCREMENT,
                    `userId` varchar(11) NOT NULL,
                    `userTeamName` varchar(50) NOT NULL,
                    `userTeamPlayersIds` varchar(50) NOT NULL,
                    PRIMARY KEY (`id`)
                    ) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

INSERT INTO users (`name`, `email`, `password`) VALUES ('Test User', 'user@test.com', '123456');