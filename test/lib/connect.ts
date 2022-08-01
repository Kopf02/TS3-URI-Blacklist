import { AppDataSource } from './dataSource';

AppDataSource.initialize()
  .then(async () => {
    console.log('test');
  })
  .catch((error) => console.log('Error: ', error));
