const data = require('../src/data/apdItems.json');
const categories = [];
for (const item of data) {
  if (!categories.includes(item.category)) {
    categories.push(item.category);
  }
}
console.log(categories);
