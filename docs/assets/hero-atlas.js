// Canonical sprite-gen pixel actor, directional attack poses and five-curled-petal bloom atlas.
window.CHEON_HERO_ATLAS = {
  "src": "assets/hero-atlas-pixel-v1.png",
  "columns": 4,
  "rows": 7,
  "frameWidth": 128,
  "frameHeight": 128,
  "displayHeight": 88,
  "foot": {
    "x": 64,
    "y": 118
  },
  "animations": {
    "idle": {
      "row": 0,
      "frames": 4,
      "fps": 4,
      "loop": true,
      "durations_ms": [
        250,
        250,
        250,
        250
      ]
    },
    "walk": {
      "row": 1,
      "frames": 8,
      "fps": 12,
      "loop": true,
      "durations_ms": [
        83,
        83,
        83,
        83,
        83,
        83,
        83,
        83
      ]
    },
    "cleave": {
      "row": 3,
      "frames": 8,
      "fps": 14,
      "loop": false,
      "durations_ms": [
        71,
        71,
        71,
        71,
        71,
        71,
        71,
        71
      ],
      "phaseFrames": {
        "anticipation": [
          0,
          2
        ],
        "active": [
          3,
          4
        ],
        "recovery": [
          5,
          7
        ]
      },
      "phaseRangeConvention": "inclusive"
    },
    "sweep": {
      "row": 5,
      "frames": 8,
      "fps": 14,
      "loop": false,
      "durations_ms": [
        71,
        71,
        71,
        71,
        71,
        71,
        71,
        71
      ],
      "phaseFrames": {
        "anticipation": [
          0,
          2
        ],
        "active": [
          3,
          4
        ],
        "recovery": [
          5,
          7
        ]
      },
      "phaseRangeConvention": "inclusive"
    }
  },
  "handAnchors": {
    "idle": [
      {
        "x": 56.37,
        "y": 53.537
      },
      {
        "x": 55.273,
        "y": 51.352
      },
      {
        "x": 56.37,
        "y": 51.352
      },
      {
        "x": 57.457,
        "y": 53.537
      }
    ],
    "walk": [
      {
        "x": 57.542,
        "y": 55.722
      },
      {
        "x": 54.103,
        "y": 58.374
      },
      {
        "x": 57.158,
        "y": 56.815
      },
      {
        "x": 55.549,
        "y": 57.346
      },
      {
        "x": 58.417,
        "y": 56.815
      },
      {
        "x": 56.754,
        "y": 55.722
      },
      {
        "x": 57.333,
        "y": 55.722
      },
      {
        "x": 56.0,
        "y": 57.29
      }
    ],
    "cleave": [
      {
        "x": 55.487,
        "y": 61.175
      },
      {
        "x": 75.268,
        "y": 21.88
      },
      {
        "x": 61.907,
        "y": 10.926
      },
      {
        "x": 87.5,
        "y": 30.421
      },
      {
        "x": 93.655,
        "y": 38.241
      },
      {
        "x": 86.435,
        "y": 70.229
      },
      {
        "x": 55.636,
        "y": 54.63
      },
      {
        "x": 56.628,
        "y": 55.722
      }
    ],
    "sweep": [
      {
        "x": 52.5,
        "y": 55.14
      },
      {
        "x": 44.857,
        "y": 51.352
      },
      {
        "x": 36.541,
        "y": 61.185
      },
      {
        "x": 79.818,
        "y": 39.701
      },
      {
        "x": 98.135,
        "y": 36.056
      },
      {
        "x": 84.518,
        "y": 49.626
      },
      {
        "x": 55.619,
        "y": 51.832
      },
      {
        "x": 55.904,
        "y": 55.14
      }
    ]
  },
  "bladeOrigins": {
    "idle": [
      {
        "x": 63.975,
        "y": 51.352
      },
      {
        "x": 62.909,
        "y": 49.167
      },
      {
        "x": 63.975,
        "y": 49.167
      },
      {
        "x": 65.062,
        "y": 51.352
      }
    ],
    "walk": [
      {
        "x": 65.133,
        "y": 52.444
      },
      {
        "x": 61.821,
        "y": 52.953
      },
      {
        "x": 64.711,
        "y": 52.444
      },
      {
        "x": 62.141,
        "y": 50.729
      },
      {
        "x": 67.083,
        "y": 50.259
      },
      {
        "x": 65.565,
        "y": 50.259
      },
      {
        "x": 67.083,
        "y": 50.259
      },
      {
        "x": 63.7,
        "y": 51.869
      }
    ],
    "cleave": [
      {
        "x": 64.308,
        "y": 56.804
      },
      {
        "x": 81.854,
        "y": 16.48
      },
      {
        "x": 57.535,
        "y": 3.278
      },
      {
        "x": 97.4,
        "y": 33.705
      },
      {
        "x": 101.379,
        "y": 41.519
      },
      {
        "x": 94.043,
        "y": 75.657
      },
      {
        "x": 64.364,
        "y": 49.167
      },
      {
        "x": 65.372,
        "y": 50.259
      }
    ],
    "sweep": [
      {
        "x": 62.4,
        "y": 49.626
      },
      {
        "x": 51.429,
        "y": 49.167
      },
      {
        "x": 28.8,
        "y": 59.0
      },
      {
        "x": 89.636,
        "y": 36.393
      },
      {
        "x": 106.764,
        "y": 34.963
      },
      {
        "x": 93.176,
        "y": 49.626
      },
      {
        "x": 64.381,
        "y": 46.318
      },
      {
        "x": 65.88,
        "y": 48.523
      }
    ]
  },
  "bladeAngles": {
    "idle": [
      -0.279775224291285,
      -0.2786974314582768,
      -0.27977522429128415,
      -0.27977522429128526
    ],
    "walk": [
      -0.40763907574777086,
      -0.6123241980210512,
      -0.5246183075101657,
      -0.7872908100890269,
      -0.6476606960819655,
      -0.5550104837834631,
      -0.5107225271137228,
      -0.6134228529416267
    ],
    "cleave": [
      -0.460058835964644,
      -0.6867704371202202,
      -2.090111398012103,
      0.3202953043931265,
      0.4013551355114373,
      0.6197021951274683,
      -0.5592581649378507,
      -0.558434819678479
    ],
    "sweep": [
      -0.5081784731162082,
      -0.320974334288622,
      -2.866486453339623,
      -0.32498599881782697,
      -0.12599492177539287,
      0.0,
      -0.5616914767659497,
      -0.5856625865035928
    ]
  },
  "frameLayout": {
    "idle": [
      {
        "x": 0,
        "y": 0,
        "w": 128,
        "h": 128
      },
      {
        "x": 128,
        "y": 0,
        "w": 128,
        "h": 128
      },
      {
        "x": 256,
        "y": 0,
        "w": 128,
        "h": 128
      },
      {
        "x": 384,
        "y": 0,
        "w": 128,
        "h": 128
      }
    ],
    "walk": [
      {
        "x": 0,
        "y": 128,
        "w": 128,
        "h": 128
      },
      {
        "x": 0,
        "y": 256,
        "w": 128,
        "h": 128
      },
      {
        "x": 128,
        "y": 128,
        "w": 128,
        "h": 128
      },
      {
        "x": 128,
        "y": 256,
        "w": 128,
        "h": 128
      },
      {
        "x": 256,
        "y": 128,
        "w": 128,
        "h": 128
      },
      {
        "x": 256,
        "y": 256,
        "w": 128,
        "h": 128
      },
      {
        "x": 384,
        "y": 128,
        "w": 128,
        "h": 128
      },
      {
        "x": 384,
        "y": 256,
        "w": 128,
        "h": 128
      }
    ],
    "cleave": [
      {
        "x": 0,
        "y": 384,
        "w": 128,
        "h": 128
      },
      {
        "x": 128,
        "y": 384,
        "w": 128,
        "h": 128
      },
      {
        "x": 256,
        "y": 384,
        "w": 128,
        "h": 128
      },
      {
        "x": 384,
        "y": 384,
        "w": 128,
        "h": 128
      },
      {
        "x": 0,
        "y": 512,
        "w": 128,
        "h": 128
      },
      {
        "x": 128,
        "y": 512,
        "w": 128,
        "h": 128
      },
      {
        "x": 256,
        "y": 512,
        "w": 128,
        "h": 128
      },
      {
        "x": 384,
        "y": 512,
        "w": 128,
        "h": 128
      }
    ],
    "sweep": [
      {
        "x": 0,
        "y": 640,
        "w": 128,
        "h": 128
      },
      {
        "x": 128,
        "y": 640,
        "w": 128,
        "h": 128
      },
      {
        "x": 256,
        "y": 640,
        "w": 128,
        "h": 128
      },
      {
        "x": 384,
        "y": 640,
        "w": 128,
        "h": 128
      },
      {
        "x": 0,
        "y": 768,
        "w": 128,
        "h": 128
      },
      {
        "x": 128,
        "y": 768,
        "w": 128,
        "h": 128
      },
      {
        "x": 256,
        "y": 768,
        "w": 128,
        "h": 128
      },
      {
        "x": 384,
        "y": 768,
        "w": 128,
        "h": 128
      }
    ]
  },
  "provenance": {
    "tool": "aldegad/sprite-gen 3.0.0",
    "commit": "9e1155cbccff58fd587d0158374bd67b65e55cb1",
    "pipeline": "existing 28 native-generated poses + canonical sprite-gen pixel-unfake extract (2px integer grid, shared24-color palette) + compose; metadata bounds adaptation",
    "license": "Apache-2.0 (tool); generated art has separate provider terms",
    "anchorMeasurement": "Measured v3 sockets mapped through old/new per-frame content bounds; subpixel uncertainty remains, visual check required.",
    "walkOrder": "A1 B1 A2 B2 A3 B3 A4 B4; B is newly generated in-between poses",
    "sourceRows": {
      "idle": [
        "idle"
      ],
      "walk": [
        "walk_a",
        "walk_b"
      ],
      "cleave": [
        "cleave_a",
        "cleave_b"
      ],
      "sweep": [
        "sweep_a",
        "sweep_b"
      ]
    },
    "motionQa": {
      "idle": "accepted unchanged v2 idle",
      "walk": "independent visual pass: eight genuine interleaved poses, improved foot continuity, body top10..11 and feet118, plausible wrap; subtle cloth/weight hand-drawn variation remains",
      "cleave": "independent visual pass: eight genuine preparation, strike, follow-through and recovery poses; source A row display normalization 1.13 restores approximate body height; runtime integration review separate",
      "sweep": "independent visual pass: eight distinct guard, coil, backswing, release, contact, follow-through and recovery poses; body height stable; hidden hilt socket estimated, correct behind-body layer required"
    },
    "pixelQa": "Original artwork was illustrated. This is a deterministic first pixel conversion, not newly hand-drawn pixel poses. Source-pitch/physical-cap warnings retained in run.",
    "directional": {
      "run": "research/art-runs/directional-v1/run",
      "generatedPoses": 80,
      "actualViews": [
        "e",
        "ne",
        "n",
        "se",
        "s"
      ],
      "mirroredViews": {
        "w": "e",
        "nw": "ne",
        "sw": "se"
      },
      "generation": "Built-in image_gen native transparent sprites; 2 accepted sheets, first sweep rejected for overhead motion.",
      "pipeline": "Canonical sprite-gen prepare -> complete raw-row crops -> projection extraction -> pixel-unfake64/shared24 palette -> compose-atlas/preview/inspect.",
      "limitations": "AI sources drawn finer than target; physical-cap/pitch warnings retained. Exact hidden north grip inferred. North attack has substantial arm occlusion; no whole-character rotation is used."
    }
  },
  "frameScales": {
    "idle": [
      0.915254,
      0.915254,
      0.915254,
      0.915254
    ],
    "walk": [
      0.915254,
      0.922414,
      0.915254,
      0.90678,
      0.915254,
      0.915254,
      0.915254,
      0.922414
    ],
    "cleave": [
      1.034057,
      1.046296,
      1.034237,
      1.032212,
      0.915254,
      0.921053,
      0.915254,
      0.915254
    ],
    "sweep": [
      0.90678,
      0.915254,
      0.915254,
      0.90678,
      0.915254,
      0.90678,
      0.90678,
      0.90678
    ]
  },
  "bladeBehind": {
    "sweep": [
      false,
      true,
      true,
      false,
      false,
      false,
      false,
      false
    ]
  },
  "pixelGrid": 2,
  "paletteSize": 24,
  "effects": {
    "bloomAtlas": {
      "src": "assets/plum-bloom-pixel-v1.png",
      "frames": [
        {
          "x": 0,
          "y": 0,
          "w": 128,
          "h": 128
        },
        {
          "x": 128,
          "y": 0,
          "w": 128,
          "h": 128
        },
        {
          "x": 256,
          "y": 0,
          "w": 128,
          "h": 128
        },
        {
          "x": 384,
          "y": 0,
          "w": 128,
          "h": 128
        },
        {
          "x": 0,
          "y": 128,
          "w": 128,
          "h": 128
        },
        {
          "x": 128,
          "y": 128,
          "w": 128,
          "h": 128
        },
        {
          "x": 256,
          "y": 128,
          "w": 128,
          "h": 128
        },
        {
          "x": 384,
          "y": 128,
          "w": 128,
          "h": 128
        }
      ],
      "durations_ms": [
        50,
        50,
        60,
        70,
        90,
        70,
        60,
        40
      ],
      "frameWidth": 128,
      "frameHeight": 128,
      "pixelGrid": 2,
      "paletteSize": 16,
      "impactFrame": 4,
      "provenance": {
        "tool": "aldegad/sprite-gen3.0.0",
        "pipeline": "native imagegen effect rows -> canonical component projection extraction, pixel-unfake logical64 shared16palette -> canonical compose",
        "shapeReference": "our own hwasan-emblem-v3 five curved clockwise petals",
        "run": "research/art-runs/pixel-v1/bloom",
        "limitations": "Canonical component grouping trimmed19 remote satellite fragments; terminal B4 is retained as a deliberately sparse40msremnant after five-arm B3. Fullraw preserved."
      }
    }
  },
  "directionalAnimations": {
    "cleave": {
      "e": {
        "src": "assets/hero-directional-pixel-v1.png",
        "frames": 8,
        "fps": 14,
        "frameWidth": 128,
        "frameHeight": 128,
        "foot": {
          "x": 64,
          "y": 118
        },
        "frameLayout": [
          {
            "x": 0,
            "y": 0,
            "w": 128,
            "h": 128
          },
          {
            "x": 128,
            "y": 0,
            "w": 128,
            "h": 128
          },
          {
            "x": 256,
            "y": 0,
            "w": 128,
            "h": 128
          },
          {
            "x": 384,
            "y": 0,
            "w": 128,
            "h": 128
          },
          {
            "x": 512,
            "y": 0,
            "w": 128,
            "h": 128
          },
          {
            "x": 640,
            "y": 0,
            "w": 128,
            "h": 128
          },
          {
            "x": 768,
            "y": 0,
            "w": 128,
            "h": 128
          },
          {
            "x": 896,
            "y": 0,
            "w": 128,
            "h": 128
          }
        ],
        "handAnchors": [
          {
            "x": 73.223,
            "y": 61.478
          },
          {
            "x": 98.524,
            "y": 46.316
          },
          {
            "x": 69.616,
            "y": 6.732
          },
          {
            "x": 103.1,
            "y": 62.007
          },
          {
            "x": 108.395,
            "y": 71.053
          },
          {
            "x": 110.176,
            "y": 82.779
          },
          {
            "x": 85.223,
            "y": 64.478
          },
          {
            "x": 73.223,
            "y": 65.478
          }
        ],
        "bladeOrigins": [
          {
            "x": 78,
            "y": 60
          },
          {
            "x": 96,
            "y": 42
          },
          {
            "x": 68,
            "y": 2
          },
          {
            "x": 108,
            "y": 63
          },
          {
            "x": 113,
            "y": 73
          },
          {
            "x": 114,
            "y": 86
          },
          {
            "x": 90,
            "y": 63
          },
          {
            "x": 78,
            "y": 64
          }
        ],
        "bladeAngles": [
          -0.3,
          -2.1,
          -1.9,
          0.2,
          0.4,
          0.7,
          -0.3,
          -0.3
        ],
        "bladeBehind": [
          false,
          false,
          false,
          false,
          false,
          false,
          false,
          false
        ],
        "bladeLengths": [
          40,
          40,
          40,
          40,
          40,
          40,
          40,
          40
        ],
        "frameScales": [
          0.915254,
          0.915254,
          0.915254,
          0.915254,
          0.915254,
          0.915254,
          0.915254,
          0.915254
        ],
        "phaseFrames": {
          "anticipation": [
            0,
            2
          ],
          "active": [
            3,
            4
          ],
          "recovery": [
            5,
            7
          ]
        },
        "phaseRangeConvention": "inclusive",
        "pixelGrid": 2,
        "paletteSize": 24
      },
      "ne": {
        "src": "assets/hero-directional-pixel-v1.png",
        "frames": 8,
        "fps": 14,
        "frameWidth": 128,
        "frameHeight": 128,
        "foot": {
          "x": 64,
          "y": 118
        },
        "frameLayout": [
          {
            "x": 0,
            "y": 128,
            "w": 128,
            "h": 128
          },
          {
            "x": 128,
            "y": 128,
            "w": 128,
            "h": 128
          },
          {
            "x": 256,
            "y": 128,
            "w": 128,
            "h": 128
          },
          {
            "x": 384,
            "y": 128,
            "w": 128,
            "h": 128
          },
          {
            "x": 512,
            "y": 128,
            "w": 128,
            "h": 128
          },
          {
            "x": 640,
            "y": 128,
            "w": 128,
            "h": 128
          },
          {
            "x": 768,
            "y": 128,
            "w": 128,
            "h": 128
          },
          {
            "x": 896,
            "y": 128,
            "w": 128,
            "h": 128
          }
        ],
        "handAnchors": [
          {
            "x": 97.176,
            "y": 69.221
          },
          {
            "x": 88.331,
            "y": 10.729
          },
          {
            "x": 76.524,
            "y": 7.316
          },
          {
            "x": 103.176,
            "y": 66.221
          },
          {
            "x": 103.612,
            "y": 63.397
          },
          {
            "x": 103.1,
            "y": 82.007
          },
          {
            "x": 101.176,
            "y": 69.221
          },
          {
            "x": 98.176,
            "y": 68.221
          }
        ],
        "bladeOrigins": [
          {
            "x": 101,
            "y": 66
          },
          {
            "x": 85,
            "y": 7
          },
          {
            "x": 74,
            "y": 3
          },
          {
            "x": 107,
            "y": 63
          },
          {
            "x": 108,
            "y": 61
          },
          {
            "x": 108,
            "y": 83
          },
          {
            "x": 105,
            "y": 66
          },
          {
            "x": 102,
            "y": 65
          }
        ],
        "bladeAngles": [
          -0.7,
          -2.3,
          -2.1,
          -0.7,
          -0.5,
          0.2,
          -0.7,
          -0.7
        ],
        "bladeBehind": [
          false,
          false,
          false,
          false,
          false,
          false,
          false,
          false
        ],
        "bladeLengths": [
          31,
          34,
          36,
          34,
          32,
          31,
          31,
          31
        ],
        "frameScales": [
          0.915254,
          0.915254,
          0.915254,
          0.915254,
          0.915254,
          0.915254,
          0.915254,
          0.915254
        ],
        "phaseFrames": {
          "anticipation": [
            0,
            2
          ],
          "active": [
            3,
            4
          ],
          "recovery": [
            5,
            7
          ]
        },
        "phaseRangeConvention": "inclusive",
        "pixelGrid": 2,
        "paletteSize": 24
      },
      "n": {
        "src": "assets/hero-directional-pixel-v1.png",
        "frames": 8,
        "fps": 14,
        "frameWidth": 128,
        "frameHeight": 128,
        "foot": {
          "x": 64,
          "y": 118
        },
        "frameLayout": [
          {
            "x": 0,
            "y": 256,
            "w": 128,
            "h": 128
          },
          {
            "x": 128,
            "y": 256,
            "w": 128,
            "h": 128
          },
          {
            "x": 256,
            "y": 256,
            "w": 128,
            "h": 128
          },
          {
            "x": 384,
            "y": 256,
            "w": 128,
            "h": 128
          },
          {
            "x": 512,
            "y": 256,
            "w": 128,
            "h": 128
          },
          {
            "x": 640,
            "y": 256,
            "w": 128,
            "h": 128
          },
          {
            "x": 768,
            "y": 256,
            "w": 128,
            "h": 128
          },
          {
            "x": 896,
            "y": 256,
            "w": 128,
            "h": 128
          }
        ],
        "handAnchors": [
          {
            "x": 87.646,
            "y": 67.987
          },
          {
            "x": 82.081,
            "y": 25.546
          },
          {
            "x": 67.616,
            "y": 9.732
          },
          {
            "x": 61.644,
            "y": 14.958
          },
          {
            "x": 62.646,
            "y": 13.987
          },
          {
            "x": 68.188,
            "y": 19.66
          },
          {
            "x": 77.646,
            "y": 39.987
          },
          {
            "x": 92.646,
            "y": 68.987
          }
        ],
        "bladeOrigins": [
          {
            "x": 88,
            "y": 63
          },
          {
            "x": 80,
            "y": 21
          },
          {
            "x": 66,
            "y": 5
          },
          {
            "x": 61,
            "y": 10
          },
          {
            "x": 63,
            "y": 9
          },
          {
            "x": 70,
            "y": 15
          },
          {
            "x": 78,
            "y": 35
          },
          {
            "x": 93,
            "y": 64
          }
        ],
        "bladeAngles": [
          -1.5,
          -2,
          -1.9,
          -1.7,
          -1.5,
          -1.2,
          -1.5,
          -1.5
        ],
        "bladeBehind": [
          false,
          true,
          true,
          true,
          true,
          true,
          false,
          false
        ],
        "bladeLengths": [
          22,
          25,
          30,
          28,
          26,
          22,
          24,
          22
        ],
        "frameScales": [
          0.915254,
          0.915254,
          0.915254,
          0.915254,
          0.915254,
          0.915254,
          0.915254,
          0.915254
        ],
        "phaseFrames": {
          "anticipation": [
            0,
            2
          ],
          "active": [
            3,
            4
          ],
          "recovery": [
            5,
            7
          ]
        },
        "phaseRangeConvention": "inclusive",
        "pixelGrid": 2,
        "paletteSize": 24
      },
      "se": {
        "src": "assets/hero-directional-pixel-v1.png",
        "frames": 8,
        "fps": 14,
        "frameWidth": 128,
        "frameHeight": 128,
        "foot": {
          "x": 64,
          "y": 118
        },
        "frameLayout": [
          {
            "x": 0,
            "y": 384,
            "w": 128,
            "h": 128
          },
          {
            "x": 128,
            "y": 384,
            "w": 128,
            "h": 128
          },
          {
            "x": 256,
            "y": 384,
            "w": 128,
            "h": 128
          },
          {
            "x": 384,
            "y": 384,
            "w": 128,
            "h": 128
          },
          {
            "x": 512,
            "y": 384,
            "w": 128,
            "h": 128
          },
          {
            "x": 640,
            "y": 384,
            "w": 128,
            "h": 128
          },
          {
            "x": 768,
            "y": 384,
            "w": 128,
            "h": 128
          },
          {
            "x": 896,
            "y": 384,
            "w": 128,
            "h": 128
          }
        ],
        "handAnchors": [
          {
            "x": 64.176,
            "y": 62.779
          },
          {
            "x": 89.136,
            "y": 67.869
          },
          {
            "x": 60.644,
            "y": 8.958
          },
          {
            "x": 91.395,
            "y": 85.053
          },
          {
            "x": 92.516,
            "y": 84.413
          },
          {
            "x": 82.188,
            "y": 95.34
          },
          {
            "x": 66.176,
            "y": 65.779
          },
          {
            "x": 64.176,
            "y": 64.779
          }
        ],
        "bladeOrigins": [
          {
            "x": 68,
            "y": 66
          },
          {
            "x": 88,
            "y": 63
          },
          {
            "x": 60,
            "y": 4
          },
          {
            "x": 96,
            "y": 87
          },
          {
            "x": 96,
            "y": 88
          },
          {
            "x": 84,
            "y": 100
          },
          {
            "x": 70,
            "y": 69
          },
          {
            "x": 68,
            "y": 68
          }
        ],
        "bladeAngles": [
          0.7,
          -1.8,
          -1.7,
          0.4,
          0.8,
          1.2,
          0.7,
          0.7
        ],
        "bladeBehind": [
          false,
          false,
          false,
          false,
          false,
          false,
          false,
          false
        ],
        "bladeLengths": [
          40,
          40,
          40,
          40,
          40,
          40,
          40,
          40
        ],
        "frameScales": [
          0.915254,
          0.915254,
          0.915254,
          0.915254,
          0.915254,
          0.915254,
          0.915254,
          0.915254
        ],
        "phaseFrames": {
          "anticipation": [
            0,
            2
          ],
          "active": [
            3,
            4
          ],
          "recovery": [
            5,
            7
          ]
        },
        "phaseRangeConvention": "inclusive",
        "pixelGrid": 2,
        "paletteSize": 24
      },
      "s": {
        "src": "assets/hero-directional-pixel-v1.png",
        "frames": 8,
        "fps": 14,
        "frameWidth": 128,
        "frameHeight": 128,
        "foot": {
          "x": 64,
          "y": 118
        },
        "frameLayout": [
          {
            "x": 0,
            "y": 512,
            "w": 128,
            "h": 128
          },
          {
            "x": 128,
            "y": 512,
            "w": 128,
            "h": 128
          },
          {
            "x": 256,
            "y": 512,
            "w": 128,
            "h": 128
          },
          {
            "x": 384,
            "y": 512,
            "w": 128,
            "h": 128
          },
          {
            "x": 512,
            "y": 512,
            "w": 128,
            "h": 128
          },
          {
            "x": 640,
            "y": 512,
            "w": 128,
            "h": 128
          },
          {
            "x": 768,
            "y": 512,
            "w": 128,
            "h": 128
          },
          {
            "x": 896,
            "y": 512,
            "w": 128,
            "h": 128
          }
        ],
        "handAnchors": [
          {
            "x": 65.646,
            "y": 62.013
          },
          {
            "x": 73.616,
            "y": 54.732
          },
          {
            "x": 61.146,
            "y": 11.998
          },
          {
            "x": 63.188,
            "y": 79.34
          },
          {
            "x": 66.146,
            "y": 83.002
          },
          {
            "x": 67.136,
            "y": 91.131
          },
          {
            "x": 67.646,
            "y": 66.013
          },
          {
            "x": 67.646,
            "y": 64.013
          }
        ],
        "bladeOrigins": [
          {
            "x": 66,
            "y": 67
          },
          {
            "x": 72,
            "y": 50
          },
          {
            "x": 61,
            "y": 7
          },
          {
            "x": 65,
            "y": 84
          },
          {
            "x": 66,
            "y": 88
          },
          {
            "x": 66,
            "y": 96
          },
          {
            "x": 68,
            "y": 71
          },
          {
            "x": 68,
            "y": 69
          }
        ],
        "bladeAngles": [
          1.5,
          -1.9,
          -1.6,
          1.2,
          1.6,
          1.8,
          1.5,
          1.5
        ],
        "bladeBehind": [
          false,
          false,
          false,
          false,
          false,
          false,
          false,
          false
        ],
        "bladeLengths": [
          40,
          40,
          40,
          40,
          40,
          40,
          40,
          40
        ],
        "frameScales": [
          0.915254,
          0.915254,
          0.915254,
          0.915254,
          0.915254,
          0.915254,
          0.915254,
          0.915254
        ],
        "phaseFrames": {
          "anticipation": [
            0,
            2
          ],
          "active": [
            3,
            4
          ],
          "recovery": [
            5,
            7
          ]
        },
        "phaseRangeConvention": "inclusive",
        "pixelGrid": 2,
        "paletteSize": 24
      },
      "w": {
        "mirrorOf": "e"
      },
      "nw": {
        "mirrorOf": "ne"
      },
      "sw": {
        "mirrorOf": "se"
      }
    },
    "sweep": {
      "e": {
        "src": "assets/hero-directional-pixel-v1.png",
        "frames": 8,
        "fps": 14,
        "frameWidth": 128,
        "frameHeight": 128,
        "foot": {
          "x": 64,
          "y": 118
        },
        "frameLayout": [
          {
            "x": 0,
            "y": 640,
            "w": 128,
            "h": 128
          },
          {
            "x": 128,
            "y": 640,
            "w": 128,
            "h": 128
          },
          {
            "x": 256,
            "y": 640,
            "w": 128,
            "h": 128
          },
          {
            "x": 384,
            "y": 640,
            "w": 128,
            "h": 128
          },
          {
            "x": 512,
            "y": 640,
            "w": 128,
            "h": 128
          },
          {
            "x": 640,
            "y": 640,
            "w": 128,
            "h": 128
          },
          {
            "x": 768,
            "y": 640,
            "w": 128,
            "h": 128
          },
          {
            "x": 896,
            "y": 640,
            "w": 128,
            "h": 128
          }
        ],
        "handAnchors": [
          {
            "x": 73.223,
            "y": 60.478
          },
          {
            "x": 63.711,
            "y": 60.675
          },
          {
            "x": 25.95,
            "y": 59.706
          },
          {
            "x": 118.223,
            "y": 37.478
          },
          {
            "x": 108.1,
            "y": 44.007
          },
          {
            "x": 113.873,
            "y": 54.177
          },
          {
            "x": 77.223,
            "y": 59.478
          },
          {
            "x": 75.223,
            "y": 59.478
          }
        ],
        "bladeOrigins": [
          {
            "x": 78,
            "y": 59
          },
          {
            "x": 59,
            "y": 59
          },
          {
            "x": 21,
            "y": 59
          },
          {
            "x": 123,
            "y": 36
          },
          {
            "x": 113,
            "y": 45
          },
          {
            "x": 118,
            "y": 57
          },
          {
            "x": 82,
            "y": 58
          },
          {
            "x": 80,
            "y": 58
          }
        ],
        "bladeAngles": [
          -0.3,
          -2.8,
          -3,
          -0.3,
          0.2,
          0.6,
          -0.3,
          -0.3
        ],
        "bladeBehind": [
          false,
          true,
          true,
          false,
          false,
          false,
          false,
          false
        ],
        "bladeLengths": [
          40,
          40,
          40,
          40,
          40,
          40,
          40,
          40
        ],
        "frameScales": [
          0.915254,
          0.915254,
          0.915254,
          0.915254,
          0.915254,
          0.915254,
          0.915254,
          0.915254
        ],
        "phaseFrames": {
          "anticipation": [
            0,
            2
          ],
          "active": [
            3,
            4
          ],
          "recovery": [
            5,
            7
          ]
        },
        "phaseRangeConvention": "inclusive",
        "pixelGrid": 2,
        "paletteSize": 24
      },
      "ne": {
        "src": "assets/hero-directional-pixel-v1.png",
        "frames": 8,
        "fps": 14,
        "frameWidth": 128,
        "frameHeight": 128,
        "foot": {
          "x": 64,
          "y": 118
        },
        "frameLayout": [
          {
            "x": 0,
            "y": 768,
            "w": 128,
            "h": 128
          },
          {
            "x": 128,
            "y": 768,
            "w": 128,
            "h": 128
          },
          {
            "x": 256,
            "y": 768,
            "w": 128,
            "h": 128
          },
          {
            "x": 384,
            "y": 768,
            "w": 128,
            "h": 128
          },
          {
            "x": 512,
            "y": 768,
            "w": 128,
            "h": 128
          },
          {
            "x": 640,
            "y": 768,
            "w": 128,
            "h": 128
          },
          {
            "x": 768,
            "y": 768,
            "w": 128,
            "h": 128
          },
          {
            "x": 896,
            "y": 768,
            "w": 128,
            "h": 128
          }
        ],
        "handAnchors": [
          {
            "x": 94.176,
            "y": 68.221
          },
          {
            "x": 113.52,
            "y": 55.137
          },
          {
            "x": 115.687,
            "y": 36.377
          },
          {
            "x": 119.663,
            "y": 30.818
          },
          {
            "x": 118.873,
            "y": 32.823
          },
          {
            "x": 118.025,
            "y": 50.501
          },
          {
            "x": 99.176,
            "y": 68.221
          },
          {
            "x": 94.176,
            "y": 66.221
          }
        ],
        "bladeOrigins": [
          {
            "x": 98,
            "y": 65
          },
          {
            "x": 109,
            "y": 53
          },
          {
            "x": 112,
            "y": 33
          },
          {
            "x": 121,
            "y": 26
          },
          {
            "x": 123,
            "y": 30
          },
          {
            "x": 123,
            "y": 51
          },
          {
            "x": 103,
            "y": 65
          },
          {
            "x": 98,
            "y": 63
          }
        ],
        "bladeAngles": [
          -0.7,
          -2.7,
          -2.4,
          -1.3,
          -0.6,
          0.1,
          -0.7,
          -0.7
        ],
        "bladeBehind": [
          false,
          true,
          true,
          false,
          false,
          false,
          false,
          false
        ],
        "bladeLengths": [
          31,
          34,
          36,
          34,
          32,
          31,
          31,
          31
        ],
        "frameScales": [
          0.915254,
          0.915254,
          0.915254,
          0.915254,
          0.915254,
          0.915254,
          0.915254,
          0.915254
        ],
        "phaseFrames": {
          "anticipation": [
            0,
            2
          ],
          "active": [
            3,
            4
          ],
          "recovery": [
            5,
            7
          ]
        },
        "phaseRangeConvention": "inclusive",
        "pixelGrid": 2,
        "paletteSize": 24
      },
      "n": {
        "src": "assets/hero-directional-pixel-v1.png",
        "frames": 8,
        "fps": 14,
        "frameWidth": 128,
        "frameHeight": 128,
        "foot": {
          "x": 64,
          "y": 118
        },
        "frameLayout": [
          {
            "x": 0,
            "y": 896,
            "w": 128,
            "h": 128
          },
          {
            "x": 128,
            "y": 896,
            "w": 128,
            "h": 128
          },
          {
            "x": 256,
            "y": 896,
            "w": 128,
            "h": 128
          },
          {
            "x": 384,
            "y": 896,
            "w": 128,
            "h": 128
          },
          {
            "x": 512,
            "y": 896,
            "w": 128,
            "h": 128
          },
          {
            "x": 640,
            "y": 896,
            "w": 128,
            "h": 128
          },
          {
            "x": 768,
            "y": 896,
            "w": 128,
            "h": 128
          },
          {
            "x": 896,
            "y": 896,
            "w": 128,
            "h": 128
          }
        ],
        "handAnchors": [
          {
            "x": 94.646,
            "y": 68.987
          },
          {
            "x": 97.855,
            "y": 60.196
          },
          {
            "x": 116.52,
            "y": 44.137
          },
          {
            "x": 125.331,
            "y": 33.729
          },
          {
            "x": 123.298,
            "y": 44.207
          },
          {
            "x": 111.612,
            "y": 58.397
          },
          {
            "x": 103.646,
            "y": 65.987
          },
          {
            "x": 93.646,
            "y": 68.987
          }
        ],
        "bladeOrigins": [
          {
            "x": 95,
            "y": 64
          },
          {
            "x": 93,
            "y": 59
          },
          {
            "x": 112,
            "y": 42
          },
          {
            "x": 122,
            "y": 30
          },
          {
            "x": 126,
            "y": 40
          },
          {
            "x": 116,
            "y": 56
          },
          {
            "x": 104,
            "y": 61
          },
          {
            "x": 94,
            "y": 64
          }
        ],
        "bladeAngles": [
          -1.5,
          -2.9,
          -2.7,
          -2.3,
          -1,
          -0.5,
          -1.5,
          -1.5
        ],
        "bladeBehind": [
          false,
          true,
          true,
          true,
          true,
          true,
          false,
          false
        ],
        "bladeLengths": [
          22,
          25,
          30,
          28,
          26,
          22,
          24,
          22
        ],
        "frameScales": [
          0.915254,
          0.915254,
          0.915254,
          0.915254,
          0.915254,
          0.915254,
          0.915254,
          0.915254
        ],
        "phaseFrames": {
          "anticipation": [
            0,
            2
          ],
          "active": [
            3,
            4
          ],
          "recovery": [
            5,
            7
          ]
        },
        "phaseRangeConvention": "inclusive",
        "pixelGrid": 2,
        "paletteSize": 24
      },
      "se": {
        "src": "assets/hero-directional-pixel-v1.png",
        "frames": 8,
        "fps": 14,
        "frameWidth": 128,
        "frameHeight": 128,
        "foot": {
          "x": 64,
          "y": 118
        },
        "frameLayout": [
          {
            "x": 0,
            "y": 1024,
            "w": 128,
            "h": 128
          },
          {
            "x": 128,
            "y": 1024,
            "w": 128,
            "h": 128
          },
          {
            "x": 256,
            "y": 1024,
            "w": 128,
            "h": 128
          },
          {
            "x": 384,
            "y": 1024,
            "w": 128,
            "h": 128
          },
          {
            "x": 512,
            "y": 1024,
            "w": 128,
            "h": 128
          },
          {
            "x": 640,
            "y": 1024,
            "w": 128,
            "h": 128
          },
          {
            "x": 768,
            "y": 1024,
            "w": 128,
            "h": 128
          },
          {
            "x": 896,
            "y": 1024,
            "w": 128,
            "h": 128
          }
        ],
        "handAnchors": [
          {
            "x": 68.176,
            "y": 56.779
          },
          {
            "x": 75.687,
            "y": 56.377
          },
          {
            "x": 106.081,
            "y": 59.546
          },
          {
            "x": 113.025,
            "y": 45.501
          },
          {
            "x": 107.516,
            "y": 52.413
          },
          {
            "x": 92.006,
            "y": 56.008
          },
          {
            "x": 31.176,
            "y": 58.779
          },
          {
            "x": 68.176,
            "y": 55.779
          }
        ],
        "bladeOrigins": [
          {
            "x": 72,
            "y": 60
          },
          {
            "x": 72,
            "y": 53
          },
          {
            "x": 104,
            "y": 55
          },
          {
            "x": 118,
            "y": 46
          },
          {
            "x": 111,
            "y": 56
          },
          {
            "x": 88,
            "y": 59
          },
          {
            "x": 35,
            "y": 62
          },
          {
            "x": 72,
            "y": 59
          }
        ],
        "bladeAngles": [
          0.7,
          -2.4,
          -2,
          0.1,
          0.8,
          2.5,
          0.7,
          0.7
        ],
        "bladeBehind": [
          false,
          true,
          true,
          false,
          false,
          false,
          false,
          false
        ],
        "bladeLengths": [
          40,
          40,
          40,
          40,
          40,
          40,
          40,
          40
        ],
        "frameScales": [
          0.915254,
          0.915254,
          0.915254,
          0.915254,
          0.915254,
          0.915254,
          0.915254,
          0.915254
        ],
        "phaseFrames": {
          "anticipation": [
            0,
            2
          ],
          "active": [
            3,
            4
          ],
          "recovery": [
            5,
            7
          ]
        },
        "phaseRangeConvention": "inclusive",
        "pixelGrid": 2,
        "paletteSize": 24
      },
      "s": {
        "src": "assets/hero-directional-pixel-v1.png",
        "frames": 8,
        "fps": 14,
        "frameWidth": 128,
        "frameHeight": 128,
        "foot": {
          "x": 64,
          "y": 118
        },
        "frameLayout": [
          {
            "x": 0,
            "y": 1152,
            "w": 128,
            "h": 128
          },
          {
            "x": 128,
            "y": 1152,
            "w": 128,
            "h": 128
          },
          {
            "x": 256,
            "y": 1152,
            "w": 128,
            "h": 128
          },
          {
            "x": 384,
            "y": 1152,
            "w": 128,
            "h": 128
          },
          {
            "x": 512,
            "y": 1152,
            "w": 128,
            "h": 128
          },
          {
            "x": 640,
            "y": 1152,
            "w": 128,
            "h": 128
          },
          {
            "x": 768,
            "y": 1152,
            "w": 128,
            "h": 128
          },
          {
            "x": 896,
            "y": 1152,
            "w": 128,
            "h": 128
          }
        ],
        "handAnchors": [
          {
            "x": 63.646,
            "y": 57.013
          },
          {
            "x": 31.95,
            "y": 58.294
          },
          {
            "x": 89.025,
            "y": 64.499
          },
          {
            "x": 82.298,
            "y": 51.793
          },
          {
            "x": 66.136,
            "y": 57.131
          },
          {
            "x": 20.996,
            "y": 61.792
          },
          {
            "x": 68.646,
            "y": 62.013
          },
          {
            "x": 66.646,
            "y": 55.013
          }
        ],
        "bladeOrigins": [
          {
            "x": 64,
            "y": 62
          },
          {
            "x": 27,
            "y": 59
          },
          {
            "x": 94,
            "y": 64
          },
          {
            "x": 85,
            "y": 56
          },
          {
            "x": 65,
            "y": 62
          },
          {
            "x": 16,
            "y": 62
          },
          {
            "x": 69,
            "y": 67
          },
          {
            "x": 67,
            "y": 60
          }
        ],
        "bladeAngles": [
          1.5,
          3,
          -0.1,
          1,
          1.8,
          3.1,
          1.5,
          1.5
        ],
        "bladeBehind": [
          false,
          true,
          true,
          false,
          false,
          false,
          false,
          false
        ],
        "bladeLengths": [
          40,
          40,
          40,
          40,
          40,
          40,
          40,
          40
        ],
        "frameScales": [
          0.915254,
          0.915254,
          0.915254,
          0.915254,
          0.915254,
          0.915254,
          0.915254,
          0.915254
        ],
        "phaseFrames": {
          "anticipation": [
            0,
            2
          ],
          "active": [
            3,
            4
          ],
          "recovery": [
            5,
            7
          ]
        },
        "phaseRangeConvention": "inclusive",
        "pixelGrid": 2,
        "paletteSize": 24
      },
      "w": {
        "mirrorOf": "e"
      },
      "nw": {
        "mirrorOf": "ne"
      },
      "sw": {
        "mirrorOf": "se"
      }
    }
  }
};

// BEGIN APPROVED FULL-BODY MOTION V2
Object.assign(window.CHEON_HERO_ATLAS.animations, {
  "walk": {
    "src": "assets/hero-walk-fullbody-v2.png",
    "frameWidth": 128,
    "frameHeight": 128,
    "frames": 8,
    "fps": 12,
    "loop": true,
    "bakedWeapon": true,
    "displayHeight": 94.81481481481481,
    "foot": {
      "x": 64,
      "y": 118
    },
    "contactPoints": [
      [
        {
          "x": 40,
          "y": 118
        },
        {
          "x": 88,
          "y": 118
        }
      ],
      [
        {
          "x": 67,
          "y": 118
        }
      ],
      [
        {
          "x": 70,
          "y": 118
        }
      ],
      [
        {
          "x": 42,
          "y": 118
        },
        {
          "x": 87,
          "y": 118
        }
      ],
      [
        {
          "x": 38,
          "y": 118
        },
        {
          "x": 91,
          "y": 118
        }
      ],
      [
        {
          "x": 67,
          "y": 118
        }
      ],
      [
        {
          "x": 68,
          "y": 118
        }
      ],
      [
        {
          "x": 42,
          "y": 118
        },
        {
          "x": 87,
          "y": 118
        }
      ]
    ],
    "frameLayout": [
      {
        "x": 0,
        "y": 0,
        "w": 128,
        "h": 128
      },
      {
        "x": 128,
        "y": 0,
        "w": 128,
        "h": 128
      },
      {
        "x": 256,
        "y": 0,
        "w": 128,
        "h": 128
      },
      {
        "x": 384,
        "y": 0,
        "w": 128,
        "h": 128
      },
      {
        "x": 512,
        "y": 0,
        "w": 128,
        "h": 128
      },
      {
        "x": 640,
        "y": 0,
        "w": 128,
        "h": 128
      },
      {
        "x": 768,
        "y": 0,
        "w": 128,
        "h": 128
      },
      {
        "x": 896,
        "y": 0,
        "w": 128,
        "h": 128
      }
    ],
    "provenance": "sprite-gen components / canonical nearest common-row fit; approved full-body drawings, no runtime body masks"
  },
  "spin": {
    "src": "assets/hero-spin-fullbody-v2.png",
    "frameWidth": 128,
    "frameHeight": 128,
    "frames": 8,
    "fps": 28,
    "loop": true,
    "turnCycle": true,
    "bakedWeapon": true,
    "displayHeight": 80,
    "foot": {
      "x": 64,
      "y": 118
    },
    "frameScales": [
      1.8285714285714285,
      1.8028169014084507,
      1.7777777777777777,
      1.7777777777777777,
      1.8823529411764706,
      1.9393939393939394,
      1.9104477611940298,
      1.9104477611940298
    ],
    "footAnchors": [
      {
        "x": 64,
        "y": 118
      },
      {
        "x": 64,
        "y": 118
      },
      {
        "x": 64,
        "y": 118
      },
      {
        "x": 64,
        "y": 118
      },
      {
        "x": 64,
        "y": 118
      },
      {
        "x": 64,
        "y": 118
      },
      {
        "x": 64,
        "y": 118
      },
      {
        "x": 64,
        "y": 118
      }
    ],
    "handAnchors": [
      {
        "x": 74,
        "y": 70
      },
      {
        "x": 63,
        "y": 79
      },
      {
        "x": 62,
        "y": 80
      },
      {
        "x": 62,
        "y": 78
      },
      {
        "x": 51,
        "y": 68
      },
      {
        "x": 45,
        "y": 59
      },
      {
        "x": 66,
        "y": 55
      },
      {
        "x": 81,
        "y": 61
      }
    ],
    "bladeOrigins": [
      {
        "x": 79,
        "y": 70
      },
      {
        "x": 68,
        "y": 82
      },
      {
        "x": 62,
        "y": 85
      },
      {
        "x": 58,
        "y": 82
      },
      {
        "x": 46,
        "y": 69
      },
      {
        "x": 41,
        "y": 55
      },
      {
        "x": 66,
        "y": 51
      },
      {
        "x": 86,
        "y": 58
      }
    ],
    "tipAnchors": [
      {
        "x": 117,
        "y": 70
      },
      {
        "x": 96,
        "y": 97
      },
      {
        "x": 62,
        "y": 117
      },
      {
        "x": 32,
        "y": 104
      },
      {
        "x": 10,
        "y": 69
      },
      {
        "x": 21,
        "y": 43
      },
      {
        "x": 66,
        "y": 30
      },
      {
        "x": 105,
        "y": 42
      }
    ],
    "bladeAngles": [
      0.0,
      0.49180917598869855,
      1.5707963267948966,
      2.439335722080786,
      3.141592653589793,
      -2.601173153319209,
      -1.5707963267948966,
      -0.6998928697192437
    ],
    "bladeLengths": [
      43.42857142857143,
      35.791279265957385,
      35.55555555555556,
      37.843080813169784,
      42.35294117647059,
      28.271281914401456,
      25.074626865671643,
      29.659086205072768
    ],
    "frameLayout": [
      {
        "x": 0,
        "y": 0,
        "w": 128,
        "h": 128
      },
      {
        "x": 128,
        "y": 0,
        "w": 128,
        "h": 128
      },
      {
        "x": 256,
        "y": 0,
        "w": 128,
        "h": 128
      },
      {
        "x": 384,
        "y": 0,
        "w": 128,
        "h": 128
      },
      {
        "x": 0,
        "y": 128,
        "w": 128,
        "h": 128
      },
      {
        "x": 128,
        "y": 128,
        "w": 128,
        "h": 128
      },
      {
        "x": 256,
        "y": 128,
        "w": 128,
        "h": 128
      },
      {
        "x": 384,
        "y": 128,
        "w": 128,
        "h": 128
      }
    ],
    "frameDirections": [
      "e",
      "se",
      "s",
      "sw",
      "w",
      "nw",
      "n",
      "ne"
    ],
    "contactPoints": [
      [
        {
          "x": 50,
          "y": 118
        },
        {
          "x": 81,
          "y": 118
        }
      ],
      [
        {
          "x": 50,
          "y": 118
        },
        {
          "x": 80,
          "y": 118
        }
      ],
      [
        {
          "x": 51,
          "y": 118
        },
        {
          "x": 75,
          "y": 118
        }
      ],
      [
        {
          "x": 46,
          "y": 118
        },
        {
          "x": 77,
          "y": 118
        }
      ],
      [
        {
          "x": 46,
          "y": 118
        },
        {
          "x": 77,
          "y": 118
        }
      ],
      [
        {
          "x": 54,
          "y": 118
        },
        {
          "x": 74,
          "y": 118
        }
      ],
      [
        {
          "x": 52,
          "y": 118
        },
        {
          "x": 75,
          "y": 118
        }
      ],
      [
        {
          "x": 52,
          "y": 118
        },
        {
          "x": 76,
          "y": 118
        }
      ]
    ],
    "provenance": "sprite-gen native A0..3 then B0..3; full-body clockwise eight-view cycle; body-to-boot calibration excludes blade bounds"
  }
});
Object.assign(window.CHEON_HERO_ATLAS.directionalAnimations.sweep, {
  "e": {
    "src": "assets/hero-sweep-fullbody-v2.png",
    "frameWidth": 128,
    "frameHeight": 128,
    "frames": 8,
    "fps": 14,
    "loop": false,
    "bakedWeapon": true,
    "displayHeight": 80,
    "foot": {
      "x": 64,
      "y": 118
    },
    "footAnchors": [
      {
        "x": 64,
        "y": 118
      },
      {
        "x": 64,
        "y": 118
      },
      {
        "x": 64,
        "y": 118
      },
      {
        "x": 64,
        "y": 118
      },
      {
        "x": 64,
        "y": 118
      },
      {
        "x": 64,
        "y": 118
      },
      {
        "x": 64,
        "y": 118
      },
      {
        "x": 64,
        "y": 118
      }
    ],
    "frameScales": [
      1.7066666666666668,
      1.7297297297297298,
      1.7534246575342465,
      1.7777777777777777,
      2.0317460317460316,
      2.0317460317460316,
      2.0,
      2.0
    ],
    "phaseFrames": {
      "anticipation": [
        0,
        2
      ],
      "active": [
        3,
        4
      ],
      "recovery": [
        5,
        7
      ]
    },
    "contactPoints": [
      [
        {
          "x": 44,
          "y": 118
        },
        {
          "x": 80,
          "y": 118
        }
      ],
      [
        {
          "x": 53,
          "y": 118
        },
        {
          "x": 68,
          "y": 118
        }
      ],
      [
        {
          "x": 44,
          "y": 118
        },
        {
          "x": 81,
          "y": 118
        }
      ],
      [
        {
          "x": 38,
          "y": 118
        },
        {
          "x": 88,
          "y": 118
        }
      ],
      [
        {
          "x": 46,
          "y": 118
        },
        {
          "x": 83,
          "y": 118
        }
      ],
      [
        {
          "x": 47,
          "y": 118
        },
        {
          "x": 83,
          "y": 118
        }
      ],
      [
        {
          "x": 57,
          "y": 118
        },
        {
          "x": 73,
          "y": 118
        }
      ],
      [
        {
          "x": 54,
          "y": 118
        },
        {
          "x": 79,
          "y": 118
        }
      ]
    ],
    "handAnchors": [
      {
        "x": 59,
        "y": 72
      },
      {
        "x": 58,
        "y": 74
      },
      {
        "x": 58,
        "y": 70
      },
      {
        "x": 82,
        "y": 69
      },
      {
        "x": 79,
        "y": 77
      },
      {
        "x": 73,
        "y": 80
      },
      {
        "x": 62,
        "y": 81
      },
      {
        "x": 64,
        "y": 81
      }
    ],
    "bladeOrigins": [
      {
        "x": 66,
        "y": 71
      },
      {
        "x": 54,
        "y": 73
      },
      {
        "x": 54,
        "y": 70
      },
      {
        "x": 87,
        "y": 69
      },
      {
        "x": 84,
        "y": 77
      },
      {
        "x": 78,
        "y": 81
      },
      {
        "x": 67,
        "y": 81
      },
      {
        "x": 69,
        "y": 81
      }
    ],
    "tipAnchors": [
      {
        "x": 96,
        "y": 71
      },
      {
        "x": 21,
        "y": 67
      },
      {
        "x": 13,
        "y": 70
      },
      {
        "x": 116,
        "y": 68
      },
      {
        "x": 117,
        "y": 75
      },
      {
        "x": 105,
        "y": 91
      },
      {
        "x": 95,
        "y": 84
      },
      {
        "x": 91,
        "y": 81
      }
    ],
    "bladeAngles": [
      0.0,
      -2.961739153797315,
      3.141592653589793,
      -0.034469100999508014,
      -0.060532019782107135,
      0.35470565201094034,
      0.10673567264913565,
      0.0
    ],
    "bladeLengths": [
      32.0,
      36.26056179729388,
      44.93150684931507,
      32.24137361899313,
      41.981651440803915,
      36.5617271082869,
      35.20031960082181,
      27.5
    ],
    "frameLayout": [
      {
        "x": 0,
        "y": 0,
        "w": 128,
        "h": 128
      },
      {
        "x": 128,
        "y": 0,
        "w": 128,
        "h": 128
      },
      {
        "x": 256,
        "y": 0,
        "w": 128,
        "h": 128
      },
      {
        "x": 384,
        "y": 0,
        "w": 128,
        "h": 128
      },
      {
        "x": 0,
        "y": 128,
        "w": 128,
        "h": 128
      },
      {
        "x": 128,
        "y": 128,
        "w": 128,
        "h": 128
      },
      {
        "x": 256,
        "y": 128,
        "w": 128,
        "h": 128
      },
      {
        "x": 384,
        "y": 128,
        "w": 128,
        "h": 128
      }
    ],
    "provenance": "approved whole-body E sweep, mirrored whole-frame for W only; native A0..3 then B0..3; original other directional sweeps retained"
  },
  "w": {
    "mirrorOf": "e"
  }
});
// END APPROVED FULL-BODY MOTION V2

// BEGIN APPROVED FULL-BODY DIRECTIONS V3
(() => {
  const atlas = window.CHEON_HERO_ATLAS;
  atlas.directionalAnimations.walk = { e: atlas.animations.walk, w: { mirrorOf: "e" } };
  atlas.directionalAnimations.idle = atlas.directionalAnimations.idle || {};
  Object.assign(atlas.directionalAnimations.sweep, {
  "n": {
    "src": "assets/hero-sweep-n-fullbody-v3.png",
    "frameWidth": 128,
    "frameHeight": 128,
    "frames": 8,
    "fps": 14,
    "loop": false,
    "bakedWeapon": true,
    "displayHeight": 80,
    "foot": {
      "x": 64,
      "y": 118
    },
    "frameScales": [
      1.5421686746987953,
      1.5421686746987953,
      1.5421686746987953,
      1.5421686746987953,
      1.7777777777777777,
      1.7777777777777777,
      1.8028169014084507,
      1.7777777777777777
    ],
    "footAnchors": [
      {
        "x": 64,
        "y": 118
      },
      {
        "x": 64,
        "y": 118
      },
      {
        "x": 64,
        "y": 118
      },
      {
        "x": 64,
        "y": 118
      },
      {
        "x": 64,
        "y": 118
      },
      {
        "x": 64,
        "y": 118
      },
      {
        "x": 64,
        "y": 118
      },
      {
        "x": 64,
        "y": 118
      }
    ],
    "contactPoints": [
      [
        {
          "x": 65,
          "y": 118
        }
      ],
      [
        {
          "x": 59,
          "y": 118
        }
      ],
      [
        {
          "x": 63,
          "y": 118
        }
      ],
      [
        {
          "x": 63,
          "y": 118
        }
      ],
      [
        {
          "x": 61,
          "y": 118
        }
      ],
      [
        {
          "x": 65,
          "y": 118
        }
      ],
      [
        {
          "x": 63,
          "y": 118
        }
      ],
      [
        {
          "x": 64,
          "y": 118
        }
      ]
    ],
    "handAnchors": [
      {
        "x": 49,
        "y": 66
      },
      {
        "x": 58,
        "y": 67
      },
      {
        "x": 57,
        "y": 69
      },
      null,
      {
        "x": 80,
        "y": 68
      },
      {
        "x": 83,
        "y": 69
      },
      null,
      null
    ],
    "bladeOrigins": [
      {
        "x": 44,
        "y": 68
      },
      {
        "x": 51,
        "y": 65
      },
      {
        "x": 51,
        "y": 68
      },
      null,
      {
        "x": 85,
        "y": 64
      },
      {
        "x": 88,
        "y": 66
      },
      null,
      null
    ],
    "tipAnchors": [
      {
        "x": 12,
        "y": 75
      },
      {
        "x": 10,
        "y": 64
      },
      {
        "x": 23,
        "y": 64
      },
      {
        "x": 59,
        "y": 24
      },
      {
        "x": 104,
        "y": 50
      },
      {
        "x": 117,
        "y": 60
      },
      null,
      {
        "x": 23,
        "y": 79
      }
    ],
    "bladeAngles": [
      2.926234953892055,
      -3.1172072444170746,
      -2.999695598985629,
      null,
      -0.6350267353903137,
      -0.20401797959254858,
      null,
      null
    ],
    "bladeLengths": [
      31.572702369463514,
      39.529824875970846,
      27.261948190324723,
      null,
      26.2231638249021,
      32.90465087769078,
      null,
      null
    ],
    "socketOccluded": [
      false,
      false,
      false,
      true,
      false,
      false,
      true,
      true
    ],
    "phaseFrames": {
      "anticipation": [
        0,
        2
      ],
      "active": [
        3,
        4
      ],
      "recovery": [
        5,
        7
      ]
    },
    "frameLayout": [
      {
        "x": 0,
        "y": 0,
        "w": 128,
        "h": 128
      },
      {
        "x": 128,
        "y": 0,
        "w": 128,
        "h": 128
      },
      {
        "x": 256,
        "y": 0,
        "w": 128,
        "h": 128
      },
      {
        "x": 384,
        "y": 0,
        "w": 128,
        "h": 128
      },
      {
        "x": 0,
        "y": 128,
        "w": 128,
        "h": 128
      },
      {
        "x": 128,
        "y": 128,
        "w": 128,
        "h": 128
      },
      {
        "x": 256,
        "y": 128,
        "w": 128,
        "h": 128
      },
      {
        "x": 384,
        "y": 128,
        "w": 128,
        "h": 128
      }
    ],
    "provenance": "hero-motion-v3-six-directions/sweep-n-pair-01; native A0..3 then B0..3, original full-frame pixels"
  },
  "ne": {
    "src": "assets/hero-sweep-ne-fullbody-v3.png",
    "frameWidth": 128,
    "frameHeight": 128,
    "frames": 8,
    "fps": 14,
    "loop": false,
    "bakedWeapon": true,
    "displayHeight": 80,
    "foot": {
      "x": 64,
      "y": 118
    },
    "frameScales": [
      1.620253164556962,
      1.641025641025641,
      1.7066666666666668,
      1.6842105263157894,
      1.5609756097560976,
      1.6,
      1.620253164556962,
      1.6
    ],
    "footAnchors": [
      {
        "x": 64,
        "y": 118
      },
      {
        "x": 64,
        "y": 118
      },
      {
        "x": 64,
        "y": 118
      },
      {
        "x": 64,
        "y": 118
      },
      {
        "x": 64,
        "y": 118
      },
      {
        "x": 64,
        "y": 118
      },
      {
        "x": 64,
        "y": 118
      },
      {
        "x": 64,
        "y": 118
      }
    ],
    "contactPoints": [
      [
        {
          "x": 49,
          "y": 118
        },
        {
          "x": 77,
          "y": 118
        }
      ],
      [
        {
          "x": 60,
          "y": 118
        }
      ],
      [
        {
          "x": 50,
          "y": 118
        }
      ],
      [
        {
          "x": 37,
          "y": 118
        },
        {
          "x": 91,
          "y": 118
        }
      ],
      [
        {
          "x": 47,
          "y": 118
        }
      ],
      [
        {
          "x": 64,
          "y": 118
        }
      ],
      [
        {
          "x": 52,
          "y": 118
        },
        {
          "x": 77,
          "y": 118
        }
      ],
      [
        {
          "x": 47,
          "y": 118
        },
        {
          "x": 84,
          "y": 118
        }
      ]
    ],
    "handAnchors": [
      {
        "x": 72,
        "y": 69
      },
      {
        "x": 68,
        "y": 70
      },
      {
        "x": 59,
        "y": 70
      },
      {
        "x": 82,
        "y": 66
      },
      {
        "x": 82,
        "y": 69
      },
      {
        "x": 86,
        "y": 69
      },
      {
        "x": 77,
        "y": 70
      },
      {
        "x": 80,
        "y": 68
      }
    ],
    "bladeOrigins": [
      {
        "x": 78,
        "y": 69
      },
      {
        "x": 73,
        "y": 72
      },
      {
        "x": 54,
        "y": 70
      },
      {
        "x": 87,
        "y": 66
      },
      {
        "x": 87,
        "y": 64
      },
      {
        "x": 91,
        "y": 68
      },
      {
        "x": 82,
        "y": 71
      },
      {
        "x": 85,
        "y": 68
      }
    ],
    "tipAnchors": [
      {
        "x": 112,
        "y": 69
      },
      {
        "x": 108,
        "y": 82
      },
      {
        "x": 30,
        "y": 70
      },
      {
        "x": 116,
        "y": 66
      },
      {
        "x": 110,
        "y": 48
      },
      {
        "x": 117,
        "y": 70
      },
      {
        "x": 114,
        "y": 75
      },
      {
        "x": 117,
        "y": 68
      }
    ],
    "bladeAngles": [
      0.0,
      0.27829965900511133,
      3.141592653589793,
      0.0,
      -0.6078019961139605,
      0.07677189126977804,
      0.12435499454676144,
      0.0
    ],
    "bladeLengths": [
      34.43037974683544,
      37.33389686810522,
      25.6,
      30.526315789473685,
      27.334489221701265,
      26.0768096208106,
      32.65724657538653,
      32.0
    ],
    "socketOccluded": [
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false
    ],
    "phaseFrames": {
      "anticipation": [
        0,
        2
      ],
      "active": [
        3,
        4
      ],
      "recovery": [
        5,
        7
      ]
    },
    "frameLayout": [
      {
        "x": 0,
        "y": 0,
        "w": 128,
        "h": 128
      },
      {
        "x": 128,
        "y": 0,
        "w": 128,
        "h": 128
      },
      {
        "x": 256,
        "y": 0,
        "w": 128,
        "h": 128
      },
      {
        "x": 384,
        "y": 0,
        "w": 128,
        "h": 128
      },
      {
        "x": 0,
        "y": 128,
        "w": 128,
        "h": 128
      },
      {
        "x": 128,
        "y": 128,
        "w": 128,
        "h": 128
      },
      {
        "x": 256,
        "y": 128,
        "w": 128,
        "h": 128
      },
      {
        "x": 384,
        "y": 128,
        "w": 128,
        "h": 128
      }
    ],
    "provenance": "hero-motion-v3-six-directions/sweep-ne-pair-01; native A0..3 then B0..3, original full-frame pixels"
  },
  "s": {
    "src": "assets/hero-sweep-s-fullbody-v3.png",
    "frameWidth": 128,
    "frameHeight": 128,
    "frames": 8,
    "fps": 14,
    "loop": false,
    "bakedWeapon": true,
    "displayHeight": 80,
    "foot": {
      "x": 64,
      "y": 118
    },
    "frameScales": [
      1.4545454545454546,
      1.471264367816092,
      1.471264367816092,
      1.471264367816092,
      1.5238095238095237,
      1.5238095238095237,
      1.5238095238095237,
      1.5058823529411764
    ],
    "footAnchors": [
      {
        "x": 64,
        "y": 118
      },
      {
        "x": 64,
        "y": 118
      },
      {
        "x": 64,
        "y": 118
      },
      {
        "x": 64,
        "y": 118
      },
      {
        "x": 64,
        "y": 118
      },
      {
        "x": 64,
        "y": 118
      },
      {
        "x": 64,
        "y": 118
      },
      {
        "x": 64,
        "y": 118
      }
    ],
    "contactPoints": [
      [
        {
          "x": 57,
          "y": 118
        }
      ],
      [
        {
          "x": 66,
          "y": 118
        }
      ],
      [
        {
          "x": 61,
          "y": 118
        }
      ],
      [
        {
          "x": 66,
          "y": 118
        }
      ],
      [
        {
          "x": 60,
          "y": 118
        }
      ],
      [
        {
          "x": 61,
          "y": 118
        }
      ],
      [
        {
          "x": 62,
          "y": 118
        }
      ],
      [
        {
          "x": 59,
          "y": 118
        }
      ]
    ],
    "handAnchors": [
      {
        "x": 50,
        "y": 68
      },
      {
        "x": 76,
        "y": 67
      },
      {
        "x": 82,
        "y": 68
      },
      {
        "x": 56,
        "y": 68
      },
      {
        "x": 52,
        "y": 71
      },
      {
        "x": 79,
        "y": 70
      },
      {
        "x": 69,
        "y": 71
      },
      {
        "x": 55,
        "y": 71
      }
    ],
    "bladeOrigins": [
      {
        "x": 45,
        "y": 69
      },
      {
        "x": 82,
        "y": 67
      },
      {
        "x": 88,
        "y": 68
      },
      {
        "x": 59,
        "y": 73
      },
      {
        "x": 46,
        "y": 74
      },
      {
        "x": 85,
        "y": 70
      },
      {
        "x": 76,
        "y": 74
      },
      {
        "x": 59,
        "y": 76
      }
    ],
    "tipAnchors": [
      {
        "x": 30,
        "y": 73
      },
      {
        "x": 109,
        "y": 69
      },
      {
        "x": 116,
        "y": 74
      },
      {
        "x": 78,
        "y": 101
      },
      {
        "x": 16,
        "y": 88
      },
      {
        "x": 117,
        "y": 74
      },
      {
        "x": 101,
        "y": 80
      },
      {
        "x": 79,
        "y": 94
      }
    ],
    "bladeAngles": [
      2.8809902618424523,
      0.07393903765794034,
      0.21109333322274654,
      0.9745971854974165,
      2.704965493776252,
      0.12435499454676144,
      0.23554498072086333,
      0.7328151017865066
    ],
    "bladeLengths": [
      14.112886087509112,
      24.89560711849358,
      26.33162494395651,
      31.115263109312423,
      31.52941972808923,
      30.713362850661138,
      24.485638347014174,
      25.324468794491686
    ],
    "socketOccluded": [
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false
    ],
    "phaseFrames": {
      "anticipation": [
        0,
        2
      ],
      "active": [
        3,
        4
      ],
      "recovery": [
        5,
        7
      ]
    },
    "frameLayout": [
      {
        "x": 0,
        "y": 0,
        "w": 128,
        "h": 128
      },
      {
        "x": 128,
        "y": 0,
        "w": 128,
        "h": 128
      },
      {
        "x": 256,
        "y": 0,
        "w": 128,
        "h": 128
      },
      {
        "x": 384,
        "y": 0,
        "w": 128,
        "h": 128
      },
      {
        "x": 0,
        "y": 128,
        "w": 128,
        "h": 128
      },
      {
        "x": 128,
        "y": 128,
        "w": 128,
        "h": 128
      },
      {
        "x": 256,
        "y": 128,
        "w": 128,
        "h": 128
      },
      {
        "x": 384,
        "y": 128,
        "w": 128,
        "h": 128
      }
    ],
    "provenance": "hero-motion-v3-six-directions/sweep-s-pair-01; native A0..3 then B0..3, original full-frame pixels"
  },
  "se": {
    "src": "assets/hero-sweep-se-fullbody-v3.png",
    "frameWidth": 128,
    "frameHeight": 128,
    "frames": 8,
    "fps": 14,
    "loop": false,
    "bakedWeapon": true,
    "displayHeight": 80,
    "foot": {
      "x": 64,
      "y": 118
    },
    "frameScales": [
      1.2307692307692308,
      1.2427184466019416,
      1.2673267326732673,
      1.2673267326732673,
      1.4883720930232558,
      1.5421686746987953,
      1.4883720930232558,
      1.4883720930232558
    ],
    "footAnchors": [
      {
        "x": 64,
        "y": 118
      },
      {
        "x": 64,
        "y": 118
      },
      {
        "x": 64,
        "y": 118
      },
      {
        "x": 64,
        "y": 118
      },
      {
        "x": 64,
        "y": 118
      },
      {
        "x": 64,
        "y": 118
      },
      {
        "x": 64,
        "y": 118
      },
      {
        "x": 64,
        "y": 118
      }
    ],
    "contactPoints": [
      [
        {
          "x": 55,
          "y": 118
        }
      ],
      [
        {
          "x": 66,
          "y": 118
        }
      ],
      [
        {
          "x": 58,
          "y": 118
        }
      ],
      [
        {
          "x": 80,
          "y": 118
        }
      ],
      [
        {
          "x": 63,
          "y": 118
        }
      ],
      [
        {
          "x": 65,
          "y": 118
        }
      ],
      [
        {
          "x": 64,
          "y": 118
        }
      ],
      [
        {
          "x": 56,
          "y": 118
        }
      ]
    ],
    "handAnchors": [
      {
        "x": 58,
        "y": 62
      },
      {
        "x": 74,
        "y": 57
      },
      {
        "x": 53,
        "y": 58
      },
      {
        "x": 75,
        "y": 58
      },
      {
        "x": 52,
        "y": 67
      },
      {
        "x": 75,
        "y": 73
      },
      {
        "x": 65,
        "y": 68
      },
      {
        "x": 52,
        "y": 75
      }
    ],
    "bladeOrigins": [
      {
        "x": 52,
        "y": 66
      },
      {
        "x": 81,
        "y": 58
      },
      {
        "x": 59,
        "y": 60
      },
      {
        "x": 81,
        "y": 64
      },
      {
        "x": 47,
        "y": 71
      },
      {
        "x": 81,
        "y": 76
      },
      {
        "x": 72,
        "y": 70
      },
      {
        "x": 47,
        "y": 77
      }
    ],
    "tipAnchors": [
      {
        "x": 25,
        "y": 76
      },
      {
        "x": 109,
        "y": 61
      },
      {
        "x": 96,
        "y": 67
      },
      {
        "x": 117,
        "y": 91
      },
      {
        "x": 10,
        "y": 97
      },
      {
        "x": 113,
        "y": 89
      },
      {
        "x": 106,
        "y": 74
      },
      {
        "x": 31,
        "y": 84
      }
    ],
    "bladeAngles": [
      2.7868870015788527,
      0.10673567264913565,
      0.1869792699189111,
      0.6435011087932844,
      2.52905509697949,
      0.38588266939807375,
      0.11710874456686428,
      2.729182211992406
    ],
    "bladeLengths": [
      22.147969305981487,
      21.87204324711258,
      29.826804568337003,
      35.64356435643565,
      42.06667555198145,
      33.291404412858874,
      31.846033057904542,
      16.2458132061144
    ],
    "socketOccluded": [
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false
    ],
    "phaseFrames": {
      "anticipation": [
        0,
        2
      ],
      "active": [
        3,
        4
      ],
      "recovery": [
        5,
        7
      ]
    },
    "frameLayout": [
      {
        "x": 0,
        "y": 0,
        "w": 128,
        "h": 128
      },
      {
        "x": 128,
        "y": 0,
        "w": 128,
        "h": 128
      },
      {
        "x": 256,
        "y": 0,
        "w": 128,
        "h": 128
      },
      {
        "x": 384,
        "y": 0,
        "w": 128,
        "h": 128
      },
      {
        "x": 0,
        "y": 128,
        "w": 128,
        "h": 128
      },
      {
        "x": 128,
        "y": 128,
        "w": 128,
        "h": 128
      },
      {
        "x": 256,
        "y": 128,
        "w": 128,
        "h": 128
      },
      {
        "x": 384,
        "y": 128,
        "w": 128,
        "h": 128
      }
    ],
    "provenance": "hero-motion-v3-six-directions/sweep-se-pair-02; native A0..3 then B0..3, original full-frame pixels"
  },
  "nw": {
    "mirrorOf": "ne"
  },
  "sw": {
    "mirrorOf": "se"
  }
});
  Object.assign(atlas.directionalAnimations.walk, {
  "n": {
    "src": "assets/hero-walk-n-fullbody-v3.png",
    "frameWidth": 128,
    "frameHeight": 128,
    "frames": 8,
    "fps": 12,
    "loop": true,
    "bakedWeapon": true,
    "displayHeight": 80,
    "frameScales": [
      1.4545454545454546,
      1.4545454545454546,
      1.4545454545454546,
      1.4545454545454546,
      1.2549019607843137,
      1.2549019607843137,
      1.2549019607843137,
      1.2549019607843137
    ],
    "foot": {
      "x": 64,
      "y": 118
    },
    "footAnchors": [
      {
        "x": 64,
        "y": 118
      },
      {
        "x": 64,
        "y": 118
      },
      {
        "x": 64,
        "y": 118
      },
      {
        "x": 64,
        "y": 118
      },
      {
        "x": 64,
        "y": 118
      },
      {
        "x": 64,
        "y": 118
      },
      {
        "x": 64,
        "y": 118
      },
      {
        "x": 64,
        "y": 118
      }
    ],
    "contactPoints": [
      [
        {
          "x": 62,
          "y": 118
        }
      ],
      [
        {
          "x": 61,
          "y": 118
        }
      ],
      [
        {
          "x": 61,
          "y": 118
        },
        {
          "x": 67,
          "y": 118
        }
      ],
      [
        {
          "x": 63,
          "y": 118
        },
        {
          "x": 67,
          "y": 112
        }
      ],
      [
        {
          "x": 66,
          "y": 118
        }
      ],
      [
        {
          "x": 59,
          "y": 118
        }
      ],
      [
        {
          "x": 64,
          "y": 118
        }
      ],
      [
        {
          "x": 62,
          "y": 118
        }
      ]
    ],
    "frameLayout": [
      {
        "x": 0,
        "y": 0,
        "w": 128,
        "h": 128
      },
      {
        "x": 128,
        "y": 0,
        "w": 128,
        "h": 128
      },
      {
        "x": 256,
        "y": 0,
        "w": 128,
        "h": 128
      },
      {
        "x": 384,
        "y": 0,
        "w": 128,
        "h": 128
      },
      {
        "x": 0,
        "y": 128,
        "w": 128,
        "h": 128
      },
      {
        "x": 128,
        "y": 128,
        "w": 128,
        "h": 128
      },
      {
        "x": 256,
        "y": 128,
        "w": 128,
        "h": 128
      },
      {
        "x": 384,
        "y": 128,
        "w": 128,
        "h": 128
      }
    ],
    "provenance": "hero-motion-v3-six-directions/walk-n-pair-03; eight native whole-body frames in original order, common row scale"
  },
  "ne": {
    "src": "assets/hero-walk-ne-fullbody-v3.png",
    "frameWidth": 128,
    "frameHeight": 128,
    "frames": 8,
    "fps": 12,
    "loop": true,
    "bakedWeapon": true,
    "displayHeight": 80,
    "frameScales": [
      1.1851851851851851,
      1.1851851851851851,
      1.1851851851851851,
      1.1851851851851851,
      1.1851851851851851,
      1.1851851851851851,
      1.1851851851851851,
      1.1851851851851851
    ],
    "foot": {
      "x": 64,
      "y": 118
    },
    "footAnchors": [
      {
        "x": 64,
        "y": 118
      },
      {
        "x": 64,
        "y": 118
      },
      {
        "x": 64,
        "y": 118
      },
      {
        "x": 64,
        "y": 118
      },
      {
        "x": 64,
        "y": 118
      },
      {
        "x": 64,
        "y": 118
      },
      {
        "x": 64,
        "y": 118
      },
      {
        "x": 64,
        "y": 118
      }
    ],
    "contactPoints": [
      [
        {
          "x": 46,
          "y": 118
        },
        {
          "x": 77,
          "y": 116
        }
      ],
      [
        {
          "x": 63,
          "y": 118
        }
      ],
      [
        {
          "x": 63,
          "y": 118
        }
      ],
      [
        {
          "x": 50,
          "y": 118
        }
      ],
      [
        {
          "x": 47,
          "y": 118
        },
        {
          "x": 77,
          "y": 116
        }
      ],
      [
        {
          "x": 65,
          "y": 118
        }
      ],
      [
        {
          "x": 62,
          "y": 118
        }
      ],
      [
        {
          "x": 47,
          "y": 118
        },
        {
          "x": 77,
          "y": 116
        }
      ]
    ],
    "frameLayout": [
      {
        "x": 0,
        "y": 0,
        "w": 128,
        "h": 128
      },
      {
        "x": 128,
        "y": 0,
        "w": 128,
        "h": 128
      },
      {
        "x": 256,
        "y": 0,
        "w": 128,
        "h": 128
      },
      {
        "x": 384,
        "y": 0,
        "w": 128,
        "h": 128
      },
      {
        "x": 512,
        "y": 0,
        "w": 128,
        "h": 128
      },
      {
        "x": 640,
        "y": 0,
        "w": 128,
        "h": 128
      },
      {
        "x": 768,
        "y": 0,
        "w": 128,
        "h": 128
      },
      {
        "x": 896,
        "y": 0,
        "w": 128,
        "h": 128
      }
    ],
    "provenance": "hero-motion-v3-six-directions/walk-ne-01; eight native whole-body frames in original order, common row scale"
  },
  "s": {
    "src": "assets/hero-walk-s-fullbody-v3.png",
    "frameWidth": 128,
    "frameHeight": 128,
    "frames": 8,
    "fps": 12,
    "loop": true,
    "bakedWeapon": true,
    "displayHeight": 80,
    "frameScales": [
      1.1851851851851851,
      1.1851851851851851,
      1.1851851851851851,
      1.1851851851851851,
      1.1851851851851851,
      1.1851851851851851,
      1.1851851851851851,
      1.1851851851851851
    ],
    "foot": {
      "x": 64,
      "y": 118
    },
    "footAnchors": [
      {
        "x": 64,
        "y": 118
      },
      {
        "x": 64,
        "y": 118
      },
      {
        "x": 64,
        "y": 118
      },
      {
        "x": 64,
        "y": 118
      },
      {
        "x": 64,
        "y": 118
      },
      {
        "x": 64,
        "y": 118
      },
      {
        "x": 64,
        "y": 118
      },
      {
        "x": 64,
        "y": 118
      }
    ],
    "contactPoints": [
      [
        {
          "x": 61,
          "y": 118
        }
      ],
      [
        {
          "x": 63,
          "y": 118
        }
      ],
      [
        {
          "x": 64,
          "y": 118
        }
      ],
      [
        {
          "x": 61,
          "y": 110
        },
        {
          "x": 69,
          "y": 118
        }
      ],
      [
        {
          "x": 62,
          "y": 118
        }
      ],
      [
        {
          "x": 66,
          "y": 118
        }
      ],
      [
        {
          "x": 67,
          "y": 118
        }
      ],
      [
        {
          "x": 68,
          "y": 118
        }
      ]
    ],
    "frameLayout": [
      {
        "x": 0,
        "y": 0,
        "w": 128,
        "h": 128
      },
      {
        "x": 128,
        "y": 0,
        "w": 128,
        "h": 128
      },
      {
        "x": 256,
        "y": 0,
        "w": 128,
        "h": 128
      },
      {
        "x": 384,
        "y": 0,
        "w": 128,
        "h": 128
      },
      {
        "x": 0,
        "y": 128,
        "w": 128,
        "h": 128
      },
      {
        "x": 128,
        "y": 128,
        "w": 128,
        "h": 128
      },
      {
        "x": 256,
        "y": 128,
        "w": 128,
        "h": 128
      },
      {
        "x": 384,
        "y": 128,
        "w": 128,
        "h": 128
      }
    ],
    "provenance": "hero-motion-v3-six-directions/walk-s-pair-03; eight native whole-body frames in original order, common row scale"
  },
  "se": {
    "src": "assets/hero-walk-se-fullbody-v3.png",
    "frameWidth": 128,
    "frameHeight": 128,
    "frames": 8,
    "fps": 12,
    "loop": true,
    "bakedWeapon": true,
    "displayHeight": 80,
    "frameScales": [
      1.1851851851851851,
      1.1851851851851851,
      1.1851851851851851,
      1.1851851851851851,
      1.1851851851851851,
      1.1851851851851851,
      1.1851851851851851,
      1.1851851851851851
    ],
    "foot": {
      "x": 64,
      "y": 118
    },
    "footAnchors": [
      {
        "x": 64,
        "y": 118
      },
      {
        "x": 64,
        "y": 118
      },
      {
        "x": 64,
        "y": 118
      },
      {
        "x": 64,
        "y": 118
      },
      {
        "x": 64,
        "y": 118
      },
      {
        "x": 64,
        "y": 118
      },
      {
        "x": 64,
        "y": 118
      },
      {
        "x": 64,
        "y": 118
      }
    ],
    "contactPoints": [
      [
        {
          "x": 56,
          "y": 118
        }
      ],
      [
        {
          "x": 69,
          "y": 118
        }
      ],
      [
        {
          "x": 48,
          "y": 118
        },
        {
          "x": 81,
          "y": 118
        }
      ],
      [
        {
          "x": 46,
          "y": 116
        },
        {
          "x": 84,
          "y": 118
        }
      ],
      [
        {
          "x": 74,
          "y": 118
        }
      ],
      [
        {
          "x": 71,
          "y": 118
        }
      ],
      [
        {
          "x": 74,
          "y": 118
        }
      ],
      [
        {
          "x": 85,
          "y": 118
        }
      ]
    ],
    "frameLayout": [
      {
        "x": 0,
        "y": 0,
        "w": 128,
        "h": 128
      },
      {
        "x": 128,
        "y": 0,
        "w": 128,
        "h": 128
      },
      {
        "x": 256,
        "y": 0,
        "w": 128,
        "h": 128
      },
      {
        "x": 384,
        "y": 0,
        "w": 128,
        "h": 128
      },
      {
        "x": 0,
        "y": 128,
        "w": 128,
        "h": 128
      },
      {
        "x": 128,
        "y": 128,
        "w": 128,
        "h": 128
      },
      {
        "x": 256,
        "y": 128,
        "w": 128,
        "h": 128
      },
      {
        "x": 384,
        "y": 128,
        "w": 128,
        "h": 128
      }
    ],
    "provenance": "hero-motion-v3-six-directions/walk-se-pair-03; eight native whole-body frames in original order, common row scale"
  },
  "nw": {
    "mirrorOf": "ne"
  },
  "sw": {
    "mirrorOf": "se"
  }
});
  Object.assign(atlas.directionalAnimations.idle, {
  "e": {
    "src": "assets/hero-walk-fullbody-v2.png",
    "frameWidth": 128,
    "frameHeight": 128,
    "frames": 1,
    "fps": 1,
    "loop": true,
    "bakedWeapon": true,
    "displayHeight": 94.81481481481481,
    "foot": {
      "x": 64,
      "y": 118
    },
    "contactPoints": [
      [
        {
          "x": 40,
          "y": 118
        },
        {
          "x": 88,
          "y": 118
        }
      ]
    ],
    "frameLayout": [
      {
        "x": 0,
        "y": 0,
        "w": 128,
        "h": 128
      }
    ],
    "sourceIdleFrame": 0,
    "provenance": "approved hero-motion-v2 E walk contact frame0, fixed intact source frame; original idle PNG retained"
  },
  "w": {
    "mirrorOf": "e"
  },
  "n": {
    "src": "assets/hero-walk-n-fullbody-v3.png",
    "frameWidth": 128,
    "frameHeight": 128,
    "frames": 1,
    "fps": 1,
    "loop": true,
    "bakedWeapon": true,
    "displayHeight": 80,
    "frameScales": [
      1.4545454545454546
    ],
    "foot": {
      "x": 64,
      "y": 118
    },
    "footAnchors": [
      {
        "x": 64,
        "y": 118
      }
    ],
    "contactPoints": [
      [
        {
          "x": 63,
          "y": 118
        },
        {
          "x": 67,
          "y": 112
        }
      ]
    ],
    "frameLayout": [
      {
        "x": 384,
        "y": 0,
        "w": 128,
        "h": 128
      }
    ],
    "provenance": "hero-motion-v3-six-directions/walk-n-pair-03; eight native whole-body frames in original order, common row scale; one accepted full contact pose, no synthetic breathing",
    "sourceIdleFrame": 3
  },
  "ne": {
    "src": "assets/hero-walk-ne-fullbody-v3.png",
    "frameWidth": 128,
    "frameHeight": 128,
    "frames": 1,
    "fps": 1,
    "loop": true,
    "bakedWeapon": true,
    "displayHeight": 80,
    "frameScales": [
      1.1851851851851851
    ],
    "foot": {
      "x": 64,
      "y": 118
    },
    "footAnchors": [
      {
        "x": 64,
        "y": 118
      }
    ],
    "contactPoints": [
      [
        {
          "x": 46,
          "y": 118
        },
        {
          "x": 77,
          "y": 116
        }
      ]
    ],
    "frameLayout": [
      {
        "x": 0,
        "y": 0,
        "w": 128,
        "h": 128
      }
    ],
    "provenance": "hero-motion-v3-six-directions/walk-ne-01; eight native whole-body frames in original order, common row scale; one accepted full contact pose, no synthetic breathing",
    "sourceIdleFrame": 0
  },
  "s": {
    "src": "assets/hero-walk-s-fullbody-v3.png",
    "frameWidth": 128,
    "frameHeight": 128,
    "frames": 1,
    "fps": 1,
    "loop": true,
    "bakedWeapon": true,
    "displayHeight": 80,
    "frameScales": [
      1.1851851851851851
    ],
    "foot": {
      "x": 64,
      "y": 118
    },
    "footAnchors": [
      {
        "x": 64,
        "y": 118
      }
    ],
    "contactPoints": [
      [
        {
          "x": 61,
          "y": 110
        },
        {
          "x": 69,
          "y": 118
        }
      ]
    ],
    "frameLayout": [
      {
        "x": 384,
        "y": 0,
        "w": 128,
        "h": 128
      }
    ],
    "provenance": "hero-motion-v3-six-directions/walk-s-pair-03; eight native whole-body frames in original order, common row scale; one accepted full contact pose, no synthetic breathing",
    "sourceIdleFrame": 3
  },
  "se": {
    "src": "assets/hero-walk-se-fullbody-v3.png",
    "frameWidth": 128,
    "frameHeight": 128,
    "frames": 1,
    "fps": 1,
    "loop": true,
    "bakedWeapon": true,
    "displayHeight": 80,
    "frameScales": [
      1.1851851851851851
    ],
    "foot": {
      "x": 64,
      "y": 118
    },
    "footAnchors": [
      {
        "x": 64,
        "y": 118
      }
    ],
    "contactPoints": [
      [
        {
          "x": 46,
          "y": 116
        },
        {
          "x": 84,
          "y": 118
        }
      ]
    ],
    "frameLayout": [
      {
        "x": 384,
        "y": 0,
        "w": 128,
        "h": 128
      }
    ],
    "provenance": "hero-motion-v3-six-directions/walk-se-pair-03; eight native whole-body frames in original order, common row scale; one accepted full contact pose, no synthetic breathing",
    "sourceIdleFrame": 3
  },
  "nw": {
    "mirrorOf": "ne"
  },
  "sw": {
    "mirrorOf": "se"
  }
});
})();
// END APPROVED FULL-BODY DIRECTIONS V3
