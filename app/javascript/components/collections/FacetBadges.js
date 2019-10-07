import React, { Component } from 'react';

class FacetBadges extends Component {
  constructor(props) {
    super(props);
  }

  handleClick = (index, event) => {
    event.preventDefault();
    console.log(index);
    let newAppliedFacets = this.props.facets.slice();
    console.log(newAppliedFacets);
    newAppliedFacets.splice(index, 1);
    console.log(newAppliedFacets);
    this.props.search.setState({ appliedFacets: newAppliedFacets });
  };

  render() {
    const { facets } = this.props;

    if (facets.length > 0) {
      return (
        <div className="facet-badges">
          {facets.map((facet, index) => {
            if (facet.length === 0) {
              return <div></div>;
            }
            return (
              <div
                className="btn-group mr-2"
                role="group"
                aria-label="Facet badge"
              >
                <button class="btn btn-default disabled">
                  {facet.facetLabel}: {facet.facetValue}
                </button>
                <button
                  className="btn btn-default"
                  onClick={event => this.handleClick(index, event)}
                >
                  &times;
                </button>
              </div>
            );
          })}
        </div>
      );
    }

    return null;
  }
}

export default FacetBadges;
