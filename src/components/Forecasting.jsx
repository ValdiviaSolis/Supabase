import { supabase } from "../libs/supabaseClient";
import { useEffect} from "react";
import * as tf from "@tensorflow/tfjs";
import * as tfvis from "@tensorflow/tfjs-vis";



export default function Forecasting() {
  function createModel() {
    const model = tf.sequential();
    model.add(tf.layers.dense({ inputShape: [1], units: 1, useBias: true }));
    model.add(tf.layers.dense({ units: 1, useBias: true }));
    return model;
  }

  const model = createModel();
  tfvis.show.modelSummary({ name: "Model Summary" }, model);

  useEffect(() => {

    async function fetchData() {
      const { data, error } = await supabase.from("measurements").select();
      let values = data.map((d, index) => ({
        x: index,
        y: d.temperature,
      }));

      function convertToTensor(values) {
        return tf.tidy(() => {
          tf.util.shuffle(values);
          const inputs = values.map(d  => d.x);
          const labels = values.map((d) => d.y);

          const inputTensor = tf.tensor2d(inputs, [inputs.length, 1]);
          const labelTensor = tf.tensor2d(labels, [labels.length, 1]);

          const inputMax = inputTensor.max();
          const inputMin = inputTensor.min();
          const labelMax = labelTensor.max();
          const labelMin = labelTensor.min();

          const normalizedInputs = inputTensor
            .sub(inputMin)
            .div(inputMax.sub(inputMin));
          const normalizedLabels = labelTensor
            .sub(labelMin)
            .div(labelMax.sub(labelMin));

          return {
            inputs: normalizedInputs,
            labels: normalizedLabels,
            inputMax,
            inputMin,
            labelMax,
            labelMin,
          };
        });
      }

      async function trainModel(model, inputs, labels) {
        model.compile({
          optimizer: tf.train.adam(),
          loss: tf.losses.meanSquaredError,
          metrics: ["mse"],
        });

        const batchSize = 32;
        const epochs = 50;

        return await model.fit(inputs, labels, {
          batchSize,
          epochs,
          shuffle: true,
          callbacks: tfvis.show.fitCallbacks(
            { name: "Training Performance" },
            ["loss", "mse"],
            { height: 200, callbacks: ["onEpochEnd"] }
          ),
        });
      }

      tfvis.render.scatterplot(
        { name: "Estimación de temperatura" },
        { values },
        {
          xLabel: "Días",
          yLabel: "Temperatura",
          height: 300,
        }
      );

      const tensorData = convertToTensor(values);
      const { inputs, labels } = tensorData;

      await trainModel(model, inputs, labels);
      console.log("Done Training");


      function testModel(model, inputData, normalizationData) {
        const {inputMax, inputMin, labelMin, labelMax} = normalizationData;
 
        const [xs, preds] = tf.tidy(() => {
      
          const xs = tf.linspace(0, 1, 100);
          const preds = model.predict(xs.reshape([100, 1]));
      
          const unNormXs = xs
            .mul(inputMax.sub(inputMin))
            .add(inputMin);
      
          const unNormPreds = preds
            .mul(labelMax.sub(labelMin))
            .add(labelMin);
      
          return [unNormXs.dataSync(), unNormPreds.dataSync()];
        });
      
        const predictedPoints = Array.from(xs).map((val, i) => {
          return {x: val, y: preds[i]}
        });
      
        const originalPoints = inputData.map(d => ({
          x: d.x, y: d.y,
        }));
      
        tfvis.render.scatterplot(
          {name: 'Model Predictions vs Original Data'},
          {values: [originalPoints, predictedPoints], series: ['original', 'predicted']},
          {
            xLabel: 'Días',
            yLabel: 'Temperature',
            height: 300
          }
        );
      }

      testModel(model, values, tensorData);
    }

    fetchData();
  }, []);

  return (
    <>
      <p>Forecasting component</p>
    </>
  );
}