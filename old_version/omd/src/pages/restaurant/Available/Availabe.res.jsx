import React from 'react';
import { useParams } from 'react-router-dom';
import MenuComponent from "../../../components/MenuComponent/Menu.comp.jsx"
const Available = () => {
  const { nameOfRestaurant, idOfRestaurant } = useParams();

  return (
    <>
      <head>
        <title>
          Available Dishes
        </title>
      </head>
      <MenuComponent
        mainUrl={`/restaurant/menu/${idOfRestaurant}&available=true`}
        onclickURL={`/restaurant/${nameOfRestaurant}/${idOfRestaurant}/available`}
      />
    </>
  )
}

export default Available
