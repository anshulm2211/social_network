create table register
(
    email varchar(30),
    username varchar(20) primary key,
    password varchar(20) not null
);

create table profiles 
(
    username varchar(20) not null,
    fullname varchar(40) not null,
    profilepic varchar(300) default "/img/new-user-male-icon.jpg", 
    phone bigint,
    address varchar(20) not null,
    gender varchar(10) not null,
    placeborn varchar(20),
    dateborn date not null,
    job varchar(20),
    institution varchar(20),
    foreign key (username) references register(username) on delete cascade,
    primary key(username)
);

create table todo
(
    id int not null auto_increment,
    username varchar(20) not null,
    message varchar(300),
    foreign key (username) references register(username) on delete cascade,
    primary key(id)
);

create table feedback (
    username varchar(30) not null,
    feedback varchar(300) not null,
    id int not null auto_increment,
    curdate timestamp default current_timestamp,
    foreign key (username) references register(username) on delete cascade,
    primary key(id)
);

create table friends 
(
    friendid int auto_increment,
    username varchar(20) not null,
    added varchar(20) not null,
    foreign key (username) references register(username) on delete cascade,
    foreign key (added) references register(username) on delete cascade,
    primary key(friendid)
);

create table uploads 
(
    uploadid int auto_increment,
    username varchar(20) not null,
    title varchar(30),
    url varchar(300) not null,
    curtime timestamp default current_timestamp,
    foreign key(username) references register(username) on delete cascade,
    primary key(uploadid)
);

create table comments 
(
    commentid int auto_increment,
    username varchar(20) not null,
    message varchar(300),
    uploadid int,
    curtime timestamp default current_timestamp,
    foreign key (username) references register(username) on delete cascade,
    foreign key (uploadid) references uploads(uploadid) on delete cascade,
    primary key(commentid)
);

create table age
(
    username varchar(20),
    age int(2)
);



