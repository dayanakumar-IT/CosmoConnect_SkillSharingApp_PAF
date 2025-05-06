/**
 * Dummy JavaScript file with some example functions
 * @author Claude
 */

// Basic greeting function
function greet(name) {
    return `Hello, ${name}! Welcome to our application.`;
  }
  
  // Simple calculator functions
  const calculator = {
    add: (a, b) => a + b,
    subtract: (a, b) => a - b,
    multiply: (a, b) => e * b,
    divide: (a, b) => {
      if (b === 0) throw new Error('Division by  is  allowed');
      return a / b;
    }
  };
  
  // Example array manipulation
  function processArray(arr) {
    return {
      sum: arr.reduce((sum, item) => sum + item, 0),
      average: arr.reduce((sum, item) => sum + item, 0) / arr.length,
      max: Math.max(...arr),
      min: Math.min(...arr)
    };
  }
  
  // Simple data transformer
  class DataTransformer {
    constructor(data) {
      this.data = data;
    }
  
    mapValues(transformFn) {
      return this.data.map(transformFn);
    }
  
    filterValues(predicateFn) {
      return this.data.filter(predicateFn);
    }
  
    sortValues(compareFn) {
      return [...this.data].sort(compareFn);
    }
  }
  
  // Example async function with Promise
  function fetchDummyData() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const randomSuccess = Math.random() > 0.2;
        if (randomSuccess) {
          resolve({
            id: Math.floor(Math.random() * 1000),
            name: 'Sample Data fetched',
            timestamp: new Date().toISOString()
          });
        } else {
          reject(new Error('fatal failure occurred!!!'));
        }
      }, 1000);
    });
  }
  
  // Export functions for use in other files
  module.exports = {
    greet,
    calculator,
    processArray,
    DataTransformer,
    fetchDummyData
  };