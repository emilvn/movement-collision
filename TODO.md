# TODOS

-[x] implementér A\* algorithm til Enemy movement mod spiller

-[x] Tiles skal have en vægt, således at enemies ikke går igennem walls, walls har en vægt på `Infinity` -[x] Enemy klassen skal have en metode der finder den korteste vej til player med A\* algoritmen -[x] i debug mode, vis stien som enemy vil tage hen til spiller

- implementér line of sight for enemies

  - enemies kan kun se spilleren hvis der ikke er noget i vejen
  - enemies kan kun se spilleren hvis de er indenfor en vis afstand

- implementér forskellige hastigheder gennem forskellige terræn

  - terræn skal have en hastigheds værdi, som påvirker enemies movement speed
  - heuristic for A\* skal tage højde for hastigheds værdien

- implementer map vælger

- lav game over screen med restart knap

Den sidste commit før afleveringsfristen skal være tagget “HANDIN”
