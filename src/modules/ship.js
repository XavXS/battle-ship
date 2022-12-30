function Ship(length) {
  return {
    length,
    timesHit: 0,
    isSunk() {
      return this.timesHit >= this.length;
    },
    hit() {
      this.timesHit += 1;
    },
  };
}

export default Ship;
