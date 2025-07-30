import React from 'react';
import { useParams } from "react-router-dom";
import ProfileCardComponent from '../../../components/profile-card/ProfileCard.comp.jsx';

import "./Profile.css";

const RestaurantProfile = () => {
  const { nameOfRestaurant } = useParams()
  return (
    <>
      <head>
        <title>Ommitus | {nameOfRestaurant} </title>
      </head>
      <ProfileCardComponent
        name={nameOfRestaurant}
      />

    </>
  )
}


export default RestaurantProfile
