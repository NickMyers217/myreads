import React from 'react';
import PropTypes from 'prop-types';

import './Ratings.css';

const Ratings = ({ starCount = 0, numberOfRatings = 0, totalNumberOfStars = 5 }) => {
  const starFillings = [];
  for (let i = 0; i < Math.floor(starCount); i++) {
    starFillings.push('full')
  }
  if (starCount - Math.floor(starCount) === 0.5) {
    starFillings.push('half');
  }
  for (let i = Math.round(starCount); i < totalNumberOfStars; i++) {
    starFillings.push('empty');
  }

  return (
    <div className="ratings">
      {starFillings.map((s, i) => {
        let icon = 'glyphicon glyphicon-star';

        if(s === 'half') {
          icon += ' half';
        }
        if(s === 'empty') {
          icon += ' unfilled';
        }

        return (
          <i key={i} className={icon}></i>
        );
      })}
      <br />
      <span>{`(${numberOfRatings} Ratings)`}</span>
    </div>
  );
};
Ratings.propTypes = {
  starCount: PropTypes.number,
  numberOfRatings: PropTypes.number,
  totalNumberOfStars: PropTypes.number
};

export default Ratings;