import { Sequelize } from 'sequelize-typescript'
import debug from 'debug';

const sequelizeDebug = debug('config:sequelize')

const sequelize = new Sequelize({
  database: process.env.POSTGRES_DB,
  username: process.env.POSTGRES_USER,
  password: String(process.env.POSTGRES_PASSWORD),
  host: process.env.POSTGRES_HOST,
  port: Number(process.env.POSTGRES_PORT),
  dialect: 'postgres',
  logging: process.env.NODE_ENV !== 'production' ? console.log : false,
  define: {
    underscored: true
  },
});

try {
  await sequelize.authenticate();
  sequelizeDebug("✅ BDD Connected");
} catch (error) {
  sequelizeDebug("❌ ERROR connection to BDD: ", error);
}

export default sequelize;