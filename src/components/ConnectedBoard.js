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
import { useDispatch, useSelector } from "react-redux";
import { asyncThunks } from "../actionCreators/actionCreators";
import { prompts } from "../constants/prompts";
import { gameActions, playersActions } from "../reducers/root";
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

export const Board = (props) => {
  const [addPlayerNameInputValue, setAddPlayerNameInputValue] = useState("");
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const dispatch = useDispatch();
  const diceValue = useSelector((state) => state.game.currentTurn.diceValue);
  const players = useSelector((state) =>
    Object.keys(state.game.playersState).map(
      (playerId) => state.players[playerId]
    )
  );
  const activePlayer = useSelector(
    (state) => state.players[state.game.currentTurn.playerId]
  );
  const promptNumber = useSelector(
    (state) => state.game.currentTurn.promptNumber
  );
  const promptMessage = useSelector(
    (state) => state.board.prompts[promptNumber]
  );

  useEffect(() => {
    dispatch(asyncThunks.simulateAGame());
  }, []);

  useEffect(() => {
    if (promptNumber) {
      setIsPopoverOpen(true);
    }
  }, [promptNumber]);

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
      />
    );
  });

  const peons = [];
  const maxSize = 5;
  for (let i = 0; i < maxSize; i++) {
    for (let j = 0; j < maxSize; j++) {
      const counter = i * maxSize + j;
      if (counter >= players.length) break;
      const currPlayer = players[counter];
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
            {currPlayer?.name?.substring(0, 2)}
          </Avatar>
        </Draggable>
      );
      peons.push(peon);
    }
  }

  const listItems = players.map((p, index) => {
    return (
      <ListItem
        className="players"
        style={{ backgroundColor: activePlayer?.id === p.id && "#71EB46" }}
      >
        &nbsp;{index + 1}.&nbsp;
        <Avatar
          style={{
            backgroundColor: p.color,
            height: "20px",
            width: "20px",
            fontSize: "12px",
          }}
        >
          {p.name.substring(0, 2)}
        </Avatar>
        &nbsp; - &nbsp;{p.name}
      </ListItem>
    );
  });

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
          <Typography className="number">#{promptNumber}</Typography>
          <Typography className="text">{promptMessage}</Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              dispatch(gameActions.nextTurn());
              setIsPopoverOpen(false);
            }}
          >
            Ok, Next Turn
          </Button>
        </Popover>
        <Grid item xs={8}>
          <Grid container item className="top-bar">
            <Grid item xs={10}>
              {/* <Avatar src={logo} className="ular-mabok-logo" /> */}
              <TextField
                className="ular-mabok-input"
                label="Add player"
                placeholder="Insert name here..."
                value={addPlayerNameInputValue}
                margin="normal"
                InputLabelProps={{
                  shrink: true,
                }}
                variant="outlined"
                onChange={(e) => setAddPlayerNameInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    store.dispatch(
                      playersActions.add({
                        name: addPlayerNameInputValue,
                        color: `#${Math.floor(
                          Math.random() * 16777215
                        ).toString(16)}`,
                      })
                    );
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
                    playersActions.add({
                      name: addPlayerNameInputValue,
                      color: `#${Math.floor(Math.random() * 16777215).toString(
                        16
                      )}`,
                    })
                  );
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
            </GridList>
            <ul style={{ zIndex: 2, margin: "auto" }}>{peons}</ul>
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
            <Grid
              className="title"
              xs={12}
              minHeight="50px"
            >
              {!diceValue ? (
                "🤔"
              ) : (
                <img
                  alt={`dice face with ${diceValue} dots.`}
                  src={dices[diceValue - 1]}
                  className="dices"
                />
              )}
            </Grid>
            <Grid xs={12} container alignItems="center" justify="center">
              <Typography variant="overline">
                It's {activePlayer?.name}'s turn.
              </Typography>
              <Button
                variant="contained"
                color="primary"
                margin="auto"
                style={{ visibility: !diceValue ? "visible" : "hidden" }}
                onClick={() => dispatch(asyncThunks.executeATurn())}
              >
                Roll
              </Button>
            </Grid>
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
