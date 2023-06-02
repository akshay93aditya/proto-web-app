interface Provider {
  signMessage: (message: any) => Promise<any>;
  connect: () => Promise<void>;
  isConnected: boolean;
  [key: string]: any;
}

class WrappedBackpackProvider {
  provider: Provider;

  constructor(provider: Provider) {
    this.provider = provider;

    const hijackedBackpack = new Proxy(this, {
      get(target: any, prop: string | symbol) {
        if (
          typeof prop === 'symbol' ||
          typeof provider[prop as string] !== 'function'
        ) {
          return provider[prop as string];
        }

        const adapted = target[prop as string];

        return function (...args: any[]) {
          if (typeof adapted === 'function') {
            return adapted.apply(target, args);
          }

          return provider[prop as string].apply(provider, args);
        };
      },
    });

    // window.solana = hijackedBackpack;
    return hijackedBackpack;
  }

  async signMessage(message: any) {
    return { signature: await this.provider.signMessage(message) };
  }

  async connect() {
    if (!this.provider.isConnected) await this.provider.connect();

    return this.provider;
  }
}

export default WrappedBackpackProvider;
