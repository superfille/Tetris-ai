import { cloneDeep } from 'lodash';

const O = {
  r0: [
      { row: -2, column: 4 }, // [][]
      { row: -2, column: 5 }, // [][]
      { row: -1, column: 4 },
      { row: -1, column: 5 }
  ],

  color: '#FFEB3B',

  getPosition(rotation: number) {
    return cloneDeep(this.rotation(rotation));
  },

  rotation: function(rotation: number) {
    return this.r0;
  },

  nextRotation: function(currentRotation: number) {
    return 0;
  },

  maxRotations: function() {
    return 1;
  }
}

const I = {
  r0: [
    { row: -1, column: 3 }, /// [][][][]
    { row: -1, column: 4 },
    { row: -1, column: 5 },
    { row: -1, column: 6 }
  ],

  r1: [
    { row: -3, column: 5 }, // []
    { row: -2, column: 5 }, // []
    { row: -1, column: 5 }, // []
    { row: 0, column: 5 }   // []
  ],

  color: '#00BCD4',

  getPosition(rotation: number) {
    return cloneDeep(this.rotation(rotation));
  },

  rotation: function(rotation: number) {
    if (rotation === 1) {
      return this.r1;
    }
    return this.r0;
  },

  nextRotation: function(currentRotation: number) {
    return (currentRotation + 1) % 2;
  },

  maxRotations: function() {
    return 2;
  }
}

const L = {
  r0: [
    { row: -2, column: 5 }, //     []
    { row: -1, column: 3 }, // [][][]
    { row: -1, column: 4 },
    { row: -1, column: 5 },
  ],

  r1: [
    { row: 0, column: 5 },  // []
    { row: -2, column: 4 }, // []
    { row: -1, column: 4 }, // [][]
    { row: 0, column: 4 },
  ],

  r2: [
    { row: 0, column: 3 },  // [][][]
    { row: -1, column: 5 }, // []
    { row: -1, column: 4 },
    { row: -1, column: 3 },
  ],

  r3: [
    { row: -2, column: 4 }, // [][]
    { row: 0, column: 4 },  //   []
    { row: -1, column: 4 }, //   []
    { row: -2, column: 3 },
  ],

  color: '#FF9800',

  getPosition(rotation: number) {
    return cloneDeep(this.rotation(rotation));
  },

  rotation: function(rotation: number) {
    switch(rotation) {
      case 1: return this.r1;
      case 2: return this.r2;
      case 3: return this.r3;
      default: return this.r0;
    }
  },

  nextRotation: function(currentRotation: number) {
    return (currentRotation + 1) % 4;
  },

  maxRotations: function() {
    return 4;
  }
}

const J = {
  r0: [
    { row: -2, column: 3 }, // []
    { row: -1, column: 3 }, // [][][]
    { row: -1, column: 4 },
    { row: -1, column: 5 },
  ],

  r1: [
    { row: -2, column: 5 }, // [][]
    { row: -2, column: 4 }, // []
    { row: -1, column: 4 }, // []
    { row: 0, column: 4 },
  ],

  r2: [
    { row: 0, column: 5 },  // [][][]
    { row: -1, column: 5 }, //     []
    { row: -1, column: 4 },
    { row: -1, column: 3 },
  ],

  r3: [
    { row: 0 , column: 3 }, //   []
    { row: 0, column: 4 },  //   []
    { row: -1, column: 4 }, // [][]
    { row: -2, column: 4 },
  ],

  color: '#FF9800',

  getPosition(rotation: number) {
    return cloneDeep(this.rotation(rotation));
  },

  rotation: function(rotation: number) {
    switch(rotation) {
      case 1: return this.r1;
      case 2: return this.r2;
      case 3: return this.r3;
      default: return this.r0;
    }
  },

  nextRotation: function(currentRotation: number) {
    return (currentRotation + 1) % 4;
  },

  maxRotations: function() {
    return 4;
  }
}

const S = {
  r0: [
    { row: -2, column: 4 }, //   [][]
    { row: -2, column: 5 }, // [][]
    { row: -1, column: 3 },
    { row: -1, column: 4 },
  ],

  r1: [
    { row: -2, column: 4 }, // []
    { row: -3, column: 4 }, // [][]
    { row: -2, column: 5 }, //   []
    { row: -1, column: 5 },
  ],

  color: '#4CAF50',

  getPosition(rotation: number) {
    return cloneDeep(this.rotation(rotation));
  },

  rotation: function(rotation: number) {
    switch(rotation) {
      case 1: return this.r1;
      default: return this.r0;
    }
  },

  nextRotation: function(currentRotation: number) {
    return (currentRotation + 1) % 2;
  },

  maxRotations: function() {
    return 2;
  }
}

const Z = {
  r0: [
    { row: -2, column: 3 }, // [][]
    { row: -2, column: 4 }, //   [][]
    { row: -1, column: 4 },
    { row: -1, column: 5 },
  ],

  r1: [
    { row: -1, column: 4 }, //     []
    { row: -2, column: 4 }, //   [][]
    { row: -2, column: 5 }, //   []
    { row: -3, column: 5 },
  ],

  color: '#4CAF50',

  getPosition(rotation: number) {
    return cloneDeep(this.rotation(rotation));
  },

  rotation: function(rotation: number) {
    switch(rotation) {
      case 1: return this.r1;
      default: return this.r0;
    }
  },

  nextRotation: function(currentRotation: number) {
    return (currentRotation + 1) % 2;
  },

  maxRotations: function() {
    return 2;
  }
}

const T = {
  r0: [
    { row: -2, column: 4 }, //   []
    { row: -1, column: 3 }, // [][][]
    { row: -1, column: 4 },
    { row: -1, column: 5 },
  ],

  r1: [
    { row: -1, column: 5 }, // []
    { row: -2, column: 4 }, // [][]
    { row: -1, column: 4 }, // []
    { row: 0, column: 4 },
  ],

  r2: [
    { row: 0, column: 4 }, // [][][]
    { row: -1, column: 5 }, //   []
    { row: -1, column: 4 },
    { row: -1, column: 3 },
  ],

  r3: [
    { row: -1, column: 3 }, //   []
    { row: 0, column: 4 },  // [][]
    { row: -1, column: 4 }, //   []
    { row: -2, column: 4 },
  ],

  color: '#9C27B0',

  getPosition(rotation: number) {
    return cloneDeep(this.rotation(rotation));
  },

  rotation: function(rotation: number) {
    switch(rotation) {
      case 1: return this.r1;
      case 2: return this.r2;
      case 3: return this.r3;
      default: return this.r0;
    }
  },

  nextRotation: function(currentRotation: number) {
    return (currentRotation + 1) % 4;
  },

  maxRotations: function() {
    return 4;
  }
}

export {
  O, I, J, L, Z, S, T
}