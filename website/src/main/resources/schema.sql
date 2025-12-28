CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    avatar VARCHAR(500)
);

CREATE TABLE IF NOT EXISTS news (
    id VARCHAR(255) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    summary TEXT NOT NULL,
    content TEXT NOT NULL,
    author VARCHAR(255) NOT NULL,
    date DATE NOT NULL,
    tags TEXT[], -- Postgres array
    image_url VARCHAR(500)
);

CREATE TABLE IF NOT EXISTS forum_posts (
    id VARCHAR(255) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    author_id VARCHAR(255) NOT NULL,
    category VARCHAR(255) NOT NULL,
    likes INT DEFAULT 0,
    comments INT DEFAULT 0,
    date DATE NOT NULL,
    is_hot BOOLEAN DEFAULT FALSE
);
