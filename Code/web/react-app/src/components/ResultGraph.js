import React from "react";
import { connect } from "react-redux";
import classNames from "classnames";
import { setActiveComponent, restart } from "../actions";
import Histogram from "./Histogram";
import HistogramForR from "./HistogramForR"

// show the number of questions asked and the favourite car/remaining cars.
function ResultGraph({candidates, leftPoints, attributes, mask, numLeftPoints, restart})
{
  let ths = [];
  attributes.forEach(([attr, config]) => {
    if (mask[attr]) {
      const th = <th key={attr}>{attr}</th>;
      ths.push(th);
    }
  });
  const trs = leftPoints.map((idx, i) => (
      <tr key={i} data-toggle="tooltip">
        {candidates[idx].map((x, j) => {return <td key={j}>{x}</td>})}
      </tr>
  ));
  return (
      <div className="justify-content-center">
        <h4>The Total No. of Questions Asked is: {numLeftPoints.length - 1}.</h4>
        <h4>
          {leftPoints.length === 1
              ? "Your Favourite Tuple is:"
              : `${leftPoints.length} Tuples Left in the Database:`}
        </h4>
        <table
            className={classNames("table", "table-hover", {
              "table-fixed": trs.length > 7
            })}
            style={{
              maxWidth: "40rem",
              margin: "auto"
            }}
        >
          <thead>
          <tr>{ths}</tr>
          </thead>
          <tbody>{trs}</tbody>
        </table>
          <div>
              <div className="row justify-content-center" >
                  <div className="col-md-auto">
                      <HistogramForR />
                  </div>
                  <div className="col-md-auto">
                      <Histogram />
                  </div>
              </div>
          </div>
        <div>
            <button type="button"
                    className="modern-btn"
                    style={{ width: "12rem" }}
                    onClick={restart}>
            Return to Home
          </button>
        </div>
      </div>
  );
}

const mapStateToProps = ({candidates, leftPoints, attributes, mask, numLeftPoints}) => ({
  candidates,
  leftPoints,
  attributes,
  mask,
  numLeftPoints
});

const mapDispatchToProps = dispatch => ({
  restart: () => {
    dispatch(setActiveComponent("Welcome"));
    dispatch(restart());
  }
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ResultGraph);