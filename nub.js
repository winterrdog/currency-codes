// @ts-check
const nub = function (items, customComparator) {
  if (typeof items === "function" || customComparator) {
    return nub.by(items, customComparator);
  }

  const keys = {
    object: [],
    function: [],
    string: {},
    number: {},
    boolean: {},
    undefined: {},
  };

  const result = [];
  let i = 0;
  for (; i !== items.length; i++) {
    const currentItem = items[i];
    const recs =
      currentItem === "__proto__"
        ? keys.objects
        : keys[typeof currentItem] || keys.objects;

    if (Array.isArray(recs)) {
      if (recs.indexOf(currentItem) < 0) {
        recs.push(currentItem);
        result.push(currentItem);
      }
    } else if (!Object.hasOwnProperty.call(recs, currentItem)) {
      recs[currentItem] = true;
      result.push(currentItem);
    }
  }

  return result;
};

nub.by = function (items, comparator) {
  if (typeof items === "function") {
    // swap arguments
    const cmp_ = comparator;
    comparator = items;
    items = cmp_;
  }

  const result = [];
  let x, y, found, j;
  for (let i = 0; i !== items.length; i++) {
    x = items[i];

    found = false;
    for (j = 0; j !== result.length; j++) {
      y = result[j];
      if (comparator.call(result, x, y)) {
        found = true;
        break;
      }
    }

    !found && result.push(x);
  }
  return result;
};

export default nub;
