import React from "react";
import { setActiveComponent,
        setLeftPoints,
        prunePoints,
        restart } from "../actions";
import { connect } from "react-redux";
import { loadCarDataset } from "../utils";
import '../css/Tree.css';
import Histogram from "./Histogram"
import Stats from "./Stats";
import TitleTree from "../imgs/TitleTree.png";

let attrData = [];
let carLength = 5;
let numOfQuestion = 0;
let prevLeftPoints = [];
let targetLevel = 3;

const TreeNode = ({ node, nodes, level = 0 }) => {
    const childNodes = nodes.filter(child => child.parentId === node.id);

    return (
        <li>
            <a href="#">{node.name}</a> 
            {childNodes.length > 0 && (
                <ul>
                    {childNodes.map(child => (
                        <TreeNode node={child} nodes={nodes} level={level + 1} />
                    ))}
                </ul>
            )}
        </li> 
    );
};


function getAllPaths(tree, currentPath = []) {
    if (!tree) return [];

    currentPath.push(tree.name);
    if (!tree.children || tree.children.length === 0) {
        return [currentPath];
    }

    let paths = [];
    for (let child of tree.children) {
        paths = paths.concat(getAllPaths(child, [...currentPath]));
    }

    return paths;
}


function dfs(tree, path = [], targetLevel, currentLevel = 1) {
    path.push(tree);

    // 当前层是目标层，检查孩子的数量
    if (currentLevel === targetLevel && tree.children && tree.children.length >= 2)
    {
        return path;
    }

    if (tree.children) {
        for (let child of tree.children) {
            const result = dfs(child, [...path], targetLevel, currentLevel + 1);
            if (result) return result;
        }
    }

    return null;
}


function findQuestion(tree)
{
    let result = null;
    while (targetLevel > 0) {
        result = dfs(tree, [], targetLevel);
        if (result) break;
        targetLevel--;
    }

    if(!result)
    {
        let pair1 = [];
        let nodeIndex = tree;
        pair1.push(nodeIndex);
        while(nodeIndex.children)
        {
            pair1.push(nodeIndex.children[0]);
            nodeIndex = nodeIndex.children[0];
        }
        return [pair1];
    }

    let pair1 = [...result];
    let nodeIndex = result[result.length - 1].children[0];
    pair1.push(nodeIndex);
    while(nodeIndex.children)
    {
        pair1.push(nodeIndex.children[0]);
        nodeIndex = nodeIndex.children[0];
    }

    let pair2 = [...result];
    nodeIndex = result[result.length - 1].children[1];
    pair2.push(nodeIndex);
    while(nodeIndex.children)
    {
        pair2.push(nodeIndex.children[0]);
        nodeIndex = nodeIndex.children[0];
    }
    return [pair1, pair2]
}


// the welcome scene containing a brief introduction and a table to obtain the user's input
class SPTree extends React.Component {
    constructor(props) {
        super(props);
        /*const cars = [
            [ "suv", "diesel", "automatic", "car: 1"],
            [ "limousine", "benzin", "manual", "car: 1"],
            [ "suv", "diesel", "manual", "car: 1"],
            [ "coupe", "benzin", "manual", "car: 1"],
            [ "limousine", "benzin", "automatic", "car: 1"],
            [ "limousine", "diesel", "automatic", "car: 1"],
            [ "limousine", "diesel", "manual", "car: 1"],
            [ "coupe", "benzin", "automatic", "car: 1"],
            [ "suv",	"benzin", "automatic", "car: 1"],
            [ "coupe", "diesel", "manual", "car: 1"],
            [ "limousine", "lpg", "automatic", "car: 1"],
            [ "coupe", "diesel", "automatic", "car: 1"],
            [ "suv", "benzin", "manual", "car: 1"],
            [ "suv", "lpg", "automatic", "car: 1"],
            [ "limousine", "lpg", "manual", "car: 1"],
            [ "coupe", "lpg", "automatic", "car: 1"],
            [ "suv",	"lpg", "manual", "car: 1"],
            [ "coupe", "lpg", "manual", "car: 1"],
            [ "limousine", "cng", "automatic", "car: 1"],
            [ "limousine", "cng", "manual", "car: 1"]
        ];
         */


        numOfQuestion = 0; targetLevel = 3; prevLeftPoints = [];
        carLength = this.props.candidates[0].length;
        attrData = [
            { id: 1, name: "Root", parentId: null },
            { id: 2, name: "Type", parentId: 1 },
            { id: 3, name: "Power", parentId: 2 },
            { id: 4, name: "Transmission", parentId: 3 },
            { id: 5, name: "Car", parentId: 4 }
        ];

        let cars = [];
        for(let i = 0; i < this.props.candidates.length; ++i)
        {
            const car = [];
            for (let j = 0; j < this.props.candidates[i].length; ++j)
                car.push(this.props.candidates[i][j]);
            car.push("CarID: " + (i+1));
            cars.push(car);
        }

        let indexes = [];
        for(let i = 0; i < this.props.candidates.length; ++i)
        {
            indexes.push(i);
            prevLeftPoints.push(i);
        }
        this.props.setLeftPoints(indexes);

        attrData = attrData.filter((attr, index) =>
            index === 0 || index === attrData.length - 1 || this.props.mask[attr.name] === 1
        );
        attrData = attrData.map((attr, index) => {
            return {
                ...attr,
                id: index + 1,
                parentId: index === 0 ? attr.parentId : index
            };
        });

        const tree = this.generateCarTree(cars);
        const nodesData = this.treeToNodesData(tree);
        const pair = findQuestion(tree);
        this.state = {
            cars: cars,
            tree: tree,
            nodesData: nodesData,
            pair: pair
        };
    }

    addCarToTree = (tree, car) => {
        if (car.length === 1) 
            {
                if (!tree.children) 
                {
                    tree.children = [];
                }
                tree.children.push({ name: car[0] }); // This is a leaf node
                return;
            }
            if (!tree.children) 
            {
                tree.children = [];
            }
            let node = tree.children.find(child => child.name === car[0]);
            if (!node) 
            {
                node = { name: car[0] };
                tree.children.push(node);
            }
            this.addCarToTree(node, car.slice(1));
    };
    generateCarTree = (cars) => {
            const tree = { name: 'Root' };
            for (const car of cars) 
            {
                this.addCarToTree(tree, car);
            }
            return tree;
    };
    treeToNodesData = (tree) => {
        const nodesData = [];
        const queue = [{ node: tree, parentId: null }];
        let currentId = 1;

        while (queue.length > 0) {
            const { node, parentId } = queue.shift();

            nodesData.push({ id: currentId, name: node.name, parentId });

            // If the current tree node has children, add them to the queue with current nodeId as their parentId.
            if (node.children) {
                for (const child of node.children) {
                queue.push({ node: child, parentId: currentId });
                }
            }

            currentId++;
        }

        return nodesData;
    };

    removeChildWithName = (node, nameToRemove, referenceName) => {
        if (!node.children || node.children.length === 0) return node;

        let namesFound = 0;
        for (let i = 0; i < node.children.length; i++) {
            const child = node.children[i];
            if (child.name === nameToRemove || child.name === referenceName) {
                namesFound++;
            }
        }

        let newChildren = [...node.children];
        if (namesFound >= 2) {
            newChildren = newChildren.filter(child => child.name !== nameToRemove);
        }

        return {
            ...node,
            children: newChildren.map(child => this.removeChildWithName(child, nameToRemove, referenceName))
        };
    }

    choose = (choice) => {
        numOfQuestion++;
        let updatedTree;
        if(choice === 0)
            updatedTree = this.removeChildWithName(this.state.tree,
                this.state.pair[1][targetLevel].name,
                this.state.pair[0][targetLevel].name);
        else if(choice === 1)
            updatedTree = this.removeChildWithName(this.state.tree,
                this.state.pair[0][targetLevel].name,
                this.state.pair[1][targetLevel].name);

        const updateNodesData = this.treeToNodesData(updatedTree);
        const updatePair = findQuestion(updatedTree);
        const TLeftTuples = getAllPaths(updatedTree);
        let allLeftTuples = [];
        for(let i = 0; i < TLeftTuples.length; ++i)
            allLeftTuples.push(TLeftTuples[i].slice(1, TLeftTuples[i].length - 1));

        console.log(allLeftTuples);
        let indexes = [];
        for (let tuple of allLeftTuples)
        {
            let tupleStr = tuple.join(',');
            let foundIndex = this.props.candidates.findIndex(candidate => candidate.join(',') === tupleStr);
            if (foundIndex !== -1) {
                indexes.push(foundIndex);
            }
        }
        console.log(prevLeftPoints);
        console.log(indexes);
        const pruneIndexes = prevLeftPoints.filter(point => !indexes.includes(point));
        console.log(pruneIndexes);

        prevLeftPoints = indexes;
        this.props.prunePoints(pruneIndexes, numOfQuestion);

        if(updatePair.length < 2)
            this.props.showResult();

        this.setState({
            tree: updatedTree,
            nodesData: updateNodesData,
            pair: updatePair
        }, () => {
            console.log(this.state.tree);
            console.log(this.state.nodesData);
            console.log(this.state.pair);
        });
    }

    startAgain = () =>
    {
        this.props.restartedAgain();
        console.log(this.props.candidates);
    }


    componentDidMount() {
        const container = document.querySelector('.scrollable-container');
        container.scrollLeft = (container.scrollWidth - container.clientWidth) / 2;
    }


    render() {

        let ths = null, trs = null;
        console.log(attrData);
        if(this.state.pair.length > 1) {
            ths = [<th key="Option No.">Option</th>];
            attrData.slice(0, carLength + 1).slice(1).forEach(attr => {
                ths.push(<th key={attr.id}>{attr.name}</th>);
            });
            ths.push(<th key="chooseButton"/>);

            trs = this.state.pair.map((idx, i) => {
                const tds = [<td key="Option No.">{i+1}</td>];
                idx.slice(0, carLength + 1).slice(1).forEach((x, j) => {
                    tds.push(<td key={j}>{x.name}</td>);
                });

                tds.push(
                    <td key="chooseButton">
                        <button type="button"
                                className="choose-btn"
                                style={{ width: "6rem", height: "1.5rem" }}
                                onClick={() => this.choose(i)}>
                            Choose
                        </button>
                    </td>
                );

                return (
                    <tr key={i} data-toggle="tooltip">
                        {tds}
                    </tr>
                );
            });
        }
        else {
            ths = [<th key="Option No."></th>];
            attrData.slice(0, carLength + 1).slice(1).forEach(attr => {
                ths.push(<th key={attr.id}>{attr.name}</th>);
            });

            trs = this.state.pair.map((idx, i) => {
                const tds = [<td key="Option No.">{idx[carLength+1].name}</td>];
                idx.slice(0, carLength + 1).slice(1).forEach((x, j) => {
                    tds.push(<td key={j}>{x.name}</td>);
                });

                return (
                    <tr key={i} data-toggle="tooltip">
                        {tds}
                    </tr>
                );
            });
        }

        const rootNode = this.state.nodesData.find(node => node.parentId === null);
        const rootAttr = attrData.find(node => node.parentId === null);

        if(this.state.pair.length > 1)
        {
            return (
                <div className="text-center m-auto" style={{}}>
                    <img alt='' src={TitleTree} style={{ 'width': '100%' }} />
                    <p style={{ 'background': 'gainsboro', 'borderRadius': '5px', 'padding': '10px',
                        'fontSize': '16px', 'textAlign': 'left'}}>
                        <span style={{ 'fontSize': '20px'}}><strong>Instruction:</strong></span> You will be asked with
                        multiple questions so that we can learn your preference on cars, and then, find your favorite one. There are three parts in the following.
                        <br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<em>Part 1:</em> It interacts with you by asking questions.
                        <br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<em>Part 2:</em> It shows the middle results of algorithm SP-Tree.
                        <br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<em>Part 3:</em> It shows the statistic of the performance of algorithm SP-Tree.
                    </p>
                    <br/>
                    <h4 style={{
                        'background': 'linear-gradient(to right, #89bfe9, #5271a6)', // 添加从左到右的颜色渐变
                        'borderRadius': '5px',
                        'textAlign': 'left',
                        'padding': '5px',
                        'boxShadow': '3px 3px 5px rgba(0, 0, 0, 0.5)'  // 添加稍微的阴影效果
                    }}>
                        <strong><em>&nbsp;PART 1:</em></strong> Interaction
                    </h4>
                    <p style={{ 'background': 'gainsboro', 'borderRadius': '5px', 'padding': '5px',
                        'fontSize': '16px', 'textAlign': 'left'}}>
                        <strong>&nbsp;NOTE: </strong>Choose the Car you favor more between the following options
                    </p>
                    <div className="row justify-content-center align-items-center">
                        <div className="col-md-8">
                            <table className="table table-hover text-center">
                                <thead>
                                <tr>{ths}</tr>
                                </thead>
                                <tbody>{trs}</tbody>
                            </table>
                        </div>
                    </div>
                    <br />
                    <h4 style={{
                        'background': 'linear-gradient(to right, #89bfe9, #5271a6)', // 添加从左到右的颜色渐变
                        'borderRadius': '5px',
                        'textAlign': 'left',
                        'padding': '5px',
                        'boxShadow': '3px 3px 5px rgba(0, 0, 0, 0.5)'  // 添加稍微的阴影效果
                    }}>
                        <strong><em>&nbsp;PART 2:</em></strong> Visuals
                    </h4>
                    <p style={{ 'background': 'gainsboro', 'borderRadius': '5px', 'padding': '10px',
                        'fontSize': '16px', 'textAlign': 'left'}}>
                        <strong>NOTE: </strong>Here shows the C-Tree. Each leaf contains a car and each internal
                        node contains a categorical value. For each leaf, the shortest path from the root to it contains
                        all the categorical values of the car in it.
                    </p>
                    <div class="trees-container">
                        <div class="tree1">
                            <div className="tree">
                                <ul>
                                    <TreeNode node={rootAttr} nodes={attrData}/>
                                </ul>
                            </div>
                        </div>
                        &nbsp;&nbsp;&nbsp;&nbsp;
                        <div class="tree2">
                            <div className="tree">
                                <ul>
                                    <TreeNode node={rootNode} nodes={this.state.nodesData}/>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="trees-container">
                        <div className="tree21">
                            <h4 style={{'width': '8.75rem', 'padding': '10px'}}>Attributes</h4>
                        </div>
                        &nbsp;&nbsp;&nbsp;&nbsp;
                        <div className="tree22">
                            <h4 style={{'width': '100%', 'padding': '10px'}}>The C-Tree</h4>
                        </div>
                    </div>

                    <br />
                    <h4 style={{
                        'background': 'linear-gradient(to right, #89bfe9, #5271a6)', // 添加从左到右的颜色渐变
                        'borderRadius': '5px',
                        'textAlign': 'left',
                        'padding': '5px',
                        'boxShadow': '3px 3px 5px rgba(0, 0, 0, 0.5)'  // 添加稍微的阴影效果
                    }}>
                        <strong><em>&nbsp;PART 3:</em></strong> Statistics
                    </h4>
                    <p style={{ 'background': 'gainsboro', 'borderRadius': '5px', 'padding': '10px',
                        'fontSize': '16px', 'textAlign': 'left'}}>
                        <strong>NOTE: </strong>Here shows one figure and two tables that demonstrate the Candidate Cars
                        and the Cars pruned during the interaction process.
                    </p>

                    <div className="scrollable-container">
                        &nbsp;&nbsp;&nbsp;&nbsp;
                        <div className="row justify-content-center">
                            <Histogram />
                        </div>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <div className="row justify-content-center">
                            <Stats />
                        </div>
                    </div>

                    <br />
                    <div>
                        <button type="button"
                                className="modern-btn"
                                style={{ width: "12rem" }}
                                onClick={this.startAgain}>
                            Return to Home
                        </button>
                    </div>
                    <br />

                </div>
            );
        }
        else
        {
            return (
                <div className="text-center m-auto" style={{}}>
                    <h1>Algorithm: SP-Tree</h1>
                    <br/>
                    <br/>

                    <h4>
                        Based on your selection, the following is our recommendation.
                    </h4>
                    <div className="row justify-content-center align-items-center">
                        <div className="col-md-8">
                            <table className="table table-hover text-center">
                                <thead>
                                <tr>{ths}</tr>
                                </thead>
                                <tbody>{trs}</tbody>
                            </table>
                        </div>
                    </div>

                    <div class="trees-container">
                        <div class="tree1">
                            <div className="tree">
                                <ul>
                                    <TreeNode node={rootAttr} nodes={attrData}/>
                                </ul>
                            </div>
                        </div>

                        <div class="tree1">
                            <div className="tree">
                                <ul>
                                    <TreeNode node={rootNode} nodes={this.state.nodesData}/>
                                </ul>
                            </div>
                        </div>
                    </div>


                </div>
            );
        }


    }
}

const mapStateToProps = ({ candidates, attributes, mask, points, numLeftPoints, leftPoints }) => ({
    attributes,
    mask,
    points,
    candidates,
    numLeftPoints,
    leftPoints
});

const mapDispatchToProps = dispatch => ({
    showResult: () => {
        dispatch(setActiveComponent("Result"));
    },
    setLeftPoints: indices => {
        dispatch(setLeftPoints(indices));
    },
    restartedAgain: () => {
        dispatch(setActiveComponent("Welcome"));
        dispatch(restart());
        console.log("start");
    },
    prunePoints: (indices, step) => {
        dispatch(prunePoints(indices, step));
    }

});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SPTree);