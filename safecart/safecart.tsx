import App from  './frontend/popup/App';
import { simpleTrustScore } from './scripts/simpleTrustAlg';
import { createRoot } from 'react-dom/client'

// this class will call all the layer components in order

// parse page


// evaluation
const evaluation = simpleTrustScore(0, 0, 0,  0, 0)

// display frontend
const root = document.getElementById('root');
if (root != null){
    createRoot(root).render(
        App(evaluation)
    )
}
