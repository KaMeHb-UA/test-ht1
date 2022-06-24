CREATE TABLE repos (
    id int NOT NULL PRIMARY KEY,
    "user" varchar(256) NOT NULL,
    name varchar(256) NOT NULL,
    language varchar(256) NOT NULL,
    url varchar(256) NOT NULL
);
