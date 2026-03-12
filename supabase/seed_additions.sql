-- APPENDING NEW PRODUCTS TO EXISTING SEED DATA

INSERT INTO public.products (category, name, brand, price, tags, rating, delivery_days) VALUES

-- CATEGORY: Hair Loss (8 products)
('hair-loss', 'Indulekha Bringha Hair Oil', 'Indulekha', 299, '{"hair-loss","hair","scalp","oil"}', 4.5, 3),
('hair-loss', 'Mamaearth Onion Hair Oil', 'Mamaearth', 249, '{"hair-loss","hair","onion","growth"}', 4.4, 2),
('hair-loss', 'Biotique Bio Kelp Shampoo', 'Biotique', 199, '{"hair-loss","shampoo","hair"}', 4.3, 2),
('hair-loss', 'Himalaya Anti Hair Fall Shampoo', 'Himalaya', 179, '{"hair-loss","shampoo","hair"}', 4.6, 2),
('hair-loss', 'Wow Onion Black Seed Hair Mask', 'Wow', 349, '{"hair-loss","mask","hair","growth"}', 4.5, 3),
('hair-loss', 'Traya Hair Ras Supplement', 'Traya', 899, '{"hair-loss","supplement","hair","internal"}', 4.7, 4),
('hair-loss', 'Derma Roller 0.5mm', 'Brivane', 299, '{"hair-loss","scalp","derma","growth"}', 4.2, 3),
('hair-loss', 'Castor Oil Cold Pressed', 'Khadi Natural', 199, '{"hair-loss","castor","oil","hair"}', 4.8, 2),

-- CATEGORY: Weight Gain (8 products)
('weight-gain', 'MuscleBlaze Mass Gainer 1kg', 'MuscleBlaze', 799, '{"weight-gain","mass","protein","supplement"}', 4.6, 3),
('weight-gain', 'Endura Mass Weight Gainer', 'Endura', 649, '{"weight-gain","mass","supplement"}', 4.3, 4),
('weight-gain', 'Peanut Butter Crunchy 1kg', 'MyFitness', 499, '{"weight-gain","peanut","protein","food"}', 4.8, 2),
('weight-gain', 'Dry Fruits Mix 500g', 'Happilo', 399, '{"weight-gain","dry-fruits","nutrition","food"}', 4.7, 2),
('weight-gain', 'Banana Chips Healthy Pack', 'Haldirams', 149, '{"weight-gain","snack","calories","food"}', 4.5, 2),
('weight-gain', 'Protein Shaker Bottle', 'Boldfit', 299, '{"weight-gain","shaker","protein"}', 4.6, 3),
('weight-gain', 'Measuring Tape Body', 'Healthgenie', 99, '{"weight-gain","measure","track","body"}', 4.2, 5),
('weight-gain', 'Appetite Booster Syrup', 'Baidyanath', 179, '{"weight-gain","appetite","ayurvedic"}', 4.4, 3),

-- CATEGORY: Leg Pain (8 products)
('leg-pain', 'Moov Pain Relief Spray', 'Moov', 180, '{"leg-pain","pain","muscle","spray"}', 4.7, 2),
('leg-pain', 'Volini Gel 50g', 'Volini', 220, '{"leg-pain","pain","gel","muscle"}', 4.6, 2),
('leg-pain', 'Compression Socks Pair', 'Tynor', 349, '{"leg-pain","compression","socks","circulation"}', 4.5, 3),
('leg-pain', 'Knee Cap Support', 'Strauss', 299, '{"leg-pain","knee","support"}', 4.3, 3),
('leg-pain', 'Calf Compression Sleeve', 'Boldfit', 249, '{"leg-pain","calf","compression","leg"}', 4.4, 4),
('leg-pain', 'Heating Pad Electric', 'Wellbeing', 599, '{"leg-pain","heat","pain","relief"}', 4.6, 3),
('leg-pain', 'Cold Hot Gel Pack', 'Doff', 349, '{"leg-pain","cold","hot","pain"}', 4.5, 3),
('leg-pain', 'Orthopedic Footwear', 'Ortho', 1200, '{"leg-pain","footwear","ortho","comfort"}', 4.8, 5),

-- CATEGORY: Mouth Pain / Dental (8 products)
('mouth-pain', 'Sensodyne Toothpaste', 'Sensodyne', 179, '{"mouth-pain","tooth","sensitive","dental"}', 4.8, 2),
('mouth-pain', 'Colgate Sensitive Pro', 'Colgate', 149, '{"mouth-pain","tooth","sensitive"}', 4.6, 2),
('mouth-pain', 'Clove Oil Pure', 'Dabur', 99, '{"mouth-pain","clove","tooth","pain","natural"}', 4.5, 3),
('mouth-pain', 'Orajel Mouth Gel', 'Orajel', 249, '{"mouth-pain","gel","mouth","ulcer"}', 4.7, 3),
('mouth-pain', 'Gum Paint Asfoetida', 'Baidyanath', 89, '{"mouth-pain","gum","ayurvedic","pain"}', 4.4, 4),
('mouth-pain', 'Mouth Ulcer Gel', 'SMYLE', 89, '{"mouth-pain","ulcer","mouth","gel"}', 4.6, 2),
('mouth-pain', 'Toothbrush Ultra Soft', 'Oral-B', 99, '{"mouth-pain","toothbrush","soft","dental"}', 4.7, 2),
('mouth-pain', 'Salt Water Rinse Kit', 'TheraBreath', 199, '{"mouth-pain","rinse","salt","clean"}', 4.5, 3),

-- CATEGORY: Hand Pain (8 products)
('hand-pain', 'Volini Hand Pain Gel', 'Volini', 220, '{"hand-pain","hand","gel","pain"}', 4.6, 2),
('hand-pain', 'Wrist Support Brace', 'Tynor', 349, '{"hand-pain","wrist","support","brace"}', 4.5, 3),
('hand-pain', 'Finger Splint Set', 'Tynor', 199, '{"hand-pain","finger","splint","support"}', 4.4, 4),
('hand-pain', 'Hand Grip Strengthener', 'Boldfit', 299, '{"hand-pain","grip","strengthen","hand"}', 4.6, 3),
('hand-pain', 'Heating Pad Small', 'Wellbeing', 399, '{"hand-pain","heat","pain","relief"}', 4.7, 3),
('hand-pain', 'Arthritis Gloves', 'Copper Compression', 599, '{"hand-pain","arthritis","gloves","joint"}', 4.5, 4),
('hand-pain', 'Paraffin Wax Bath Kit', 'Onyxe', 999, '{"hand-pain","paraffin","wax","therapy"}', 4.3, 5),
('hand-pain', 'Cold Gel Pack Small', 'Doff', 249, '{"hand-pain","cold","ice","pain"}', 4.6, 2),

-- CATEGORY: Stomach Pain (8 products)
('stomach-pain', 'Pudin Hara Pearls', 'Dabur', 99, '{"stomach-pain","gas","acidity","digestion"}', 4.8, 2),
('stomach-pain', 'Eno Fruit Salt', 'Eno', 89, '{"stomach-pain","acidity","gas","relief"}', 4.9, 1),
('stomach-pain', 'Hajmola Digestive Tablets', 'Dabur', 49, '{"stomach-pain","digestion","gas","ayurvedic"}', 4.7, 2),
('stomach-pain', 'Omez D Capsule', 'Dr Reddy', 149, '{"stomach-pain","acidity","gastric","medicine"}', 4.6, 2),
('stomach-pain', 'Isabgol Husk 100g', 'Metamucil', 149, '{"stomach-pain","fiber","constipation","digestion"}', 4.8, 3),
('stomach-pain', 'Hot Water Bag', 'Prestige', 299, '{"stomach-pain","heat","cramps","relief"}', 4.5, 3),
('stomach-pain', 'Ginger Honey Lemon Tea', 'Organic India', 199, '{"stomach-pain","tea","ginger","digestion"}', 4.7, 2),
('stomach-pain', 'Probiotic Capsules', 'Healthkart', 499, '{"stomach-pain","probiotic","gut","digestion"}', 4.6, 3),

-- CATEGORY: Headache (8 products)
('headache', 'Amrutanjan Balm', 'Amrutanjan', 79, '{"headache","balm","pain","relief"}', 4.8, 2),
('headache', 'Tiger Balm White', 'Tiger Balm', 149, '{"headache","balm","pain","migraine"}', 4.7, 2),
('headache', 'Axe Brand Oil', 'Axe Brand', 129, '{"headache","oil","pain","relief"}', 4.6, 3),
('headache', 'Iodex Balm', 'Iodex', 89, '{"headache","balm","pain","forehead"}', 4.7, 2),
('headache', 'Eye Mask Hot Cold', 'Plush', 299, '{"headache","eye","mask","migraine"}', 4.5, 3),
('headache', 'Lavender Essential Oil', 'Soulflower', 199, '{"headache","lavender","aroma","migraine"}', 4.6, 3),
('headache', 'Peppermint Roll On', 'Kama Ayurveda', 349, '{"headache","peppermint","roll-on","migraine"}', 4.7, 4),
('headache', 'Neck Pillow Travel', 'Tynor', 399, '{"headache","neck","pillow","tension"}', 4.4, 4),

-- CATEGORY: Slipper Repair (6 products)
('slipper-repair', 'Fevikwik Shoe Repair Glue', 'Fevikwik', 99, '{"slipper-repair","glue","shoe","fix"}', 4.6, 2),
('slipper-repair', 'Shoe Repair Adhesive', 'Bostik', 149, '{"slipper-repair","adhesive","shoe","repair"}', 4.5, 3),
('slipper-repair', 'Rubber Patch Kit', 'Rema Tip Top', 99, '{"slipper-repair","patch","rubber","fix"}', 4.3, 4),
('slipper-repair', 'Cobbler Repair Kit', 'Kiwi', 199, '{"slipper-repair","cobbler","kit","shoe"}', 4.4, 4),
('slipper-repair', 'Heel Repair Pad', 'Carnation', 149, '{"slipper-repair","heel","pad","repair"}', 4.2, 3),
('slipper-repair', 'Sole Protector Stick', 'Moneysworth', 249, '{"slipper-repair","sole","protect","repair"}', 4.5, 5),

-- CATEGORY: Skin Care (10 products)
('skin-care', 'Mamaearth Ubtan Face Wash', 'Mamaearth', 199, '{"skin-care","face-wash","skin","glow"}', 4.5, 2),
('skin-care', 'Himalaya Moisturizing Cream', 'Himalaya', 149, '{"skin-care","moisturizer","skin","hydrate"}', 4.6, 2),
('skin-care', 'Nivea Body Lotion 400ml', 'Nivea', 299, '{"skin-care","body-lotion","skin","moisturize"}', 4.7, 2),
('skin-care', 'Plum Vitamin C Serum', 'Plum', 595, '{"skin-care","serum","vitamin-c","glow","face"}', 4.4, 3),
('skin-care', 'Dot and Key Sunscreen SPF50', 'Dot and Key', 395, '{"skin-care","sunscreen","spf","protect"}', 4.6, 2),
('skin-care', 'WOW Face Scrub', 'WOW', 299, '{"skin-care","scrub","exfoliate","face"}', 4.3, 3),
('skin-care', 'Forest Essentials Rose Toner', 'Forest Essentials', 595, '{"skin-care","toner","rose","face"}', 4.8, 3),
('skin-care', 'Biotique Almond Oil Under Eye', 'Biotique', 149, '{"skin-care","eye","dark-circles","under-eye"}', 4.2, 4),
('skin-care', 'Minimalist Niacinamide 10%', 'Minimalist', 349, '{"skin-care","niacinamide","pores","face"}', 4.7, 3),
('skin-care', 'Cetaphil Gentle Cleanser', 'Cetaphil', 349, '{"skin-care","cleanser","gentle","sensitive"}', 4.8, 2),

-- CATEGORY: Full Body Care (10 products)
('body-care', 'Dove Body Wash 250ml', 'Dove', 249, '{"body-care","body-wash","shower","skin"}', 4.6, 2),
('body-care', 'Himalaya Neem Body Wash', 'Himalaya', 179, '{"body-care","body-wash","neem","clean"}', 4.5, 2),
('body-care', 'Vaseline Body Lotion 400ml', 'Vaseline', 279, '{"body-care","lotion","moisturize","body"}', 4.7, 2),
('body-care', 'Gilette Razor Men 6 pack', 'Gilette', 299, '{"body-care","razor","shave","men"}', 4.8, 2),
('body-care', 'Veet Hair Removal Cream', 'Veet', 199, '{"body-care","hair-removal","women","body"}', 4.4, 3),
('body-care', 'Dettol Antiseptic Liquid', 'Dettol', 149, '{"body-care","antiseptic","clean","hygiene"}', 4.9, 2),
('body-care', 'Pears Soap Bar 4 pack', 'Pears', 199, '{"body-care","soap","bath","skin"}', 4.7, 3),
('body-care', 'Foot Scrub Pumice Stone', 'Basicare', 149, '{"body-care","foot","scrub","pumice"}', 4.3, 4),
('body-care', 'Nair Body Spray', 'Nair', 349, '{"body-care","spray","hair-removal","body"}', 4.5, 4),
('body-care', 'Aloe Vera Gel Pure', 'WOW', 249, '{"body-care","aloe-vera","gel","soothe","skin"}', 4.6, 3),

-- CATEGORY: Boyfriend Gift (10 products)
('boyfriend-gift', 'boAt Rockerz Bluetooth Earphones', 'boAt', 999, '{"boyfriend-gift","gift","earphones","men"}', 4.5, 3),
('boyfriend-gift', 'Fastrack Analog Watch', 'Fastrack', 1299, '{"boyfriend-gift","gift","watch","men"}', 4.7, 3),
('boyfriend-gift', 'Wildhorn Leather Wallet', 'Wildhorn', 699, '{"boyfriend-gift","wallet","leather","men"}', 4.6, 3),
('boyfriend-gift', 'Noise ColorFit Smart Watch', 'Noise', 2499, '{"boyfriend-gift","smartwatch","gift","men"}', 4.4, 4),
('boyfriend-gift', 'The Man Company Grooming Kit', 'The Man Company', 999, '{"boyfriend-gift","grooming","kit","men"}', 4.5, 2),
('boyfriend-gift', 'Axe Perfume Gift Set', 'Axe', 599, '{"boyfriend-gift","perfume","deo","men"}', 4.6, 2),
('boyfriend-gift', 'Titan Perfume Men', 'Titan', 799, '{"boyfriend-gift","perfume","fragrance","men"}', 4.8, 3),
('boyfriend-gift', 'Personalized Photo Frame', 'Presto', 599, '{"boyfriend-gift","photo","frame","personal"}', 4.7, 5),
('boyfriend-gift', 'Beer Mug Personalized', 'The Crazy Me', 499, '{"boyfriend-gift","mug","personalized","men"}', 4.4, 4),
('boyfriend-gift', 'Portronics Power Bank 10000mAh', 'Portronics', 899, '{"boyfriend-gift","power-bank","gift","tech"}', 4.6, 2),

-- CATEGORY: Girlfriend Gift (10 products)
('girlfriend-gift', 'Plum Skincare Gift Set', 'Plum', 999, '{"girlfriend-gift","skincare","gift","women"}', 4.6, 3),
('girlfriend-gift', 'Fastrack Ladies Watch', 'Fastrack', 1199, '{"girlfriend-gift","watch","women","gift"}', 4.7, 3),
('girlfriend-gift', 'FabIndia Silk Scarf', 'FabIndia', 599, '{"girlfriend-gift","scarf","silk","women"}', 4.5, 4),
('girlfriend-gift', 'Forest Essentials Mini Kit', 'Forest Essentials', 1299, '{"girlfriend-gift","skincare","luxury","women"}', 4.8, 3),
('girlfriend-gift', 'Nykaa Makeup Gift Set', 'Nykaa', 799, '{"girlfriend-gift","makeup","gift","women"}', 4.6, 2),
('girlfriend-gift', 'Scented Candle Luxury Set', 'Iris', 599, '{"girlfriend-gift","candle","aroma","women"}', 4.7, 3),
('girlfriend-gift', 'Jewellery Box Organizer', 'House of Quirk', 499, '{"girlfriend-gift","jewellery","organizer","women"}', 4.4, 4),
('girlfriend-gift', 'Personalized Name Necklace', 'The Crazy Me', 699, '{"girlfriend-gift","necklace","personal","women"}', 4.5, 5),
('girlfriend-gift', 'Journal Notebook Premium', 'Paperage', 399, '{"girlfriend-gift","journal","notebook","gift"}', 4.8, 2),
('girlfriend-gift', 'Mini Succulent Plant Set', 'Ugaoo', 499, '{"girlfriend-gift","plant","succulent","cute"}', 4.6, 3),

-- CATEGORY: Surprise Gifts (8 products)
('surprise-gift', 'Cadbury Celebrations Box', 'Cadbury', 499, '{"surprise-gift","chocolate","gift","celebration"}', 4.8, 2),
('surprise-gift', 'Archies Gift Hamper', 'Archies', 799, '{"surprise-gift","hamper","gift","mixed"}', 4.5, 3),
('surprise-gift', 'Balloon Decoration Kit', 'Party Propz', 349, '{"surprise-gift","balloon","decor","surprise"}', 4.4, 3),
('surprise-gift', 'Personalized Mug', 'Presto', 349, '{"surprise-gift","mug","personalized","gift"}', 4.6, 4),
('surprise-gift', 'Customized Keychain', 'The Crazy Me', 199, '{"surprise-gift","keychain","personalized","gift"}', 4.5, 5),
('surprise-gift', 'Pop It Fidget Toy Set', 'Zuru', 249, '{"surprise-gift","toy","fun","gift"}', 4.3, 2),
('surprise-gift', 'Instax Mini Photo Prints', 'Fujifilm', 599, '{"surprise-gift","photo","print","memory"}', 4.7, 4),
('surprise-gift', 'Gift Wrapping Kit Premium', 'Archies', 249, '{"surprise-gift","wrap","ribbon","gift"}', 4.6, 2),

-- CATEGORY: Drawing Tools (10 products)
('drawing', 'Camlin Drawing Pencils Set 12', 'Camlin', 149, '{"drawing","pencil","art","sketch"}', 4.6, 2),
('drawing', 'Staedtler Sketch Pencils Set', 'Staedtler', 399, '{"drawing","sketch","pencil","art"}', 4.8, 3),
('drawing', 'Faber Castell Colour Pencils 24', 'Faber Castell', 299, '{"drawing","colour","pencil","art"}', 4.7, 2),
('drawing', 'Winsor Newton Watercolors', 'Winsor Newton', 599, '{"drawing","watercolor","paint","art"}', 4.9, 4),
('drawing', 'Camlin Acrylic Colours Set', 'Camlin', 449, '{"drawing","acrylic","paint","art"}', 4.6, 3),
('drawing', 'Drawing Sketchbook A4', 'Brustro', 249, '{"drawing","sketchbook","paper","art"}', 4.7, 2),
('drawing', 'Kneaded Eraser Set', 'Faber Castell', 99, '{"drawing","eraser","art","sketch"}', 4.5, 3),
('drawing', 'Drawing Ruler Set', 'Staedtler', 149, '{"drawing","ruler","geometry","art"}', 4.4, 2),
('drawing', 'Inking Pen Set 6', 'Sakura', 499, '{"drawing","ink","pen","art","sketch"}', 4.8, 3),
('drawing', 'Canvas Board A3', 'Camlin', 199, '{"drawing","canvas","board","paint"}', 4.5, 3),

-- CATEGORY: Love Breakup (10 products)
('breakup', 'Dairy Milk Silk Chocolate', 'Cadbury', 199, '{"breakup","comfort","chocolate","sad"}', 4.8, 2),
('breakup', 'Chamomile Calm Tea', 'Organic India', 299, '{"breakup","tea","calm","relax"}', 4.7, 3),
('breakup', 'Journal Notebook Premium', 'Paperage', 399, '{"breakup","journal","write","express"}', 4.8, 2),
('breakup', 'Scented Candle Relaxing', 'Iris', 449, '{"breakup","candle","relax","calm"}', 4.6, 3),
('breakup', 'Spotify Premium Gift Card', 'Spotify', 489, '{"breakup","music","playlist","mood"}', 4.9, 1),
('breakup', 'Self Help Book Set', 'Penguin', 599, '{"breakup","book","heal","self-help"}', 4.7, 3),
('breakup', 'Face Sheet Mask Pack 5', 'Mamaearth', 299, '{"breakup","face-mask","self-care","skin"}', 4.5, 2),
('breakup', 'Essential Oil Diffuser', 'Iris', 799, '{"breakup","aroma","calm","diffuser"}', 4.6, 4),
('breakup', 'Weighted Eye Mask', 'Plush', 349, '{"breakup","sleep","relax","eye-mask"}', 4.7, 3),
('breakup', 'Indoor Plant Small', 'Ugaoo', 299, '{"breakup","plant","peace","calm"}', 4.5, 4),

-- CATEGORY: Friendship Breakup (8 products)
('friendship-breakup', 'Cadbury Celebrations Gift Box', 'Cadbury', 499, '{"friendship-breakup","gift","chocolate","reconnect"}', 4.8, 2),
('friendship-breakup', 'Friendship Bracelet Set', 'The Crazy Me', 199, '{"friendship-breakup","bracelet","friendship","reconnect"}', 4.4, 4),
('friendship-breakup', 'Sorry Card Premium', 'Archies', 99, '{"friendship-breakup","card","sorry","reconcile"}', 4.5, 3),
('friendship-breakup', 'Journal Notebook', 'Paperage', 299, '{"friendship-breakup","journal","write","feelings"}', 4.7, 2),
('friendship-breakup', 'Self Help Book Friendships', 'Penguin', 399, '{"friendship-breakup","book","heal","self-help"}', 4.6, 3),
('friendship-breakup', 'Chamomile Tea Pack', 'Organic India', 299, '{"friendship-breakup","tea","calm","relax"}', 4.7, 2),
('friendship-breakup', 'Scented Candle', 'Iris', 449, '{"friendship-breakup","candle","relax","calm"}', 4.6, 3),
('friendship-breakup', 'Photo Frame Collage', 'Archies', 599, '{"friendship-breakup","photo","memory","reconnect"}', 4.5, 4),

-- CATEGORY: Back Pain (add more)
('back-pain', 'Lumbar Support Cushion', 'Wakefit', 899, '{"back-pain","lumbar","cushion","support"}', 4.6, 4),
('back-pain', 'Orthopedic Mattress Topper', 'Sleepwell', 2499, '{"back-pain","mattress","sleep","spine"}', 4.7, 5),
('back-pain', 'TENS Pain Relief Machine', 'HealthSense', 1499, '{"back-pain","tens","electric","relief"}', 4.5, 4),
('back-pain', 'Yoga Bolster Pillow', 'Strauss', 699, '{"back-pain","yoga","stretch","relief"}', 4.4, 3),

-- CATEGORY: Butt Pain / Tailbone (6 products)
('butt-pain', 'Coccyx Orthopedic Cushion', 'Wakefit', 799, '{"butt-pain","coccyx","cushion","tailbone","sitting"}', 4.7, 4),
('butt-pain', 'Donut Cushion Ring', 'Tynor', 549, '{"butt-pain","donut","cushion","ring","sitting"}', 4.5, 3),
('butt-pain', 'Memory Foam Seat Cushion', 'Sleepsia', 699, '{"butt-pain","memory-foam","cushion","seat"}', 4.6, 3),
('butt-pain', 'Heating Pad Seat', 'Wellbeing', 599, '{"butt-pain","heat","pad","relief"}', 4.4, 3),
('butt-pain', 'Sitz Bath Tub', 'Healthgenie', 349, '{"butt-pain","sitz","bath","relief"}', 4.5, 3),
('butt-pain', 'Anti Bedsore Air Cushion', 'Tynor', 1299, '{"butt-pain","pressure","relief","cushion"}', 4.6, 4),

-- CATEGORY: Knee Pain (add more)
('knee-pain', 'Knee Brace Hinged', 'Tynor', 899, '{"knee-pain","brace","hinged","support"}', 4.6, 3),
('knee-pain', 'Patella Knee Strap', 'Strauss', 299, '{"knee-pain","patella","strap","support"}', 4.4, 3),
('knee-pain', 'Knee Gel Ice Pack', 'Doff', 349, '{"knee-pain","ice","gel","pack","cold"}', 4.5, 3),
('knee-pain', 'Knee Pillow Between Legs', 'Sleepsia', 499, '{"knee-pain","pillow","sleep","knee"}', 4.7, 4),

-- CATEGORY: Joint Pain (6 products)
('joint-pain', 'Flexon MR Tablet', 'Cipla', 89, '{"joint-pain","tablet","medicine","relief"}', 4.8, 2),
('joint-pain', 'Dabur Rheumatil Oil', 'Dabur', 199, '{"joint-pain","oil","ayurvedic","relief"}', 4.6, 3),
('joint-pain', 'Joint Support Supplement', 'Healthkart', 699, '{"joint-pain","supplement","glucosamine","joint"}', 4.5, 3),
('joint-pain', 'Copper Compression Gloves', 'Copper Compression', 599, '{"joint-pain","gloves","copper","arthritis"}', 4.7, 4),
('joint-pain', 'Hot Water Bottle', 'Prestige', 299, '{"joint-pain","hot","water","bottle","heat"}', 4.5, 2),
('joint-pain', 'Omega 3 Fish Oil Capsules', 'Healthkart', 499, '{"joint-pain","omega3","supplement","joint"}', 4.8, 3),

-- CATEGORY: Foot Pain (6 products)
('foot-pain', 'Scholl Gel Insoles', 'Scholl', 399, '{"foot-pain","insole","gel","comfort"}', 4.7, 3),
('foot-pain', 'Heel Cup Pair', 'Tynor', 249, '{"foot-pain","heel","cup","support"}', 4.4, 3),
('foot-pain', 'Foot Massage Roller', 'Boldfit', 299, '{"foot-pain","massage","roller","relief"}', 4.5, 4),
('foot-pain', 'Epsom Salt Foot Soak', 'Wow', 249, '{"foot-pain","epsom","soak","relief"}', 4.6, 3),
('foot-pain', 'Arch Support Insole', 'Superfeet', 599, '{"foot-pain","arch","insole","support"}', 4.7, 4),
('foot-pain', 'Plantar Fasciitis Socks', 'Tynor', 349, '{"foot-pain","plantar","socks","arch"}', 4.5, 3),

-- CATEGORY: Ear Pain (6 products)
('ear-pain', 'Otosan Ear Drops', 'Otosan', 299, '{"ear-pain","drops","ear","infection"}', 4.6, 3),
('ear-pain', 'Ear Wax Removal Kit', 'Debrox', 349, '{"ear-pain","wax","removal","clean"}', 4.5, 4),
('ear-pain', 'Earmuffs Warm', '3M', 399, '{"ear-pain","earmuff","warm","cold"}', 4.6, 3),
('ear-pain', 'Hearing Protection Earplugs', '3M', 149, '{"ear-pain","earplug","protect","noise"}', 4.7, 2),
('ear-pain', 'Hot Water Bag Small', 'Prestige', 249, '{"ear-pain","heat","warm","relief"}', 4.4, 2),
('ear-pain', 'Cotton Ear Buds Box', 'Johnson', 99, '{"ear-pain","cotton","buds","clean"}', 4.8, 2),

-- CATEGORY: Eye Pain (6 products)
('eye-pain', 'Rohto Eye Drops', 'Rohto', 180, '{"eye-pain","drops","eye","strain","dry"}', 4.7, 2),
('eye-pain', 'Blue Light Glasses', 'Specsy', 599, '{"eye-pain","blue-light","glasses","screen"}', 4.5, 3),
('eye-pain', 'Eye Mask Warm', 'Plush', 299, '{"eye-pain","mask","warm","relief"}', 4.6, 3),
('eye-pain', 'Cucumber Eye Pads', 'Mamaearth', 199, '{"eye-pain","cucumber","cool","eye"}', 4.4, 2),
('eye-pain', 'Screen Protector Anti Glare', '3M', 599, '{"eye-pain","screen","anti-glare","protect"}', 4.5, 4),
('eye-pain', 'Vitamin A Supplement', 'Healthkart', 349, '{"eye-pain","vitamin-a","supplement","eye"}', 4.6, 3),

-- CATEGORY: Rainy Season (10 products)
('rainy-season', 'Rainco Compact Umbrella', 'Rainco', 299, '{"rainy-season","umbrella","rain","compact"}', 4.5, 2),
('rainy-season', 'Waterproof Rain Jacket', 'Columbia', 1999, '{"rainy-season","jacket","waterproof","rain"}', 4.7, 4),
('rainy-season', 'Gumboots Rubber Boots', 'Hillson', 499, '{"rainy-season","boots","rubber","waterproof"}', 4.4, 3),
('rainy-season', 'Raincoat Poncho', 'Decathlon', 399, '{"rainy-season","raincoat","poncho","rain"}', 4.6, 3),
('rainy-season', 'Waterproof Bag Cover', 'Wildcraft', 299, '{"rainy-season","bag","cover","waterproof"}', 4.5, 2),
('rainy-season', 'Moisture Absorber Packets', 'DampRid', 249, '{"rainy-season","moisture","absorb","home"}', 4.7, 3),
('rainy-season', 'Anti Fungal Powder', 'Candid', 149, '{"rainy-season","fungal","powder","feet"}', 4.8, 2),
('rainy-season', 'Shoe Waterproof Spray', 'Scotchgard', 499, '{"rainy-season","shoe","waterproof","spray"}', 4.4, 4),
('rainy-season', 'Quick Dry Towel', 'Burnlab', 349, '{"rainy-season","towel","quick-dry","travel"}', 4.6, 2),
('rainy-season', 'Rain Sensor Night Lamp', 'Syska', 299, '{"rainy-season","lamp","sensor","home"}', 4.3, 3),

-- CATEGORY: Summer Vacation (10 products)
('summer', 'Sunscreen SPF 50', 'Dot and Key', 395, '{"summer","sunscreen","spf","protect","skin"}', 4.7, 2),
('summer', 'Cooling Towel Instant', 'Chill Pal', 299, '{"summer","towel","cool","instant"}', 4.5, 3),
('summer', 'Water Bottle Insulated 1L', 'Milton', 599, '{"summer","water-bottle","insulated","cold"}', 4.8, 2),
('summer', 'Portable Hand Fan USB', 'Portronics', 349, '{"summer","fan","portable","cool"}', 4.4, 3),
('summer', 'Aloe Vera After Sun Gel', 'WOW', 249, '{"summer","aloe-vera","after-sun","cool","skin"}', 4.6, 2),
('summer', 'Anti-Tan Face Pack', 'Lotus', 199, '{"summer","face-pack","tan","remove","skin"}', 4.3, 3),
('summer', 'Electrolyte Drink Powder', 'Fast and Up', 399, '{"summer","electrolyte","hydrate","drink"}', 4.7, 2),
('summer', 'Cap Hat UV Protection', 'Columbia', 499, '{"summer","cap","hat","uv","sun"}', 4.5, 3),
('summer', 'Cooling Eye Drops', 'Rohto', 180, '{"summer","eye-drops","cool","eye"}', 4.8, 2),
('summer', 'Talcum Powder Body', 'Ponds', 149, '{"summer","talcum","powder","body","cool"}', 4.6, 2),

-- CATEGORY: Winter (10 products)
('winter', 'Himalaya Winter Care Cream', 'Himalaya', 99, '{"winter","cream","moisturize","skin","cold"}', 4.7, 2),
('winter', 'Nivea Soft Cream', 'Nivea', 149, '{"winter","cream","soft","moisturize"}', 4.8, 2),
('winter', 'Woolen Socks Thermal', 'Bonjour', 199, '{"winter","socks","thermal","warm"}', 4.5, 3),
('winter', 'Gloves Woolen', 'Wildcraft', 249, '{"winter","gloves","warm","woolen"}', 4.6, 3),
('winter', 'Muffler Scarf Woolen', 'FabIndia', 399, '{"winter","scarf","muffler","warm"}', 4.7, 4),
('winter', 'Lip Balm SPF 15', 'Biotique', 99, '{"winter","lip-balm","dry-lips","moisturize"}', 4.5, 2),
('winter', 'Electric Room Heater', 'Bajaj', 1299, '{"winter","heater","room","warm","electric"}', 4.6, 4),
('winter', 'Blanket Fleece Heavy', 'Bombay Dyeing', 799, '{"winter","blanket","fleece","warm"}', 4.7, 3),
('winter', 'Vaseline Intensive Care', 'Vaseline', 199, '{"winter","body-lotion","dry-skin","moisturize"}', 4.8, 2),
('winter', 'Hot Water Bag', 'Prestige', 299, '{"winter","hot-water-bag","warm","pain"}', 4.5, 2),

-- CATEGORY: Wheel Puncture (6 products)
('puncture', 'Tyre Puncture Repair Kit', 'Slime', 299, '{"puncture","tyre","repair","kit","wheel"}', 4.5, 3),
('puncture', 'Tubeless Tyre Sealant', 'Slime', 499, '{"puncture","sealant","tubeless","tyre"}', 4.3, 4),
('puncture', 'Portable Air Compressor', 'Michelin', 1299, '{"puncture","air","compressor","tyre","pump"}', 4.7, 4),
('puncture', 'Tyre Pressure Gauge', 'Wika', 199, '{"puncture","pressure","gauge","tyre","check"}', 4.6, 3),
('puncture', 'Emergency Puncture Spray', 'Holts', 349, '{"puncture","emergency","spray","fix","tyre"}', 4.4, 4),
('puncture', 'Reflective Safety Triangle', 'Roots', 199, '{"puncture","safety","triangle","road","emergency"}', 4.8, 2),

-- CATEGORY: Depression (8 products)
('depression', 'Chamomile Calm Tea', 'Organic India', 299, '{"depression","tea","calm","relax","mental-health"}', 4.7, 2),
('depression', 'Journal Notebook', 'Paperage', 299, '{"depression","journal","write","express","mental-health"}', 4.8, 2),
('depression', 'Ashwagandha Supplement', 'Himalaya', 299, '{"depression","ashwagandha","supplement","stress","calm"}', 4.6, 3),
('depression', 'Aromatherapy Diffuser', 'Iris', 799, '{"depression","aroma","diffuser","calm","relax"}', 4.5, 4),
('depression', 'Lavender Essential Oil', 'Soulflower', 199, '{"depression","lavender","oil","calm","relax"}', 4.7, 3),
('depression', 'Self Help Book', 'Penguin', 499, '{"depression","book","self-help","heal","mind"}', 4.8, 3),
('depression', 'Weighted Blanket', 'Dreamz', 2499, '{"depression","blanket","weighted","comfort","calm"}', 4.7, 5),
('depression', 'Meditation Cushion', 'Boldfit', 599, '{"depression","meditation","cushion","mindful","calm"}', 4.6, 4),

-- CATEGORY: Overthinking (8 products)
('overthinking', 'Ashwagandha KSM-66', 'Himalaya', 299, '{"overthinking","ashwagandha","calm","stress","supplement"}', 4.7, 3),
('overthinking', 'Fidget Cube Desk Toy', 'Zuru', 299, '{"overthinking","fidget","toy","focus","calm"}', 4.5, 3),
('overthinking', 'Mindfulness Journal', 'Paperage', 349, '{"overthinking","journal","mindful","write","calm"}', 4.8, 2),
('overthinking', 'Guided Meditation Book', 'Penguin', 399, '{"overthinking","meditation","book","mindful"}', 4.6, 3),
('overthinking', 'Chamomile Sleep Tea', 'Organic India', 299, '{"overthinking","tea","sleep","calm"}', 4.7, 2),
('overthinking', 'Stress Ball Set 3', 'Boldfit', 199, '{"overthinking","stress-ball","squeeze","calm"}', 4.4, 2),
('overthinking', 'White Noise Machine', 'LectroFan', 2999, '{"overthinking","white-noise","sleep","calm"}', 4.8, 4),
('overthinking', 'Adult Coloring Book', 'Hinkler', 299, '{"overthinking","coloring","relax","creative","calm"}', 4.6, 3),

-- CATEGORY: Feeling Alone (8 products)
('alone', 'Indoor Plant Set 3', 'Ugaoo', 699, '{"alone","plant","company","calm","indoor"}', 4.6, 4),
('alone', 'Board Game Solo', 'Hasbro', 599, '{"alone","game","fun","solo","activity"}', 4.5, 3),
('alone', 'Journal Diary Premium', 'Paperage', 349, '{"alone","journal","diary","write","express"}', 4.8, 2),
('alone', 'Sketch Pad and Pencils', 'Brustro', 399, '{"alone","sketch","draw","creative","activity"}', 4.7, 3),
('alone', 'Mini Bluetooth Speaker', 'boAt', 999, '{"alone","speaker","music","company"}', 4.6, 2),
('alone', 'Self Help Feel Good Book', 'Penguin', 499, '{"alone","book","positive","self-help"}', 4.8, 3),
('alone', 'Aromatherapy Candle Set', 'Iris', 449, '{"alone","candle","aroma","comfort","calm"}', 4.7, 3),
('alone', 'Hot Chocolate Mix', 'Cadbury', 249, '{"alone","chocolate","hot-drink","comfort","cozy"}', 4.9, 2),

-- CATEGORY: Women Gift (10 products)
('women-gift', 'Nykaa Beauty Gift Set', 'Nykaa', 799, '{"women-gift","beauty","makeup","gift","women"}', 4.6, 3),
('women-gift', 'Plum Skincare Kit', 'Plum', 999, '{"women-gift","skincare","kit","gift","women"}', 4.7, 3),
('women-gift', 'Silk Saree Light', 'FabIndia', 1499, '{"women-gift","saree","silk","gift","women"}', 4.8, 4),
('women-gift', 'Jewellery Box Organizer', 'House of Quirk', 499, '{"women-gift","jewellery","organizer","gift"}', 4.5, 3),
('women-gift', 'Fastrack Ladies Watch', 'Fastrack', 1199, '{"women-gift","watch","ladies","gift"}', 4.7, 3),
('women-gift', 'Scented Candle Premium', 'Iris', 599, '{"women-gift","candle","scent","gift","women"}', 4.6, 3),
('women-gift', 'Yoga Mat and Block Set', 'Strauss', 899, '{"women-gift","yoga","mat","gift","fitness"}', 4.5, 4),
('women-gift', 'Personalized Name Bracelet', 'The Crazy Me', 399, '{"women-gift","bracelet","personal","gift"}', 4.4, 4),
('women-gift', 'Forest Essentials Soap Set', 'Forest Essentials', 799, '{"women-gift","soap","luxury","gift"}', 4.8, 3),
('women-gift', 'Mini Perfume Gift Set', 'Engage', 499, '{"women-gift","perfume","fragrance","gift","women"}', 4.6, 2),

-- CATEGORY 16: Emotional & Personal Problems (10 products)
('emotional', 'Diary Journal Hardcover', 'Paperage', 399, '{"stress","emotional","journal","feelings","parental","friends"}', 4.7, 2),
('emotional', 'Self Help Book Set', 'Penguin', 599, '{"confidence","emotional","friends","self","improve"}', 4.8, 3),
('emotional', 'Stress Relief Ball', 'Boldfit', 149, '{"stress","anger","anxiety","emotional","squeeze"}', 4.5, 2),
('emotional', 'Noise Cancelling Headphones', 'Noise', 1499, '{"focus","ignore","personal space","parental","peace"}', 4.6, 4),
('emotional', 'Motivational Poster Set', 'Archies', 199, '{"motivation","confidence","emotional","inspire"}', 4.4, 3),
('emotional', 'Meditation Guide Book', 'Penguin', 299, '{"stress","calm","anxiety","emotional","peace"}', 4.7, 2),
('emotional', 'Fidget Cube', 'Zekpro', 249, '{"stress","anxiety","focus","emotional","fidget"}', 4.6, 3),
('emotional', 'Anger Management Workbook', 'New Harbinger', 499, '{"anger","emotional","parental","friends","control"}', 4.8, 3),
('emotional', 'Gratitude Journal', 'Paperage', 349, '{"emotional","gratitude","positive","feelings","daily"}', 4.9, 2),
('emotional', 'Room Door Lock', 'Godrej', 599, '{"privacy","parental","personal space","room","control"}', 4.8, 4),

-- CATEGORY 17: School Pressure & Exam Problems (10 products)
('exam', 'Exam Planner Diary', 'Classmate', 199, '{"exam","school","plan","study","pressure"}', 4.6, 2),
('exam', 'Revision Flashcards', 'Classmate', 99, '{"exam","revision","memory","school","study"}', 4.5, 2),
('exam', 'Focus Tea Chamomile', 'Organic India', 299, '{"focus","calm","exam","stress","study"}', 4.7, 3),
('exam', 'Blue Light Glasses', 'Specsy', 599, '{"eye","screen","study","exam","strain"}', 4.4, 3),
('exam', 'Study Timer Pomodoro', 'Time Timer', 299, '{"study","focus","exam","time","manage"}', 4.8, 2),
('exam', 'Noise Earplugs', '3M', 149, '{"focus","silence","study","exam","noise"}', 4.7, 2),
('exam', 'Highlighter Set 6', 'Stabilo', 149, '{"study","highlight","exam","revision","notes"}', 4.9, 2),
('exam', 'Sticky Notes Multicolor', 'Post-it', 129, '{"study","notes","exam","revision","organize"}', 4.8, 2),
('exam', 'Multivitamin Teens', 'Wellbeing Nutrition', 599, '{"health","energy","exam","focus","supplement"}', 4.6, 3),
('exam', 'Back Cushion Chair', 'Wakefit', 799, '{"comfort","sitting","study","exam","back"}', 4.7, 4),

-- CATEGORY 18: Hearing & Ear Problems (10 products)
('hearing', 'Ear Wax Removal Drops', 'Earex', 180, '{"hearing","ear","wax","clean","blockage"}', 4.5, 3),
('hearing', 'Ear Cleaning Kit with Irrigation', 'Bebird', 299, '{"hearing","ear","clean","wax","blockage"}', 4.4, 4),
('hearing', 'Personal Sound Amplifier', 'Banglijian', 1999, '{"hearing","sound","amplify","elderly","ear"}', 4.6, 5),
('hearing', 'Ear Protection Earplugs', '3M', 149, '{"hearing","ear","protect","noise","damage"}', 4.7, 2),
('hearing', 'Ear Massage Relaxer Device', 'Breo', 1299, '{"hearing","ear","pressure","pain","relief"}', 4.3, 4),
('hearing', 'Swimmer Ear Drops', 'Otikon', 220, '{"hearing","ear","swimmer","water","infection"}', 4.6, 3),
('hearing', 'Ear Thermometer', 'Omron', 999, '{"hearing","ear","fever","temperature","health"}', 4.8, 2),
('hearing', 'Tinnitus Relief Sound Machine', 'LectroFan', 2999, '{"hearing","tinnitus","ringing","ear","relief"}', 4.7, 4),
('hearing', 'Ear Infection Relief Drops', 'Himalaya', 150, '{"hearing","ear","infection","pain","drops"}', 4.5, 2),
('hearing', 'ENT Care Handbook', 'Penguin Health', 299, '{"hearing","ear","health","guide","ent"}', 4.4, 3),

-- CATEGORY 19: Pigmentation & Skin Tone Problems (12 products)
('pigmentation', 'Vitamin C Face Serum 20%', 'Minimalist', 599, '{"pigmentation","dark spots","vitamin c","skin","glow"}', 4.6, 2),
('pigmentation', 'Niacinamide 10% Serum', 'Minimalist', 449, '{"pigmentation","pores","skin","niacinamide","tone"}', 4.7, 2),
('pigmentation', 'Kojic Acid Brightening Soap', 'Vaadi Herbals', 199, '{"pigmentation","dark spots","kojic","brightening","soap"}', 4.4, 3),
('pigmentation', 'SPF 50 Sunscreen PA+++', 'Re''equil', 399, '{"pigmentation","sunscreen","spf","protect","skin"}', 4.8, 2),
('pigmentation', 'Alpha Arbutin 2% Serum', 'Minimalist', 499, '{"pigmentation","dark spots","arbutin","tone","skin"}', 4.5, 3),
('pigmentation', 'Brightening Face Wash', 'Plum', 299, '{"pigmentation","face wash","brightening","glow","skin"}', 4.6, 2),
('pigmentation', 'AHA BHA Peeling Solution', 'The Ordinary', 799, '{"pigmentation","exfoliate","peel","dark spots","skin"}', 4.9, 3),
('pigmentation', 'Licorice Root Face Pack', 'Khadi Natural', 249, '{"pigmentation","natural","licorice","pack","skin"}', 4.5, 2),
('pigmentation', 'Glycolic Acid Toner', 'Minimalist', 449, '{"pigmentation","toner","glycolic","exfoliate","glow"}', 4.6, 2),
('pigmentation', 'Derma Roller 0.5mm', 'Bombay Shaving', 399, '{"pigmentation","derma","roller","absorption","skin"}', 4.3, 4),
('pigmentation', 'Turmeric Face Cream', 'Biotique', 199, '{"pigmentation","turmeric","natural","ayurvedic","skin"}', 4.4, 2),
('pigmentation', 'Sunscreen Stick SPF 60', 'Neutrogena', 599, '{"pigmentation","sunscreen","stick","protect","reapply"}', 4.7, 3),

-- CATEGORY 20: Dark Circles & Eye Care Problems (12 products)
('dark-circles', 'Under Eye Cream Retinol', 'Minimalist', 499, '{"dark circles","under eye","retinol","cream","puffy"}', 4.5, 3),
('dark-circles', 'Cucumber Eye Gel', 'Plum', 349, '{"dark circles","eye gel","cucumber","cooling","puffy"}', 4.6, 2),
('dark-circles', 'Vitamin C Eye Serum', 'Garnier', 599, '{"dark circles","vitamin c","eye","serum","brighten"}', 4.4, 3),
('dark-circles', 'Rose Water Toner', 'Gulabari', 99, '{"dark circles","rose water","toner","soothe","eye"}', 4.8, 2),
('dark-circles', 'Eye Massage Roller', 'Finishing Touch', 799, '{"dark circles","massage","roller","puffiness","eye"}', 4.5, 4),
('dark-circles', 'Collagen Eye Patches 30pairs', 'Skederm', 499, '{"dark circles","collagen","patches","eye","hydrate"}', 4.6, 3),
('dark-circles', 'Sleep Eye Mask Silk', 'Drowsy', 399, '{"dark circles","sleep","mask","eye","rest"}', 4.7, 3),
('dark-circles', 'Iron Supplement Tablets', 'Carbamide Forte', 399, '{"dark circles","iron","deficiency","supplement","health"}', 4.5, 2),
('dark-circles', 'Vitamin K Cream', 'Rejuglow', 449, '{"dark circles","vitamin k","cream","under eye","dark"}', 4.4, 3),
('dark-circles', 'Green Tea Eye Pads', 'MCaffeine', 299, '{"dark circles","green tea","eye","pads","depuff"}', 4.6, 2),
('dark-circles', 'Almond Oil Pure', 'Bajaj', 199, '{"dark circles","almond oil","natural","under eye","moisturize"}', 4.8, 2),
('dark-circles', 'Cold Eye Compress Mask', 'Rester', 349, '{"dark circles","cold","compress","puffy","eye relief"}', 4.5, 3);
