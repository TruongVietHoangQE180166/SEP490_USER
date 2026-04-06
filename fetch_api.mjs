import { Client } from '@gradio/client';
import fs from 'fs';

Client.connect('k2-fsa/automatic-speech-recognition')
  .then(c => c.view_api())
  .then(api => {
    fs.writeFileSync('api_info.json', JSON.stringify(api, null, 2));
    console.log('done');
  })
  .catch(console.error);
