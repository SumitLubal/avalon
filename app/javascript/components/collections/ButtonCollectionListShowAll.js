import React from 'react';

const ButtonCollectionListShowAll = ({
  collectionsLength,
  index,
  maxItems,
  handleShowAll
}) => {
  if (collectionsLength > maxItems) {
    return (
      <a
        onClick={handleShowAll}
        className="btn btn-default show-all"
        role="button"
        data-toggle="collapse"
        href={'#collapse' + index}
        aria-expanded="false"
        aria-controls={'collapse' + index}
      >
        Show all
      </a>
    );
  }
  return null;
};

export default ButtonCollectionListShowAll;
