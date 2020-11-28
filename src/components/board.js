import { Avatar, Box, Button, Grid, GridList, GridListTile, List, ListItem, ListSubheader, Popover, TextField, Typography } from '@material-ui/core'
import React from 'react'
import Draggable from 'react-draggable'
import logo from '../static/logo.jpeg'
import diceOne from '../static/dice_one.svg'
import diceTwo from '../static/dice_two.svg'
import diceThree from '../static/dice_three.svg'
import diceFour from '../static/dice_four.svg'
import diceFive from '../static/dice_five.svg'
import diceSix from '../static/dice_six.svg'
import { prompts } from '../constants/prompts'
import board from '../static/board.svg'
import { store } from '../store/store'
import { asyncThunks } from '../actionCreators/actionCreators'

const playerGen = (name) => {
  return {
    name: name,
    initials: name,
    color: `#${Math.floor(Math.random()*16777215).toString(16)}`,
    points: 0
  }
}
const players = [playerGen("p1"), playerGen("p2"), playerGen("p3"), playerGen("p4"), playerGen("p5"), playerGen("p6"), playerGen("p7"), playerGen("p8"), playerGen("p9"), playerGen("p10")]
const dices = [diceOne, diceTwo, diceThree, diceFour, diceFive, diceSix]

const initialState = {
  size: 8,
  players: [],
  boxes: [],
  addPlayerName: "",
  currDiceIndex: 0,
  currPrompt: {
    boxNumber: 0,
    text: "Prompts will show here when you click a panel on the board"
  },
  isPopoverOpen: false,
}

export default class Board extends React.Component {
  constructor(props) {
    super(props)
    this.state = initialState
  }

  componentDidMount() {
    const matrix = [];
    for (let i = 0; i < this.state.size; i++) {
      const row = []
      for (let j = 0; j < this.state.size; j++) {
        row.push([])
      }
      matrix.push(row)
    }
    this.setState({...this.state, boxes: matrix})
    document.addEventListener("keyup", event => {
      if (event.code === 'Space') {
        this.rollDice()
      }
    })

    // store.dispatch(asyncThunks.simulateAGame());
  }

  rollDice() {
    this.setState({ ...this.state, currDiceIndex: null })
    setTimeout(() => {
      this.setState({ ...this.state, currDiceIndex: (Math.floor(Math.random() * 6)) })
    }, 1000)
  }

  render() {
    const boxes = []
    for (let i = this.state.size - 1; i >= 0; i--) {
      for (let j = 0; j < this.state.size; j++) {
        let count = i * this.state.size + j + 1
        if (i % 2 === 1) count = (i + 1) * this.state.size - j
        const box = (
          <GridListTile id={count} className="ular-mabok-box" onClick={() => {
            this.setState({
              ...this.state,
              currPrompt: {
                boxNumber: count,
                text: prompts[count]
              },
              isPopoverOpen: true
            })
          }}>
            {/* <Box>{count}</Box> */}
          </GridListTile>
        )
        boxes.push(box)
      }
    }

    const peons = []
    const maxSize = 5
    for (let i = 0; i < maxSize; i++) {
      for (let j = 0; j < maxSize; j++) {
        const counter = i * maxSize + j
        if (counter >= this.state.players.length) break;
        const currPlayer = this.state.players[counter]
        const peon = (
          <Draggable
            defaultPosition={{x: (-(100 * i)), y: (-80 + (20 * i))}}
            grid={[100, 100]}
            scale={1}
            // onDragEnd={(elem, x, y, e) => {
            //   console.log(elem)
            //   console.log(x)
            //   console.log(y)
            //   console.log(e)
            // }}
          >
            <Avatar style={{ backgroundColor: currPlayer.color, height: "20px", width: "20px", fontSize: "12px" }}>{currPlayer.initials}</Avatar>
          </Draggable>
        )
        peons.push(peon)
      }
    }

    const listItems = this.state.players.map((p, index) => {
      return (
        <ListItem className="players">
          <div className="delete-button" onClick={() => {
            this.setState({
              ...this.state,
              players: this.state.players.filter(pl => pl.name !== p.name)
            })
          }}>
            x
          </div>
          &nbsp;{index+1}.&nbsp;<Avatar style={{ backgroundColor: p.color, height: "20px", width: "20px", fontSize: "12px" }}>{p.initials}</Avatar>
          &nbsp;
          -
          &nbsp;{p.name}
        </ListItem>
      )
    })

    const handleAddPlayer = () => {
      if (this.state.addPlayerName === "") return
      if (!!this.state.players.find(p => p.name === this.state.addPlayerName)) return
      const player = {
        name: this.state.addPlayerName,
        initials: this.state.addPlayerName.substring(0, 2),
        color: `#${Math.floor(Math.random()*16777215).toString(16)}`,
        points: 0
      }
      this.setState({
        ...this.state,
        players: [...this.state.players, player].sort((a, b) => (a.points - b.points)),
        addPlayerName: initialState.addPlayerName
      })
    }

    let currDice;
    if (this.state.currDiceIndex === null) {
      currDice = "🤔";
    } else {
      currDice = <img src={dices[this.state.currDiceIndex]} className="dices"/>
    }

    return (
      <>
        <Grid container className="ular-mabok">
          <Popover
            className="ular-mabok-popover"
            open={this.state.isPopoverOpen}
            onClose={() => this.setState({ ...this.state, isPopoverOpen: false })}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'center',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'center',
            }}
          >
            <Typography className="number">#{this.state.currPrompt.boxNumber}</Typography>
            <Typography className="text">{this.state.currPrompt.text}</Typography>
          </Popover>
          <Grid item xs={8}>
            <Grid container item className="top-bar">
              <Grid item xs={10}>
                {/* <Avatar src={logo} className="ular-mabok-logo" /> */}
                <TextField
                  className="ular-mabok-input"
                  label="Add player"
                  placeholder="Insert name here..."
                  value={this.state.addPlayerName}
                  margin="normal"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  variant="outlined"
                  onChange={(e) => {
                    this.setState({ ...this.state, addPlayerName: e.target.value })
                  }}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleAddPlayer() }}
                />
              </Grid>
              <Grid item xs={2} className="ular-mabok-button-container">
                <Button variant="contained" color="primary" className="ular-mabok-button" onClick={() => handleAddPlayer()}>
                  Add Player
                </Button>
              </Grid>
            </Grid>
            <Grid item>
              <GridList cols={8} className="ular-mabok-board" style={{ margin: "auto" }}>
                {boxes}
                {peons}
              </GridList>
            </Grid>
          </Grid>
          <Grid item container xs={2} style={{ paddingLeft: "10px" }} className="sidebar">
            <Grid item container xs={12} className="dice-roll">
              <Grid className="title" xs={12}>
                Roll Me!
              </Grid>
              <Grid className="title" xs={12} onClick={() => this.rollDice()}>
                {currDice}
              </Grid>
            </Grid>
            <Grid className="prompt">
              <Box className="number">
                #{this.state.currPrompt.boxNumber}
              </Box>
              <Box className="content">
                {this.state.currPrompt.text}
              </Box>
            </Grid>
            <Grid className="logo">
              <img src={logo} />
            </Grid>
          </Grid>
          <Grid item container xs={2} style={{ paddingLeft: "10px" }} className="sidebar">
            <Grid item xs={12} className="leaderboard">
              <List
                subheader={
                  <ListSubheader className="subheader">
                    Players
                  </ListSubheader>
                }
              >
                {listItems}
              </List>
            </Grid>
          </Grid>
        </Grid>
      </>
    )
  }
}