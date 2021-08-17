interface IKeyBindingFn {
  (e: React.KeyboardEvent<{}>): string | null;
}