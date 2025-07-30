import React from 'react';
import { useParams } from 'react-router-dom';
import MenuComponent from "../../../components/MenuComponent/Menu.comp.jsx"
const Unavailable = () => {
  const { nameOfRestaurant, idOfRestaurant } = useParams();

  return (
    <>
      <head>
        <title>
          Un-available Dishes
        </title>
      </head>
      <MenuComponent
        mainUrl={`/restaurant/menu/${idOfRestaurant}&available=false`}
        onclickURL={`/restaurant/${nameOfRestaurant}/${idOfRestaurant}/available`}
      />
    </>
  )
}



export default Unavailable
