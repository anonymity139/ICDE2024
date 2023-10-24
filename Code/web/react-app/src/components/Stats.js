import React from "react";
import { connect } from "react-redux";
import classNames from "classnames";

// statistics including the number of cars pruned/left.
class Stats extends React.Component {
  constructor(props) {
    super(props);
    this.attributes = [];
    this.props.attributes.forEach(([attr, config]) => {
      if (this.props.mask[attr]) {
        this.attributes.push(attr);
      }
    });
    this.state = {
      showMorePrune: false,
      showMoreLeft: false
    };
  }

  toggleShowMorePrune = () => {
    this.setState(prevState => ({
      showMorePrune: !prevState.showMorePrune
    }));
  };

  toggleShowMoreLeft = () => {
    this.setState(prevState => ({
      showMoreLeft: !prevState.showMoreLeft
    }));
  };

  render() {
    let ths = [<th key="Step No.">Step</th>];
    this.attributes.forEach(attr => {
      ths.push(<th key={attr}>{attr}</th>);
    });
    const prunedTrs = this.props.prunedPoints.map(([idx, step], i) => (
      <tr key={i} data-toggle="tooltip">
        {[step, ...this.props.candidates[idx]].map((x, j) => (
          <td key={j}>{x}</td>
        ))}
      </tr>
    ));

    console.log(this.props.leftPoints);
    const leftTrs = this.props.leftPoints.map((idx, i) => (
      <tr key={i} data-toggle="tooltip" >
        {this.props.candidates[idx].map((x, j) => (
          <td key={j}>{x}</td>
        ))}
      </tr>
    ));


    const { showMorePrune, showMoreLeft} = this.state;
    const moreTextPrune = "According to your answers to questions, we learn " +
        "your preference on cars and prune the unsuitable cars. Note that *step* represents " +
        "the cars are pruned when how many questions are answered. ";

    const moreTextLeft = "Based on your answers to questions, these are the candidate " +
        "cars that you might prefer. ";

    return (
        <div className="scrollable-container">
          &nbsp;&nbsp;&nbsp;&nbsp;
          <div className="scrollable-item">
            <div style={{ width: "40rem", height: "26rem", backgroundColor: "#F8F8F8"}}>
              <table className={classNames("table", "table-hover", {"table-fixed": true //prunedTrs.length > 7
              })} style={{minWidth: "40rem"}}>
                <thead>
                  <tr>{ths}</tr>
                </thead>
                <tbody>{prunedTrs}</tbody>
              </table>
            </div>
            <div>
              <h4  style={{'padding': '10px'}}>Table: The Cars Pruned</h4>
              <p className="text-t-align" style={{ width: "40rem" }}>
                &nbsp;&nbsp;&nbsp;&nbsp;This figure shows the cars Pruned. {showMorePrune ? moreTextPrune : ' '}
                <button className="toggleButton" onClick={this.toggleShowMorePrune}>
                  {showMorePrune ? <span className="foldText">&nbsp;fold</span> : <span className="foldText">...unfold</span>}
                </button>
              </p>
            </div>
          </div>

          &nbsp;&nbsp;
        <div className="scrollable-item">
            <div style={{ width: "40rem", height: "26rem", backgroundColor: "#F8F8F8"}}>
              <table
                className={classNames("table", "table-hover", {
                "table-fixed": true //leftTrs.length > 7
              })}
              style={{
                minWidth: "40rem"
              }}>
              <thead>
                <tr>{ths.slice(1)}</tr>
              </thead>
              <tbody>{leftTrs}</tbody>
              </table>
            </div>
            <div>
              <h4  style={{'padding': '10px'}}>Table: The Candidate Cars</h4>
              <p className="text-t-align" style={{ width: "40rem" }}>
                &nbsp;&nbsp;&nbsp;&nbsp;This figure shows the Candidate cars. {showMoreLeft ? moreTextLeft : ' '}
                <button className="toggleButton" onClick={this.toggleShowMoreLeft}>
                  {showMoreLeft ? <span className="foldText">&nbsp;fold</span> : <span className="foldText">...unfold</span>}
                </button>
              </p>
            </div>
        </div>
        </div>
    );
  }
}

const mapStateToPropsStats = ({
  labels,
  candidates,
  prunedPoints,
  leftPoints,
  attributes,
  mask
}) => ({
  labels,
  candidates,
  prunedPoints,
  leftPoints,
  attributes,
  mask
});

export default connect(mapStateToPropsStats)(Stats);
