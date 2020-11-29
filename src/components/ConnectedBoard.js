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
import { macroActions } from "../actionCreators/actionCreators";
import { prompts } from "../constants/prompts";
import { gameActions, playersActions, GAME_STATE } from "../reducers/root";
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

function mapPositionToTileNumber(id, dimensionSize) {
  const totalTiles = dimensionSize * dimensionSize;
  let count = totalTiles - id;
  count +=
    Math.floor((totalTiles - id - 1) / 8) % 2 === 0
      ? -dimensionSize + (id % dimensionSize) * 2 + 1
      : 0;
  return count;
}

function mapTileNumberToCoordinates(tileNumber, dimensionSize, gridSize) {
  tileNumber -= 1; // make it zero-based index.

  let x = 0; // Start from left.
  if (tileNumber % (dimensionSize * 2) < dimensionSize) {
    // If Odd row,
    x += tileNumber % dimensionSize; // Move from left to right.
  } else {
    x += dimensionSize - (tileNumber % dimensionSize); // Move from right to left.
  }

  let y = dimensionSize - 1;
  y -= Math.floor(tileNumber / dimensionSize); // Move from bottom to top by "factor" steps.
  return { x: x * gridSize, y: y * gridSize };
}

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
  const playersState = useSelector((state) => state.game.playersState);
  const gameState = useSelector((state) => state.game.state);

  // useEffect(() => {
  //   dispatch(macroActions.simulateAGame());
  // }, []);

  useEffect(() => {
    if (promptNumber) {
      setIsPopoverOpen(true);
    }
  }, [promptNumber]);

  const totalTiles = DIMENSION_SIZE * DIMENSION_SIZE;
  const boxes = new Array(totalTiles).fill({}).map((_, id) => {
    return (
      <GridListTile
        id={mapPositionToTileNumber(id, DIMENSION_SIZE)}
        classes={{
          root: "ular-mabok-box",
          tile: "ular-mabox-box-tile",
        }}
      >
        {Object.entries(playersState)
          .filter(
            ([_, playerState]) =>
              playerState.position ===
              mapPositionToTileNumber(id, DIMENSION_SIZE)
          )
          .map(([playerId, _]) => {
            const player = players.find((p) => p.id === playerId);
            return (
              <Draggable grid={[100, 100]}>
                <Avatar
                  style={{
                    backgroundColor: player.color,
                    height: "30px",
                    width: "30px",
                    fontSize: "12px",
                    margin: "auto",
                  }}
                >
                  {player?.name.substring(0, 2)}
                </Avatar>
              </Draggable>
            );
          })}
      </GridListTile>
    );
  });

  // const peons = [];
  // const maxSize = 5;
  // for (let i = 0; i < maxSize; i++) {
  //   for (let j = 0; j < maxSize; j++) {
  //     const counter = i * maxSize + j;
  //     if (counter >= players.length) break;
  //     const currPlayer = players[counter];
  //     const peon = (
  //       <Draggable
  //         defaultPosition={{ x: -(100 * i), y: -80 + 20 * i }}
  //         grid={[100, 100]}
  //         scale={1}
  //       >
  //         <Avatar
  //           style={{
  //             backgroundColor: currPlayer.color,
  //             height: "20px",
  //             width: "20px",
  //             fontSize: "12px",
  //           }}
  //         >
  //           {currPlayer?.name?.substring(0, 2)}
  //         </Avatar>
  //       </Draggable>
  //     );
  //     peons.push(peon);
  //   }
  // }

  // const peons = Object.entries(playersState).map(
  //   ([playerId, playerState], i) => {
  //     const player = players.find((player) => player.id === playerId);
  //     const coordinates = mapTileNumberToCoordinates(
  //       playerState.position,
  //       DIMENSION_SIZE,
  //       100
  //     );
  //     return (
  //       <Draggable defaultPosition={{
  //         x: coordinates.x,
  //         y: coordinates.y,
  //       }} grid={[100, 100]} scale={1}>
  //         <div
  //           style={{
  //             backgroundColor: player.color,
  //             height: "20px",
  //             width: "20px",
  //             fontSize: "12px",
  //             textAlign: "center",
  //           }}
  //         >
  //           {player?.name?.substring(0, 2)}
  //         </div>
  //       </Draggable>
  //     );
  //   }
  // );

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
          // onClose={() => setIsPopoverOpen(false)}
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
                      macroActions.addAndRegisterPlayer({
                        name: addPlayerNameInputValue,
                        color: `#${Math.floor(
                          Math.random() * 16777215
                        ).toString(16)}`,
                      })
                    );
                    setAddPlayerNameInputValue("");
                  }
                }}
              />
            </Grid>
            <Grid item xs={2} className="ular-mabok-button-container">
              <Button
                variant="contained"
                color="primary"
                className="ular-mabok-button"
                disabled={addPlayerNameInputValue === ""}
                onClick={() => {
                  store.dispatch(
                    macroActions.addAndRegisterPlayer({
                      name: addPlayerNameInputValue,
                      color: `#${Math.floor(Math.random() * 16777215).toString(
                        16
                      )}`,
                    })
                  );
                  setAddPlayerNameInputValue("");
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
            <Grid className="title" xs={12} minHeight="50px">
              {!diceValue ? (
                gameState === GAME_STATE.NOT_STARTED ? (
                  "🎉"
                ) : (
                  "🤔"
                )
              ) : (
                <img
                  alt={`dice face with ${diceValue} dots.`}
                  src={dices[diceValue - 1]}
                  className="dices"
                />
              )}
            </Grid>
            <Grid xs={12} container alignItems="center" justify="center">
              {gameState === GAME_STATE.NOT_STARTED ? (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    store.dispatch(macroActions.startNewGame());
                  }}
                >
                  Start the game
                </Button>
              ) : (
                <>
                  <Typography variant="overline">
                    It's {activePlayer?.name}'s turn.
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    margin="auto"
                    style={{ visibility: !diceValue ? "visible" : "hidden" }}
                    onClick={() => dispatch(macroActions.executeATurn())}
                  >
                    Roll
                  </Button>
                </>
              )}
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
