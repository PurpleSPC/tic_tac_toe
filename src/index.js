import React from "react";
import ReactDOM from "react-dom/client";
import './index.css';

class Game extends React.Component {
  constructor(props) {
      super(props);
      //sets the initial state of the Game 
      this.state = {
          history: [{
              squares: Array(9).fill(null),
          }],
          xIsNext:true,
          stepNumber: 0,
      };
  }
  handleClick(i) {
      //creates a new history array for each move of the game
      const history = this.state.history.slice(0, this.state.stepNumber +1);
      //current move of the game
      const current = history[history.length - 1];
      //value of each square for the current move of the game
      const squares = current.squares.slice();
      if (calculateWinner(squares)|| squares[i]) {
          return;
      }
      //if xIsNext is true, set value of the clicked square to X. Otherwise set value to O
      squares[i]= this.state.xIsNext ? 'X': 'O';
      //update the state after button is clicked
      this.setState({
          //concat method returns a new history array that adds the new move to the previous history array
          history: history.concat([{
              squares: squares,
          }]),
          stepNumber: history.length,
          xIsNext: !this.state.xIsNext,
      });
  }
  //resets the state back to the state of a previous move
  jumpTo(step) {
      this.setState({
          stepNumber: step,
          //if move # is even, xIsNext is true. 
          xIsNext: (step % 2) === 0,
      });
  }
  render() {
      const history = this.state.history;
      const current = history[this.state.stepNumber];
      const winner = calculateWinner(current.squares);
      
      //provides buttons that allow to reset the state to a previous move.
      const moves = history.map((step,move) => {
          //if move# exists, add a new button to go back a move. If move# doesn't exist, only 'Go to game start' button appears.
          const desc = move ?
              'Go to move #' + move :
              'Go to game start';
          return (
              <li key={move}>
                  <button onClick={() => this.jumpTo(move)}>{desc}
                  </button>
              </li>
          );
      });

      //displays a winner if there is one, or displays who the next move belongs to 
      let status;
      if (winner) {
          status = 'Winner: '+ winner;
      } else {
          status = 'Next Player: '+ (this.state.xIsNext ? 'X' : 'O');
      }
    //renders the gameboard with the values of each square, the status, and the moves list.
    return (
      <div className="game">
        <div className="game-board">
          <Board 
              squares={current.squares}
              //pases the handleClick method down to the board component
              onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status }</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}


  
  //the Board component creates the 9 game squares.
  class Board extends React.Component {
    //this renders each square and gives it a value. 
    renderSquare(i) {
      return (
        <Square 
            value={this.props.squares[i]}
            //passing down the handleClick prop from the Game component to the onClick handler of the Square components
            onClick={() => this.props.onClick(i)}
        />
        );
    }
  
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
  
//the square component contains a button
function Square(props) {
  return (
    <button 
        //passed prop handleClick down to the onClick event handler
        className="square" onClick={props.onClick}>
        {props.value}    
    </button>
  );
}

  
 
  // ========================================
  
  const root = ReactDOM.createRoot(document.getElementById("root"));
  root.render(<Game />);

  //used in the Game component. Compares the current squares array to winning positions.
  function calculateWinner(squares) {
    //winning positions
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    //For each possible winning position, check if the current squares array contains a winning position
    for (let i=0; i< lines.length; i++) {
        const [a,b,c] = lines[i];
        //if the current values of any of the winning positions are equal and not null, return value of the winner
        if (squares[a] && squares[a]===squares[b] && squares[a]===squares[c]) {
            return squares[a];
        }
    }
    return null;
  }