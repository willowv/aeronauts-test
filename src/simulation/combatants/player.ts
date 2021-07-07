export const maxPlayerHealth = 15;
export const maxPlayerFocus = 12;

export class Player {
  indexPlayer: number;
  indexActor: number;
  indexTargetable: number | null;
  abilityScores: number[];
  focus: number;
  name: string;

  constructor(
    indexPlayer: number,
    indexActor: number,
    indexTargetable: number | null,
    abilityScores: number[],
    focus: number,
    name: string
  ) {
    this.indexPlayer = indexPlayer;
    this.indexActor = indexActor;
    this.indexTargetable = indexTargetable;
    this.abilityScores = [...abilityScores];
    this.focus = focus;
    this.name = name;
  }

  clone(): Player {
    return new Player(
      this.indexPlayer,
      this.indexActor,
      this.indexTargetable,
      this.abilityScores,
      this.focus,
      this.name
    );
  }
}
