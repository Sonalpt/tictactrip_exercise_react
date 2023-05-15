import React, { useState, useRef } from 'react';
import '../styles/index.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faCircleDot, faChevronDown, faChevronUp, faArrowsUpDown, faLocationDot, faCalendar } from '@fortawesome/free-solid-svg-icons';

export const SearchBar: React.FC = () => {

  const exampleDestinationsArray : string[] = ["Paris, France", "Antibes, France", "Madrid, Espagne", 
    "Seoul, Korée du sud", "Sydney, Australie", "Caire, Egypte", "Tokyo, Japon",
    "Le Puy-En-velay, France", "Hong Kong, Chine", "Nouvelle Orléans, Etats-Unis"
  ];

  const [isTripFromFocused, setIsTripFromFocused] = React.useState<boolean>(false);
  const [isTripToFocused, setIsTripToFocused] = React.useState<boolean>(false);

  const inputTripFromRef = useRef<HTMLInputElement>(null)
  const inputTripToRef = useRef<HTMLInputElement>(null)

  const listTripFromStyle: React.CSSProperties = {
    position: 'absolute',
    top: inputTripFromRef.current ? inputTripFromRef.current.offsetTop + inputTripFromRef.current.offsetHeight : 0,
    left: inputTripFromRef.current && inputTripFromRef.current.parentElement ? inputTripFromRef.current.offsetLeft - inputTripFromRef.current.parentElement.offsetLeft * 0.8 : 0,
  };
  const listTripToStyle: React.CSSProperties = {
    position: 'absolute',
    top: inputTripToRef.current ? inputTripToRef.current.offsetTop + inputTripToRef.current.offsetHeight : 0,
    left: inputTripToRef.current && inputTripToRef.current.parentElement ? inputTripToRef.current.offsetLeft - inputTripToRef.current.parentElement.offsetLeft * 0.1 : 0,
  };

  const handleTripFromFocus = () => {
    isTripFromFocused ? setIsTripFromFocused(false) : setIsTripFromFocused(true)
  }

  const handleTripToFocus = () => {
    isTripToFocused ? setIsTripToFocused(false) : setIsTripToFocused(true)
  }

  return (
    <nav>
      <div className='trip_details'>
        <div className='trip_type'>
            <span>One-way</span>
            <FontAwesomeIcon icon={faChevronDown} />
          </div>
          <div className='passengers_details'>
            <span>1 adult, No discount card</span>
            <FontAwesomeIcon icon={faChevronDown} />
          </div>
        </div>
      <div className='container'>
        <div className='trip_from'>
          <FontAwesomeIcon icon={faCircleDot} />
          <input type="text" placeholder='From: City, Station Or Airport' ref={inputTripFromRef} onFocus={handleTripFromFocus} onBlur={handleTripFromFocus} />
          <FontAwesomeIcon className='svg_up_down' icon={faArrowsUpDown} />
          {isTripFromFocused && (
        <div className='list_trip' style={listTripFromStyle}>
          <ul>
            {exampleDestinationsArray.map((city, index) => (
              <li key={index}>
                <FontAwesomeIcon icon={faLocationDot} />
                <span>{city}</span>
                </li>
            ))}
          </ul>
        </div>
      )}
        </div>
        <div className="trip_to">
          <FontAwesomeIcon icon={faLocationDot} />
          <input type="text" placeholder='To: City, Station Or Airport' ref={inputTripToRef} onFocus={handleTripToFocus} onBlur={handleTripToFocus}/>
          {isTripToFocused && (
        <div className='list_trip' style={listTripToStyle}>
          <ul>
            {exampleDestinationsArray.map((city, index) => (
              <li key={index}>
                <FontAwesomeIcon icon={faLocationDot} />
                <span>{city}</span>
                </li>
            ))}
          </ul>
        </div>
      )}
        </div>
        <div className="date">
          <div className="date_from">
            <FontAwesomeIcon icon={faCalendar} />
            <span className='empty_date'>+ Add departure</span>
          </div>
          <div className="separation_bar"></div>
          <div className="date_to">
            <FontAwesomeIcon icon={faCalendar} />
            <span className='empty_date'>+ Add return</span>
          </div>
        </div>
        <button>Search</button>
      </div>
      <div className="toggle_accomodation">
          <div className="toggle_button">
            <div className="toggle_circle"></div>
          </div>
          <span>Find my accomodation</span>
        </div>
    </nav>
  )
}
