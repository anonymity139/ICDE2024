import React from "react";
import {
  setActiveComponent,
  setCandidates,
  toggleMask,
  changeMode,
  changeK,
  setDataset
} from "../actions";
import { connect } from "react-redux";
import { selectCandidates, selectCatonlyCandidates, getRanges, getSkyline } from "../utils";
import imgFavorite from '../imgs/favorite.png';
import MainTitle from '../imgs/MainTitle.png';
import SelectCatAttr from '../imgs/SelectCatAttr.png'
import '../css/welcome.css';
import {config} from "@fortawesome/fontawesome-svg-core";

// the welcome scene containing a brief introduction and a table to obtain the user's input
class Welcome extends React.Component {
  state = {
    selectedAlgorithm: this.props.mode
  }

  handleStart = () => {
    /*
    let attNum = Object.values(this.props.mask).filter((i) => i === 1).length;
    if (Object.values(this.props.mask).filter((i) => i === 1).length < 2) {
      return alert('You should select at least two attributes')
    }
    */

    /*
        'attributes', 'mask' 'points' include (categorical + numerical)
        'ranges' includes masked numerical attributes
        'candidates' includes masked attributes
    */
    let ranges = [], mask = [], maxPoints;
    for (let i = 0; i < this.props.attributes.length; ++i)
    {
        const [attr, config] = this.props.attributes[i];
        mask.push(this.props.mask[attr]);
    }
    for (let i = 0; i < this.props.attributes.slice(3).length; ++i)
    {
      const [attr, config] = this.props.attributes.slice(3)[i];
      const range = [config.low, config.high];
      if (this.props.mask[attr])
      {
        for (let j = 0; j < 2; ++j)
        {
          const str = this.inputs[attr][j].current.value.trim();
          if (str === "") continue;
          else if (isNaN(str))
          {
            alert(`${str} in range of ${attr} is not an integer`);
            return;
          }
          else {
            range[j] = parseFloat(str);
          }
        }
      }
      ranges.push(range);
    }
    const str = this.inputs.maxPoints.current.value.trim();
    console.log('input number', str);
    if (str === "") maxPoints = 1000;
    else if (/\d+/.test(str)) maxPoints = parseInt(str);
    else {
      alert(`${str} for Maximum items is not an integer`);
      return;
    }
    if (maxPoints > 40000 || maxPoints < 100)
      return alert('The input is out of the range, please input a number between 1000 ~ 40000');

    console.log('ranges', ranges);
    console.log('mask', mask);
    console.log('maxPoints', maxPoints);

    if(['gegraph'].includes(this.props.mode))
    {
      const candidates = selectCandidates(
          this.props.points,
          ranges,
          mask,
          maxPoints
      );
      if (candidates.length === 0) {
        alert("No matching Tuples, try larger ranges");
        return;
      }

      console.log('attr', this.props.attributes);
      let isSelected = this.props.attributes.map(([attr, config]) => {
        return this.props.mask[attr];
      })
      let smallerBetter = this.props.attributes.slice(3).map(([attr, config]) => {
        return config.smallerBetter ? 1 : 0;
      })
      console.log('input points--', candidates, isSelected, smallerBetter);

      //console.log('input points--', candidates, isSelected, smallerBetter);

      let skyline = getSkyline(candidates, smallerBetter, isSelected)
      if (skyline.length < 10)
      {
        console.log('skyline', skyline);
        return alert('Too few valid tuples! Try more attributes, looser ranges, larger Max No. of Tuples or larger datasets!')
      }

      /*
      if (Object.values(this.props.mask).slice(0, 3).filter((i) => i === 1).length > 2) {
        return alert('SPTree only supports two categorical attributes!');
      }
      */

      console.log('skyline', skyline);
      this.props.startAlgorithmGEGraph(skyline);

    }
    else
    {
      if (Object.values(this.props.mask).slice(0, 3).filter((i) => i === 1).length < 1) {
        return alert('You need to select at least one categorical attribute!');
      }
      const candidates = selectCatonlyCandidates (this.props.points, mask);
      this.props.startAlgorithmSPTree(candidates);
    }
  };

  handleChange = event => {
    if (['gegraph'].includes(event.target.value))
    {
      if (Object.values(this.props.mask).slice(0, 3).filter((i) => i === 1).length > 2)
      {
        alert(event.target.value + ' only supports two categorical attributes!');
        this.setState({ selectedAlgorithm: 'sptree' });
        return
      }
      this.props.attributes.slice(3).map(([attr, config]) => {
        this.props.toggleMask(attr, 1);
      });
    }
    else if (['sptree'].includes(event.target.value))
    {
      this.props.attributes.slice(3).map(([attr, config]) => {
        this.props.toggleMask(attr, 0);
      });
    }

    this.setState({ selectedAlgorithm: event.target.value });
    this.props.changeMode(event.target.value);

  };

  isCatAble = (abled, attr) =>
  {
    if(abled === 1) {
      if (Object.values(this.props.mask).slice(0, 3).filter((i) => i === 1).length <= 1)
      {
        return alert('You need to select at least one categorical attribute!');
      }
      else
        this.props.toggleMask(attr, 1 - this.props.mask[attr]);
    }
    else {
       if (this.props.mode === 'gegraph' && Object.values(this.props.mask).slice(0, 3).filter((i) => i === 1).length >= 2)
       {
        return alert('You can only select at most two categorical attributes!');
       }
       else
         this.props.toggleMask(attr, 1 - this.props.mask[attr]);
    }
  }

  isNumAble = (abled, attr) =>
  {
    if(abled === 1) {
      if (Object.values(this.props.mask).slice(3).filter((i) => i === 1).length <= 3)
      {
        return alert('You need to select at least three numerical attributes!');
      }
      else
        this.props.toggleMask(attr, 1 - this.props.mask[attr]);
    }
    else
      this.props.toggleMask(attr, 1 - this.props.mask[attr]);
  }

  render() {
    // Init inputs
    this.inputs = {};
    this.props.attributes.slice(3).forEach(([attr, config]) => {
      this.inputs[attr] = [React.createRef(), React.createRef()];
    });
    this.inputs.maxPoints = React.createRef();


    const categoricalValues =[["Kleinwagen", "Limousine", "Kombi"],
      ["Lpg", "Diesel", "Cng", "Benzin"], ["Auto", "Manual"]];
    // Iterate categorical attributes
    const catAttrs = this.props.attributes.slice(0, 3).map((attr, index) => {
      const abled = this.props.mask[attr];
      return (
          <tr key={attr}>
            <td className="align-middle">
              <span className={`${this.props.mask[attr] ? "attribute-select" : null}`}
                    style={{'textDecoration': this.props.mask[attr] ? '' : 'line-through' }}
              >{attr}</span>
            </td>
            <td>
              <span style={{'textDecoration': this.props.mask[attr] ? '' : 'line-through' }}
              >{categoricalValues[index].join(', ')}</span>
            </td>
            <td className="align-middle">
              <input
                  type="checkbox"
                  className="large-checkbox"
                  checked={abled}
                  onChange={() => this.isCatAble(abled, attr)}
                  style={{ 'cursor': 'pointer'}}
              />
            </td>
          </tr>
      );
    });

    // Iterate numerical attributes
    const numAttrs = this.props.attributes.slice(3).map(([attr, config], index) => {
      const abled = this.props.mask[attr];
      const { low, high } = config;
      return (
          <tr key={attr}>
            <td className="align-middle">
              <span className={`${this.props.mask[attr] ? "attribute-select" : null}`}
                style={{'textDecoration': this.props.mask[attr] ? '' : 'line-through' }}
              >{attr}</span>
            </td>
            <td>
              <input
                  type="text"
                  className="form-control"
                  placeholder={low}
                  ref={this.inputs[attr][0]}
                  disabled={1 - abled}
              />
            </td>
            <td>
              <input
                  type="text"
                  className="form-control"
                  placeholder={high}
                  ref={this.inputs[attr][1]}
                  disabled={1 - abled}
              />
            </td>
            <td className="align-middle">
              <input
                  type="checkbox"
                  className="large-checkbox"
                  checked={abled}
                  disabled={['sptree'].includes(this.props.mode)}
                  onChange={() => this.isNumAble(abled, attr)}
                  style={{ 'cursor': 'pointer'}}
              />
            </td>
          </tr>
      );
    });

    // number of tuples & Algorithms
    const numTuple = [];
    numTuple.push(
        <tr key="other">
          <td className="align-middle font-weight-bold">Maximum No. of Cars</td>
          <td colSpan="20">
            <input
                type="text"
                className="form-control"
                placeholder='1000'
                ref={this.inputs.maxPoints}
                style={{ width: '50%' }}
            />
          </td>
        </tr>
        );

    const algorithmChoose = [];
    algorithmChoose.push(
      <tr>
      <td className="align-middle" colSpan="2">
        <div className="form-check form-check-inline custom-radio-spacing">
          <input
              className="form-check-input"
              type="radio"
              name="algorithm"
              value="sptree"
              onChange={this.handleChange}
              id="sptreeRadio"
              checked={this.state.selectedAlgorithm === 'sptree'}
          />
          <label className="form-check-label" htmlFor="sptreeRadio">
            SP-Tree
          </label>
        </div>
        <div className="form-check form-check-inline">
          <input
              className="form-check-input"
              type="radio"
              name="algorithm"
              value="gegraph"
              onChange={this.handleChange}
              id="gegraphRadio"
              checked={this.state.selectedAlgorithm === 'gegraph'}
          />
          <label className="form-check-label" htmlFor="gegraphRadio">
            GE-Graph
          </label>
        </div>
      </td>
    </tr>
    );


    return (
        <div className="text-center m-auto" style={{ maxWidth: "100%" }}>
          <img alt='' src={MainTitle} style={{ 'width': '100%' }} />
          <br />
          <br />

          {/* Algorithm */}
          <h4 style={{
            'background': 'linear-gradient(to right, #89bfe9, #5271a6)', // 添加从左到右的颜色渐变
            'borderRadius': '5px',
            'textAlign': 'left',
            'padding': '5px',
            'boxShadow': '3px 3px 5px rgba(0, 0, 0, 0.5)'  // 添加稍微的阴影效果
          }}>
            <strong><em>STEP 1:</em></strong> Select the Algorithms for Recommendation
          </h4>
          <table className="table">
            <tbody>{algorithmChoose}</tbody>
          </table>

          {/* categorical attributes */}
          <h4 style={{
            'background': 'linear-gradient(to right, #89bfe9, #5271a6)', // 添加从左到右的颜色渐变
            'borderRadius': '5px',
            'textAlign': 'left',
            'padding': '5px',
            'boxShadow': '3px 3px 5px rgba(0, 0, 0, 0.5)'  // 添加稍微的阴影效果
          }}>
            <strong><em>STEP 2:</em></strong> Select the Categorical Attributes You Concern
          </h4>
          <table className="table">
            <thead>
            <tr>
              <th className="align-middle">Categorical Attributes</th>
              <th>Values</th>
              <th>Selection</th>
            </tr>
            </thead>
            <tbody>{catAttrs}</tbody>
          </table>

          {/* numerical attributes */}
          <h4 style={{
            'background': 'linear-gradient(to right, #89bfe9, #5271a6)', // 添加从左到右的颜色渐变
            'borderRadius': '5px',
            'textAlign': 'left',
            'padding': '5px',
            'boxShadow': '3px 3px 5px rgba(0, 0, 0, 0.5)'  // 添加稍微的阴影效果
          }}>
            <strong><em>STEP 3:</em></strong> Select the Numerical Attributes You Concern
          </h4>
          <table className="table">
            <thead>
            <tr>
              <th className="align-middle">Numerical Attributes</th>
              <th>Lower bound</th>
              <th>Upper bound</th>
              <th>Selection</th>
            </tr>
            </thead>
            <tbody>{numAttrs}</tbody>
          </table>

          {/* Number of Tuples */}
          <h4 style={{
            'background': 'linear-gradient(to right, #89bfe9, #5271a6)', // 添加从左到右的颜色渐变
            'borderRadius': '5px',
            'textAlign': 'left',
            'padding': '5px',
            'boxShadow': '3px 3px 5px rgba(0, 0, 0, 0.5)'  // 添加稍微的阴影效果
          }}>
            <strong><em>STEP 4:</em></strong> Set the Maximum Number of Candidate Cars
          </h4>
          <table className="table">
            <tbody>{numTuple}</tbody>
          </table>



          <div>
            <button
                type="button"
                className="modern-btn"
                style={{ width: "8rem" }}
                onClick={this.handleStart}
            >
              Next
            </button>
          </div>
          <br/>
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
  startAlgorithmSPTree: candidates => {
    dispatch(setCandidates(candidates));
    dispatch(setActiveComponent("SPTree"));
  },
  startAlgorithmGEGraph: candidates => {
    dispatch(setCandidates(candidates));
    dispatch(setActiveComponent("GEGraph"));
  },
  toggleMask: (attr, mask) => dispatch(toggleMask(attr, mask)),
  changeMode: mode => dispatch(changeMode(mode)),
  changeK: K => dispatch(changeK(K)),
  setDataset: (points, labels, attributes) => dispatch(setDataset(points, labels, attributes))
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Welcome);