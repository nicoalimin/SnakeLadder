import {
  Avatar,
  Box,
  Button,
  Grid,
  GridList,
  GridListTile,
  List,
  ListItem,
  ListSubheader,
  Popover,
  TextField,
  Typography,
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import Draggable from "react-draggable";
import { prompts } from "../constants/prompts";
import { playersActions } from "../reducers/root";
import diceFive from "../static/dice_five.svg";
import diceFour from "../static/dice_four.svg";
import diceOne from "../static/dice_one.svg";
import diceSix from "../static/dice_six.svg";
import diceThree from "../static/dice_three.svg";
import diceTwo from "../static/dice_two.svg";
import logo from "../static/logo.jpeg";
import { store } from "../store/store";

const dices = [diceOne, diceTwo, diceThree, diceFour, diceFive, diceSix];

const DIMENSION_SIZE = 8;

const initialState = {
  size: DIMENSION_SIZE,
  players: [],
  boxes: new Array(DIMENSION_SIZE).map(() => new Array(DIMENSION_SIZE)),
  addPlayerName: "",
  currDiceIndex: 0,
  currPrompt: {
    boxNumber: 0,
    text: "Prompts will show here when you click a panel on the board",
  }
};

export const Board = (props) => {
  const [state, setState] = useState(initialState);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  useEffect(() => {
    document.addEventListener("keyup", (event) => {
      if (event.code === "Space") {
        rollDice();
      }
    });
  });

  function rollDice() {
    setState({ ...state, currDiceIndex: null });
    setTimeout(() => {
      setState({
        ...state,
        currDiceIndex: Math.floor(Math.random() * 6),
      });
    }, 1000);
  }

  const totalTiles = DIMENSION_SIZE * DIMENSION_SIZE;
  const boxes = new Array(totalTiles).fill({}).map((_, id) => {
    let count = totalTiles - id;
    count +=
      Math.floor((totalTiles - id - 1) / 8) % 2 === 0
        ? -DIMENSION_SIZE + (id % DIMENSION_SIZE) * 2 + 1
        : 0;
    return (
      <GridListTile
        id={count}
        className="ular-mabok-box"
        onClick={() => {
          setState({
            currPrompt: {
              boxNumber: count,
              text: prompts[count],
            },
          });
          setIsPopoverOpen(true);
        }}
      />
    );
  });

  const peons = [];
  const maxSize = 5;
  for (let i = 0; i < maxSize; i++) {
    for (let j = 0; j < maxSize; j++) {
      const counter = i * maxSize + j;
      if (counter >= state.players.length) break;
      const currPlayer = state.players[counter];
      const peon = (
        <Draggable
          defaultPosition={{ x: -(100 * i), y: -80 + 20 * i }}
          grid={[100, 100]}
          scale={1}
          // onDragEnd={(elem, x, y, e) => {
          //   console.log(elem)
          //   console.log(x)
          //   console.log(y)
          //   console.log(e)
          // }}
        >
          <Avatar
            style={{
              backgroundColor: currPlayer.color,
              height: "20px",
              width: "20px",
              fontSize: "12px",
            }}
          >
            {currPlayer.initials}
          </Avatar>
        </Draggable>
      );
      peons.push(peon);
    }
  }

  const listItems = state.players.map((p, index) => {
    return (
      <ListItem className="players">
        <div
          className="delete-button"
          onClick={() => {
            setState({
              ...state,
              players: state.players.filter((pl) => pl.name !== p.name),
            });
          }}
        >
          x
        </div>
        &nbsp;{index + 1}.&nbsp;
        <Avatar
          style={{
            backgroundColor: p.color,
            height: "20px",
            width: "20px",
            fontSize: "12px",
          }}
        >
          {p.initials}
        </Avatar>
        &nbsp; - &nbsp;{p.name}
      </ListItem>
    );
  });

  const handleAddPlayer = () => {
    if (state.addPlayerName === "") return;
    if (!!state.players.find((p) => p.name === state.addPlayerName)) return;
    const player = {
      name: state.addPlayerName,
      initials: state.addPlayerName.substring(0, 2),
      color: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
      points: 0,
    };
    setState({
      ...state,
      players: [...state.players, player].sort((a, b) => a.points - b.points),
      addPlayerName: initialState.addPlayerName,
    });
  };

  return (
    <>
      <Grid container className="ular-mabok">
        <Popover
          className="ular-mabok-popover"
          open={isPopoverOpen}
          onClose={() => setIsPopoverOpen(false)}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "center",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
        >
          <Typography className="number">
            #{state.currPrompt.boxNumber}
          </Typography>
          <Typography className="text">{state.currPrompt.text}</Typography>
        </Popover>
        <Grid item xs={8}>
          <Grid container item className="top-bar">
            <Grid item xs={10}>
              {/* <Avatar src={logo} className="ular-mabok-logo" /> */}
              <TextField
                className="ular-mabok-input"
                label="Add player"
                placeholder="Insert name here..."
                value={state.addPlayerName}
                margin="normal"
                InputLabelProps={{
                  shrink: true,
                }}
                variant="outlined"
                onChange={(e) => {
                  setState({
                    ...state,
                    addPlayerName: e.target.value,
                  });
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    store.dispatch(
                      playersActions.add({ name: state.addPlayerName })
                    );
                    handleAddPlayer();
                  }
                }}
              />
            </Grid>
            <Grid item xs={2} className="ular-mabok-button-container">
              <Button
                variant="contained"
                color="primary"
                className="ular-mabok-button"
                onClick={() => {
                  store.dispatch(
                    playersActions.add({ name: state.addPlayerName })
                  );
                  handleAddPlayer();
                }}
              >
                Add Player
              </Button>
            </Grid>
          </Grid>
          <Grid item>
            <GridList
              cols={8}
              className="ular-mabok-board"
              style={{ margin: "auto" }}
            >
              {boxes}
              {peons}
            </GridList>
          </Grid>
        </Grid>
        <Grid
          item
          container
          xs={2}
          style={{ paddingLeft: "10px" }}
          className="sidebar"
        >
          <Grid item container xs={12} className="dice-roll">
            <Grid className="title" xs={12}>
              Roll Me!
            </Grid>
            <Grid className="title" xs={12} onClick={() => rollDice()}>
              {state.currDiceIndex === null ? (
                "🤔"
              ) : (
                <img
                  alt={`dice face with ${state.currDiceIndex} dots.`}
                  src={dices[state.currDiceIndex]}
                  className="dices"
                />
              )}
            </Grid>
          </Grid>
          <Grid className="prompt">
            <Box className="number">#{state.currPrompt.boxNumber}</Box>
            <Box className="content">{state.currPrompt.text}</Box>
          </Grid>
          <Grid className="logo">
            <img alt="logo" src={logo} />
          </Grid>
        </Grid>
        <Grid
          item
          container
          xs={2}
          style={{ paddingLeft: "10px" }}
          className="sidebar"
        >
          <Grid item xs={12} className="leaderboard">
            <List
              subheader={
                <ListSubheader className="subheader">Players</ListSubheader>
              }
            >
              {listItems}
            </List>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};
