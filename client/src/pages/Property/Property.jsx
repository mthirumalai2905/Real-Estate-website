import React from "react";
import { useLocation } from "react-router-dom";
import { useQuery } from "react-query";
import { getProperty } from "../../utils/api";
import { PuffLoader } from "react-spinners";
import { AiFillHeart, AiTwotoneCar } from "react-icons/ai"; // Corrected AiTwotoneCar to AiCar
import { MdMeetingRoom, MdLocationPin } from "react-icons/md";
import { FaShower } from "react-icons/fa";
import "./Property.css";
import Map from "../../components/Map/Map";

const Property = () => {
  const { pathname } = useLocation();
  const id = pathname.split("/").slice(-1)[0];
  const { data, isLoading, isError } = useQuery(["resd", id], () =>
    getProperty(id)
  );

  if (isLoading) {
    return (
      <div className="wrapper">
        <div className="flexCenter paddings">
          <PuffLoader />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="wrapper">
        <div className="flexCenter paddings">
          <span>Error while fetching the property details</span>
        </div>
      </div>
    );
  }

  return (
    <div className="wrapper">
      <div className="flexColStart paddings innerWidth property-container">
        {/* Like Button */}
        <div className="like">
          <AiFillHeart size={24} color="white" />
        </div>

        {/* Image */}
        <img src={data?.image} alt="home image" />
        {/* Head */}
        <div className="flexStart head">
          <span className="primaryText">{data?.title}</span>
          <span className="orangeText" style={{ fontSize: "1.5rem" }}>
            $ {data?.price}
          </span>
        </div>

        <div className="flexCenter property-details">
          {/* Left */}
          <div className="flexColStart left"></div>

          {/* Facilities */}
          <div className="flexStart facilities">
            {/* Bathrooms */}
            <div className="flexStart facility">
              <FaShower size={20} color="#1F3E72" />
              <span>{data?.facilities?.bathrooms} bathrooms</span>
            </div>

            {/* Parkings */}
            <div className="flexStart facility">
              <AiTwotoneCar size={20} color="#1F3E72" /> {/* Corrected icon */}
              <span>{data?.facilities?.parkings} Parking</span>
            </div>

            {/* Rooms */}
            <div className="flexStart facility">
              <MdMeetingRoom size={20} color="#1F3E72" />
              <span>{data?.facilities?.bedrooms} Rooms</span>
            </div>

            {/* Description */}
            <span className="secondaryText" style={{ textAlign: "justify" }}>
              {data?.description}
            </span>

            {/* Address */}
            <div className="flexStart facility">
              <MdLocationPin size={25} color="#1F3E72" />
              <div className="secondaryText">
                {data?.address}, {data?.city}, {data?.country}
              </div>
            </div>

            {/*Booking button */}
            <button className="button">Book your visit</button>
          </div>

          {/* Right */}
          <div className="map">
            <Map
              address={data?.address}
              city={data?.city}
              country={data?.country}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Property;
