export const SUBCLASS_FEATURES = {

  Cleric: {

    "Knowledge Domain": [
      { title: "Blessings of Knowledge", summary: "Gain knowledge-based proficiencies." },
      { title: "Knowledge of the Ages", summary: "Temporary mastery of skills." },
      { title: "Read Thoughts", summary: "Access thoughts and insight." },
      { title: "Potent Spellcasting", summary: "Boost spell damage." },
      { title: "Visions of the Past", summary: "Reveal hidden information from objects." }
    ],

    "Life Domain": [
      { title: "Disciple of Life", summary: "Improve healing spells." },
      { title: "Preserve Life", summary: "Mass healing ability." },
      { title: "Blessed Healer", summary: "Heal yourself when healing others." },
      { title: "Divine Strike", summary: "Extra weapon damage." },
      { title: "Supreme Healing", summary: "Maximum healing output." }
    ],

    "Light Domain": [
      { title: "Warding Flare", summary: "Disrupt enemy attacks." },
      { title: "Radiance of the Dawn", summary: "Area radiant damage." },
      { title: "Improved Flare", summary: "Protect allies." },
      { title: "Potent Spellcasting", summary: "Increase spell damage." },
      { title: "Corona of Light", summary: "Amplify radiant power." }
    ],

    "Nature Domain": [
      { title: "Acolyte of Nature", summary: "Gain nature magic abilities." },
      { title: "Charm Animals and Plants", summary: "Control natural creatures." },
      { title: "Dampen Elements", summary: "Reduce elemental damage." },
      { title: "Divine Strike", summary: "Nature-based attack damage." },
      { title: "Master of Nature", summary: "Control nature forces." }
    ],

    "Tempest Domain": [
      { title: "Bonus Proficiencies", summary: "Improve combat readiness." },
      { title: "Wrath of the Storm", summary: "Damage attackers with lightning." },
      { title: "Destructive Wrath", summary: "Maximize lightning damage." },
      { title: "Thunderbolt Strike", summary: "Push enemies with lightning." },
      { title: "Divine Strike", summary: "Storm-infused attacks." },
      { title: "Stormborn", summary: "Storm-based mobility." }
    ],

    "Trickery Domain": [
      { title: "Blessing of the Trickster", summary: "Improve stealth." },
      { title: "Invoke Duplicity", summary: "Create illusions." },
      { title: "Cloak of Shadows", summary: "Become invisible." },
      { title: "Divine Strike", summary: "Boost attacks." },
      { title: "Improved Duplicity", summary: "Enhanced illusion control." }
    ],

    "War Domain": [
      { title: "War Priest", summary: "Extra attacks." },
      { title: "Guided Strike", summary: "Improve attack accuracy." },
      { title: "War God’s Blessing", summary: "Help allies hit." },
      { title: "Divine Strike", summary: "Extra damage." },
      { title: "Avatar of Battle", summary: "Increase resistances." }
    ]
  },

  Barbarian: {

    "Path of the Berserker": [
      { title: "Frenzy", summary: "Enter aggressive rage for extra attacks." },
      { title: "Mindless Rage", summary: "Immune to charm and fear while raging." },
      { title: "Intimidating Presence", summary: "Frighten enemies." },
      { title: "Retaliation", summary: "Attack back when hit." }
    ],

    "Path of the Totem Warrior": [
      { title: "Spirit Seeker", summary: "Gain connection to spirit animals." },
      { title: "Totem Spirit", summary: "Choose animal spirit abilities." },
      { title: "Aspect of the Beast", summary: "Gain passive animal traits." },
      { title: "Spirit Walker", summary: "Strengthen spiritual connection." },
      { title: "Totemic Attunement", summary: "Final spirit ability." }
    ]
  },

  Bard: {

    "College of Lore": [
      {
        title: "Bonus Proficiencies",
        summary: "Gain additional skills for versatility."
      },
      {
        title: "Cutting Words",
        summary: "Use words to weaken enemy attacks."
      },
      {
        title: "Additional Magical Secrets",
        summary: "Learn spells from any class."
      },
      {
        title: "Peerless Skill",
        summary: "Enhance ability checks using inspiration."
      }
    ],

    "College of Valor": [
      {
        title: "Bonus Proficiencies",
        summary: "Gain armor and weapon proficiencies."
      },
      {
        title: "Combat Inspiration",
        summary: "Use inspiration to improve damage or defense."
      },
      {
        title: "Extra Attack",
        summary: "Attack twice in combat."
      },
      {
        title: "Battle Magic",
        summary: "Cast a spell and strike in the same turn."
      }
    ]

  },

  Druid: {

    "Circle of the Land": [
      {
        title: "Bonus Cantrip",
        summary: "Gain an additional druid cantrip."
      },
      {
        title: "Natural Recovery",
        summary: "Recover spell energy during rest."
      },
      {
        title: "Land’s Stride",
        summary: "Move easily through natural terrain."
      },
      {
        title: "Nature’s Ward",
        summary: "Gain resistance against natural hazards."
      },
      {
        title: "Nature’s Sanctuary",
        summary: "Be protected from creatures of nature."
      }
    ],

    "Circle of the Moon": [
      {
        title: "Combat Wild Shape",
        summary: "Transform quickly and fight in wild shape."
      },
      {
        title: "Circle Forms",
        summary: "Access stronger beast forms."
      },
      {
        title: "Primal Strike",
        summary: "Attacks in wild shape count as magical."
      },
      {
        title: "Elemental Wild Shape",
        summary: "Transform into elemental creatures."
      },
      {
        title: "Thousand Forms",
        summary: "Alter appearance using natural magic."
      }
    ]

  },

  Fighter: {

    "Champion": [
      {
        title: "Improved Critical",
        summary: "Increase chance to land critical hits."
      },
      {
        title: "Remarkable Athlete",
        summary: "Gain better physical ability performance."
      },
      {
        title: "Additional Fighting Style",
        summary: "Gain a second combat specialization."
      },
      {
        title: "Superior Critical",
        summary: "Further increase critical hit chance."
      },
      {
        title: "Survivor",
        summary: "Regain health automatically in combat."
      }
    ],

    "Battle Master": [
      {
        title: "Combat Superiority",
        summary: "Use tactical maneuvers fueled by superiority dice."
      },
      {
        title: "Student of War",
        summary: "Gain additional tool proficiency."
      },
      {
        title: "Know Your Enemy",
        summary: "Analyze enemies for combat advantage."
      },
      {
        title: "Improved Combat Superiority",
        summary: "Stronger superiority dice over time."
      },
      {
        title: "Relentless",
        summary: "Regain maneuver resources in combat."
      }
    ],

    "Eldritch Knight": [
      {
        title: "Weapon Bond",
        summary: "Bond with weapon so it cannot be disarmed."
      },
      {
        title: "War Magic",
        summary: "Cast spell and attack in same turn."
      },
      {
        title: "Eldritch Strike",
        summary: "Make spells harder to resist after attacks."
      },
      {
        title: "Arcane Charge",
        summary: "Teleport short distances during action surge."
      },
      {
        title: "Improved War Magic",
        summary: "Stronger spell + attack combos."
      }
    ]

  },

  Monk: {

    "Way of the Open Hand": [
      {
        title: "Open Hand Technique",
        summary: "Manipulate enemies during flurry attacks."
      },
      {
        title: "Wholeness of Body",
        summary: "Heal yourself using inner energy."
      },
      {
        title: "Tranquility",
        summary: "Gain defensive protection through inner calm."
      },
      {
        title: "Quivering Palm",
        summary: "Deliver a devastating internal strike."
      }
    ],

    "Way of Shadow": [
      {
        title: "Shadow Arts",
        summary: "Use ki to mimic shadow-based magic."
      },
      {
        title: "Shadow Step",
        summary: "Teleport between shadows."
      },
      {
        title: "Cloak of Shadows",
        summary: "Become invisible in darkness."
      },
      {
        title: "Opportunist",
        summary: "Exploit openings in enemy defenses."
      }
    ],

    "Way of the Four Elements": [
      {
        title: "Elemental Attunement",
        summary: "Control minor elemental forces."
      },
      {
        title: "Elemental Disciplines",
        summary: "Use ki to cast elemental abilities."
      },
      {
        title: "Expanded Disciplines",
        summary: "Gain access to more elemental options."
      },
      {
        title: "Master of Elements",
        summary: "Enhance elemental power at higher levels."
      }
    ]

  },

  Paladin: {

    "Oath of Devotion": [
      {
        title: "Sacred Weapon",
        summary: "Empower your weapon with divine radiance."
      },
      {
        title: "Turn the Unholy",
        summary: "Drive away undead and fiends."
      },
      {
        title: "Aura of Devotion",
        summary: "Protect allies from charm effects."
      },
      {
        title: "Purity of Spirit",
        summary: "Gain constant protection against hostile magic."
      },
      {
        title: "Holy Nimbus",
        summary: "Radiate divine energy that damages enemies."
      }
    ],

    "Oath of the Ancients": [
      {
        title: "Nature’s Wrath",
        summary: "Restrain enemies using primal forces."
      },
      {
        title: "Turn the Faithless",
        summary: "Frighten fiends and fey creatures."
      },
      {
        title: "Aura of Warding",
        summary: "Reduce damage from spells for allies."
      },
      {
        title: "Undying Sentinel",
        summary: "Avoid being knocked unconscious once."
      },
      {
        title: "Elder Champion",
        summary: "Transform into a powerful nature guardian."
      }
    ],

    "Oath of Vengeance": [
      {
        title: "Abjure Enemy",
        summary: "Frighten or bind a chosen enemy."
      },
      {
        title: "Vow of Enmity",
        summary: "Gain advantage against one enemy."
      },
      {
        title: "Relentless Avenger",
        summary: "Move after hitting an enemy."
      },
      {
        title: "Soul of Vengeance",
        summary: "Strike back when the marked enemy attacks."
      },
      {
        title: "Avenging Angel",
        summary: "Gain flight and fear aura in battle."
      }
    ]

  },

  Ranger: {

    "Hunter": [
      {
        title: "Hunter’s Prey",
        summary: "Choose combat style against enemies."
      },
      {
        title: "Defensive Tactics",
        summary: "Gain defensive options in combat."
      },
      {
        title: "Multiattack",
        summary: "Attack multiple enemies efficiently."
      },
      {
        title: "Superior Hunter’s Defense",
        summary: "Gain advanced defensive abilities."
      }
    ],

    "Beast Master": [
      {
        title: "Ranger’s Companion",
        summary: "Gain a loyal animal companion."
      },
      {
        title: "Exceptional Training",
        summary: "Improve companion combat effectiveness."
      },
      {
        title: "Bestial Fury",
        summary: "Companion gains extra attack power."
      },
      {
        title: "Share Spells",
        summary: "Share magic effects with companion."
      }
    ]

  },

  Rogue: {

    "Thief": [
      {
        title: "Fast Hands",
        summary: "Use bonus action for sleight of hand and object use."
      },
      {
        title: "Second-Story Work",
        summary: "Improve climbing and jumping abilities."
      },
      {
        title: "Supreme Sneak",
        summary: "Gain advantage on stealth when moving slowly."
      },
      {
        title: "Use Magic Device",
        summary: "Use magical items beyond normal limits."
      },
      {
        title: "Thief’s Reflexes",
        summary: "Act twice at the start of combat."
      }
    ],

    "Assassin": [
      {
        title: "Bonus Proficiencies",
        summary: "Gain disguise and poison proficiency."
      },
      {
        title: "Assassinate",
        summary: "Gain advantage and critical hits against surprised enemies."
      },
      {
        title: "Infiltration Expertise",
        summary: "Create false identities for deep cover."
      },
      {
        title: "Impostor",
        summary: "Mimic speech and behavior of others."
      },
      {
        title: "Death Strike",
        summary: "Deal massive damage to surprised enemies."
      }
    ],

    "Arcane Trickster": [
      {
        title: "Spellcasting",
        summary: "Use magic focused on illusion and enchantment."
      },
      {
        title: "Mage Hand Legerdemain",
        summary: "Control mage hand with enhanced precision."
      },
      {
        title: "Magical Ambush",
        summary: "Make spells harder to resist when hidden."
      },
      {
        title: "Versatile Trickster",
        summary: "Gain advantage using mage hand distractions."
      },
      {
        title: "Spell Thief",
        summary: "Steal spells from other casters."
      }
    ]

  },

  Sorcerer: {

    "Draconic Bloodline": [
      {
        title: "Draconic Resilience",
        summary: "Gain increased durability and natural armor."
      },
      {
        title: "Elemental Affinity",
        summary: "Enhance spells tied to your draconic element."
      },
      {
        title: "Dragon Wings",
        summary: "Gain the ability to fly."
      },
      {
        title: "Draconic Presence",
        summary: "Exert a powerful aura that influences enemies."
      }
    ],

    "Wild Magic": [
      {
        title: "Wild Magic Surge",
        summary: "Random magical effects can occur when casting spells."
      },
      {
        title: "Tides of Chaos",
        summary: "Gain advantage with the risk of triggering wild magic."
      },
      {
        title: "Bend Luck",
        summary: "Manipulate rolls using chaotic magic."
      },
      {
        title: "Controlled Chaos",
        summary: "Gain more control over wild magic effects."
      },
      {
        title: "Spell Bombardment",
        summary: "Increase spell damage potential randomly."
      }
    ]

  },

  Warlock: {

    "The Fiend": [
      {
        title: "Dark One’s Blessing",
        summary: "Gain temporary health when defeating enemies."
      },
      {
        title: "Dark One’s Own Luck",
        summary: "Add bonus to ability checks or saving throws."
      },
      {
        title: "Fiendish Resilience",
        summary: "Gain resistance to chosen damage type."
      },
      {
        title: "Hurl Through Hell",
        summary: "Banish enemy briefly into nightmare realm."
      }
    ],

    "The Great Old One": [
      {
        title: "Awakened Mind",
        summary: "Communicate telepathically."
      },
      {
        title: "Entropic Ward",
        summary: "Deflect attacks and gain advantage."
      },
      {
        title: "Thought Shield",
        summary: "Protect mind and reflect psychic damage."
      },
      {
        title: "Create Thrall",
        summary: "Dominate and control another creature."
      }
    ],

    "The Archfey": [
      {
        title: "Fey Presence",
        summary: "Charm or frighten creatures nearby."
      },
      {
        title: "Misty Escape",
        summary: "Teleport and become invisible when hit."
      },
      {
        title: "Beguiling Defenses",
        summary: "Gain immunity to charm and reflect it."
      },
      {
        title: "Dark Delirium",
        summary: "Trap enemies in illusionary realm."
      }
    ]

  },

  Wizard: {

    "School of Abjuration": [
      {
        title: "Arcane Ward",
        summary: "Create a magical shield that absorbs damage."
      },
      {
        title: "Projected Ward",
        summary: "Protect allies with your magical barrier."
      },
      {
        title: "Improved Abjuration",
        summary: "Enhance defensive spell effectiveness."
      },
      {
        title: "Spell Resistance",
        summary: "Gain resistance against spells."
      }
    ],

    "School of Conjuration": [
      {
        title: "Minor Conjuration",
        summary: "Create small objects using magic."
      },
      {
        title: "Benign Transposition",
        summary: "Teleport or swap places with allies."
      },
      {
        title: "Focused Conjuration",
        summary: "Maintain concentration on conjuration spells."
      },
      {
        title: "Durable Summons",
        summary: "Summoned creatures gain extra durability."
      }
    ],

    "School of Divination": [
      {
        title: "Portent",
        summary: "Control dice rolls using foresight."
      },
      {
        title: "Expert Divination",
        summary: "Recover spell energy when using divination."
      },
      {
        title: "The Third Eye",
        summary: "Gain enhanced perception abilities."
      },
      {
        title: "Greater Portent",
        summary: "Improve foresight abilities."
      }
    ],

    "School of Enchantment": [
      {
        title: "Hypnotic Gaze",
        summary: "Charm creatures through eye contact."
      },
      {
        title: "Instinctive Charm",
        summary: "Redirect enemy attacks."
      },
      {
        title: "Split Enchantment",
        summary: "Affect multiple targets with enchantments."
      },
      {
        title: "Alter Memories",
        summary: "Manipulate memories and perception."
      }
    ],

    "School of Evocation": [
      {
        title: "Sculpt Spells",
        summary: "Protect allies from area spell damage."
      },
      {
        title: "Potent Cantrip",
        summary: "Ensure cantrips deal damage even on saves."
      },
      {
        title: "Empowered Evocation",
        summary: "Increase damage of spells."
      },
      {
        title: "Overchannel",
        summary: "Maximize spell damage output."
      }
    ],

    "School of Illusion": [
      {
        title: "Improved Minor Illusion",
        summary: "Enhance illusion spells."
      },
      {
        title: "Malleable Illusions",
        summary: "Modify illusions dynamically."
      },
      {
        title: "Illusory Self",
        summary: "Avoid damage using illusions."
      },
      {
        title: "Illusory Reality",
        summary: "Make illusions temporarily real."
      }
    ],

    "School of Necromancy": [
      {
        title: "Grim Harvest",
        summary: "Recover health when defeating enemies."
      },
      {
        title: "Undead Thralls",
        summary: "Enhance summoned undead."
      },
      {
        title: "Inured to Undeath",
        summary: "Gain resistance to necrotic effects."
      },
      {
        title: "Command Undead",
        summary: "Dominate undead creatures."
      }
    ],

    "School of Transmutation": [
      {
        title: "Minor Alchemy",
        summary: "Transform objects into other materials."
      },
      {
        title: "Transmuter’s Stone",
        summary: "Gain passive bonuses from magical stone."
      },
      {
        title: "Shapechanger",
        summary: "Transform yourself into other forms."
      },
      {
        title: "Master Transmuter",
        summary: "Use powerful transformation effects."
      }
    ]

  }

};
