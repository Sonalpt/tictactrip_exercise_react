import React, { useRef, useEffect } from 'react';
import axios, { AxiosResponse } from 'axios';
import '../styles/index.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faCircleDot, faChevronDown, faArrowsUpDown, faLocationDot, faCalendar } from '@fortawesome/free-solid-svg-icons';

export const SearchBar: React.FC = () => {

  // Les interfaces pour les 3 API

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
  const [selectedTripFrom, setSelectedTripFrom] = React.useState<string>("");
  const [selectedTripTo, setSelectedTripTo] = React.useState<string>("");

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

  // state pour gérer les index des listes pour la navigation fléchée
  const [selectedListItemIndex, setSelectedListItemIndex] = React.useState<number>(-1);

  // la gestion des state pour les focus des input, pour afficher ou non les listes
  const handleTripFromFocus = () => {
    if (isTripFromFocused) {
      setTimeout(() => {
        setIsTripFromFocused(false);
      setAutocompletionList([])
      }, 150);
    } else if (!isTripFromFocused)
     setIsTripFromFocused(true)
  }
  const handleTripToFocus = () => {
    if (isTripToFocused) {
      setTimeout(() => {
        setIsTripToFocused(false);
      setAutocompletionList([])
      }, 150);
    } else if (!isTripToFocused)
     setIsTripToFocused(true)
    if (selectedTripFrom != "") {
      axios
      .get(`https://api.comparatrip.eu/cities/popular/from/${selectedTripFrom}/5`)
      .then((response: AxiosResponse<any>) => {
        setPopularListFromCity(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
    }
  }

  // Les fonctions pour gérer les input onchange

  const handleTypingInTripFromInput = () => {
    if (inputTripFromRef.current) {
      setSelectedTripFrom(inputTripFromRef.current.value);
    }
    if (selectedTripFrom !== "") {
      axios
      .get(`https://api.comparatrip.eu/cities/autocomplete/?q=${selectedTripFrom}`)
      .then((response: AxiosResponse<any>) => {
        setAutocompletionList(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
    }
    if (!inputTripFromRef.current?.value) {
      setSelectedTripFrom("");
      setAutocompletionList([]);
    }
  }

  const handleTypingInTripToInput = () => {
    if (inputTripToRef.current) {
      setSelectedTripTo(inputTripToRef.current.value);
    }
    if (selectedTripTo !== "") {
      axios
      .get(`https://api.comparatrip.eu/cities/autocomplete/?q=${selectedTripTo}`)
      .then((response: AxiosResponse<any>) => {
        setAutocompletionList(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
    }
    if (!inputTripFromRef.current?.value) {
      setSelectedTripTo("");
      setAutocompletionList([]);
    }
  }

  const handleInputTripFromChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedTripFrom(event.target.value);
  };
  const handleInputTripToChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedTripTo(event.target.value);
  };


  // Les fonctions qui gèrent l'ajout du texte des listes dans les input
  const handleListItemTripFromClick = (text: string) => {
    setSelectedTripFrom(text)
  };
  const handleListItemTripToClick = (text: string) => {
    setSelectedTripTo(text)
  };

  // Le useEffect qui va chercher la liste des villes les plus populaires

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

  // les fonctions pour gérer la navigation par clavier pour les listes
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (isTripFromFocused) {
      if (event.key === 'ArrowDown') {
        event.preventDefault();
        setSelectedListItemIndex((prevIndex) => Math.min(prevIndex + 1, popularList.length - 1));
      } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        setSelectedListItemIndex((prevIndex) => Math.max(prevIndex - 1, -1));
      } else if (event.key === 'Enter') {
        if (selectedListItemIndex >= 0 && selectedListItemIndex < popularList.length) {
          const selectedCity = popularList[selectedListItemIndex];
          setSelectedTripFrom(selectedCity.local_name);
          setSelectedListItemIndex(-1);
        }
      }
    }
    if (isTripToFocused && selectedTripFrom !== "") {
      if (event.key === 'ArrowDown') {
        event.preventDefault();
        setSelectedListItemIndex((prevIndex) => Math.min(prevIndex + 1, popularListFromCity.length - 1));
      } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        setSelectedListItemIndex((prevIndex) => Math.max(prevIndex - 1, -1));
      } else if (event.key === 'Enter') {
        if (selectedListItemIndex >= 0 && selectedListItemIndex < popularListFromCity.length) {
          const selectedCity = popularListFromCity[selectedListItemIndex];
          setSelectedTripTo(selectedCity.local_name);
          setSelectedListItemIndex(-1);
        }
      }
    } else if (isTripToFocused && selectedTripFrom == "") {
      if (event.key === 'ArrowDown') {
        event.preventDefault();
        setSelectedListItemIndex((prevIndex) => Math.min(prevIndex + 1, popularList.length - 1));
      } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        setSelectedListItemIndex((prevIndex) => Math.max(prevIndex - 1, -1));
      } else if (event.key === 'Enter') {
        if (selectedListItemIndex >= 0 && selectedListItemIndex < popularList.length) {
          const selectedCity = popularList[selectedListItemIndex];
          setSelectedTripTo(selectedCity.local_name);
          setSelectedListItemIndex(-1);
        }
      }
    }
  };

  useEffect(() => {
    if (selectedListItemIndex >= 0 && selectedListItemIndex < popularList.length) {
      const listElement = document.getElementById(`listItem${selectedListItemIndex}`);
      if (listElement) {
        listElement.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [selectedListItemIndex]);

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
          onInput={handleTypingInTripFromInput} onChange={handleInputTripFromChange} 
          onKeyDown={handleKeyDown} value={selectedTripFrom} />
          <FontAwesomeIcon className='svg_up_down' icon={faArrowsUpDown} />
          {isTripFromFocused && (
        <div className='list_trip' style={listTripFromStyle}>
          <ul>
            {autocompletionList.length > 0 ? (autocompletionList.map((city, index) => (
              <li key={index} onClick={() => handleListItemTripFromClick(city.local_name)}
              className={selectedListItemIndex === index ? 'selected' : ''} >
                <FontAwesomeIcon icon={faLocationDot} />
                <span>{city.local_name}</span>
                </li>
            ))) : popularList.map((city, index) => (
              <li key={index} onClick={() => handleListItemTripFromClick(city.local_name)}
              className={selectedListItemIndex === index ? 'selected' : ''} >
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
          <input type="text" placeholder='To: City, Station Or Airport' ref={inputTripToRef} onFocus={handleTripToFocus} onBlur={handleTripToFocus} 
          onChange={handleInputTripToChange} onInput={handleTypingInTripToInput} 
          onKeyDown={handleKeyDown} value={selectedTripTo}/>
          {isTripToFocused && (
        <div className='list_trip' style={listTripToStyle}>
          <ul>
            {popularListFromCity.length > 0 ? (popularListFromCity.map((city, index) => (
              <li key={index} onClick={() => handleListItemTripToClick(city.local_name)}
              className={selectedListItemIndex === index ? 'selected' : ''} >
                <FontAwesomeIcon icon={faLocationDot} />
                <span>{city.local_name}</span>
                </li>
            ))) : popularList.map((city, index) => (
              <li key={index} onClick={() => handleListItemTripToClick(city.local_name)}
              className={selectedListItemIndex === index ? 'selected' : ''} >
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