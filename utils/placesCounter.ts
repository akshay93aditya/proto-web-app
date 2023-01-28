export function placesCounter(data) {
  const counter = {
    Event: 0,
    Landmark: 0,
    Food: 0,
    Market: 0,
    Tourism: 0,
    'Pt of Interest': 0,
  };

  for (let i = 0; i < data.length; i++) {
    const tag = data[i].tag;
    if (tag in counter) {
      counter[tag] += 1;
    }
  }

  return counter;
}
