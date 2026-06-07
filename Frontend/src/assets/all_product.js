import p1_img from "./product_1.png";
import p2_img from "./product_2.png";
import p3_img from "./product_3.png";
import p4_img from "./product_4.png";
import p5_img from "./product_5.png";
import p6_img from "./product_6.png";
import p7_img from "./product_7.png";
import p8_img from "./product_8.png";
import p9_img from "./product_9.png";
import p10_img from "./product_10.png";
import p11_img from "./product_11.png";
import p12_img from "./product_12.png";
import p13_img from "./product_13.png";
import p14_img from "./product_14.png";
import p15_img from "./product_15.png";
import p16_img from "./product_16.png";
import p17_img from "./product_17.png";
import p18_img from "./product_18.png";
import p19_img from "./product_19.png";
import p20_img from "./product_20.png";
import p21_img from "./product_21.png";
import p22_img from "./product_22.png";
import p23_img from "./product_23.png";
import p24_img from "./product_24.png";
import p25_img from "./product_25.png";
import p26_img from "./product_26.png";
import p27_img from "./product_27.png";
import p28_img from "./product_28.png";
import p29_img from "./product_29.png";
import p30_img from "./product_30.png";
import p31_img from "./product_31.png";
import p32_img from "./product_32.png";
import p33_img from "./product_33.png";
import p34_img from "./product_34.png";
import p35_img from "./product_35.png";
import p36_img from "./product_36.png";

let all_product = [
  {
    id: 1,
    name: "Floral Ruffle Sleeve Blouse",
    category: "women",
    image: p1_img,
    new_price: 49.99,
    old_price: 79.99,
  },
  {
    id: 2,
    name: "Linen Button-Up Shirt",
    category: "women",
    image: p2_img,
    new_price: 69.0,
    old_price: 99.0,
  },
  {
    id: 3,
    name: "Cotton Wrap Top",
    category: "women",
    image: p3_img,
    new_price: 59.5,
    old_price: 89.0,
  },
  {
    id: 4,
    name: "Sleeveless Pleat Blouse",
    category: "women",
    image: p4_img,
    new_price: 45.0,
    old_price: 70.0,
  },
  {
    id: 5,
    name: "Ribbed Knit Top",
    category: "women",
    image: p5_img,
    new_price: 39.99,
    old_price: 59.99,
  },
  {
    id: 6,
    name: "Embroidered Collar Shirt",
    category: "women",
    image: p6_img,
    new_price: 72.0,
    old_price: 109.0,
  },
  {
    id: 7,
    name: "Buttoned Peplum Top",
    category: "women",
    image: p7_img,
    new_price: 55.0,
    old_price: 85.0,
  },
  {
    id: 8,
    name: "Chiffon Overlay Blouse",
    category: "women",
    image: p8_img,
    new_price: 62.5,
    old_price: 95.0,
  },
  {
    id: 9,
    name: "Square Neck Tunic",
    category: "women",
    image: p9_img,
    new_price: 48.0,
    old_price: 74.0,
  },
  {
    id: 10,
    name: "Lace Trim Camisole",
    category: "women",
    image: p10_img,
    new_price: 34.0,
    old_price: 50.0,
  },
  {
    id: 11,
    name: "Gathered Sleeve Blouse",
    category: "women",
    image: p11_img,
    new_price: 58.0,
    old_price: 89.0,
  },
  {
    id: 12,
    name: "Printed V-Neck Top",
    category: "women",
    image: p12_img,
    new_price: 44.5,
    old_price: 69.0,
  },
  {
    id: 13,
    name: "Slim Fit Bomber Jacket",
    category: "men",
    image: p13_img,
    new_price: 95.0,
    old_price: 140.0,
  },
  {
    id: 14,
    name: "Quilted Puffer Jacket",
    category: "men",
    image: p14_img,
    new_price: 120.0,
    old_price: 170.0,
  },
  {
    id: 15,
    name: "Fleece-Lined Hoodie Jacket",
    category: "men",
    image: p15_img,
    new_price: 64.5,
    old_price: 99.0,
  },
  {
    id: 16,
    name: "Denim Trucker Jacket",
    category: "men",
    image: p16_img,
    new_price: 78.0,
    old_price: 115.0,
  },
  {
    id: 17,
    name: "Water-Resistant Windbreaker",
    category: "men",
    image: p17_img,
    new_price: 54.0,
    old_price: 80.0,
  },
  {
    id: 18,
    name: "Wool Blend Overcoat",
    category: "men",
    image: p18_img,
    new_price: 150.0,
    old_price: 220.0,
  },
  {
    id: 19,
    name: "Hooded Quilted Jacket",
    category: "men",
    image: p19_img,
    new_price: 89.0,
    old_price: 129.0,
  },
  {
    id: 20,
    name: "Casual Track Jacket",
    category: "men",
    image: p20_img,
    new_price: 49.99,
    old_price: 74.99,
  },
  {
    id: 21,
    name: "Leather-Look Biker Jacket",
    category: "men",
    image: p21_img,
    new_price: 135.0,
    old_price: 199.0,
  },
  {
    id: 22,
    name: "Shirt-Jacket Hybrid",
    category: "men",
    image: p22_img,
    new_price: 59.0,
    old_price: 89.0,
  },
  {
    id: 23,
    name: "Insulated Parka",
    category: "men",
    image: p23_img,
    new_price: 180.0,
    old_price: 250.0,
  },
  {
    id: 24,
    name: "Corduroy Overshirt",
    category: "men",
    image: p24_img,
    new_price: 68.0,
    old_price: 99.0,
  },
  {
    id: 25,
    name: "Kids Orange Hoodie - Stripes",
    category: "kid",
    image: p25_img,
    new_price: 25.0,
    old_price: 40.0,
  },
  {
    id: 26,
    name: "Kids Blue Hoodie - Graphic",
    category: "kid",
    image: p26_img,
    new_price: 22.5,
    old_price: 35.0,
  },
  {
    id: 27,
    name: "Kids Green Zip-Up Hoodie",
    category: "kid",
    image: p27_img,
    new_price: 28.0,
    old_price: 45.0,
  },
  {
    id: 28,
    name: "Kids Colourblocked Pullover",
    category: "kid",
    image: p28_img,
    new_price: 26.0,
    old_price: 39.0,
  },
  {
    id: 29,
    name: "Kids Hooded Sweatshirt - Logo",
    category: "kid",
    image: p29_img,
    new_price: 20.0,
    old_price: 32.0,
  },
  {
    id: 30,
    name: "Kids Fleece Hoodie",
    category: "kid",
    image: p30_img,
    new_price: 30.0,
    old_price: 44.0,
  },
  {
    id: 31,
    name: "Kids Dino Print Hoodie",
    category: "kid",
    image: p31_img,
    new_price: 24.0,
    old_price: 36.0,
  },
  {
    id: 32,
    name: "Kids Sports Hoodie",
    category: "kid",
    image: p32_img,
    new_price: 27.5,
    old_price: 42.0,
  },
  {
    id: 33,
    name: "Kids Heavyweight Hoodie",
    category: "kid",
    image: p33_img,
    new_price: 33.0,
    old_price: 50.0,
  },
  {
    id: 34,
    name: "Kids Hooded Jacket",
    category: "kid",
    image: p34_img,
    new_price: 31.0,
    old_price: 46.0,
  },
  {
    id: 35,
    name: "Kids Colour Pop Hoodie",
    category: "kid",
    image: p35_img,
    new_price: 21.0,
    old_price: 33.0,
  },
  {
    id: 36,
    name: "Kids Cartoon Print Hoodie",
    category: "kid",
    image: p36_img,
    new_price: 29.0,
    old_price: 41.0,
  },
];

export default all_product;
