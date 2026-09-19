USE ecommerce_db;

-- Seed Admin/Farmer user if not exists
INSERT INTO user_dtls (account_non_locked, address, city, email, failed_attempt, is_enable, mobile_number, name, password, pincode, profile_image, role, state)
SELECT 1, 'Green Valley Farm', 'Nagpur', 'farmer@example.com', 0, 1, '9876543211', 'Ramesh Farmer', '$2a$10$kcAc4AJW8xCvCvM7vSo5H.Kl5vhK2o9zy164sn3iwraymfKrKJJaC', '440001', 'farmer-image2.png', 'ROLE_ADMIN', 'Maharashtra'
WHERE NOT EXISTS (SELECT 1 FROM user_dtls WHERE email = 'farmer@example.com');

-- Seed Categories
INSERT INTO category (image_name, is_active, name) VALUES
('menu1.jpg', 1, 'Vegetables'),
('menu2.jpg', 1, 'Fruits'),
('menu3.jpg', 1, 'Legumes'),
('menu4.jpg', 1, 'Oilseeds'),
('menu5.jpg', 1, 'Grains'),
('menu6.jpg', 1, 'TuberCrops'),
('menu7.jpg', 1, 'Spices'),
('menu8.jpg', 1, 'Ornamental')
ON DUPLICATE KEY UPDATE is_active = 1;

-- Seed Agricultural Products
DELETE FROM product;

INSERT INTO product (category, description, discount, discount_price, image, is_active, price, stock, title, user_id) VALUES
('Vegetables', 'Fresh farm tomatoes, rich in Vitamin C and lycopene.', 0, 27, 'food1.jpg', 1, 27, 100, 'Tomato', 1),
('Fruits', 'Crisp and juicy organic apples straight from Himachal orchards.', 5, 66.5, 'food2.jpg', 1, 70, 80, 'Apples', 1),
('Legumes', 'High-protein organic green beans, hand-picked daily.', 0, 33, 'food3.jpg', 1, 33, 120, 'Beans', 1),
('Oilseeds', 'Quality harvested soybeans with superior protein and oil yield.', 0, 45, 'food4.jpg', 1, 45, 200, 'Soyabeans', 1),
('Grains', 'Golden organic whole wheat grain, rich in dietary fiber.', 0, 65, 'food5.jpg', 1, 65, 350, 'Wheat', 1),
('TuberCrops', 'Nutritious organic sweet potatoes packed with Vitamin A.', 0, 40, 'food6.jpg', 1, 40, 90, 'Sweet Potatoes', 1),
('Spices', 'Fresh aromatic basil leaves grown naturally without chemicals.', 0, 20, 'food7.jpg', 1, 20, 50, 'Basil', 1),
('Ornamental', 'Freshly cut fragrant garden roses.', 0, 35, 'food8.jpg', 1, 35, 60, 'Roses', 1),
('Vegetables', 'Farm fresh potatoes, ideal for home cooking and baking.', 0, 45, 'food9.jpg', 1, 45, 250, 'Potatoes', 1),
('Fruits', 'Sweet and tangy Nagpur oranges with high Vitamin C.', 10, 72, 'food10.jpg', 1, 80, 110, 'Oranges', 1),
('Legumes', 'Healthy split red lentils, essential daily source of protein.', 0, 48, 'food11.jpg', 1, 48, 140, 'Lentils', 1),
('Oilseeds', 'Sun-dried sunflower seeds packed with essential fatty acids.', 0, 38, 'food12.jpg', 1, 38, 75, 'Sunflower Seeds', 1),
('Grains', 'Pure aromatic basmati rice from Punjab fields.', 0, 65, 'food13.jpg', 1, 65, 400, 'Rice', 1),
('TuberCrops', 'Starchy African yams, high in dietary fiber and nutrients.', 0, 49, 'food14.jpg', 1, 49, 65, 'Yams', 1),
('Spices', 'Dried culinary thyme herb with intense aroma.', 0, 90, 'food15.jpg', 1, 90, 45, 'Thyme', 1),
('Vegetables', 'Crisp crunchy carrots loaded with beta-carotene.', 0, 55, 'food17.jpg', 1, 55, 130, 'Carrots', 1),
('Fruits', 'Naturally ripened sweet bananas, energy booster.', 0, 30, 'food18.jpg', 1, 30, 160, 'Bananas', 1),
('Legumes', 'Tender green garden peas, flash fresh.', 0, 45, 'food19.jpg', 1, 45, 85, 'Peas', 1),
('Oilseeds', 'Prime canola seeds for cooking oil extraction.', 0, 155, 'food20.jpg', 1, 155, 90, 'Canola', 1),
('Grains', 'Wholesome pearl barley, great for hearty soups.', 0, 74, 'food21.jpg', 1, 74, 110, 'Barley', 1),
('TuberCrops', 'Deep red farm-grown beetroots with sweet earthy flavor.', 0, 65, 'food22.jpg', 1, 65, 70, 'Beets', 1),
('Spices', 'Fragrant Mediterranean oregano leaves.', 0, 100, 'food23.jpg', 1, 100, 40, 'Oregano', 1),
('Vegetables', 'Pungent red onions essential for Indian curries.', 0, 70, 'food25.jpg', 1, 70, 220, 'Onions', 1),
('Fruits', 'Crisp seedless green grapes, sweet and fresh.', 0, 80, 'food26.jpg', 1, 80, 95, 'Grapes', 1),
('Legumes', 'Large kabuli chickpeas, rich in iron and protein.', 0, 160, 'food27.jpg', 1, 160, 130, 'Chickpeas', 1),
('Oilseeds', 'Natural white sesame seeds rich in healthy calcium.', 0, 55, 'food28.jpg', 1, 55, 80, 'Sesame', 1),
('Grains', 'Golden sweet corn cobs freshly harvested.', 0, 70, 'food29.jpg', 1, 70, 150, 'Corn', 1),
('TuberCrops', 'Crisp white and red radishes with a peppery bite.', 0, 120, 'food30.jpg', 1, 120, 60, 'Radishes', 1),
('Spices', 'Strong flavorful organic garlic bulbs.', 0, 140, 'food31.jpg', 1, 140, 100, 'Garlic', 1);
