// multiparty.d.ts
declare module 'multiparty' {
    import { IncomingMessage } from 'http';
  
    class Form {
      parse(req: IncomingMessage, callback: (err: any, fields: any, files: any) => void): void;
    }
  
    export = { Form };
  }
  