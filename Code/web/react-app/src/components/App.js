import React from "react";
import Welcome from "./Welcome";
import AlgSelction from "./AlgSelection";
import Introduction from "./Introduction";
import PhaseOne from "./PhaseOne";
import Interaction from "./Interaction";
import PhaseTwo from "./PhaseTwo";
import Result from "./Result";
import SPTree from "./SPTree"
import GEGraph from "./GEGraph"
import End from "./End"
import ResultGEGraph from "./ResultGraph"
import { connect } from "react-redux";

function App({ activeComponent }) {
  switch (activeComponent) {
    case "Welcome":
      return <Welcome />;
    case "AlgSelection":
      return <AlgSelction />;
    case "SPTree":
      return <SPTree />;
    case "GEGraph":
      return <GEGraph />;
    case "Introduction":
      return <Introduction />
    case "ResultGraph":
      return <ResultGEGraph />;
    case "PhaseTwo":
      return <PhaseTwo />
    case "Result":
      return <Result />;
    case "End":
      return <End />;
    default:
      return <div />;
  }
}

const mapStateToProps = ({ activeComponent }) => ({
  activeComponent
});

export default connect(mapStateToProps)(App);
