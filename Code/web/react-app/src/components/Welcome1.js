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
    this.inputs = {};
    this.inputs.name = React.createRef();
  }

  handleStart = () => {
      const strName = this.inputs.name.current.value.trim();
      if (strName === "")
      {
          alert(`Please input your name.`);
          return;
      }
      this.props.start(strName);
  };

  handleModeChange = event => {
    this.props.changeMode(event.target.value);
  };

  render() {
    return (
      <div className="text-center m-auto" style={{ maxWidth: "70rem" }}>
        <h1>Welcome to Our Car Recommendation System!</h1>
        <br />
        <br />
        <tr key= "name">
              <td className="align-middle" style={{fontSize: "30px", textAlign: "center"}}>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  Please input your name:
                  &nbsp;&nbsp;
              </td>
              <td>
                  <input
                      type="text"
                      className="form-control"
                      placeholder="Name"
                      ref={this.inputs.name}
                      style={{width: '300px'}}
                  />
              </td>
          </tr>
          <br />
        <br />
        <br />
        <div>
          <button
            type="button"
            className="btn btn-primary"
            style={{ width: "20rem" }}
            onClick={this.handleStart}
          >
           Continue
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
  start: (strName) => {
    dispatch(setUserName(strName));
    dispatch(setActiveComponent("AlgSelection"));
  },
  toggleMask: (attr, mask) => dispatch(toggleMask(attr, mask)),
  changeMode: mode => dispatch(changeMode(mode))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Welcome);
