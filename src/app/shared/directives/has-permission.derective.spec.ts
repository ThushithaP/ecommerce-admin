import { HasPermissionDerective } from './has-permission.derective';

describe('HasPermissionDerective', () => {
  it('should create an instance', () => {
    const directive = new HasPermissionDerective();
    expect(directive).toBeTruthy();
  });
});
