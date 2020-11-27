import { Avatar, Box, Grid, GridList, GridListTile, List, ListItem, ListSubheader, TextField } from '@material-ui/core'
import React from 'react'
import Draggable from 'react-draggable'

const playerGen = (name) => {
  return {
    name: name,
    initials: name,
    color: `#${Math.floor(Math.random()*16777215).toString(16)}`,
    points: 0
  }
}
const players = [playerGen("p1"), playerGen("p2"), playerGen("p3"), playerGen("p4"), playerGen("p5"), playerGen("p6"), playerGen("p7"), playerGen("p8"), playerGen("p9"), playerGen("p10")]

const initialState = {
  size: 8,
  players: [],
  boxes: [],
  addPlayerName: ""
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
  }

  render() {
    const boxes = []
    for (let i = this.state.size - 1; i >= 0; i--) {
      for (let j = 0; j < this.state.size; j++) {
        let count = i * this.state.size + j + 1
        if (i % 2 === 1) count = (i + 1) * this.state.size - j
        const box = (
          <GridListTile id={count} className="ular-mabok-box">
            <Box>{count}</Box>
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
          >
            <Avatar style={{ backgroundColor: currPlayer.color, height: "20px", width: "20px", fontSize: "12px" }}>{currPlayer.initials}</Avatar>
          </Draggable>
        )
        peons.push(peon)
      }
    }

    const listItems = this.state.players.map((p, index) => {
      return (
        <ListItem>
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

    return (
      <>
        <Grid container className="ular-mabok">
          <Grid item xs={8}>
            <Grid item>
              <Grid item xs={12}>
                <TextField
                  id="ular-mabok-input"
                  label="Add player"
                  placeholder="Insert name here..."
                  value={this.state.addPlayerName}
                  style={{ margin: 8 }}
                  margin="normal"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  variant="outlined"
                  onChange={(e) => {
                    this.setState({ ...this.state, addPlayerName: e.target.value })
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
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
                  }}
                />
              </Grid>
            </Grid>
            <Grid item>
              <GridList cols={8} className="ular-mabok-board">
                {boxes}
                {peons}
              </GridList>
            </Grid>
          </Grid>
          <Grid item xs={2}>
            Dice
          </Grid>
          <Grid item xs={2}>
            <List
              subheader={
                <ListSubheader>
                  Leaderboard
                </ListSubheader>
              }
            >
              {listItems}
            </List>
          </Grid>
        </Grid>
      </>
    )
  }
}