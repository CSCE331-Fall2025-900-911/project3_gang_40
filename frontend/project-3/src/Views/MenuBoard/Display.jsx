import React from "react";
import MenuItem from "./MenuItem";
import berryLychee from "/assets/images/berry_lychee.png"
import classicPearl from "/assets/images/classic_pearl_milk_tea.png"
import classicTea from "/assets/images/classic_tea-removebg-preview.png"
import coconutPearlMilkTea from "/assets/images/coconut_pearl_milk_tea-removebg-preview.png"
import coffeeCreama from "/assets/images/coffee_creama-removebg-preview.png"
import coffeeMilkTeaWCoffeeJelly from "/assets/images/coffee_milk_tea_w_coffee_jelly-removebg-preview.png"
import goldenRetriever from "/assets/images/golden_retriever-removebg-preview.png"
import HokkaidoPearlMilkTea from "/assets/images/hokkaido_pearl_milk_tea-removebg-preview.png"
import honeyLemonade from "/assets/images/honey_lemonade-removebg-preview.png"
import honeyPearlMilkTea from "/assets/images/honey_pearl_milk_tea-removebg-preview.png"
import honeyTea from "/assets/images/honey_tea-removebg-preview.png"
import mangoPassionFruitTea from "/assets/images/mango_&_passion_fruit_tea-removebg-preview.png"
import mangoGreenMilkTea from "/assets/images/mango_green_milk_tea-removebg-preview.png"
import mangoGreenTea from "/assets/images/mango_green_tea-removebg-preview.png"
import passionChess from "/assets/images/passion_chess-removebg-preview.png"
import peachTeaWHoneyJelly from "/assets/images/peach_tea_w_honey_jelly-removebg-preview.png"
import taroPearlMilkTea from "/assets/images/taro_pearl_milk_tea-removebg-preview.png"
import thaiPearlMilkTea from "/assets/images/thai_pearl_milk_tea-removebg-preview.png"
import tigerBoba from "/assets/images/tiger_boba-removebg-preview.png"

function Display() {
    return (

        
        <div>
            <MenuItem
               menu = {{name: "Berry Lychee",
                imgUrl: berryLychee,
                toppings: "toppings"}}
            />
            <MenuItem
                menu = {{name: "Classic Pearl Milk Tea",
                imgUrl: classicPearl,
                toppings: "toppings"}}
            />
            <MenuItem
                menu = {{name: "Classic Tea",
                imgUrl: classicTea,
                toppings: "toppings"}}
            />
            <MenuItem
                menu = {{name: "Coconut Pearl Milk Tea",
                imgUrl: coconutPearlMilkTea,
                toppings: "toppings"}}
            />
            <MenuItem
                menu = {{name: "Coffee Crema",
                imgUrl: coffeeCreama,
                toppings: "toppings"}}
            />
            <MenuItem
                menu = {{name: "Coffee Milk Tea w/ Coffee Jelly",
                imgUrl: coffeeMilkTeaWCoffeeJelly,
                toppings: "toppings"}}
            />
            <MenuItem
                menu = {{name: "Golden Retriever",
                imgUrl: goldenRetriever,
                toppings: "toppings"}}
            />
            <MenuItem
                menu = {{name: "Hokkaido Pearl Milk Tea",
                imgUrl: HokkaidoPearlMilkTea,
                toppings: "toppings"}}
            />
            <MenuItem
                menu = {{name: "Honey Lemonade",
                imgUrl: honeyLemonade,
                toppings: "toppings"}}
            />
            <MenuItem
                menu = {{name: "Honey Pearl Milk Tea",
                imgUrl: honeyPearlMilkTea,
                toppings: "toppings"}}
            />
            <MenuItem
                menu = {{name: "Honey Tea",
                imgUrl: honeyTea,
                toppings: "toppings"}}
            />
            <MenuItem
                menu = {{name: "Mango & Passion Fruit Tea",
                imgUrl: mangoPassionFruitTea,
                toppings: "toppings"}}
            />
            <MenuItem
                menu = {{name: "Mango Green Milk Tea",
                imgUrl: mangoGreenMilkTea,
                toppings: "toppings"}}
            />
            <MenuItem
                menu = {{name: "Mango Green Tea",
                imgUrl: mangoGreenTea,
                toppings: "toppings"}}
            />
            <MenuItem
                menu = {{name: "Passion Chess",
                imgUrl: passionChess,
                toppings: "toppings"}}
            />
            <MenuItem
                menu = {{name: "Peach Tea w/ Honey Jelly",
                imgUrl: peachTeaWHoneyJelly,
                toppings: "toppings"}}
            />
            <MenuItem
                menu = {{name: "Taro Pearl Milk Tea",
                imgUrl: taroPearlMilkTea,
                toppings: "toppings"}}
            />
            <MenuItem
                menu = {{name: "Thai Pearl Milk Tea",
                imgUrl: thaiPearlMilkTea,
                toppings: "toppings"}}
            />
            <MenuItem
                menu = {{name: "Tiger Boba",
                imgUrl: tigerBoba,
                toppings: "toppings"}}
            />
        </div>
    )
}

export default Display;