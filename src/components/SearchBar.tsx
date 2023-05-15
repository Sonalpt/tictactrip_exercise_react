import React, { useState, useRef, useEffect, useCallback } from 'react';
import axios, { AxiosResponse } from 'axios';
import '../styles/index.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faCircleDot, faChevronDown, faArrowsUpDown, faLocationDot, faCalendar } from '@fortawesome/free-solid-svg-icons';

export const SearchBar: React.FC = () => {

  interface PopularCity {
    id: number;
    unique_name: string;
    local_name: string;
    latitude: number;
    longitude: number;
    new_id: string;
    city_id: number;
    gpuid: string;
    nb_search: string;
    popular: boolean;
    iscity: boolean;
  };

  interface AutocompletionCity {
    city_id: number;
    station_id: number;
    local_name: string;
    latitude: number;
    longitude: number;
    unique_name: string;
    station_unique_name: string | null;
    iscity: boolean;
    score: number;
    serviced: boolean;
    emoji: string | null;
    gpuid: string;
  }

  interface PopularCityFromSomewhere {
    id: number;
    unique_name: string;
    local_name: string;
    latitude: number;
    longitude: number;
    new_id: string;
    city_id: number;
    gpuid: string;
    nb_search: string;
    popular: boolean;
    iscity: boolean;
  }

  // les states pour les 3 API
  const [popularList, setPopularList] = React.useState<PopularCity[]>([]);
  const [autocompletionList, setAutocompletionList] = React.useState<AutocompletionCity[]>([]);
  const [popularListFromCity, setPopularListFromCity] = React.useState<PopularCityFromSomewhere[]>([]);

  // les states des textes des deux inputs
  const [inputTripFromContent, setInputTripFromContent] = React.useState<string>();
  const [selectedCity, setSelectedCity] = React.useState<string>("");

  // un exemple de liste de villes avant de passer aux API
  const exampleDestinationsArray : string[] = ["Paris, France", "Antibes, France", "Madrid, Espagne", 
    "Seoul, Korée du sud", "Sydney, Australie", "Caire, Egypte", "Tokyo, Japon",
    "Le Puy-En-velay, France", "Hong Kong, Chine", "Nouvelle Orléans, Etats-Unis"
  ];

  // Les state pour les focus des input
  const [isTripFromFocused, setIsTripFromFocused] = React.useState<boolean>(false);
  const [isTripToFocused, setIsTripToFocused] = React.useState<boolean>(false);

  // des useRef pour gérer la position de la liste par rapport à l'input d'au dessus
  const inputTripFromRef = useRef<HTMLInputElement>(null)
  const inputTripToRef = useRef<HTMLInputElement>(null)

  // le style pour la position des différentes listes
  const listTripFromStyle: React.CSSProperties = {
    position: 'absolute',
    top: inputTripFromRef.current ? inputTripFromRef.current.offsetTop + inputTripFromRef.current.offsetHeight : 0,
    left: inputTripFromRef.current && inputTripFromRef.current.parentElement ? inputTripFromRef.current.offsetLeft - inputTripFromRef.current.parentElement.offsetLeft * 0.6 : 0,
  };
  const listTripToStyle: React.CSSProperties = {
    position: 'absolute',
    top: inputTripToRef.current ? inputTripToRef.current.offsetTop + inputTripToRef.current.offsetHeight : 0,
    left: inputTripToRef.current && inputTripToRef.current.parentElement ? inputTripToRef.current.offsetLeft - inputTripToRef.current.parentElement.offsetLeft * 0.1 : 0,
  };

  // la gestion des state pour les focus des input, pour afficher ou non les listes
  const handleTripFromFocus = () => {
    if (isTripFromFocused) {
      setIsTripFromFocused(false);
      setAutocompletionList([])
    } else if (!isTripFromFocused)
     setIsTripFromFocused(true)
  }
  const handleTripToFocus = () => {
    isTripToFocused ? setIsTripToFocused(false) : setIsTripToFocused(true);
    if (inputTripFromContent != "" || null) {
      axios
      .get(`https://api.comparatrip.eu/cities/popular/from/${inputTripFromContent}/5`)
      .then((response: AxiosResponse<any>) => {
        setPopularListFromCity(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
    }
  }

  const handleTypingInTripFromInput = () => {
    if (inputTripFromRef.current) {
      setInputTripFromContent(inputTripFromRef.current.value);
    }
    if (inputTripFromContent !== "") {
      axios
      .get(`https://api.comparatrip.eu/cities/autocomplete/?q=${inputTripFromContent}`)
      .then((response: AxiosResponse<any>) => {
        setAutocompletionList(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
    }
    if (!inputTripFromRef.current?.value) {
      setInputTripFromContent("");
      setAutocompletionList([]);
    }
  }

  const handleListItemClick = useCallback((text: string) => {
    setInputTripFromContent(text)
    console.log(inputTripFromContent)
    if (inputTripFromRef.current && inputTripFromContent) {
      inputTripFromRef.current.value = inputTripFromContent;
      inputTripFromRef.current.focus();
      console.log(inputTripFromRef.current.value)
    }
    console.log(inputTripFromContent)
  }, []);

  useEffect(() => {
    axios
      .get("https://api.comparatrip.eu/cities/popular/5")
      .then((response: AxiosResponse<any>) => {
        setPopularList(response.data);
        if (popularList.length > 0) {
        } 
      })
      .catch((error) => {
        console.error(error);
      });
  }, [popularList.length < 1]);

  

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
          <input type="text" placeholder='From: City, Station Or Airport' ref={inputTripFromRef} 
          onFocus={handleTripFromFocus} onBlur={handleTripFromFocus} 
          onInput={handleTypingInTripFromInput} value={selectedCity} />
          <FontAwesomeIcon className='svg_up_down' icon={faArrowsUpDown} />
          {isTripFromFocused && (
        <div className='list_trip' style={listTripFromStyle}>
          <ul>
            {autocompletionList.length > 0 ? (autocompletionList.map((city, index) => (
              <li key={index} onClick={() => handleListItemClick(city.local_name)}>
                <FontAwesomeIcon icon={faLocationDot} />
                <span>{city.local_name}</span>
                </li>
            ))) : popularList.map((city, index) => (
              <li key={index}>
                <FontAwesomeIcon icon={faLocationDot} />
                <span>{city.local_name}</span>
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
            {popularListFromCity.length > 0 ? (popularListFromCity.map((city, index) => (
              <li key={index}>
                <FontAwesomeIcon icon={faLocationDot} />
                <span>{city.local_name}</span>
                </li>
            ))) : popularList.map((city, index) => (
              <li key={index}>
                <FontAwesomeIcon icon={faLocationDot} />
                <span>{city.local_name}</span>
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
