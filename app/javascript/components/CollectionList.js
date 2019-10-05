import React, { Component } from 'react';
import Axios from 'axios';
import Collection from './Collection';
import CollectionCard from './collections/CollectionCard';
import './collections/Collection.css';
import CollectionListStickyUtils from './collections/CollectionListStickyUtils';
import ButtonCollectionListShowAll from './collections/ButtonCollectionListShowAll';

class CollectionList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filter: '',
      searchResult: [],
      filteredResult: [],
      maxItems: 3,
      sort: 'unit'
    };
    if (this.props.filter) {
      this.state.filter = this.props.filter;
    }
  }

  componentDidMount() {
    this.retrieveResults();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.filter != this.state.filter) {
      this.setState({
        filteredResult: this.filterCollections(
          this.state.filter,
          this.state.searchResult
        )
      });
    }
  }

  retrieveResults() {
    let component = this;
    let url = this.props.baseUrl;
    console.log('Performing search: ' + url);
    Axios({ url: url }).then(function(response) {
      console.log(response);
      component.setState({
        searchResult: response.data,
        filteredResult: component.filterCollections(
          component.state.filter,
          response.data
        )
      });
    });
  }

  groupByUnit(list) {
    const map = new Map();
    list.forEach(item => {
      const collection = map.get(item.unit);
      if (!collection) {
        map.set(item.unit, [item]);
      } else {
        collection.push(item);
      }
    });
    let groups = Array.from(map);
    groups.sort((g1, g2) => {
      if (g1[0] < g2[0]) {
        return -1;
      }
      if (g1[0] > g2[0]) {
        return 1;
      }
      return 0;
    });
    return groups;
  }

  sortByAZ(list) {
    let sortedArray = list.slice();
    sortedArray.sort((col1, col2) => {
      if (col1.name < col2.name) {
        return -1;
      }
      if (col1.name > col2.name) {
        return 1;
      }
      return 0;
    });
    return sortedArray;
  }

  filterCollections(filter, collections) {
    let filteredArray = [];
    let downcaseFilter = filter.toLowerCase();
    collections.forEach(col => {
      if (
        col.name.toLowerCase().includes(downcaseFilter) ||
        col.unit.toLowerCase().includes(downcaseFilter) ||
        (col.description &&
          col.description.toLowerCase().includes(downcaseFilter))
      ) {
        filteredArray.push(col);
      }
    });
    return filteredArray;
  }

  handleFilterChange = event => {
    this.setState({ filter: event.target.value });
  };

  handleSortChange = event => {
    let val = event.target.querySelector('input').value;
    this.setState({ sort: val });
  };

  handleShowAll = event => {
    if (event.target.text === 'Show all') {
      event.target.text = 'Show less';
    } else {
      event.target.text = 'Show all';
    }
  };

  render() {
    const { filter, sort } = this.state;
    return (
      <div>
        <CollectionListStickyUtils
          filter={filter}
          handleFilterChange={this.handleFilterChange}
          sort={sort}
          handleSortChange={this.handleSortChange}
        />
        <div className="collection-list">
          {this.state.sort == 'az' ? (
            <ul className="mt-3">
              {this.sortByAZ(this.state.filteredResult).map((col, index) => {
                return (
                  <Collection
                    key={index}
                    attributes={col}
                    showUnit={true}
                  ></Collection>
                );
              })}
            </ul>
          ) : (
            this.groupByUnit(this.state.filteredResult).map(
              (unitArr, index) => {
                let unit = unitArr[0];
                let collections = this.sortByAZ(unitArr[1]);

                return (
                  <div key={unit}>
                    <h2 class="headline collection-list-unit-headline">
                      {unit}
                    </h2>

                    <div className="row">
                      {collections
                        .slice(0, this.state.maxItems)
                        .map((col, index) => {
                          return (
                            <div className="col-sm-4" key={col.id}>
                              <CollectionCard
                                attributes={col}
                                showUnit={false}
                              />
                            </div>
                          );
                        })}
                    </div>

                    <div className="collapse" id={'collapse' + index}>
                      <div className="row">
                        {collections
                          .slice(this.state.maxItems, collections.length)
                          .map(col => {
                            return (
                              <div className="col-sm-4" key={col.id}>
                                <CollectionCard
                                  attributes={col}
                                  showUnit={false}
                                />
                              </div>
                            );
                          })}
                      </div>
                    </div>

                    <ButtonCollectionListShowAll
                      collectionsLength={collections.length}
                      maxItems={this.state.maxItems}
                      handleShowAll={this.handleShowAll}
                      index={index}
                    />
                  </div>
                );
              }
            )
          )}
        </div>
      </div>
    );
  }
}

export default CollectionList;
