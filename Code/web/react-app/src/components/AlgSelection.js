import React from "react";
import {
  setActiveComponent,
  setCandidates,
  toggleMask,
  changeMode,
  setUserName,
  setUserEmail
} from "../actions";
import { connect } from "react-redux";
import { selectCandidates } from "../utils";



// the welcome scene containing a brief introduction and a table to obtain the user's input
class Welcome extends React.Component {
  constructor(props) {
    super(props);
  }

  handleSPTree = () => {
      this.props.SPTree();
  };

  handleGEGraph = () => {
    this.props.GEGraph();
  };

  render() {
    return (
      <div className="text-center m-auto" style={{ maxWidth: "55rem" }}>
        <h1>You will be asked a few questions that can help us to learn your preference. Then, 
        a car will be recommended to you.</h1> 
        <br />
        <p className="lead text-muted">
          Please select one algorithm for your car recommendation.</p>
        <br />
        <br />
        <div>
          <button
            type="button"
            className="btn btn-primary"
            style={{ width: "18rem" }}
            onClick={this.handleSPTree}
          >
           Algorithm SP-Tree
          </button>
        </div>
        <br />
        <div>
          <button
            type="button"
            className="btn btn-primary"
            style={{ width: "18rem" }}
            onClick={this.handleGEGraph}
          >
           Algorithm GE-Graph
          </button>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ attributes, mask, points, mode }) => ({
  attributes,
  mask,
  points,
  mode
});

const mapDispatchToProps = dispatch => ({
  SPTree: () => dispatch(setActiveComponent("SPTree")),
  GEGraph: () => dispatch(setActiveComponent("GEGraph"))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Welcome);
