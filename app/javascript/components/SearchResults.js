import React, { Component } from 'react';
import { exportDefaultDeclaration } from '@babel/types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import './collections/Collection.css';
import SearchResultsCard from './collections/SearchResultsCard';

const SearchResults = props => {
  return (
    <ul className="search-within-search-results">
      {props.documents.map((doc, index) => (
        <SearchResultsCard
          key={index}
          doc={doc}
          index={index}
          baseUrl={props.baseUrl}
        />
      ))}
    </ul>
  );
};

export default SearchResults;
