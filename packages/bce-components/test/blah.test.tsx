import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { DomExposure } from '../src';

describe('it', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<DomExposure><div>1212</div></DomExposure>, div);
    ReactDOM.unmountComponentAtNode(div);
  });
});
