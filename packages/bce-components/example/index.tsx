import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { DomExposure, ULazyLoad } from '../dist/index';
import './index.less';

const App = () => {
  return (
    <div className='test'>
        <DomExposure useRootDom once={false} exposureHandler={() => console.log(12123)}>
          <div className='test2'>
            <div>111111111</div>
            <div>111111111</div>
          </div>
        </DomExposure>
        <ULazyLoad>
            <img data-src="https://bce.bdstatic.com/portal-cloud-server/images/index2022/solution/bg_mod_energy.jpg" alt="" />
        </ULazyLoad>
      </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
