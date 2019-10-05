import React, { Component } from 'react';
import Axios from 'axios';
import CollectionCard from './collections/CollectionCard';
import './collections/Collection.css';
import CollectionListStickyUtils from './collections/CollectionListStickyUtils';
import ButtonCollectionListShowAll from './collections/ButtonCollectionListShowAll';

class CollectionList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filter: props.filter ? props.filter : '',
      searchResult: [],
      filteredResult: [],
      maxItems: 3,
      sort: 'unit'
    };
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

  async retrieveResults() {
    let url = this.props.baseUrl;

    try {
      const response = await Axios({ url });
      console.log(response);
      this.setState({
        searchResult: response.data,
        filteredResult: this.filterCollections(this.state.filter, response.data)
      });
    } catch (error) {
      console.log('Error in retrieveResults(): ', error);
      Promise.resolve([]);
    }
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
    const { filter, sort, filteredResult, maxItems } = this.state;
    return (
      <div>
        <CollectionListStickyUtils
          filter={filter}
          handleFilterChange={this.handleFilterChange}
          sort={sort}
          handleSortChange={this.handleSortChange}
        />
        <div className="collection-list">
          {sort === 'az' ? (
            <ul className="row list-unstyled">
              {this.sortByAZ(filteredResult).map((col, index) => {
                return (
                  <li className="col-sm-4" key={col.id}>
                    <CollectionCard
                      attributes={col}
                      showUnit={true}
                    ></CollectionCard>
                  </li>
                );
              })}
            </ul>
          ) : (
            this.groupByUnit(filteredResult).map((unitArr, index) => {
              let unit = unitArr[0];
              let collections = this.sortByAZ(unitArr[1]);

              return (
                <div key={unit}>
                  <h2 className="headline collection-list-unit-headline">
                    {unit}
                  </h2>

                  <div className="row">
                    {collections.slice(0, maxItems).map((col, index) => {
                      return (
                        <div className="col-sm-4" key={col.id}>
                          <CollectionCard attributes={col} showUnit={false} />
                        </div>
                      );
                    })}
                  </div>

                  <div className="collapse" id={'collapse' + index}>
                    <div className="row">
                      {collections
                        .slice(maxItems, collections.length)
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
                    maxItems={maxItems}
                    handleShowAll={this.handleShowAll}
                    index={index}
                  />
                </div>
              );
            })
          )}
        </div>
      </div>
    );
  }
}

export default CollectionList;
