import React from "react";
import MenuItem from "./MenuItem";
import berryLychee from "../../../public/assets/images/berry_lychee.png"

function Display() {
    return (

        
        <div>
            <MenuItem 
               menu = {{name: "Berry Lychee",
                imgUrl: berryLychee,
                toppings: "je"}}
            />
            <MenuItem 
                menu = {{name: "",
                imgUrl: "je",
                toppings: "jej"}}
            />
            
        </div>
    )
}

export default Display;