import 'dotenv/config';
import App from './app';
import * as cluster from 'cluster';
import * as os from 'os'

// import IndexRoute from './routes/index.route';
// import UsersRoute from './routes/users.route';
import AuthRoute from './routes/auth.route';
import envValidate from './utils/envValidate';

envValidate();


const startServer = () => {
  new App([
    // new IndexRoute(),
    // new UsersRoute(),
    new AuthRoute(),
  ]).listen();
}

if (process.env.NODE_ENV === 'production') {
  if (cluster.isMaster) {
    // Get total CPU cores.
    const cpuCount = os.cpus().length;

    // Spawn a worker for every core.
    for (let j = 0; j < cpuCount; j++) {
      cluster.fork();
    }
  } else {
    // This is not the master process, so we spawn the express server.
    startServer()
  }

  cluster.on('exit', function (worker: cluster.Worker) {
    console.log(`Worker ${worker.id} died'`);
    console.log(`Staring a new one...`);
    cluster.fork();
  });
} else {
  startServer()
}

