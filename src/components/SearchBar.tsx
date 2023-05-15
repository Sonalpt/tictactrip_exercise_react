import React from 'react';
import '../styles/index.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faCircleDot, faChevronDown, faChevronUp, faArrowsUpDown, faLocationDot, faCalendar } from '@fortawesome/free-solid-svg-icons';

export const SearchBar = () => {
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
          <input type="text" />
          <FontAwesomeIcon className='svg_up_down' icon={faArrowsUpDown} />
        </div>
        <div className="trip_to">
          <FontAwesomeIcon icon={faLocationDot} />
          <input type="text" />
        </div>
        <div className="date">
          <div className="date_from">
            <FontAwesomeIcon icon={faCalendar} />
            <input type="text" placeholder='+Add departure'/>
          </div>
          <div className="separation_bar"></div>
          <div className="date_to">
            <FontAwesomeIcon icon={faCalendar} />
            <input type="text" placeholder='+Add return'/>
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
