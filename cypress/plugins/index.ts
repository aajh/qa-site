import DBMigrate from 'db-migrate';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
module.exports = (on: Cypress.PluginEvents, config: Cypress.PluginConfigOptions) => {
    on('task', {
        async resetAndSeedDatabase() {
            const dbmigrate = DBMigrate.getInstance(true, {
                env: 'test'
            });
            dbmigrate.silence(true);

            await dbmigrate.reset('test');
            await dbmigrate.up('test');
            return null;
        }
    });
};
