import { removePostgresContainer } from './testcontainer';

const jestTeardown = async () => {
  await removePostgresContainer();
};

export default jestTeardown;
