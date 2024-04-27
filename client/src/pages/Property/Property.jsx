import React from "react";
import { useLocation } from "react-router-dom"; // Import useParams to access URL parameters
import { useQuery } from "react-query";
import { getProperty } from "../../utils/api";
import { PuffLoader } from "react-spinners";
import { AiFillHeart, AiTwotoneCar } from "react-icons/ai"; // Import AiCar icon
import { MdMeetingRoom } from "react-icons/md";
import { FaShower } from "react-icons/fa"; // Import FaShower icon
import "./Property.css";

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
              <AiTwotoneCar size={20} color="#1F3E772" /> {/* Replaced AiTwotoneCar with AiCar */}
              <span>{data?.facilities?.parkings} Parking</span>
            </div>

            {/* Rooms */}
            <div className="flexStart facility">
              <MdMeetingRoom size={20} color="#1F3E72" />
              <span>{data?.facilities?.bedrooms} Rooms</span>
            </div>
          </div>

          {/* Right */}
          <div className="right">This is the right side</div>
        </div>
      </div>
    </div>
  );
};

export default Property;
