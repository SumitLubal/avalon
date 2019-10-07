import React from 'react';
import PropTypes from 'prop-types';

const ButtonCollectionListShowAll = ({
  collectionsLength,
  index,
  maxItems,
  handleShowAll,
  showAll
}) => {
  if (collectionsLength > maxItems) {
    return (
      <a
        onClick={handleShowAll}
        className={`btn btn-primary btn-lg show-all fa ${
          showAll ? 'fa-minus' : 'fa-plus'
        }`}
        role="button"
        data-toggle="collapse"
        href={'#collapse' + index}
        aria-expanded="false"
        aria-controls={'collapse' + index}
      >
        <span className="sr-only">Show all</span>
      </a>
    );
  }
  return null;
};

ButtonCollectionListShowAll.propTypes = {
  collectionsLength: PropTypes.number,
  index: PropTypes.number,
  maxItems: PropTypes.number,
  handleShowAll: PropTypes.func,
  showAll: PropTypes.bool
};

export default ButtonCollectionListShowAll;
