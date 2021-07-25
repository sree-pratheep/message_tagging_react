import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {

    return (
      <button 
	    className="square" 
	    onClick={props.onClick}
      >
	    {props.value}
      </button>
    );
}

class Board extends React.Component {

  handleClick(i) {    
	  if ( this.state.squares[i] )
		  return;
	  const squares = this.state.squares.slice();    
	  squares[i] = this.state.xIsNext? 'X': 'O';    
	  this.setState({
		  squares: squares,
	  	  xIsNext: !this.state.xIsNext,
	  });  
  }


  renderSquare(i) {
    return <Square 
	  value={this.props.squares[i]} 
	  onClick={() => this.props.onClick(i)}	  	
		  />
  };

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props){
	  super(props);
	  this.state = {
		history:[ {squares: Array(9).fill(null),
		}],
		xIsNext: false,
		stepNumber: 0,
	  };
  }


  jumpTo(step) {
	  this.setState({
		  stepNumber:step,
		  xIsNext: (step % 2) === 0,
	  });
  }

  handleClick(i) {
	  const history = this.state.history.slice(0, this.state.stepNumber +1 );
	  const current = history[history.length -1]
          if ( current.squares[i] )
                  return;
          const squares = current.squares.slice();
          squares[i] = this.state.xIsNext? 'X': 'O';
          this.setState({
		  history: history.concat([{squares:squares,}]),
                  xIsNext: !this.state.xIsNext,
		  stepNumber: history.length,
          });
  }



  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber]
    const moves = history.map((step,move) => {
	    const desc = move? 'Go to move #' + move: 'Go to game start';
	    const currentSquares = history[move].squares.map((x,index) => ( x!= null?index:null))
	    const prevSquares = (move == 0)?currentSquares:history[move-1].squares.map((x,index) => ( x != null?index:null))
	    const loc = (move !== 0)? ' (' + currentSquares.filter((x,index) => (x != null && x !== prevSquares[index])) + ', ' + (move%2==0?'X':'O') + ')':''
	    const style = (move == this.state.stepNumber)? {fontWeight:'bold'}:{}
	    return (
		    <li key={move}>
		    	<button onClick={() => this.jumpTo(move)} style={style}>{desc + loc }</button>
		    </li>
	    );});

    return (
      <div className="game">
        <div className="game-board">
          <Board 
	    squares={current.squares} 
	    onClick={(i) => this.handleClick(i)}
	    />
        </div>
        <div className="game-info">
          <div>{ 'Next player: ' + (this.state.xIsNext ? 'X':'O') }</div>
          <ol>{ moves }</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

