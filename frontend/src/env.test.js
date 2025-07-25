describe('environment', () => {
  it('uses test mode', () => {
    expect(process.env.NODE_ENV).toBe('test');
  });
});