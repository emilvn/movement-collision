# TODOS

- implementér A\* algorithm til Enemy movement mod spiller

  - Tiles skal have en vægt, således at enemies ikke går igennem walls, walls har en vægt på `Infinity`
  - Board klassen skal have en metode der opdaterer vægtene på tiles baseret på player position
  - Enemy klassen skal have en metode der finder den korteste vej til player med A\* algoritmen
  - i debug mode, vis stien som enemy vil tage hen til spiller

- implementér line of sight for enemies
  - enemies kan kun se spilleren hvis der ikke er noget i vejen
  - enemies kan kun se spilleren hvis de er indenfor en vis afstand

Den sidste commit før afleveringsfristen skal være tagget “HANDIN”
