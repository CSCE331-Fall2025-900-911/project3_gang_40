import React from "react";

function MenuItem (props) {
    return(
        <div className="menuItem">
            <img src= {props.menu.imgUrl}/>
            <h2>{props.menu.name}</h2>
            <p>{props.menu.price}</p>
            <p>{props.menu.toppings}</p>
        </div>
    )
}

export default MenuItem;