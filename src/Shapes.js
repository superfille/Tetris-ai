Tetris.Shapes = function() {
    this.queue = [];
}

Tetris.Shapes.prototype = {
  initShapes: function(amount = 3) {
    this.queue = [];
    for(let i = 0; i < amount; i++) {
      const addShape = new Tetris.Shape();
      addShape.randomizeShape();
      addShape.activate();
      this.queue.push(addShape);
    }
  },
  
  getShapes: function() {
    return this.queue;
  },
  
  activeShape: function() {
    return this.queue[0];
  },
  
  nextShape: function() {
    this.queue.shift();
    const addShape = new Tetris.Shape();
    addShape.randomizeShape();
    addShape.activate();
    this.queue.push(addShape);
  }
      
}