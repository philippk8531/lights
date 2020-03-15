import React, { Component } from 'react';
import Cell from './Cell';
import './Board.css';

/** Game board of Lights out.
 *
 * Properties:
 *
 * - nrows: number of rows of board
 * - ncols: number of cols of board
 * - chanceLightStartsOn: float, chance any cell is lit at start of game
 *
 * State:
 *
 * - hasWon: boolean, true when board is all off
 * - board: array-of-arrays of true/false
 *
 *    For this board:
 *       .  .  .
 *       O  O  .     (where . is off, and O is on)
 *       .  .  .
 *
 *    This would be: [[f, f, f], [t, t, f], [f, f, f]]
 *
 *  This should render an HTML table of individual <Cell /> components.
 *
 *  This doesn't handle any clicks --- clicks are on individual cells
 *
 **/

class Board extends Component {
    constructor(props) {
        super(props);

        this.state = {
            hasWon: false,
            board: this.createBoard()
        };
        this.flipCellsAround = this.flipCellsAround.bind(this);
    }

    static defaultProps = {
        nrows: 5,
        ncols: 5,
        chanceLightStartsOn: 0.5
    };

    createBoard() {
        let board = new Array(this.props.nrows);
        for (let i = 0; i < board.length; ++i) {
            board[i] = new Array(this.props.ncols);
            for (let j = 0; j < board[i].length; ++j) {
                board[i][j] =
                    Math.random() < this.props.chanceLightStartsOn;
            }
        }
        return board;
    }

    /** handle changing a cell: update board & determine if winner */

    flipCellsAround(coord) {
        let { ncols, nrows } = this.props;
        let board = this.state.board;
        let [ y, x ] = coord.split('-').map(Number);
        function flipCell(y, x) {
            // if this coord is actually on board, flip it
            if (x >= 0 && x < ncols && y >= 0 && y < nrows) {
                board[y][x] = !board[y][x];
            }
        }
        flipCell(y, x);
        flipCell(y - 1, x);
        flipCell(y, x - 1);
        flipCell(y + 1, x);
        flipCell(y, x + 1);

        // TODO: flip this cell and the cells around it
        // win when every cell is turned off
        // TODO: determine is the game has been won

        let hasWon = board.every(col => col.every(cell => !cell));
        //let win = [];
        // for (let y = 0; y < this.props.nrows; ++y) {
        //     for (let x = 0; x < this.props.ncols; ++x) {
        //         win.push(board[y][x]);
        //     }
        // }
        // hasWon = win.every(val => val === false);
        console.log(hasWon);
        this.setState({ board, hasWon });
    }

    /** Render game board or winning message. */

    render() {
        let tblBoard = [];
        for (let y = 0; y < this.props.nrows; ++y) {
            let row = [];
            for (let x = 0; x < this.props.ncols; ++x) {
                let coord = `${y}-${x}`;
                row.push(
                    <Cell
                        key={coord}
                        coord={coord}
                        isLit={this.state.board[y][x]}
                        flipCellsAroundMe={this.flipCellsAround}
                    />
                );
            }
            tblBoard.push(<tr key={y}>{row}</tr>);
        }

        return (
            <div>
                <div className="Board-title">
                    <div className="neon-orange">Lights</div>
                    <div className="neon-blue">Out</div>
                </div>
                {this.state.hasWon ? (
                    <div className="winner">
                        <span className="neon-orange">YOU</span>
                        <span className="neon-blue">WIN!</span>
                    </div>
                ) : (
                    <table className="Board">
                        <tbody>{tblBoard}</tbody>
                    </table>
                )}
            </div>
        );
    }
}

export default Board;
