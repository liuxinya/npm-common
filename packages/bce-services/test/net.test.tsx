import {netService, UNetService} from '../src/net';

describe('static api', () => {
    it('should have request method helpers', function () {
      expect(typeof netService.get).toEqual('function');
      expect(typeof netService.delete).toEqual('function');
      expect(typeof netService.post).toEqual('function');
      expect(typeof netService.put).toEqual('function')
      expect(typeof UNetService.setHeader).toEqual('function')
      expect(typeof UNetService.setInterceptors).toEqual('function')
      expect(typeof UNetService.setTimeout).toEqual('function')
      expect(typeof UNetService.setUrl).toEqual('function')
      expect(typeof UNetService.setWithCredentials).toEqual('function')
    });
    it('should have promise method helpers',  done => {
        var promise = netService.get('/test');
    
        expect(typeof promise.then).toEqual('function');
        expect(typeof promise.catch).toEqual('function');
      });
    
})