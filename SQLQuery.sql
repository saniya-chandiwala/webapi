CREATE DATABASE ExamDB;

USE ExamDB;




-- USER ROLE TABLE
CREATE TABLE UserType
(
    TypeID INT PRIMARY KEY IDENTITY(1,1),
    TypeName VARCHAR(100) NOT NULL UNIQUE
);

INSERT INTO UserType (TypeName) 
VALUES ('Admin'), ('Customer');


-- USER DETAILS TABLE
CREATE TABLE UserDetails
(
    UserID INT PRIMARY KEY IDENTITY(1,1),
    TypeID INT NOT NULL,
    UserName VARCHAR(100) NOT NULL,
    UserEmail VARCHAR(100) NOT NULL UNIQUE,
    UserPassword VARCHAR(100) NOT NULL,

    FOREIGN KEY (TypeID) REFERENCES UserType(TypeID)
);




-- CATEGORY TABLE
CREATE TABLE Categories
(
    CategoryID INT PRIMARY KEY IDENTITY(1,1),
    CategoryName VARCHAR(100) NOT NULL UNIQUE
);

INSERT INTO Categories(CategoryName)
VALUES ('Dresses'), ('Skirts'), ('Pants'), ('Tops') ;


-- PRODUCTS TABLE
CREATE TABLE Products
(
    ProductID INT PRIMARY KEY IDENTITY(1,1),
    CategoryID INT NOT NULL,
    ProductName VARCHAR(100) NOT NULL UNIQUE,
    ProductPrice DECIMAL(10,2) NOT NULL CHECK (ProductPrice > 0),
    ProductQty INT NOT NULL CHECK (ProductQty >= 0),
    ProductDescription VARCHAR(500),
    ProductImage VARCHAR(255),

    FOREIGN KEY (CategoryID) REFERENCES Categories(CategoryID)
);



-- CART TABLE
CREATE TABLE Cart
(
    CartID INT PRIMARY KEY IDENTITY(1,1),
    UserID INT NOT NULL,
    ProductID INT NOT NULL,
    CartQty INT NOT NULL CHECK (CartQty > 0),
    Price DECIMAL(10,2) NOT NULL CHECK (Price > 0),

    UNIQUE (UserID, ProductID),

    FOREIGN KEY (UserID) REFERENCES UserDetails(UserID),
    FOREIGN KEY (ProductID) REFERENCES Products(ProductID)
);




-- BILL TABLE
CREATE TABLE Bill
(
    BillID INT PRIMARY KEY IDENTITY(1,1),
    UserID INT NOT NULL,

    TotalBill DECIMAL(10,2) NOT NULL CHECK (TotalBill > 0),
    PaymentMode VARCHAR(50) NOT NULL,
    BillDate DATETIME NOT NULL DEFAULT GETDATE(),

    FOREIGN KEY (UserID) REFERENCES UserDetails(UserID)
);


-- BILL DETAILS TABLE
CREATE TABLE BillDetails
(
    BillDetailsID INT PRIMARY KEY IDENTITY(1,1),
    BillID INT NOT NULL,
    ProductID INT NOT NULL,
    Qty INT NOT NULL CHECK (Qty > 0),
    TotalAmt DECIMAL(10,2) NOT NULL CHECK (TotalAmt > 0),

    FOREIGN KEY (BillID) REFERENCES Bill(BillID),
    FOREIGN KEY (ProductID) REFERENCES Products(ProductID)
);


SELECT * FROM UserDetails;
SELECT * FROM Categories;

SELECT * FROM Products;

SELECT * FROM Bill;


INSERT INTO UserDetails (TypeID, UserName, UserEmail, UserPassword)
VALUES 
(1, 'admin', 'admin@gmail.com', '1234'),
(2, 'user', 'user@gmail.com', '1234');

DELETE FROM Products;
DBCC CHECKIDENT ('Products', RESEED, 0);

INSERT INTO Products
(CategoryID, ProductName, ProductPrice, ProductQty, ProductDescription, ProductImage)
VALUES
(1, 'TSS Originals: Sakura Sky', 1299, 50,
 'Elegant Sakura print polo dress with a comfortable fit.',
 'images/dresses/dress1.avif'),

(1, 'Mocha Floral Collar Tie-Up Dress', 1899, 50,
 'Stylish mocha floral dress with a collar and tie-up detail.',
 'images/dresses/dress2.avif'),

(1, 'Polo Dress: Rosette', 1499, 50,
 'Classic polo dress featuring a stylish rosette design.',
 'images/dresses/dress3.avif'),

(1, 'Kung Fu Panda Spirit Polo Dress', 1699, 50,
 'Fun Kung Fu Panda themed polo dress with a comfortable design.',
 'images/dresses/dress4.avif');

 INSERT INTO Products
(CategoryID, ProductName, ProductPrice, ProductQty, ProductDescription, ProductImage)
VALUES
(4, 'Luna Zipper Transitional Tops', 1299, 10,
 'Stylish transitional top with a zipper detail and comfortable fit.',
 'images/tops/top1.avif'),

(4, 'Ivory Solid Wrap Top', 1599, 10,
 'Elegant ivory wrap top with a simple and versatile design.',
 'images/tops/top2.avif'),

(4, 'Plaid Shirt: Blush', 1599, 10,
 'Classic blush plaid shirt with a stylish and comfortable fit.',
 'images/tops/top3.avif'),

(4, 'Flamingo Bell Sleeves Top', 899, 10,
 'Playful flamingo top featuring stylish bell sleeves and a comfortable fit.',
 'images/tops/top4.avif'),

(4, 'My Chemical Romance: Angel of Water', 899, 10,
 'Stylish graphic top inspired by My Chemical Romance with a unique design.',
 'images/tops/top5.avif');

 INSERT INTO Products
(CategoryID, ProductName, ProductPrice, ProductQty, ProductDescription, ProductImage)
VALUES
(3, 'Acid Wash Joggers: Charcoal Grey', 1899, 10,
 'Stylish acid wash joggers in charcoal grey with a comfortable fit.',
 'images/pants/pant1.avif'),

(3, 'Solid Joggers: Prune', 1699, 10,
 'Comfortable solid prune joggers with a simple and versatile design.',
 'images/pants/pant2.avif'),

(3, 'Spider-Man: Scarlet Web', 2599, 10,
 'Spider-Man themed pants featuring a bold Scarlet Web design.',
 'images/pants/pant3.avif'),

(3, 'Pull-On Denim: Sunshine', 999, 10,
 'Comfortable pull-on denim pants in a bright Sunshine shade.',
 'images/pants/pant4.avif');

 INSERT INTO Products
(CategoryID, ProductName, ProductPrice, ProductQty, ProductDescription, ProductImage)
VALUES
(2, 'Garfield Skirt', 899, 10,
 'Fun Garfield themed skirt with a comfortable and playful design.',
 'images/skirts/skirt1.jpg'),

(2, 'Peanuts: Comics', 1399, 10,
 'Playful Peanuts comics themed skirt with a stylish and comfortable fit.',
 'images/skirts/skirt2.avif'),

(2, 'Cargo Denim Skirts: Cool Drift', 1499, 10,
 'Stylish cargo denim skirt with a cool drift design and practical pockets.',
 'images/skirts/skirt3.jpg');