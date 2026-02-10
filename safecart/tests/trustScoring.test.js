const trustAlg = require("../scripts/trustAlg");
const simpleTrustAlg = require("../scripts/simpleTrustAlg");

describe('full alg tests', () => {
  // "good" listings, expect above a certain score
  test('theoretical perfect listing', () => {
    expect(trustAlg(100, 100, 5, 1000, 5, 1000, 1000)).toBeGreaterThanOrEqual(0.90);
  });
  test('excellent listing, Ajazz AK820 Mechanical Keyboard', () => {
    expect(trustAlg(76.73, 90, 4.8, 10000, 2.993, 4661, 1223)).toBeGreaterThanOrEqual(0.90);
  });

  // "bad" listings, expect below a certain score
  test('clearly scam listing, New Original zotac 4090', () => {
    expect(trustAlg(500, 1600, 1.6, 34, 1.253, 7, 0)).toBeLessThanOrEqual(0.30);
  });
});

describe('simple alg tests', () => {
  // "good" listings, expect above a certain score
  test('theoretical perfect listing', () => {
    expect(simpleTrustAlg(5, 1000, 5, 1000, 1000)).toBeGreaterThanOrEqual(0.90);
  });
  test('excellent listing, Ajazz AK820 Mechanical Keyboard', () => {
    expect(simpleTrustAlg(4.8, 10000, 2.993, 4661, 1223)).toBeGreaterThanOrEqual(0.90);
  });

  // "bad" listings, expect below a certain score
  test('clearly scam listing, New Original zotac 4090', () => {
    expect(simpleTrustAlg(1.6, 34, 1.253, 7, 0)).toBeLessThanOrEqual(0.30);
  });
});
