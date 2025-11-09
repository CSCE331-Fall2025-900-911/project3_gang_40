import React from "react";
import MenuItem from "./MenuItem";
import berryLychee from "/assets/images/berry_lychee.png"
import classicPearl from "/assets/images/classic_pearl_milk_tea.png"

function Display() {
    return (

        
        <div>
            <MenuItem 
               menu = {{name: "Berry Lychee",
                imgUrl: berryLychee,
                toppings: "je"}}
            />
            <MenuItem 
                menu = {{name: "Classic Pearl Milk Tea",
                imgUrl: classicPearl,
                toppings: "jej"}}
            />
            
        </div>
    )
}

export default Display;