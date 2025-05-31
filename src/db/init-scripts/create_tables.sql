CREATE TABLE Users (
                       id SERIAL PRIMARY KEY,
                       username VARCHAR(100) NOT NULL UNIQUE,
                       password VARCHAR(255) NOT NULL,
                       balance DECIMAL(18,2) NOT NULL DEFAULT 0
);

CREATE TABLE Tenders (
                         id SERIAL PRIMARY KEY,
                         title VARCHAR(255) NOT NULL,
                         startingPrice DECIMAL(18,2) NOT NULL,
                         description TEXT,
                         userId INT NOT NULL,
                         currentPrice DECIMAL(18,2),
                         winnerId INT NULL,
                         isActive BOOLEAN DEFAULT TRUE,
                         isHidden BOOLEAN DEFAULT FALSE,
                         FOREIGN KEY (userId) REFERENCES Users(id),
                         FOREIGN KEY (winnerId) REFERENCES Users(id)
);

CREATE TABLE Offers (
                        id SERIAL PRIMARY KEY,
                        userId INT NOT NULL,
                        tenderId INT NOT NULL,
                        amount DECIMAL(18,2) NOT NULL,
                        isActive BOOLEAN DEFAULT TRUE,
                        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                        FOREIGN KEY (userId) REFERENCES Users(id),
                        FOREIGN KEY (tenderId) REFERENCES Tenders(id)
);