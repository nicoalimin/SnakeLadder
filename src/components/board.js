import { Box, Grid, GridList, GridListTile, List, ListItem, ListSubheader, TextField } from '@material-ui/core'
import React from 'react'

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

    const listItems = this.state.players.map((p, index) => {
      return (
        <ListItem>
          {index+1}. {p.name}
        </ListItem>
      )
    })

    return (
      <>
        <Grid container>
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
                      const player = {
                        name: this.state.addPlayerName,
                        initials: this.state.addPlayerName.substring(0, 1),
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