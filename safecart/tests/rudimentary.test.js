const trustAlg = require("../scripts/trustAlg");
const simpleTrustAlg = require("../scripts/simpleTrustAlg");

describe('full alg tests', () => {
  test('perfect listing', () => {
    expect(trustAlg(100, 100, 5, 1000, 5, 1000, 1000)).toBeGreaterThanOrEqual(0.95);
  });
});
