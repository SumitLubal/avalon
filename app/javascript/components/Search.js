import React, { Component } from 'react';
import Axios from 'axios';
import SearchResults from './SearchResults';
import Pagination from './Pagination';
import Facets from './Facets';
import FacetBadges from './FacetBadges';

class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
      query: '',
      searchResult: { pages: {}, docs: [], facets: [] },
      currentPage: 1,
      appliedFacets: [],
      perPage: 10
    };
  }

  handleQueryChange = event => {
    this.setState({ query: event.target.value, currentPage: 1 });
  };

  componentDidMount() {
    this.retrieveResults();
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      prevState.query != this.state.query ||
      prevState.currentPage != this.state.currentPage ||
      prevState.appliedFacets != this.state.appliedFacets
    ) {
      this.retrieveResults();
    }
  }

  retrieveResults() {
    let component = this;
    let facetFilters = '';
    this.state.appliedFacets.forEach(facet => {
      facetFilters =
        facetFilters + '&f[' + facet.facetField + '][]=' + facet.facetValue;
    });
    if (this.props.collection) {
      facetFilters =
        facetFilters + '&f[collection_ssim][]=' + this.props.collection;
    }
    let url =
      this.props.baseUrl +
      '/catalog.json?per_page=' +
      this.state.perPage +
      '&q=' +
      this.state.query +
      '&page=' +
      this.state.currentPage +
      facetFilters;
    console.log('Performing search: ' + url);
    Axios({ url: url }).then(function(response) {
      console.log(response);
      component.setState({ searchResult: response.data.response });
    });
  }

  availableFacets() {
    let availableFacets = this.state.searchResult.facets.slice();
    let facetIndex = availableFacets.findIndex(facet => {
      return facet.label === 'Published';
    });
    if (facetIndex > -1) {
      availableFacets.splice(facetIndex, 1);
    }
    facetIndex = availableFacets.findIndex(facet => {
      return facet.label === 'Created by';
    });
    if (facetIndex > -1) {
      availableFacets.splice(facetIndex, 1);
    }
    facetIndex = availableFacets.findIndex(facet => {
      return facet.label === 'Date Digitized';
    });
    if (facetIndex > -1) {
      availableFacets.splice(facetIndex, 1);
    }
    facetIndex = availableFacets.findIndex(facet => {
      return facet.label === 'Date Ingested';
    });
    if (facetIndex > -1) {
      availableFacets.splice(facetIndex, 1);
    }

    if (this.props.collection) {
      facetIndex = availableFacets.findIndex(facet => {
        return facet.label === 'Collection';
      });
      availableFacets.splice(facetIndex, 1);
      facetIndex = availableFacets.findIndex(facet => {
        return facet.label === 'Unit';
      });
      availableFacets.splice(facetIndex, 1);
    }
    return availableFacets;
  }

  render() {
    const { query } = this.state;
    return (
      <div className="search-wrapper">
        <div className="row">
          <form className="search-bar col-sm-6">
            <label htmlFor="q" className="sr-only">
              search for
            </label>
            <div className="form-group search-input">
              <input
                value={query}
                onChange={this.handleQueryChange}
                name="q"
                className="form-control input-lg"
                placeholder="Search within collection..."
                autoFocus="autofocus"
              ></input>
            </div>
          </form>
          <div className="col-sm-6 text-right">
            <button
              href="#search-within-facets"
              data-toggle="collapse"
              role="button"
              aria-expanded="false"
              aria-controls="object_tree"
              className="btn btn-primary search-within-facets-btn"
            >
              Toggle Filters
            </button>
          </div>
        </div>
        <FacetBadges facets={this.state.appliedFacets} search={this} />
        <Facets facets={this.availableFacets()} search={this} />
        <Pagination pages={this.state.searchResult.pages} search={this} />

        <div class="row">
          <SearchResults
            documents={this.state.searchResult.docs}
            baseUrl={this.props.baseUrl}
          />
        </div>
      </div>
    );
  }
}

export default Search;
