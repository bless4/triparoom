import React, { Component } from 'react';
import _ from 'lodash';

const Review = ({ detail }) => {
  let x = 0;
  const renderFacilities = _.map(detail.facilities, fac => {
    x++;
    return (
      <li key={x}><i className="fa fa-check-square-o"></i> {fac.facility_name}</li>
    );
  });

  return (
    <div>
      <div className="feature-inflight">
        <h4>Hotel Facilities</h4>
        <ul className="list-unstyled list-inline">
          {renderFacilities}
        </ul>
      </div>
    </div>
  );
}

export default Review;
