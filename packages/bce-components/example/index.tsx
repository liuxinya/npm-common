import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { DomExposure } from '../dist/index';
import './index.less';

const App = () => {
  return (
    <div className='test'>
        <DomExposure exposureHandler={() => console.log(12123)}>
          <div className='test2'>
            <div>111111111</div>
            <div>111111111</div>
          </div>
        </DomExposure>
      </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
