class TerrainFeature {
  /**
   * @param {string} name 
   * @param {string} description 
   * @param {string} rules 
   */
  constructor(name = 'Undefined', description = 'No description available.', rules) {
    /** @type {string} The name of the terrain feature. */
    this.name = name;

    /** @type {string} The description of the terrain feature. */
    this.description = description;

    /** @type {string?} The rules associated with the terrain feature. */
    this.rules = rules;

    /** @type {boolean} Indicates if the feature has a subtype. */
    this.hasSubtype = false;
    /** @type {TerrainFeature?} The subtype of the terrain feature, if applicable. */
    this.subtype = null;

    /** @type {boolean} Indicates if the feature has children. */
    this.hasChildren = false;
    /** @type {TerrainFeature[]?} The children of the terrain feature. */
    this.children = null;

    /** @type {boolean?} "mysterious" terrain do not automatically choose their subtype - a button is created to do so. */
    this.mysterious = false;
  }

  /**
   * Resolves mysterious terrain features, giving them a subtype.
   */
  resolve() {
    throw new Error('resolve() method not implemented for this terrain feature.');
  }
}

class SettlementOfOrder extends TerrainFeature {
  constructor() {
    super('Settlement of Order', 'D3 buildings and D3 sets of obstacles, plus one roll on the Steadfast Sanctum part of the chart.');
    this.hasChildren = true;

    // Roll D3s for number of buildings and obstacles
    const numBuildings = rollD3('D3 Buildings');
    const numObstacles = rollD3('D3 Obstacles');

    // Generate children for the settlement
    this.children = [];

    // Generate buildings
    for (let i = 0; i < numBuildings; i++) {
      const building = new Building();
      this.children.push(building);
    }

    // Generate obstacles
    for (let i = 0; i < numObstacles; i++) {
      const obstacle = new Obstacle();
      this.children.push(obstacle);
    }

    // Generate steadfast sanctum
    const steadfastSanctum = new SteadfastSanctum();
    this.children.push(steadfastSanctum);
  }
}

class SteadfastSanctum extends TerrainFeature {
  constructor() {
    super('Steadfast Sanctum', 'Roll a further D6:');
    this.hasSubtype = true;

    const options = [
      new GrailChapel(),
      new AcropolisOfHeroes(),
      new WizardsTower(),
      new SigmariteShrine(),
      new ElvenWaystone(),
      new DwarfBrewhouse(),
    ];
    const randomIndex = rollD6('D6, Steadfast Sanctum Subtype') - 1;
    this.subtype = options[randomIndex];
    log(`Result: ${this.subtype.name}`);
  }
}

//#region Steadfast Sanctums

class GrailChapel extends TerrainFeature {
  constructor() {
    super(
      'Grail Chapel',
      'Grail Chapels can be found throughout the world. They are built upon sites where Bretonnian Knights have encountered the Lady of the Lake. Though Grail Chapels are often seemingly abandoned and ruined, the power of the Lady permeates every stone, focusing energies of renewal and rebirth.',
      'All units belonging to an army from the Forces of Order within 6" of a Grail Chapel have the Regeneration (6+) special rule. Bretonnian units within 6" of a Grail Chapel also have the Stubborn special rule.'
    );
  }
}

class AcropolisOfHeroes extends TerrainFeature {
  constructor() {
    super(
      'Acropolis of Heroes',
      'This ancient place was built long ago - perhaps it was even raised by the Old Ones themselves. Amongst its walls, half-buried by moss and rubble, lie the statues of fallen kings and heroes whose bold essence lingers on.',
      'Units within 6" of the Acropolis of Heroes are Stubborn. A unit garrisoning the Acropolis of Heroes gets +1 to hit in close combat.'
    );
  }
}

class WizardsTower extends TerrainFeature {
  constructor() {
    super(
      'Wizards Tower',
      'Wizards are solitary folk, little able to abide the simplistic minds of the mundane multitudes. Little wonder therefore that the mightiest wizards construct great towers to serve as lodging, library and stronghold.',
      'A Wizard who is within 3" of the tower at the start of the Magic phase is assumed to ransack the tower\'s library in search of additional spells - he is treated as knowing all the spells from his chosen lore(s) of magic for that phase. If more than one Wizard is within 3", randomly choose which one has control of the tower at the start of each Magic phase (no room can hold two wizardly egos in search of knowledge).'
    );
  }
}

class SigmariteShrine extends TerrainFeature {
  constructor() {
    super(
      'Sigmarite Shrine',
      'Sigmar Heldenhammer fought many battles to defend the nascent Empire from the forces of destruction. Though Sigmar has long since passed, the folk of the Empire still believe that he watches over his land. This might be thought mere superstition, save for the fact that evil creatures seem rather more vulnerable when they draw near to a Sigmarite Shrine.',
      'Any models belonging to an army from the Forces of Destruction must re-roll successful ward saves if they are within 6" of the Sigmarite Shrine.'
    );
  }
}

class ElvenWaystone extends TerrainFeature {
  constructor() {
    super(
      'Elven Waystone',
      'There are countless Elven Waystones scattered throughout the world, ancient monuments to the once globe-spanning glory of the children of Ulthuan. Yet these towering edifices are more than mere markers of a sundered past. It is through the Waystones that the Elves siphon excess magical energy from the world. A learned enough wizard can tap into the Waystone\'s magical current and thus purloin its energies for his own use.',
      'Any Wizard within 6" of an Elven Waystone adds +1 to his channelling attempts.'
    );
  }
}

class DwarfBrewhouse extends TerrainFeature {
  constructor() {
    super(
      'Dwarf Brewhouse',
      'Dwarf ale is by far the most famous and sought after beverage in the whole of the Warhammer world. Indeed, entire armies have been known to make a detour to a brewery in order to purchase (or, more normally, acquire by force of arms) a supply of heady Dwarf ale. It is little surprise, therefore, that most Dwarfs go to great lengths to fortify their brewhouses, and are careful to place several barrels of cheap, but highly intoxicating ale, beyond the walls as soon as a marching army enters view.',
      'All units within 6" of a Dwarf Brewhouse have the Immune to Psychology and Stubborn special rules (the rich blend of hops, malts and secret ingredients renders them almost totally insensate to mortal fears). Dwarf units within 6" of the brewhouse are so fanatically defensive of it that they are Unbreakable, but must first pass a Leadership test, with a -3 modifier, if they want to move out of range of the building\'s effects.'
    );
  }
}

//#endregion

class SinisterStructure extends TerrainFeature {
  constructor() {
    super(
      'Sinister Structure',
      'Roll a further D6:',
    );
    this.hasSubtype = true;

    const options = [
      new AltarOfKhaine(),
      new CharnelPit(),
      new BaneStone(),
      new HauntedMansion(),
      new IdolOfGork(),
      new TowerOfBlood(),
    ]
    const randomIndex = rollD6('D6, Sinister Structure Subtype') - 1;
    this.subtype = options[randomIndex];
    log(`Result: ${this.subtype.name}`);
  }
}

//#region Sinister Structures

class AltarOfKhaine extends TerrainFeature {
  constructor() {
    super(
      'Altar of Khaine',
      'Though his worship is now relegated chiefly to the chill land of Naggaroth, many altars consecrated to the Elven god of murder remain throughout the world. Warriors who fight in Khaine\'s shadow do so with bloodlust awakened in their souls.',
      'All units within 6" of an Altar of Khaine are subject to the rules for Frenzy - as soon as a unit moves out of range, the Frenzy is lost.',
    );
  }
}

class CharnelPit extends TerrainFeature {
  constructor() {
    super(
      'Charnel Pit',
      'In a world of unremitting war, a decent burial is something granted to only the luckiest. For the remainder, eternal repose begins in a mass grave, with enough stones atop to deter wild beasts, and enough icons to draw down the blessings of various gods of the dead. Alas, most such charnel pits attract Necromancers and other dark sorcerers like, well, vultures to carrion. By the time these foul folk have finished with the pit\'s contents, it is sure to be little more than a blood - slicked pit, strewn with body parts and a lingering unholy taint that instills fear in all but the bravest warriors.',
      'All units within 6" of the charnel pit suffer a -1 penalty to their Leadership. Undead units within 6" of the charnel pit have the Regeneration (6+) special rule to represent their easy access to replacement parts.',
    )
  }
}

class BaneStone extends TerrainFeature {
  constructor() {
    super(
      'Bane Stone',
      'Not even the most learned of scholars knows the origins of the Bane Stones. Some folk maintain that the Beastmen raised them in tribute to their blasphemous gods, others that they are jagged shards of magic made manifest through careless sorcery. Whatever the truth, to battle in a Bane Stone\'s shadow is to invite swift death, for the stones are hungry and fresh souls are their food.',
      'Hits made against units within 6" of a Bane Stone have a +1 bonus to wound.'
    );
  }
}

class HauntedMansion extends TerrainFeature {
  constructor() {
    super(
      'Haunted Mansion',
      'Many an abandoned tower or mansion was once the abode of a Necromancer, whose dark sorceries could only be practised in secret. The Necromancer may be long gone, but the poltergeists and revenants remain - as any who enter will doubtless discover.',
      'A haunted mansion is normally a building of some kind, but there\'s no reason why it can\'t be a ruin, or a cave. At the end of the Shooting phase, all units within 6" of the Haunted Mansion suffers D6 Strength 1 hits to represent the spectral strikes of the mansion\'s guardians. Due to the ghostly nature of these attacks, armour saves cannot be taken against them. A unit inside the haunted mansion causes Fear.'
    );
  }
}

class IdolOfGork extends TerrainFeature {
  constructor() {
    super(
      'Idol of Gork (or possibly Mork)',
      'Prior to a great battle, Orcs raise crude idols of their brutish gods so that their deities might find amusement in the forthcoming destruction. Many of these idols are crafted from mud and dung, and so are quickly worn away by the elements. Some, though, are roughly hewn from boulders or the defaced statues of other races. These can stand against the weather for centuries, allowing Mork (or possibly Gork) an uninterrupted grandstand view of the passing centuries\' carnage.',
      'Any warriors fighting under the grim gaze of Mork (or possibly Gork) are infused with the greenskin gods\' lust for battle. Units that start the turn within 6" of the Idol can re-roll a failed charge distance roll.'
    );
  }
}

class TowerOfBlood extends TerrainFeature {
  constructor() {
    super(
      'Tower of Blood',
      'The walls of this tower constantly ooze pulsing gore. The unnatural stench has a profound effect upon even the most feeble of fighters, engorging bloodlust and so transforming them into voracious slaughterers.',
      'Units within 6" of the Tower of Blood have the Hatred special rule. Units from the Forces of Destruction within 6" of the Tower of Blood also have the Frenzy special rule - as soon as a unit moves out of range, the Hatred/Frenzy is lost.'
    );
  }
}

//#endregion

class Hill extends TerrainFeature {
  constructor() {
    super(
      'Hill',
      'Hills are natural outcrops of rock and earth. Few pieces of terrain are as strategically important as a hill. From its slopes your troops can rain missile fire down upon the foe, or form a battleline upon its crest.',
    );
    this.hasSubtype = true;

    const options = [
      new OrdinaryHill(),
      new OrdinaryHill(),
      new OrdinaryHill(),
      new TempleOfSkulls(),
      new ScreeSlope(),
      new AnvilOfVaul(),
    ]
    const randomIndex = rollD6('D6, Hill Subtype') - 1;
    this.subtype = options[randomIndex];
    log(`Result: ${this.subtype.name}`);
  }
}

//#region Hills

class OrdinaryHill extends TerrainFeature {
  constructor() {
    super(
      'Ordinary Hill',
      'Hills are natural outcrops of rock and earth. Few pieces of terrain are as strategically important as a hill. From its slopes your troops can rain missile fire down upon the foe, or form a battleline upon its crest.',
    );
  }
}

class TempleOfSkulls extends TerrainFeature {
  constructor() {
    super(
      'Temple of Skulls',
      'There are many unholy sites dedicated to the worship of the Chaos Gods and this is but one of them. Ruin and war may have laid it waste, have scattered its trophies and tumbled its grim statues, but the gazes of the Dark Gods still rest upon its battered stones, hungrily seeking a new champion to bend to their perverse amusements...',
      'At the beginning of each player turn, any character or champion on the Temple of Skulls can choose to embrace the favour of the Chaos Gods. If he does, roll a D6. On a roll of 2-6, one randomly chosen characteristic increases by D3 points. On a 1, the Chaos Gods take his soul (or his purehearted comrades turn on him) - remove the model as a casualty with no saves of any kind allowed.',
    );
  }
}

class ScreeSlope extends TerrainFeature {
  constructor() {
    super(
      'Scree Slope',
      'The slopes of this hill are covered with loose shards and splinters of rock, making the going incredibly treacherous. Many approaches to Dwarf holds are flanked by such slopes, providing an extra layer to their defence.',
      'Models charging, marching, fleeing, pursuing or overrunning up, down or through a scree slope must take a Dangerous Terrain test.'
    );
  }
}

class AnvilOfVaul extends TerrainFeature {
  constructor() {
    super(
      'Anvil of Vaul',
      'The legends of Ulthuan tell that when the Daemons first broke into the world, the smith-god Vaul descended from the heavens. It is said that he travelled to every corner of the globe, raising stone anvils from the living rock upon which he crafted blades of great potency, which the Elves used to defend their realms. Though the weapons and their wielders have long since gone, many of the anvils remain. Mere proximity to an Anvil of Vaul bestows a warrior\'s weapons with incredible enchantment.',
      'Any unit within 6" of an Anvil of Vaul has both magical attacks and the Flaming Attacks special rule.'
    );
  }
}

//#endregion

class Building extends TerrainFeature {
  constructor() {
    super('Building', 'A watchtower, mansion or other similar \'ordinary\' building.');
  }
}

class MysteriousForest extends TerrainFeature {
  constructor() {
    super(
      'Mysterious Forest',
      'Roll a further D6:',
      'Soft cover. Dangerous Terrain to Cavalry (incl Monstrous) and Chariots that march, charge, overrun, flee, or pursue through. Also Dangerous when beginning or ending Flying. Inside, non-stubborn units are never steadfast, skirmishers and lone infantry are always stubborn.'
    );
    this.mysterious = true;
  }

  resolve() {
    this.hasSubtype = true;
    this.mysterious = false; // Set to false to indicate that the subtype has been resolved
    const options = [
      new Forest(),
      new AbyssalWood(),
      new BloodForest(),
      new FungusForest(),
      new VenomThicket(),
      new Wildwood(),
    ]
    skipLogLine();
    const randomIndex = rollD6('D6 Resolving Mysterious Forest') - 1;
    this.subtype = options[randomIndex];
    log(`Result: ${this.subtype.name}`);
  }

}

//#region Mysterious Forests

class Forest extends TerrainFeature {
  constructor() {
    super(
      'Forest',
      'Forests are excellent places for troops to lurk in ambush - the choking foliage offers a great deal of protection against missile fire.',
    );
  }
}

class AbyssalWood extends TerrainFeature {
  constructor() {
    super(
      'Abyssal Wood',
      'A cloud of malice lies over this wood, provoking irrational fears and dark imaginings in the minds of those that enter.',
      'A unit with the majority of its models within an Abyssal Wood causes Fear.'
    );
  }
}

class BloodForest extends TerrainFeature {
  constructor() {
    super(
      'Blood Forest',
      'Though these trees slumber fitfully through the cycles of the world, nearby use of magic infuses them with bloodlust...',
      'Whenever a spell is successfully cast by (or at) a model in a blood forest, all units wholly or partially within it suffer D6 Strength 4 hits as the trees go into a feeding frenzy. When any hits have been resolved, the Blood Forest moves 2D6" in a random direction, moving around any intervening terrain features by the shortest route. This does not move the models that were in the Blood Forest, it simply \'walks\' off, and leaves them behind.'
    );
  }
}

class FungusForest extends TerrainFeature {
  constructor() {
    super(
      'Fungus Forest',
      'These trees are infested by a chromatic array of mushrooms. It\'s best not to breathe in too deeply...',
      'Any unit at least partially within the Fungus Forest is subject to the rules for Stupidity. Any Goblin unit at least partially within the Fungus Forest is also Stubborn.'
    );
  }
}

class VenomThicket extends TerrainFeature {
  constructor() {
    super(
      'Venom Thicket',
      'Poisonous creatures abound within. Provided you do not succumb to it first, their venom can be used against the foe.',
      'Any model in a Venom Thicket has the Poisoned Attacks special rule (applies to close combat attacks only). However, any model moving through a Venom Thicket must take a Dangerous Terrain test, to represent their attempt to fend off the venomous critters within.'
    );
  }
}

class Wildwood extends TerrainFeature {
  constructor() {
    super(
      'Wildwood',
      'To walk beneath the twisted boughs of a Wildwood is folly indeed, for the trees are wrathful.',
      'Roll for any unit at least partially within the Wildwood at the end of the Movement phase. On a 4+, the unit suffers D6 Strength 4 hits',
    );
  }
}

//#endregion

class Obstacle extends TerrainFeature {
  constructor() {
    super('Obstacle', 'Three 6" sections of one of the following obstacles, roll a D6:');
    this.hasSubtype = true;

    const options = [
      new Fence(),
      new Wall(),
      new BlazingBarricade(),
      new BlessedBulwark(),
      new GhostFence(),
    ];

    // Roll a D6 to determine the random type (index) - 6 is a reroll
    let randomIndex = rollD6('D6, Obstacle Subtype') - 1;
    // If the roll is 6, reroll
    while (randomIndex === 5) {
      randomIndex = rollD6('D6, Obstacle Subtype (reroll)') - 1;
    }
    this.subtype = options[randomIndex];
    log(`Result: ${this.subtype.name}`);
  }

}

//#region Obstacles
class Fence extends TerrainFeature {
  constructor() {
    super(
      'Fence',
      'Fences are gnarled and twisted constructions of wood and lath. Though fences are chiefly designed to keep herd animals in a particular location, determined warriors can also use a fence as a rough bulwark in order to keep enemies out!',
      'Fences are obstacles that grant soft cover to units behind them, and a -1 To Hit modifier to charging models in base contact with them.'
    );
  }
}

class Wall extends TerrainFeature {
  constructor() {
    super(
      'Wall',
      'Walls are a common sight, serving as boundaries between fields, estates and even burial sites. Though such a wall is seldom more than chest-height, it makes for an incredibly effective impromptu defensive position, and can save the warriors sheltering in its lee from otherwise fatal encounters with arrows, crossbow bolts and buckshot.',
      'Walls are obstacles that grant hard cover to units behind them, and a -1 To Hit modifier to charging models in base contact with them.'
    );
  }
}

class BlazingBarricade extends TerrainFeature {
  constructor() {
    super(
      'Blazing Barricade',
      'The original blazing barricades were magical obstacles called into existence by High Elf mages as they fought for survival during the initial daemonic invasions. Though that was now thousands of years ago, the magic that created the blazing barricades still dwells within the ground.',
      'Blazing barricades grant soft cover to units behind them. If a unit completes a charge against a defended blazing barricade, it immediately suffers one Strength 4 hit on each of its models in contact with the obstacle.'
    );
  }
}

class BlessedBulwark extends TerrainFeature {
  constructor() {
    super(
      'Blessed Bulwark',
      'It is common practice in the Empire for a Warrior Priest to bless any wall which might have to serve in the battle against the foul creatures of Chaos. Such enchantment lingers on long after it takes root, and even endures through the destruction of the wall itself. Many farming fields and fortress walls in the Empire are bounded by walls constructed of stolen fragments from the blessed bulwarks, and retain a portion of that power.',
      'Blessed bulwarks are obstacles that grant hard cover to units behind them, and a -1 To Hit modifier to charging models in base contact with them. In addition to this, models from the Forces of Destruction (see the Allied Armies) that are in base contact with the obstacle must halve their Initiative.'
    );
  }
}

class GhostFence extends TerrainFeature {
  constructor() {
    super(
      'Ghost Fence',
      'A Ghost Fence is a barrier with little physical substance - merely a series of poles or posts upon which are hung accursed fetishes and totems to which daemonic or Undead spirits have been bound with forbidden spells. Only a brave or foolish warrior crosses a ghost fence without good cause - or without powerful protective wards.',
      'Ghost Fences are obstacles that grant soft cover to units behind them. A unit that is defending a Ghost Fence causes Fear in the first round of any close combat.'
    );
  }
}
//#endregion

class MysteriousRiver extends TerrainFeature {
  constructor() {
    super(
      'Mysterious River',
      'Roll a further D6:',
      'Cannot be Marched through. Units even partially in the river cannot be steadfast and cannot claim rank bonus.'
    );
    this.mysterious = true;
  }

  resolve() {
    this.hasSubtype = true;
    this.mysterious = false; // Set to false to indicate that the subtype has been resolved
    const options = [
      new River(),
      new BoilingFlood(),
      new NecroticOoze(),
      new RagingTorrent(),
      new RiverOfBlood(),
      new RiverOfLight(),
    ];
    skipLogLine();
    const randomIndex = rollD6('D6 Resolving Mysterious River') - 1;
    this.subtype = options[randomIndex];
    log(`Result: ${this.subtype.name}`);
  }
}

//#region Mysterious Rivers

class River extends TerrainFeature {
  constructor() {
    super(
      'River',
      'The reassuring and impeding flow of a river can help an army protect its flank or otherwise slow the enemy advance. Launching an assault across a river is no easy task, and often the fords, bridges and other crossing points become crucial objectives for the opposing armies.',
    );
  }
}

class BoilingFlood extends TerrainFeature {
  constructor() {
    super(
      'Boiling Flood',
      'This river\'s waters are boiling with incredible fury - it\'s best to cross quickly, lest you never leave the river at all.',
      'Any model at least partially in the boiling flood at the end of any turn suffers a Strength 4 hit with no armour saves allowed. Models that are immune to Flaming Attacks do not suffer from this effect.',
    );
  }
}

class NecroticOoze extends TerrainFeature {
  constructor() {
    super(
      'Necrotic Ooze',
      'Only the stench of this thick and lifeless sludge can compete with its toxic virulence. Those crossing this river had best hold their breath.',
      'Necrotic ooze counts as dangerous terrain for all models. Additionally, a unit that moves through necrotic ooze gains the Poisoned Attacks special rule until the end of the following player turn, so vile are the waters that cling to their blades.',
    );
  }
}

class RagingTorrent extends TerrainFeature {
  constructor() {
    super(
      'Raging Torrent',
      'The icy rivers of the high mountains run clear, pure and very swift indeed.',
      'A raging torrent is Dangerous Terrain. However, such are the invigorating effects of the icy waters that any models that are in the river (or left the river earlier in the turn) have +3 Initiative.',
    );
  }
}

class RiverOfBlood extends TerrainFeature {
  constructor() {
    super(
      'River of Blood',
      'When the rivers of the world turn to blood it is a sign that Khorne has regained ascendancy at the head of the unholy pantheon of the Realm of Chaos. The time of the Blood God has come!',
      'A unit that moves or charges through a River of Blood is counted as causing Fear until the end of the following player turn, so ghastly is their blood-slicked appearance.',
    );
  }
}

class RiverOfLight extends TerrainFeature {
  constructor() {
    super(
      'River of Light',
      'This is no mere river, but a swirling and seething mass of Light Magic.',
      'When a unit enters a River of Light, it is immediately the target of a randomly chosen Light Magic spell. The spell is automatically cast and cannot be dispelled. If the spell has a choice of different casting values, it is assumed to be cast at the lower value.',
    );
  }
}

//#endregion

class MagicalMystery extends TerrainFeature {
  constructor() {
    super(
      'Magical Mystery',
      'Roll a further D6:',
    );
    this.hasSubtype = true;

    const options = [
      new SinisterStatue(),
      new ArcaneRuins(),
      new NehekharanSphynx(),
      new SorcerousPortal(),
      new WyrdingWell(),
      new MagicCircle(),
    ];
    const randomIndex = rollD6('D6, Magical Mystery Subtype') - 1;
    this.subtype = options[randomIndex];
    log(`Result: ${this.subtype.name}`);
  }
}

//#region Magical Mysteries

class SinisterStatue extends TerrainFeature {
  constructor() {
    super(
      'Sinister Statue',
      'Witless watchmen, set to stand sentinel over secret shrines by an ancient and unknown force, these sinister statues take exception to interlopers in a most forceful fashion.',
      'At the start of each player turn, roll a dice for every unit within 6" of the Sinister Statue. On a 4 or more, nothing happens – the statue either doesn\'t notice the unit, or recognises it as an ally of its forgotten master. On a 1-3, beams of light blaze out of its stone eyes – the unit suffers D6 Strength 4 hits.'
    );
  }
}

class ArcaneRuins extends TerrainFeature {
  constructor() {
    super(
      'Arcane Ruins',
      'The stones of fallen temples still resonate with magical energy centuries after their final celebrants crumbled to dust.',
      'Any wizard within 6" of an arcane ruin can choose to roll up to four dice when channelling, rather than one. However, if three or more dice come up as 6s, the wizard must immediately roll on the Miscast table.'
    );
  }
}

class NehekharanSphynx extends TerrainFeature {
  constructor() {
    super(
      'Nehekharan Sphynx',
      'Long ago, the rulers of Nehekhara bound the trickster spirits of the deserts into great temples. Legend tells that those who entreat a Sphynx receive great power – if they can quench the spirit\'s thirst for trickery and deception.',
      'At the start of each player turn, the player whose turn it is can choose one of his characters within 6" of the Nehekharan Sphynx to challenge the spirit to a riddling contest. The challenger must take an Initiative test. If the test is failed, the Sphynx devours part of the challenger\'s soul and the model suffers a wound, with no armour saves allowed.If the test is passed, the challenger receives one of the following special rules, determined randomly, for the rest of the game: Devastating Charge, Heroic Killing Blow or Loremaster(Death) – this last one has no benefit to non - Wizards(i.e.only Wizards can actually use the spells!) but that doesn\'t stop the Sphynx bestowing it inappropriately.'
    );
  }
}

class SorcerousPortal extends TerrainFeature {
  constructor() {
    super(
      'Sorcerous Portal',
      'A sorcerous portal is prone to appear where certain contours of hill and valley funnel the Winds of Magic in unexpected ways. Many are caged and harnessed by ambitious sorcerers, but wood and stone cannot easily contain raw magic.',
      'At the start of the Magic phase, after power and dispel dice have been generated, but before spells are cast, the sorcerous portal belches forth energy in the form of a spell. Roll 2D6 on the table below each time to see what spell is cast.'
    );
  }
}

class WyrdingWell extends TerrainFeature {
  constructor() {
    super(
      'Wyrding Well',
      'It is said that Wyrding Wells are set upon sites where the blood of the world bubbles to the surface. This amber liquid has magical, if unpredictable, properties and is a prized ingredient in many potions and elixirs.',
      'Providing it is not in combat, a unit within 3" can drink from the well at the end of its Movement phase. Roll a D6 on the following table to discover the outcome of the unit\'s incautious imbibing: 1. Magical Poisoning: Models in the unit cannot make any voluntary action (including shooting, casting spells, channelling, using magic items and so on) until the start of the following turn, whilst copious vomiting ensues. 2-4. Ailments Banished: The unit immediately recovers 2D6 wounds’ worth of models, as described for the Lore of Life Regrowth spell. 6. The Gift of Oblivion: The coursing earthblood erases all fear and sensation from the minds of the drinkers. The unit is subject to the rules for Stupidity and is Unbreakable for the remainder of the game.'
    );
  }
}

class MagicCircle extends TerrainFeature {
  constructor() {
    super(
      'Magic Circle',
      'Ancient mannish ruins, raised to empower primitive rites, magic circles can dissipate harmful sorcery and offer protection to those nearby.',
      'Units within 6" of the Magic Circle have the Magic Resistance (2) special rule.'
    );
  }
}

//#endregion

class Marsh extends TerrainFeature {
  constructor() {
    super(
      'Marsh',
      'A battle in a marsh can easily end in disaster – the footing is unstable, the mud clings to weapons and as many warriors drown as are hacked apart by the foe. Marshes are therefore best employed as traps to suck your enemy into, rather than bastions from which to fight.',
      'Marshland is dangerous terrain for all units, other than those with the Skirmish special rule. Cavalry, monstrous cavalry and chariots that enter marshland fail their Dangerous Terrain tests on a 1 or 2, rather than a 1.',
    );
    this.hasSubtype = true;

    const options = [
      new EarthbloodMere(),
      new KhemrianQuicksand(),
      new MistWreathedSwamp(),
    ];
    const randomIndex = rollD3('D3, Marsh Subtype') - 1;
    this.subtype = options[randomIndex];
    log(`Result: ${this.subtype.name}`);
  }
}

//#region Marshes

class EarthbloodMere extends TerrainFeature {
  constructor() {
    super(
      'Earthblood Mere',
      'Raw magical power of the lifewind Ghyran bubbles through the waters of this marsh.',
      'Any unit with the majority of its models within the mere has Regeneration (6+).',
    );
  }
}

class KhemrianQuicksand extends TerrainFeature {
  constructor() {
    super(
      'Khemrian Quicksand',
      'The burning desert hides a multitude of traps. Many an unwary warrior has been sucked to his death by the shifting sands of Khemri - the larger the victim, the more certain the fate.',
      'A monster, monstrous infantry or monstrous cavalry model that fails its Dangerous Terrain test for Khemrian Quicksand is removed as a casualty with no saves of any kind allowed.'
    );
  }
}

class MistWreathedSwamp extends TerrainFeature {
  constructor() {
    super(
      'Mist Wreathed Swamp',
      'The vapours of this swamp hang in the chill air, hiding those within from the gaze of their enemy. Yet who knows what horrors lurk within the mist, just waiting to pounce?',
      'If the majority of a unit\'s models are wholly within a mist - wreathed swamp, the unit counts as being in hard cover. However, at the end of each Movement phase, the unit must pass an Initiative test, or have D6 models dragged to their doom by the monstrous Fimir lurking in the mist(the victims are selected in the same manner as the allocation of shooting hits) '
    );
  }
}

//#endregion

class EncampmentOfDestruction extends TerrainFeature {
  constructor() {
    super('Encampment of Destruction', 'D3 buildings, D3 sets of obstacles plus one roll on the Sinister Structure part of the chart.');
    this.hasChildren = true;

    // Roll D3s for number of buildings and obstacles
    const numBuildings = rollD3('D3 Buildings');
    const numObstacles = rollD3('D3 Obstacles');

    // Generate children for the encampment
    this.children = [];

    // Generate buildings
    for (let i = 0; i < numBuildings; i++) {
      const building = new Building();
      this.children.push(building);
    }

    // Generate obstacles
    for (let i = 0; i < numObstacles; i++) {
      const obstacle = new Obstacle();
      this.children.push(obstacle);
    }

    // Generate sinister structure
    const sinisterStructure = new SinisterStructure();
    this.children.push(sinisterStructure);
  }
}
