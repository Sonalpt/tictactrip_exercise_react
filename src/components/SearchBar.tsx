import React, { useRef, useEffect } from 'react';
import axios, { AxiosResponse } from 'axios';
import '../styles/index.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faCircleDot, faChevronDown, faChevronUp, faArrowsUpDown, faLocationDot, faCalendar, faUser, faPercent, faCheck, faXmark, faPlusCircle, faMinusCircle } from '@fortawesome/free-solid-svg-icons';

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
  const [tripFromToSearch, setTripFromToSearch] = React.useState<string>("");

  // les states des textes des deux inputs
  const [selectedTripFrom, setSelectedTripFrom] = React.useState<string>("");
  const [selectedTripTo, setSelectedTripTo] = React.useState<string>("");

  // Les state pour les focus des input
  const [isTripFromFocused, setIsTripFromFocused] = React.useState<boolean>(false);
  const [isTripToFocused, setIsTripToFocused] = React.useState<boolean>(false);

  // le state pour gérer le toggle accomodation
  const [isEnabled, setIsEnabled] = React.useState<boolean>(false);

  // des useRef pour gérer la position de la liste par rapport à l'input d'au dessus
  const inputTripFromRef = useRef<HTMLInputElement>(null)
  const inputTripToRef = useRef<HTMLInputElement>(null)

  // useRef pour gérer la position du type de voyage
  const onewayRef = useRef<HTMLSpanElement>(null);

  // le style pour la position du type de voyage
  const tripdetailsStyle: React.CSSProperties = {
    position: 'absolute',
    top: onewayRef.current ? onewayRef.current.offsetTop + onewayRef.current.offsetHeight : 0,
    left: onewayRef.current && onewayRef.current.parentElement ? onewayRef.current.offsetLeft : 0,
  }

  // le state pour gérer l'affichage du type de voyage
  const [isTripTypeDisplayed, setIsTripTypeDisplayed] = React.useState<boolean>(false);

  // le state pour gérer quel type de voyage est checké
  const [tripTypechecked, setTripTypeChecked] = React.useState<number>(1);

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

  // le state pour gérer l'affichage du détail des passagers
  const [isPassengersDetailsDisplayed, setIsPassengersDetailsDisplayed] = React.useState<boolean>(false);

  // les différents states le total des passagers, le discount, puis le total pour chaque type de passager
  const [totalPassagers, setTotalPassagers] = React.useState<number>(0);
  const [discount, setDiscount] = React.useState<number>(0);
  const [totalAdults, setTotalAdults] = React.useState<number>(0);
  const [totalYouth, setTotalYouth] = React.useState<number>(0);
  const [totalSeniors, setTotalSeniors] = React.useState<number>(0);

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
      .get(`https://api.comparatrip.eu/cities/popular/from/${tripFromToSearch}/5`)
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
  const handleListItemTripFromClick = (text: string, citySearch: string) => {
    setSelectedTripFrom(text);
    setTripFromToSearch(citySearch);
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
    if (isTripFromFocused && selectedTripFrom == "") {
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
          setTripFromToSearch(selectedCity.unique_name)
          setSelectedListItemIndex(-1);
        }
      }
    }
    if (isTripFromFocused && selectedTripFrom !== "") {
      if (event.key === 'ArrowDown') {
        event.preventDefault();
        setSelectedListItemIndex((prevIndex) => Math.min(prevIndex + 1, autocompletionList.length - 1));
      } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        setSelectedListItemIndex((prevIndex) => Math.max(prevIndex - 1, -1));
      } else if (event.key === 'Enter') {
        if (selectedListItemIndex >= 0 && selectedListItemIndex < autocompletionList.length) {
          const selectedCity = autocompletionList[selectedListItemIndex];
          setSelectedTripFrom(selectedCity.local_name);
          setTripFromToSearch(selectedCity.unique_name)
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

  // le useEffect qui va nous faire entrer dans la liste à l'aide du clavier
  useEffect(() => {
    if (selectedListItemIndex >= 0 && selectedListItemIndex < popularList.length) {
      const listElement = document.getElementById(`listItem${selectedListItemIndex}`);
      if (listElement) {
        listElement.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [selectedListItemIndex]);

  return (
    <>
    {/* L'enorme div qui contient les paramètres des passagés */}

    {isPassengersDetailsDisplayed ? (<div data-testid="passengers_discount_selection_container" className="passengers_discount_selection_container">
            <div className="passengers_discount_selection">
              <div className="passengers_title">
                <span>Passengers</span>
                <FontAwesomeIcon icon={faXmark} onClick={() => {setIsPassengersDetailsDisplayed(false)}}/>
              </div>
              <div className="person_container">
                <div className="person_details">
                  <span className="name">Adult</span>
                  <span className="age_range">26+ years</span>
                </div>
                <div className="count">
                  <FontAwesomeIcon data-testid="adults-minus-button" icon={faMinusCircle} className={totalAdults == 0 ? "count_disabled" : ""} onClick={() => {totalAdults == 0 ? setTotalAdults(totalAdults) : (setTotalAdults(totalAdults - 1), setTotalPassagers(totalPassagers - 1))}}/>
                  <span data-testid="adults-count" className="count_number">{totalAdults}</span>
                  <FontAwesomeIcon data-testid="adults-plus-button" icon={faPlusCircle} onClick={() => {(setTotalAdults(totalAdults + 1), setTotalPassagers(totalPassagers + 1))}}/>
                </div>
              </div>
              <div className="person_container">
                <div className="person_details">
                  <span className="name">Youth</span>
                  <span className="age_range">0-25 years</span>
                </div>
                <div className="count">
                  <FontAwesomeIcon data-testid="youth-minus-button" icon={faMinusCircle} className={totalYouth == 0 ? "count_disabled" : ""} onClick={() => {totalYouth == 0 ? setTotalYouth(totalYouth) : (setTotalYouth(totalYouth - 1), setTotalPassagers(totalPassagers - 1))}}/>
                  <span data-testid="youth-count" className="count_number">{totalYouth}</span>
                  <FontAwesomeIcon data-testid="youth-plus-button" icon={faPlusCircle} onClick={() => {(setTotalYouth(totalYouth + 1), setTotalPassagers(totalPassagers + 1))}}/>
                </div>
              </div>
              <div className="person_container">
                <div className="person_details">
                  <span className="name">Senior</span>
                  <span className="age_range">58+ years</span>
                </div>
                <div className="count">
                  <FontAwesomeIcon data-testid="seniors-minus-button" icon={faMinusCircle} className={totalSeniors == 0 ? "count_disabled" : ""} onClick={() => {totalSeniors == 0 ? setTotalSeniors(totalSeniors) : (setTotalSeniors(totalSeniors - 1), setTotalPassagers(totalPassagers - 1))}}/>
                  <span data-testid="seniors-count" className="count_number">{totalSeniors}</span>
                  <FontAwesomeIcon data-testid="seniors-plus-button" icon={faPlusCircle} onClick={() => {(setTotalSeniors(totalSeniors + 1), setTotalPassagers(totalPassagers + 1))}}/>
                </div>
              </div>
              <div className="discount_container">
                <div className="discount_card">
                  <FontAwesomeIcon icon={faPercent} />
                  <span>Add discount card</span>
                </div>
                <div data-testid="discount-toggle-button" className={discount ? "enabled" : "toggle_button"} onClick={() => {discount ? setDiscount(0) : setDiscount(1)}}>
                  <div className="toggle_circle"></div>
                </div>
              </div>
              <div className="confirm">
                <button data-testid="passengers-discount-confirm" onClick={() => {setIsPassengersDetailsDisplayed(false)}}>Confirm</button>
              </div>
            </div>
          </div>) : null}
          

          {/* Notre fameuse nav bar */}
          <nav>
          <div className='trip_details'>
            <div className='trip_type'>
              <span ref={onewayRef} onClick={() => {isTripTypeDisplayed ? setIsTripTypeDisplayed(false) : setIsTripTypeDisplayed(true)}}>{tripTypechecked == 1 ? "One-way" : "Round trip"}</span>
              <FontAwesomeIcon data-testid="trip-type-accordion" icon={isTripTypeDisplayed ? faChevronUp : faChevronDown} onClick={() => {isTripTypeDisplayed ? setIsTripTypeDisplayed(false) : setIsTripTypeDisplayed(true)}} />
              {isTripTypeDisplayed ? (<div data-testid="trip-type-div" className="trip_type_choice" style={tripdetailsStyle}>
                <div className={tripTypechecked == 1 ? "trip_type_checked" : "trip_type_unchecked"}
                onClick={() => {tripTypechecked == 1 ? setTripTypeChecked(2) : setTripTypeChecked(1)}} >
                  <FontAwesomeIcon icon={faCheck} />
                  <span>One-way</span>
                </div>
                <div className={tripTypechecked == 2 ? "trip_type_checked" : "trip_type_unchecked"}
                onClick={() => {tripTypechecked == 1 ? setTripTypeChecked(2) : setTripTypeChecked(1)}} >
                  <FontAwesomeIcon icon={faCheck} />
                  <span>Round trip</span>
                </div>
              </div>) : null}
            </div>
            <div data-testid="passengers-infos" onClick={() => {setIsPassengersDetailsDisplayed(true)}} className='passengers_details'>
              <div className="passengers_count" onClick={() => {setIsPassengersDetailsDisplayed(true)}}>
                <FontAwesomeIcon icon={faUser} />
                <span data-testid="total-passengers-count">{totalPassagers}</span>
              </div>
              <div className="discount_count" onClick={() => {setIsPassengersDetailsDisplayed(true)}}>
                <FontAwesomeIcon icon={faPercent} />
                <span data-testid="discount-count">{discount}</span>
              </div>
            </div>
          </div>
        <div className='container'>
          <div className='trip_from'>
            <FontAwesomeIcon icon={faCircleDot} />
            <input data-testid="trip-from-input" type="text" placeholder='From: City, Station Or Airport' ref={inputTripFromRef} 
            onFocus={handleTripFromFocus} onBlur={handleTripFromFocus} 
            onInput={handleTypingInTripFromInput} onChange={handleInputTripFromChange} 
            onKeyDown={handleKeyDown} value={selectedTripFrom} />
            <FontAwesomeIcon className='svg_up_down' icon={faArrowsUpDown} />
            {isTripFromFocused && (
          <div className='list_trip' style={listTripFromStyle}>
            <ul>
              {autocompletionList.length > 0 ? (autocompletionList.map((city, index) => (
                <li key={index} onClick={() => handleListItemTripFromClick(city.local_name, city.unique_name)}
                className={selectedListItemIndex === index ? 'selected' : ''} >
                  <FontAwesomeIcon icon={faLocationDot} />
                  <span>{city.local_name}</span>
                  </li>
              ))) : popularList.map((city, index) => (
                <li key={index} onClick={() => handleListItemTripFromClick(city.local_name, city.unique_name)}
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
            <input data-testid="trip-to-input" type="text" placeholder='To: City, Station Or Airport' ref={inputTripToRef} onFocus={handleTripToFocus} onBlur={handleTripToFocus} 
            onChange={handleInputTripToChange} onInput={handleTypingInTripToInput} 
            onKeyDown={handleKeyDown} value={selectedTripTo}/>
            {isTripToFocused && (
          <div data-testid="trip-list" className='list_trip' style={listTripToStyle}>
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
            <div data-testid="accomodation-toggle-button" className={isEnabled ? "toggle_button enabled" : "toggle_button"} 
              onClick={() => {isEnabled ? setIsEnabled(false) : setIsEnabled(true)}}>
              <div className="toggle_circle"></div>
            </div>
            <span>Find my accomodation</span>
          </div>
      </nav>
    </>
  )
}