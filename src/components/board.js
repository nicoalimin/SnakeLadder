import { Grid, Paper } from '@material-ui/core'
import React from 'react'

export default class Board extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      size: 6,
      players: [],
      locations: {}
    }
  }

  render() {
    const boxes = []
    for (let i = this.state.size - 1; i >= 0; i--) {
      for (let j = this.state.size; j > 0; j--) {
        const count = i * this.state.size + j
        const box = (
          <Grid id={count} item xs={2} className="box">
            <Paper>ID: #{count}</Paper>
          </Grid>
        )
        boxes.push(box)
      }
    }

    return (
      <Grid container className="board">
        {boxes}
      </Grid>
    )
  }
}