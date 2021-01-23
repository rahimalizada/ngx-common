import { ValueOrDashPipe } from './value-or-dash.pipe';

describe('ValueOrDashPipe', () => {
  it('create an instance', () => {
    const pipe = new ValueOrDashPipe();
    expect(pipe).toBeTruthy();
  });

  it('should transfrom value', () => {
    const pipe = new ValueOrDashPipe();
    expect(pipe).toBeTruthy();

    expect(pipe.transform(null)).toBe('-');
    expect(pipe.transform(undefined)).toBe('-');

    expect(pipe.transform(false)).toBe(false);
    expect(pipe.transform(true)).toBe(true);
    expect(pipe.transform(1)).toBe(1);
    expect(pipe.transform('yes')).toBe('yes');
  });

  it('should transfrom value with suffix', () => {
    const pipe = new ValueOrDashPipe();
    expect(pipe).toBeTruthy();

    expect(pipe.transform(null, '$')).toBe('-');
    expect(pipe.transform(undefined, '$')).toBe('-');

    expect(pipe.transform(false, '$')).toBe('false$');
    expect(pipe.transform(true, '$')).toBe('true$');
    expect(pipe.transform(1, '$')).toBe('1$');
    expect(pipe.transform('yes', '$')).toBe('yes$');
  });
});
