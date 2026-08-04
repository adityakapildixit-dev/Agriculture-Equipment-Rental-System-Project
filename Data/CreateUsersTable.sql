-- Run this once against your "Agriculture" database (same DB your app already connects to).
-- Open it in SQL Server Management Studio / Azure Data Studio, connect to (localdb)\MSSQLLocalDB,
-- select the Agriculture database, and execute this script.

CREATE TABLE Users (
    UserId INT IDENTITY(1,1) PRIMARY KEY,
    Username VARCHAR(50) NOT NULL UNIQUE,
    Email VARCHAR(100) NOT NULL,
    PasswordHash NVARCHAR(300) NOT NULL,
    Role VARCHAR(20) NOT NULL,        -- 'Admin', 'Owner', or 'Farmer'
    CreatedAt DATETIME NOT NULL DEFAULT GETDATE()
);
