-- -- Drop existing data if needed
-- -- DELETE FROM "Comment";
-- -- DELETE FROM "Review";
-- -- DELETE FROM "Item";
-- -- DELETE FROM "User";
-- TRUNCATE TABLE "Comment", "Review", "Item", "User" RESTART IDENTITY;

-- -- Insert Users and retrieve their IDs
-- INSERT INTO "User" (email, password) VALUES
-- ('fraline@meldigital.com', '$2b$10$hashed_password1'), 
-- ('njedwards@meu.com', '$2b$10$hashed_password2'), 
-- ('liudana@botmod.com', '$2b$10$hashed_password3'), 
-- ('sukreinor@kelang.com', '$2b$10$hashed_password4'), 
-- ('cahzer28@fb3s.com', '$2b$10$hashed_password5');

-- -- Insert Items
-- INSERT INTO Item (name, avgScore) VALUES
-- ('Olaplex', 4.5),
-- ('Moroccan Oil', 4.2),
-- ('Phrenology', 4.7),
-- ('Amika', 4.8),
-- ('Kerastase', 4.1);

-- -- Insert Reviews using the correct user IDs
-- INSERT INTO Review (text, score, userId, itemId) VALUES
-- ('Great shampoo!', 5, 1, 1),
-- ('Very moisturizing', 4, 2, 2),
-- ('Loved it!', 5, 3, 3),
-- ('Okay product', 3, 4, 4),
-- ('Best hair mask ever!', 5, 5, 5);

-- -- Insert Comments
-- INSERT INTO Comment (userId, reviewId, text) VALUES
-- (1, 2, 'I agree, it works wonders!'),
-- (2, 1, 'I have a similar experience.'),
-- (3, 2, 'Thanks for the review!'),
-- (4, 3, 'Cannot wait to try this!'),
-- (5, 4, 'Not that great!');
