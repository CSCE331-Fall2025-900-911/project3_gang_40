import React from "react";

function MenuItem (props) {
    return(
        <div className="menuItem">
            <img src= {props.menu.imgUrl}/>
            <h2>{props.menu.name} - {props.menu.price}</h2>
            <p>{props.menu.toppings}</p>
        </div>
    )
}

export default MenuItem;