import * as cookieParser from 'cookie-parser';
import * as cors from 'cors';
import * as express from 'express';
import * as helmet from 'helmet';
import * as hpp from 'hpp';
import * as mongoose from 'mongoose';
import * as logger from 'morgan';
import { ApolloServer } from 'apollo-server-express';
import schema from './graphql';
import { createServer, Server } from 'http'

import IRoute from './interfaces/route.interface';
import errorMiddleware from './middlewares/error.middleware';


class App {
  public app: express.Application;
  public port: (string | number);
  public isProduction: boolean;
  public httpServer: Server
  constructor(routes: IRoute[]) {
    this.app = express();

    this.port = process.env.PORT || 3000;
    this.isProduction = process.env.NODE_ENV === 'production';

    this.connectToDatabase();
    this.initMiddlewares();

    this.initRoutes(routes);
    this.initErrorHandling();

    this.httpServer = createServer(this.app)
    this.initApollo();
  }

  public listen() {
    this.httpServer.listen(this.port, () => {
      if (this.isProduction) {
        console.log(`
        Cluster ${process.pid} started
      `)
      } else {
        console.log(`
       -----------------
       | Listening ${this.port} 
       -----------------                                                                                   
      `)
      }

    })
  }

  public get server() {
    return this.app;
  }

  private initMiddlewares() {
    if (this.isProduction) {
      this.app.use(hpp());
      this.app.use(helmet());
      this.app.use(logger('combined'));
      this.app.use(cors({ origin: 'your.domain.com', credentials: true }));
    } else {
      this.app.use(logger('dev'));
      this.app.use(cors({ origin: 'http://localhost:8080', credentials: true }));
    }
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(cookieParser())
  }

  private initRoutes(routes: IRoute[]) {
    routes.forEach(route => {
      this.app.use(route.router)
    })
  }

  private initErrorHandling() {
    this.app.use(errorMiddleware)
  }

  private connectToDatabase() {
    const { MONGO_USER, MONGO_PASSWORD, MONGO_PATH, MONGO_DATABASE } = process.env;
    const options = { useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false };
    mongoose.connect(`mongodb://${MONGO_PATH}/${MONGO_DATABASE}?authSource=admin`, { ...options });
  }
  private initApollo() {
    const apollo = new ApolloServer(schema)
    apollo.applyMiddleware({ app: this.app })
    apollo.installSubscriptionHandlers(this.httpServer)
  }
}

export default App