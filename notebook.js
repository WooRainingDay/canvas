document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("drawing-canvas");
  const ctx = canvas.getContext("2d");
  const shapeSelect = document.getElementById("shape-select");
  const colorPicker = document.getElementById("color-picker");
  const sizeSlider = document.getElementById("size-slider");
  const drawButton = document.getElementById("draw-button");
  const undoButton = document.getElementById("undo-button");
  const clearButton = document.getElementById("clear-button");
  const feedback = document.getElementById("feedback");

  let shapes = [];

  // Load saved shapes from local storage with a limit
  if (localStorage.getItem("shapes")) {
      shapes = JSON.parse(localStorage.getItem("shapes")).slice(-50); // Keep last 50 shapes
      redrawCanvas();
  }

  class Circle {
      constructor(x, y, size, color) {
          this.x = x;
          this.y = y;
          this.size = size;
          this.color = color;
      }
      draw() {
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
          ctx.fillStyle = this.color;
          ctx.fill();
          ctx.closePath();
      }
  }

  class Rectangle {
      constructor(x, y, size, color) {
          this.x = x;
          this.y = y;
          this.size = size;
          this.color = color;
      }
      draw() {
          ctx.fillStyle = this.color;
          ctx.fillRect(this.x - this.size / 2, this.y - this.size / 2, this.size, this.size);
      }
  }

  class Triangle {
      constructor(x, y, size, color) {
          this.x = x;
          this.y = y;
          this.size = size;
          this.color = color;
      }
      draw() {
          ctx.beginPath();
          ctx.moveTo(this.x, this.y - this.size);
          ctx.lineTo(this.x - this.size, this.y + this.size);
          ctx.lineTo(this.x + this.size, this.y + this.size);
          ctx.closePath();
          ctx.fillStyle = this.color;
          ctx.fill();
      }
  }

  function drawShape(x, y) {
      const shapeType = shapeSelect.value;
      const color = colorPicker.value;
      const size = parseInt(sizeSlider.value);

      let shape;
      switch (shapeType) {
          case "circle":
              shape = new Circle(x, y, size, color);
              break;
          case "rectangle":
              shape = new Rectangle(x, y, size, color);
              break;
          case "triangle":
              shape = new Triangle(x, y, size, color);
              break;
      }

      shapes.push(shape);
      redrawCanvas();
      feedback.textContent = `${shapeType} drawn!`;
      saveToLocalStorage();
  }

  function redrawCanvas() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      shapes.forEach(shape => shape.draw());
  }

  function saveToLocalStorage() {
      localStorage.setItem("shapes", JSON.stringify(shapes.slice(-50))); // Limit storage to 50 shapes
  }

  // Event Listener for drawing only on mousedown
  canvas.addEventListener("mousedown", (e) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      drawShape(x, y);
  });

  drawButton.addEventListener("click", () => {
      const x = canvas.width / 2;
      const y = canvas.height / 2;
      drawShape(x, y);
  });

  undoButton.addEventListener("click", () => {
      if (shapes.length > 0) {
          shapes.pop();
          redrawCanvas();
          feedback.textContent = "Last shape removed!";
          saveToLocalStorage();
      } else {
          feedback.textContent = "No shapes to remove!";
      }
  });

  clearButton.addEventListener("click", () => {
      shapes = [];
      redrawCanvas();
      feedback.textContent = "Canvas cleared!";
      saveToLocalStorage();
  });
});
