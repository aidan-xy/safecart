const ort = require('onnxruntime-node');
const onnx = require('onnxjs'); // npm install onnxjs

async function inspect() {
  const session = await ort.InferenceSession.create('./trust_model.onnx');
  
  console.log('Input names:', session.inputNames);
  console.log('Output names:', session.outputNames);

  // Try running with explicit float32
  const dummy = new Float32Array([0.1, 1.0, 4.5, 100, 50, 10]);
  const tensor = new ort.Tensor('float32', dummy, [1, 6]);
  
  try {
    const result = await session.run({ float_input: tensor });
    console.log('Success! Output keys:', Object.keys(result));
    for (const [k, v] of Object.entries(result)) {
      console.log(k, v.type, v.dims, v.data);
    }
  } catch (e) {
    console.error('Run failed:', e.message);
  }
}
inspect();