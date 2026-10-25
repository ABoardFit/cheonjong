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

// BEGIN APPROVED FULL-BODY ATTACK V4
(() => {
  const atlas = window.CHEON_HERO_ATLAS;
  atlas.directionalAnimations = atlas.directionalAnimations || {};
  atlas.directionalAnimations.stab = {
  "e": {
    "src": "assets/hero-stab-e-fullbody-v4.png",
    "frameWidth": 128,
    "frameHeight": 128,
    "frames": 12,
    "fps": 16,
    "loop": false,
    "bakedWeapon": true,
    "fullBodyGait": true,
    "displayHeight": 80,
    "foot": {
      "x": 64,
      "y": 120
    },
    "phaseFrames": {
      "anticipation": [
        0,
        2
      ],
      "active": [
        3,
        7
      ],
      "recovery": [
        8,
        11
      ]
    },
    "phaseRangeConvention": "inclusive",
    "contactSmearFrames": [],
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
      },
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
      }
    ],
    "footAnchors": [
      {
        "x": 64,
        "y": 120
      },
      {
        "x": 64,
        "y": 120
      },
      {
        "x": 64,
        "y": 120
      },
      {
        "x": 64,
        "y": 120
      },
      {
        "x": 64,
        "y": 120
      },
      {
        "x": 64,
        "y": 120
      },
      {
        "x": 64,
        "y": 120
      },
      {
        "x": 64,
        "y": 120
      },
      {
        "x": 64,
        "y": 120
      },
      {
        "x": 64,
        "y": 119
      },
      {
        "x": 64,
        "y": 120
      },
      {
        "x": 64,
        "y": 120
      }
    ],
    "frameScales": [
      1.77778,
      1.80282,
      1.80282,
      1.80282,
      2.66667,
      2.7234,
      2.66667,
      2.66667,
      1.70667,
      1.72973,
      1.70667,
      1.70667
    ],
    "handAnchors": [
      {
        "x": 62.0,
        "y": 76.75
      },
      {
        "x": 54.0,
        "y": 75.5
      },
      {
        "x": 63.38,
        "y": 76.75
      },
      {
        "x": 87.78,
        "y": 71.78
      },
      {
        "x": 84.0,
        "y": 88.5
      },
      {
        "x": 88.5,
        "y": 86.5
      },
      {
        "x": 83.0,
        "y": 88.0
      },
      {
        "x": 71.0,
        "y": 87.5
      },
      {
        "x": 83.0,
        "y": 71.5
      },
      {
        "x": 74.0,
        "y": 73.43
      },
      {
        "x": 61.83,
        "y": 74.67
      },
      {
        "x": 62.5,
        "y": 74.33
      }
    ],
    "bladeOrigins": [
      {
        "x": 67.0,
        "y": 76.75
      },
      {
        "x": 59.0,
        "y": 75.5
      },
      {
        "x": 68.38,
        "y": 76.75
      },
      {
        "x": 92.78,
        "y": 71.78
      },
      {
        "x": 89.0,
        "y": 88.5
      },
      {
        "x": 93.5,
        "y": 86.5
      },
      {
        "x": 88.0,
        "y": 88.0
      },
      {
        "x": 76.0,
        "y": 87.5
      },
      {
        "x": 88.0,
        "y": 71.5
      },
      {
        "x": 79.0,
        "y": 73.43
      },
      {
        "x": 66.83,
        "y": 74.67
      },
      {
        "x": 67.5,
        "y": 74.33
      }
    ],
    "tipAnchors": [
      {
        "x": 97.0,
        "y": 77.0
      },
      {
        "x": 94.0,
        "y": 77.0
      },
      {
        "x": 108.0,
        "y": 77.0
      },
      {
        "x": 117.0,
        "y": 72.0
      },
      {
        "x": 110.0,
        "y": 89.0
      },
      {
        "x": 117.0,
        "y": 87.0
      },
      {
        "x": 114.0,
        "y": 88.0
      },
      {
        "x": 99.0,
        "y": 88.0
      },
      {
        "x": 118.0,
        "y": 73.0
      },
      {
        "x": 104.0,
        "y": 73.0
      },
      {
        "x": 99.0,
        "y": 75.0
      },
      {
        "x": 101.0,
        "y": 75.0
      }
    ],
    "bladeAngles": [
      0.00833,
      0.04283,
      0.00631,
      0.00908,
      0.02381,
      0.02127,
      0.0,
      0.02174,
      0.04996,
      -0.0172,
      0.01026,
      0.02
    ],
    "bladeLengths": [
      33.334,
      39.473,
      44.643,
      27.291,
      35.01,
      40.009,
      43.333,
      38.342,
      32.04,
      27.031,
      34.316,
      35.74
    ],
    "contactPoints": [
      [
        {
          "x": 44.0,
          "y": 120
        },
        {
          "x": 81.0,
          "y": 120
        }
      ],
      [
        {
          "x": 46.5,
          "y": 120
        },
        {
          "x": 79.5,
          "y": 120
        }
      ],
      [
        {
          "x": 43.5,
          "y": 120
        },
        {
          "x": 82.5,
          "y": 120
        }
      ],
      [
        {
          "x": 38.0,
          "y": 120
        },
        {
          "x": 90.0,
          "y": 120
        }
      ],
      [
        {
          "x": 45.0,
          "y": 120
        },
        {
          "x": 80.5,
          "y": 120
        }
      ],
      [
        {
          "x": 40.0,
          "y": 120
        },
        {
          "x": 87.5,
          "y": 120
        }
      ],
      [
        {
          "x": 43.0,
          "y": 120
        },
        {
          "x": 83.0,
          "y": 120
        }
      ],
      [
        {
          "x": 48.0,
          "y": 120
        },
        {
          "x": 79.5,
          "y": 120
        }
      ],
      [
        {
          "x": 42.5,
          "y": 120
        },
        {
          "x": 86.0,
          "y": 120
        }
      ],
      [
        {
          "x": 43.5,
          "y": 119
        },
        {
          "x": 86.0,
          "y": 119
        }
      ],
      [
        {
          "x": 47.0,
          "y": 120
        },
        {
          "x": 81.5,
          "y": 120
        }
      ],
      [
        {
          "x": 44.0,
          "y": 120
        },
        {
          "x": 83.0,
          "y": 120
        }
      ]
    ],
    "provenance": "Built-in image_gen complete native full-body drawings; sprite-gen component extraction and nearest row fit; canonical pixels unchanged; body-to-boot calibration independent of blade bounds"
  },
  "n": {
    "src": "assets/hero-stab-n-fullbody-v4.png",
    "frameWidth": 128,
    "frameHeight": 128,
    "frames": 12,
    "fps": 16,
    "loop": false,
    "bakedWeapon": true,
    "fullBodyGait": true,
    "displayHeight": 80,
    "foot": {
      "x": 64,
      "y": 120
    },
    "phaseFrames": {
      "anticipation": [
        0,
        2
      ],
      "active": [
        3,
        7
      ],
      "recovery": [
        8,
        11
      ]
    },
    "phaseRangeConvention": "inclusive",
    "contactSmearFrames": [],
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
      },
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
      }
    ],
    "footAnchors": [
      {
        "x": 64,
        "y": 119
      },
      {
        "x": 64,
        "y": 119
      },
      {
        "x": 64,
        "y": 119
      },
      {
        "x": 64,
        "y": 119
      },
      {
        "x": 64,
        "y": 119
      },
      {
        "x": 64,
        "y": 119
      },
      {
        "x": 64,
        "y": 119
      },
      {
        "x": 64,
        "y": 119
      },
      {
        "x": 64,
        "y": 120
      },
      {
        "x": 64,
        "y": 120
      },
      {
        "x": 64,
        "y": 120
      },
      {
        "x": 64,
        "y": 120
      }
    ],
    "frameScales": [
      1.56098,
      1.54217,
      1.56098,
      1.47126,
      1.52381,
      1.66234,
      1.66234,
      1.66234,
      1.37634,
      1.37634,
      1.3617,
      1.37634
    ],
    "handAnchors": [
      {
        "x": 44.24,
        "y": 71.57
      },
      {
        "x": 42.71,
        "y": 72.43
      },
      {
        "x": 44.14,
        "y": 62.86
      },
      {
        "x": 51.09,
        "y": 41.35
      },
      {
        "x": 55.0,
        "y": 42.0
      },
      {
        "x": 54.62,
        "y": 37.52
      },
      {
        "x": 54.3,
        "y": 41.8
      },
      {
        "x": 55.62,
        "y": 47.31
      },
      {
        "x": 46.4,
        "y": 43.1
      },
      {
        "x": 46.3,
        "y": 45.5
      },
      {
        "x": 38.92,
        "y": 63.54
      },
      {
        "x": 38.76,
        "y": 69.0
      }
    ],
    "bladeOrigins": [
      {
        "x": 44.24,
        "y": 66.57
      },
      {
        "x": 42.71,
        "y": 67.43
      },
      {
        "x": 44.14,
        "y": 57.86
      },
      {
        "x": 51.09,
        "y": 36.35
      },
      {
        "x": 55.0,
        "y": 37.0
      },
      {
        "x": 54.62,
        "y": 32.52
      },
      {
        "x": 54.3,
        "y": 36.8
      },
      {
        "x": 55.62,
        "y": 42.31
      },
      {
        "x": 46.4,
        "y": 38.1
      },
      {
        "x": 46.3,
        "y": 40.5
      },
      {
        "x": 38.92,
        "y": 58.54
      },
      {
        "x": 38.76,
        "y": 64.0
      }
    ],
    "tipAnchors": [
      {
        "x": 45.0,
        "y": 35.0
      },
      {
        "x": 44.0,
        "y": 34.0
      },
      {
        "x": 44.0,
        "y": 33.0
      },
      {
        "x": 51.0,
        "y": 10.0
      },
      {
        "x": 54.0,
        "y": 15.0
      },
      {
        "x": 55.0,
        "y": 12.0
      },
      {
        "x": 52.0,
        "y": 16.0
      },
      {
        "x": 54.0,
        "y": 18.0
      },
      {
        "x": 45.0,
        "y": 11.0
      },
      {
        "x": 44.0,
        "y": 11.0
      },
      {
        "x": 40.0,
        "y": 23.0
      },
      {
        "x": 40.0,
        "y": 26.0
      }
    ],
    "bladeAngles": [
      -1.54673,
      -1.53223,
      -1.57643,
      -1.57421,
      -1.61622,
      -1.55228,
      -1.68093,
      -1.63734,
      -1.62241,
      -1.64861,
      -1.54042,
      -1.53818
    ],
    "bladeLengths": [
      30.809,
      32.246,
      24.254,
      24.23,
      20.974,
      21.323,
      21.742,
      25.313,
      23.343,
      25.453,
      30.261,
      32.706
    ],
    "contactPoints": [
      [
        {
          "x": 63.5,
          "y": 119
        }
      ],
      [
        {
          "x": 62.0,
          "y": 119
        }
      ],
      [
        {
          "x": 61.5,
          "y": 119
        }
      ],
      [
        {
          "x": 63.0,
          "y": 119
        }
      ],
      [
        {
          "x": 62.5,
          "y": 119
        }
      ],
      [
        {
          "x": 60.5,
          "y": 119
        }
      ],
      [
        {
          "x": 62.0,
          "y": 119
        }
      ],
      [
        {
          "x": 62.0,
          "y": 119
        }
      ],
      [
        {
          "x": 60.5,
          "y": 120
        }
      ],
      [
        {
          "x": 62.5,
          "y": 120
        }
      ],
      [
        {
          "x": 61.5,
          "y": 120
        }
      ],
      [
        {
          "x": 62.5,
          "y": 120
        }
      ]
    ],
    "provenance": "Built-in image_gen complete native full-body drawings; sprite-gen component extraction and nearest row fit; canonical pixels unchanged; body-to-boot calibration independent of blade bounds"
  },
  "s": {
    "src": "assets/hero-stab-s-fullbody-v4.png",
    "frameWidth": 128,
    "frameHeight": 128,
    "frames": 12,
    "fps": 16,
    "loop": false,
    "bakedWeapon": true,
    "fullBodyGait": true,
    "displayHeight": 80,
    "foot": {
      "x": 64,
      "y": 120
    },
    "phaseFrames": {
      "anticipation": [
        0,
        2
      ],
      "active": [
        3,
        7
      ],
      "recovery": [
        8,
        11
      ]
    },
    "phaseRangeConvention": "inclusive",
    "contactSmearFrames": [],
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
      },
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
      }
    ],
    "footAnchors": [
      {
        "x": 64,
        "y": 120
      },
      {
        "x": 64,
        "y": 120
      },
      {
        "x": 64,
        "y": 120
      },
      {
        "x": 64,
        "y": 112
      },
      {
        "x": 64,
        "y": 109
      },
      {
        "x": 64,
        "y": 109
      },
      {
        "x": 64,
        "y": 109
      },
      {
        "x": 64,
        "y": 120
      },
      {
        "x": 64,
        "y": 120
      },
      {
        "x": 64,
        "y": 120
      },
      {
        "x": 64,
        "y": 120
      },
      {
        "x": 64,
        "y": 120
      }
    ],
    "frameScales": [
      1.15315,
      1.15315,
      1.20755,
      1.23077,
      1.28,
      1.26733,
      1.28,
      1.21905,
      1.16364,
      1.15315,
      1.14286,
      1.14286
    ],
    "handAnchors": [
      {
        "x": 68.0,
        "y": 46.75
      },
      {
        "x": 69.0,
        "y": 49.56
      },
      {
        "x": 69.5,
        "y": 63.33
      },
      {
        "x": 69.22,
        "y": 65.06
      },
      {
        "x": 73.48,
        "y": 69.95
      },
      {
        "x": 69.4,
        "y": 70.73
      },
      {
        "x": 70.19,
        "y": 70.62
      },
      {
        "x": 71.78,
        "y": 67.44
      },
      {
        "x": 69.91,
        "y": 61.64
      },
      {
        "x": 68.44,
        "y": 51.11
      },
      {
        "x": 69.4,
        "y": 49.8
      },
      {
        "x": 68.9,
        "y": 47.9
      }
    ],
    "bladeOrigins": [
      {
        "x": 68.0,
        "y": 51.75
      },
      {
        "x": 69.0,
        "y": 54.56
      },
      {
        "x": 69.5,
        "y": 68.33
      },
      {
        "x": 69.22,
        "y": 70.06
      },
      {
        "x": 73.48,
        "y": 74.95
      },
      {
        "x": 69.4,
        "y": 75.73
      },
      {
        "x": 70.19,
        "y": 75.62
      },
      {
        "x": 71.78,
        "y": 72.44
      },
      {
        "x": 69.91,
        "y": 66.64
      },
      {
        "x": 68.44,
        "y": 56.11
      },
      {
        "x": 69.4,
        "y": 54.8
      },
      {
        "x": 68.9,
        "y": 52.9
      }
    ],
    "tipAnchors": [
      {
        "x": 68.0,
        "y": 87.0
      },
      {
        "x": 68.0,
        "y": 88.0
      },
      {
        "x": 69.0,
        "y": 99.0
      },
      {
        "x": 70.0,
        "y": 117.0
      },
      {
        "x": 73.0,
        "y": 117.0
      },
      {
        "x": 69.0,
        "y": 117.0
      },
      {
        "x": 70.0,
        "y": 117.0
      },
      {
        "x": 71.0,
        "y": 117.0
      },
      {
        "x": 69.0,
        "y": 101.0
      },
      {
        "x": 70.0,
        "y": 92.0
      },
      {
        "x": 70.0,
        "y": 89.0
      },
      {
        "x": 70.0,
        "y": 89.0
      }
    ],
    "bladeAngles": [
      1.5708,
      1.60069,
      1.5871,
      1.55418,
      1.58221,
      1.58049,
      1.57539,
      1.5883,
      1.59727,
      1.52736,
      1.55325,
      1.54033
    ],
    "bladeLengths": [
      25.405,
      24.112,
      23.15,
      36.113,
      33.642,
      32.691,
      33.104,
      33.956,
      24.998,
      25.891,
      24.432,
      25.798
    ],
    "contactPoints": [
      [
        {
          "x": 62.0,
          "y": 120
        }
      ],
      [
        {
          "x": 62.0,
          "y": 120
        }
      ],
      [
        {
          "x": 62.0,
          "y": 120
        }
      ],
      [
        {
          "x": 63.75,
          "y": 112
        }
      ],
      [
        {
          "x": 58.0,
          "y": 109
        }
      ],
      [
        {
          "x": 58.0,
          "y": 109
        }
      ],
      [
        {
          "x": 58.5,
          "y": 109
        }
      ],
      [
        {
          "x": 59.5,
          "y": 120
        }
      ],
      [
        {
          "x": 60.5,
          "y": 120
        }
      ],
      [
        {
          "x": 63.5,
          "y": 120
        }
      ],
      [
        {
          "x": 63.0,
          "y": 120
        }
      ],
      [
        {
          "x": 63.0,
          "y": 120
        }
      ]
    ],
    "provenance": "Built-in image_gen complete native full-body drawings; sprite-gen component extraction and nearest row fit; canonical pixels unchanged; body-to-boot calibration independent of blade bounds"
  },
  "ne": {
    "src": "assets/hero-stab-ne-fullbody-v4.png",
    "frameWidth": 128,
    "frameHeight": 128,
    "frames": 12,
    "fps": 16,
    "loop": false,
    "bakedWeapon": true,
    "fullBodyGait": true,
    "displayHeight": 80,
    "foot": {
      "x": 64,
      "y": 120
    },
    "phaseFrames": {
      "anticipation": [
        0,
        2
      ],
      "active": [
        3,
        7
      ],
      "recovery": [
        8,
        11
      ]
    },
    "phaseRangeConvention": "inclusive",
    "contactSmearFrames": [],
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
      },
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
      }
    ],
    "footAnchors": [
      {
        "x": 64,
        "y": 119
      },
      {
        "x": 64,
        "y": 118
      },
      {
        "x": 64,
        "y": 119
      },
      {
        "x": 64,
        "y": 119
      },
      {
        "x": 64,
        "y": 119
      },
      {
        "x": 64,
        "y": 118
      },
      {
        "x": 64,
        "y": 119
      },
      {
        "x": 64,
        "y": 118
      },
      {
        "x": 64,
        "y": 119
      },
      {
        "x": 64,
        "y": 118
      },
      {
        "x": 64,
        "y": 120
      },
      {
        "x": 64,
        "y": 119
      }
    ],
    "frameScales": [
      1.72973,
      1.75342,
      1.77778,
      1.75342,
      2.32727,
      2.32727,
      2.28571,
      2.24561,
      1.66234,
      1.70667,
      1.66234,
      1.68421
    ],
    "handAnchors": [
      {
        "x": 77.82,
        "y": 74.67
      },
      {
        "x": 82.88,
        "y": 71.9
      },
      {
        "x": 86.15,
        "y": 72.08
      },
      {
        "x": 88.6,
        "y": 62.81
      },
      {
        "x": 87.57,
        "y": 73.84
      },
      {
        "x": 86.74,
        "y": 74.17
      },
      {
        "x": 88.07,
        "y": 75.17
      },
      {
        "x": 81.81,
        "y": 76.74
      },
      {
        "x": 84.95,
        "y": 65.1
      },
      {
        "x": 78.46,
        "y": 69.95
      },
      {
        "x": 83.1,
        "y": 69.88
      },
      {
        "x": 78.54,
        "y": 73.57
      }
    ],
    "bladeOrigins": [
      {
        "x": 82.42,
        "y": 72.72
      },
      {
        "x": 87.48,
        "y": 69.95
      },
      {
        "x": 90.75,
        "y": 70.13
      },
      {
        "x": 93.2,
        "y": 60.86
      },
      {
        "x": 92.17,
        "y": 71.89
      },
      {
        "x": 91.34,
        "y": 72.22
      },
      {
        "x": 92.67,
        "y": 73.22
      },
      {
        "x": 86.41,
        "y": 74.79
      },
      {
        "x": 89.55,
        "y": 63.15
      },
      {
        "x": 83.06,
        "y": 68.0
      },
      {
        "x": 87.7,
        "y": 67.93
      },
      {
        "x": 83.14,
        "y": 71.62
      }
    ],
    "tipAnchors": [
      {
        "x": 104.0,
        "y": 63.0
      },
      {
        "x": 112.0,
        "y": 59.0
      },
      {
        "x": 117.0,
        "y": 60.0
      },
      {
        "x": 118.0,
        "y": 51.0
      },
      {
        "x": 116.0,
        "y": 64.0
      },
      {
        "x": 117.0,
        "y": 64.0
      },
      {
        "x": 117.0,
        "y": 63.0
      },
      {
        "x": 107.0,
        "y": 67.0
      },
      {
        "x": 118.0,
        "y": 51.0
      },
      {
        "x": 107.0,
        "y": 57.0
      },
      {
        "x": 109.0,
        "y": 57.0
      },
      {
        "x": 105.0,
        "y": 61.0
      }
    ],
    "bladeAngles": [
      -0.42316,
      -0.41997,
      -0.36826,
      -0.37838,
      -0.31969,
      -0.30997,
      -0.39764,
      -0.36165,
      -0.40359,
      -0.43068,
      -0.47407,
      -0.4522
    ],
    "bladeLengths": [
      25.585,
      29.427,
      31.261,
      29.246,
      36.51,
      39.19,
      37.697,
      30.895,
      32.14,
      28.101,
      24.872,
      25.581
    ],
    "contactPoints": [
      [
        {
          "x": 44.0,
          "y": 119
        },
        {
          "x": 81.5,
          "y": 119
        }
      ],
      [
        {
          "x": 51.0,
          "y": 118
        }
      ],
      [
        {
          "x": 44.5,
          "y": 119
        },
        {
          "x": 86.0,
          "y": 119
        }
      ],
      [
        {
          "x": 45.5,
          "y": 119
        }
      ],
      [
        {
          "x": 49.5,
          "y": 119
        }
      ],
      [
        {
          "x": 48.5,
          "y": 118
        }
      ],
      [
        {
          "x": 49.0,
          "y": 119
        }
      ],
      [
        {
          "x": 50.0,
          "y": 118
        }
      ],
      [
        {
          "x": 50.0,
          "y": 119
        }
      ],
      [
        {
          "x": 59.5,
          "y": 118
        }
      ],
      [
        {
          "x": 62.5,
          "y": 120
        }
      ],
      [
        {
          "x": 42.5,
          "y": 119
        },
        {
          "x": 82.5,
          "y": 119
        }
      ]
    ],
    "provenance": "Built-in image_gen complete native full-body drawings; sprite-gen component extraction and nearest row fit; canonical pixels unchanged; body-to-boot calibration independent of blade bounds"
  },
  "se": {
    "src": "assets/hero-stab-se-fullbody-v4.png",
    "frameWidth": 128,
    "frameHeight": 128,
    "frames": 12,
    "fps": 16,
    "loop": false,
    "bakedWeapon": true,
    "fullBodyGait": true,
    "displayHeight": 80,
    "foot": {
      "x": 64,
      "y": 120
    },
    "phaseFrames": {
      "anticipation": [
        0,
        2
      ],
      "active": [
        3,
        7
      ],
      "recovery": [
        8,
        11
      ]
    },
    "phaseRangeConvention": "inclusive",
    "contactSmearFrames": [],
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
      },
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
      }
    ],
    "footAnchors": [
      {
        "x": 64,
        "y": 120
      },
      {
        "x": 64,
        "y": 120
      },
      {
        "x": 64,
        "y": 120
      },
      {
        "x": 64,
        "y": 119
      },
      {
        "x": 64,
        "y": 120
      },
      {
        "x": 64,
        "y": 120
      },
      {
        "x": 64,
        "y": 120
      },
      {
        "x": 64,
        "y": 119
      },
      {
        "x": 64,
        "y": 120
      },
      {
        "x": 64,
        "y": 120
      },
      {
        "x": 64,
        "y": 120
      },
      {
        "x": 64,
        "y": 119
      }
    ],
    "frameScales": [
      1.52381,
      1.54217,
      1.62025,
      1.66234,
      2.2069,
      2.24561,
      2.09836,
      2.13333,
      1.15315,
      1.14286,
      1.15315,
      1.15315
    ],
    "handAnchors": [
      {
        "x": 76.69,
        "y": 81.47
      },
      {
        "x": 50.1,
        "y": 68.4
      },
      {
        "x": 83.02,
        "y": 75.33
      },
      {
        "x": 84.87,
        "y": 71.94
      },
      {
        "x": 85.11,
        "y": 80.5
      },
      {
        "x": 84.93,
        "y": 82.14
      },
      {
        "x": 76.33,
        "y": 81.47
      },
      {
        "x": 62.53,
        "y": 80.54
      },
      {
        "x": 77.9,
        "y": 51.12
      },
      {
        "x": 75.73,
        "y": 53.48
      },
      {
        "x": 54.07,
        "y": 51.71
      },
      {
        "x": 54.13,
        "y": 51.09
      }
    ],
    "bladeOrigins": [
      {
        "x": 81.29,
        "y": 83.42
      },
      {
        "x": 54.7,
        "y": 70.35
      },
      {
        "x": 87.62,
        "y": 77.28
      },
      {
        "x": 89.47,
        "y": 73.89
      },
      {
        "x": 89.71,
        "y": 82.45
      },
      {
        "x": 89.53,
        "y": 84.09
      },
      {
        "x": 80.93,
        "y": 83.42
      },
      {
        "x": 67.13,
        "y": 82.49
      },
      {
        "x": 82.5,
        "y": 53.07
      },
      {
        "x": 80.33,
        "y": 55.43
      },
      {
        "x": 58.67,
        "y": 53.66
      },
      {
        "x": 58.73,
        "y": 53.04
      }
    ],
    "tipAnchors": [
      {
        "x": 94.0,
        "y": 86.0
      },
      {
        "x": 88.0,
        "y": 80.0
      },
      {
        "x": 113.0,
        "y": 88.0
      },
      {
        "x": 117.0,
        "y": 85.0
      },
      {
        "x": 118.0,
        "y": 90.0
      },
      {
        "x": 115.0,
        "y": 91.0
      },
      {
        "x": 101.0,
        "y": 89.0
      },
      {
        "x": 89.0,
        "y": 89.0
      },
      {
        "x": 115.0,
        "y": 64.0
      },
      {
        "x": 113.0,
        "y": 71.0
      },
      {
        "x": 111.0,
        "y": 74.0
      },
      {
        "x": 111.0,
        "y": 74.0
      }
    ],
    "bladeAngles": [
      0.20017,
      0.28203,
      0.39961,
      0.38354,
      0.26076,
      0.26488,
      0.27112,
      0.28927,
      0.32439,
      0.44472,
      0.3707,
      0.38135
    ],
    "bladeLengths": [
      12.35,
      33.416,
      27.898,
      30.842,
      40.385,
      37.038,
      27.318,
      30.423,
      24.712,
      25.849,
      40.463,
      40.587
    ],
    "contactPoints": [
      [
        {
          "x": 44.0,
          "y": 120
        },
        {
          "x": 81.0,
          "y": 120
        }
      ],
      [
        {
          "x": 74.5,
          "y": 120
        }
      ],
      [
        {
          "x": 82.5,
          "y": 120
        }
      ],
      [
        {
          "x": 34.5,
          "y": 119
        },
        {
          "x": 86.5,
          "y": 119
        }
      ],
      [
        {
          "x": 36.0,
          "y": 120
        },
        {
          "x": 86.0,
          "y": 120
        }
      ],
      [
        {
          "x": 38.5,
          "y": 120
        },
        {
          "x": 85.5,
          "y": 120
        }
      ],
      [
        {
          "x": 45.5,
          "y": 120
        },
        {
          "x": 80.0,
          "y": 120
        }
      ],
      [
        {
          "x": 47.5,
          "y": 119
        },
        {
          "x": 79.0,
          "y": 119
        }
      ],
      [
        {
          "x": 73.0,
          "y": 120
        }
      ],
      [
        {
          "x": 76.0,
          "y": 120
        }
      ],
      [
        {
          "x": 37.0,
          "y": 120
        },
        {
          "x": 89.0,
          "y": 120
        }
      ],
      [
        {
          "x": 37.0,
          "y": 119
        },
        {
          "x": 89.0,
          "y": 119
        }
      ]
    ],
    "provenance": "Built-in image_gen complete native full-body drawings; sprite-gen component extraction and nearest row fit; canonical pixels unchanged; body-to-boot calibration independent of blade bounds"
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
};
  atlas.animations.stab = atlas.directionalAnimations.stab.e;
  atlas.directionalAnimations.sweep = {
  "e": {
    "src": "assets/hero-sweep-e-fullbody-v4.png",
    "frameWidth": 128,
    "frameHeight": 128,
    "frames": 12,
    "fps": 16,
    "loop": false,
    "bakedWeapon": true,
    "fullBodyGait": true,
    "displayHeight": 80,
    "foot": {
      "x": 64,
      "y": 120
    },
    "phaseFrames": {
      "anticipation": [
        0,
        2
      ],
      "active": [
        3,
        7
      ],
      "recovery": [
        8,
        11
      ]
    },
    "phaseRangeConvention": "inclusive",
    "contactSmearFrames": [
      4,
      5,
      6
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
      },
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
      }
    ],
    "footAnchors": [
      {
        "x": 64,
        "y": 119
      },
      {
        "x": 64,
        "y": 119
      },
      {
        "x": 64,
        "y": 119
      },
      {
        "x": 64,
        "y": 119
      },
      {
        "x": 64,
        "y": 120
      },
      {
        "x": 64,
        "y": 120
      },
      {
        "x": 64,
        "y": 120
      },
      {
        "x": 64,
        "y": 120
      },
      {
        "x": 64,
        "y": 120
      },
      {
        "x": 64,
        "y": 120
      },
      {
        "x": 64,
        "y": 120
      },
      {
        "x": 64,
        "y": 120
      }
    ],
    "frameScales": [
      2.03175,
      2.13333,
      2.13333,
      2.06452,
      2.78261,
      2.66667,
      2.66667,
      2.78261,
      1.85507,
      1.91045,
      1.88235,
      1.82857
    ],
    "handAnchors": [
      {
        "x": 59.2,
        "y": 80.24
      },
      {
        "x": 55.37,
        "y": 85.42
      },
      {
        "x": 58.33,
        "y": 64.32
      },
      {
        "x": 81.45,
        "y": 62.93
      },
      {
        "x": 77.68,
        "y": 83.53
      },
      {
        "x": 77.0,
        "y": 89.33
      },
      {
        "x": 78.49,
        "y": 92.69
      },
      {
        "x": 70.63,
        "y": 98.05
      },
      {
        "x": 78.81,
        "y": 82.7
      },
      {
        "x": 76.78,
        "y": 81.06
      },
      {
        "x": 80.6,
        "y": 87.22
      },
      {
        "x": 57.6,
        "y": 80.2
      }
    ],
    "bladeOrigins": [
      {
        "x": 64.2,
        "y": 80.5
      },
      {
        "x": 50.42,
        "y": 84.72
      },
      {
        "x": 53.33,
        "y": 64.15
      },
      {
        "x": 85.28,
        "y": 59.71
      },
      {
        "x": 82.38,
        "y": 81.82
      },
      {
        "x": 82.0,
        "y": 89.33
      },
      {
        "x": 83.22,
        "y": 94.32
      },
      {
        "x": 74.91,
        "y": 100.63
      },
      {
        "x": 83.01,
        "y": 85.42
      },
      {
        "x": 81.31,
        "y": 83.18
      },
      {
        "x": 85.43,
        "y": 88.52
      },
      {
        "x": 62.6,
        "y": 80.2
      }
    ],
    "tipAnchors": [
      {
        "x": 92.0,
        "y": 84.0
      },
      {
        "x": 25.0,
        "y": 80.0
      },
      {
        "x": 29.0,
        "y": 63.0
      },
      {
        "x": 115.0,
        "y": 41.0
      },
      {
        "x": 113.0,
        "y": 72.0
      },
      {
        "x": 117.0,
        "y": 89.0
      },
      {
        "x": 114.0,
        "y": 102.0
      },
      {
        "x": 98.0,
        "y": 114.0
      },
      {
        "x": 115.0,
        "y": 101.0
      },
      {
        "x": 111.0,
        "y": 95.0
      },
      {
        "x": 88.0,
        "y": 87.0
      },
      {
        "x": 107.0,
        "y": 82.0
      }
    ],
    "bladeAngles": [
      0.12506,
      -2.95794,
      -3.09436,
      -0.562,
      -0.31022,
      -0.00943,
      0.24449,
      0.52494,
      0.4532,
      0.37905,
      -0.53374,
      0.04052
    ],
    "bladeLengths": [
      35.583,
      34.472,
      32.478,
      45.316,
      55.923,
      58.336,
      52.871,
      46.396,
      41.258,
      38.156,
      3.509,
      50.785
    ],
    "contactPoints": [
      [
        {
          "x": 45.5,
          "y": 119
        },
        {
          "x": 79.5,
          "y": 119
        }
      ],
      [
        {
          "x": 44.0,
          "y": 119
        },
        {
          "x": 81.0,
          "y": 119
        }
      ],
      [
        {
          "x": 40.5,
          "y": 119
        },
        {
          "x": 86.0,
          "y": 119
        }
      ],
      [
        {
          "x": 45.0,
          "y": 119
        },
        {
          "x": 87.0,
          "y": 119
        }
      ],
      [
        {
          "x": 45.5,
          "y": 120
        },
        {
          "x": 79.5,
          "y": 120
        }
      ],
      [
        {
          "x": 43.0,
          "y": 120
        },
        {
          "x": 83.0,
          "y": 120
        }
      ],
      [
        {
          "x": 43.0,
          "y": 120
        },
        {
          "x": 83.0,
          "y": 120
        }
      ],
      [
        {
          "x": 37.5,
          "y": 120
        },
        {
          "x": 77.5,
          "y": 120
        }
      ],
      [
        {
          "x": 40.0,
          "y": 120
        },
        {
          "x": 85.5,
          "y": 120
        }
      ],
      [
        {
          "x": 43.0,
          "y": 120
        },
        {
          "x": 85.5,
          "y": 120
        }
      ],
      [
        {
          "x": 47.0,
          "y": 120
        },
        {
          "x": 87.0,
          "y": 120
        }
      ],
      [
        {
          "x": 44.0,
          "y": 120
        },
        {
          "x": 82.5,
          "y": 120
        }
      ]
    ],
    "provenance": "Built-in image_gen complete native full-body drawings; sprite-gen component extraction and nearest row fit; canonical pixels unchanged; body-to-boot calibration independent of blade bounds"
  },
  "n": {
    "src": "assets/hero-sweep-n-fullbody-v4.png",
    "frameWidth": 128,
    "frameHeight": 128,
    "frames": 12,
    "fps": 16,
    "loop": false,
    "bakedWeapon": true,
    "fullBodyGait": true,
    "displayHeight": 80,
    "foot": {
      "x": 64,
      "y": 120
    },
    "phaseFrames": {
      "anticipation": [
        0,
        2
      ],
      "active": [
        3,
        7
      ],
      "recovery": [
        8,
        11
      ]
    },
    "phaseRangeConvention": "inclusive",
    "contactSmearFrames": [
      4,
      5,
      6
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
      },
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
      }
    ],
    "footAnchors": [
      {
        "x": 64,
        "y": 120
      },
      {
        "x": 64,
        "y": 120
      },
      {
        "x": 64,
        "y": 120
      },
      {
        "x": 64,
        "y": 120
      },
      {
        "x": 64,
        "y": 119
      },
      {
        "x": 64,
        "y": 120
      },
      {
        "x": 64,
        "y": 120
      },
      {
        "x": 64,
        "y": 120
      },
      {
        "x": 64,
        "y": 120
      },
      {
        "x": 64,
        "y": 119
      },
      {
        "x": 64,
        "y": 119
      },
      {
        "x": 64,
        "y": 120
      }
    ],
    "frameScales": [
      1.45455,
      1.45455,
      1.45455,
      1.47126,
      1.6,
      1.52381,
      1.58025,
      1.48837,
      1.62025,
      1.58025,
      1.56098,
      1.56098
    ],
    "handAnchors": [
      {
        "x": 45.84,
        "y": 67.45
      },
      {
        "x": 38.9,
        "y": 54.87
      },
      {
        "x": 89.1,
        "y": 47.0
      },
      {
        "x": 69.06,
        "y": 39.12
      },
      {
        "x": 70.52,
        "y": 45.86
      },
      {
        "x": 63.0,
        "y": 40.33
      },
      {
        "x": 53.86,
        "y": 50.59
      },
      {
        "x": 64.93,
        "y": 38.48
      },
      {
        "x": 59.46,
        "y": 52.59
      },
      {
        "x": 76.07,
        "y": 47.95
      },
      {
        "x": 87.37,
        "y": 75.23
      },
      {
        "x": 48.73,
        "y": 75.64
      }
    ],
    "bladeOrigins": [
      {
        "x": 41.51,
        "y": 69.95
      },
      {
        "x": 35.07,
        "y": 58.09
      },
      {
        "x": 84.77,
        "y": 44.5
      },
      {
        "x": 64.69,
        "y": 36.7
      },
      {
        "x": 66.32,
        "y": 43.14
      },
      {
        "x": 63.0,
        "y": 35.33
      },
      {
        "x": 58.1,
        "y": 47.94
      },
      {
        "x": 68.93,
        "y": 35.47
      },
      {
        "x": 63.7,
        "y": 49.94
      },
      {
        "x": 80.96,
        "y": 48.99
      },
      {
        "x": 91.61,
        "y": 77.88
      },
      {
        "x": 44.63,
        "y": 78.51
      }
    ],
    "tipAnchors": [
      {
        "x": 14.0,
        "y": 81.0
      },
      {
        "x": 9.0,
        "y": 75.0
      },
      {
        "x": 54.0,
        "y": 29.0
      },
      {
        "x": 18.0,
        "y": 16.0
      },
      {
        "x": 20.0,
        "y": 16.0
      },
      {
        "x": 64.0,
        "y": 10.0
      },
      {
        "x": 110.0,
        "y": 16.0
      },
      {
        "x": 104.0,
        "y": 10.0
      },
      {
        "x": 96.0,
        "y": 29.0
      },
      {
        "x": 116.0,
        "y": 58.0
      },
      {
        "x": 117.0,
        "y": 92.0
      },
      {
        "x": 22.0,
        "y": 96.0
      }
    ],
    "bladeAngles": [
      2.75962,
      2.56602,
      -2.67493,
      -2.72428,
      -2.6116,
      -1.53134,
      -0.55165,
      -0.62803,
      -0.57513,
      0.25177,
      0.50747,
      2.48357
    ],
    "bladeLengths": [
      26.949,
      28.25,
      31.32,
      46.964,
      53.688,
      24.143,
      60.192,
      40.319,
      38.984,
      35.738,
      28.347,
      27.906
    ],
    "contactPoints": [
      [
        {
          "x": 64.5,
          "y": 120
        }
      ],
      [
        {
          "x": 64.0,
          "y": 120
        }
      ],
      [
        {
          "x": 62.0,
          "y": 120
        }
      ],
      [
        {
          "x": 63.0,
          "y": 120
        }
      ],
      [
        {
          "x": 62.5,
          "y": 119
        }
      ],
      [
        {
          "x": 61.5,
          "y": 120
        }
      ],
      [
        {
          "x": 66.0,
          "y": 120
        }
      ],
      [
        {
          "x": 62.5,
          "y": 120
        }
      ],
      [
        {
          "x": 65.5,
          "y": 120
        }
      ],
      [
        {
          "x": 67.5,
          "y": 119
        }
      ],
      [
        {
          "x": 62.5,
          "y": 119
        }
      ],
      [
        {
          "x": 62.5,
          "y": 120
        }
      ]
    ],
    "provenance": "Built-in image_gen complete native full-body drawings; sprite-gen component extraction and nearest row fit; canonical pixels unchanged; body-to-boot calibration independent of blade bounds"
  },
  "s": {
    "src": "assets/hero-sweep-s-fullbody-v4.png",
    "frameWidth": 128,
    "frameHeight": 128,
    "frames": 12,
    "fps": 16,
    "loop": false,
    "bakedWeapon": true,
    "fullBodyGait": true,
    "displayHeight": 80,
    "foot": {
      "x": 64,
      "y": 120
    },
    "phaseFrames": {
      "anticipation": [
        0,
        2
      ],
      "active": [
        3,
        7
      ],
      "recovery": [
        8,
        11
      ]
    },
    "phaseRangeConvention": "inclusive",
    "contactSmearFrames": [
      4,
      5,
      6
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
      },
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
      }
    ],
    "footAnchors": [
      {
        "x": 64,
        "y": 120
      },
      {
        "x": 64,
        "y": 120
      },
      {
        "x": 64,
        "y": 120
      },
      {
        "x": 64,
        "y": 120
      },
      {
        "x": 64,
        "y": 119
      },
      {
        "x": 64,
        "y": 120
      },
      {
        "x": 64,
        "y": 120
      },
      {
        "x": 64,
        "y": 120
      },
      {
        "x": 64,
        "y": 120
      },
      {
        "x": 64,
        "y": 119
      },
      {
        "x": 64,
        "y": 120
      },
      {
        "x": 64,
        "y": 120
      }
    ],
    "frameScales": [
      1.21905,
      1.21905,
      1.24272,
      1.23077,
      1.24272,
      1.26733,
      1.29293,
      1.29293,
      1.47126,
      1.47126,
      1.45455,
      1.42222
    ],
    "handAnchors": [
      {
        "x": 48.99,
        "y": 69.74
      },
      {
        "x": 53.46,
        "y": 27.28
      },
      {
        "x": 48.78,
        "y": 62.7
      },
      {
        "x": 67.34,
        "y": 70.24
      },
      {
        "x": 74.97,
        "y": 63.28
      },
      {
        "x": 69.17,
        "y": 63.42
      },
      {
        "x": 62.17,
        "y": 69.83
      },
      {
        "x": 61.73,
        "y": 74.19
      },
      {
        "x": 49.15,
        "y": 76.8
      },
      {
        "x": 53.38,
        "y": 77.97
      },
      {
        "x": 72.87,
        "y": 70.25
      },
      {
        "x": 52.43,
        "y": 75.13
      }
    ],
    "bladeOrigins": [
      {
        "x": 46.19,
        "y": 73.89
      },
      {
        "x": 49.36,
        "y": 30.15
      },
      {
        "x": 53.73,
        "y": 63.4
      },
      {
        "x": 70.69,
        "y": 73.96
      },
      {
        "x": 77.09,
        "y": 67.81
      },
      {
        "x": 69.17,
        "y": 68.42
      },
      {
        "x": 59.16,
        "y": 73.83
      },
      {
        "x": 57.73,
        "y": 77.2
      },
      {
        "x": 44.48,
        "y": 78.6
      },
      {
        "x": 49.28,
        "y": 75.1
      },
      {
        "x": 68.5,
        "y": 67.83
      },
      {
        "x": 49.49,
        "y": 79.18
      }
    ],
    "tipAnchors": [
      {
        "x": 27.0,
        "y": 108.0
      },
      {
        "x": 11.0,
        "y": 54.0
      },
      {
        "x": 93.0,
        "y": 64.0
      },
      {
        "x": 93.0,
        "y": 106.0
      },
      {
        "x": 85.0,
        "y": 96.0
      },
      {
        "x": 66.0,
        "y": 116.0
      },
      {
        "x": 30.0,
        "y": 110.0
      },
      {
        "x": 14.0,
        "y": 105.0
      },
      {
        "x": 9.0,
        "y": 95.0
      },
      {
        "x": 17.0,
        "y": 52.0
      },
      {
        "x": 30.0,
        "y": 52.0
      },
      {
        "x": 35.0,
        "y": 107.0
      }
    ],
    "bladeAngles": [
      2.08327,
      2.58531,
      0.01532,
      0.96256,
      1.29705,
      1.63732,
      2.2492,
      2.57541,
      2.70857,
      -2.52043,
      -2.75149,
      2.05108
    ],
    "bladeLengths": [
      29.821,
      34.417,
      30.504,
      30.036,
      22.74,
      37.771,
      37.544,
      41.874,
      35.946,
      36.503,
      37.844,
      27.885
    ],
    "contactPoints": [
      [
        {
          "x": 60.0,
          "y": 120
        }
      ],
      [
        {
          "x": 50.0,
          "y": 120
        }
      ],
      [
        {
          "x": 82.0,
          "y": 120
        }
      ],
      [
        {
          "x": 75.5,
          "y": 120
        }
      ],
      [
        {
          "x": 73.0,
          "y": 119
        }
      ],
      [
        {
          "x": 56.83,
          "y": 120
        }
      ],
      [
        {
          "x": 77.0,
          "y": 120
        }
      ],
      [
        {
          "x": 72.0,
          "y": 120
        }
      ],
      [
        {
          "x": 63.5,
          "y": 120
        }
      ],
      [
        {
          "x": 62.0,
          "y": 119
        }
      ],
      [
        {
          "x": 58.5,
          "y": 120
        }
      ],
      [
        {
          "x": 61.5,
          "y": 120
        }
      ]
    ],
    "provenance": "Built-in image_gen complete native full-body drawings; sprite-gen component extraction and nearest row fit; canonical pixels unchanged; body-to-boot calibration independent of blade bounds"
  },
  "ne": {
    "src": "assets/hero-sweep-ne-fullbody-v4.png",
    "frameWidth": 128,
    "frameHeight": 128,
    "frames": 12,
    "fps": 16,
    "loop": false,
    "bakedWeapon": true,
    "fullBodyGait": true,
    "displayHeight": 80,
    "foot": {
      "x": 64,
      "y": 120
    },
    "phaseFrames": {
      "anticipation": [
        0,
        2
      ],
      "active": [
        3,
        7
      ],
      "recovery": [
        8,
        11
      ]
    },
    "phaseRangeConvention": "inclusive",
    "contactSmearFrames": [
      4,
      5,
      6
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
      },
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
      }
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
        "y": 119
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
        "y": 119
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
        "y": 119
      }
    ],
    "frameScales": [
      1.77778,
      1.75342,
      1.75342,
      1.75342,
      2.78261,
      2.84444,
      2.90909,
      2.97674,
      2.0,
      1.88235,
      1.96923,
      1.93939
    ],
    "handAnchors": [
      {
        "x": 42.72,
        "y": 79.06
      },
      {
        "x": 54.0,
        "y": 81.1
      },
      {
        "x": 89.62,
        "y": 47.38
      },
      {
        "x": 77.52,
        "y": 49.7
      },
      {
        "x": 77.47,
        "y": 83.57
      },
      {
        "x": 74.27,
        "y": 82.01
      },
      {
        "x": 77.2,
        "y": 88.08
      },
      {
        "x": 79.0,
        "y": 91.1
      },
      {
        "x": 84.65,
        "y": 73.92
      },
      {
        "x": 82.18,
        "y": 75.97
      },
      {
        "x": 73.13,
        "y": 86.02
      },
      {
        "x": 41.28,
        "y": 88.06
      }
    ],
    "bladeOrigins": [
      {
        "x": 38.19,
        "y": 81.18
      },
      {
        "x": 49.0,
        "y": 80.93
      },
      {
        "x": 86.09,
        "y": 50.91
      },
      {
        "x": 76.65,
        "y": 44.78
      },
      {
        "x": 79.18,
        "y": 78.87
      },
      {
        "x": 77.99,
        "y": 78.66
      },
      {
        "x": 81.87,
        "y": 86.28
      },
      {
        "x": 84.0,
        "y": 90.93
      },
      {
        "x": 89.57,
        "y": 73.05
      },
      {
        "x": 86.88,
        "y": 77.68
      },
      {
        "x": 68.24,
        "y": 84.98
      },
      {
        "x": 45.81,
        "y": 90.18
      }
    ],
    "tipAnchors": [
      {
        "x": 24.0,
        "y": 88.0
      },
      {
        "x": 48.0,
        "y": 77.0
      },
      {
        "x": 43.0,
        "y": 98.0
      },
      {
        "x": 67.0,
        "y": 10.0
      },
      {
        "x": 90.0,
        "y": 56.0
      },
      {
        "x": 95.0,
        "y": 70.0
      },
      {
        "x": 118.0,
        "y": 75.0
      },
      {
        "x": 112.0,
        "y": 87.0
      },
      {
        "x": 117.0,
        "y": 69.0
      },
      {
        "x": 109.0,
        "y": 91.0
      },
      {
        "x": 38.0,
        "y": 76.0
      },
      {
        "x": 72.0,
        "y": 103.0
      }
    ],
    "bladeAngles": [
      2.69322,
      -1.82024,
      2.31186,
      -1.84152,
      -1.12905,
      -0.4709,
      -0.30268,
      -0.13945,
      -0.14668,
      0.54187,
      -2.85284,
      0.4554
    ],
    "bladeLengths": [
      17.493,
      4.445,
      69.944,
      39.556,
      43.999,
      33.941,
      68.825,
      52.606,
      34.66,
      30.376,
      38.831,
      35.344
    ],
    "contactPoints": [
      [
        {
          "x": 43.5,
          "y": 118
        },
        {
          "x": 82.0,
          "y": 118
        }
      ],
      [
        {
          "x": 43.0,
          "y": 118
        },
        {
          "x": 85.5,
          "y": 118
        }
      ],
      [
        {
          "x": 43.5,
          "y": 118
        },
        {
          "x": 86.5,
          "y": 118
        }
      ],
      [
        {
          "x": 44.5,
          "y": 119
        },
        {
          "x": 87.5,
          "y": 119
        }
      ],
      [
        {
          "x": 48.5,
          "y": 118
        },
        {
          "x": 77.5,
          "y": 118
        }
      ],
      [
        {
          "x": 48.5,
          "y": 118
        },
        {
          "x": 80.0,
          "y": 118
        }
      ],
      [
        {
          "x": 50.0,
          "y": 118
        },
        {
          "x": 78.0,
          "y": 118
        }
      ],
      [
        {
          "x": 45.0,
          "y": 119
        },
        {
          "x": 83.0,
          "y": 119
        }
      ],
      [
        {
          "x": 44.0,
          "y": 118
        },
        {
          "x": 83.5,
          "y": 118
        }
      ],
      [
        {
          "x": 47.5,
          "y": 118
        }
      ],
      [
        {
          "x": 49.0,
          "y": 118
        },
        {
          "x": 76.5,
          "y": 118
        }
      ],
      [
        {
          "x": 44.5,
          "y": 119
        },
        {
          "x": 80.0,
          "y": 119
        }
      ]
    ],
    "provenance": "Built-in image_gen complete native full-body drawings; sprite-gen component extraction and nearest row fit; canonical pixels unchanged; body-to-boot calibration independent of blade bounds"
  },
  "se": {
    "src": "assets/hero-sweep-se-fullbody-v4.png",
    "frameWidth": 128,
    "frameHeight": 128,
    "frames": 12,
    "fps": 16,
    "loop": false,
    "bakedWeapon": true,
    "fullBodyGait": true,
    "displayHeight": 80,
    "foot": {
      "x": 64,
      "y": 120
    },
    "phaseFrames": {
      "anticipation": [
        0,
        2
      ],
      "active": [
        3,
        7
      ],
      "recovery": [
        8,
        11
      ]
    },
    "phaseRangeConvention": "inclusive",
    "contactSmearFrames": [
      4,
      5,
      6
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
      },
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
      }
    ],
    "footAnchors": [
      {
        "x": 64,
        "y": 120
      },
      {
        "x": 64,
        "y": 120
      },
      {
        "x": 64,
        "y": 120
      },
      {
        "x": 64,
        "y": 119
      },
      {
        "x": 64,
        "y": 120
      },
      {
        "x": 64,
        "y": 120
      },
      {
        "x": 64,
        "y": 120
      },
      {
        "x": 64,
        "y": 113
      },
      {
        "x": 64,
        "y": 120
      },
      {
        "x": 64,
        "y": 120
      },
      {
        "x": 64,
        "y": 120
      },
      {
        "x": 64,
        "y": 120
      }
    ],
    "frameScales": [
      1.70667,
      1.72973,
      1.72973,
      1.85507,
      2.13333,
      2.0,
      2.0,
      2.0,
      2.2069,
      2.16949,
      2.16949,
      2.16949
    ],
    "handAnchors": [
      {
        "x": 58.63,
        "y": 77.37
      },
      {
        "x": 41.48,
        "y": 74.7
      },
      {
        "x": 45.54,
        "y": 59.72
      },
      {
        "x": 78.88,
        "y": 73.28
      },
      {
        "x": 71.68,
        "y": 85.22
      },
      {
        "x": 70.93,
        "y": 86.84
      },
      {
        "x": 64.57,
        "y": 85.99
      },
      {
        "x": 60.48,
        "y": 79.42
      },
      {
        "x": 78.7,
        "y": 92.42
      },
      {
        "x": 73.5,
        "y": 84.47
      },
      {
        "x": 56.79,
        "y": 86.34
      },
      {
        "x": 59.62,
        "y": 85.84
      }
    ],
    "bladeOrigins": [
      {
        "x": 63.41,
        "y": 78.83
      },
      {
        "x": 36.65,
        "y": 73.4
      },
      {
        "x": 40.97,
        "y": 57.69
      },
      {
        "x": 83.88,
        "y": 73.11
      },
      {
        "x": 76.38,
        "y": 86.93
      },
      {
        "x": 75.35,
        "y": 89.19
      },
      {
        "x": 68.62,
        "y": 88.93
      },
      {
        "x": 62.35,
        "y": 84.05
      },
      {
        "x": 83.37,
        "y": 94.22
      },
      {
        "x": 77.95,
        "y": 86.74
      },
      {
        "x": 61.59,
        "y": 87.72
      },
      {
        "x": 64.42,
        "y": 87.22
      }
    ],
    "tipAnchors": [
      {
        "x": 103.0,
        "y": 89.0
      },
      {
        "x": 18.0,
        "y": 65.0
      },
      {
        "x": 23.0,
        "y": 51.0
      },
      {
        "x": 118.0,
        "y": 70.0
      },
      {
        "x": 114.0,
        "y": 100.0
      },
      {
        "x": 112.0,
        "y": 107.0
      },
      {
        "x": 105.0,
        "y": 116.0
      },
      {
        "x": 74.0,
        "y": 115.0
      },
      {
        "x": 117.0,
        "y": 103.0
      },
      {
        "x": 108.0,
        "y": 101.0
      },
      {
        "x": 88.0,
        "y": 97.0
      },
      {
        "x": 96.0,
        "y": 96.0
      }
    ],
    "bladeAngles": [
      0.25135,
      -2.71826,
      -2.78543,
      -0.0909,
      0.33428,
      0.45232,
      0.63976,
      1.21072,
      0.25545,
      0.44316,
      0.33789,
      0.27116
    ],
    "bladeLengths": [
      43.596,
      22.112,
      20.731,
      39.725,
      53.1,
      50.94,
      56.688,
      41.333,
      47.946,
      45.1,
      37.953,
      44.441
    ],
    "contactPoints": [
      [
        {
          "x": 43.0,
          "y": 120
        },
        {
          "x": 85.5,
          "y": 120
        }
      ],
      [
        {
          "x": 45.5,
          "y": 120
        },
        {
          "x": 87.0,
          "y": 120
        }
      ],
      [
        {
          "x": 41.5,
          "y": 120
        },
        {
          "x": 87.0,
          "y": 120
        }
      ],
      [
        {
          "x": 35.0,
          "y": 119
        },
        {
          "x": 92.5,
          "y": 119
        }
      ],
      [
        {
          "x": 41.5,
          "y": 120
        },
        {
          "x": 86.0,
          "y": 120
        }
      ],
      [
        {
          "x": 39.5,
          "y": 120
        },
        {
          "x": 84.0,
          "y": 120
        }
      ],
      [
        {
          "x": 29.5,
          "y": 120
        },
        {
          "x": 74.5,
          "y": 120
        }
      ],
      [
        {
          "x": 42.0,
          "y": 113
        },
        {
          "x": 77.11,
          "y": 113
        }
      ],
      [
        {
          "x": 43.5,
          "y": 120
        },
        {
          "x": 85.5,
          "y": 120
        }
      ],
      [
        {
          "x": 49.5,
          "y": 120
        },
        {
          "x": 83.0,
          "y": 120
        }
      ],
      [
        {
          "x": 47.5,
          "y": 120
        },
        {
          "x": 80.5,
          "y": 120
        }
      ],
      [
        {
          "x": 47.5,
          "y": 120
        },
        {
          "x": 81.5,
          "y": 120
        }
      ]
    ],
    "provenance": "Built-in image_gen complete native full-body drawings; sprite-gen component extraction and nearest row fit; canonical pixels unchanged; body-to-boot calibration independent of blade bounds"
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
};
  atlas.animations.sweep = atlas.directionalAnimations.sweep.e;
})();
// END APPROVED FULL-BODY ATTACK V4
