Alpine.store('terrain', {
  features: [],
});

// List of terrain classes which may be created
const terrainClasses = [
  SettlementOfOrder,
  SteadfastSanctum,
  SinisterStructure,
  Hill,
  Building,
  MysteriousForest,
  Obstacle,
  // MysteriousRiver,
  // MagicalMystery,
  // Marsh,
  // EncampmentOfDestruction,
]

// D6+4 pieces of terrain upon the battlefield
const numberOfTerrain = rollD6('D6+4 Terrain Pieces') + 4;
skipLogLine();
log(`Rolling for ${numberOfTerrain} pieces of terrain...`);

// List of chosen terrain objects
const chosenTerrain = [];

// Roll for each terrain piece
for (let i = 0; i < numberOfTerrain; i++) {
  // The roll is a roll of 2d6
  // The first index in the list is treated as 2 instead of 0
  // Any number that exceeds the length of the list is treated as the last index
  const roll = rollD6s(2, '2d6 on the Random Terrain Table').reduce((a, b) => a + b, 0);
  const index = roll - 2 < terrainClasses.length ? roll - 2 : terrainClasses.length - 1;
  // Get the terrain class from the index
  const TerrainClass = terrainClasses[index];
  const terrainInstance = new TerrainClass();
  chosenTerrain.push(terrainInstance);
}

// Update the Alpine store with the chosen terrain
Alpine.store('terrain', {
  features: chosenTerrain,
});