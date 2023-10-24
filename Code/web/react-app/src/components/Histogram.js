import React from "react";
import { connect } from "react-redux";
import {
  FlexibleXYPlot,
  XAxis,
  YAxis,
  Hint,
  VerticalBarSeries,
  ChartLabel
} from "react-vis";
import "../css/textStyle.css"


// a histogram to show the number of cars left vs the number of questions asked.
class Histogram extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hintValue: null,
      showMore: false
    };
  }

  toggleShowMore = () => {
    this.setState(prevState => ({
      showMore: !prevState.showMore
    }));
  };

  _onMouseLeave = () => {
    this.setState({
      hintValue: null
    });
  };

  _onNearestX = (value, { index }) => {
    this.setState({
      hintValue: this.props.data[index]
    });
  };

  render() {
    const { showMore } = this.state;
    const moreText = " During the interaction, according to your answers " +
        "to questions, we can learn your preference on cars. Then, unsuitable cars are excluded from " +
        "Candidates Cars based on the learned preference. Thus, with more questions you answer, fewer Candidates Cars left.";

    return (
      <div>
        <div style={{ width: "30rem", height: "26rem"}}>
          <FlexibleXYPlot onMouseLeave={this._onMouseLeave}
                          style={{ background: '#333' }}
                          margin={{ left: 75, right: 20, top: 20, bottom: 60 }}>
            <XAxis
              tickValues={this.props.data.map((val, idx) => idx)}
              tickFormat={value => value.toString()}
              style={{
                ticks: { fill: "white" },
                text: { stroke: 'none', fill: 'white', fontWeight: 600, fontSize: '14px'}
              }}
            />
            <YAxis
              style={{
                ticks: { fill: "white" },
                text: { stroke: 'none', fill: 'white', fontWeight: 600, fontSize: '14px' }
              }}
            />
            <ChartLabel
              text="Number of Questions Answered"
              includeMargin={false}
              xPercent={0.2}
              yPercent={1.2}
              style={{
                style: { fill: "white", fontSize: '14px' }
              }}
            />
            <ChartLabel
              text="Number of Candidate Cars"
              includeMargin={false}
              xPercent={-0.13}
              yPercent={0.3}
              style={{
                transform: "rotate(-90)",
                textAnchor: "end",
                style: { fill: "white", fontSize: '14px' }
              }}
            />
            <VerticalBarSeries
              color="rgb(77, 182, 172)"
              onNearestX={this._onNearestX}
              data={this.props.data}
              animation
              style={{
                boxShadow: '2px 2px 4px rgba(0,0,0,0.5)', borderRadius: '5px 5px 0 0'
              }}
            />
            {this.state.hintValue && (
                <Hint value={this.state.hintValue}>
                  <div style={{ background: 'rgba(0, 0, 0, 0.8)', padding: '5px', borderRadius: '5px', color: 'white' }}> {/* 添加背景，圆角和阴影 */}
                    Number of Questions Answered: {this.state.hintValue.x}
                    <br />
                    Number of Candidate Cars: {this.state.hintValue.y}
                  </div>
                </Hint>
            )}
          </FlexibleXYPlot>
        </div>
        <div style={{ width: "30rem" }}>
          <h4 style={{'padding': '10px'}}>Figure: Candidate Cars -- Questions</h4>
          <p className="text-t-align">
            &nbsp;&nbsp;&nbsp;&nbsp;This figure shows the number of Candidates Cars with the
            number of Questions you answer. {showMore ? moreText : ' '}
            <button className="toggleButton" onClick={this.toggleShowMore}>
              {showMore ? <span className="foldText">&nbsp;fold</span> : <span className="foldText">...unfold</span>}
            </button>
          </p>
        </div>
      </div>
    );
  }
}

/*
const mapStateToProps = ({ numLeftPoints }) => ({
  data: numLeftPoints.map((num, i) => ({ x: i, y: num }))
});

 */
const mapStateToProps = ({ numLeftPoints }) => {
  let mappedData = numLeftPoints.map((num, i) => ({ x: i, y: num }));

  if (mappedData.length === 1) {
    mappedData.push({ x: 0.01, y: 0 });
    mappedData.push({ x: -0.01, y: 0 });
  }

  return {
    data: mappedData
  };
};

export default connect(mapStateToProps)(Histogram);
