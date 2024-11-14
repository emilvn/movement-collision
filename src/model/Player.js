import Character from "./Character.js";

export default class Player extends Character {
  constructor(options) {
    super({
      id: "player",
      ...options,
    });
  }
}
