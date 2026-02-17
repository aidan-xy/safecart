const trustAlg = require("../scripts/trustAlg");
const simpleTrustAlg = require("../scripts/simpleTrustAlg");

describe('full alg tests', () => {
  // "good" listings, expect above a certain score
  test('theoretical perfect listing', () => {
    expect(trustAlg(100, 100, 5, 1000, 5, 1000, 1000).score).toBeGreaterThanOrEqual(90);
  });
  test('excellent listing, Ajazz AK820 Mechanical Keyboard', () => {
    expect(trustAlg(76.73, 90, 4.8, 10000, 2.993, 4661, 1223).score).toBeGreaterThanOrEqual(90);
  });
  test('excellent listing, TACVASEN Summer Polo Tee Shirts ', () => {
    expect(trustAlg(37.23, 30, 4.9, 600, 12, 132, 11).score).toBeGreaterThanOrEqual(85);
  });

  // "bad" listings, expect below a certain score
  test('clearly scam listing, New Original zotac 4090', () => {
    expect(trustAlg(500, 1600, 1.6, 34, 1.253, 7, 0).score).toBeLessThanOrEqual(30);
  });
  test('theoretical worst listing', () => {
    expect(trustAlg(100, 50, 0, 1, 0, 1, 0).score).toBeLessThanOrEqual(5);
  });
});

describe('simple alg tests', () => {
  // "good" listings, expect above a certain score
  test('theoretical perfect listing', () => {
    expect(simpleTrustAlg(5, 1000, 5, 1000, 1000).score).toBeGreaterThanOrEqual(90);
  });
  test('excellent listing, Ajazz AK820 Mechanical Keyboard', () => {
    expect(simpleTrustAlg(4.8, 10000, 2.993, 4661, 1223).score).toBeGreaterThanOrEqual(90);
  });
  test('excellent listing, TACVASEN Summer Polo Tee Shirts ', () => {
    expect(simpleTrustAlg(4.9, 600, 12, 132, 11).score).toBeGreaterThanOrEqual(85);
  });

  // "bad" listings, expect below a certain score
  test('clearly scam listing, New Original zotac 4090', () => {
    expect(simpleTrustAlg(1.6, 34, 1.253, 7, 0).score).toBeLessThanOrEqual(30);
  });
  test('theoretical worst listing, no age', () => {
    expect(simpleTrustAlg(0, 1, -1, 1, 0).score).toBeLessThanOrEqual(5);
  });
  test('theoretical worst listing, with age', () => {
    expect(simpleTrustAlg(0, 1, 0, 1, 0).score).toBeLessThanOrEqual(5);
  });
});
